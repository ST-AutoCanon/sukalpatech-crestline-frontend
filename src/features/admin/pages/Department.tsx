// src/features/admin/pages/DepartmentPage.tsx
import { useState, useContext } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { AuthContext } from "../../../context/AuthContext";
import AssignDepartmentModal from "../components/AssignDepartmentModal";
import PermissionModal from "../components/PermissionModal";

export default function DepartmentPage() {
  const { token } = useContext(AuthContext);

  const {
    departments,
    selectedDepartmentEmployees,
    employees: allEmployees,
    addDepartment,
    assignDept,
    updatePerm,
    deleteDept,
    fetchEmployeesByDept,
  } = useAdmin(token);

  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [modal, setModal] = useState<"assign" | "edit" | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);
  const [activeTab, setActiveTab] =
    useState<"department" | "category">("department");

  const openDepartment = async (dept: any) => {
    setSelectedDept(dept);
    await fetchEmployeesByDept(dept.department_id);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* ===== Tabs (always visible) ===== */}
      <div className="flex items-center gap-6 mb-6 border-b">
        <button
          className={`text-2xl font-semibold pb-2 ${
            activeTab === "department"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("department");
            setSelectedDept(null);
          }}
        >
          Departments
        </button>

        <button
          className={`text-2xl font-semibold pb-2 ${
            activeTab === "category"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("category");
            setSelectedDept(null);
          }}
        >
          Category
        </button>
      </div>

      {/* ===== Department TAB ===== */}
      {activeTab === "department" && (
        <>
          {!selectedDept && (
            <>
              {departments.map((d) => (
                <button
                  key={d.department_id}
                  className="w-full text-left p-2 rounded hover:bg-blue-200 mb-1"
                  onClick={() => openDepartment(d)}
                >
                  {d.name}
                </button>
              ))}

              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="New Department"
                  className="border p-2 rounded flex-1"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    if (!newDeptName.trim()) return;
                    await addDepartment(newDeptName);
                    setNewDeptName("");
                  }}
                >
                  Add
                </button>
              </div>
            </>
          )}

          {selectedDept && (
            <div className="mt-6">
              <button
                className="text-blue-600 mb-4"
                onClick={() => setSelectedDept(null)}
              >
                ← Back
              </button>

              <h2 className="text-2xl font-semibold mb-4">
                {selectedDept.name} — Employees
              </h2>

              {selectedDepartmentEmployees.length === 0 ? (
                <p className="text-gray-500 italic">
                  No employees assigned yet.
                </p>
              ) : (
                <table className="w-full border mt-3">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Employee</th>
                      <th className="p-2">Permission</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDepartmentEmployees.map((emp) => (
                      <tr key={emp.id} className="border-b">
                        <td className="p-2">
                          {emp.first_name} {emp.last_name}
                        </td>
                        <td className="p-2">
                          {emp.permission || "No Permission"}
                        </td>
                        <td className="p-2 flex gap-2">
                          <button
                            className="px-3 py-1 rounded bg-yellow-500 text-white"
                            onClick={() => {
                              setSelectedEmpId(emp.id);
                              setModal("edit");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 rounded bg-red-600 text-white"
                            onClick={() =>
                              deleteDept(
                                emp.id,
                                selectedDept.department_id
                              )
                            }
                          >
                            Unassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button
                className="mt-5 bg-green-600 px-4 py-2 text-white rounded"
                onClick={() => setModal("assign")}
              >
                + Assign Employee
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== Category TAB ===== */}
      {activeTab === "category" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Employee Categories
          </h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Employee</th>
                <th className="p-2">Category</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {allEmployees.map((emp: any) => (
                <tr key={emp.id} className="border-b">
                  <td className="p-2">
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td className="p-2">
                    <select
                      className="border p-1 rounded"
                      defaultValue={emp.category || ""}
                      onChange={(e) =>
                        (emp.category = e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={async () => {
                        await fetch(
                          `${import.meta.env.VITE_BACKEND_URL}/api/admin/employees/${emp.id}/category`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              category: emp.category,
                            }),
                          }
                        );
                      }}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Modals ===== */}
      {modal === "assign" && selectedDept && (
        <AssignDepartmentModal
          allEmployees={allEmployees}
          selectedDept={selectedDept}
          onClose={() => setModal(null)}
          onSave={async (empId, deptId, perm) => {
            await assignDept(empId, deptId, perm);
            await fetchEmployeesByDept(deptId);
            setModal(null);
          }}
        />
      )}

      {modal === "edit" && selectedDept && selectedEmpId && (
        <PermissionModal
          employee={selectedDepartmentEmployees.find(
            (e) => e.id === selectedEmpId
          )}
          department={selectedDept}
          onClose={() => setModal(null)}
          onSave={async (perm) => {
            await updatePerm(
              selectedEmpId,
              selectedDept.department_id,
              perm
            );
            await fetchEmployeesByDept(
              selectedDept.department_id
            );
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
