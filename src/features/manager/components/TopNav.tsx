import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Menu } from "lucide-react";
import avatarimage from "../../../assets/avatar.jpg";

interface TopNavProps {
  pageTitle: string;
  onMenuClick?: () => void; // optional for mobile
}

export default function TopNav({ pageTitle, onMenuClick }: TopNavProps) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="w-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
      {/* LEFT - PAGE TITLE + MOBILE MENU */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-white p-2 rounded hover:bg-white/20 transition"
          >
            <Menu size={22} />
          </button>
        )}
        <h1 className="text-white text-lg sm:text-2xl font-semibold truncate">
          {pageTitle}
        </h1>
      </div>

      {/* RIGHT - USER BOX + LOGOUT */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* USER INFO */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 border border-white/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white">
            <img
              src={avatarimage}
              alt="avatar"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-white/50"
            />
            {/* Hide full name on extra small screens */}
            <span className="hidden sm:block text-sm sm:text-base font-medium truncate max-w-[100px] sm:max-w-[150px]">
              {user.first_name ?? "User"}
            </span>
          </div>
        )}

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="border border-white/60 text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base hover:bg-white hover:text-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}