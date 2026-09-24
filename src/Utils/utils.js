import { findProduct } from "../Services/lowJSON.js";

export function updateItemToPick(items, pid) {
  if (items && Array.isArray(items)) {
    // cari item dengan pid dan update pick menjadi true
    const findIndex = items.findIndex((item) => item.pid === pid);
    items[findIndex].pick = true;
    return items;
  }
}

export function transformOutput(data, schema) {
  const output = {};

  if (data && typeof data === "object") {
    for (const [key, value] of Object.entries(schema)) {
      if (value.transform) {
        output[key] = value.transform(data);
        continue;
      } else {
        output[key] = getValue(data, value.source);
      }
    }
    if (output.item) {
      const addData = output.item.reduce(
        (acc, item, index) => {
          if (item.pickStatus === true) {
            acc.counterPick++;
            acc.pidPick.push(item.pid);
          } else {
            acc.counterNotPick++;
            acc.pidNotPick.push(item.pid);
          }
          return acc;
        },
        {
          counterPick: 0,
          counterNotPick: 0,
          pidNotPick: [],
          pidPick: [],
        },
      );
      output.item = getName(output.item);
      return { ...output, ...addData };
    } else {
      return output;
    }
  } else {
    return data;
  }
}

function getValue(data, path) {
  return path.split(".").reduce((current, key) => current?.[key], data);
}

function getName(items) {
  if (items && Array.isArray(items)) {
    const result = items.map((item) => {
      if (item && item.pid) {
        const product = findProduct(Number(item.pid));
        if (!item.pickStatus) {
          item.pickStatus = false;
        }
        if (!item.pickTime) {
          item.pickTime = null;
        }
        let locationString = "";
        if (product.location && Array.isArray(product.location)) {
          locationString = product.location.reduce((acc, value) => {
            acc += value + " ";
            return acc;
          }, "");
        }
        return {
          ...item,
          name: product.name,
          location: locationString.trim(),
        };
      } else {
        return item;
      }
    });
    return result;
  }
}
