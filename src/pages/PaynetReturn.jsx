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

      // Add to history once when completed
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="text-xl font-extrabold">{title}</div>

        <div className="mt-4 rounded-3xl bg-black/20 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-white/60">PayPage ID</span>
            <span className="font-mono font-bold">
              {data?.pt_invoice_id || payment_reference}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-3">
            <span className="text-white/60">Txn ID</span>
            <span className="font-mono font-bold">
              {data?.transaction_id || "—"}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-3">
            <span className="text-white/60">Amount</span>
            <span className="font-extrabold">
              {data ? formatINR(data.amount) : "—"}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-3">
            <span className="text-white/60">Message</span>
            <span className="text-white/80">{data?.result || "—"}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/"
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Back to Home
          </Link>
          <Link
            to="/history"
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            History
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Re-check
          </button>
        </div>
      </div>
    </div>
  );
}
