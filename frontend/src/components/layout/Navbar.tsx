import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCharacterStore } from "@/features/character/store/useCharacterStore";
import { useNavigate, useLocation } from "react-router";
import { LogOut, ChevronDown, Bookmark } from "lucide-react";
import GlobalSearch from "@/features/character/components/GlobalSearch";

const Navbar = () => {
  const { user, accessToken, logOut } = useAuthStore();
  const { resetExplorer } = useCharacterStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === "/";
  const isCollectionActive = location.pathname === "/collection";
  const isLoggedIn = !!accessToken;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="flex flex-1 justify-center max-w-30 sm:max-w-md mx-2 sm:mx-4">
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
              {/* My Collection - desktop only */}
              <button
                onClick={handleCollectionClick}
                className={`hidden sm:block px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  isCollectionActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                }`}
              >
                My Collection
              </button>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-gray-100"
                >
                  {user && (
                    <span className="text-foreground">{user.username}</span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {/* My Collection - mobile only in dropdown */}
                    <button
                      onClick={() => {
                        handleCollectionClick();
                        setDropdownOpen(false);
                      }}
                      className={`sm:hidden w-full flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors ${
                        isCollectionActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-gray-100"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      My Collection
                    </button>
                    <div className="sm:hidden border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
