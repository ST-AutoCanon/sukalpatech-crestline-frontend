import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Alert from "../../../components/Aleartmessage";
import ConfirmAlert from "../../../../src/features/user/components/ConfirmAlert";

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "employee",
    category: "",
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
      console.error("Fetch error:", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!newEmployee.first_name.trim()) {
      return setAlert({ type: "error", message: "First Name is required" });
    }

    if (!newEmployee.email.trim()) {
      return setAlert({ type: "error", message: "Email is required" });
    }

    const emailRegex = /^[\w.-]+@(gmail\.com|yopmail\.com)$/i;
    if (!emailRegex.test(newEmployee.email)) {
      return setAlert({
        type: "error",
        message: "Enter valid email (gmail/yopmail only)",
      });
    }

    if (!newEmployee.password.trim()) {
      return setAlert({ type: "error", message: "Password is required" });
    }

    if (!newEmployee.category) {
      return setAlert({ type: "error", message: "Category is required" });
    }

    try {
      setLoading(true);

      await axios.post(`${ADMIN_API_BASE}/employees`, newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setAlert({
        type: "success",
        message: "Employee created successfully ✅",
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

    } catch (err: any) {
      console.log("CREATE ERROR:", err.response?.data);

      let message = "Failed to create employee ❌";

      if (err.response?.data?.message?.toLowerCase().includes("email")) {
        message = "Email already exists ⚠️";
      } else {
        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          message;
      }

      setAlert({
        type: "error",
        message,
      });

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
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setAlert({
        type: "success",
        message: "Employee updated successfully ✅",
      });

      setSelectedEmployee(null);
      fetchEmployees();

    } catch (err: any) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message || "Failed to update employee ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${ADMIN_API_BASE}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setAlert({
        type: "success",
        message: "Employee deleted successfully 🗑️",
      });

      fetchEmployees();
    } catch (err: any) {
      let message = "Failed to delete employee ❌";

      if (err.response?.data?.message?.toLowerCase().includes("email")) {
        message = "Email related error ⚠️";
      } else {
        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          message;
      }

      setAlert({
        type: "error",
        message,
      });
    }
  };

  return (

    <>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />

      )}
      {showConfirm && (
        <ConfirmAlert
          message="Are you sure you want to delete this employee?"
          onConfirm={() => {
            if (deleteId !== null) {
              handleDelete(deleteId);
            }
            setShowConfirm(false);
            setDeleteId(null);
          }}
          onCancel={() => {
            setShowConfirm(false);
            setDeleteId(null);
          }}
        />
      )}
      <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white py-6">
        {/* Outer Gradient Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Employee Management
            </h1>
            {/* <button
            onClick={() => setCreating(!creating)}
            className="w-full sm:w-auto bg-black text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            + Add Employee
          </button> */}
            <button
              onClick={() => setCreating(!creating)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap"
            >
              + Add Employee
            </button>
          </div>

          {/* Create Employee Form */}
          {creating && (
            <div className="bg-white text-black p-6 rounded-2xl shadow-md mb-8">
              <h2 className="text-lg font-semibold mb-5">Create Employee</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="First Name"
                  value={newEmployee.first_name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, first_name: e.target.value })
                  }
                />
                <input
                  className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Last Name"
                  value={newEmployee.last_name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, last_name: e.target.value })
                  }
                />
                <input
                  className="border rounded-xl px-4 py-3 w-full md:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewEmployee({ ...newEmployee, email: value });
                  }}
                />
                {emailError && (
                  <p className="text-red-600 text-sm md:col-span-2">
                    {emailError}
                  </p>
                )}
                <div className="relative w-full md:col-span-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border rounded-xl px-4 py-3 w-full pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
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
                  className="border rounded-xl px-4 py-3 md:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
                <select
                  className="border rounded-xl px-4 py-3 md:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={newEmployee.category}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, category: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Category Limit
                  </option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="mt-6 w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
              >
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          )}

          {/* Employee Table */}
          <div className="bg-white text-black rounded-2xl shadow-md overflow-x-auto">
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
                    <td className="p-4 break-words max-w-[150px] sm:max-w-none">
                      {emp.status || "active"}
                    </td>
                    <td className="whitespace-nowrap capitalize">
                      {emp.category}
                    </td>
                    <td className="pr-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(emp.id);
                            setShowConfirm(true);
                          }}
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
                    <td colSpan={6} className="text-center p-6 text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {selectedEmployee && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white text-black p-6 rounded-2xl w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
                <div className="space-y-4">
                  <input
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={selectedEmployee.first_name}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        first_name: e.target.value,
                      })
                    }
                  />
                  <input
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={selectedEmployee.last_name}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        last_name: e.target.value,
                      })
                    }
                  />

                  <input
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={selectedEmployee.email}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        email: e.target.value,
                      })
                    }
                  />
                  <select
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
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
                  </select>
                  <select
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={selectedEmployee.category || ""}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Category Limit
                    </option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:opacity-90 transition"
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
    </>
  )
}