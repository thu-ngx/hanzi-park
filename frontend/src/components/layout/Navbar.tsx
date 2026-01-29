import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCharacterStore } from "@/features/character/store/useCharacterStore";
import { useNavigate, useLocation } from "react-router";
import { LogOut } from "lucide-react";
import GlobalSearch from "@/features/character/components/GlobalSearch";

const Navbar = () => {
  const { user, accessToken, logOut } = useAuthStore();
  const { resetExplorer } = useCharacterStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isCollectionActive = location.pathname === "/collection";
  const isLoggedIn = !!accessToken;

  const handleLogoClick = () => {
    resetExplorer();
    navigate("/");
  };

  const handleCollectionClick = () => {
    resetExplorer();
    navigate("/collection");
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLogoClick();
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">字</span>
            <span className="text-md md:text-lg text-primary font-semibold">
              Hanzi Park
            </span>
          </div>
        </a>

        {/* Center: Search (only show when not on home page) */}
        {!isHomePage && (
          <div className="flex flex-1 justify-center max-w-[120px] sm:max-w-md mx-2 sm:mx-4">
            <div className="hidden sm:block w-full">
              <GlobalSearch />
            </div>
            <div className="sm:hidden w-full">
              <GlobalSearch compact />
            </div>
          </div>
        )}

        {/* Navigation + Auth */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* My Collection - only when logged in */}
              <button
                onClick={handleCollectionClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  isCollectionActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                }`}
              >
                My Collection
              </button>

              {/* Username */}
              {user && (
                <span className="text-sm font-medium text-foreground">
                  {user.username}
                </span>
              )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            /* Login button - only when not logged in */
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
