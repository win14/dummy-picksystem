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

export const itemSchema = {
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
  counterPick: {
    source: "counterPick",
  },
  counterNotPick: {
    source: "counterNotPick",
  },
  pidNotPick: {
    source: "pidNotPick",
  },
  pidPick: {
    source: "pidPick",
  },
};
