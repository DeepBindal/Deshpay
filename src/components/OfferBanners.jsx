import React from "react";
import { OFFERS } from "../data/mock";

export default function OfferBanners() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {OFFERS.map((o) => (
        <div
          key={o.id}
          className={`min-w-70 md:min-w-90 rounded-3xl bg-linear-to-br ${o.tone} p-4 shadow-soft`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-black">{o.title}</div>
              <div className="mt-1 text-xs text-white/85">{o.subtitle}</div>
            </div>
            <span className="rounded-2xl bg-black/20 px-2 py-1 text-xs font-semibold">Offer</span>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-black/25 px-3 py-2">
            <div className="text-xs text-white/85">Use code</div>
            <div className="font-mono text-sm font-extrabold tracking-wider">{o.code}</div>
          </div>

          <div className="mt-3 text-[11px] text-white/75">
            *Demo only. Replace with your promo engine later.
          </div>
        </div>
      ))}
    </div>
  );
}
