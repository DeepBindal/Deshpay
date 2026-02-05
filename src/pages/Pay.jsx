import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  CATEGORIES,
  PROVIDERS,
  PAYMENT_METHODS,
  QUICK_AMOUNTS,
} from "../data/mock";
import { fetchBill } from "../api/bills";
import { createPayment } from "../api/payments";
import { formatINR } from "../utils/money";
import { addTxn } from "../utils/storage";
import { paynet_generate_payment_page } from "../lib/paynetMockClient";

function refMeta(category) {
  if (category === "electricity")
    return {
      label: "Consumer Number",
      placeholder: "e.g. CA/IVRS/Service No.",
    };
  if (category === "water")
    return { label: "Connection ID", placeholder: "As per water bill" };
  if (category === "gas")
    return { label: "Customer ID", placeholder: "As per gas bill" };
  if (category.includes("mobile"))
    return { label: "Mobile Number", placeholder: "10-digit mobile number" };
  if (category === "fastag")
    return { label: "Vehicle / Tag ID", placeholder: "Enter Tag ID" };
  if (category === "credit-card")
    return { label: "Card Last 4", placeholder: "e.g. 1234" };
  return { label: "Customer Reference", placeholder: "Enter reference" };
}

function validRef(category, v) {
  const s = (v || "").trim();
  if (!s) return false;
  if (category.includes("mobile")) return /^[6-9]\d{9}$/.test(s);
  if (category === "credit-card") return /^\d{4}$/.test(s);
  return s.length >= 4;
}

export default function Pay() {
  const { category } = useParams();
  const [sp] = useSearchParams();
  const providerId = sp.get("providerId") || "";
  const nav = useNavigate();

  const cat = useMemo(
    () => CATEGORIES.find((c) => c.id === category),
    [category],
  );
  const provider = useMemo(
    () => (PROVIDERS[category] || []).find((p) => p.id === providerId),
    [category, providerId],
  );

  const [customerRef, setCustomerRef] = useState("");
  const [method, setMethod] = useState("upi");
  const [amount, setAmount] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [receipt, setReceipt] = useState(null);

  const meta = refMeta(category);
  const mode = cat?.mode || "bill";

  useEffect(() => {
    setBill(null);
    setReceipt(null);
    setErr("");
    setAmount("");
    setCustomerRef("");
  }, [category, providerId]);

  if (!cat)
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        Unknown category
      </div>
    );

  async function handleFetch() {
    setErr("");
    if (!providerId) return setErr("Select a provider first");
    if (!validRef(category, customerRef))
      return setErr("Enter a valid reference");

    if (mode === "topup") return; // no bill fetch needed

    setLoading(true);
    const res = await fetchBill({
      category,
      providerId,
      customerRef: customerRef.trim(),
    });
    setLoading(false);
    if (!res.ok) return setErr(res.error || "Bill fetch failed");
    setBill(res.bill);
    setAmount(String(res.bill.dueAmount));
  }

  async function handlePay() {
    setErr("");
    const amt = Number(amount || 0);

    if (!providerId) return setErr("Select a provider");
    if (!validRef(category, customerRef))
      return setErr("Enter a valid reference");
    if (!amt || amt < 10) return setErr("Enter a valid amount");

    setLoading(true);

    try {
      const resp = await paynet_generate_payment_page({
        merchant_email:
          import.meta.env.VITE_PAYNET_MERCHANT_EMAIL || "demo@merchant.com",
        secret_key:
          import.meta.env.VITE_PAYNET_SECRET_KEY || "demo_secret_key_123",
        return_url: `${window.location.origin}/paynet/return`,
        title: `${cat.label} • ${provider?.name || "Provider"}`,
        amount: String(amt),
        currency: "INR",
        reference_no: `REF_${Date.now()}`,
        meta: {
          category,
          categoryLabel: cat.label,
          providerName: provider?.name || "Provider",
          customerRef: customerRef.trim(),
          preferredMethod: method,
        },
      });

      if (resp?.response_code !== "4012") {
        setErr(resp?.result || "Failed to create PayPage");
        return;
      }

      // redirect to mock gateway checkout
      window.location.href = resp.payment_url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold">{cat.label} payment</div>
            <div className="text-sm text-white/60">
              Provider:{" "}
              <span className="text-white">
                {provider?.name || "Not selected"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm hover:bg-white/10"
              to={`/providers/${category}`}
            >
              Change provider
            </Link>
            <button
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => nav("/history")}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {receipt ? (
        <div className="rounded-[28px] border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xl font-extrabold">
                Payment Successful ✅
              </div>
              <div className="mt-2 text-sm text-white/70">Receipt ID</div>
              <div className="font-mono text-sm font-black tracking-wider">
                {receipt.receiptId}
              </div>

              <div className="mt-4 text-sm text-white/70">
                Provider:{" "}
                <span className="text-white font-semibold">
                  {receipt.providerName}
                </span>
                <br />
                Ref:{" "}
                <span className="text-white font-semibold">
                  {receipt.customerRef}
                </span>
                <br />
                Method:{" "}
                <span className="text-white font-semibold">
                  {String(receipt.method).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-black/20 p-4 text-right">
              <div className="text-xs text-white/60">Amount Paid</div>
              <div className="text-2xl font-black">
                {formatINR(receipt.amount)}
              </div>
              <div className="mt-1 text-xs text-white/60">
                {new Date(receipt.processedAt).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              to="/"
            >
              Back to Home
            </Link>
            <button
              className="rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              onClick={() => nav(`/providers/${category}`)}
            >
              Pay another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="text-sm font-extrabold">Enter details</div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-white/60">{meta.label}</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/30"
                  placeholder={meta.placeholder}
                  value={customerRef}
                  onChange={(e) => setCustomerRef(e.target.value)}
                  inputMode={category.includes("mobile") ? "numeric" : "text"}
                />
              </div>

              {mode === "topup" && (
                <div>
                  <label className="text-xs text-white/60">Amount (₹)</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/30"
                    placeholder="e.g. 299"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="numeric"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                        onClick={() => setAmount(String(a))}
                        type="button"
                      >
                        ₹{a}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "bill" && (
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={loading}
                  className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-bold shadow-soft hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Fetching…" : "Fetch Bill"}
                </button>
              )}

              {err && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {err}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="text-sm font-extrabold">Payment</div>

            <div className="mt-4 space-y-3">
              {mode === "bill" && (
                <div className="rounded-3xl bg-black/20 p-4">
                  <div className="text-xs text-white/60">Bill summary</div>
                  {bill ? (
                    <>
                      <div className="mt-2 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold">
                            {provider?.name}
                          </div>
                          <div className="text-xs text-white/60">
                            Ref: {bill.billerRef} • {bill.period}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/60">Due</div>
                          <div className="text-lg font-black">
                            {formatINR(bill.dueAmount)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-white/60">
                        Due date:{" "}
                        {new Date(bill.dueDate).toLocaleDateString("en-IN")}
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 text-sm text-white/60">
                      Fetch bill to continue.
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs text-white/60">Amount (₹)</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/30"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="numeric"
                />
                <div className="mt-1 text-xs text-white/50">
                  You’ll pay: {formatINR(Number(amount || 0))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60">Method</label>
                <select
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} — {m.hint}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={loading || (mode === "bill" && !bill)}
                className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold shadow-soft hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Processing…" : "Pay now"}
              </button>

              <div className="text-[11px] text-white/45">
                Demo: payment sometimes fails randomly so it feels real.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
