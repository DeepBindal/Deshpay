import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/mock";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {CATEGORIES.map((c) => (
        <Link
          key={c.id}
          to={`/providers/${c.id}`}
          className="group rounded-3xl border border-white/10 bg-white/5 p-4 shadow-soft transition hover:bg-white/10"
        >
          <div className="flex items-start justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-xl">
              {c.icon}
            </div>
            <span className="rounded-2xl border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-white/70">
              {c.mode === "bill" ? "Bill" : "Top-up"}
            </span>
          </div>
          <div className="mt-3 text-sm font-bold">{c.label}</div>
          <div className="mt-1 text-xs text-white/60">{c.hint}</div>
        </Link>
      ))}
    </div>
  );
}
