import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useNavigate, useLocation } from "react-router";
import GlobalSearch from "@/features/character/components/GlobalSearch";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { UserAccountNav } from "@/components/layout/UserAccountNav";

const Navbar = () => {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHomePage = pathname === "/";
  const isLoggedIn = !!accessToken;

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <BrandLogo />

        {/* Center: Search (only show when not on home page) */}
        {!isHomePage && (
          <div className="flex-1 max-w-md mx-auto">
            <GlobalSearch compact />
          </div>
        )}

        {/* Navigation + Auth */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <UserAccountNav />
          ) : (
            <Button onClick={() => navigate("/login")} size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
