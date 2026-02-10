import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { PAYMENT_METHODS, QUICK_AMOUNTS } from "../data/mock";
import { fetchBill } from "../api/bills";
import { formatINR } from "../utils/money";
import { useCategoriesStore } from "../store/categories.store";
import { useProvidersStore } from "../store/providers.store";

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
  const [customerRef, setCustomerRef] = useState("");
  const [method, setMethod] = useState("upi");
  const [amount, setAmount] = useState("");
  const [payErr, setPayErr] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [receipt, setReceipt] = useState(null);
  const { category } = useParams();
  const { categories, fetchCategories } = useCategoriesStore();
  const { providersByCategory, fetchProviders, getProviderById } =
    useProvidersStore();

  const [sp] = useSearchParams();
  const providerId = sp.get("providerId") || "";
  const nav = useNavigate();

  useEffect(() => {
    if (category) fetchProviders(category);
  }, [category, fetchProviders]);

  useEffect(() => {
    if (!categories?.length) fetchCategories?.();
  }, [categories?.length, fetchCategories]);

  const cat = useMemo(
    () => categories?.find((c) => c.key === category),
    [categories, category],
  );
  const provider = useMemo(() => {
    if (!category || !providerId) return null;
    return getProviderById(category, providerId);
  }, [category, providerId, getProviderById, categories]);
  console.log(provider)

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

  const validatePay = () => {
    const e = [];

    if (!providerId) e.push("Select a provider first.");

    if (!validRef(category, customerRef)) {
      e.push(`Enter a valid ${meta.label}.`);
    }

    const amt = Number(amount);
    if (!amount || Number.isNaN(amt)) e.push("Enter a valid amount.");
    else if (amt < 10) e.push("Minimum amount is ₹10.");

    if ((cat?.mode || "bill") === "bill") {
      if (!bill) e.push("Fetch bill first before paying.");
    }

    return e;
  };

  // const canPay = useMemo(
  //   () => validatePay().length === 0,
  //   [providerId, customerRef, amount, bill, category, cat?.mode],
  // );

  function handlePay() {
    setErr("");
    setPayErr("");

    const errors = validatePay();
    if (errors.length) {
      setPayErr(errors[0]); // show first error (simple)
      return;
    }

    const payload = {
      category,
      categoryLabel: cat?.label,
      mode: cat?.mode,
      providerId,
      providerName: provider?.name,
      customerRef: customerRef.trim(),
      method,
      amount: Number(amount),
      bill, // include bill object if bill-mode
      meta: {
        uiMetaLabel: meta.label,
        uiMetaPlaceholder: meta.placeholder,
        ts: new Date().toISOString(),
      },
    };

    console.log("✅ PAY CLICKED - payload:", payload);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              {cat.label} payment
            </div>
            <div className="text-sm text-slate-500">
              Provider:{" "}
              <span className="font-semibold text-slate-900">
                {provider?.name || "Not selected"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              to={`/providers/${category}`}
            >
              Change provider
            </Link>
            <button
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => nav("/history")}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Success */}
      {receipt ? (
        <div className="rounded-[28px] border border-emerald-300 bg-emerald-50 p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xl font-extrabold text-emerald-800">
                Payment Successful ✅
              </div>

              <div className="mt-2 text-sm text-slate-600">Receipt ID</div>
              <div className="font-mono text-sm font-black tracking-wider text-slate-900">
                {receipt.receiptId}
              </div>

              <div className="mt-4 text-sm text-slate-600">
                Provider:{" "}
                <span className="font-semibold text-slate-900">
                  {receipt.providerName}
                </span>
                <br />
                Ref:{" "}
                <span className="font-semibold text-slate-900">
                  {receipt.customerRef}
                </span>
                <br />
                Method:{" "}
                <span className="font-semibold text-slate-900">
                  {String(receipt.method).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 text-right shadow-sm">
              <div className="text-xs text-slate-500">Amount Paid</div>
              <div className="text-2xl font-black text-slate-900">
                {formatINR(receipt.amount)}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {new Date(receipt.processedAt).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
              to="/"
            >
              Back to Home
            </Link>
            <button
              className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
              onClick={() => nav(`/providers/${category}`)}
            >
              Pay another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Enter details */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-extrabold text-slate-900">
              Enter details
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-500">{meta.label}</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder={meta.placeholder}
                  value={customerRef}
                  onChange={(e) => setCustomerRef(e.target.value)}
                  inputMode={category.includes("mobile") ? "numeric" : "text"}
                />
              </div>

              {mode === "topup" && (
                <div>
                  <label className="text-xs text-slate-500">Amount (₹)</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="e.g. 299"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="numeric"
                  />

                  <div className="mt-2 flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100"
                        onClick={() => setAmount(String(a))}
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
                  className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Fetching…" : "Fetch Bill"}
                </button>
              )}

              {err && (
                <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {err}
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-extrabold text-slate-900">Payment</div>

            <div className="mt-4 space-y-3">
              {mode === "bill" && (
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Bill summary</div>

                  {bill ? (
                    <>
                      <div className="mt-2 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {provider?.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Ref: {bill.billerRef} • {bill.period}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-slate-500">Due</div>
                          <div className="text-lg font-black text-slate-900">
                            {formatINR(bill.dueAmount)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-slate-500">
                        Due date:{" "}
                        {new Date(bill.dueDate).toLocaleDateString("en-IN")}
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 text-sm text-slate-500">
                      Fetch bill to continue.
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs text-slate-500">Amount (₹)</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="numeric"
                />
                <div className="mt-1 text-xs text-slate-500">
                  You’ll pay: {formatINR(Number(amount || 0))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500">Method</label>
                <select
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
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
                className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Processing…" : "Pay now"}
              </button>

              {payErr && (
                <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {payErr}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
