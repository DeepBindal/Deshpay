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
          className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
        >
          <div className="flex items-start justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-xl text-slate-700">
              {c.icon}
            </div>

            <span className="rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
              {c.mode === "bill" ? "Bill" : "Top-up"}
            </span>
          </div>

          <div className="mt-3 text-sm font-bold text-slate-900">{c.label}</div>

          <div className="mt-1 text-xs text-slate-500">{c.hint}</div>
        </Link>
      ))}
    </div>
  );
}
