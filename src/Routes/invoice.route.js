import express from "express";
import {
  getInvoiceProcess,
  findNewProcessInvoice,
  pendingPickingInvocie,
} from "../Controllers/invoice.controller.js";

const invoiceRouter = express.Router();

invoiceRouter.get("/getinvoicedata", getInvoiceProcess);
invoiceRouter.get("/newinvoice", findNewProcessInvoice);
invoiceRouter.get("/pendingpicking", pendingPickingInvocie);

export default invoiceRouter;
