import React, { useEffect, useMemo, useState } from "react";
import { useBannersStore } from "../store/banners.store";

export default function OfferBanners() {
  const { banners = [], fetchBanners, loading, error } = useBannersStore();
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const activeBanners = useMemo(
    () => banners.filter((b) => b.isActive !== false),
    [banners],
  );

  const copyCode = async (id, code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="w-full animate-pulse rounded-3xl bg-slate-200 h-75" />
    );
  }

  if (error || activeBanners.length === 0) return null;

  return (
    <div className="no-scrollbar flex w-full gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
      {activeBanners.map((b) => {
        const imgSrc = `${import.meta.env.VITE_API_URL}${b.imageUrl}`;

        return (
          <div
            key={b._id}
            className="group relative min-w-full snap-center overflow-hidden rounded-4xl bg-slate-900 h-70 md:h-88"
          >
            {/* Background Image */}
            <img
              src={imgSrc}
              alt={b.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* Darker Gradient Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                {/* Text Section */}
                <div className="max-w-xl">
                  <span className="mb-2 inline-block rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Limited Offer
                  </span>
                  <h2 className="text-2xl font-black text-white md:text-4xl drop-shadow-md">
                    {b.title}
                  </h2>
                  {b.subtitle && (
                    <p className="mt-2 text-sm text-slate-200 md:text-base line-clamp-2">
                      {b.subtitle}
                    </p>
                  )}
                </div>

                {/* Promo Code Overlay Button */}
                {b.code && (
                  <button
                    onClick={() => copyCode(b._id, b.code)}
                    className="relative flex justify-between items-center gap-3 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 pl-4 transition hover:bg-white/20 active:scale-95"
                  >
                    <div className="flex flex-col py-1">
                      <span className="text-[10px] font-bold uppercase text-slate-300">
                        Code
                      </span>
                      <span className="font-mono text-sm font-black text-white tracking-wider">
                        {b.code}
                      </span>
                    </div>
                    <div
                      className={`flex h-10 items-center justify-center rounded-xl px-4 text-xs font-bold transition-all duration-300 ${
                        copiedId === b._id
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-slate-900"
                      }`}
                    >
                      {copiedId === b._id ? "Copied!" : "Copy"}
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
