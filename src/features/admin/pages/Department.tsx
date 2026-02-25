// // src/features/admin/pages/DepartmentPage.tsx
// import { useState, useContext } from "react";
// import { useAdmin } from "../hooks/useAdmin";
// import { AuthContext } from "../../../context/AuthContext";
// import AssignDepartmentModal from "../components/AssignDepartmentModal";
// import PermissionModal from "../components/PermissionModal";

// export default function DepartmentPage() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     selectedDepartmentEmployees,
//     employees: allEmployees,
//     assignDept,
//     updatePerm,
//     deleteDept,
//     fetchEmployeesByDept,
//   } = useAdmin(token);

//   const [selectedDept, setSelectedDept] = useState<any>(null);
//   const [modal, setModal] = useState<"assign" | "edit" | null>(null);
//   const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);

//   const openDepartment = async (dept: any) => {
//     setSelectedDept(dept);
//     await fetchEmployeesByDept(dept.department_id);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">
//         {/* ================= DEPARTMENT LIST ================= */}
//         {!selectedDept && (
//           <>
//             <h2 className="text-2xl md:text-3xl font-semibold mb-6">
//               Departments
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {departments.map((d) => (
//                 <button
//                   key={d.department_id}
//                   className="text-left p-3 rounded-lg border hover:bg-blue-100 transition"
//                   onClick={() => openDepartment(d)}
//                 >
//                   {d.name}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}

//         {/* ================= SELECTED DEPARTMENT ================= */}
//         {selectedDept && (
//           <div className="mt-4">
//             <button
//               className="text-blue-600 mb-4 hover:underline"
//               onClick={() => setSelectedDept(null)}
//             >
//               ← Back
//             </button>

//             <h2 className="text-2xl md:text-3xl font-semibold mb-6">
//               {selectedDept.name} — Employees
//             </h2>

//             {selectedDepartmentEmployees.length === 0 ? (
//               <p className="text-gray-500 italic">No employees assigned yet.</p>
//             ) : (
//               <div className="w-full overflow-x-auto">
//                 <table className="min-w-[600px] w-full border">
//                   <thead>
//                     <tr className="bg-gray-200 text-left">
//                       <th className="p-3 whitespace-nowrap">Employee</th>
//                       <th className="p-3 whitespace-nowrap">Permission</th>
//                       <th className="p-3 whitespace-nowrap">Actions</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {selectedDepartmentEmployees.map((emp) => (
//                       <tr key={emp.id} className="border-b">
//                         <td className="p-3 whitespace-nowrap">
//                           {emp.first_name} {emp.last_name}
//                         </td>

//                         <td className="p-3 whitespace-nowrap">
//                           {emp.permission || "No Permission"}
//                         </td>

//                         <td className="p-3">
//                           <div className="flex flex-col sm:flex-row gap-2">
//                             <button
//                               className="px-3 py-1 rounded bg-yellow-500 text-white text-sm"
//                               onClick={() => {
//                                 setSelectedEmpId(emp.id);
//                                 setModal("edit");
//                               }}
//                             >
//                               Edit
//                             </button>

//                             <button
//                               className="px-3 py-1 rounded bg-red-600 text-white text-sm"
//                               onClick={() =>
//                                 deleteDept(emp.id, selectedDept.department_id)
//                               }
//                             >
//                               Unassign
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <button
//               className="mt-6 w-full sm:w-auto bg-green-600 px-4 py-2 text-white rounded-lg"
//               onClick={() => setModal("assign")}
//             >
//               + Assign Employee
//             </button>
//           </div>
//         )}

//         {/* ================= ASSIGN MODAL ================= */}
//         {modal === "assign" && selectedDept && (
//           <AssignDepartmentModal
//             allEmployees={allEmployees}
//             selectedDept={selectedDept}
//             onClose={() => setModal(null)}
//             onSave={async (empId: number, deptId: number, perm: string) => {
//               await assignDept(empId, deptId, perm);
//               await fetchEmployeesByDept(deptId);
//               setModal(null);
//             }}
//           />
//         )}

//         {/* ================= EDIT PERMISSION MODAL ================= */}
//         {modal === "edit" && selectedDept && selectedEmpId && (
//           <PermissionModal
//             employee={selectedDepartmentEmployees.find(
//               (e) => e.id === selectedEmpId,
//             )}
//             department={selectedDept}
//             onClose={() => setModal(null)}
//             onSave={async (perm: string) => {
//               await updatePerm(
//                 selectedEmpId!,
//                 selectedDept.department_id,
//                 perm,
//               );
//               await fetchEmployeesByDept(selectedDept.department_id);
//               setModal(null);
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import AssignDepartmentModal from "../components/AssignDepartmentModal";
import PermissionModal from "../components/PermissionModal";

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
  };

  /* ================= UPDATE PERMISSION ================= */
  const updatePerm = async (
    employeeId: number,
    deptId: number,
    permission: string,
  ) => {
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
  };

  /* ================= UNASSIGN ================= */
  const deleteDept = async (employeeId: number, deptId: number) => {
    await fetch(
      `${API_URL}/api/departments/employee/${employeeId}/unassign-department`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department_id: deptId }),
      },
    );

    await fetchEmployeesByDept(deptId);
    await fetchAllEmployees();
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">
        {!selectedDept && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Departments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      <td className="p-3 space-x-2">
                        <button
                          className="bg-yellow-500 px-3 py-1 text-white text-sm rounded"
                          onClick={() => {
                            setSelectedEmpId(emp.id);
                            setModal("edit");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="bg-red-600 px-3 py-1 text-white text-sm rounded"
                          onClick={() =>
                            deleteDept(emp.id, selectedDept.department_id)
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