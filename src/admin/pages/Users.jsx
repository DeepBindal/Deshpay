import { useEffect, useMemo, useState } from "react";
import { useAdminUsersStore } from "../../store/admin/users.store";

function initials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase() || "U";
}

export default function AdminUsers() {
  const {
    users = [],
    loading,
    error,
    fetchUsers,
    toggleUser,
  } = useAdminUsersStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const phone = (u.phone || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return name.includes(q) || phone.includes(q) || role.includes(q);
    });
  }, [users, query]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Users
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage registered users and access status
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-[320px]">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-slate-400">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name / phone / role…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Loading users…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="font-semibold">Couldn’t load users</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-base font-bold text-slate-900">
            No users found
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Try a different search keyword.
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div className="text-sm font-semibold text-slate-700">
              Total: <span className="font-extrabold">{filtered.length}</span>
            </div>
            <div className="text-xs text-slate-500">
              Click “Block/Unblock” to change status
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white">
                <tr className="text-left text-slate-600">
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60">
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-600">
                          {initials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-900">
                            {u.name || "—"}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            ID: {u._id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-slate-700">
                      <span className="font-medium">{u.phone || "—"}</span>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                        {(u.role || "user").toUpperCase()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-rose-50 text-rose-700 ring-rose-200"
                        }`}
                      >
                        {u.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toggleUser(u._id)}
                        className={`rounded-2xl px-4 py-2 text-xs font-extrabold shadow-sm transition active:scale-[0.99] ${
                          u.isActive
                            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {u.isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
