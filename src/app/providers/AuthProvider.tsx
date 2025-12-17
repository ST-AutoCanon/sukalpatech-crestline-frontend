import { AuthProvider as ContextProvider } from "../../context/AuthContext";
import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <ContextProvider>{children}</ContextProvider>;
};
