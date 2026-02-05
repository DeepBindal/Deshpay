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
      <div className="rounded-[28px] border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl font-extrabold">Pay bills in seconds</div>
            <div className="mt-1 text-sm text-white/60">
              Real-feel UI + mock bill fetch + placeholder payment gateway.
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-black/20 px-4 py-3">
              <div className="text-xs text-white/60">Txns</div>
              <div className="text-sm font-bold">{txns.length}</div>
            </div>
            <div className="rounded-2xl bg-black/20 px-4 py-3">
              <div className="text-xs text-white/60">Success</div>
              <div className="text-sm font-bold">{success}</div>
            </div>
            <div className="rounded-2xl bg-black/20 px-4 py-3">
              <div className="text-xs text-white/60">Paid</div>
              <div className="text-sm font-bold">{formatINR(total)}</div>
            </div>
          </div>
        </div>
      </div>

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
