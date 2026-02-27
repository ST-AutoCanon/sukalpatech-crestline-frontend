import React, { useState } from "react";

export default function AssignDepartmentModal({
  allEmployees,
  selectedDept,
  onClose,
  onSave,
}: any) {
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);
  const [permission, setPermission] = useState("");

  const handleSave = () => {
    if (!selectedEmpId) {
      alert("Please select an employee!");
      return;
    }

    onSave(selectedEmpId, selectedDept.department_id, permission);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Wrapper */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Assign Employee
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Department: {selectedDept?.name}
          </p>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Employee Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Employee
            </label>

            <div className="relative">
              <select
                value={selectedEmpId ?? ""}
                onChange={(e) =>
                  setSelectedEmpId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full appearance-none border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-3 pr-10 rounded-lg outline-none transition bg-white"
              >
                <option value="">-- Select Employee --</option>
                {allEmployees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.email})
                  </option>
                ))}
              </select>

              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                ▼
              </div>
            </div>
          </div>

          {/* Permission Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Permission (Optional)
            </label>

            <input
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-3 rounded-lg outline-none transition"
              placeholder="view / edit / manage"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-4 py-2.5 rounded-lg transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition"
            onClick={handleSave}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
