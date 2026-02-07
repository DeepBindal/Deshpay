import React, { useMemo, useState } from "react";
import { readTxns } from "../utils/storage";
import { formatINR } from "../utils/money";

export default function History() {
  const [filter, setFilter] = useState("all");
  const txns = useMemo(() => readTxns(), []);

  const list = useMemo(() => {
    if (filter === "all") return txns;
    return txns.filter((t) => t.status === filter);
  }, [txns, filter]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Payment History
            </div>
            <div className="text-sm text-slate-500">Saved locally for demo</div>
          </div>

          <select
            className="w-full md:w-64 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      {list.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No transactions yet. Do a demo payment.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-200">
            {list.map((t) => (
              <div key={t.id} className="p-4 md:p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  {/* Left */}
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {t.categoryLabel} • {t.providerName}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Ref: {t.customerRef} • {String(t.method).toUpperCase()} •{" "}
                      {new Date(t.createdAt).toLocaleString("en-IN")}
                    </div>
                    <div className="mt-1 font-mono text-xs text-slate-400">
                      {t.id}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Amount</div>
                      <div className="text-sm font-black text-slate-900">
                        {formatINR(t.amount)}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        t.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
