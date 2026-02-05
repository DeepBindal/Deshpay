const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeReceiptId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BP-${y}${m}${day}-${rand}`;
}

/** Replace with real gateway later */
export async function createPayment(payload) {
  await sleep(900 + Math.random() * 900);
  if (Math.random() < 0.08)
    return { ok: false, error: "Payment failed at bank. Try again." };

  return {
    ok: true,
    receipt: {
      receiptId: makeReceiptId(),
      status: "SUCCESS",
      gateway: "PLACEHOLDER_GATEWAY",
      processedAt: new Date().toISOString(),
      ...payload,
    },
  };
}
