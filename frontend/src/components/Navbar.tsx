import { useAuthStore } from "@/stores/useAuthStore";
import { useHanziStore } from "@/stores/useHanziStore";
import { useNavigate, useLocation } from "react-router";
import { LogOut } from "lucide-react";
import GlobalSearch from "./hanzi/GlobalSearch";

const Navbar = () => {
  const { user } = useAuthStore();
  const { resetExplorer } = useHanziStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut } = useAuthStore();

  const isExplorerActive =
    location.pathname === "/" || location.pathname.startsWith("/character");
  const isCollectionActive = location.pathname === "/collection";

  const handleExplorerClick = () => {
    resetExplorer();
    navigate("/");
  };

  const handleCollectionClick = () => {
    resetExplorer(); // Clear any active character so collection shows immediately
    navigate("/collection");
  };

  const handleLogout = async () => {
    await logOut();
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
            handleExplorerClick();
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">字</span>
            <span className="text-sm font-semibold text-foreground hidden sm:inline">
              Hanzi Explorer
            </span>
          </div>
        </a>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center max-w-md mx-4">
          <GlobalSearch />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExplorerClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isExplorerActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
              }`}
          >
            Explorer
          </button>
          <button
            onClick={handleCollectionClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isCollectionActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
              }`}
          >
            My Collection
          </button>
        </div>

        {/* Right: Display name + Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm font-medium text-foreground">
              {user.username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
