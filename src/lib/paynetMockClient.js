const LS_KEY = "paynet_mock_paypages_v1";

function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : { seq: 10001, paypages: {} };
    if (!parsed.seq) parsed.seq = 10001;
    if (!parsed.paypages) parsed.paypages = {};
    return parsed;
  } catch {
    return { seq: 10001, paypages: {} };
  }
}

function writeStore(next) {
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

function nextPid() {
  const s = readStore();
  const pid = String(s.seq++);
  writeStore(s);
  return pid;
}

function makeTxnId() {
  return `PN_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

function appendQuery(url, key, value) {
  const u = new URL(url, window.location.origin);
  u.searchParams.set(key, value);
  return u.toString();
}

const MERCHANT_EMAIL =
  import.meta.env.VITE_PAYNET_MERCHANT_EMAIL || "demo@merchant.com";
const SECRET_KEY =
  import.meta.env.VITE_PAYNET_SECRET_KEY || "demo_secret_key_123";

export async function paynet_authenticate_key({ merchant_email, secret_key }) {
  if (!merchant_email || !secret_key)
    return { result: "invalid", response_code: "4001" };
  if (merchant_email !== MERCHANT_EMAIL || secret_key !== SECRET_KEY)
    return { result: "invalid", response_code: "4002" };
  return { result: "valid", response_code: "4000" };
}

/**
 * Frontend-only mock of: /apipaynet/generate_payment_page
 * Returns: { response_code:"4012", p_id, payment_url }
 */
export async function paynet_generate_payment_page(payload) {
  const {
    merchant_email,
    secret_key,
    return_url,
    title,
    amount,
    currency,
    reference_no,
    meta,
  } = payload || {};

  if (
    !merchant_email ||
    !secret_key ||
    !return_url ||
    !title ||
    !amount ||
    !currency
  ) {
    return { result: "Missing parameters", response_code: "4001" };
  }
  if (merchant_email !== MERCHANT_EMAIL || secret_key !== SECRET_KEY) {
    return { result: "Invalid Credentials.", response_code: "4002" };
  }

  const p_id = nextPid();
  const store = readStore();

  store.paypages[p_id] = {
    p_id,
    merchant_email,
    title,
    amount: Number(amount),
    currency: String(currency),
    return_url: String(return_url),
    reference_no: reference_no || p_id,
    status: "INITIATED", // INITIATED | PENDING | COMPLETED | FAILED
    method: null,
    transaction_id: null,
    created_at: new Date().toISOString(),
    meta: meta || {}, // your app metadata
  };

  writeStore(store);

  const payment_url = `${window.location.origin}/mock-paynet/pay/${encodeURIComponent(p_id)}`;

  return {
    result:
      "Pay Page is created. User must go to the page to complete the payment.",
    response_code: "4012",
    p_id,
    payment_url,
  };
}

export async function paynet_get_paypage(p_id) {
  const store = readStore();
  const rec = store.paypages[String(p_id)];
  if (!rec) throw new Error("PayPage not found");
  return rec;
}

export async function paynet_complete_payment({ p_id, status, method }) {
  const store = readStore();
  const rec = store.paypages[String(p_id)];
  if (!rec) throw new Error("PayPage not found");

  rec.status = status; // COMPLETED | FAILED | PENDING
  rec.method = method || rec.method;
  rec.transaction_id = rec.transaction_id || makeTxnId();

  store.paypages[String(p_id)] = rec;
  writeStore(store);

  return {
    ok: true,
    p_id: rec.p_id,
    status: rec.status,
    transaction_id: rec.transaction_id,
  };
}

/**
 * Frontend-only mock of: /apipaynet/uphold_payment
 * Returns codes like:
 * 100 completed, 481 pending, 482 initiated, 484 failed, 485 not found
 */
export async function paynet_uphold_payment({
  merchant_email,
  secret_key,
  payment_reference,
}) {
  if (!merchant_email || !secret_key || !payment_reference) {
    return { result: "Missing parameters", response_code: "4001" };
  }
  if (merchant_email !== MERCHANT_EMAIL || secret_key !== SECRET_KEY) {
    return { result: "Invalid Credentials", response_code: "4002" };
  }

  const store = readStore();
  const rec = store.paypages[String(payment_reference)];

  if (!rec) {
    return {
      result: "There are no invoice available with this paypage id",
      response_code: "485",
    };
  }

  let response_code = "482";
  let result = "Payment is initiated";

  if (rec.status === "COMPLETED") {
    response_code = "100";
    result = "Payment is completed.";
  } else if (rec.status === "PENDING") {
    response_code = "481";
    result = "Payment is pending";
  } else if (rec.status === "FAILED") {
    response_code = "484";
    result = "Payment is failed/rejected";
  }

  return {
    result,
    response_code,
    pt_invoice_id: rec.p_id,
    amount: rec.amount,
    currency: rec.currency,
    transaction_id: rec.transaction_id || makeTxnId(),
    reference_no: rec.reference_no,
    title: rec.title,
    meta: rec.meta || {},
    return_url: rec.return_url,
  };
}

export function paynet_return_url_with_reference(return_url, p_id) {
  return appendQuery(return_url, "payment_reference", String(p_id));
}
