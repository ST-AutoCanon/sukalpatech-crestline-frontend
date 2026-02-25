import { useState } from "react";
import axios from "axios";
import Alert from "../../../components/Aleartmessage";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

const CreateOrganisation = () => {
  const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [name, setName] = useState("");
  const [orgCode, setOrgCode] = useState("");

  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const availableDepartments = [
    { value: "Finance", label: "Finance" },
    { value: "Procurement", label: "Procurement" },
    { value: "BD", label: "Business Development (BD)" },
    { value: "Feasibility", label: "Feasibility" },
  ];

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !orgCode.trim() ||
      !adminFirstName.trim() ||
      !adminLastName.trim() ||
      !adminEmail.trim()
    ) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post<ApiResponse>(
        `${ADMIN_API_BASE}/organisations-admin/register`,
        {
          name,
          org_code: orgCode,
          admin: {
            sts_employee_id: 1,
            first_name: adminFirstName,
            last_name: adminLastName,
            email: adminEmail,
          },
          departments: selectedDepartments,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.data.success) {
        setAlert({
          type: "error",
          message: res.data.message || "Failed to create organisation",
        });
        return;
      }

      setAlert({
        type: "success",
        message: res.data.message || "Organisation created successfully 🎉",
      });

      setName("");
      setOrgCode("");
      setAdminFirstName("");
      setAdminLastName("");
      setAdminEmail("");
      setSelectedDepartments([]);
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

    {/* Outer wrapper */}
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Card container */}
        <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Create Organisation
          </h2>

          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            Register a new organisation and assign an administrator.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            {/* Organisation Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-600 mb-2 mt-2">
                  Organisation Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-600 mb-2 mt-2">
                  Organisation Code
                </label>
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="ACME001"
                  required
                />
              </div>
            </div>

            {/* Admin Section */}
            <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border">
              <h3 className="text-lg font-semibold text-gray-800 mb-5">
                Organisation Admin
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={adminFirstName}
                  onChange={(e) => setAdminFirstName(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  value={adminLastName}
                  onChange={(e) => setAdminLastName(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Last Name"
                  required
                />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="admin@acme.com"
                  required
                />
              </div>
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Select Departments
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {availableDepartments.map((dept) => {
                  const isSelected = selectedDepartments.includes(dept.value);
                  return (
                    <div
                      key={dept.value}
                      onClick={() => handleDepartmentChange(dept.value)}
                      className={`cursor-pointer border rounded-xl p-4 transition
                        ${
                          isSelected
                            ? "bg-blue-100 border-blue-500"
                            : "bg-white hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 text-sm sm:text-base">
                          {dept.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${
                            isSelected
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 font-semibold text-base sm:text-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Creating Organisation..." : "Create Organisation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
);
}
export default CreateOrganisation;
