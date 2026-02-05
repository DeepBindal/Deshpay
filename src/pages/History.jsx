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
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold">Payment History</div>
            <div className="text-sm text-white/60">Saved locally for demo</div>
          </div>

          <select
            className="w-full md:w-64 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          No transactions yet. Do a demo payment.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-soft">
          <div className="divide-y divide-white/10">
            {list.map((t) => (
              <div key={t.id} className="p-4 md:p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-extrabold">
                      {t.categoryLabel} • {t.providerName}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Ref: {t.customerRef} • {String(t.method).toUpperCase()} •{" "}
                      {new Date(t.createdAt).toLocaleString("en-IN")}
                    </div>
                    <div className="mt-1 font-mono text-xs text-white/50">
                      {t.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-white/60">Amount</div>
                      <div className="text-sm font-black">
                        {formatINR(t.amount)}
                      </div>
                    </div>
                    <span
                      className={`rounded-2xl px-3 py-1 text-xs font-bold ${
                        t.status === "SUCCESS"
                          ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20"
                          : "bg-rose-500/15 text-rose-200 border border-rose-500/20"
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
