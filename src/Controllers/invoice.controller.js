import {
  getDetailInvoice,
  updateInvoice,
  findPickingInvoice,
  findLastProcessInvoice,
  getBarcodeItem,
} from "../Services/lowJSON.js";
import { HTTP_STATUS, STATUS } from "../Utils/enum.js";
import { transformOutput } from "../Utils/utils.js";
import { invoiceSchema, itemSchema } from "../schema/invoice.output.schema.js";

export async function getInvoiceProcess(req, res) {
  //check if request is manual (with invoiceID or without invoiceID)
  const invoiceID = req.body?.invoiceID;
  const pickerName = req.body?.pickerName;
  if (!pickerName) {
    console.log(`[INVOICE] pickerName field is required`);
    res.status(HTTP_STATUS.BAD_REQUEST).json({});
    return;
  }
  if (invoiceID) {
    const output = getDetailInvoice(invoiceID);
    if (output) {
      // pastikan status process atau picking jika bukan jangan di prosess
      if ([STATUS.PROCESS, STATUS.PICKING].includes(output.status) === false) {
        console.log(
          `[INVOICE] ${output.invoiceID} status is not process but ${output.status}`,
        );
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
        return;
      }

      // check if have assign
      if (output.pickerName && output.pickerName != pickerName) {
        console.log(
          `[INVOICE] ${output.invoiceID} picker name tidak sesuai, picker name sebelumnya : ${output.pickerName} , picker di request. : ${pickerName}`,
        );
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
        return;
      }
      //update picker name dan timestamp start pick
      const newData = await updateInvoice(
        {
          pickerName: pickerName,
          pickStartTime: new Date(),
          status: STATUS.PICKING,
        },
        invoiceID,
      );
      res
        .status(HTTP_STATUS.SUCCESS)
        .json(transformOutput(newData, invoiceSchema));
    } else {
      console.log(`[INVOICE] ${invoiceID} is not found`);
      res.status(HTTP_STATUS.NOT_FOUND).json({});
    }
  } else {
    console.log(`[INVOICE] invoiceID field is requeired`);
    res.status(HTTP_STATUS.BAD_REQUEST).json({});
  }
}

export async function findNewProcessInvoice(req, res) {
  const { pickerName } = req.body;
  if (!pickerName) {
    console.log(`[INVOICE] pickername field is cannot empty or null`);
    res.status(HTTP_STATUS.BAD_REQUEST).json({});
    return;
  }
  const oldInvoice = findPickingInvoice(pickerName);
  if (oldInvoice) {
    console.log(
      `[INVOICE] Invoice lama ditemukan, invoiceID : ${oldInvoice.invoiceID} picker di request. : ${pickerName}`,
    );
    res
      .status(HTTP_STATUS.SUCCESS)
      .send(transformOutput(oldInvoice, invoiceSchema));
  } else {
    //old invoice is not found, check lastesd process
    const newInvoice = findLastProcessInvoice();
    if (newInvoice) {
      console.log(
        `[INVOICE] Invoice ${newInvoice.invoiceID} assign ke ${pickerName}`,
      );
      const newData = await updateInvoice(
        {
          pickerName: pickerName,
          pickStartTime: new Date(),
          status: STATUS.PICKING,
        },
        newInvoice.invoiceID,
      );
      res
        .status(HTTP_STATUS.SUCCESS)
        .send(transformOutput(newData, invoiceSchema));
    } else {
      console.log(`[INVOICE] no invoice with status PROCESS is found`);
      res.status(HTTP_STATUS.SUCESS_NO_DATA).json({});
    }
  }
}
export async function pendingPickingInvocie(req, res) {
  const { invoiceID, pickerName } = req.body;
  if (invoiceID || pickerName) {
    //get detail invoice
    const currentInvoice = getDetailInvoice(invoiceID);
    if (currentInvoice) {
      //check picker name
      if ([pickerName, "admin"].includes(currentInvoice.pickerName) == false) {
        // picker name tidak sama dengan name terdaftar
        console.log(
          `[INVOICE] ${pickerName} tidak sesuai dengan yg ada di invoice`,
        );
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
        return;
      } else {
        //check status invoice
        if (currentInvoice.status != STATUS.PICKING) {
          // status is not picking cannot pending
          console.log(
            `[INVOICE] status saat ini adalah ${currentInvoice.status}  bukan picking, tidak bisa melakukan cancel picking`,
          );
          res.status(HTTP_STATUS.BAD_REQUEST).json({});
          return;
        }
        //uncheck items
        if (currentInvoice.item && Array.isArray(currentInvoice.item)) {
          currentInvoice.item = currentInvoice.item.map((eachItem) => {
            return {
              ...eachItem,
              pickStatus: false,
              pickTime: null,
            };
          });
        }
        //update picknername, date, status to created
        const newdata = {
          ...currentInvoice,
          pickerName: null,
          pickStartTime: null,
          status: STATUS.CREATED,
        };
        const newRes = await updateInvoice(newdata, invoiceID);
        res
          .status(HTTP_STATUS.SUCCESS)
          .json(transformOutput(newRes, invoiceSchema));
      }
    } else {
      // invoice not found
      console.log(`[INVOICE] ${invoiceID} tidak ditemukan`);
      res.status(HTTP_STATUS.NOT_FOUND).json({});
    }
  } else {
    //bad request invoiceID or pickerName not found
    console.log(`[INVOICE] field invoiceID atau pickerName mandatory`);
    res.status(HTTP_STATUS.BAD_REQUEST).json({});
  }
}

export async function updateItemPickStatus(req, res) {
  const { invoiceID, pickerName, barcode, pid } = req.body;

  const invoiceDetail = getDetailInvoice(invoiceID);
  if (invoiceDetail) {
    if (invoiceDetail.status != STATUS.PICKING) {
      console.log(`[INVOICE][${invoiceID}] Status di invoice bukan PICKING`);
      res.status(HTTP_STATUS.BAD_REQUEST).json({});
      return;
    }
    if (invoiceDetail.pickerName == pickerName) {
      if (invoiceDetail.item && Array.isArray(invoiceDetail.item)) {
        const items = invoiceDetail.item || [];
        const checkItemIndex = items.reduce((acc, item, index) => {
          if (item.pid == pid) {
            acc.push(index);
          }
          return acc;
        }, []);
        if (checkItemIndex.length > 0) {
          const barcodeItem = getBarcodeItem(pid);
          if (barcodeItem == barcode) {
            //update status itemnya
            for (let i = 0; i < checkItemIndex.length; i++) {
              const indexItem = checkItemIndex[i];
              items[indexItem] = {
                ...items[indexItem],
                pickStatus: true,
                pickTime: new Date(),
              };
              invoiceDetail.item = items;
              const resp = await updateInvoice(invoiceDetail, invoiceID);
              const addData = items.reduce(
                (acc, item, index) => {
                  if (item.pickStatus === true) {
                    acc.counterPick++;
                    acc.pidPick.push(item.pid);
                  } else {
                    acc.counterNotPick++;
                    acc.pidNotPick.push(item.pid);
                  }
                  return acc;
                },
                {
                  counterPick: 0,
                  counterNotPick: 0,
                  pidNotPick: [],
                  pidPick: [],
                },
              );

              if (addData.counterPick == items.length) {
                res
                  .status(HTTP_STATUS.SUCCESS_COMPLETED)
                  .json(transformOutput({ ...resp, ...addData }, itemSchema));
              } else {
                res
                  .status(HTTP_STATUS.SUCCESS)
                  .json(transformOutput({ ...resp, ...addData }, itemSchema));
              }
            }
          } else {
            //barocde tidak sama
            console.log(
              `[INVOICE][${invoiceID}] barcode ${barcode} tidak sama dengan yg terdaftar di product`,
            );
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
          }
        } else {
          //pid not found
          // item kosong
          console.log(
            `[INVOICE][${invoiceID}] PID ${pid} tidak ditemukan didalam invoice`,
          );
          res.status(HTTP_STATUS.NOT_FOUND).json({});
        }
      } else {
        // item kosong
        console.log(
          `[INVOICE][${invoiceID}] ${pickerName} item di invoice kosong`,
        );
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
      }
    } else {
      // picker not same
      console.log(
        `[INVOICE][${invoiceID}] ${pickerName} tidak sama dengan yg di invoice`,
      );
      res.status(HTTP_STATUS.BAD_REQUEST).json({});
    }
  } else {
    //invoice not found
    console.log(`[INVOICE] Invoice Nomor : ${invoiceID} tidak ditemukan`);
    res.status(HTTP_STATUS.NOT_FOUND).json({});
  }
}
