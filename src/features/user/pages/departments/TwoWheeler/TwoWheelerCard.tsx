// // src/pages/TwoWheeler/TwoWheelerCard.tsx
// import React, { useState } from "react";
// import { api } from "../../../api/businessApi";
// import Alert from "../../../components/Aleartmessage";

// interface Props {
//   data: any;
//   mode?: "update" | "default";
//   onUpdate: (updatedItem: any) => void;
// }

// const TwoWheelerCard: React.FC<Props> = ({ data, mode = "default", onUpdate }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [finalStatus, setFinalStatus] = useState(data.final_status || "");
//   const [finalComment, setFinalComment] = useState(data.final_comment || "");
//   const [loading, setLoading] = useState(false);

//   const [alert, setAlert] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   const render = (v: any) => (v ? v : "-");

//   // ✅ Update Final Status
//   const handleUpdate = async () => {
//     if (!finalStatus) {
//       setAlert({ type: "error", message: "Please select a final status" });
//       setTimeout(() => setAlert(null), 2000);
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.patch(
//         "/business-development/2w/review/final",
//         {
//           id: data.id,
//           final_status: finalStatus,
//           final_comment: finalComment,
//           feasibility_status: data.feasibility_status,
//           comments: data.comments || "",
//         },
//         { withCredentials: true }
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

//   // ✅ Only 5 fields on card
//   const cardFields = [
//     ["Contact Person", data.contact_person],
//     ["Company Name", data.company_name],
//     ["Phone", data.phone],
//     ["Project Title", data.project_title],
//     ["Vehicle Model", data.vehicle_model],
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow p-3 w-full sm:w-[360px] md:w-[400px] m-2 flex flex-col justify-between">

//       {/* Alert */}
//       {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

//       {/* Header */}
//       <h3 className="text-purple-700 font-semibold text-sm mb-3">
//         2W ID: {data.id}
//       </h3>

//       {/* ✅ Clean aligned fields */}
//       <div className="flex flex-col gap-1">
//         {cardFields.map(([label, value]) => (
//           <div key={label} className="flex">
//             <span className="w-32 shrink-0 text-gray-400 text-sm">
//               {label}:
//             </span>
//             <span className="font-medium text-gray-700 text-sm truncate">
//               {render(value)}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Update Button */}
//       {mode === "update" && (
//         <button
//           onClick={() => setShowModal(true)}
//           className="mt-3 text-blue-600 underline text-sm self-start"
//         >
//           Update Final Status
//         </button>
//       )}

//       {/* ================= MODAL ================= */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2 sm:p-4">
//           <div
//             className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl rounded-none sm:rounded-2xl overflow-y-auto p-4 sm:p-8 relative flex flex-col gap-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium">
//               2W-{data.id} Full Info
//             </h2>

//             {/* ================= SECTIONS ================= */}

//             {[
//               {
//                 title: "Company Details",
//                 fields: [
//                   { label: "Company Name", value: data.company_name },
//                   { label: "Contact Person", value: data.contact_person },
//                   { label: "Phone", value: data.phone },
//                   { label: "Email", value: data.email },
//                 ],
//               },
//               {
//                 title: "Project Details",
//                 fields: [
//                   { label: "Project Title", value: data.project_title },
//                   { label: "Expected Quantity", value: data.expected_quantity },
//                   { label: "Estimated Budget", value: data.estimated_budget },
//                 ],
//               },
//               {
//                 title: "Vehicle Details",
//                 fields: [
//                   { label: "Vehicle Model", value: data.vehicle_model },
//                   { label: "Motor Capacity", value: data.motor_capacity },
//                   { label: "Battery Type", value: data.battery_type },
//                 ],
//               },
//               {
//                 title: "Current Status",
//                 fields: [
//                   { label: "Feasibility Status", value: data.feasibility_status },
//                   { label: "Feasibility Comments", value: data.comments },
//                   { label: "Final Status", value: data.final_status },
//                   { label: "Final Comment", value: data.final_comment },
//                 ],
//               },
//             ].map((section) => (
//               <div
//                 key={section.title}
//                 className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3"
//               >
//                 <h3 className="text-gray-900 text-sm font-semibold">
//                   {section.title}
//                 </h3>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {section.fields.map((f) => (
//                     <div key={f.label} className="flex flex-col">
//                       <span className="text-gray-600 text-xs font-medium">
//                         {f.label}
//                       </span>
//                       <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">
//                         {f.value || "-"}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {/* ================= FINAL UPDATE BOX ================= */}

//             {mode === "update" && (
//               <>
//                 <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow">
//                   <h3 className="text-black text-sm font-bold mb-3">
//                     Final Status Update
//                   </h3>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {/* Final Status */}
//                     <div className="flex flex-col gap-1">
//                       <span className="text-gray-600 text-xs">
//                         Final Status
//                       </span>
//                       <select
//                         value={finalStatus}
//                         onChange={(e) => setFinalStatus(e.target.value)}
//                         className="w-full h-[38px] p-2 border rounded text-xs"
//                       >
//                         <option value="">Select</option>
//                         <option value="APPROVED">APPROVED</option>
//                         <option value="PENDING">PENDING</option>
//                         <option value="REJECTED">REJECTED</option>
//                       </select>
//                     </div>

//                     {/* Final Comment */}
//                     <div className="flex flex-col gap-1">
//                       <span className="text-gray-600 text-xs">
//                         Final Comment
//                       </span>
//                       <textarea
//                         value={finalComment}
//                         onChange={(e) => setFinalComment(e.target.value)}
//                         className="w-full h-[38px] p-2 border rounded text-xs resize-none"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* BUTTON */}
//                 <div className="flex justify-end">
//                   <button
//                     onClick={handleUpdate}
//                     disabled={loading}
//                     className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
//                   >
//                     {loading ? "Updating..." : "Update Final Status"}
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Close */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-4 text-xl"
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TwoWheelerCard;
// src/pages/TwoWheeler/TwoWheelerCard.tsx
import React, { useState } from "react";
import { api } from "../../../api/businessApi";
import Alert from "../../../components/Aleartmessage";

interface Props {
  data: any;
  mode?: "update" | "default";
  onUpdate: (updatedItem: any) => void;
   cardIndex: number; 
}

const TwoWheelerCard: React.FC<Props> = ({ data, mode = "default", onUpdate,cardIndex }) => {
  const [showModal, setShowModal] = useState(false);

  // ✅ Local state for Feasibility & Final fields
  const [feasibilityStatus, setFeasibilityStatus] = useState(data.feasibility_status || "");
  const [feasibilityComments, setFeasibilityComments] = useState(data.comments || "");
  const [finalStatus, setFinalStatus] = useState(data.final_status || "");
  const [finalComment, setFinalComment] = useState(data.final_comment || "");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const render = (v: any) => (v ? v : "-");

  // ✅ Initialize state when modal opens
  const openModal = () => {
    setFeasibilityStatus(data.feasibility_status || "");
    setFeasibilityComments(data.comments || "");
    setFinalStatus(data.final_status || "");
    setFinalComment(data.final_comment || "");
    setShowModal(true);
  };

  // ✅ Update Final Status
  const handleFinalUpdate = async () => {
    if (!finalStatus) {
      setAlert({ type: "error", message: "Please select a final status" });
      setTimeout(() => setAlert(null), 2000);
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch(
        "/business-development/2w/review/final",
        {
          id: data.id,
          final_status: finalStatus,
          final_comment: finalComment,
          feasibility_status: feasibilityStatus,
          comments: feasibilityComments,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        // ✅ update local state immediately
        setFinalStatus(res.data.data.final_status);
        setFinalComment(res.data.data.final_comment);

        // ✅ update parent list
        onUpdate(res.data.data);

        setAlert({
          type: "success",
          message: "Final status updated successfully!",
        });
      }
    } catch (err) {
      console.error("Failed to update final status", err);
      setAlert({ type: "error", message: "Failed to update final status" });
      setTimeout(() => setAlert(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only 5 fields on card
  const cardFields = [
    ["Contact Person", data.contact_person],
    ["Company Name", data.company_name],
    ["Phone", data.phone],
    ["Project Title", data.project_title],
    ["Vehicle Model", data.vehicle_model],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-3 w-full sm:w-[360px] md:w-[400px] m-2 flex flex-col justify-between">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

<h3 className="text-purple-700 font-semibold text-sm mb-3">
  2W ID: {cardIndex + 1}  {/* index from map function */}
</h3>
      <div className="flex flex-col gap-1">
        {cardFields.map(([label, value]) => (
          <div key={label} className="flex">
            <span className="w-32 shrink-0 text-gray-400 text-sm">{label}:</span>
            <span className="font-medium text-gray-700 text-sm truncate">{render(value)}</span>
          </div>
        ))}
      </div>

      {mode === "update" && (
        <button onClick={openModal} className="mt-3 text-blue-600 underline text-sm self-start">
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
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium">
              2W-{data.id} Full Info
            </h2>

            {/* ================= INFO SECTIONS ================= */}
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
                title: "Project Details",
                fields: [
                  { label: "Project Title", value: data.project_title },
                  { label: "Expected Quantity", value: data.expected_quantity },
                  { label: "Estimated Budget", value: data.estimated_budget },
                ],
              },
              {
                title: "Vehicle Details",
                fields: [
                  { label: "Vehicle Model", value: data.vehicle_model },
                  { label: "Motor Capacity", value: data.motor_capacity },
                  { label: "Battery Type", value: data.battery_type },
                ],
              },
              {
                title: "Current Status",
                fields: [
                  { label: "Feasibility Status", value: feasibilityStatus },
                  { label: "Feasibility Comments", value: feasibilityComments },
                  { label: "Final Status", value: finalStatus },
                  { label: "Final Comment", value: finalComment },
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3">
                <h3 className="text-gray-900 text-sm font-semibold">{section.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.fields.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-gray-600 text-xs font-medium">{f.label}</span>
                      <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">
                        {f.value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ================= FINAL UPDATE BOX ================= */}
            {mode === "update" && (
              <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow">
                <h3 className="text-black text-sm font-bold mb-3">Final Status Update</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Final Status */}
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 text-xs">Final Status</span>
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

                  {/* Final Comment */}
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 text-xs">Final Comment</span>
                    <textarea
                      value={finalComment}
                      onChange={(e) => setFinalComment(e.target.value)}
                      className="w-full h-[38px] p-2 border rounded text-xs resize-none"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleFinalUpdate}
                    disabled={loading}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                  >
                    {loading ? "Updating..." : "Update Final Status"}
                  </button>
                </div>
              </div>
            )}

            {/* Close */}
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-4 text-xl">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoWheelerCard;