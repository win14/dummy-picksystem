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

export function getProcessInvoice() {
  if (db) {
    try {
      const res = db.data?.sales.find((data) => data.status === STATUS.PROCESS);
      return res;
    } catch (err) {}
  }
}

export async function updateInvoice(newData, invoiceID) {
  if (db) {
    try {
      const index = db.data?.sales.findIndex(
        (data) => data.invoiceID === Number(invoiceID),
      );
      res.data.sales[index] = { ...res.data.sales[index], newData };
      await db.write();
      return res.data.sales[index];
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
