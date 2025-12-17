import React, { useState, useEffect } from "react";

export default function PermissionModal({
  employee,
  department,
  onClose,
  onSave,
}: any) {
  const [permission, setPermission] = useState(department.permission || "");

  // Prefill when modal opens
  useEffect(() => {
    setPermission(department.permission || "");
  }, [department]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          Update Permission for {employee.first_name} {employee.last_name}
        </h3>

        <p className="mb-2">
          <b>Department:</b> {department.name}
        </p>

        <input
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          placeholder="Permission (view/edit/manage)"
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => onSave(permission)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
