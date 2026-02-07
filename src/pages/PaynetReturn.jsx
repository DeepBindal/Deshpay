import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paynet_uphold_payment } from "../lib/paynetMockClient";
import { addTxn, readTxns } from "../utils/storage";
import { formatINR } from "../utils/money";

const MERCHANT_EMAIL =
  import.meta.env.VITE_PAYNET_MERCHANT_EMAIL || "demo@merchant.com";
const SECRET_KEY =
  import.meta.env.VITE_PAYNET_SECRET_KEY || "demo_secret_key_123";

export default function PaynetReturn() {
  const [sp] = useSearchParams();
  const payment_reference = sp.get("payment_reference");
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await paynet_uphold_payment({
        merchant_email: MERCHANT_EMAIL,
        secret_key: SECRET_KEY,
        payment_reference,
      });
      setData(r);

      if (r?.response_code === "100") {
        const existing = readTxns().some((t) => t.id === r.transaction_id);
        if (!existing) {
          addTxn({
            id: r.transaction_id,
            status: "SUCCESS",
            createdAt: new Date().toISOString(),
            categoryLabel: r.meta?.categoryLabel || "Bill Payment",
            providerName: r.meta?.providerName || "Provider",
            customerRef:
              r.meta?.customerRef || r.reference_no || r.pt_invoice_id,
            amount: r.amount,
            method:
              String(r.meta?.preferredMethod || "").toUpperCase() || "PAYNET",
          });
        }
      }
    })();
  }, [payment_reference]);

  const isSuccess = data?.response_code === "100";
  const isPending = data?.response_code === "481";
  const isFailed = data?.response_code === "484";

  const title = useMemo(() => {
    if (!data) return "Checking payment…";
    if (isSuccess) return "Payment Successful ✅";
    if (isPending) return "Payment Pending ⏳";
    if (isFailed) return "Payment Failed ❌";
    return "Payment Status";
  }, [data, isSuccess, isPending, isFailed]);

  return (
    <div className="bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-extrabold text-slate-900">{title}</div>

        <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">PayPage ID</span>
            <span className="font-mono font-bold text-slate-900">
              {data?.pt_invoice_id || payment_reference}
            </span>
          </div>

          <div className="mt-2 flex justify-between gap-3">
            <span className="text-slate-500">Txn ID</span>
            <span className="font-mono font-bold text-slate-900">
              {data?.transaction_id || "—"}
            </span>
          </div>

          <div className="mt-2 flex justify-between gap-3">
            <span className="text-slate-500">Amount</span>
            <span className="font-extrabold text-slate-900">
              {data ? formatINR(data.amount) : "—"}
            </span>
          </div>

          <div className="mt-2 flex justify-between gap-3">
            <span className="text-slate-500">Message</span>
            <span className="text-slate-700">{data?.result || "—"}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
          >
            Back to Home
          </Link>

          <Link
            to="/history"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
          >
            History
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
          >
            Re-check
          </button>
        </div>
      </div>
    </div>
  );
}
