
// import React, { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useEmployee } from "../hooks/useEmployee";

// export default function EmployeeDashboard() {
//   const { user, token } = useContext(AuthContext);

//   // useEmployee hook handles fetching employee's assigned departments
//   const { departments, loading } = useEmployee(user?.email || "", token || "");

//   if (loading) return <h3 style={{ padding: 20 }}>Loading dashboard...</h3>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Welcome {user?.first_name} 👋</h2>
//       <h3>Your Assigned Departments</h3>

//       {departments.length === 0 ? (
//         <p style={{ opacity: 0.6 }}>No department assigned</p>
//       ) : (
//         <ul>
//           {departments.map((dept) => (
//             <li key={dept.id} style={{ marginBottom: 6 }}>
//               <b>{dept.name}</b>
//               {dept.permission && <span> — Permission: {dept.permission}</span>}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }



// import React, { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useEmployee } from "../hooks/useEmployee";

// export default function EmployeeDashboard() {
//   const { user, token } = useContext(AuthContext);

//   // ✅ Guard: don't call hook if user or token is null
//   const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");

//   if (!user) return <h3 style={{ padding: 20 }}>Loading user...</h3>;
//   if (loading) return <h3 style={{ padding: 20 }}>Loading dashboard...</h3>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Welcome {user.first_name} 👋</h2>
//       <h3>Your Assigned Departments</h3>

//       {departments.length === 0 ? (
//         <p style={{ opacity: 0.6 }}>No department assigned</p>
//       ) : (
//         <ul>
//           {departments.map((dept) => (
//             <li key={dept.id}>
//               <b>{dept.name}</b>
//               {dept.permission && <span> — Permission: {dept.permission}</span>}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }






// // // src/features/user/pages/EmployeeDashboard.tsx
// import React, {useEffect, useContext, useState } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";
// import { useEmployee } from "../hooks/useEmployee";

// export default function EmployeeDashboard() {
//   const { user, token } = useContext(AuthContext);

//   // ✅ Guard: only call hook if user & token exist
//   const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");

//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

    
    
//        useEffect(() => {
//          const fetchAllDepartments = async () => {
//            if (!token) return;

//            try {
//              const res = await fetch(
//                `http://localhost:5000/api/departments`,
//                {
//                  headers: { Authorization: `Bearer ${token}` },
//                }
//              );
//              const json = await res.json();
//              console.log("All departments:", json.data); // ✅ log departments
//            } catch (err) {
//              console.error("Failed to fetch all departments:", err);
//            }
//          };

//          fetchAllDepartments();
//        }, [token]);
    
//   if (!user) return <h3 className="p-6 text-lg">Loading user...</h3>;
//   if (loading) return <h3 className="p-6 text-lg">Loading dashboard...</h3>;

    
    
    
    
//   // Map department names to route paths
//   const deptRoutes: Record<string, string> = {
//     procurement: "/employee/procurement",
//     store: "/employee/store",
//     "buisness development": "/employee/business-analysis",
//     fessibility: "/employee/feasibility",
//     finance: "/employee/finance",
//     };
    
 


//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`transition-all duration-300 ${
//           sidebarOpen ? "w-56" : "w-0"
//         } bg-gray-100 p-6 overflow-hidden`}
//       >
//         <h2 className="text-xl font-bold mb-6">Dashboard</h2>
//         <nav>
//           <ul className="space-y-3">
//             {departments.length === 0 && (
//               <li className="text-gray-500">No department assigned</li>
//             )}

//             {departments.map((dept) => {
//               const route = deptRoutes[dept.name.toLowerCase()];
//               if (!route) return null; // skip unknown departments
//               const active = location.pathname === route;

//               return (
//                 <li key={dept.id}>
//                   <Link
//                     to={route}
//                     className={`block px-3 py-2 rounded-md font-medium ${
//                       active ? "bg-blue-500 text-white" : "text-gray-800 hover:bg-blue-100"
//                     }`}
//                   >
//                     {dept.name}{" "}
//                     {dept.permission && (
//                       <span className="text-xs text-gray-600">({dept.permission})</span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h2 className="text-2xl font-semibold mb-4">Welcome {user.first_name} 👋</h2>
//         <h3 className="text-lg font-medium mb-4">Your Departments</h3>

//         {departments.length === 0 ? (
//           <p className="text-gray-500">No department assigned</p>
//         ) : (
//           <ul className="space-y-2 mb-6">
//             {departments.map((dept) => (
//               <li key={dept.id} className="text-gray-800">
//                 <span className="font-semibold">{dept.name}</span>{" "}
//                 {dept.permission && (
//                   <span className="text-gray-600">— {dept.permission}</span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* Department page content */}
//         <div>
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }





// // src/features/user/pages/EmployeeDashboard.tsx
// import React, { useEffect, useContext, useState } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";
// import { useEmployee } from "../hooks/useEmployee";

// export default function EmployeeDashboard() {
//   const { user, token } = useContext(AuthContext);

//   // Only call hook if user & token exist
//   const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");

//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // Fetch all departments for debugging/logging
//   useEffect(() => {
//     const fetchAllDepartments = async () => {
//       if (!token) return;

//       try {
//         const res = await fetch(`http://localhost:5000/api/departments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json();
//         console.log("All departments:", json.data);
//       } catch (err) {
//         console.error("Failed to fetch all departments:", err);
//       }
//     };

//     fetchAllDepartments();
//   }, [token]);

//   if (!user) return <h3 className="p-6 text-lg">Loading user...</h3>;
//   if (loading) return <h3 className="p-6 text-lg">Loading dashboard...</h3>;

//   // Map API names to normalized keys (handle typos / variations)
// const apiNameToKey: Record<string, string> = {
//   procurement: "procurement",
//   store: "store",
//   "buisness development": "business-development",
//   fessibility: "feasibility",
//   feasibility: "feasibility",
//     finance: "finance",
//   bd:"bd"
// };


//   // Map normalized keys to routes
//   const deptRoutes: Record<string, string> = {
//     procurement: "/employee/procurement",
//     store: "/employee/store",
//     "business-development": "/employee/business-analysis",
//     feasibility: "/employee/feasibility",
//     finance: "/employee/finance",
//     bd: "/employee/business-analysis",
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`transition-all duration-300 ${
//           sidebarOpen ? "w-56" : "w-0"
//         } bg-gray-100 p-6 overflow-hidden`}
//       >
//         <h2 className="text-xl font-bold mb-6">Dashboard</h2>
//         <nav>
//           <ul className="space-y-3">
//             {departments.length === 0 && (
//               <li className="text-gray-500">No department assigned</li>
//             )}

//             {departments.map((dept) => {
//               const key = apiNameToKey[dept.name.toLowerCase()];
//               if (!key) return null; // skip unknown departments
//               const route = deptRoutes[key];
//               const active = location.pathname === route;

//               return (
//                 <li key={dept.id}>
//                   <Link
//                     to={route}
//                     className={`block px-3 py-2 rounded-md font-medium ${
//                       active
//                         ? "bg-blue-500 text-white"
//                         : "text-gray-800 hover:bg-blue-100"
//                     }`}
//                   >
//                     {dept.name}{" "}
//                     {dept.permission && (
//                       <span className="text-xs text-gray-600">
//                         ({dept.permission})
//                       </span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h2 className="text-2xl font-semibold mb-4">
//           Welcome {user.first_name} 👋
//         </h2>
//         <h3 className="text-lg font-medium mb-4">Your Departments</h3>

//         {departments.length === 0 ? (
//           <p className="text-gray-500">No department assigned</p>
//         ) : (
//           <ul className="space-y-2 mb-6">
//             {departments.map((dept) => (
//               <li key={dept.id} className="text-gray-800">
//                 <span className="font-semibold">{dept.name}</span>{" "}
//                 {dept.permission && (
//                   <span className="text-gray-600">— {dept.permission}</span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* Department page content */}
//         <div>
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }



// import React, { useEffect, useContext, useState } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";
// import { useEmployee } from "../hooks/useEmployee";
// import TopNav from "../components/TopNav";

// export default function EmployeeDashboard() {
//   const { user, token } = useContext(AuthContext);
//   const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // API name normalization
//   const apiNameToKey: Record<string, string> = {
//     procurement: "procurement",
//     store: "store",
//     "buisness development": "business-development",
//     fessibility: "feasibility",
//     feasibility: "feasibility",
//     finance: "finance",
//     bd: "bd",
//   };

//   // Normalized keys → routes
//   const deptRoutes: Record<string, string> = {
//     procurement: "/employee/procurement",
//     store: "/employee/store",
//     "business-development": "/employee/business-analysis",
//     feasibility: "/employee/feasibility",
//     finance: "/employee/finance",
//     bd: "/employee/business-analysis",
//   };

//   // Static dashboard route
//   const dashboardRoute = "/employee/dashboard";

//   // Helper to check active route
//   const isActive = (path: string) => location.pathname === path;

//   if (!user) return <h3 className="p-6 text-lg">Loading user...</h3>;
//   if (loading) return <h3 className="p-6 text-lg">Loading dashboard...</h3>;

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`transition-all duration-300 ${
//           sidebarOpen ? "w-56" : "w-0"
//         } bg-gray-100 p-6 overflow-hidden flex flex-col`}
//       >
//         <h2 className="text-xl font-bold mb-6 text-gray-800">Employee Panel</h2>

//         <nav className="flex-1">
//           <ul className="space-y-3">
//             {/* Static Dashboard Link */}
//             <li>
//               <Link
//                 to={dashboardRoute}
//                 className={`block px-3 py-2 rounded-md font-medium ${
//                   isActive(dashboardRoute)
//                     ? "bg-blue-500 text-white"
//                     : "text-gray-800 hover:bg-gray-200"
//                 }`}
//               >
//                 Dashboard
//               </Link>
//             </li>

//             {/* Dynamic Department Links */}
//             {departments.length === 0 && (
//               <li className="text-gray-500">No department assigned</li>
//             )}

//             {departments.map((dept) => {
//               const key = apiNameToKey[dept.name.toLowerCase()];
//               if (!key) return null;
//               const route = deptRoutes[key];
//               return (
//                 <li key={dept.id}>
//                   <Link
//                     to={route}
//                     className={`block px-3 py-2 rounded-md font-medium ${
//                       isActive(route)
//                         ? "bg-blue-500 text-white"
//                         : "text-gray-800 hover:bg-gray-200"
//                     }`}
//                   >
//                     {dept.name}{" "}
//                     {dept.permission && (
//                       <span className="text-xs text-gray-600">
//                         ({dept.permission})
//                       </span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h2 className="text-2xl font-semibold mb-4">
//           Welcome {user.first_name} 👋
//         </h2>
//         <Outlet /> {/* Nested routes will render here */}
//       </main>
//     </div>
//   );
// }



// src/features/user/pages/EmployeeDashboard.tsx
import React, { useEffect, useContext, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useEmployee } from "../hooks/useEmployee";
import TopNav from "../components/TopNav";

export default function EmployeeDashboard() {
  const { user, token } = useContext(AuthContext);

  const { departments, loading } = useEmployee(user?.email ?? "", token ?? "");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Map API names to normalized keys
  const apiNameToKey: Record<string, string> = {
    procurement: "procurement",
    store: "store",
    "buisness development": "business-development",
    fessibility: "feasibility",
    feasibility: "feasibility",
    finance: "finance",
    bd: "bd",
  };

  // Map normalized keys to routes
  const deptRoutes: Record<string, string> = {
    procurement: "/employee/procurement",
    store: "/employee/store",
    "business-development": "/employee/business-analysis",
    feasibility: "/employee/feasibility",
    finance: "/employee/finance",
    bd: "/employee/business-analysis",
  };

  // Map route → display name for TopNav
  const departmentNames: Record<string, string> = {
    "/employee/procurement": "Procurement",
    "/employee/store": "Store",
    "/employee/business-analysis": "Business Analysis",
    "/employee/feasibility": "Feasibility",
    "/employee/finance": "Finance",
    "/employee/dashboard": "Dashboard",
  };

  if (!user) return <h3 className="p-6 text-lg">Loading user...</h3>;
  if (loading) return <h3 className="p-6 text-lg">Loading dashboard...</h3>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-0"
        } bg-gray-100 p-6 overflow-hidden flex flex-col`}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800">Employee Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-3">
            {/* Static Dashboard Link */}
            <li>
              <Link
                to="/employee/dashboard"
                className={`block px-3 py-2 rounded-md font-medium ${
                  location.pathname === "/employee/dashboard"
                    ? "bg-blue-500 text-white"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Dashboard
              </Link>
            </li>

            {/* Departments */}
            {departments.length === 0 && (
              <li className="text-gray-500">No department assigned</li>
            )}

            {departments.map((dept) => {
              const key = apiNameToKey[dept.name.toLowerCase()];
              if (!key) return null;
              const route = deptRoutes[key];
              const active = location.pathname === route;

              return (
                <li key={dept.id}>
                  <Link
                    to={route}
                    className={`block px-3 py-2 rounded-md font-medium ${
                      active
                        ? "bg-blue-500 text-white"
                        : "text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {dept.name}{" "}
                    {dept.permission && (
                      <span className="text-xs text-gray-600">
                        ({dept.permission})
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* TopNav */}
        <TopNav departmentNames={departmentNames} />

        <main className="flex-1 p-6 overflow-auto">
         

          {/* Nested routes render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

