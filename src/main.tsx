// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./app/routes/AppRoutesOriginal";
// import "./index.css";
// import { AuthProvider } from "./app/providers/AuthProvider";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   </React.StrictMode>
// );




import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RootRoutes from "./app/routes/RootRoutes"; // ✅ NEW

import "./styles/globals.css";
import { AuthProvider } from "./app/providers/AuthProvider";
import AppRoutes from "./app/routes/AppRoutes";

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
