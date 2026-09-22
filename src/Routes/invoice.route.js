import express from "express";
import {
  getInvoiceProcess,
  findNewProcessInvoice,
  pendingPickingInvocie,
  updateItemPickStatus,
} from "../Controllers/invoice.controller.js";
import validate from "../middleware/validate.middleware.js";
import {
  checkItemSchema,
  pendingPickingSchema,
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

export default invoiceRouter;
