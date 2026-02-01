import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, isLoading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    // Get fresh state to avoid stale closure issues
    const currentToken = useAuthStore.getState().accessToken;

    if (!currentToken) {
      // No token - try to refresh (refresh calls fetchMe internally if successful)
      await refresh();
    } else if (!useAuthStore.getState().user) {
      // Have token but no user data - fetch it
      await fetchMe();
    }

    setStarting(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    init();
  }, []);

  if (starting || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;
