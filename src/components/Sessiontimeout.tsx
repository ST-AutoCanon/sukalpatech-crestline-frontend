import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const SessionTimeout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const SESSION_TIMEOUT = 10 *60* 1000; // Test with 30 seconds

  const handleLogout = async () => {
    alert("Your session has expired due to inactivity. Please login again.");

    await logout(); // Clears cookie + user state

    navigate("/", { replace: true });
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(handleLogout, SESSION_TIMEOUT);
  };

  useEffect(() => {
    if (!user) return;

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [user]);

  return null;
};

export default SessionTimeout;