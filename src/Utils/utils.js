export function updateItemToPick(items, pid) {
  if (items && Array.isArray(items)) {
    // cari item dengan pid dan update pick menjadi true
    const findIndex = items.findIndex((item) => item.pid === pid);
    items[findIndex].pick = true;
    return items;
  }
}
