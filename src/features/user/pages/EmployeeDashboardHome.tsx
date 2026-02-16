// src/features/user/pages/EmployeeDashboardHome.tsx
import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function EmployeeDashboardHome() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">
        Welcome {user?.first_name} 👋
      </h2>
      <p className="text-gray-600">
        This is your dashboard home. Select a department from the sidebar to
        view its details.
      </p>
    </div>
  );
  //
}
