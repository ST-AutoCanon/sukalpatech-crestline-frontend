import { useState, useEffect } from "react";
import AssignDepartmentModal from "../components/AssignDepartmentModal";
import PermissionModal from "../components/PermissionModal";
import Alert from "../../../components/Aleartmessage";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleRes = async (res: Response) => {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "API error");
  return json.data ?? json;
};

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
    useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [modal, setModal] = useState<"assign" | "edit" | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* ================= FETCH DEPARTMENTS ================= */
  const fetchDepartments = async () => {
    const res = await fetch(`${API_URL}/api/departments`, {
      credentials: "include",
    });
    const data = await handleRes(res);
    setDepartments(data || []);
  };

  /* ================= FETCH ALL EMPLOYEES ================= */
  const fetchAllEmployees = async () => {
    const res = await fetch(
      `${API_URL}/api/departments/employees-departments`,
      { credentials: "include" },
    );
    const data = await handleRes(res);
    setAllEmployees(data || []);
  };

  /* ================= FETCH EMPLOYEES BY DEPT ================= */
  const fetchEmployeesByDept = async (deptId: number) => {
    const res = await fetch(`${API_URL}/api/departments/${deptId}/employees`, {
      credentials: "include",
    });

    const data = await handleRes(res);

    const normalized = (data || []).map((emp: any) => {
      const dept = emp.departments?.find((d: any) => d.id === deptId);
      return {
        ...emp,
        permission: dept?.permission || "",
      };
    });

    setSelectedDepartmentEmployees(normalized);
  };

  /* ================= ASSIGN EMPLOYEE ================= */
  const assignDept = async (
    employeeId: number,
    deptId: number,
    permission: string,
  ) => {
    try {
      await fetch(
        `${API_URL}/api/departments/employee/${employeeId}/assign-department`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department_id: deptId,
            permission,
          }),
        },
      );

      await fetchEmployeesByDept(deptId);
      await fetchAllEmployees();

      // ✅ SUCCESS ALERT (same as unassign)
      setAlert({
        type: "success",
        message: "Employee assigned successfully!",
      });

    } catch (err) {
      console.error(err);

      // ❌ ERROR ALERT
      setAlert({
        type: "error",
        message: "Failed to assign employee.",
      });
    }
  };

  /* ================= UPDATE PERMISSION ================= */
  const updatePerm = async (
    employeeId: number,
    deptId: number,
    permission: string,
  ) => {
    try {
      await fetch(
        `${API_URL}/api/departments/employee/${employeeId}/assign-permission`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department_id: deptId,
            permission,
          }),
        },
      );

      await fetchEmployeesByDept(deptId);

      // ✅ SUCCESS ALERT
      setAlert({
        type: "success",
        message: "Employee permission updated successfully!",
      });

    } catch (err) {
      console.error(err);

      // ❌ ERROR ALERT
      setAlert({
        type: "error",
        message: "Failed to update permission.",
      });
    }
  };
  /* ================= UNASSIGN ================= */
  // const deleteDept = async (employeeId: number, deptId: number) => {
  //   await fetch(
  //     `${API_URL}/api/departments/employee/${employeeId}/unassign-department`,
  //     {
  //       method: "POST",
  //       credentials: "include",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ department_id: deptId }),
  //     },
  //   );

  //   await fetchEmployeesByDept(deptId);
  //   await fetchAllEmployees();
  // };

  const deleteDept = async (employeeId: number, deptId: number) => {
    try {
      await fetch(
        `${API_URL}/api/departments/employee/${employeeId}/unassign-department`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ department_id: deptId }),
        }
      );

      await fetchEmployeesByDept(deptId);
      await fetchAllEmployees();

      // ✅ SUCCESS ALERT
      setAlert({
        type: "success",
        message: "Employee unassigned successfully!",
      });

    } catch (err) {
      console.error(err);

      // ❌ ERROR ALERT
      setAlert({
        type: "error",
        message: "Failed to unassign employee.",
      });
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchDepartments();
    fetchAllEmployees();
  }, []);

  const openDepartment = async (dept: any) => {
    setSelectedDept(dept);
    await fetchEmployeesByDept(dept.department_id);
  };

  return (

    // <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-3 sm:px-4 md:px-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow p-4 sm:p-5 md:p-6">
        {!selectedDept && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Departments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((d) => (
                <button
                  key={d.department_id}
                  className="text-left p-3 rounded-lg border hover:bg-blue-100"
                  onClick={() => openDepartment(d)}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </>
        )}

        {selectedDept && (
          <div className="mt-4">
            <div className="mb-4">
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setSelectedDept(null)}
              >
                ←
              </span>
              <span className="ml-2 text-blue-600">Back</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              {selectedDept.name} — Employees
            </h2>

            {selectedDepartmentEmployees.length === 0 ? (
              <p className="text-gray-500 italic">No employees assigned yet.</p>
            ) : (
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Permission</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDepartmentEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b">
                      <td className="p-3">
                        {emp.first_name} {emp.last_name}
                      </td>
                      <td className="p-3">
                        {emp.permission || "No Permission"}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            className="bg-yellow-500 px-3 py-1 text-white text-sm rounded w-full sm:w-auto"
                            onClick={() => {
                              setSelectedEmpId(emp.id);
                              setModal("edit");
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="bg-red-600 px-3 py-1 text-white text-sm rounded w-full sm:w-auto"
                            onClick={() => {
                              const confirmDelete = window.confirm(
                                "Are you sure you want to unassign this employee?"
                              );

                              if (!confirmDelete) return;

                              deleteDept(emp.id, selectedDept.department_id);
                            }}
                          >
                            Unassign
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              className="mt-6 bg-green-600 px-4 py-2 text-white rounded"
              onClick={() => setModal("assign")}
            >
              + Assign Employee
            </button>
          </div>
        )}

        {modal === "assign" && selectedDept && (
          <AssignDepartmentModal
            allEmployees={allEmployees}
            selectedDept={selectedDept}
            onClose={() => setModal(null)}
            onSave={async (empId, deptId, perm) => {
              await assignDept(empId, deptId, perm);
              setModal(null);
            }}
          />
        )}

        {modal === "edit" && selectedDept && selectedEmpId && (
          <PermissionModal
            employee={selectedDepartmentEmployees.find(
              (e) => e.id === selectedEmpId,
            )}
            department={selectedDept}
            onClose={() => setModal(null)}
            onSave={async (perm) => {
              await updatePerm(selectedEmpId, selectedDept.department_id, perm);
              setModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
}