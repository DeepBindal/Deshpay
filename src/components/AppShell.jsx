import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs transition ${
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:text-slate-900"
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
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* top bar */}
      <div className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <button
            onClick={() => nav("/")}
            className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-slate-100"
          >
            <img
              src="/deshpays_logo.png"
              alt="DeshPays"
              className="h-14 w-auto"
            />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-slate-900">
                {user?.name}
              </div>
              <div className="text-xs text-slate-500">{user?.phone}</div>
            </div>

            <button
              onClick={() => {
                signout();
                nav("/signin");
              }}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
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
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur">
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
