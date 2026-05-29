import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Menu, Bell } from "lucide-react";
import avatarimage from "../../../assets/avatar.jpg";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002";

const socket = io(BACKEND_URL, {
  withCredentials: true,
});

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface TopNavProps {
  pageTitle: string;
  onMenuClick?: () => void;
}

export default function TopNav({ pageTitle, onMenuClick }: TopNavProps) {
  const { user, logout } = useContext(AuthContext);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fetch initial notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/notifications`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark notification read
  const markAsRead = async (id: number) => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Join socket rooms
    socket.emit("join_role", user.role);
    socket.emit("join_user", user.id);

    // Listen for new notifications
    socket.on("new_notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [user]);

  return (
    <header className="min-h screen w-full bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
      {/* LEFT */}
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

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        {/* 🔔 BELL */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative text-white p-2 rounded hover:bg-white/20 transition"
          >
            <Bell size={22} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg max-h-96 overflow-y-auto z-50">
              {notifications.length === 0 && (
                <p className="p-3 text-gray-500 text-sm">No notifications</p>
              )}

              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                    notif.is_read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <p className="font-medium text-gray-800">{notif.title}</p>

                  <p className="text-gray-600 text-sm">{notif.message}</p>

                  <p className="text-gray-400 text-xs">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USER */}
        {user && (
          <div className="flex items-center gap-3 border border-white/40 rounded-full px-3 py-2 text-white">
            <img
              src={avatarimage}
              alt="avatar"
              className="h-9 w-9 rounded-full border border-white/50"
            />

            <span className="hidden sm:block text-sm font-medium truncate max-w-[150px]">
              {user.first_name ?? "User"}
            </span>
          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="border border-white/60 text-white rounded-full px-4 py-2 text-sm hover:bg-white hover:text-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
