import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../../../components/Aleartmessage";

type Organisation = {
  id: number;
  name: string;
  org_code: string;
};

type OrganisationDetails = {
  id: number;
  name: string;
  org_code: string;
  admin?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  departments?: string[];
};

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

const UpdateOrganisation = () => {
  const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [orgCode, setOrgCode] = useState("");

  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<
    { value: string; label: string }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get<ApiResponse<{ name: string }[]>>(
          `${ADMIN_API_BASE}/organisations-admin/departments`,
          { withCredentials: true },
        );
        if (res.data.success && res.data.data) {
          const mapped = res.data.data.map((d) => ({
            value: d.name,
            label: d.name,
          }));
          setAvailableDepartments(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch departments");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch Organisations
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axios.get<ApiResponse<Organisation[]>>(
          `${ADMIN_API_BASE}/organisations-admin`,
          { withCredentials: true },
        );
        if (res.data.success) setOrganisations(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch organisations");
      }
    };
    fetchOrgs();
  }, []);

  // Fetch Organisation Details
  const fetchOrganisationDetails = async (orgId: number) => {
    try {
      setFetchingDetails(true);
      const res = await axios.get<ApiResponse<OrganisationDetails>>(
        `${ADMIN_API_BASE}/organisations-admin/${orgId}`,
        { withCredentials: true },
      );

      if (res.data.success && res.data.data) {
        const org = res.data.data;
        setName(org.name || "");
        setOrgCode(org.org_code || "");
        setAdminFirstName(org.admin?.first_name || "");
        setAdminLastName(org.admin?.last_name || "");
        setAdminEmail(org.admin?.email || "");
        setSelectedDepartments(org.departments || []);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to load organisation details",
      });
    } finally {
      setFetchingDetails(false);
    }
  };

  // Handle Department Selection
  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrgId) {
      setAlert({ type: "error", message: "Please select organisation" });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put<ApiResponse>(
        `${ADMIN_API_BASE}/organisations-admin/${selectedOrgId}`,
        {
          name,
          admin: {
            first_name: adminFirstName,
            last_name: adminLastName,
            email: adminEmail,
          },
          departments: selectedDepartments,
        },
        { withCredentials: true },
      );

      setAlert({
        type: res.data.success ? "success" : "error",
        message:
          res.data.message ||
          (res.data.success
            ? "Organisation updated successfully 🎉"
            : "Update failed"),
      });

      if (res.data.success) {
        // RESET dropdown AND all fields
        setSelectedOrgId(null);
        setName("");
        setOrgCode("");
        setAdminFirstName("");
        setAdminLastName("");
        setAdminEmail("");
        setSelectedDepartments([]);
        setTimeout(() => setAlert(null), 4000);
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message || "Server error. Please try again.",
      });
    } finally {
      setLoading(false);
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

      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 lg:p-8">
        <div className="flex-1 w-full max-w-4xl mx-auto">
          <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              Update Organisation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Organisation */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Select Organisation
                </label>
                <select
                  className="w-full border rounded-xl px-4 py-3 text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                  value={selectedOrgId ?? ""}
                  onChange={(e) => {
                    const orgId = Number(e.target.value);
                    setSelectedOrgId(orgId);
                    if (orgId) fetchOrganisationDetails(orgId);
                  }}
                >
                  <option value="">-- Select --</option>
                  {organisations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.org_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Form always visible, disable fields if no org selected */}
              {fetchingDetails && selectedOrgId && (
                <p>Loading organisation details...</p>
              )}

              <div
                className={`${!selectedOrgId ? "opacity-50 pointer-events-none" : ""} space-y-6`}
              >
                {/* Organisation Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Organisation Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Organisation Code"
                    value={orgCode}
                    readOnly
                    className="rounded-xl border px-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                {/* Admin Info */}
                <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5">
                    Organisation Admin
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={adminFirstName}
                      onChange={(e) => setAdminFirstName(e.target.value)}
                      className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={adminLastName}
                      onChange={(e) => setAdminLastName(e.target.value)}
                      className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="admin@acme.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Departments */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Select Departments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableDepartments.map((dept) => {
                      const isSelected = selectedDepartments.includes(
                        dept.value,
                      );
                      return (
                        <div
                          key={dept.value}
                          onClick={() => handleDepartmentChange(dept.value)}
                          className={`cursor-pointer border rounded-xl p-4 flex justify-between items-center transition ${
                            isSelected
                              ? "bg-blue-100 border-blue-500"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-gray-700 font-medium">
                            {dept.label}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !selectedOrgId}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Organisation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateOrganisation;