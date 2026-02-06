import React, { useState } from "react";

const CATEGORY_RULES: Record<string, string[]> = {
  LOW: ["view"],
  MEDIUM: ["view", "create"],
  HIGH: ["view", "create", "manage"],
};

const CATEGORY_LIMITS: Record<string, number | null> = {
  LOW: 50000,
  MEDIUM: 200000,
  HIGH: null, // no limit
};



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

const determineCategory = (permissions: string[]) => {
  if (
    permissions.includes("view") &&
    permissions.includes("create") &&
    permissions.includes("manage")
  ) {
    return "HIGH";
  }

  if (
    permissions.includes("view") &&
    permissions.includes("create")
  ) {
    return "MEDIUM";
  }

  if (permissions.includes("view")) {
    return "LOW";
  }

  return "";
};


 const handleSave = () => {
  if (!selectedEmpId) {
    alert("Please select an employee!");
    return;
  }

  if (!permission) {
    alert("Please enter permission!");
    return;
  }

  // Split permissions typed by user
  const selectedPermissions = permission
    .split(",")
    .map((p) => p.trim().toLowerCase());

  // Auto-detect category
  const autoCategory = determineCategory(selectedPermissions);

  if (!autoCategory) {
    alert("Invalid permissions entered!");
    return;
  }

  // Validate permissions against category rules
  const allowedPermissions = CATEGORY_RULES[autoCategory];
  const invalid = selectedPermissions.some((p) => !allowedPermissions.includes(p));
  if (invalid) {
    alert(
      `Selected permission(s) [${selectedPermissions.join(
        ", "
      )}] are not allowed for ${autoCategory} category`
    );
    return;
  }

  // Validate amount limit
  const totalPrice = Number(String(selectedDept.totalPrice || 0).replace(/,/g, ""));
  const maxAmount = CATEGORY_LIMITS[autoCategory];

  if (maxAmount !== null && totalPrice > maxAmount) {
    alert(
      `Denied! Total price ₹${totalPrice} exceeds the limit of ₹${maxAmount} for ${autoCategory}`
    );
    return;
  }

  // ✅ All validations passed
  onSave(selectedEmpId, selectedDept.department_id, permission, autoCategory);
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
  <input
    type="text"
    placeholder="Enter permissions separated by comma (e.g., view,create)"
    className="w-full border p-2 rounded"
    value={permission}
    onChange={(e) => setPermission(e.target.value)}
  />
  <p className="text-sm text-gray-500">
    Separate multiple permissions with commas. Allowed: view, create, manage
  </p>
</div>


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