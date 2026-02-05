import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs transition ${
        isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function AppShell() {
  const { user, signout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <button
            onClick={() => nav("/")}
            className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-white/5"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-indigo-500 to-emerald-400 shadow-soft">
              <span className="text-xl font-black">₹</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold leading-4">Deshpay</div>
              <div className="text-xs text-white/60 leading-4">
                Demo (India)
              </div>
            </div>
          </button>         

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold">{user?.name}</div>
              <div className="text-xs text-white/60">{user?.phone}</div>
            </div>
            <button
              onClick={() => {
                signout();
                nav("/signin");
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto w-full max-w-6xl px-4 py-5 pb-28">
        <Outlet />
      </div>

      {/* bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-around px-4 py-3">
          <NavItem to="/" label="Home" icon="🏠" />
          <NavItem to="/explore" label="Pay" icon="🧾" />
          <NavItem to="/history" label="History" icon="🕘" />
          <NavItem to="/privacy" label="Privacy Policy" icon="🧾" />
        </div>
      </div>
    </div>
  );
}
