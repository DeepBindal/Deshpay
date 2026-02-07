import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, PROVIDERS } from "../data/mock";
import { FileJson } from "lucide-react";
import { logoUrlByDomain, logoUrlByName } from "../utils/logos";

export default function Providers() {
  const { category } = useParams();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const cat = useMemo(
    () => CATEGORIES.find((c) => c.id === category),
    [category],
  );

  const list = PROVIDERS[category] || [];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((p) =>
      `${p.name} ${p.region} ${(p.tags || []).join(" ")}`
        .toLowerCase()
        .includes(s),
    );
  }, [q, list]);

  if (!cat) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-lg font-extrabold text-slate-900">
          Unknown category
        </div>
      </div>
    );
  }

  const groupedByRegion = useMemo(() => {
    const map = {};

    filtered.forEach((p) => {
      const region = p.region || "Other";
      if (!map[region]) map[region] = [];
      map[region].push(p);
    });

    return map;
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Choose {cat.label} provider
            </div>
            <div className="text-sm text-slate-500">
              Search and select a biller
            </div>
          </div>

          <input
            className="w-full md:w-96 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Search provider…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByRegion).map(([region, providers]) => (
          <div key={region} className="space-y-3">
            {/* Region header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-700">
                {region}
              </h3>
              <span className="text-xs text-slate-400">
                {providers.length} provider{providers.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((p) => {
                const logo = p.domain
                  ? logoUrlByDomain(p.domain, { theme: "light", size: 64 })
                  : logoUrlByName(p.name, { theme: "light", size: 64 });

                return (
                  <button
                    key={p.id}
                    onClick={() =>
                      nav(
                        `/pay/${category}?providerId=${encodeURIComponent(p.id)}`,
                      )
                    }
                    className="
                group relative text-left rounded-3xl border border-slate-200
                bg-white p-5 shadow-sm transition
                hover:-translate-y-0.5 hover:shadow-md
                hover:border-indigo-300 focus:outline-none
                focus:ring-2 focus:ring-indigo-200
              "
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left */}
                      <div className="flex gap-4">
                        {/* Logo */}
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-100">
                          <img
                            src={logo}
                            alt={p.name}
                            loading="lazy"
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <FileJson className="absolute h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100" />
                        </div>

                        {/* Text */}
                        <div>
                          <div className="text-sm font-extrabold text-slate-900 leading-snug">
                            {p.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {p.region}
                          </div>
                        </div>
                      </div>

                      {/* Tag */}
                      <span className="h-fit rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600">
                        {p.tags?.[0] || "Available"}
                      </span>
                    </div>

                    <div className="mt-4 text-xs font-medium text-slate-500 group-hover:text-indigo-600">
                      Tap to continue →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
