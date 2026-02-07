import React from "react";
import { OFFERS } from "../data/mock";

export default function OfferBanners() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {OFFERS.map((o) => (
        <div
          key={o.id}
          className={`
            min-w-[85%] sm:min-w-95 md:min-w-110 lg:min-w-130
            rounded-3xl bg-linear-to-br ${o.tone}
            p-6 shadow-md
          `}
        >
          {/* Top */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                {o.title}
              </div>
              <div className="mt-1 text-sm text-slate-700">{o.subtitle}</div>
            </div>

            <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800">
              OFFER
            </span>
          </div>

          {/* Code */}
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3">
            <div className="text-xs font-medium text-slate-600">Use code</div>
            <div className="font-mono text-base font-extrabold tracking-widest text-slate-900">
              {o.code}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
