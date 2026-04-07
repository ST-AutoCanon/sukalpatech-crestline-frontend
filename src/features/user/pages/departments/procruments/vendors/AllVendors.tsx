// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../../../../../context/AuthContext";

//   const Rating = ({ value = 0 }: { value: number }) => (
//     <div>
//       <div className="text-xs text-gray-500 mb-1">Rating</div>
//       <div className="flex gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span
//             key={star}
//             className={`text-lg ${
//               star <= value ? "text-orange-400" : "text-gray-300"
//             }`}
//           >
//             ★
//           </span>
//         ))}
//       </div>
//     </div>
//   );

//    const Ratings = ({ value = 0 }: { value: number }) => (
//      <div>
//        <div className="flex gap-1">
//          {[1, 2, 3, 4, 5].map((star) => (
//            <span
//              key={star}
//              className={`text-lg ${
//                star <= value ? "text-orange-400" : "text-gray-300"
//              }`}
//            >
//              ★
//            </span>
//          ))}
//        </div>
//      </div>
//    );


// const AllVendors: React.FC = () => {
//   const { token } = useContext(AuthContext);
//   const [vendors, setVendors] = useState<any[]>([]);
//   const [activeVendor, setActiveVendor] = useState<any | null>(null);

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

//     if (token) {
//       fetchVendors();
//     }
//   }, [token]);

 

//   const bank =
//     Array.isArray(activeVendor?.bank_details) && activeVendor.bank_details.length > 0
//       ? activeVendor.bank_details[0]
//       : {};

//   return (
//     <div className="px-4 sm:px-8 py-6">
//       {/* VENDOR GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {vendors.map((v) => (
//           <div
//             key={v.vendor_id}
//             className="relative bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between"
//           >
//             {/* VENDOR NAME */}
//             <h3 className="text-purple-600 font-semibold text-lg mb-4 truncate">
//               {v.vendor_name}
//             </h3>

//             {/* DETAILS */}
//             <div className="space-y-2 text-sm">
//               <Row label="Contact" value={v.contact_person} />
//               <Row label="Phone" value={v.phone} />
//               <Row label="Email" value={v.email} />
//               <Row label="GST" value={v.gst_number} />
//               <Row label="PAN" value={v.pan_number} />
//               <Row label="Rating" value={<Ratings value={v.rating} />} />
//             </div>

//             {/* MORE INFO */}
//             <button
//               onClick={() => setActiveVendor(v)}
//               className="mt-4 text-blue-600 text-sm font-medium hover:underline self-start"
//             >
//               More Info
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* VENDOR MODAL */}
//       {activeVendor && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
//           <div
//             className="bg-white w-full max-w-4xl rounded-xl shadow-xl relative
//                     max-h-[90vh] overflow-y-auto"
//           >
//             {/* HEADER (CLOSE BUTTON) */}
//             <div className="flex justify-end items-center px-6 pt-5 sticky top-0 bg-white z-10">
//               <button
//                 onClick={() => setActiveVendor(null)}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* STEP INDICATOR */}
//             <div className="flex gap-6 px-6 mt-2 text-lg flex-wrap sticky top-12 bg-white z-10">
//               <span className="text-purple-600 font-medium flex items-center gap-2">
//                 ● Vendor Details
//               </span>
//             </div>

//             {/* BODY */}
//             <div className="px-6 py-5 space-y-6">
//               {/* VENDOR DETAILS */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Input label="Vendor Name" value={activeVendor.vendor_name} />
//                 <Input
//                   label="Contact Person"
//                   value={activeVendor.contact_person}
//                 />
//                 <Input label="Phone Number" value={activeVendor.phone} />
//                 <Input label="Email" value={activeVendor.email} />
//                 <Input label="GST Number" value={activeVendor.gst_number} />
//                 <Input label="PAN Number" value={activeVendor.pan_number} />
//                 <Input label="Address" value={activeVendor.address} />
//                 <Rating value={activeVendor.rating} />
//               </div>

//               {/* BANK DETAILS */}
//               <div>
//                 <h3 className="text-purple-600 font-medium flex items-center gap-2 text-lg">
//                   ● Bank Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <Input label="Bank Name" value={activeVendor.bank_name} />
//                   <Input
//                     label="Account Number"
//                     value={activeVendor.account_number}
//                   />
//                   <Input label="IFSC Code" value={activeVendor.ifsc_code} />
//                   <Input label="Branch Name" value={activeVendor.bank_branch} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllVendors;

// /* ---------- Helper Row ---------- */
// const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
//   <div className="flex text-gray-700">
//     <span className="w-20 text-gray-400">{label}</span>
//     <span className="font-medium truncate">{value || "-"}</span>
//   </div>
// );

// const Input = ({ label, value }: { label: string; value: any }) => (
//   <div>
//     <div className="text-xs text-gray-500 mb-1">{label}</div>
//     <input
//       readOnly
//       value={value || ""}
//       placeholder="-"
//       className="w-full bg-blue-50 text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
//     />
//   </div>
// );


import React, { useEffect, useState } from "react";
import axios from "axios";

const Rating = ({ value = 0 }: { value: number }) => (
  <div>
    <div className="text-xs text-gray-500 mb-1">Rating</div>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= value ? "text-orange-400" : "text-gray-300"
          }`}
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
        className={`text-lg ${
          star <= value ? "text-orange-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))}
  </div>
);

const AllVendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [activeVendor, setActiveVendor] = useState<any | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors`,
          {
            withCredentials: true, // ✅ HTTP-only cookie auth
          },
        );

        setVendors(res.data?.data || []);
      } catch (err) {
        console.error("Vendor fetch error:", err);
      }
    };

    fetchVendors();
  }, []);

  const bank =
    Array.isArray(activeVendor?.bank_details) &&
    activeVendor.bank_details.length > 0
      ? activeVendor.bank_details[0]
      : {};

  return (
    <div className="px-4 sm:px-8 py-6 pb-15">
      {/* VENDOR GRID */}
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
              onClick={() => setActiveVendor(v)}
              className="mt-4 text-blue-600 text-sm font-medium hover:underline self-start"
            >
              More Info
            </button>
          </div>
        ))}
      </div>

      {/* VENDOR MODAL */}
      {activeVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
          
            <div className="flex justify-between items-center px-6 pt-5 sticky top-0 bg-white z-10">
              <h2 className="text-purple-600 font-medium text-lg flex items-center gap-2">
                View Vendor Info
              </h2>

              <button
                onClick={() => setActiveVendor(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-6 px-6 mt-2 text-lg flex-wrap sticky top-12 bg-white z-10">
              <span className="text-purple-600 font-medium flex items-center gap-2">
                ● Vendor Details
              </span>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Vendor Name" value={activeVendor.vendor_name} />
                <Input
                  label="Contact Person"
                  value={activeVendor.contact_person}
                />
                <Input label="Phone Number" value={activeVendor.phone} />
                <Input label="Email" value={activeVendor.email} />
                <Input label="GST Number" value={activeVendor.gst_number} />
                <Input label="PAN Number" value={activeVendor.pan_number} />
                <Input label="Address" value={activeVendor.address} />
                <Rating value={activeVendor.rating} />
              </div>

              <div>
                <h3 className="text-purple-600 font-medium flex items-center gap-2 text-lg">
                  ● Bank Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Bank Name" value={activeVendor.bank_name} />
                  <Input
                    label="Account Number"
                    value={activeVendor.account_number}
                  />
                  <Input label="IFSC Code" value={activeVendor.ifsc_code} />
                  <Input label="Branch Name" value={activeVendor.bank_branch} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllVendors;

/* ---------- Helper Row ---------- */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex text-gray-700">
    <span className="w-20 text-gray-400">{label}</span>
    <span className="font-medium truncate">{value || "-"}</span>
  </div>
);

const Input = ({ label, value }: { label: string; value: any }) => (
  <div>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <input
      readOnly
      value={value || ""}
      placeholder="-"
      className="w-full bg-blue-50 text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
    />
  </div>
);

