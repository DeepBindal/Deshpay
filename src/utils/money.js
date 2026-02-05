export function formatINR(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}
