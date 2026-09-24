export const invoiceSchema = {
  status: {
    source: "status",
  },
  source: {
    source: "source",
  },
  item: {
    source: "item",
  },
  sourceInvoiceID: {
    source: "sourceInvoice?D",
  },
  invoiceID: {
    source: "invoiceID",
  },
};
