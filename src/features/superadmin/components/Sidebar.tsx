// import { useLocation } from "react-router-dom";
// import { Link } from "react-router-dom";

// export default function Sidebar() {
//   const { pathname } = useLocation();

//   const links = [
//     { name: "Dashboard", path: "/super_admin" },
//     { name: "Create Organisation", path: "/super_admin/create_organisation" },
//   ];

//   return (
//     <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col">
//       <h1 className="text-xl font-semibold mb-6 text-gray-800"> super Admin Panel</h1>

//       <ul className="space-y-3 flex-1">
//         {links.map((link) => {
//           const isActive = pathname.startsWith(link.path);

//           return (
//             <li key={link.path}>
//               <Link
//                 to={link.path}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
//                   ${
//                     isActive
//                       ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
//                       : "bg-white text-gray-800 hover:bg-gray-100"
//                   }
//                 `}
//               >
//                 <span className="text-sm">{link.name}</span>
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }


import { useLocation, Link } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const links = [
    { name: "Dashboard", path: "/super_admin" },
    { name: "Create Organisation", path: "/super_admin/create_organisation" },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col">
      <h1 className="text-xl font-semibold mb-6 text-gray-800">
        Super Admin Panel
      </h1>

      <ul className="space-y-3 flex-1">
        {links.map((link) => {
          const isActive =
            link.path === "/super_admin"
              ? pathname === "/super_admin"
              : pathname.startsWith(link.path);

          return (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-sm">{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
