// import { useState } from "react";
// import axios from "axios";
// import Alert from "../../../../components/Aleartmessage";

// type ApiResponse<T = any> = {
//   success: boolean;
//   message: string;
//   data?: T;
// };

// const CreateOrganisation = () => {
//   const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

//   const [name, setName] = useState("");
//   const [orgCode, setOrgCode] = useState("");
//   const [adminFirstName, setAdminFirstName] = useState("");
//   const [adminLastName, setAdminLastName] = useState("");
//   const [adminEmail, setAdminEmail] = useState("");
//   const availableDepartments = [
//     { value: "Finance", label: "Finance" },
//     { value: "Procurement", label: "Procurement" },
//     { value: "BD", label: "Business Development (BD)" },
//     { value: "Feasibility", label: "Feasibility" },
//     { value: "Two_Wheeler", label: "Two_Wheeler" },
//     { value: "Three_Wheeler", label: "Three_Wheeler" },
//     { value: "Food_Business", label: "Food_Business" },
//     { value: "egnineering_design", label: "enginerring_design" },
//     { value: "stores_materials", label: "stores_materials" },
//     { value: "fabrication_structure", label: "fabrication_structure" },
//     { value: "quality_control", label: "quality_control" },






//   ];
//   const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   const handleDepartmentChange = (dept: string) => {
//     setSelectedDepartments((prev) =>
//       prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (
//       !name.trim() ||
//       !orgCode.trim() ||
//       !adminFirstName.trim() ||
//       !adminLastName.trim() ||
//       !adminEmail.trim()
//     ) {
//       setAlert({ type: "error", message: "All fields are required" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post<ApiResponse>(
//         `${ADMIN_API_BASE}/organisations-admin/register`,
//         {
//           name,
//           org_code: orgCode,
//           admin: {
//             sts_employee_id: 1,
//             first_name: adminFirstName,
//             last_name: adminLastName,
//             email: adminEmail,
//           },
//           departments: selectedDepartments,
//         },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         },
//       );

//       if (!res.data.success) {
//         setAlert({
//           type: "error",
//           message: res.data.message || "Failed to create organisation",
//         });
//         return;
//       }

//       setAlert({
//         type: "success",
//         message: res.data.message || "Organisation created successfully 🎉",
//       });
//       setName("");
//       setOrgCode("");
//       setAdminFirstName("");
//       setAdminLastName("");
//       setAdminEmail("");
//       setSelectedDepartments([]);
//     } catch (err: any) {
//       setAlert({
//         type: "error",
//         message:
//           err.response?.data?.message || "Server error. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {alert && (
//         <Alert
//           type={alert.type}
//           message={alert.message}
//           onClose={() => setAlert(null)}
//         />
//       )}

//       <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 lg:p-8">
//         <div className="flex-1 w-full max-w-4xl mx-auto">
//           {/* Card */}
//           <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
//               Create Organisation
//             </h2>
//             <p className="text-gray-500 mb-10 text-sm sm:text-base">
//               Register a new organisation and assign an administrator.
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-6 mt-3">
//               {/* Organisation Info */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
//                     Organisation Name
//                   </label>
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Acme Corporation"
//                     required
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
//                     Organisation Code
//                   </label>
//                   <input
//                     type="text"
//                     value={orgCode}
//                     onChange={(e) => setOrgCode(e.target.value)}
//                     placeholder="ACME001"
//                     required
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Admin Section */}
//               <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
//                 <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
//                   Organisation Admin
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <input
//                     type="text"
//                     value={adminFirstName}
//                     onChange={(e) => setAdminFirstName(e.target.value)}
//                     placeholder="First Name"
//                     required
//                     className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
//                   />
//                   <input
//                     type="text"
//                     value={adminLastName}
//                     onChange={(e) => setAdminLastName(e.target.value)}
//                     placeholder="Last Name"
//                     required
//                     className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
//                   />
//                   <input
//                     type="email"
//                     value={adminEmail}
//                     onChange={(e) => setAdminEmail(e.target.value)}
//                     placeholder="admin@acme.com"
//                     required
//                     className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Departments */}
//               <div>
//                 <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
//                   Select Departments
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {availableDepartments.map((dept) => {
//                     const isSelected = selectedDepartments.includes(dept.value);
//                     return (
//                       <div
//                         key={dept.value}
//                         onClick={() => handleDepartmentChange(dept.value)}
//                         className={`cursor-pointer rounded-lg p-3 border transition flex items-center justify-between
//                           ${isSelected ? "bg-blue-50 border-blue-400" : "bg-white hover:bg-gray-50 border-gray-200"}`}
//                       >
//                         <span className="text-gray-700 font-medium text-sm">
//                           {dept.label}
//                         </span>
//                         <div
//                           className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
//                           ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}
//                         >
//                           {isSelected && (
//                             <div className="w-2 h-2 bg-white rounded-full" />
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-semibold text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50"
//                 >
//                   {loading ? "Creating Organisation..." : "Create Organisation"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateOrganisation;

import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../../../../components/Aleartmessage";

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


  const [availableDepartments, setAvailableDepartments] = useState<
  { value: string; label: string }[]
    >([]);
  
  
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);


  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const res = await axios.get<ApiResponse<{ name: string }[]>>(
        `${ADMIN_API_BASE}/organisations-admin/departments`,
        { withCredentials: true }
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
          headers: { "Content-Type": "application/json" },
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

      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 lg:p-8">
        <div className="flex-1 w-full max-w-4xl mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              Create Organisation
            </h2>
            <p className="text-gray-500 mb-10 text-sm sm:text-base">
              Register a new organisation and assign an administrator.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 mt-3">
              {/* Organisation Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
                    Organisation Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Corporation"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
                  />
                </div>

                <div>
                  <label className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
                    Organisation Code
                  </label>
                  <input
                    type="text"
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value)}
                    placeholder="ACME001"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Admin Section */}
              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
                  Organisation Admin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={adminFirstName}
                    onChange={(e) => setAdminFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
                  />
                  <input
                    type="text"
                    value={adminLastName}
                    onChange={(e) => setAdminLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
                  />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@acme.com"
                    required
                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Departments */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-3">
                  Select Departments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableDepartments.map((dept) => {
                    const isSelected = selectedDepartments.includes(dept.value);
                    return (
                      <div
                        key={dept.value}
                        onClick={() => handleDepartmentChange(dept.value)}
                        className={`cursor-pointer rounded-lg p-3 border transition flex items-center justify-between
                          ${isSelected ? "bg-blue-50 border-blue-400" : "bg-white hover:bg-gray-50 border-gray-200"}`}
                      >
                        <span className="text-gray-700 font-medium text-sm">
                          {dept.label}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}
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

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-semibold text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50"
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
};

export default CreateOrganisation;