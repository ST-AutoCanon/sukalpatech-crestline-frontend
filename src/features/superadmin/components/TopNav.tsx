// import { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";

// interface TopNavProps {
//   pageTitle: string;
// }

// export default function TopNav({ pageTitle }: TopNavProps) {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <div className="w-full flex justify-between items-center p-4 bg-white shadow">
//       <div className="text-lg font-semibold text-gray-800">{pageTitle}</div>

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
import { Menu } from "lucide-react";

interface TopNavProps {
  pageTitle: string;
  onMenuClick?: () => void; // optional for mobile
}

export default function TopNav({ pageTitle, onMenuClick }: TopNavProps) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-between bg-white shadow px-4 sm:px-6 py-3">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden text-gray-700">
            <Menu size={22} />
          </button>
        )}

        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hide full name on very small screens */}
        {user && (
          <span className="hidden sm:block text-gray-700 font-medium">
            {user.first_name} {user.last_name}
          </span>
        )}

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
