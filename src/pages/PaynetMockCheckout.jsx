import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  paynet_get_paypage,
  paynet_complete_payment,
  paynet_return_url_with_reference,
} from "../lib/paynetMockClient";

const METHODS = [
  { id: "UPI", label: "UPI" },
  { id: "CARD", label: "Card" },
  { id: "NETBANKING", label: "Netbanking" },
  { id: "WALLET", label: "Wallet" },
  { id: "PAYLATER", label: "Pay Later" },
];

export default function PaynetMockCheckout() {
  const { pid } = useParams();
  const [paypage, setPaypage] = useState(null);
  const [method, setMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [bank, setBank] = useState("HDFC Bank");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await paynet_get_paypage(pid);
        setPaypage(p);
      } catch {
        setErr("Invalid payment link / PayPage not found.");
      }
    })();
  }, [pid]);

  const amountText = useMemo(() => {
    if (!paypage) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: paypage.currency || "INR",
    }).format(paypage.amount || 0);
  }, [paypage]);

  function decideStatus() {
    // deterministic testing
    // - UPI includes "fail" => FAILED; includes "pending" => PENDING
    // - Card last4 0000 => FAILED; last4 1111 => PENDING
    if (method === "UPI") {
      const v = (upiId || "").toLowerCase();
      if (v.includes("fail")) return "FAILED";
      if (v.includes("pending")) return "PENDING";
      return "COMPLETED";
    }
    if (method === "CARD") {
      const last4 = (cardNo || "").replace(/\s+/g, "").slice(-4);
      if (last4 === "0000") return "FAILED";
      if (last4 === "1111") return "PENDING";
      return "COMPLETED";
    }
    if (method === "NETBANKING") {
      if (bank.toLowerCase().includes("offline")) return "FAILED";
      return "COMPLETED";
    }
    return "COMPLETED";
  }

  async function payNow() {
    if (!paypage) return;
    setErr("");
    setBusy(true);
    try {
      const status = decideStatus();
      await paynet_complete_payment({ p_id: paypage.p_id, status, method });

      // redirect back to your site with payment_reference
      const returnUrl = paynet_return_url_with_reference(
        paypage.return_url,
        paypage.p_id,
      );
      window.location.href = returnUrl;
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (err) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="text-lg font-extrabold">Checkout error</div>
          <div className="mt-2 text-sm text-white/60">{err}</div>
        </div>
      </div>
    );
  }

  if (!paypage) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-sm text-white/60">Loading secure checkout…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* top bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black text-white grid place-items-center font-black">
              PN
            </div>
            <div>
              <div className="text-sm font-extrabold">
                PayNet Secure Checkout (Mock)
              </div>
              <div className="text-xs text-gray-500">
                Invoice #{paypage.p_id}
              </div>
            </div>
          </div>
          <div className="text-sm font-extrabold">{amountText}</div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* offer banner */}
          <div className="rounded-3xl bg-white border shadow-soft p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold">Offers</div>
                <div className="mt-1 text-xs text-gray-600">
                  Demo tip: UPI id containing <b>pending</b> returns pending,
                  containing <b>fail</b> fails.
                </div>
              </div>
              <span className="rounded-2xl bg-gray-100 px-3 py-1 text-xs font-semibold">
                Demo
              </span>
            </div>
          </div>

          {/* methods */}
          <div className="rounded-3xl bg-white border shadow-soft overflow-hidden">
            <div className="border-b px-5 py-4">
              <div className="text-sm font-extrabold">Pay {paypage.title}</div>
              <div className="text-xs text-gray-500">
                Merchant: {paypage.merchant_email}
              </div>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`rounded-2xl px-4 py-2 text-sm border transition ${
                      method === m.id
                        ? "bg-black text-white border-black"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {method === "UPI" && (
                  <>
                    <label className="text-xs font-semibold text-gray-700">
                      UPI ID
                    </label>
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="name@upi"
                      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <div className="text-xs text-gray-500">
                      Try: cashback@upi / pending@upi / fail@upi
                    </div>
                  </>
                )}

                {method === "CARD" && (
                  <>
                    <label className="text-xs font-semibold text-gray-700">
                      Card number
                    </label>
                    <input
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      placeholder="4111 1111 1111 1111"
                      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="rounded-2xl border px-4 py-3 text-sm"
                        placeholder="MM/YY"
                      />
                      <input
                        className="rounded-2xl border px-4 py-3 text-sm"
                        placeholder="CVV"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Test: last4 0000 fail, 1111 pending
                    </div>
                  </>
                )}

                {method === "NETBANKING" && (
                  <>
                    <label className="text-xs font-semibold text-gray-700">
                      Select bank
                    </label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full rounded-2xl border px-4 py-3 text-sm bg-white"
                    >
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>SBI</option>
                      <option>Axis Bank</option>
                      <option>Offline Bank (fail)</option>
                    </select>
                  </>
                )}

                {(method === "WALLET" || method === "PAYLATER") && (
                  <div className="text-sm text-gray-700">
                    Continue to {method === "WALLET" ? "wallet" : "Pay Later"}{" "}
                    (mock).
                  </div>
                )}
              </div>

              <button
                disabled={busy}
                onClick={payNow}
                className="mt-6 w-full rounded-2xl bg-black text-white py-3 font-extrabold disabled:opacity-60"
              >
                {busy ? "Processing…" : `Pay ${amountText}`}
              </button>

              <div className="mt-3 text-xs text-gray-500">
                This is a frontend-only mock gateway (no real payment).
              </div>
            </div>
          </div>
        </div>

        {/* summary */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white border shadow-soft p-5">
            <div className="text-sm font-extrabold">Summary</div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-extrabold">{amountText}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Invoice</span>
              <span className="font-semibold">#{paypage.p_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
