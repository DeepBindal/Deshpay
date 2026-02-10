import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../admin/layout/AdminLayout";
import Users from "../admin/pages/Users";
import AdminProviders from "../admin/pages/Providers";
import AdminTransactions from "../admin/pages/Transactions";
import AdminBanners from "../admin/pages/Banners";
import Landing from "../admin/pages/Landing";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="users" element={<Users />} />
        <Route path="providers" element={<AdminProviders />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="dashboard" element={<AdminTransactions />} />
        <Route path="banners" element={<AdminBanners />} />

        <Route path="*" element={<Navigate to="users" replace />} />
      </Routes>
    </AdminLayout>
  );
}
