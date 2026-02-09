import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="text-lg font-extrabold text-slate-900">
            Create your account
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Mock signup (localStorage)
          </div>

          {/* Form */}
          <div className="mt-6 space-y-3">
            <div>
              <label className="text-xs text-slate-500">Name</label>
              <input
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="Rahul"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Mobile number</label>
              <input
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Password</label>
              <input
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="Min 4 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>

            {err && (
              <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
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
              className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95"
            >
              Create account
            </button>

            <div className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                className="font-medium text-emerald-600 hover:underline"
                to="/signin"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
