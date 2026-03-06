import { useContext, useState } from "react";
import { login as loginAPI } from "../api/authApi";
import { AuthContext } from "../../../context/AuthContext";

export const useAuth = () => {
  const { user, login: setUser, logout, isInitializing } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (
    email: string,
    password: string,
    org_code: string,
    category: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginAPI(email, password, org_code, category);

      // restore logged user from cookie
      const me = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
        credentials: "include",
      });

      const meData = await me.json();

      if (meData.success) {
        setUser(meData.data.user);
      }

      return res;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isInitializing,
    login: loginUser, // important
    logout,
    loading,
    error,
  };
};