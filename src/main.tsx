import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import { AuthProvider } from "./app/providers/AuthProvider";
// import AppRoutes from "./app/routes/AppRoutes";
import AppRoutes from "./App";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        {/* <RootRoutes /> */}
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
