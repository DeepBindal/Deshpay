import React from "react";
import CategoryGrid from "../components/CategoryGrid";
import OfferBanners from "../components/OfferBanners";

export default function Explore() {
  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
        <div className="text-lg font-extrabold">Explore billers</div>
        <div className="mt-1 text-sm text-white/60">Pick a category → choose provider → pay</div>
      </div>

      <OfferBanners />
      <CategoryGrid />
    </div>
  );
}
