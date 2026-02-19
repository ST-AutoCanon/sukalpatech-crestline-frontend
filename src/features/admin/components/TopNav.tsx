// import { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";

// interface TopNavProps {
//   pageTitle: string;
// }

// export default function TopNav({ pageTitle }: TopNavProps) {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <div className="w-full flex justify-between items-center p-4 bg-white shadow">
//       {/* Left side: dynamic page name */}
//       <div className="text-lg font-semibold text-gray-800">{pageTitle}</div>

//       {/* Right side: user info + logout */}
//       <div className="flex items-center gap-4">
//         {user && (
//           <span className="text-gray-800 font-medium">
//             {user.first_name} {user.last_name}
//           </span>
//         )}
//         <button
//           onClick={logout}
//           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }


import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { LogOut } from "lucide-react";

interface TopNavProps {
  pageTitle: string;
}

export default function TopNav({ pageTitle }: TopNavProps) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="w-full bg-white shadow-sm border-b px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Page Title */}
        <div className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
          {pageTitle}
        </div>

        {/* User + Logout */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {user && (
            <div className="text-sm sm:text-base font-medium text-gray-700 truncate">
              {user.first_name} {user.last_name}
            </div>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
