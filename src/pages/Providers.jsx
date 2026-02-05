import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, PROVIDERS } from "../data/mock";

export default function Providers() {
  const { category } = useParams();
  const nav = useNavigate();

  const cat = useMemo(
    () => CATEGORIES.find((c) => c.id === category),
    [category],
  );
  const list = PROVIDERS[category] || [];
  const [q, setQ] = useState("");

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
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="text-lg font-extrabold">Unknown category</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold">
              Choose {cat.label} provider
            </div>
            <div className="text-sm text-white/60">
              Search and select a biller.
            </div>
          </div>
          <input
            className="w-full md:w-96 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/30"
            placeholder="Search provider…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() =>
              nav(`/pay/${category}?providerId=${encodeURIComponent(p.id)}`)
            }
            className="text-left rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold">{p.name}</div>
                <div className="mt-1 text-xs text-white/60">{p.region}</div>
              </div>
              <span className="rounded-2xl bg-black/20 px-2 py-1 text-[11px] text-white/70">
                {p.tags?.[0] || "Available"}
              </span>
            </div>
            <div className="mt-4 text-xs text-white/55">Tap to continue →</div>
          </button>
        ))}
      </div>
    </div>
  );
}
