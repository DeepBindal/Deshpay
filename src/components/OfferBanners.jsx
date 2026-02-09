import React, { useEffect } from "react";
import { useBannersStore } from "../store/banners.store";

export default function OfferBanners() {
  const { banners, fetchBanners, loading, error } = useBannersStore();

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="min-w-[320px] h-40 rounded-3xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || banners.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {banners.map((b) => (
        <div
          key={b._id}
          className="min-w-[320px] md:min-w-105 rounded-3xl overflow-hidden shadow-sm bg-white border"
        >
          {/* Image */}
          <img
            src={b.imageUrl}
            alt={b.title}
            className="h-35 w-full object-cover"
            loading="lazy"
          />

          {/* Content */}
          <div className="p-4">
            <div className="text-sm font-extrabold text-slate-900">
              {b.title}
            </div>
            <div className="mt-1 text-xs text-slate-600">{b.subtitle}</div>

            {b.code && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Use code</span>
                <span className="font-mono text-sm font-bold">{b.code}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
