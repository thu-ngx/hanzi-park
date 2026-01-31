import { useNavigate } from "react-router";
import { Bookmark, ChevronDown, LogOut } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserAccountNav = () => {
  const { user, logOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/", { replace: true });
    logOut();
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => navigate("/collection")}
        size="sm"
        className="hidden sm:inline-flex"
      >
        My Collection
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 outline-none">
            <span className="max-w-30 truncate">
              {user?.username ?? "Account"}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => navigate("/collection")}
            className="sm:hidden"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            My Collection
          </DropdownMenuItem>
          <DropdownMenuSeparator className="sm:hidden" />
          <DropdownMenuItem
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
