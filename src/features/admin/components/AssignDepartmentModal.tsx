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
  if (!Category) return alert("Please select approval category!");

  onSave(
    selectedEmpId,
    selectedDept.department_id,
    permission,
    Category
  );
};


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
        <input
          className="w-full border p-2 rounded"
          placeholder="Permission (optional: view/edit/manage)"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        />
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
