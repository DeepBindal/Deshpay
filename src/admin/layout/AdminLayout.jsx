import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Users", to: "/admin/users" },
  { label: "Providers", to: "/admin/providers" },
  { label: "Banners", to: "/admin/banners" },
  { label: "Transactions", to: "/admin/transactions" },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white sm:block">
          <div className="flex h-full flex-col p-5">
            {/* Brand */}
            <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Admin Panel
              </div>
              <div className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
                Pringo Apps
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <span>{item.label}</span>

                  {/* tiny active indicator */}
                  {location.pathname === item.to && (
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Tip
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Use the sidebar to manage users, providers and banners.
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
