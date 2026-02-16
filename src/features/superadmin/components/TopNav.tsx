import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

interface TopNavProps {
  pageTitle: string;
}

export default function TopNav({ pageTitle }: TopNavProps) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow">
      <div className="text-lg font-semibold text-gray-800">{pageTitle}</div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-800 font-medium">
            {user.first_name} {user.last_name}
          </span>
        )}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
