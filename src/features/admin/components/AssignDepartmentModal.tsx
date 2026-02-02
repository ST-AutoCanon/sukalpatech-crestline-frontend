import React, { useState } from "react";

export default function AssignDepartmentModal({
  allEmployees, // List of all employees
  selectedDept, // Current department
  onClose,
  onSave,
}: any) {
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);
  const [permission, setPermission] = useState("");
  const [Category, setCategory] = useState("");


  // const handleSave = () => {
  //   if (!selectedEmpId) return alert("Please select an employee!");
  //   onSave(selectedEmpId, selectedDept.department_id, permission);
  // };
  const handleSave = () => {
    if (!selectedEmpId) return alert("Please select an employee!");

    if (showApprovalCategory && !Category) {
      return alert("Please select approval category!");
    }

    onSave(
      selectedEmpId,
      selectedDept.department_id,
      permission,
      showApprovalCategory ? Category : null
    );
  };


  const approvalDepartments = [
    "BD",
    "Finance",
    "Fessibility",
  ];

  const showApprovalCategory = approvalDepartments.includes(
    selectedDept?.name
  );


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h3 className="text-xl font-semibold">
          Assign Employee to {selectedDept.name}
        </h3>

        {/* Employee Dropdown */}
        <select
          className="w-full border p-2 rounded"
          value={selectedEmpId ?? ""}
          onChange={(e) => setSelectedEmpId(Number(e.target.value))}
        >
          <option value="">-- Select Employee --</option>
          {allEmployees.map((emp: any) => (
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name} ({emp.email})
            </option>
          ))}
        </select>

        {/* Permission Input */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Permission</label>
          <div className="flex gap-4">
            {["View", "Update", "Manage"].map((p) => (
              <label key={p} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="permission"
                  value={p}
                  checked={permission === p}
                  onChange={(e) => setPermission(e.target.value)}
                  className="form-radio"
                />
                <span className="capitalize">{p}</span>
              </label>
            ))}
          </div>
        </div>


        {showApprovalCategory && (
          <select
            className="w-full border p-2 rounded"
            value={Category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Approval Category --</option>
            <option value="LOW">LOW (Employee – up to ₹50,000)</option>
            <option value="MEDIUM">MEDIUM (Manager – up to ₹2,00,000)</option>
            <option value="HIGH">HIGH (Admin – No Limit)</option>
          </select>
        )}


        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button className="bg-gray-400 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-green-600 px-4 py-2 text-white rounded"
            onClick={handleSave}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
