import { createContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  permissions: string[];
  department_id: number | null;
  category:string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isInitializing: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isInitializing: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  

  // 🔹 Restore auth state from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    // ✅ important: unblock routing AFTER restore
    setIsInitializing(false);
  }, []);

  // 🔹 Login handler
  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // 🔹 Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
