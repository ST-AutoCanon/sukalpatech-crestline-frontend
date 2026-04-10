// // src/pages/businessDevGold/GoldBusinessPage.tsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Alert from "../../../components/Aleartmessage";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function GoldBusinessPage({ onClose, onSuccess }: Props) {
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

//     business_type: "",
//     gold_type: "",
//     product_type: "",
//     purity_required: "",
//     expected_quantity: "",
//     estimated_budget: "",

//     making_charges: "",
//     hallmark_required: "",
//     design_type: "",
//     delivery_location: "",
//     timeline: "",

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
//         industry_type: "gold_business",
//       };

//       const res = await axios.post(
//         "http://localhost:5004/api/business-development/gold/create",
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
//           message: "Gold Business Created ✅",
//         });

//         setFormData({
//           company_name: "",
//           contact_person: "",
//           phone: "",
//           email: "",
//           business_type: "",
//           gold_type: "",
//           product_type: "",
//           purity_required: "",
//           expected_quantity: "",
//           estimated_budget: "",
//           making_charges: "",
//           hallmark_required: "",
//           design_type: "",
//           delivery_location: "",
//           timeline: "",
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
//               New Gold Business Request
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
//                 </div>
//               )}
//             </div>

//             {/* ================= GOLD DETAILS ================= */}
//             <div className="bg-gray-100 rounded-xl p-4">
//               <div
//                 className="flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleSection("gold")}
//               >
//                 <h2 className="font-medium">Gold Details</h2>
//                 <span className="text-xl font-bold">
//                   {openSection === "gold" ? "−" : "+"}
//                 </span>
//               </div>

//               {openSection === "gold" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                   <input name="business_type" value={formData.business_type} onChange={handleChange} placeholder="Business Type" className="bg-white border rounded-lg p-2" />
//                   <input name="gold_type" value={formData.gold_type} onChange={handleChange} placeholder="Gold Type" className="bg-white border rounded-lg p-2" />
//                   <input name="product_type" value={formData.product_type} onChange={handleChange} placeholder="Product Type" className="bg-white border rounded-lg p-2" />
//                   <input name="purity_required" value={formData.purity_required} onChange={handleChange} placeholder="Purity Required" className="bg-white border rounded-lg p-2" />
//                   <input name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} placeholder="Expected Quantity" className="bg-white border rounded-lg p-2" />
//                   <input name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} placeholder="Estimated Budget" className="bg-white border rounded-lg p-2" />
//                 </div>
//               )}
//             </div>

//             {/* ================= ADDITIONAL INFO ================= */}
//             <div className="bg-gray-100 rounded-xl p-4">
//               <div
//                 className="flex justify-between items-center cursor-pointer"
//                 onClick={() => toggleSection("additional")}
//               >
//                 <h2 className="font-medium">Additional Info</h2>
//                 <span className="text-xl font-bold">
//                   {openSection === "additional" ? "−" : "+"}
//                 </span>
//               </div>

//               {openSection === "additional" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                   <input name="making_charges" value={formData.making_charges} onChange={handleChange} placeholder="Making Charges" className="bg-white border rounded-lg p-2" />

//                   <select name="hallmark_required" value={formData.hallmark_required} onChange={handleChange} className="bg-white border rounded-lg p-2">
//                     <option value="">Hallmark Required?</option>
//                     <option value="YES">Yes</option>
//                     <option value="NO">No</option>
//                   </select>

//                   <input name="design_type" value={formData.design_type} onChange={handleChange} placeholder="Design Type" className="bg-white border rounded-lg p-2" />
//                   <input name="delivery_location" value={formData.delivery_location} onChange={handleChange} placeholder="Delivery Location" className="bg-white border rounded-lg p-2" />
//                   <input name="timeline" value={formData.timeline} onChange={handleChange} placeholder="Timeline" className="bg-white border rounded-lg p-2" />
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
//                   <select name="business_status" value={formData.business_status} onChange={handleChange} className="bg-white border rounded-lg p-2">
//                     <option value="">Select Status</option>
//                     <option value="APPROVED">APPROVED</option>
//                     <option value="PENDING">PENDING</option>
//                     <option value="REJECTED">REJECTED</option>
//                   </select>

//                   <textarea name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" className="bg-white border rounded-lg p-2" />
//                 </div>
//               )}
//             </div>

//             {/* ================= SUBMIT ================= */}
//             <div className="flex justify-end">
//               <button className="bg-purple-600 text-white px-6 py-2 rounded-lg">
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
import Alert from "../../../components/Aleartmessage";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoldBusinessPage({ onClose, onSuccess }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    business_type: "",
    gold_type: "",
    product_type: "",
    purity_required: "",
    expected_quantity: "",
    estimated_budget: "",
    making_charges: "",
    hallmark_required: "",
    design_type: "",
    delivery_location: "",
    timeline: "",
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

      const payload = {
        ...formData,
        industry_type: "gold_business",
      };

      const res = await axios.post(
        "http://localhost:5004/api/business-development/gold/create",
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
          message: "Gold Business Created ✅",
        });

        setFormData({
          company_name: "",
          contact_person: "",
          phone: "",
          email: "",
          business_type: "",
          gold_type: "",
          product_type: "",
          purity_required: "",
          expected_quantity: "",
          estimated_budget: "",
          making_charges: "",
          hallmark_required: "",
          design_type: "",
          delivery_location: "",
          timeline: "",
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
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg relative max-h-[95vh] overflow-y-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
            <h2 className="text-xl font-semibold text-purple-600">
              New Gold Business Request
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
              </div>
            </div>

            {/* GOLD DETAILS */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Gold Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="business_type" value={formData.business_type} onChange={handleChange} placeholder="Business Type" className="bg-white border rounded-lg p-2" />
                <input name="gold_type" value={formData.gold_type} onChange={handleChange} placeholder="Gold Type" className="bg-white border rounded-lg p-2" />
                <input name="product_type" value={formData.product_type} onChange={handleChange} placeholder="Product Type" className="bg-white border rounded-lg p-2" />
                <input name="purity_required" value={formData.purity_required} onChange={handleChange} placeholder="Purity Required" className="bg-white border rounded-lg p-2" />
                <input name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} placeholder="Expected Quantity" className="bg-white border rounded-lg p-2" />
                <input name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} placeholder="Estimated Budget" className="bg-white border rounded-lg p-2" />
              </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Additional Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="making_charges" value={formData.making_charges} onChange={handleChange} placeholder="Making Charges" className="bg-white border rounded-lg p-2" />
                <select name="hallmark_required" value={formData.hallmark_required} onChange={handleChange} className="bg-white border rounded-lg p-2">
                  <option value="">Hallmark Required?</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
                <input name="design_type" value={formData.design_type} onChange={handleChange} placeholder="Design Type" className="bg-white border rounded-lg p-2" />
                <input name="delivery_location" value={formData.delivery_location} onChange={handleChange} placeholder="Delivery Location" className="bg-white border rounded-lg p-2" />
                <input name="timeline" value={formData.timeline} onChange={handleChange} placeholder="Timeline" className="bg-white border rounded-lg p-2" />
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