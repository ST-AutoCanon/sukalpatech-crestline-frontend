import React from "react";

export default function EmployeeTable({
  employees,
  onEditPermission,
  onRemoveDept,
}: any) {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Permission</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp: any) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{emp.id}</td>
                <td className="p-3">
                  {emp.first_name} {emp.last_name}
                </td>
                <td className="p-3 break-words">{emp.email}</td>
                <td className="p-3">
                  {emp.departments[0]?.permission || "No Permission"}
                </td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                      onClick={() => onEditPermission(emp, emp.departments[0])}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => onRemoveDept(emp.id)}
                    >
                      Unassign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden w-full px-3 space-y-4">
        {employees.map((emp: any) => (
          <div
            key={emp.id}
            className="w-full bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="space-y-2">
              {/* ID */}
              <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="font-medium text-sm">{emp.id}</p>
              </div>

              {/* Name */}
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium text-sm break-words">
                  {emp.first_name} {emp.last_name}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-sm break-all">{emp.email}</p>
              </div>

              {/* Permission */}
              <div>
                <p className="text-xs text-gray-500">Permission</p>
                <p className="font-medium text-sm">
                  {emp.departments[0]?.permission || "No Permission"}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-md text-sm font-medium"
                  onClick={() => onEditPermission(emp, emp.departments[0])}
                >
                  Update Permission
                </button>

                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium"
                  onClick={() => onRemoveDept(emp.id)}
                >
                  Unassign
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
