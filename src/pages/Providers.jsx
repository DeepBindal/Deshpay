import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileJson } from "lucide-react";

import { CATEGORIES } from "../data/mock"; // keep categories for now
import { useProvidersStore } from "../store/providers.store";
import { groupProvidersByRegion } from "../store/providers.selectors";

export default function Providers() {
  const { category } = useParams();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const { providersByCategory, fetchProviders, loading, error } =
    useProvidersStore();

  const cat = useMemo(
    () => CATEGORIES.find((c) => c.id === category),
    [category],
  );

  const providers = providersByCategory[category] || [];

  useEffect(() => {
    if (category) fetchProviders(category);
  }, [category]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return providers;
    return providers.filter((p) =>
      `${p.name} ${p.region} ${(p.tags || []).join(" ")}`
        .toLowerCase()
        .includes(s),
    );
  }, [q, providers]);

  const grouped = useMemo(() => groupProvidersByRegion(filtered), [filtered]);

  if (!cat) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="text-lg font-extrabold">Unknown category</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div>
            <div className="text-lg font-extrabold">
              Choose {cat.label} provider
            </div>
            <div className="text-sm text-slate-500">
              Search and select a biller
            </div>
          </div>

          <input
            className="w-full md:w-96 rounded-2xl border px-4 py-3 text-sm"
            placeholder="Search provider…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-slate-500">Loading providers…</div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-rose-50 text-rose-600 p-4 text-sm">
          {error}
        </div>
      )}

      {/* Providers grouped by region */}
      {!loading &&
        Object.entries(grouped).map(([region, list]) => (
          <div key={region} className="space-y-3">
            <div className="text-sm font-bold text-slate-700">{region}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((p) => (
                <button
                  key={p._id}
                  onClick={() =>
                    nav(
                      `/pay/${category}?providerId=${encodeURIComponent(
                        p._id,
                      )}`,
                    )
                  }
                  className="group rounded-3xl border bg-white p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-100 grid place-items-center">
                        {p.logoUrl ? (
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <FileJson className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div>
                        <div className="font-extrabold text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.region}</div>
                      </div>
                    </div>

                    <span className="text-xs bg-indigo-50 text-indigo-600 rounded-full px-3 py-1">
                      {p.tags?.[0] || "Available"}
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-slate-500 group-hover:text-indigo-600">
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
