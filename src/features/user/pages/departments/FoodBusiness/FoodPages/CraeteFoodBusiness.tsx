// // src/pages/businessDevFood/FoodBusinessPage.tsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Alert from "../../../../components/Aleartmessage";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function FoodBusinessPage({ onClose, onSuccess }: Props) {
//   const navigate = useNavigate();

//   const [openSection, setOpenSection] = useState("business");

//   const toggleSection = (section: string) => {
//     setOpenSection(openSection === section ? "" : section);
//   };

//   const [formData, setFormData] = useState({
//     company_name: "",
//     contact_person: "",
//     phone: "",
//     email: "",
//     project_title: "",
//     expected_quantity: "",
//     estimated_budget: "",
//     product_category: "",
//     product_name: "",
//     packaging_type: "",
//     shelf_life: "",
//     storage_condition: "",
//     business_status: "",
//     comment: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login first!");
//       navigate("/login");
//     }
//   }, []);

//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setAlert(null);

//     const token = localStorage.getItem("token");

//     try {
//       setLoading(true);

//       const payload = {
//         ...formData,
//         industry_type: "FOOD",
//       };

//       const res = await axios.post(
//         `http://localhost:5004/api/business-development/food/create`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       if (res.data.success) {
//         setAlert({
//           type: "success",
//           message: "Food Business Created ✅",
//         });

//         setFormData({
//           company_name: "",
//           contact_person: "",
//           phone: "",
//           email: "",
//           project_title: "",
//           expected_quantity: "",
//           estimated_budget: "",
//           product_category: "",
//           product_name: "",
//           packaging_type: "",
//           shelf_life: "",
//           storage_condition: "",
//           business_status: "",
//           comment: "",
//         });

//         setTimeout(() => {
//           onSuccess();
//         }, 1500);
//       }
//     } catch (err: any) {
//       setAlert({
//         type: "error",
//         message: err.response?.data?.message || "Error",
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

//       {/* BACKDROP */}
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//         {/* MODAL */}
//         <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg relative max-h-[95vh] overflow-y-auto">

//           {/* HEADER */}
//           <div className="flex justify-between items-center p-5">
//             <h1 className="text-xl font-semibold text-purple-700">
//               New Food Business Request
//             </h1>
//             <button onClick={onClose} className="text-gray-500 text-lg">✕</button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-5 space-y-5">

//             {/* ================= BUSINESS DETAILS ================= */}
//             <div className="bg-gray-100 rounded-xl p-4">
//               <div
//                 className="flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleSection("business")}
//               >
//                 <h2 className="font-medium">Business Details</h2>
//                 <span className="text-xl font-bold">
//                   {openSection === "business" ? "−" : "+"}
//                 </span>
//               </div>

//               {openSection === "business" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

//                   <input name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" className="bg-white border rounded-lg p-2" />
//                   <input name="contact_person" value={formData.contact_person} onChange={handleChange} placeholder="Contact Person" className="bg-white border rounded-lg p-2" />
//                   <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="bg-white border rounded-lg p-2" />
//                   <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="bg-white border rounded-lg p-2" />

//                   <input name="project_title" value={formData.project_title} onChange={handleChange} placeholder="Project Title" className="bg-white border rounded-lg p-2" />
//                   <input name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} placeholder="Expected Quantity" className="bg-white border rounded-lg p-2" />
//                   <input name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} placeholder="Estimated Budget" className="bg-white border rounded-lg p-2" />

//                 </div>
//               )}
//             </div>

//             {/* ================= PRODUCT DETAILS ================= */}
//             <div className="bg-gray-100 rounded-xl p-4">
//               <div
//                 className="flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleSection("product")}
//               >
//                 <h2 className="font-medium">Product Details</h2>
//                 <span className="text-xl font-bold">
//                   {openSection === "product" ? "−" : "+"}
//                 </span>
//               </div>

//               {openSection === "product" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

//                   <input name="product_category" value={formData.product_category} onChange={handleChange} placeholder="Product Category" className="bg-white border rounded-lg p-2" />
//                   <input name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" className="bg-white border rounded-lg p-2" />
//                   <input name="packaging_type" value={formData.packaging_type} onChange={handleChange} placeholder="Packaging Type" className="bg-white border rounded-lg p-2" />
//                   <input name="shelf_life" value={formData.shelf_life} onChange={handleChange} placeholder="Shelf Life" className="bg-white border rounded-lg p-2" />
//                   <input name="storage_condition" value={formData.storage_condition} onChange={handleChange} placeholder="Storage Condition" className="bg-white border rounded-lg p-2" />

//                 </div>
//               )}
//             </div>

//             {/* ================= BUSINESS REVIEW ================= */}
//             <div className="bg-gray-100 rounded-xl p-4">
//               <div
//                 className="flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleSection("review")}
//               >
//                 <h2 className="font-medium">Business Review</h2>
//                 <span className="text-xl font-bold">
//                   {openSection === "review" ? "−" : "+"}
//                 </span>
//               </div>

//               {openSection === "review" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

//                   <select
//                     name="business_status"
//                     value={formData.business_status}
//                     onChange={handleChange}
//                     className="bg-white border rounded-lg p-2"
//                   >
//                     <option value="">Select Status</option>
//                     <option value="APPROVED">APPROVED</option>
//                     <option value="PENDING">PENDING</option>
//                     <option value="REJECTED">REJECTED</option>
//                   </select>

//                   <textarea
//                     name="comment"
//                     value={formData.comment}
//                     onChange={handleChange}
//                     placeholder="Comment"
//                     className="bg-white border rounded-lg p-2"
//                   />

//                 </div>
//               )}
//             </div>

//             {/* ================= SUBMIT ================= */}
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="bg-purple-600 text-white px-6 py-2 rounded-lg"
//               >
//                 {loading ? "Saving..." : "Submit"}
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </>
//   );
// }


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
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);

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
      const payload = { ...formData, industry_type: "FOOD" };

      const res = await axios.post(
        "http://localhost:5001/api/business-development/food/create",
        payload,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      if (res.data.success) {
        setAlert({ type: "success", message: "Food Business Created ✅" });
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
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.response?.data?.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg relative max-h-[95vh] overflow-y-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
            <h2 className="text-xl font-semibold text-purple-600">
              New Food Business Request
            </h2>
            <button
              onClick={onClose}
              className="text-xl font-bold hover:text-red-600"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* BUSINESS DETAILS */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Business Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" className="bg-white border rounded-lg p-2" />
                <input name="contact_person" value={formData.contact_person} onChange={handleChange} placeholder="Contact Person" className="bg-white border rounded-lg p-2" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="bg-white border rounded-lg p-2" />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="bg-white border rounded-lg p-2" />
                <input name="project_title" value={formData.project_title} onChange={handleChange} placeholder="Project Title" className="bg-white border rounded-lg p-2" />
                <input name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} placeholder="Expected Quantity" className="bg-white border rounded-lg p-2" />
                <input name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} placeholder="Estimated Budget" className="bg-white border rounded-lg p-2" />
              </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Product Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="product_category" value={formData.product_category} onChange={handleChange} placeholder="Product Category" className="bg-white border rounded-lg p-2" />
                <input name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" className="bg-white border rounded-lg p-2" />
                <input name="packaging_type" value={formData.packaging_type} onChange={handleChange} placeholder="Packaging Type" className="bg-white border rounded-lg p-2" />
                <input name="shelf_life" value={formData.shelf_life} onChange={handleChange} placeholder="Shelf Life" className="bg-white border rounded-lg p-2" />
                <input name="storage_condition" value={formData.storage_condition} onChange={handleChange} placeholder="Storage Condition" className="bg-white border rounded-lg p-2" />
              </div>
            </div>

            {/* BUSINESS REVIEW */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Business Review</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="business_status" value={formData.business_status} onChange={handleChange} className="bg-white border rounded-lg p-2">
                  <option value="">Select Status</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <textarea name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" className="bg-white border rounded-lg p-2" />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold">
                {loading ? "Saving..." : "Submit for Feasibility"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}