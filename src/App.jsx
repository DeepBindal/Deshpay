import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import { useAuthStore } from "./store/auth.store";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const initAuth = useAuthStore((s) => s.init);

  useEffect(() => {
    initAuth();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        <Route path="/*" element={<UserRoutes />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
