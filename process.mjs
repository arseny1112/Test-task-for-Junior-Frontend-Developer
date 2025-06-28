export function process(store, order) {
  const stock = new Map();
  for (const { size, quantity } of store) {
    stock.set(size, quantity);
  }

  const assignment = [];
  const usedSizes = new Map();
  let mismatches = 0;

  for (const buyer of order) {
    const [s1, s2] = buyer.size;
    let given = null;
    let preferred = null;

    if (buyer.size.length === 1) {
      if ((stock.get(s1) ?? 0) > 0) {
        given = s1;
      } else {
        return false;
      }
    } else {
      preferred = buyer.masterSize === "s1" ? s1 : s2;
      const alt = buyer.masterSize === "s1" ? s2 : s1;

      if ((stock.get(preferred) ?? 0) > 0) {
        given = preferred;
      } else if ((stock.get(alt) ?? 0) > 0) {
        given = alt;
        mismatches++;
      } else {
        return false;
      }
    }

    stock.set(given, stock.get(given) - 1);
    assignment.push({ id: buyer.id, size: given });
    usedSizes.set(given, (usedSizes.get(given) ?? 0) + 1);
  }

  const stats = [...usedSizes.entries()]
    .map(([size, quantity]) => ({ size, quantity }))
    .sort((a, b) => a.size - b.size);

  return { stats, assignment, mismatches };
}


const store = [
  { size: 2, quantity: 4 }
];

const order = [
  { id: 101, size: [2] },
  { id: 102, size: [1, 2], masterSize: "s2" },
];

const result = process(store, order);
console.log(JSON.stringify(result, null, 2));
