import { useEffect, useState } from "react";
import axios from "axios";

type Organisation = {
  id: number;
  name: string;
  org_code: string;
};

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

const ManageOrgDepartments = () => {
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");

  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  /* Fetch Organisations */
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axios.get<ApiResponse<Organisation[]>>(
          `${API_BASE}/organisations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          setOrganisations(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch organisations");
      }
    };

    fetchOrgs();
  }, []);

  /* Add Department */
  const handleAddDepartment = async () => {
    if (!selectedOrg || !departmentName.trim()) {
      setError("Please select organisation and enter department name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post<ApiResponse>(
        `${API_BASE}/organisations/departments/add`,
        {
          org_code: selectedOrg,
          department_name: departmentName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setSuccess("Department added successfully");
      setDepartmentName("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* Remove Department */
  const handleRemoveDepartment = async () => {
    if (!selectedOrg || !departmentName.trim()) {
      setError("Please select organisation and enter department name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.delete<ApiResponse>(
        `${API_BASE}/organisations/departments/remove`,
        {
          data: {
            org_code: selectedOrg,
            department_name: departmentName,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setSuccess("Department removed successfully");
      setDepartmentName("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Organisation Departments
        </h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Select Organisation */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Organisation
            </label>

            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">-- Select Organisation --</option>
              {organisations.map((org) => (
                <option key={org.id} value={org.org_code}>
                  {org.name} ({org.org_code})
                </option>
              ))}
            </select>
          </div>

          {/* Department Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Department Name
            </label>

            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddDepartment}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Add Department"}
            </button>

            <button
              onClick={handleRemoveDepartment}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Remove Department"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrgDepartments;
