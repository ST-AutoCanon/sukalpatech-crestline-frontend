// // src/pages/businessDevFood/FoodBusinessPage.tsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Alert from "../../../components/Aleartmessage";
// import { useNavigate } from "react-router-dom";

// interface FoodBusinessPageProps {
//   onClose?: () => void;     // Close the modal
//   onSuccess?: () => void;   // Refresh parent list
// }

// const initialFormData = {
//   company_name: "",
//   contact_person: "",
//   phone: "",
//   email: "",
//   project_title: "",
//   expected_quantity: "",
//   estimated_budget: "",
//   product_category: "",
//   product_name: "",
//   packaging_type: "",
//   shelf_life: "",
//   storage_condition: "",
//   business_status: "",
//   comment: "",
// };

// const FoodBusinessPage: React.FC<FoodBusinessPageProps> = ({ onClose, onSuccess }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState(initialFormData);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

//   // Check login
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.alert("Please login first!");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setAlert(null);

//     if (!formData.company_name || !formData.contact_person || !formData.phone) {
//       setAlert({ type: "error", message: "Please fill required fields" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = { ...formData, industry_type: "FOOD" };
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         "http://localhost:5004/api/business-development/food/create",
//         payload,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setAlert({ type: "success", message: "Food Business Created Successfully ✅" });
//         setFormData(initialFormData);

//         // Call parent callbacks
//         setTimeout(() => {
//           if (onClose) onClose();
//         }, 1500); // 1.5s delay to show alert
//       } else {
//         setAlert({ type: "error", message: res.data.message || "Failed to save" });
//       }
//     } catch (error: any) {
//       console.error(error);
//       setAlert({ type: "error", message: error.response?.data?.message || "Server Error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

//       <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 lg:p-8">
//         <div className="flex-1 w-full max-w-4xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
//               Food Industry Business Development
//             </h2>
//             <p className="text-gray-500 mb-6 text-sm sm:text-base">
//               Create a new food product business development request.
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Company Info */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <input name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" className="border rounded-lg p-3" required />
//                 <input name="contact_person" value={formData.contact_person} onChange={handleChange} placeholder="Contact Person" className="border rounded-lg p-3" required />
//                 <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border rounded-lg p-3" required />
//                 <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border rounded-lg p-3" />
//               </div>

//               {/* Project Details */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <input name="project_title" value={formData.project_title} onChange={handleChange} placeholder="Project Title" className="border rounded-lg p-3" />
//                 <input name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} placeholder="Expected Quantity" className="border rounded-lg p-3" />
//                 <input name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} placeholder="Estimated Budget" className="border rounded-lg p-3" />
//               </div>

//               {/* Product Details */}
//               <h3 className="text-md sm:text-lg font-semibold text-gray-800">Product Details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <input name="product_category" value={formData.product_category} onChange={handleChange} placeholder="Product Category" className="border rounded-lg p-3" />
//                 <input name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" className="border rounded-lg p-3" />
//                 <input name="packaging_type" value={formData.packaging_type} onChange={handleChange} placeholder="Packaging Type" className="border rounded-lg p-3" />
//                 <input name="shelf_life" value={formData.shelf_life} onChange={handleChange} placeholder="Shelf Life" className="border rounded-lg p-3" />
//                 <input name="storage_condition" value={formData.storage_condition} onChange={handleChange} placeholder="Storage Condition" className="border rounded-lg p-3" />
//               </div>

//               {/* Status & Comment */}
//               <h3 className="text-md sm:text-lg font-semibold text-gray-800">
//                 Business Review
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Status Dropdown */}
//                 <select
//                   name="business_status"
//                   value={formData.business_status}
//                   onChange={(e) =>
//                     setFormData({ ...formData, business_status: e.target.value })
//                   }
//                   className="border rounded-lg p-3"
//                 >
//                   <option value="">Select Status</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="APPROVED">Approved</option>
//                   <option value="REJECTED">Rejected</option>
//                 </select>

//                 {/* Comment Input */}
//                 <input
//                   name="comment"
//                   value={formData.comment}
//                   onChange={handleChange}
//                   placeholder="Comment"
//                   className="border rounded-lg p-3"
//                 />
//               </div>

//               <div>
//                 <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-semibold hover:opacity-90 disabled:opacity-50">
//                   {loading ? "Creating Business..." : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FoodBusinessPage;


// src/pages/businessDevFood/FoodBusinessPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../../../../components/Aleartmessage";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function FoodBusinessPage({ onClose, onSuccess }: Props) {
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState("business");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    project_title: "",
    expected_quantity: "",
    estimated_budget: "",
    product_category: "",
    product_name: "",
    packaging_type: "",
    shelf_life: "",
    storage_condition: "",
    business_status: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/login");
    }
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setAlert(null);

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const payload = {
        ...formData,
        industry_type: "FOOD",
      };

      const res = await axios.post(
        `http://localhost:5004/api/business-development/food/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setAlert({
          type: "success",
          message: "Food Business Created ✅",
        });

        setFormData({
          company_name: "",
          contact_person: "",
          phone: "",
          email: "",
          project_title: "",
          expected_quantity: "",
          estimated_budget: "",
          product_category: "",
          product_name: "",
          packaging_type: "",
          shelf_life: "",
          storage_condition: "",
          business_status: "",
          comment: "",
        });

        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Error",
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

      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        {/* MODAL */}
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg relative max-h-[95vh] overflow-y-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center p-5">
            <h1 className="text-xl font-semibold text-purple-700">
              New Food Business Request
            </h1>
            <button onClick={onClose} className="text-gray-500 text-lg">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* ================= BUSINESS DETAILS ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("business")}
              >
                <h2 className="font-medium">Business Details</h2>
                <span className="text-xl font-bold">
                  {openSection === "business" ? "−" : "+"}
                </span>
              </div>

              {openSection === "business" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  <input name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" className="bg-white border rounded-lg p-2" />
                  <input name="contact_person" value={formData.contact_person} onChange={handleChange} placeholder="Contact Person" className="bg-white border rounded-lg p-2" />
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="bg-white border rounded-lg p-2" />
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="bg-white border rounded-lg p-2" />

                  <input name="project_title" value={formData.project_title} onChange={handleChange} placeholder="Project Title" className="bg-white border rounded-lg p-2" />
                  <input name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} placeholder="Expected Quantity" className="bg-white border rounded-lg p-2" />
                  <input name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} placeholder="Estimated Budget" className="bg-white border rounded-lg p-2" />

                </div>
              )}
            </div>

            {/* ================= PRODUCT DETAILS ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("product")}
              >
                <h2 className="font-medium">Product Details</h2>
                <span className="text-xl font-bold">
                  {openSection === "product" ? "−" : "+"}
                </span>
              </div>

              {openSection === "product" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  <input name="product_category" value={formData.product_category} onChange={handleChange} placeholder="Product Category" className="bg-white border rounded-lg p-2" />
                  <input name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" className="bg-white border rounded-lg p-2" />
                  <input name="packaging_type" value={formData.packaging_type} onChange={handleChange} placeholder="Packaging Type" className="bg-white border rounded-lg p-2" />
                  <input name="shelf_life" value={formData.shelf_life} onChange={handleChange} placeholder="Shelf Life" className="bg-white border rounded-lg p-2" />
                  <input name="storage_condition" value={formData.storage_condition} onChange={handleChange} placeholder="Storage Condition" className="bg-white border rounded-lg p-2" />

                </div>
              )}
            </div>

            {/* ================= BUSINESS REVIEW ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("review")}
              >
                <h2 className="font-medium">Business Review</h2>
                <span className="text-xl font-bold">
                  {openSection === "review" ? "−" : "+"}
                </span>
              </div>

              {openSection === "review" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  <select
                    name="business_status"
                    value={formData.business_status}
                    onChange={handleChange}
                    className="bg-white border rounded-lg p-2"
                  >
                    <option value="">Select Status</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>

                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Comment"
                    className="bg-white border rounded-lg p-2"
                  />

                </div>
              )}
            </div>

            {/* ================= SUBMIT ================= */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg"
              >
                {loading ? "Saving..." : "Submit"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}