import React, { useEffect, useMemo, useState } from "react";
import { useTransactionsStore } from "../store/transactions.store";
import { formatINR } from "../utils/money";

export default function History() {
  const [filter, setFilter] = useState("all");

  const { transactions, fetchTransactions, loading, error } =
    useTransactionsStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const list = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.status === filter);
  }, [transactions, filter]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Payment History
            </div>
            <div className="text-sm text-slate-500">
              Your recent transactions
            </div>
          </div>

          <select
            className="w-full md:w-64 rounded-2xl border px-4 py-3 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-slate-500">Loading transactions…</div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-rose-50 text-rose-600 p-4 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && list.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          No transactions yet.
        </div>
      )}

      {/* List */}
      {!loading && list.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
          <div className="divide-y">
            {list.map((t) => (
              <div key={t._id} className="p-5">
                <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {t.category} • {t.providerName}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Ref: {t.meta?.customerRef || "—"} • {t.method}
                    </div>
                    <div className="mt-1 text-xs font-mono text-slate-400">
                      {t.externalTxnId || t._id}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Amount</div>
                      <div className="text-sm font-black">
                        {formatINR(t.amount)}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        t.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-600"
                          : t.status === "FAILED"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
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
