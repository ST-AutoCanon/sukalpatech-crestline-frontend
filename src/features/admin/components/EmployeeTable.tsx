import React from "react";

export default function EmployeeTable({
  employees,
  onEditPermission,
  onRemoveDept,
  showAssign = true,
}: any) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="p-2">ID</th>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Permission</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp: any) => (
          <tr key={emp.id} className="border-b">
            <td className="p-2">{emp.id}</td>
            <td className="p-2">
              {emp.first_name} {emp.last_name}
            </td>
            <td className="p-2">{emp.email}</td>
            <td className="p-2">
              {emp.departments[0]?.permission || "No Permission"}
            </td>
            <td className="p-2 flex gap-2">
              <button
                className="bg-yellow-400 px-2 py-1 rounded"
                onClick={() => onEditPermission(emp, emp.departments[0])}
              >
                Update Permission
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onRemoveDept(emp.id)}
              >
                Unassign
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
