// import { useState, useEffect } from "react";
// import { login as loginAPI } from "../api/authApi";

// export const useAuth = () => {
//   // Load user from localStorage initially
//   const [user, setUser] = useState<any>(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await loginAPI(email, password);
//       setUser(data.data.user);

//       // Save user & token in localStorage
//       localStorage.setItem("user", JSON.stringify(data.data.user));
//       localStorage.setItem("token", data.data.token);

//       return data;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return { user, login, logout, loading, error };
// };






// import { useContext, useState } from "react";
// import { login as loginAPI } from "../api/authApi";
// import { AuthContext } from "../../../context/AuthContext";

// export const useAuth = () => {
//   const { user, login, logout, isInitializing } = useContext(AuthContext);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loginUser = async (email: string, password: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await loginAPI(email, password);
//       login(res.data.user, res.data.token); // context owns storage
//       return res;
//     } catch (err: any) {
//       setError(err.message || "Login failed");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { user, isInitializing, login: loginUser, logout, loading, error };
// };



// import { useContext, useState } from "react";
// import { login as loginAPI } from "../api/authApi";
// import { AuthContext } from "../../../context/AuthContext";

// export const useAuth = () => {
//   const { user, login, logout, isInitializing } = useContext(AuthContext);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loginUser = async (
//     email: string,
//     password: string,
//     org_code: string
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await loginAPI(email, password, org_code);
//       login(res.data.user, res.data.token); // context owns storage
//       return res;
//     } catch (err: any) {
//       setError(err.message || "Login failed");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { user, isInitializing, login: loginUser, logout, loading, error };
// };



import { useContext, useState } from "react";
import { login as loginAPI } from "../api/authApi";
import { AuthContext } from "../../../context/AuthContext";

export const useAuth = () => {
  const { user, login, logout, isInitializing } = useContext(AuthContext);
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
      // login(res.data.user, res.data.token); // context owns storage
      login(res.data.user);
      return res;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, isInitializing, login: loginUser, logout, loading, error };
};
