import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileJson } from "lucide-react";
import { useProvidersStore } from "../store/providers.store";
import { groupProvidersByRegion } from "../store/providers.selectors";
import { useCategoriesStore } from "../store/categories.store";

export default function Providers() {
  const { category: categoryKey } = useParams();
  const nav = useNavigate();

  const {
    categories = [],
    fetchCategories,
    loading: catLoading,
  } = useCategoriesStore();

  const {
    providersByCategory = {},
    fetchProviders,
    loading,
    error,
  } = useProvidersStore();

  const [q, setQ] = useState("");

  // find category using model key
  const cat = useMemo(() => {
    return categories.find(
      (c) => c.key === categoryKey && c.isActive !== false,
    );
  }, [categories, categoryKey]);

  // load categories once (if empty) + providers on category change
  useEffect(() => {
    if (!categories.length) fetchCategories();
  }, [categories.length, fetchCategories]);

  useEffect(() => {
    if (categoryKey) fetchProviders(categoryKey);
  }, [categoryKey, fetchProviders]);

  const providersRaw = providersByCategory[categoryKey] || [];

  // model-aligned filtering: active only + category safety
  const providers = useMemo(() => {
    return providersRaw.filter(
      (p) => p.isActive !== false && p.category === categoryKey,
    );
  }, [providersRaw, categoryKey]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return providers;

    return providers.filter((p) =>
      `${p.name || ""} ${p.region || ""} ${(p.tags || []).join(" ")}`
        .toLowerCase()
        .includes(s),
    );
  }, [q, providers]);

  const grouped = useMemo(() => groupProvidersByRegion(filtered), [filtered]);

  // Category not found (or inactive)
  if (!cat && !catLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="text-lg font-extrabold text-slate-900">
          Unknown category
        </div>
        <div className="mt-1 text-sm text-slate-500">
          This category does not exist or is currently disabled.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-900">
              Choose {cat?.label || "provider"}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Search and select a biller to continue
            </div>
          </div>

          <div className="w-full md:w-96">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-slate-400">🔎</span>
              <input
                className="w-full bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-slate-400"
                placeholder="Search provider…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Loading providers…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-base font-bold text-slate-900">
            No providers found
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Try a different search keyword.
          </div>
        </div>
      )}

      {/* Providers grouped by region */}
      {!loading &&
        !error &&
        Object.entries(grouped).map(([region, list]) => (
          <div key={region} className="space-y-3">
            <div className="text-sm font-extrabold text-slate-700">
              {region || "Other"}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <button
                  key={p._id}
                  onClick={() =>
                    nav(
                      `/pay/${categoryKey}?providerId=${encodeURIComponent(p._id)}`,
                    )
                  }
                  className="group w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-px hover:shadow-md active:translate-y-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-slate-50">
                        {p.logoUrl ? (
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            className="h-9 w-9 object-contain"
                          />
                        ) : (
                          <FileJson className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold text-slate-900">
                          {p.name}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-slate-500">
                          {p.region || "—"}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-100">
                      {p.tags?.[0] || "Available"}
                    </span>
                  </div>

                  <div className="mt-4 text-xs font-semibold text-slate-500 group-hover:text-indigo-700">
                    Tap to continue →
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
