import React, { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

const LS_KEY = "billpay_demo_auth_v1";

function readAuth() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeAuth(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readAuth()?.user ?? null);

  const signin = async ({ phone, password }) => {
    // demo logic: accept any phone + password >= 4 chars
    if (!/^[6-9]\d{9}$/.test(phone))
      throw new Error("Enter valid 10-digit Indian mobile number");
    if (!password || password.length < 4)
      throw new Error("Password must be 4+ chars");

    const next = {
      user: { name: "Rahul", phone: `+91 ${phone}` },
      token: "demo_token",
    };
    writeAuth(next);
    setUser(next.user);
    return next.user;
  };

  const signup = async ({ name, phone, password }) => {
    if (!name || name.trim().length < 2) throw new Error("Enter name");
    if (!/^[6-9]\d{9}$/.test(phone))
      throw new Error("Enter valid 10-digit Indian mobile number");
    if (!password || password.length < 4)
      throw new Error("Password must be 4+ chars");

    const next = {
      user: { name: name.trim(), phone: `+91 ${phone}` },
      token: "demo_token",
    };
    writeAuth(next);
    setUser(next.user);
    return next.user;
  };

  const signout = () => {
    localStorage.removeItem(LS_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, signin, signup, signout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
