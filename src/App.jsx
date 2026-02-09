import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Providers from "./pages/Providers";
import Pay from "./pages/Pay";
import History from "./pages/History";
import PaynetReturn from "./pages/PaynetReturn";
import PaynetMockCheckout from "./pages/PaynetMockCheckout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useAuthStore } from "./store/auth.store";

export default function App() {
  const initAuth = useAuthStore((s) => s.init);

  useEffect(() => {
    initAuth();
  }, []);
  return (
    <Routes>
      {/* public (with AppShell layout) */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
      </Route>

      {/* public (no shell) */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* protected */}
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
}
