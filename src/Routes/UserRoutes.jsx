import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Providers from "../pages/Providers";
import PaynetMockCheckout from "../pages/PaynetMockCheckout";
import PaynetReturn from "../pages/PaynetReturn";
import Pay from "../pages/Pay";
import History from "../pages/History";
import ProtectedRoute from "../components/ProtectedRoute";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
      </Route>

      
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/providers/:category" element={<Providers />} />
        <Route path="/mock-paynet/pay/:pid" element={<PaynetMockCheckout />} />
        <Route path="/paynet/return" element={<PaynetReturn />} />
        <Route path="/pay/:category" element={<Pay />} />
        <Route path="/history" element={<History />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default UserRoutes;
