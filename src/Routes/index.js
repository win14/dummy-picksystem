import express from "express";
import invoiceRouter from "./invoice.route.js";

const apiroute = express.Router();

apiroute.use("/invoice", invoiceRouter);

export { apiroute };
