import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, CreditCard, History, Shield, LogOut } from "lucide-react";
import { useAuthStore } from "../store/auth.store";

/* ============================
   Bottom Nav Item Component
============================ */
const NavItem = ({ to, label, Icon, end, badge }) => {
  return (
    <NavLink to={to} end={end}>
      {({ isActive }) => (
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl px-5 py-2 text-xs transition-all duration-300 ${
            isActive ? "text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {/* Active Background */}
          {isActive && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-2xl bg-slate-900 shadow-md"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          <div className="relative flex items-center justify-center">
            <Icon size={20} />
            {badge && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </div>

          <span className="relative font-medium">{label}</span>
        </motion.div>
      )}
    </NavLink>
  );
};

/* ============================
   Main App Shell
============================ */
export default function AppShell() {
  const nav = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 text-slate-900">
      {/* ============================
          Top Bar
      ============================ */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <button
            onClick={() => nav("/")}
            className="flex items-center gap-2 rounded-xl transition hover:scale-105"
          >
            <img
              src="/deshpays_logo.png"
              alt="DeshPays"
              className="h-12 w-auto"
            />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-slate-900">
                {user?.name}
              </div>
              <div className="text-xs text-slate-500">{user?.phone}</div>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={async () => {
                await logout();
                nav("/signin", { replace: true });
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* ============================
          Main Content
      ============================ */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-32">
        <Outlet />
      </div>

      {/* ============================
          Floating Bottom Nav
      ============================ */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="flex w-full max-w-4xl items-center justify-around rounded-3xl border border-white/40 bg-white/70 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <NavItem to="/" label="Home" Icon={Home} end />
          <NavItem to="/explore" label="Pay" Icon={CreditCard} />
          <NavItem to="/history" label="History" Icon={History} badge={2} />
          <NavItem to="/privacy" label="Privacy" Icon={Shield} />
        </div>
      </div>
    </div>
  );
}
