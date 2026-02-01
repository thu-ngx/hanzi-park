import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Navigate, Outlet } from "react-router";

/**
 * Guard for guest-only routes (login, signup)
 * Redirects to home if user is already logged in
 */
const GuestRoute = () => {
  const { accessToken } = useAuthStore();

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;