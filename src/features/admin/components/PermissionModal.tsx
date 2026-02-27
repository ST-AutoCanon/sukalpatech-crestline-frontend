import React, { useState, useEffect } from "react";

export default function PermissionModal({
  employee,
  department,
  onClose,
  onSave,
}: any) {
  const [permission, setPermission] = useState(department.permission || "");

  useEffect(() => {
    setPermission(department.permission || "");
  }, [department]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Update Permission
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {employee.first_name} {employee.last_name}
          </p>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium text-gray-800">{department.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Permission
            </label>
            <input
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              placeholder="view / edit / manage"
              className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 p-2.5 rounded-lg outline-none transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
            onClick={() => onSave(permission)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
