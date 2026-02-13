// import { useEffect, useState } from "react";
// import axios from "axios";

// interface Employee {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   role: string;
//   department_id?: number;
//   permissions: string[];
//   org_code?: string;
// }

// export default function EditEmployeePage() {
//     const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
//     null,
//   );
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

// //   const fetchEmployees = async () => {
// //     const res = await axios.get("/admin/employees");
// //     setEmployees(res.data.data);
//     //   };
//     const fetchEmployees = async () => {
//         try {
//               const token = localStorage.getItem("token");

//         const res = await axios.get(`${ADMIN_API_BASE}/employees`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // if required
//           },
//         });

//         setEmployees(res.data.data ?? res.data ?? []);
//       } catch (err) {
//         console.error("Failed to fetch employees", err);
//         setEmployees([]);
//       }
//     };


// //   const handleUpdate = async () => {
// //     if (!selectedEmployee) return;

// //     setLoading(true);
// //     await axios.put(
// //       `/admin/employees/${selectedEmployee.id}`,
// //       selectedEmployee,
// //     );
// //     setLoading(false);
// //     setSelectedEmployee(null);
// //     fetchEmployees();
// //   };

    
//     const handleUpdate = async () => {
//       if (!selectedEmployee) return;

//         try {
//              const token = localStorage.getItem("token");

//         setLoading(true);

//         await axios.put(
//           `${ADMIN_API_BASE}/employees/${selectedEmployee.id}`,
//           selectedEmployee,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // if required
//             },
//           },
//         );

//         setSelectedEmployee(null);
//         await fetchEmployees();
//       } catch (err) {
//         console.error("Failed to update employee", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//       <>
//         <div className="p-6 max-w-6xl mx-auto text-black">
//           <h1 className="text-2xl font-semibold mb-6">Edit Employees</h1>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Employee List */}
//             <div className="border rounded-xl p-4 shadow-sm">
//               <h2 className="font-medium mb-4">Employees</h2>
//               <ul className="space-y-2 max-h-[400px] overflow-y-auto">
//                 {employees.map((emp) => (
//                   <li
//                     key={emp.id}
//                     onClick={() => setSelectedEmployee(emp)}
//                     className={`p-3 rounded-lg cursor-pointer border hover:bg-gray-50 ${
//                       selectedEmployee?.id === emp.id ? "bg-gray-100" : ""
//                     }`}
//                   >
//                     <p className="font-medium">
//                       {emp.first_name} {emp.last_name}
//                     </p>
//                     <p className="text-sm text-gray-500">{emp.email}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Edit Form */}
//             {selectedEmployee && (
//               <div className="border rounded-xl p-6 shadow-sm">
//                 <h2 className="font-medium mb-4">Edit Details</h2>

//                 <div className="space-y-4">
//                   <input
//                     className="w-full border rounded-lg p-2"
//                     placeholder="First Name"
//                     value={selectedEmployee.first_name}
//                     onChange={(e) =>
//                       setSelectedEmployee({
//                         ...selectedEmployee,
//                         first_name: e.target.value,
//                       })
//                     }
//                   />

//                   <input
//                     className="w-full border rounded-lg p-2"
//                     placeholder="Last Name"
//                     value={selectedEmployee.last_name}
//                     onChange={(e) =>
//                       setSelectedEmployee({
//                         ...selectedEmployee,
//                         last_name: e.target.value,
//                       })
//                     }
//                   />

//                   <input
//                     className="w-full border rounded-lg p-2"
//                     placeholder="Email"
//                     value={selectedEmployee.email}
//                     onChange={(e) =>
//                       setSelectedEmployee({
//                         ...selectedEmployee,
//                         email: e.target.value,
//                       })
//                     }
//                   />

//                   <input
//                     className="w-full border rounded-lg p-2"
//                     placeholder="Org Code"
//                     value={selectedEmployee.org_code || ""}
//                     onChange={(e) =>
//                       setSelectedEmployee({
//                         ...selectedEmployee,
//                         org_code: e.target.value,
//                       })
//                     }
//                   />

//                   <select
//                     className="w-full border rounded-lg p-2"
//                     value={selectedEmployee.role}
//                     onChange={(e) =>
//                       setSelectedEmployee({
//                         ...selectedEmployee,
//                         role: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="employee">Employee</option>
//                     <option value="manager">Manager</option>
//                     <option value="admin">Admin</option>
//                   </select>

//                   <button
//                     disabled={loading}
//                     onClick={handleUpdate}
//                     className="w-full bg-black text-white rounded-lg py-2 hover:opacity-90"
//                   >
//                     {loading ? "Updating..." : "Update Employee"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </>
//     );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status?: string;
}

export default function EmployeeManagementPage() {
  const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
const [showPassword, setShowPassword] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "employee",
  });

  /* ================= FETCH ================= */
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_BASE}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    try {
      setLoading(true);
      await axios.post(`${ADMIN_API_BASE}/employees`, newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewEmployee({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "employee",
      });

      setCreating(false);
      fetchEmployees();
    } catch (err) {
      console.error("Create failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);

      await axios.put(
        `${ADMIN_API_BASE}/employees/${selectedEmployee.id}`,
        selectedEmployee,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axios.delete(`${ADMIN_API_BASE}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employee Management</h1>

          <button
            onClick={() => setCreating(!creating)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            + Add Employee
          </button>
        </div>

        {/* ================= CREATE FORM ================= */}
        {creating && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="font-semibold mb-4">Create Employee</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-2 rounded-lg"
                placeholder="First Name"
                value={newEmployee.first_name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, first_name: e.target.value })
                }
              />
              <input
                className="border p-2 rounded-lg"
                placeholder="Last Name"
                value={newEmployee.last_name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, last_name: e.target.value })
                }
              />
              <input
                className="border p-2 rounded-lg"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />
              {/* <input
                type="password"
                className="border p-2 rounded-lg"
                placeholder="Password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
              /> */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="border p-2 rounded-lg w-full pr-10"
                  placeholder="Password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <select
                className="border p-2 rounded-lg col-span-2"
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                  <td>{emp.status || "active"}</td>
                  <td className="text-right pr-4 space-x-3">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= EDIT MODAL ================= */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="font-semibold mb-4">Edit Employee</h2>

              <div className="space-y-3">
                <input
                  className="w-full border p-2 rounded-lg"
                  value={selectedEmployee.first_name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      first_name: e.target.value,
                    })
                  }
                />

                <input
                  className="w-full border p-2 rounded-lg"
                  value={selectedEmployee.last_name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      last_name: e.target.value,
                    })
                  }
                />

                <select
                  className="w-full border p-2 rounded-lg"
                  value={selectedEmployee.role}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded-lg"
                >
                  {loading ? "Updating..." : "Update"}
                </button>

                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="w-full mt-2 text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
