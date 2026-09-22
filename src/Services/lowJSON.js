import { JSONFilePreset } from "lowdb/node";
import config from "../config/index.js";
import path from "node:path";
import { STATUS } from "../Utils/enum.js";
let db = null;

export async function initdb() {
  try {
    const filePath = path.join(config.db.path, config.db.filename);
    const data = await JSONFilePreset(filePath, {
      sales: [],
      employee: [],
      products: [],
    });
    db = data;
    console.log("SUCCESS LOAD DATA JSON");
    return data;
  } catch (err) {
    console.log(err?.message);
    return null;
  }
}

export function getData() {
  return db?.data;
}

export async function insertData(collection, newData) {
  if (db) {
    try {
      db.data[collection]?.push(newData);
      await db.write();
      return db.data[collection];
    } catch (err) {
      console.log(err?.message);
    }
  } else {
    console.log("ERROR DN NOT INIT");
    return null;
  }
}

export function getDetailInvoice(invoiceID) {
  if (db) {
    try {
      const res = db.data?.sales.find(
        (data) => data.invoiceID === Number(invoiceID),
      );
      return res;
    } catch (err) {}
  }
}

export function findLastProcessInvoice() {
  if (db) {
    try {
      const res = db.data?.sales.find((data) => data.status === STATUS.PROCESS);
      return res;
    } catch (err) {}
  }
}

export function findPickingInvoice(pickname) {
  if (db) {
    try {
      const res = db.data?.sales.find(
        (data) =>
          data.status === STATUS.PICKING && data.pickerName === pickname,
      );
      return res;
    } catch (err) {}
  }
}

export async function updateInvoice(newData, invoiceID, index = null) {
  if (db) {
    try {
      let indexInvoice = index;
      if (index == null) {
        indexInvoice = db.data?.sales.findIndex(
          (data) => data.invoiceID === Number(invoiceID),
        );
      }

      db.data.sales[indexInvoice] = {
        ...db.data.sales[indexInvoice],
        ...newData,
      };
      await db.write();
      return db.data.sales[indexInvoice];
    } catch (err) {}
  }
}

export function getBarcodeItem(pid) {
  if (db) {
    try {
      const res = db.data?.products.find((data) => data.pid === Number(pid));
      return res.barcode;
    } catch (err) {}
  }
}

export function findProductName(pid) {
  if (db) {
    try {
      const res = db.data?.products.find((data) => data.pid === Number(pid));
      return res.name;
    } catch (err) {}
  }
}
