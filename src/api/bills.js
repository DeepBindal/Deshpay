const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export async function fetchBill({ category, providerId, customerRef }) {
  await sleep(650 + Math.random() * 800);
  if (Math.random() < 0.06)
    return { ok: false, error: "Bill fetch failed. Please retry." };

  const seed = hash(`${category}|${providerId}|${customerRef}`);
  const dueAmount = 120 + (seed % 4200);
  const days = 2 + (seed % 22);

  const dueDate = new Date(Date.now() + days * 86400000);

  return {
    ok: true,
    bill: {
      billerRef: `BILL-${String(seed).slice(0, 6)}`,
      customerName: "Demo Customer",
      dueAmount,
      dueDate: dueDate.toISOString(),
      period: "Feb 2026",
    },
  };
}
