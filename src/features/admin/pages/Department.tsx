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
    assignDept,
    updatePerm,
    deleteDept,
    fetchEmployeesByDept,
  } = useAdmin(token);

  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [modal, setModal] = useState<"assign" | "edit" | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);

  const openDepartment = async (dept: any) => {
    setSelectedDept(dept);
    await fetchEmployeesByDept(dept.department_id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">
        {/* ================= DEPARTMENT LIST ================= */}
        {!selectedDept && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Departments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {departments.map((d) => (
                <button
                  key={d.department_id}
                  className="text-left p-3 rounded-lg border hover:bg-blue-100 transition"
                  onClick={() => openDepartment(d)}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ================= SELECTED DEPARTMENT ================= */}
        {selectedDept && (
          <div className="mt-4">
            <button
              className="text-blue-600 mb-4 hover:underline"
              onClick={() => setSelectedDept(null)}
            >
              ← Back
            </button>

            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              {selectedDept.name} — Employees
            </h2>

            {selectedDepartmentEmployees.length === 0 ? (
              <p className="text-gray-500 italic">No employees assigned yet.</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-[600px] w-full border">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3 whitespace-nowrap">Employee</th>
                      <th className="p-3 whitespace-nowrap">Permission</th>
                      <th className="p-3 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedDepartmentEmployees.map((emp) => (
                      <tr key={emp.id} className="border-b">
                        <td className="p-3 whitespace-nowrap">
                          {emp.first_name} {emp.last_name}
                        </td>

                        <td className="p-3 whitespace-nowrap">
                          {emp.permission || "No Permission"}
                        </td>

                        <td className="p-3">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              className="px-3 py-1 rounded bg-yellow-500 text-white text-sm"
                              onClick={() => {
                                setSelectedEmpId(emp.id);
                                setModal("edit");
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                              onClick={() =>
                                deleteDept(emp.id, selectedDept.department_id)
                              }
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
            )}

            <button
              className="mt-6 w-full sm:w-auto bg-green-600 px-4 py-2 text-white rounded-lg"
              onClick={() => setModal("assign")}
            >
              + Assign Employee
            </button>
          </div>
        )}

        {/* ================= ASSIGN MODAL ================= */}
        {modal === "assign" && selectedDept && (
          <AssignDepartmentModal
            allEmployees={allEmployees}
            selectedDept={selectedDept}
            onClose={() => setModal(null)}
            onSave={async (empId: number, deptId: number, perm: string) => {
              await assignDept(empId, deptId, perm);
              await fetchEmployeesByDept(deptId);
              setModal(null);
            }}
          />
        )}

        {/* ================= EDIT PERMISSION MODAL ================= */}
        {modal === "edit" && selectedDept && selectedEmpId && (
          <PermissionModal
            employee={selectedDepartmentEmployees.find(
              (e) => e.id === selectedEmpId,
            )}
            department={selectedDept}
            onClose={() => setModal(null)}
            onSave={async (perm: string) => {
              await updatePerm(
                selectedEmpId!,
                selectedDept.department_id,
                perm,
              );
              await fetchEmployeesByDept(selectedDept.department_id);
              setModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
