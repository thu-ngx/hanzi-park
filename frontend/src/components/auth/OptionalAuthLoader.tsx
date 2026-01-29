import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

const OptionalAuthLoader = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    // Try to refresh token if not logged in
    if (!accessToken) {
      try {
        await refresh();
      } catch {
        // user is just not logged in
      }
    }

    if (accessToken && !user) {
      try {
        await fetchMe();
      } catch {
        // user is just not logged in
      }
    }

    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <Outlet />;
};

export default OptionalAuthLoader;
