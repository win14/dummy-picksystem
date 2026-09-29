import Joi from "joi";

const checkItemSchema = Joi.object({
  invoiceID: Joi.string().min(10).required(),
  pickerName: Joi.string().required(),
  barcode: Joi.string().required(),
  pid: Joi.number().required(),
});

const pendingPickingSchema = Joi.object({
  invoiceID: Joi.string().min(10).required(),
  pickerName: Joi.string().required(),
});

const checkPrint = Joi.object({
  invoiceID: Joi.string().min(10).required(),
});

export { checkItemSchema, pendingPickingSchema, checkPrint };
