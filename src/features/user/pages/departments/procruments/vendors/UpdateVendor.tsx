// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../../../../../context/AuthContext";

// const EditableRating = ({
//   value,
//   onChange,
// }: {
//   value: number;
//   onChange: (val: number) => void;
// }) => (
//   <div>
//     <div className="text-xs text-gray-500 mb-1">Rating</div>
//     <div className="flex gap-1 cursor-pointer">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <span
//           key={star}
//           onClick={() => onChange(star)}
//           className={`text-xl transition ${
//             star <= value ? "text-orange-400" : "text-gray-300"
//           } hover:scale-110`}
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   </div>
// );

// const Ratings = ({ value = 0 }: { value: number }) => (
//   <div className="flex gap-1">
//     {[1, 2, 3, 4, 5].map((star) => (
//       <span
//         key={star}
//         className={`text-lg ${
//           star <= value ? "text-orange-400" : "text-gray-300"
//         }`}
//       >
//         ★
//       </span>
//     ))}
//   </div>
// );

// /* ---------- Main Component ---------- */
// const AllVendors: React.FC = () => {
//   const { token } = useContext(AuthContext);

//   const [vendors, setVendors] = useState<any[]>([]);
//   const [activeVendor, setActiveVendor] = useState<any | null>(null);
//   const [formData, setFormData] = useState<any>({});

//   /* ---------- Fetch Vendors ---------- */
//   // useEffect(() => {
//   //   const fetchVendors = async () => {
//   //     try {
//   //       const res = await axios.get(
//   //         `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors`,
//   //         {
//   //           headers: { Authorization: `Bearer ${token}` },
//   //         }
//   //       );
//   //       setVendors(res.data?.data || []);
//   //     } catch (err) {
//   //       console.error(err);
//   //     }
//   //   };
//   //   fetchVendors();
//   // }, [token]);

//   useEffect(() => {
//     if (!token) return;

//     const fetchVendors = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         setVendors(res.data?.data || []);
//       } catch (err) {
//         console.error("Vendor fetch error:", err);
//       }
//     };

//     fetchVendors();
//   }, [token]);

//   /* ---------- Handle Input Change ---------- */
//   const handleChange = (key: string, value: any) => {
//     setFormData((prev: any) => ({ ...prev, [key]: value }));
//   };

//   /* ---------- Update Vendor ---------- */
//   // const updateVendor = async () => {
//   //   try {
//   //     await axios.put(
//   //       `${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors/${
//   //         formData.vendor_id
//   //       }`,
//   //       formData,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     // Update UI list
//   //     setVendors((prev) =>
//   //       prev.map((v) => (v.vendor_id === formData.vendor_id ? formData : v))
//   //     );

//   //     setActiveVendor(null);
//   //   } catch (error) {
//   //     console.error("Update failed", error);
//   //   }
//   // };

//   const updateVendor = async () => {
//     try {
//       await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors/${formData.vendor_id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       // Update UI list
//       setVendors((prev) =>
//         prev.map((v) => (v.vendor_id === formData.vendor_id ? formData : v)),
//       );

//       setActiveVendor(null);
//     } catch (error) {
//       console.error("Update failed", error);
//     }
//   };

//   return (
//     <div className="px-4 sm:px-8 py-6">
//       {/* ---------- VENDOR GRID ---------- */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {vendors.map((v) => (
//           <div
//             key={v.vendor_id}
//             className="relative bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between"
//           >
//             <h3 className="text-purple-600 font-semibold text-lg mb-4 truncate">
//               {v.vendor_name}
//             </h3>

//             <div className="space-y-2 text-sm">
//               <Row label="Contact" value={v.contact_person} />
//               <Row label="Phone" value={v.phone} />
//               <Row label="Email" value={v.email} />
//               <Row label="GST" value={v.gst_number} />
//               <Row label="PAN" value={v.pan_number} />
//               <Row label="Rating" value={<Ratings value={v.rating} />} />
//             </div>

//             {/* UPDATE BUTTON */}
//             <button
//               onClick={() => {
//                 setActiveVendor(v);
//                 setFormData(v);
//               }}
//               className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 self-start"
//             >
//               Update
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* ---------- UPDATE MODAL ---------- */}
//       {activeVendor && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
//           <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
//             {/* HEADER */}
//             <div className="flex justify-end px-6 pt-5 sticky top-0 bg-white z-10">
//               <button
//                 onClick={() => setActiveVendor(null)}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* BODY */}
//             <div className="px-6 py-5 space-y-6">
//               {/* VENDOR DETAILS */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Input
//                   label="Vendor Name"
//                   value={formData.vendor_name}
//                   onChange={(e) => handleChange("vendor_name", e.target.value)}
//                 />
//                 <Input
//                   label="Contact Person"
//                   value={formData.contact_person}
//                   onChange={(e) =>
//                     handleChange("contact_person", e.target.value)
//                   }
//                 />
//                 <Input
//                   label="Phone"
//                   value={formData.phone}
//                   onChange={(e) => handleChange("phone", e.target.value)}
//                 />
//                 <Input
//                   label="Email"
//                   value={formData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                 />
//                 <Input
//                   label="GST Number"
//                   value={formData.gst_number}
//                   onChange={(e) => handleChange("gst_number", e.target.value)}
//                 />
//                 <Input
//                   label="PAN Number"
//                   value={formData.pan_number}
//                   onChange={(e) => handleChange("pan_number", e.target.value)}
//                 />
//                 <Input
//                   label="Address"
//                   value={formData.address}
//                   onChange={(e) => handleChange("address", e.target.value)}
//                 />

//                 <EditableRating
//                   value={formData.rating || 0}
//                   onChange={(val) => handleChange("rating", val)}
//                 />
//               </div>

//               {/* BANK DETAILS */}
//               <div>
//                 <h3 className="text-purple-600 font-medium text-lg mb-2">
//                   ● Bank Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <Input
//                     label="Bank Name"
//                     value={formData.bank_name}
//                     onChange={(e) => handleChange("bank_name", e.target.value)}
//                   />
//                   <Input
//                     label="Account Number"
//                     value={formData.account_number}
//                     onChange={(e) =>
//                       handleChange("account_number", e.target.value)
//                     }
//                   />
//                   <Input
//                     label="IFSC Code"
//                     value={formData.ifsc_code}
//                     onChange={(e) => handleChange("ifsc_code", e.target.value)}
//                   />
//                   <Input
//                     label="Branch Name"
//                     value={formData.bank_branch}
//                     onChange={(e) =>
//                       handleChange("bank_branch", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>

//               {/* ACTIONS */}
//               <div className="flex justify-end gap-4 pt-4">
//                 <button
//                   onClick={() => setActiveVendor(null)}
//                   className="px-4 py-2 border rounded-md text-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={updateVendor}
//                   className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//                 >
//                   Update Vendor
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllVendors;

// /* ---------- Helper Components ---------- */
// const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
//   <div className="flex text-gray-700">
//     <span className="w-20 text-gray-400">{label}</span>
//     <span className="font-medium truncate">{value || "-"}</span>
//   </div>
// );

// const Input = ({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: any;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }) => (
//   <div>
//     <div className="text-xs text-gray-500 mb-1">{label}</div>
//     <input
//       value={value || ""}
//       onChange={onChange}
//       className="w-full bg-blue-50 text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
//     />
//   </div>
// );

import React, { useEffect, useState } from "react";
import axios from "axios";

const EditableRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => (
  <div>
    <div className="text-xs text-gray-500 mb-1">Rating</div>
    <div className="flex gap-1 cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          className={`text-xl transition ${star <= value ? "text-orange-400" : "text-gray-300"
            } hover:scale-110`}
        >
          ★
        </span>
      ))}
    </div>
  </div>
);

const Ratings = ({ value = 0 }: { value: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-lg ${star <= value ? "text-orange-400" : "text-gray-300"
          }`}
      >
        ★
      </span>
    ))}
  </div>
);

/* ---------- Main Component ---------- */
const AllVendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [activeVendor, setActiveVendor] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);

  /* ---------- Fetch Vendors ---------- */
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors`,
          {
            withCredentials: true, // ✅ cookie auth
          },
        );

        setVendors(res.data?.data || []);
      } catch (err) {
        console.error("Vendor fetch error:", err);
      }
    };

    fetchVendors();
  }, []);

  /* ---------- Handle Input Change ---------- */
  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  /* ---------- Update Vendor ---------- */
  const updateVendor = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors/${formData.vendor_id}`,
        formData,
        {
          withCredentials: true,
        },
      );

      // update UI list
      setVendors((prev) =>
        prev.map((v) =>
          v.vendor_id === formData.vendor_id ? formData : v,
        ),
      );

      setActiveVendor(null);

      // ✅ Show success message
      setMessage("Vendor updated successfully ✅");

      // auto hide after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (error) {
      console.error("Update failed", error);
      setMessage("Failed to update vendor ❌");

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };
  return (
    <div className="px-4 sm:px-8 py-6">
      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-md text-white z-50 animate-fade-in bg-green-600">
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendors.map((v) => (
          <div
            key={v.vendor_id}
            className="relative bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between"
          >
            <h3 className="text-purple-600 font-semibold text-lg mb-4 truncate">
              {v.vendor_name}
            </h3>

            <div className="space-y-2 text-sm">
              <Row label="Contact" value={v.contact_person} />
              <Row label="Phone" value={v.phone} />
              <Row label="Email" value={v.email} />
              <Row label="GST" value={v.gst_number} />
              <Row label="PAN" value={v.pan_number} />
              <Row label="Rating" value={<Ratings value={v.rating} />} />
            </div>

            <button
              onClick={() => {
                setActiveVendor(v);
                setFormData(v);
              }}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 self-start"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      {activeVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end px-6 pt-5 sticky top-0 bg-white z-10">
              <button
                onClick={() => setActiveVendor(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Vendor Name"
                  value={formData.vendor_name}
                  onChange={(e) => handleChange("vendor_name", e.target.value)}
                />
                <Input
                  label="Contact Person"
                  value={formData.contact_person}
                  onChange={(e) =>
                    handleChange("contact_person", e.target.value)
                  }
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                <Input
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                <Input
                  label="GST Number"
                  value={formData.gst_number}
                  onChange={(e) => handleChange("gst_number", e.target.value)}
                />
                <Input
                  label="PAN Number"
                  value={formData.pan_number}
                  onChange={(e) => handleChange("pan_number", e.target.value)}
                />
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
                <EditableRating
                  value={formData.rating || 0}
                  onChange={(val) => handleChange("rating", val)}
                />
              </div>

              <div>
                <h3 className="text-purple-600 font-medium text-lg mb-2">
                  ● Bank Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    value={formData.bank_name}
                    onChange={(e) => handleChange("bank_name", e.target.value)}
                  />
                  <Input
                    label="Account Number"
                    value={formData.account_number}
                    onChange={(e) =>
                      handleChange("account_number", e.target.value)
                    }
                  />
                  <Input
                    label="IFSC Code"
                    value={formData.ifsc_code}
                    onChange={(e) => handleChange("ifsc_code", e.target.value)}
                  />
                  <Input
                    label="Branch Name"
                    value={formData.bank_branch}
                    onChange={(e) =>
                      handleChange("bank_branch", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setActiveVendor(null)}
                  className="px-4 py-2 border rounded-md text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={updateVendor}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Update Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllVendors;

/* ---------- Helper Components ---------- */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex text-gray-700">
    <span className="w-20 text-gray-400">{label}</span>
    <span className="font-medium truncate">{value || "-"}</span>
  </div>
);

const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <input
      value={value || ""}
      onChange={onChange}
      className="w-full bg-blue-50 text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
    />
  </div>
);