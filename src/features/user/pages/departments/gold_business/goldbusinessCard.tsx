// // src/pages/businessDevGold/GoldFinalBusinessCard.tsx

// import React, { useState } from "react";
// import { api } from "../../../api/businessApi";
// import Alert from "../../../components/Aleartmessage";

// interface Props {
//   data: any;
//   mode?: "update" | "default";
//   onUpdate: (updatedItem: any) => void;
// }

// const GoldFinalBusinessCard: React.FC<Props> = ({
//   data,
//   mode = "default",
//   onUpdate,
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [finalStatus, setFinalStatus] = useState(data.final_status || "");
//   const [finalComment, setFinalComment] = useState(data.final_comment || "");
//   const [loading, setLoading] = useState(false);

//   const [alert, setAlert] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   /* ---------------- UPDATE FINAL ---------------- */
//   const handleUpdate = async () => {
//     if (!finalStatus) {
//       setAlert({ type: "error", message: "Please select a final status" });
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.patch(
//         "/business-development/gold/final-review", // ✅ CORRECT GOLD API
//         {
//           id: data.id,
//           final_status: finalStatus,
//           final_comment: finalComment,

//           // keep feasibility data
//           feasibility_status: data.feasibility_status,
//           comments: data.comments || "",
//         }
//       );

//       if (res.data.success) {
//         onUpdate(res.data.data);
//         setShowModal(false);

//         setAlert({
//           type: "success",
//           message: "Final status updated successfully!",
//         });

//         setTimeout(() => setAlert(null), 2000);
//       }
//     } catch (err) {
//       console.error("Failed to update final status", err);

//       setAlert({
//         type: "error",
//         message: "Failed to update final status",
//       });

//       setTimeout(() => setAlert(null), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg p-4 shadow-md flex flex-col justify-between h-full">
//       {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

//       {/* BASIC INFO */}
//       <div className="space-y-1 text-gray-800">
//         <p><strong>ID:</strong> {data.id}</p>

//         <p><strong>Industry:</strong> {data.industry_type}</p>
//         <p><strong>Company:</strong> {data.company_name}</p>
//         <p><strong>Contact Person:</strong> {data.contact_person}</p>
//         <p><strong>Phone:</strong> {data.phone}</p>
//         <p><strong>Email:</strong> {data.email}</p>

//         <p><strong>Gold Type:</strong> {data.gold_type}</p>
//         <p><strong>Product Type:</strong> {data.product_type}</p>
//         <p><strong>Purity:</strong> {data.purity_required}</p>

//         <p><strong>Quantity:</strong> {data.expected_quantity}</p>
//         <p><strong>Budget:</strong> {data.estimated_budget}</p>

//         {mode === "update" && (
//           <>
//             <p><strong>Feasibility Status:</strong> {data.feasibility_status}</p>
//             <p><strong>Comments:</strong> {data.comments}</p>
//           </>
//         )}
//       </div>

//       {/* UPDATE BUTTON */}
//       {mode === "update" && (
//         <p
//           onClick={() => setShowModal(true)}
//           className="mt-3 text-blue-600 underline cursor-pointer w-fit"
//         >
//           Update
//         </p>
//       )}

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-md p-6 relative">

//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-xl"
//             >
//               ×
//             </button>

//             <h2 className="text-xl font-bold mb-4">
//               Update Gold Final Status
//             </h2>

//             <div className="space-y-3 text-gray-800">
//               <p><strong>ID:</strong> {data.id}</p>
//               <p><strong>Company:</strong> {data.company_name}</p>

//               <p><strong>Gold Type:</strong> {data.gold_type}</p>
//               <p><strong>Product:</strong> {data.product_type}</p>

//               <p><strong>Feasibility:</strong> {data.feasibility_status}</p>
//               <p><strong>Comments:</strong> {data.comments}</p>

//               {/* FINAL STATUS */}
//               <div>
//                 <label className="block font-medium mb-1">
//                   Final Status
//                 </label>
//                 <select
//                   className="w-full border rounded p-2"
//                   value={finalStatus}
//                   onChange={(e) => setFinalStatus(e.target.value)}
//                 >
//                   <option value="">Select status</option>
//                   <option value="APPROVED">APPROVED</option>
//                   <option value="PENDING">PENDING</option>
//                   <option value="REJECTED">REJECTED</option>
//                 </select>
//               </div>

//               {/* FINAL COMMENT */}
//               <div>
//                 <label className="block font-medium mb-1">
//                   Final Comment
//                 </label>
//                 <textarea
//                   className="w-full border rounded p-2"
//                   value={finalComment}
//                   onChange={(e) => setFinalComment(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={handleUpdate}
//                 disabled={loading}
//                 className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
//               >
//                 {loading ? "Updating..." : "Update"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GoldFinalBusinessCard;

// src/pages/businessDevGold/GoldFinalBusinessCard.tsx

import React, { useState } from "react";
import { api } from "../../../api/businessApi";
import Alert from "../../../components/Aleartmessage";

interface Props {
  data: any;
  mode?: "update" | "default";
  onUpdate: (updatedItem: any) => void;
   cardIndex: number; 
}

const GoldFinalBusinessCard: React.FC<Props> = ({
  data,
  mode = "default",
  onUpdate,
  cardIndex
}) => {
  const [showModal, setShowModal] = useState(false);
  const [finalStatus, setFinalStatus] = useState(data.final_status || "");
  const [finalComment, setFinalComment] = useState(data.final_comment || "");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const render = (v: any) => (v ? v : "-");

  /* ---------------- UPDATE FINAL ---------------- */
  const handleUpdate = async () => {
    if (!finalStatus) {
      setAlert({ type: "error", message: "Please select a final status" });
      setTimeout(() => setAlert(null), 2000);
      return;
    }

    try {
      setLoading(true);

      const res = await api.patch(
        "/business-development/gold/final-review",
        {
          id: data.id,
          final_status: finalStatus,
          final_comment: finalComment,
          feasibility_status: data.feasibility_status,
          comments: data.comments || "",
        }
      );

      if (res.data.success) {
        onUpdate(res.data.data);
        setShowModal(false);

        setAlert({
          type: "success",
          message: "Final status updated successfully!",
        });
        setTimeout(() => setAlert(null), 2000);
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Failed to update final status",
      });
      setTimeout(() => setAlert(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CARD FIELDS (ONLY 5) ---------------- */
  const cardFields = [
    ["Company Name", data.company_name],
    ["Contact Person", data.contact_person],
    ["Phone", data.phone],
    ["Gold Type", data.gold_type],
    ["Product Type", data.product_type],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-3 w-full sm:w-[360px] md:w-[400px] m-2 flex flex-col justify-between">
      
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {/* HEADER */}
      <h3 className="text-purple-700 font-semibold text-sm mb-3">
        GOLD ID: {cardIndex + 1}
      </h3>

      {/* FIELDS */}
      <div className="flex flex-col gap-1">
        {cardFields.map(([label, value]) => (
          <div key={label} className="flex">
            <span className="w-32 shrink-0 text-gray-400 text-sm">
              {label}:
            </span>
            <span className="font-medium text-gray-700 text-sm truncate">
              {render(value)}
            </span>
          </div>
        ))}
      </div>

      {/* UPDATE BUTTON */}
      {mode === "update" && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 text-blue-600 underline text-sm self-start"
        >
          Update Final Status
        </button>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2 sm:p-4">
          <div
            className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl rounded-none sm:rounded-2xl overflow-y-auto p-4 sm:p-8 relative flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
             <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium">
              GOLD-{data.id} Full Info
            </h2>
            {/* ================= SECTIONS ================= */}
            {[
              {
                title: "Company Details",
                fields: [
                  { label: "Company Name", value: data.company_name },
                  { label: "Contact Person", value: data.contact_person },
                  { label: "Phone", value: data.phone },
                  { label: "Email", value: data.email },
                ],
              },
              {
                title: "Gold Details",
                fields: [
                  { label: "Gold Type", value: data.gold_type },
                  { label: "Product Type", value: data.product_type },
                  { label: "Purity Required", value: data.purity_required },
                  { label: "Expected Quantity", value: data.expected_quantity },
                  { label: "Estimated Budget", value: data.estimated_budget },
                ],
              },
              {
                title: "Additional Details",
                fields: [
                  { label: "Making Charges", value: data.making_charges },
                  { label: "Hallmark Required", value: data.hallmark_required },
                  { label: "Design Type", value: data.design_type },
                  { label: "Delivery Location", value: data.delivery_location },
                  { label: "Timeline", value: data.timeline },
                ],
              },
              {
                title: "Current Status",
                fields: [
                  { label: "Feasibility Status", value: data.feasibility_status },
                  { label: "Comments", value: data.comments },
                  { label: "Final Status", value: data.final_status },
                  { label: "Final Comment", value: data.final_comment },
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3"
              >
                <h3 className="text-gray-900 text-sm font-semibold">
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.fields.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-gray-600 text-xs font-medium">
                        {f.label}
                      </span>
                      <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">
                        {render(f.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ================= FINAL UPDATE ================= */}
            {mode === "update" && (
              <>
                <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow">
                  <h3 className="text-black text-sm font-bold mb-3">
                    Final Status Update
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs">
                        Final Status
                      </span>
                      <select
                        value={finalStatus}
                        onChange={(e) => setFinalStatus(e.target.value)}
                        className="w-full h-[38px] p-2 border rounded text-xs"
                      >
                        <option value="">Select</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs">
                        Final Comment
                      </span>
                      <textarea
                        value={finalComment}
                        onChange={(e) => setFinalComment(e.target.value)}
                        className="w-full h-[38px] p-2 border rounded text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 py-2 rounded text-sm"
                  >
                    {loading ? "Updating..." : "Update Final Status"}
                  </button>
                </div>
              </>
            )}

            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldFinalBusinessCard;