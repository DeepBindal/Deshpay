import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function Signup() {
  const signup = useAuthStore((s) => s.signup);
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [fieldErr, setFieldErr] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const phoneDigits = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const validate = () => {
    const next = { name: "", phone: "", password: "" };

    const n = name.trim();
    if (!n) next.name = "Name is required";
    else if (n.length < 2) next.name = "Name must be at least 2 characters";
    else if (n.length > 40) next.name = "Name must be under 40 characters";
    else if (!/^[a-zA-Z][a-zA-Z\s.'-]*$/.test(n))
      next.name = "Name can contain letters and spaces only";

    const p = phoneDigits.trim();
    if (!p) next.phone = "Mobile number is required";
    else if (p.length !== 10)
      next.phone = "Enter a valid 10-digit mobile number";
    else if (/^0+$/.test(p)) next.phone = "Enter a valid mobile number";

    const pw = password;
    if (!pw) next.password = "Password is required";
    else if (pw.length < 4)
      next.password = "Password must be at least 4 characters";
    else if (pw.length > 64)
      next.password = "Password must be under 64 characters";

    setFieldErr(next);
    return !next.name && !next.phone && !next.password;
  };

  const onSubmit = async () => {
    setErr("");
    if (!validate()) return;

    try {
      setLoading(true);
      await signup({ name: name.trim(), phone: phoneDigits, password });
      nav("/");
    } catch (e) {
      setErr(e?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="text-lg font-extrabold text-slate-900">
            Create your account
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500">Name</label>
              <input
                className={`mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 ${
                  fieldErr.name
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-300 focus:border-emerald-400 focus:ring-emerald-100"
                }`}
                placeholder="Rahul"
                value={name}
                onChange={(e) => {
                  setErr("");
                  setFieldErr((s) => ({ ...s, name: "" }));
                  setName(e.target.value);
                }}
                onBlur={validate}
                autoComplete="name"
              />
              {fieldErr.name && (
                <div className="mt-1 text-xs text-rose-600">
                  {fieldErr.name}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-500">Mobile number</label>
              <input
                className={`mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 ${
                  fieldErr.phone
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-300 focus:border-emerald-400 focus:ring-emerald-100"
                }`}
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => {
                  setErr("");
                  setFieldErr((s) => ({ ...s, phone: "" }));
                  const next = e.target.value;
                  if (next.length <= 14) setPhone(next); // allows spaces/dashes while typing
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
                    : "border-slate-300 focus:border-emerald-400 focus:ring-emerald-100"
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
                autoComplete="new-password"
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
              className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
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
