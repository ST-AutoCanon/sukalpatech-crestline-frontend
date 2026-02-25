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
  category?: string;

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
  const [emailError, setEmailError] = useState<string | null>(null);


  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "employee",
    category: "Medium",

  });

  /* ================= FETCH ================= */
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_BASE}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
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
    if (emailError) {
      alert("Invalid Email Id");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${ADMIN_API_BASE}/employees`, newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setNewEmployee({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "employee",
        category: "",
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
    <div className="min-h-screen bg-gray-50 text-black px-3 sm:px-4 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Employee Management
          </h1>

          <button
            onClick={() => setCreating(!creating)}
            className="w-full sm:w-auto bg-black text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            + Add Employee
          </button>
        </div>

        {/* ================= CREATE FORM ================= */}
        {creating && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-8">
            <h2 className="font-semibold mb-5 text-lg">Create Employee</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border p-2.5 rounded-lg w-full"
                placeholder="First Name"
                value={newEmployee.first_name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, first_name: e.target.value })
                }
              />

              <input
                className="border p-2.5 rounded-lg w-full"
                placeholder="Last Name"
                value={newEmployee.last_name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, last_name: e.target.value })
                }
              />

              <input
                className="border p-2.5 rounded-lg w-full md:col-span-2"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewEmployee({ ...newEmployee, email: value });

                  // ✅ Simple email regex validation
                  const emailRegex = /^[\w.-]+@(gmail\.com|yopmail\.com)$/i;
                  if (!emailRegex.test(value)) {
                    setEmailError("Invalid email. Must be @gmail.com or @yopmail.com");
                  } else {
                    setEmailError(null);
                  }
                }}

                {...emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}

              />


              <div className="relative w-full md:col-span-2">
                <input
                  type={showPassword ? "text" : "password"}
                  className="border p-2.5 rounded-lg w-full pr-10"
                  placeholder="Password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <select
                className="border p-2 rounded-lg col-span-2"
                value={newEmployee.category}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, category: e.target.value })
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>


            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="mt-6 w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg"
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-left">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-4 whitespace-nowrap">Name</th>
                  <th className="whitespace-nowrap">Email</th>
                  <th className="whitespace-nowrap">Role</th>
                  <th className="whitespace-nowrap">Status</th>
                  <th className="whitespace-nowrap">Category</th>

                  <th className="text-right pr-4 whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 whitespace-nowrap">
                      {emp.first_name} {emp.last_name}
                    </td>

                    <td className="break-all max-w-[250px]">{emp.email}</td>

                    <td className="whitespace-nowrap capitalize">{emp.role}</td>

                    <td className="whitespace-nowrap">
                      {emp.status || "active"}
                    </td>
                    <td className="whitespace-nowrap capitalize">{emp.category}</td>


                    <td className="pr-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
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
                      </div>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= EDIT MODAL ================= */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="font-semibold mb-4 text-lg">Edit Employee</h2>

              <div className="space-y-4">
                <input
                  className="w-full border p-2.5 rounded-lg"
                  value={selectedEmployee.first_name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      first_name: e.target.value,
                    })
                  }
                />

                <input
                  className="w-full border p-2.5 rounded-lg"
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
                  value={selectedEmployee.category || ""} // empty string default
                  onChange={(e) =>
                    setSelectedEmployee({ ...selectedEmployee, category: e.target.value })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>


                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full bg-black text-white py-2.5 rounded-lg"
                >
                  {loading ? "Updating..." : "Update"}
                </button>

                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="w-full text-gray-500"
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
