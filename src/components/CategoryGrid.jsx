import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCategoriesStore } from "../store/categories.store";

export default function CategoryGrid() {
  const {
    categories = [],
    fetchCategories,
    loading,
    error,
  } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const visible = useMemo(() => {
    return [...categories]
      .filter((c) => c.isActive !== false) // show active only
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Loading categories…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {visible.map((c) => (
        <Link
          key={c._id}
          to={`/providers/${c.key}`}
          className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2">
            {/* icon is String in DB */}
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-xl text-slate-700">
              {c.icon || "🧾"}
            </div>

            <span className="rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700">
              {c.mode === "bill" ? "Bill" : "Top-up"}
            </span>
          </div>

          <div className="mt-3 text-sm font-extrabold text-slate-900">
            {c.label}
          </div>

          <div className="mt-1 text-xs text-slate-500 line-clamp-2">
            {c.hint || "Select a provider to continue"}
          </div>
        </Link>
      ))}
    </div>
  );
}
