import { useEffect, useMemo, useState } from "react";
import { useAdminTransactionsStore } from "../../store/admin/transactions.store";
import { exportToCsv } from "../../utils/exportCsv";
import { formatINR } from "../../utils/money";

export default function AdminTransactions() {
  const {
    transactions = [],
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    fetchTransactions,
  } = useAdminTransactionsStore();

  const [localUserId, setLocalUserId] = useState(filters.userId || "");

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const exportCsv = () => {
    exportToCsv(
      "transactions.csv",
      transactions.map((t) => ({
        id: t._id,
        user: t.userId?.phone || "",
        provider: t.providerName,
        category: t.category,
        amount: t.amount,
        status: t.status,
        method: t.method,
        createdAt: new Date(t.createdAt).toISOString(),
      })),
    );
  };

  const stats = useMemo(() => {
    const total = transactions.length;
    const success = transactions.filter((t) => t.status === "SUCCESS").length;
    const failed = transactions.filter((t) => t.status === "FAILED").length;
    const pending = transactions.filter((t) => t.status === "PENDING").length;

    const amount = transactions.reduce(
      (sum, t) => sum + (Number(t.amount) || 0),
      0,
    );

    return { total, success, failed, pending, amount };
  }, [transactions]);

  const applyFilters = () => {
    setFilter("userId", localUserId.trim());
    fetchTransactions();
  };

  const resetFilters = () => {
    clearFilters();
    setLocalUserId("");
    fetchTransactions();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and export payment transactions
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
        >
          Export CSV
        </button>
      </div>

      {/* Quick stats */}
      {!loading && !error && transactions.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Success" value={stats.success} tone="success" />
          <StatCard label="Failed" value={stats.failed} tone="danger" />
          <StatCard label="Pending" value={stats.pending} tone="warn" />
          <StatCard label="Amount" value={formatINR(stats.amount)} />
        </div>
      )}

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Filters</div>
            <div className="text-xs text-slate-500">
              Narrow down transactions by status and date range
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="md:col-span-1">
            <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Status
            </label>
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              <option value="">All status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              From
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              value={filters.from}
              onChange={(e) => setFilter("from", e.target.value)}
            />
          </div>

          <div className="md:col-span-1">
            <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              To
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              value={filters.to}
              onChange={(e) => setFilter("to", e.target.value)}
            />
          </div>

          <div className="md:col-span-1">
            <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              User ID (optional)
            </label>
            <input
              placeholder="Paste userId…"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              value={localUserId}
              onChange={(e) => setLocalUserId(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2 md:col-span-1">
            <button
              onClick={applyFilters}
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Loading transactions…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="font-semibold">Couldn’t load transactions</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && transactions.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Provider</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {t.userId?.phone || "—"}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {t.userId?._id || t.userId || ""}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {t.providerName || "—"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {t.category || "—"}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      {formatINR(t.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusPill status={t.status} />
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && transactions.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-base font-bold text-slate-900">
            No transactions found
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Try changing the filters and apply again.
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const cls =
    status === "SUCCESS"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "FAILED"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${cls}`}
    >
      {status}
    </span>
  );
}

function StatCard({ label, value, tone }) {
  const toneCls =
    tone === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "danger"
        ? "bg-rose-50 text-rose-800 border-rose-200"
        : tone === "warn"
          ? "bg-amber-50 text-amber-800 border-amber-200"
          : "bg-white text-slate-900 border-slate-200";

  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${toneCls}`}>
      <div className="text-xs font-bold uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="mt-1 text-lg font-extrabold tracking-tight">{value}</div>
    </div>
  );
}
