import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="text-lg font-extrabold">Create your account</div>
          <div className="mt-1 text-sm text-white/60">Mock signup (localStorage)</div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-xs text-white/60">Name</label>
              <input
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/30"
                placeholder="Rahul"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                  await signup({ name, phone: phone.trim(), password });
                  nav("/");
                } catch (e) {
                  setErr(e.message || "Signup failed");
                }
              }}
              className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold shadow-soft hover:opacity-95"
            >
              Create account
            </button>

            <div className="text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link className="text-white underline decoration-white/30 hover:decoration-white" to="/signin">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
