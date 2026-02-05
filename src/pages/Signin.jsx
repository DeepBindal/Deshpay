import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Signin() {
  const { signin } = useAuth();
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-indigo-500 to-emerald-400">
              <span className="text-xl font-black">₹</span>
            </div>
            <div>
              <div className="text-lg font-extrabold">Welcome back</div>
              <div className="text-sm text-white/60">Sign in to continue</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-xs text-white/60">Mobile number</label>
              <input
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/30"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="text-xs text-white/60">Password</label>
              <input
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/30"
                placeholder="Min 4 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>

            {err && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {err}
              </div>
            )}

            <button
              onClick={async () => {
                setErr("");
                try {
                  await signin({ phone: phone.trim(), password });
                  nav("/");
                } catch (e) {
                  setErr(e.message || "Signin failed");
                }
              }}
              className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-bold shadow-soft hover:opacity-95"
            >
              Sign in
            </button>

            <div className="text-center text-sm text-white/60">
              New here?{" "}
              <Link className="text-white underline decoration-white/30 hover:decoration-white" to="/signup">
                Create account
              </Link>
            </div>

            <div className="text-[11px] text-white/45">
              Demo: any valid Indian mobile + password length 4+ works.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
