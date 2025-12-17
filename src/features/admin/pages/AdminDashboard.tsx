// import { useEffect, useState, useContext } from "react";
// import { useAdmin } from "../hooks/useAdmin";
// import { AuthContext } from "../../../context/AuthContext";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);
//   const {
//     departments,
//     employees,
//     loading,
//     error,
//     fetchDepartments,
//     fetchEmployees,
//     addDepartment,
//   } = useAdmin(token!);

//   const [newDept, setNewDept] = useState("");

//   useEffect(() => {
//     if (token) {
//       fetchDepartments();
//       fetchEmployees();
//     }
//   }, [token]);

//   const handleAddDept = async () => {
//     if (!newDept) return;
//     await addDepartment(newDept);
//     setNewDept("");
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <section className="mb-6">
//         <h2 className="text-2xl font-semibold mb-2">Departments</h2>
//         <ul className="list-disc pl-5 mb-2">
//           {departments.map((d) => (
//             <li key={d.department_id}>{d.name}</li>
//           ))}
//         </ul>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border px-2 py-1 rounded flex-1"
//             value={newDept}
//             onChange={(e) => setNewDept(e.target.value)}
//             placeholder="New department"
//           />
//           <button
//             onClick={handleAddDept}
//             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
//           >
//             Add
//           </button>
//         </div>
//       </section>

//       <section>
//         <h2 className="text-2xl font-semibold mb-2">Employees</h2>
//         <ul className="list-disc pl-5">
//           {employees.map((e) => (
//             <li key={e.id}>
//               {e.first_name} {e.last_name} ({e.email})
//             </li>
//           ))}
//         </ul>
//       </section>

//       {loading && <p className="mt-4 text-gray-500">Loading...</p>}
//     </div>
//   );
// }



// // src/features/admin/pages/AdminDashboard.tsx
// import { useEffect, useState, useContext } from "react";
// import { useAdmin } from "../hooks/useAdmin";
// import { AuthContext } from "../../../context/AuthContext";
// import * as api from "../api/adminApi";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     employees,
//     loading,
//     error,
//     fetchDepartments,
//     fetchEmployees,
//     addDepartment,
//   } = useAdmin(token!);

//   const [newDept, setNewDept] = useState("");
//   const [selectedDept, setSelectedDept] = useState<Record<number, number>>({}); // employeeId -> departmentId

//   useEffect(() => {
//     if (token) {
//       fetchDepartments();
//       fetchEmployees();
//     }
//   }, [token]);

//   const handleAddDept = async () => {
//     if (!newDept) return;
//     await addDepartment(newDept);
//     setNewDept("");
//   };

//   const handleAssignDepartment = async (employeeId: number) => {
//     const deptId = selectedDept[employeeId];
//     if (!deptId) return alert("Select a department first");

//     try {
//       const res = await api.assignEmployeeToDepartment(employeeId, deptId, token!);
//       alert(`Assigned ${res.data.first_name} to department ${departments.find(d => d.department_id === +deptId)?.name}`);
//       fetchEmployees(); // refresh employees
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {/* Departments */}
//       <section className="mb-6">
//         <h2 className="text-2xl font-semibold mb-2">Departments</h2>
//         <ul className="list-disc pl-5 mb-2">
//           {departments.map((d) => (
//             <li key={d.department_id}>{d.name}</li>
//           ))}
//         </ul>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border px-2 py-1 rounded flex-1"
//             value={newDept}
//             onChange={(e) => setNewDept(e.target.value)}
//             placeholder="New department"
//           />
//           <button
//             onClick={handleAddDept}
//             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
//           >
//             Add
//           </button>
//         </div>
//       </section>

//       {/* Employees */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-2">Employees</h2>
//         <ul className="list-disc pl-5">
//           {employees.map((e) => (
//             <li key={e.id} className="flex items-center gap-2 mb-1">
//               <span>
//                 {e.first_name} {e.last_name} ({e.email})
//               </span>
//               <select
//                 className="border px-2 py-1 rounded"
//                 value={selectedDept[e.id] || ""}
//                 onChange={(ev) =>
//                   setSelectedDept((prev) => ({
//                     ...prev,
//                     [e.id]: +ev.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Assign Department</option>
//                 {departments.map((d) => (
//                   <option key={d.department_id} value={d.department_id}>
//                     {d.name}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
//                 onClick={() => handleAssignDepartment(e.id)}
//               >
//                 Assign
//               </button>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {loading && <p className="mt-4 text-gray-500">Loading...</p>}
//     </div>
//   );
// }





// src/features/admin/pages/AdminDashboard.tsx
// import { useEffect, useState, useContext } from "react";
// import { useAdmin } from "../hooks/useAdmin";
// import { AuthContext } from "../../../context/AuthContext";
// import * as api from "../api/adminApi";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     employees,
//     loading,
//     error,
//     fetchDepartments,
//     fetchEmployees,
//     addDepartment,
//   } = useAdmin(token!);

//   const [newDept, setNewDept] = useState("");
//   const [selectedDept, setSelectedDept] = useState<Record<number, number>>({}); // employeeId -> departmentId

//   useEffect(() => {
//     if (token) {
//       fetchDepartments();
//       fetchEmployees();
//     }
//   }, [token]);

//   const handleAddDept = async () => {
//     if (!newDept) return;
//     await addDepartment(newDept);
//     setNewDept("");
//   };

//   const handleAssignDepartment = async (employeeId: number) => {
//     const deptId = selectedDept[employeeId];
//     if (!deptId) return alert("Select a department first");

//     try {
//       const res = await api.assignEmployeeToDepartment(employeeId, deptId, token!);
//       alert(
//         `Assigned ${res.first_name} to department ${departments.find(d => d.department_id === deptId)?.name}`
//       );
//       fetchEmployees(); // refresh employees to show updated department
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {/* Departments */}
//       <section className="mb-6">
//         <h2 className="text-2xl font-semibold mb-2">Departments</h2>
//         <ul className="list-disc pl-5 mb-2">
//           {departments.map((d) => (
//             <li key={d.department_id}>{d.name}</li>
//           ))}
//         </ul>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border px-2 py-1 rounded flex-1"
//             value={newDept}
//             onChange={(e) => setNewDept(e.target.value)}
//             placeholder="New department"
//           />
//           <button
//             onClick={handleAddDept}
//             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
//           >
//             Add
//           </button>
//         </div>
//       </section>

//       {/* Employees */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-2">Employees</h2>
//         <ul className="list-disc pl-5">
//           {employees.map((e) => (
//             <li key={e.id} className="flex items-center gap-2 mb-1">
//               <span>
//                 {e.first_name} {e.last_name} ({e.email}) —{" "}
//                 <strong>
//                   Department:{" "}
//                   {e.department?.name ? e.department.name : "Not Assigned"}
//                 </strong>
//               </span>
//               <select
//                 className="border px-2 py-1 rounded"
//                 value={selectedDept[e.id] || ""}
//                 onChange={(ev) =>
//                   setSelectedDept((prev) => ({
//                     ...prev,
//                     [e.id]: +ev.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Assign Department</option>
//                 {departments.map((d) => (
//                   <option key={d.department_id} value={d.department_id}>
//                     {d.name}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
//                 onClick={() => handleAssignDepartment(e.id)}
//               >
//                 Assign
//               </button>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {loading && <p className="mt-4 text-gray-500">Loading...</p>}
//     </div>
//   );
// }




// src/features/admin/pages/AdminDashboard.tsx
// import { useEffect, useState, useContext } from "react";
// import { useAdmin } from "../hooks/useAdmin";
// import { AuthContext } from "../../../context/AuthContext";
// import * as api from "../api/adminApi";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     employees,
//     loading,
//     error,
//     fetchDepartments,
//     fetchEmployees,
//     addDepartment,
//   } = useAdmin(token!);

//   const [newDept, setNewDept] = useState("");
//   const [activeDept, setActiveDept] = useState<number | null>(null);

//   useEffect(() => {
//     if (token) {
//       fetchDepartments();
//       fetchEmployees();
//     }
//   }, [token]);

//   const handleAddDept = async () => {
//     if (!newDept) return;
//     await addDepartment(newDept);
//     setNewDept("");
//   };

//   const handleAssignEmployee = async (employeeId: number) => {
//     if (!activeDept) return alert("No department selected");

//     try {
//       const res = await api.assignEmployeeToDepartment(employeeId, activeDept, token!);
//       alert(
//         `Assigned ${res.first_name} to department ${departments.find(
//           (d) => d.department_id === activeDept
//         )?.name}`
//       );
//       fetchEmployees(); // refresh employees
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const employeesInDept = activeDept
//     ? employees.filter((e) => e.department_id === activeDept)
//     : [];
//   const unassignedEmployees = employees.filter((e) => !e.department_id);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {/* Departments */}
//       <section className="mb-6">
//         <h2 className="text-2xl font-semibold mb-2">Departments</h2>
//         <ul className="list-disc pl-5 mb-2">
//           {departments.map((d) => (
//             <li
//               key={d.department_id}
//               className={`cursor-pointer ${
//                 activeDept === d.department_id ? "font-bold text-blue-500" : ""
//               }`}
//               onClick={() => setActiveDept(d.department_id)}
//             >
//               {d.name}
//             </li>
//           ))}
//         </ul>
//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             className="border px-2 py-1 rounded flex-1"
//             value={newDept}
//             onChange={(e) => setNewDept(e.target.value)}
//             placeholder="New department"
//           />
//           <button
//             onClick={handleAddDept}
//             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
//           >
//             Add
//           </button>
//         </div>
//       </section>

//       {/* Active Department Employees */}
//       {activeDept && (
//         <section className="mb-6">
//           <h2 className="text-2xl font-semibold mb-2">
//             Employees in {departments.find((d) => d.department_id === activeDept)?.name}
//           </h2>
//           {employeesInDept.length > 0 ? (
//             <ul className="list-disc pl-5 mb-2">
//               {employeesInDept.map((e) => (
//                 <li key={e.id}>
//                   {e.first_name} {e.last_name} ({e.email})
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No employees assigned yet.</p>
//           )}

//           {/* Assign Employees */}
//           <h3 className="font-semibold mt-4">Assign Employees</h3>
//           <ul className="list-disc pl-5">
//             {unassignedEmployees.length > 0 ? (
//               unassignedEmployees.map((e) => (
//                 <li key={e.id} className="flex items-center gap-2 mb-1">
//                   <span>
//                     {e.first_name} {e.last_name} ({e.email})
//                   </span>
//                   <button
//                     className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
//                     onClick={() => handleAssignEmployee(e.id)}
//                   >
//                     Assign
//                   </button>
//                 </li>
//               ))
//             ) : (
//               <li>All employees assigned.</li>
//             )}
//           </ul>
//         </section>
//       )}

//       {loading && <p className="mt-4 text-gray-500">Loading...</p>}
//     </div>
//   );
// }


// 25-11-2025


// import { useEffect, useState, useContext } from "react";
// import { useAdmin } from "../hooks/useAdmin";
// import { AuthContext } from "../../../context/AuthContext";
// import * as api from "../api/adminApi";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);
//   const {
//     departments,
//     employees,
//     loading,
//     fetchDepartments,
//     fetchEmployees,
//     addDepartment,
//   } = useAdmin(token!);

//   const [activeDept, setActiveDept] = useState<number | null>(null);
//   const [newDept, setNewDept] = useState("");

//   const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
//   const [selectedPermission, setSelectedPermission] = useState("");

//   const PERMISSIONS = ["read", "write", "manage"];

//   // useEffect(() => {
//   //   fetchDepartments();
//   //   fetchEmployees();
//   // }, []);
//   useEffect(() => {
//     if (!token) return;

//     const loadData = async () => {
//       await fetchDepartments();
//       await fetchEmployees();
//     };

//     loadData();
//   }, [token]); // safe & warning gone

//   const handleAssign = async () => {
//     if (!selectedEmployee || !selectedPermission || !activeDept)
//       return alert("Please select employee and permission");

//     await api.assignEmployeeDepartment(
//       selectedEmployee,
//       activeDept,
//       selectedPermission,
//       token!
//     );

//     fetchEmployees();
//     alert("Assigned successfully!");
//   };

//   const handleUpdatePermission = async (empId: number, perm: string) => {
//     await api.updatePermission(empId, activeDept!, perm, token!);
//     fetchEmployees();
//     alert("Permission updated!");
//   };

//   const handleUnassign = async (empId: number) => {
//     await api.unassignEmployee(empId, activeDept!, token!);
//     fetchEmployees();
//     alert("Employee unassigned!");
//   };

//   const deptEmployees = employees.filter((e) =>
//     e.departments?.includes(activeDept)
//   );

//   const availableEmployees = employees.filter(
//     (e) => !e.departments?.includes(activeDept)
//   );

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

//       {/* Departments List */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="border rounded-xl p-4 shadow bg-white">
//           <h2 className="text-xl font-semibold mb-3">Departments</h2>

//           {departments.map((d) => (
//             <div
//               key={d.department_id}
//               className={`p-2 rounded cursor-pointer ${
//                 activeDept === d.department_id
//                   ? "bg-blue-100 font-semibold"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveDept(d.department_id)}
//             >
//               {d.name}
//             </div>
//           ))}

//           <div className="mt-4 flex gap-2">
//             <input
//               value={newDept}
//               onChange={(e) => setNewDept(e.target.value)}
//               className="border p-2 rounded flex-1"
//               placeholder="New department"
//             />
//             <button
//               onClick={() => {
//                 addDepartment(newDept);
//                 setNewDept("");
//               }}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Active Department Panel */}
//         {activeDept && (
//           <div className="col-span-2 border rounded-xl p-4 shadow bg-white">
//             <h2 className="text-xl font-semibold mb-3">
//               {departments.find((d) => d.department_id === activeDept)?.name}
//             </h2>

//             {/* Employees inside this department */}
//             <h3 className="text-lg font-semibold mb-2">Assigned Employees</h3>
//             {deptEmployees.length === 0 ? (
//               <p className="text-gray-500">No employees assigned.</p>
//             ) : (
//               deptEmployees.map((e) => (
//                 <div
//                   key={e.id}
//                   className="flex items-center justify-between border p-3 rounded mb-2"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       {e.first_name} {e.last_name}
//                     </p>
//                     <p className="text-sm text-gray-600">{e.email}</p>
//                   </div>

//                   {/* Permission Dropdown */}
//                   <select
//                     defaultValue={e.permissions?.[activeDept] || ""}
//                     onChange={(ev) =>
//                       handleUpdatePermission(e.id, ev.target.value)
//                     }
//                     className="border p-2 rounded"
//                   >
//                     <option value="">Select Permission</option>
//                     {PERMISSIONS.map((p) => (
//                       <option key={p}>{p}</option>
//                     ))}
//                   </select>

//                   {/* Unassign Button */}
//                   <button
//                     onClick={() => handleUnassign(e.id)}
//                     className="bg-red-500 text-white px-3 py-2 rounded"
//                   >
//                     Unassign
//                   </button>
//                 </div>
//               ))
//             )}

//             {/* Assign Employee */}
//             <h3 className="text-lg font-semibold mt-4 mb-2">
//               Assign New Employee
//             </h3>

//             <div className="flex gap-3">
//               {/* Employee Dropdown */}
//               <select
//                 className="border p-2 rounded flex-1"
//                 onChange={(ev) => setSelectedEmployee(Number(ev.target.value))}
//               >
//                 <option value="">Select Employee</option>
//                 {availableEmployees.map((e) => (
//                   <option key={e.id} value={e.id}>
//                     {e.first_name} {e.last_name}
//                   </option>
//                 ))}
//               </select>

//               {/* Permission Dropdown */}
//               <select
//                 className="border p-2 rounded flex-1"
//                 onChange={(ev) => setSelectedPermission(ev.target.value)}
//               >
//                 <option value="">Select Permission</option>
//                 {PERMISSIONS.map((p) => (
//                   <option key={p}>{p}</option>
//                 ))}
//               </select>

//               <button
//                 onClick={handleAssign}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Assign
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {loading && <p className="text-gray-500 mt-3">Loading...</p>}
//     </div>
//   );
// }



// 26-11-2025

  // import { useEffect, useState, useContext } from "react";
  // import { useAdmin } from "../hooks/useAdmin";
  // import { AuthContext } from "../../../context/AuthContext";
  // import * as api from "../api/adminApi";

  // export default function AdminDashboard() {
  //   const { token } = useContext(AuthContext);
  //   const {
  //     departments,
  //     employees,
  //     fetchDepartments,
  //     fetchEmployees,
  //     addDepartment,
  //   } = useAdmin(token!);

  //   const [activeDept, setActiveDept] = useState<number | null>(null);
  //   const [newDept, setNewDept] = useState("");
  //   const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  //   const [selectedPermission, setSelectedPermission] = useState("");
  //   const PERMISSIONS = ["read", "write", "manage"];

  //   useEffect(() => {
  //     if (!token) return;
  //     fetchDepartments();
  //     fetchEmployees();
  //   }, [token]);

  //   const handleAssign = async () => {
  //     if (!selectedEmployee || !selectedPermission || !activeDept)
  //       return alert("Select employee & permission");

  //     await api.assignEmployeeDepartment(
  //       selectedEmployee,
  //       activeDept,
  //       selectedPermission,
  //       token!
  //     );
  //     fetchEmployees();
  //     alert("Employee Assigned Successfully!");
  //   };

  //   const handleUpdatePermission = async (empId: number, perm: string) => {
  //     await api.updatePermission(empId, activeDept!, perm, token!);
  //     fetchEmployees();
  //   };

  //   const handleUnassign = async (empId: number) => {
  //     await api.unassignEmployee(empId, activeDept!, token!);
  //     fetchEmployees();
  //   };

  //   // 🔥 FIXED → mapping department objects to extract only IDs
  //   const deptEmployees = employees.filter((e) =>
  //     e.departments?.map((d: any) => d.department_id).includes(activeDept)
  //   );

  //   const availableEmployees = employees.filter(
  //     (e) => !e.departments?.map((d: any) => d.department_id).includes(activeDept)
  //   );

  //   return (
  //     <div className="p-8 max-w-5xl mx-auto">
  //       <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

  //       <div className="grid grid-cols-3 gap-4">
  //         <div className="border rounded-xl p-4 shadow bg-white">
  //           <h2 className="text-xl font-semibold mb-3">Departments</h2>

  //           {departments.map((d) => (
  //             <div
  //               key={d.department_id}
  //               className={`p-2 rounded cursor-pointer ${
  //                 activeDept === d.department_id
  //                   ? "bg-blue-200 font-bold"
  //                   : "hover:bg-gray-200"
  //               }`}
  //               onClick={() => setActiveDept(d.department_id)}
  //             >
  //               {d.name}
  //             </div>
  //           ))}

  //           <div className="mt-4 flex gap-2">
  //             <input
  //               value={newDept}
  //               onChange={(e) => setNewDept(e.target.value)}
  //               className="border p-2 rounded flex-1"
  //               placeholder="New Department"
  //             />
  //             <button
  //               onClick={() => {
  //                 addDepartment(newDept);
  //                 setNewDept("");
  //               }}
  //               className="bg-blue-500 text-white px-4 py-2 rounded"
  //             >
  //               Add
  //             </button>
  //           </div>
  //         </div>

  //         {activeDept && (
  //           <div className="col-span-2 border p-4 bg-white rounded-xl shadow">
  //             <h2 className="text-lg font-bold mb-3">
  //               {departments.find((d) => d.department_id === activeDept)?.name}
  //             </h2>

  //             <h3 className="font-semibold mb-2">Assigned Employees</h3>
  //             {deptEmployees.length === 0 ? (
  //               <p className="text-gray-500">No employees assigned</p>
  //             ) : (
  //               deptEmployees.map((e) => (
  //                 <div
  //                   key={e.id}
  //                   className="border p-3 rounded flex justify-between mb-2"
  //                 >
  //                   <div>
  //                     <p className="font-medium">
  //                       {e.first_name} {e.last_name}
  //                     </p>
  //                     <p className="text-gray-600 text-sm">{e.email}</p>
  //                   </div>

  //                   <select
  //                     defaultValue={e.permission || ""}
  //                     className="border p-2 rounded"
  //                     onChange={(ev) =>
  //                       handleUpdatePermission(e.id, ev.target.value)
  //                     }
  //                   >
  //                     <option value="">Permission</option>
  //                     {PERMISSIONS.map((p) => (
  //                       <option key={p}>{p}</option>
  //                     ))}
  //                   </select>

  //                   <button
  //                     onClick={() => handleUnassign(e.id)}
  //                     className="bg-red-500 text-white px-3 py-1 rounded"
  //                   >
  //                     Unassign
  //                   </button>
  //                 </div>
  //               ))
  //             )}

  //             <h3 className="font-semibold mt-4 mb-2">Assign Employee</h3>
  //             <div className="flex gap-3">
  //               <select
  //                 className="border p-2 rounded flex-1"
  //                 onChange={(ev) => setSelectedEmployee(Number(ev.target.value))}
  //               >
  //                 <option value="">Select Employee</option>
  //                 {availableEmployees.map((e) => (
  //                   <option key={e.id} value={e.id}>
  //                     {e.first_name} {e.last_name}
  //                   </option>
  //                 ))}
  //               </select>

  //               <select
  //                 className="border p-2 rounded flex-1"
  //                 onChange={(ev) => setSelectedPermission(ev.target.value)}
  //               >
  //                 <option value="">Permission</option>
  //                 {PERMISSIONS.map((p) => (
  //                   <option key={p}>{p}</option>
  //                 ))}
  //               </select>

  //               <button
  //                 onClick={handleAssign}
  //                 className="bg-green-600 text-white px-4 py-2 rounded"
  //               >
  //                 Assign
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
// }
  



// import { useEffect, useState, useContext } from "react";
// import { useAdmin } from "../hooks/useAdmin";
// import { AuthContext } from "../../../context/AuthContext";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);
//   const {
//     departments,
//     employees,
//     fetchDepartments,
//     fetchEmployees,
//     addDepartment,
//     assignEmployee,
//     unassignEmployee,
//     addPermission,
//     removePermission,
//   } = useAdmin(token!);

//   const [activeDept, setActiveDept] = useState<number | null>(null);
//   const [newDept, setNewDept] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
//   const [selectedPermission, setSelectedPermission] = useState("");
//   const PERMISSIONS = ["read", "write", "manage"];

//   useEffect(() => {
//     if (!token) return;
//     fetchDepartments();
//     fetchEmployees();
//   }, [token]);

//   // Employees in active department
//   const deptEmployees = employees.filter((e) => e.department_id === activeDept);

//   // Employees not in active department
//   const availableEmployees = employees.filter(
//     (e) => e.department_id !== activeDept
//   );

//   const handleAssign = async () => {
//     if (!selectedEmployee || !activeDept)
//       return alert("Select employee and department");
//     await assignEmployee(selectedEmployee, activeDept);
//     alert("Employee assigned successfully!");
//   };

//   const handleAddPermission = async (empId: number, perm: string) => {
//     if (!perm) return;
//     await addPermission(empId, perm);
//   };

//   const handleRemovePermission = async (empId: number, perm: string) => {
//     if (!perm) return;
//     await removePermission(empId, perm);
//   };

//   const handleUnassign = async (empId: number) => {
//     await unassignEmployee(empId);
//   };

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

//       <div className="grid grid-cols-3 gap-4">
//         {/* Departments Panel */}
//         <div className="border rounded-xl p-4 shadow bg-white">
//           <h2 className="text-xl font-semibold mb-3">Departments</h2>
//           {departments.map((d) => (
//             <div
//               key={d.department_id}
//               className={`p-2 rounded cursor-pointer ${
//                 activeDept === d.department_id
//                   ? "bg-blue-200 font-bold"
//                   : "hover:bg-gray-200"
//               }`}
//               onClick={() => setActiveDept(d.department_id)}
//             >
//               {d.name}
//             </div>
//           ))}

//           <div className="mt-4 flex gap-2">
//             <input
//               value={newDept}
//               onChange={(e) => setNewDept(e.target.value)}
//               className="border p-2 rounded flex-1"
//               placeholder="New Department"
//             />
//             <button
//               onClick={() => {
//                 addDepartment(newDept);
//                 setNewDept("");
//               }}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Employees Panel */}
//         {activeDept && (
//           <div className="col-span-2 border p-4 bg-white rounded-xl shadow">
//             <h2 className="text-lg font-bold mb-3">
//               {departments.find((d) => d.department_id === activeDept)?.name}
//             </h2>

//             <h3 className="font-semibold mb-2">Assigned Employees</h3>
//             {deptEmployees.length === 0 ? (
//               <p className="text-gray-500">No employees assigned</p>
//             ) : (
//               deptEmployees.map((e) => (
//                 <div
//                   key={e.id}
//                   className="border p-3 rounded flex justify-between mb-2"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       {e.first_name} {e.last_name}
//                     </p>
//                     <p className="text-gray-600 text-sm">{e.email}</p>
//                     <p className="text-gray-600 text-sm">
//                       Permissions: {e.permissions.join(", ") || "None"}
//                     </p>
//                   </div>

//                   <div className="flex gap-2">
//                     <select
//                       defaultValue=""
//                       className="border p-2 rounded"
//                       onChange={(ev) =>
//                         handleAddPermission(e.id, ev.target.value)
//                       }
//                     >
//                       <option value="">Add Permission</option>
//                       {PERMISSIONS.map((p) => (
//                         <option key={p}>{p}</option>
//                       ))}
//                     </select>

//                     <select
//                       defaultValue=""
//                       className="border p-2 rounded"
//                       onChange={(ev) =>
//                         handleRemovePermission(e.id, ev.target.value)
//                       }
//                     >
//                       <option value="">Remove Permission</option>
//                       {PERMISSIONS.map((p) => (
//                         <option key={p}>{p}</option>
//                       ))}
//                     </select>

//                     <button
//                       onClick={() => handleUnassign(e.id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded"
//                     >
//                       Unassign
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}

//             <h3 className="font-semibold mt-4 mb-2">Assign Employee</h3>
//             <div className="flex gap-3">
//               <select
//                 className="border p-2 rounded flex-1"
//                 onChange={(ev) => setSelectedEmployee(Number(ev.target.value))}
//               >
//                 <option value="">Select Employee</option>
//                 {availableEmployees.map((e) => (
//                   <option key={e.id} value={e.id}>
//                     {e.first_name} {e.last_name}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 onClick={handleAssign}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Assign
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useAdmin } from "../hooks/useAdmin";
// import EmployeeTable from "../components/EmployeeTable";
// import AssignDepartmentModal from "../components/AssignDepartmentModal";
// import PermissionModal from "../components/PermissionModal";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);
//   const {
//     departments,
//     employees,
//     addDepartment,
//     assignDept,
//     updatePerm,
//     deleteDept,
//   } = useAdmin(token);

//   const [selectedDept, setSelectedDept] = useState<any>(null);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [modal, setModal] = useState<any>(null);

//   // Employees assigned to selected department
// const deptEmployees = selectedDept
//   ? employees.filter((e) =>
//       e.departments.some(
//         (d: any) => d.department_id === selectedDept.department_id
//       )
//     )
//   : [];


//   // Employees NOT in selected department
// const availableEmployees = selectedDept
//   ? employees.filter(
//       (e) =>
//         !e.departments.some(
//           (d: any) => d.department_id === selectedDept.department_id
//         )
//     )
//   : [];


//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

//       {/* Step 1: Departments List */}
//       {!selectedDept && (
//         <div className="bg-white p-4 rounded-xl shadow space-y-3">
//           <h2 className="text-2xl font-semibold mb-2">Departments</h2>
//           {departments.map((d) => (
//             <div
//               key={d.department_id}
//               className="cursor-pointer p-2 rounded hover:bg-blue-100"
//               onClick={() => setSelectedDept(d)}
//             >
//               {d.name}
//             </div>
//           ))}

//           {/* Add Department */}
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
//                 if (!newDeptName) return;
//                 await addDepartment(newDeptName);
//                 setNewDeptName("");
//               }}
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: Selected Department View */}
//       {selectedDept && (
//         <div className="mt-6 bg-white p-4 rounded-xl shadow">
//           <button
//             className="text-blue-600 mb-4"
//             onClick={() => setSelectedDept(null)}
//           >
//             &larr; Back to Departments
//           </button>

//           <h2 className="text-2xl font-semibold mb-4">
//             Department: {selectedDept.name}
//           </h2>

//           <h3 className="font-semibold mb-2">Assigned Employees</h3>
//           {deptEmployees.length === 0 ? (
//             <p className="text-gray-500">No employees assigned yet.</p>
//           ) : (
//             <EmployeeTable
//               employees={deptEmployees}
//               onEditPermission={(emp: any, dept: any) =>
//                 setModal({ type: "edit", emp, dept })
//               }
//               onRemoveDept={(empId: number) =>
//                 deleteDept(empId, selectedDept.department_id)
//               }
//               showAssign={false} // Disable assign in this table
//             />
//           )}

//           <h3 className="font-semibold mt-6 mb-2">Assign Employee</h3>
//           <div className="flex gap-2">
//             <select
//               className="border p-2 rounded flex-1"
//               onChange={(e) =>
//                 setModal({
//                   type: "assign",
//                   emp: availableEmployees.find(
//                     (em) => em.id === Number(e.target.value)
//                   ),
//                 })
//               }
//             >
//               <option value="">Select Employee</option>
//               {availableEmployees.map((e) => (
//                 <option key={e.id} value={e.id}>
//                   {e.first_name} {e.last_name}
//                 </option>
//               ))}
//             </select>
//             <button
//               className="bg-green-600 text-white px-4 py-2 rounded"
//               disabled={!modal?.emp}
//               onClick={() => modal?.emp && setModal({ ...modal, open: true })}
//             >
//               Assign
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Assign Employee Modal */}
//       {modal?.type === "assign" && modal.emp && (
//         <AssignDepartmentModal
//           employee={modal.emp}
//           departments={[selectedDept]}
//           onClose={() => setModal(null)}
//           onSave={async (deptId: number, permission: string) => {
//             await assignDept(modal.emp.id, deptId, permission);
//             setModal(null);
//           }}
//         />
//       )}

//       {/* Edit Permission Modal */}
//       {modal?.type === "edit" && modal.emp && modal.dept && (
//         <PermissionModal
//           employee={modal.emp}
//           department={modal.dept}
//           onClose={() => setModal(null)}
//           onSave={async (perm: string) => {
//             await updatePerm(modal.emp.id, modal.dept.department_id, perm);
//             setModal(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// import { useState, useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useAdmin } from "../hooks/useAdmin";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     selectedDepartmentEmployees, // 🔥 employees for selected dept only
//     addDepartment,
//     assignDept,
//     updatePerm,
//     deleteDept,
//     fetchEmployeesByDept, // 🔥 new fetch function
//   } = useAdmin(token);

//   const [selectedDept, setSelectedDept] = useState<any>(null);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [modal, setModal] = useState<any>(null);

//   // Select & Load Department
//   const openDepartment = async (dept: any) => {
//     setSelectedDept(dept);
//     await fetchEmployeesByDept(dept.department_id); // 🔥 Only load dept employees
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

//       {/* === 1️⃣ Departments List Page === */}
//       {!selectedDept && (
//         <div className="bg-white p-4 rounded-xl shadow space-y-3">
//           <h2 className="text-2xl font-semibold mb-4">Departments</h2>

//           {departments.map((d) => (
//             <button
//               key={d.department_id}
//               className="w-full text-left p-2 rounded hover:bg-blue-200"
//               onClick={() => openDepartment(d)}
//             >
//               {d.name}
//             </button>
//           ))}

//           {/* Add department */}
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

//       {/* === 2️⃣ Single Department View === */}
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

//           {/* List of assigned employees */}
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
//                         onClick={() => setModal({ type: "edit", emp })}
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

//           {/* Assign new employee */}
//           <button
//             className="mt-5 bg-green-600 px-4 py-2 text-white rounded"
//             onClick={() => setModal({ type: "assign" })}
//           >
//             + Assign Employee
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useAdmin } from "../hooks/useAdmin";
// import AssignDepartmentModal from "./../components/AssignDepartmentModal";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     selectedDepartmentEmployees,
//     employees: allEmployees, // 🔥 renamed for clarity
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

//   // Select & load department employees
//   const openDepartment = async (dept: any) => {
//     setSelectedDept(dept);
//     await fetchEmployeesByDept(dept.department_id);
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

//       {/* ===================== DEPARTMENT LIST ===================== */}
//       {!selectedDept && (
//         <div className="bg-white p-4 rounded-xl shadow space-y-3">
//           <h2 className="text-2xl font-semibold mb-4">Departments</h2>
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
//                           setModal("edit");
//                           setSelectedEmpId(emp.id);
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
//       {modal === "edit" && selectedDept && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-80 space-y-4">
//             <h2 className="text-xl font-bold">Update Permission</h2>

//             <input
//               type="text"
//               className="border p-2 w-full"
//               placeholder="New Permission"
//               value={permission}
//               onChange={(e) => setPermission(e.target.value)}
//             />

//             <div className="flex gap-3 justify-end">
//               <button
//                 className="px-4 py-2 bg-gray-400 rounded"
//                 onClick={() => setModal(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                 onClick={async () => {
//                   if (!selectedEmpId) return;
//                   await updatePerm(
//                     selectedEmpId,
//                     selectedDept.department_id,
//                     permission
//                   );
//                   await fetchEmployeesByDept(selectedDept.department_id);
//                   setModal(null);
//                 }}
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useAdmin } from "../hooks/useAdmin";
// import AssignDepartmentModal from "./../components/AssignDepartmentModal";
// import PermissionModal from "./../components/PermissionModal";

// export default function AdminDashboard() {
//   const { token } = useContext(AuthContext);

//   const {
//     departments,
//     selectedDepartmentEmployees,
//     employees: allEmployees, // 🔥 renamed for clarity
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

//   // Select & load department employees
//   const openDepartment = async (dept: any) => {
//     setSelectedDept(dept);
//     await fetchEmployeesByDept(dept.department_id);
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

//       {/* ===================== DEPARTMENT LIST ===================== */}
//       {!selectedDept && (
//         <div className="bg-white p-4 rounded-xl shadow space-y-3">
//           <h2 className="text-2xl font-semibold mb-4">Departments</h2>
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






// import Sidebar from "../components/Sidebar";
// import { Outlet } from "react-router-dom";

// export default function AdminDashboard() {
//   return (
//     <div className="flex w-full h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         <Outlet />
//       </div>
//     </div>
//   );
// }




// import { useState, useContext } from "react";
// import Sidebar from "../components/Sidebar";
// import TopNav from "../components/TopNav";
// import DepartmentPage from "./Department"; // import department page
// import { AuthContext } from "../../../context/AuthContext";

// export default function AdminDashboard() {
//   const [activePage, setActivePage] = useState("Dashboard");
//   const { token } = useContext(AuthContext);

//   // map page names to components
//   const pageComponents: Record<string, JSX.Element> = {
//     Dashboard: <div>Welcome to Admin Dashboard!</div>,
//     Departments: <DepartmentPage />,
//   };

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar onSelectPage={setActivePage} />

//       <div className="flex-1 flex flex-col">
//         <TopNav pageTitle={activePage} />

//         <main className="p-6 flex-1 bg-gray-50">
//           {pageComponents[activePage]}
//         </main>
//       </div>
//     </div>
//   );
// }



import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import DepartmentPage from "./Department";

export default function AdminDashboard() {
  const { pathname } = useLocation();

  // Map pathnames to page names
  const pathToPage: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/departments": "Departments",
  };

  // Determine active page from current path
  const activePage = pathToPage[pathname] || "Dashboard";

  const pageComponents: Record<string, JSX.Element> = {
    Dashboard: <div>Welcome to Admin Dashboard!</div>,
    Departments: <DepartmentPage />,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNav pageTitle={activePage} />

        <main className="p-6 flex-1 bg-gray-50">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}


