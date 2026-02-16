import { useState } from "react";
import axios from "axios";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

const CreateOrganisation = () => {
  const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [name, setName] = useState("");
  const [orgCode, setOrgCode] = useState("");

  // Admin fields
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Departments
  const availableDepartments = [
    { value: "Finance", label: "Finance" },
    { value: "Procurement", label: "Procurement" },
    { value: "BD", label: "Business Development (BD)" },
    { value: "Feasibility", label: "Feasibility" },
  ];

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !orgCode.trim() ||
      !adminFirstName.trim() ||
      !adminLastName.trim() ||
      !adminEmail.trim()
    ) {
      setError("All fields are required");
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
            sts_employee_id: 1, // Can be auto-generated later
            first_name: adminFirstName,
            last_name: adminLastName,
            email: adminEmail,
          },
          departments: selectedDepartments, // ✅ sending selected departments
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.data.success) {
        setError(res.data.message || "Failed to create organisation");
        return;
      }

      setSuccess(res.data.message || "Organisation created successfully 🎉");

      // Reset form
      setName("");
      setOrgCode("");
      setAdminFirstName("");
      setAdminLastName("");
      setAdminEmail("");
      setSelectedDepartments([]);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Server error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//         Create Organisation
//       </h2>

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-2">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Organisation Info */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Organisation Name
//           </label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2"
//             placeholder="Acme Corporation"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Organisation Code
//           </label>
//           <input
//             type="text"
//             value={orgCode}
//             onChange={(e) => setOrgCode(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2"
//             placeholder="ACME001"
//             required
//           />
//         </div>

//         {/* Admin Details */}
//         <hr className="my-4" />
//         <h3 className="text-lg font-medium text-gray-800">
//           Organisation Admin
//         </h3>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             First Name
//           </label>
//           <input
//             type="text"
//             value={adminFirstName}
//             onChange={(e) => setAdminFirstName(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2"
//             placeholder="Admin"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Last Name
//           </label>
//           <input
//             type="text"
//             value={adminLastName}
//             onChange={(e) => setAdminLastName(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2"
//             placeholder="User"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             value={adminEmail}
//             onChange={(e) => setAdminEmail(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2"
//             placeholder="admin@acme.com"
//             required
//           />
//         </div>

//         {/* Departments Selection */}
//         <hr className="my-4" />
//         <h3 className="text-lg font-medium text-gray-800">
//           Select Departments
//         </h3>

//         <div className="grid grid-cols-2 gap-2 mt-2">
//           {availableDepartments.map((dept) => (
//             <label
//               key={dept.value}
//               className="flex items-center space-x-2 text-sm text-gray-700"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedDepartments.includes(dept.value)}
//                 onChange={() => handleDepartmentChange(dept.value)}
//                 className="rounded border-gray-300"
//               />
//               <span>{dept.label}</span>
//             </label>
//           ))}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {loading ? "Creating..." : "Create Organisation"}
//         </button>
//       </form>
//     </div>
  //   );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Create Organisation
        </h2>
        <p className="text-gray-500 mb-6">
          Register a new organisation and assign an administrator.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Organisation Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Organisation Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Acme Corporation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Organisation Code
              </label>
              <input
                type="text"
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="ACME001"
                required
              />
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Organisation Admin
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                value={adminFirstName}
                onChange={(e) => setAdminFirstName(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="First Name"
                required
              />

              <input
                type="text"
                value={adminLastName}
                onChange={(e) => setAdminLastName(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Last Name"
                required
              />

              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="admin@acme.com"
                required
              />
            </div>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Select Departments
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
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
                      <span className="font-medium text-gray-700">
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
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating Organisation..." : "Create Organisation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default CreateOrganisation;
