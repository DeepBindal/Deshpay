import { useEffect, useMemo, useState } from "react";
import { useAdminProvidersStore } from "../../store/admin/providers.store";
import ProviderModal from "../components/ProviderModal";
import { createProviderApi } from "../../api/admin/providers.api";

export default function AdminProviders() {
  const {
    providers = [],
    loading,
    error,
    fetchProviders,
    toggleProvider,
    openEdit,
    editingProvider,
    closeEdit,
    saveProvider,
    createProvider,
  } = useAdminProvidersStore();

  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const modalOpen = !!editingProvider || isCreating;

  const modalMode = useMemo(() => {
    if (isCreating) return "create";
    if (editingProvider?._id) return "edit";
    return null;
  }, [isCreating, editingProvider]);

  const handleOpenCreate = () => {
    closeEdit(); // ensure edit is not open
    setIsCreating(true);
  };

  const handleCloseModal = () => {
    closeEdit();
    setIsCreating(false);
  };

  const handleSave = async (id, payload) => {
    try {
      setSaving(true);
      if (modalMode === "create") {
        await createProviderApi(payload);
      } else {
        await saveProvider(id, payload);
      }
      handleCloseModal();
      await fetchProviders();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Providers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage billers & service providers
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
        >
          + Add Provider
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Loading providers…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="font-semibold">Something went wrong</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && providers.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-base font-bold text-slate-900">
            No providers yet
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Create your first provider to start managing them here.
          </div>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            + Add Provider
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && providers.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-5 py-4 font-semibold">Provider</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Region</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {providers.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.logoUrl ? (
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            className="h-9 w-9 rounded-xl border border-slate-200 bg-white object-contain"
                          />
                        ) : (
                          <div className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400">
                            LOGO
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-900">
                            {p.name}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            {p.domain || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {p.category || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {p.region || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                        }`}
                      >
                        {p.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => toggleProvider(p._id)}
                          className={`rounded-xl px-3 py-2 text-xs font-bold shadow-sm transition ${
                            p.isActive
                              ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {p.isActive ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProviderModal
          provider={isCreating ? null : editingProvider}
          onClose={handleCloseModal}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}
