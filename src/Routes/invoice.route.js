import express from "express";
import {
  getInvoiceProcess,
  findNewProcessInvoice,
  pendingPickingInvocie,
  updateItemPickStatus,
  printInvoiceWithCheck,
} from "../Controllers/invoice.controller.js";
import validate from "../middleware/validate.middleware.js";
import {
  checkItemSchema,
  pendingPickingSchema,
  checkPrint,
} from "../schema/invoice.joi.schema.js";

const invoiceRouter = express.Router();

invoiceRouter.get("/getinvoicedata", getInvoiceProcess);
invoiceRouter.get("/newinvoice", findNewProcessInvoice);
invoiceRouter.get(
  "/pendingpicking",
  validate(pendingPickingSchema),
  pendingPickingInvocie,
);
invoiceRouter.post(
  "/checkitem",
  validate(checkItemSchema),
  updateItemPickStatus,
);

invoiceRouter.post(
  "/printinvoice",
  validate(checkPrint),
  printInvoiceWithCheck,
);

export default invoiceRouter;
