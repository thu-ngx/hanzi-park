import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

/**
 * Guard for guest-only routes (login, signup)
 * Redirects to home if user is already logged in
 * Attempts silent refresh to check for existing session
 */
const GuestRoute = () => {
  const { accessToken, refresh } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Only attempt to refresh if we don't have a token yet
      if (!accessToken) {
        try {
          await refresh({ silent: true });
        } catch {
          // If refresh fails, they are a guest; proceed to render the route
          console.debug("Guest verification: No active session found.");
        }
      }
      setChecking(false);
    };

    checkAuth();
  }, [accessToken, refresh]); 

  if (checking) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <p className="text-gray-500">Checking session...</p>
      </div>
    );
  }

  // If we have a token (either initially or after refresh), redirect to home
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;