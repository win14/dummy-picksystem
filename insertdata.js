import {
  initdb,
  getDetailInvoice,
  getBarcodeItem,
} from "./src/Services/lowJSON.js";

async function test() {
  await initdb();
  console.log(getDetailInvoice("2026074299"));
  console.log(getBarcodeItem(1));
}
test();
