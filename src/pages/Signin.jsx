import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function Signin() {
  const login = useAuthStore((s) => s.login);
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [fieldErr, setFieldErr] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  // keep only digits
  const phoneDigits = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const validate = () => {
    const next = { phone: "", password: "" };

    const p = phoneDigits.trim();
    if (!p) next.phone = "Mobile number is required";
    else if (p.length !== 10)
      next.phone = "Enter a valid 10-digit mobile number";
    else if (/^0+$/.test(p)) next.phone = "Enter a valid mobile number";

    const pw = password;
    if (!pw) next.password = "Password is required";
    else if (pw.length < 4)
      next.password = "Password must be at least 4 characters";

    setFieldErr(next);
    return !next.phone && !next.password;
  };

  const onSubmit = async () => {
    setErr("");
    if (!validate()) return;

    try {
      setLoading(true);
      await login({ phone: phoneDigits, password });
      nav("/");
    } catch (e) {
      setErr(e?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-indigo-500 to-emerald-400 text-white">
              <span className="text-xl font-black">₹</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">
                Welcome back
              </div>
              <div className="text-sm text-slate-500">Sign in to continue</div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-6 space-y-3">
            <div>
              <label className="text-xs text-slate-500">Mobile number</label>
              <input
                className={`mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 ${
                  fieldErr.phone
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-300 focus:border-indigo-400 focus:ring-indigo-100"
                }`}
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => {
                  setErr("");
                  setFieldErr((s) => ({ ...s, phone: "" }));
                  // allow typing with spaces/dashes but keep it sane
                  const next = e.target.value;
                  if (next.length <= 14) setPhone(next);
                }}
                onBlur={validate}
                inputMode="numeric"
                autoComplete="tel"
              />
              {fieldErr.phone && (
                <div className="mt-1 text-xs text-rose-600">
                  {fieldErr.phone}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-500">Password</label>
              <input
                className={`mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 ${
                  fieldErr.password
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-300 focus:border-indigo-400 focus:ring-indigo-100"
                }`}
                placeholder="Min 4 chars"
                value={password}
                onChange={(e) => {
                  setErr("");
                  setFieldErr((s) => ({ ...s, password: "" }));
                  setPassword(e.target.value);
                }}
                onBlur={validate}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmit();
                }}
                type="password"
                autoComplete="current-password"
              />
              {fieldErr.password && (
                <div className="mt-1 text-xs text-rose-600">
                  {fieldErr.password}
                </div>
              )}
            </div>

            {err && (
              <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {err}
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={onSubmit}
              className={`w-full rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-sm text-slate-500">
              New here?{" "}
              <Link
                className="font-medium text-indigo-600 hover:underline"
                to="/signup"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
