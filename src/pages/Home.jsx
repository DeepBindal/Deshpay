import React, { useMemo } from "react";
import OfferBanners from "../components/OfferBanners";
import CategoryGrid from "../components/CategoryGrid";
import { readTxns } from "../utils/storage";
import { formatINR } from "../utils/money";

export default function Home() {
  const txns = useMemo(() => readTxns(), []);
  const total = txns.reduce((s, t) => s + Number(t.amount || 0), 0);
  const success = txns.filter((t) => t.status === "SUCCESS").length;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-sm font-extrabold">Offers for you</div>
            <div className="text-xs text-white/50">Swipe →</div>
          </div>
        </div>
        <OfferBanners />
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-sm font-extrabold">Pay & Recharge</div>
            <div className="text-xs text-white/50">All categories</div>
          </div>
        </div>
        <CategoryGrid />
      </div>
    </div>
  );
}
