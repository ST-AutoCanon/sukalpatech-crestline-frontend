// import { useState, useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useAdmin } from "../hooks/useAdmin";

// import AssignDepartmentModal from "../components/AssignDepartmentModal";
// import PermissionModal from "../components/PermissionModal";

// export default function DepartmentPage() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     selectedDepartmentEmployees,
//     employees: allEmployees,
//     addDepartment,
//     assignDept,
//     updatePerm,
//     deleteDept,
//     fetchEmployeesByDept,
//   } = useAdmin(token);

//   const [selectedDept, setSelectedDept] = useState<any>(null);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [modal, setModal] = useState<"assign" | "edit" | null>(null);
//   const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);
//   const [permission, setPermission] = useState("");

//   const openDepartment = async (dept: any) => {
//     setSelectedDept(dept);
//     await fetchEmployeesByDept(dept.department_id);
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6 text-center">Departments</h1>

//       {/* ===================== DEPARTMENT LIST ===================== */}
//       {!selectedDept && (
//         <div className="bg-white p-4 rounded-xl shadow space-y-3">
//           <h2 className="text-2xl font-semibold mb-4">All Departments</h2>

//           {departments.map((d) => (
//             <button
//               key={d.department_id}
//               className="w-full text-left p-2 rounded hover:bg-blue-200"
//               onClick={() => openDepartment(d)}
//             >
//               {d.name}
//             </button>
//           ))}

//           <div className="flex gap-2 mt-4">
//             <input
//               type="text"
//               placeholder="New Department"
//               className="border p-2 rounded flex-1"
//               value={newDeptName}
//               onChange={(e) => setNewDeptName(e.target.value)}
//             />
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//               onClick={async () => {
//                 if (!newDeptName.trim()) return;
//                 await addDepartment(newDeptName);
//                 setNewDeptName("");
//               }}
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ===================== SELECTED DEPARTMENT ===================== */}
//       {selectedDept && (
//         <div className="mt-6 bg-white p-5 rounded-xl shadow">
//           <button
//             className="text-blue-600 mb-4"
//             onClick={() => setSelectedDept(null)}
//           >
//             ← Back
//           </button>

//           <h2 className="text-2xl font-semibold mb-4">
//             {selectedDept.name} — Employees
//           </h2>

//           {selectedDepartmentEmployees.length === 0 ? (
//             <p className="text-gray-500 italic">No employees assigned yet.</p>
//           ) : (
//             <table className="w-full border mt-3">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="p-2">Employee</th>
//                   <th className="p-2">Permission</th>
//                   <th className="p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedDepartmentEmployees.map((emp) => (
//                   <tr key={emp.id} className="border-b">
//                     <td className="p-2">
//                       {emp.first_name} {emp.last_name}
//                     </td>
//                     <td className="p-2">{emp.permission || "No Permission"}</td>
//                     <td className="p-2 flex gap-2">
//                       <button
//                         className="px-3 py-1 rounded bg-yellow-500 text-white"
//                         onClick={() => {
//                           setSelectedEmpId(emp.id);
//                           setPermission(emp.permission || "");
//                           setModal("edit");
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="px-3 py-1 rounded bg-red-600 text-white"
//                         onClick={() =>
//                           deleteDept(emp.id, selectedDept.department_id)
//                         }
//                       >
//                         Unassign
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           <button
//             className="mt-5 bg-green-600 px-4 py-2 text-white rounded"
//             onClick={() => setModal("assign")}
//           >
//             + Assign Employee
//           </button>
//         </div>
//       )}

//       {/* ===================== ASSIGN MODAL ===================== */}
//       {modal === "assign" && selectedDept && (
//         <AssignDepartmentModal
//           allEmployees={allEmployees}
//           selectedDept={selectedDept}
//           onClose={() => setModal(null)}
//           onSave={async (empId: number, deptId: number, perm: string) => {
//             await assignDept(empId, deptId, perm);
//             await fetchEmployeesByDept(deptId);
//             setModal(null);
//           }}
//         />
//       )}

//       {/* ===================== EDIT PERMISSION MODAL ===================== */}
//       {modal === "edit" && selectedDept && selectedEmpId && (
//         <PermissionModal
//           employee={selectedDepartmentEmployees.find(
//             (e) => e.id === selectedEmpId
//           )}
//           department={selectedDept}
//           onClose={() => setModal(null)}
//           onSave={async (perm: string) => {
//             await updatePerm(selectedEmpId!, selectedDept.department_id, perm);
//             await fetchEmployeesByDept(selectedDept.department_id);
//             setModal(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }


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

  const openDepartment = async (dept: any) => {
    setSelectedDept(dept);
    await fetchEmployeesByDept(dept.department_id);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      {!selectedDept && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Departments</h2>
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
          <button className="text-blue-600 mb-4" onClick={() => setSelectedDept(null)}>
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mb-4">
            {selectedDept.name} — Employees
          </h2>

          {selectedDepartmentEmployees.length === 0 ? (
            <p className="text-gray-500 italic">No employees assigned yet.</p>
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
                    <td className="p-2">{emp.permission || "No Permission"}</td>
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
            className="mt-5 bg-green-600 px-4 py-2 text-white rounded"
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
          onSave={async (empId: number, deptId: number, perm: string) => {
            await assignDept(empId, deptId, perm);
            await fetchEmployeesByDept(deptId);
            setModal(null);
          }}
        />
      )}

      {modal === "edit" && selectedDept && selectedEmpId && (
        <PermissionModal
          employee={selectedDepartmentEmployees.find((e) => e.id === selectedEmpId)}
          department={selectedDept}
          onClose={() => setModal(null)}
          onSave={async (perm: string) => {
            await updatePerm(selectedEmpId!, selectedDept.department_id, perm);
            await fetchEmployeesByDept(selectedDept.department_id);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
