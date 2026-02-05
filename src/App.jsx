import React from "react";
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

export default function App() {
  return (
    <Routes>
      {/* public */}
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
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
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
