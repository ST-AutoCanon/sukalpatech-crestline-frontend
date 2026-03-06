import { createContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  permissions: string[];
  department_id: number | null;
  category: string;
}

interface AuthContextType {
  user: User | null;
  isInitializing: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isInitializing: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  /* =========================
     🔥 Restore Session From Cookie
  ========================= */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          credentials: "include", // VERY IMPORTANT
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.data.user);
        }
      } catch (err) {
        console.log("No active session");
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  /* =========================
     Login
  ========================= */
  const login = (userData: User) => {
    setUser(userData);
  };

  /* =========================
     Logout
  ========================= */
  const logout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};