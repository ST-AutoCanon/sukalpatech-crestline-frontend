// // src/pages/TwoWheeler/TwoWheelerCard.tsx
// import React, { useEffect, useState } from "react";
// import Alert from "../../../components/Aleartmessage";
// import { api } from "../../../api/businessApi";

// interface Props {
//   data: {
//     id: number;
//     company_name: string;
//     contact_person: string;
//     phone: string;
//     email: string;
//     project_title: string;
//     expected_quantity: string;
//     estimated_budget: string;
//     vehicle_model: string;
//     motor_capacity: string;
//     battery_type: string;
//     business_status: string;
//     comment: string;
//     feasibility_status: string;
//     comments: string;
//     final_status: string;
//     final_comment: string;
//   };
//   mode?: "all" | "update";
//   onUpdate?: (updated: any) => void;
// }

// const ThreeWheelerCard: React.FC<Props> = ({ data, mode, onUpdate }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [feasibilityStatus, setFeasibilityStatus] = useState("");
//   const [comments, setComments] = useState("");

//   // Alert state
//   const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

//   useEffect(() => {
//     if (showModal) {
//       setFeasibilityStatus(data.feasibility_status || "");
//       setComments(data.comments || "");
//     }
//   }, [showModal, data]);

//   const render = (v: any) => (v ? v : "-");

//   const updateFeasibility3W = async () => {
//     try {
//       const res = await api.patch(
//         `/business-development/3w/review`,
//         {
//           id: data.id,
//           feasibility_status: feasibilityStatus,
//           comments: comments,
//         },
//         { withCredentials: true }
//       );

//       onUpdate?.(res.data.data);

//       setAlert({ type: "success", message: "Feasibility updated successfully!" });
//       setTimeout(() => setAlert(null), 2000);
//       setShowModal(false);
//     } catch (err) {
//       console.error("3W Feasibility Update Error:", err);
//       setAlert({ type: "error", message: "Failed to update feasibility" });
//       setTimeout(() => setAlert(null), 2000);
//     }
//   };

//   const fields = [
//     ["Company Name", data.company_name],
//     ["Contact Person", data.contact_person],
//     ["Phone", data.phone],
//     ["Email", data.email],
//     ["Project Title", data.project_title],
//     ["Expected Quantity", data.expected_quantity],
//     ["Estimated Budget", data.estimated_budget],
//     ["Vehicle Model", data.vehicle_model],
//     ["Business Status", data.business_status],
//     ["Comment", data.comment],

//   ];

//   return (
//     <div className="bg-white rounded-xl shadow p-4 text-gray-900">

//       {/* Alert */}
//       {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

//       <h3 className="text-purple-700 font-semibold">
//         3W Request ID: {data.id}
//       </h3>

//       {fields.slice(0, 12).map(([label, value]) => (
//         <p key={label} className="text-sm mb-1">
//           <strong>{label}:</strong> {render(value)}
//         </p>
//       ))}

//       <button
//         onClick={() => setShowModal(true)}
//         className="mt-2 text-blue-600 underline text-xs"
//       >
//         {mode === "update" ? "Update Feasibility" : "More Info"}
//       </button>

//       {showModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
//           onClick={() => setShowModal(false)}
//         >
//           <div
//             className="bg-white text-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-xl font-bold"
//             >
//               ×
//             </button>

//             <h2 className="text-lg font-semibold mb-4">
//               3W Request Details
//             </h2>

//             {/* Show all fields including feasibility & final */}
//             {fields.map(([label, value]) => (
//               <p key={label} className="text-sm mb-1">
//                 <strong>{label}:</strong> {render(value)}
//               </p>
//             ))}

//             {/* Update section for update mode */}
//             {mode === "update" && (
//               <div className="mt-4 space-y-3">
//                 <div>
//                   <label className="block text-sm font-semibold">Feasibility Status</label>
//                   <select
//                     value={feasibilityStatus}
//                     onChange={(e) => setFeasibilityStatus(e.target.value)}
//                     className="w-full border rounded p-2"
//                   >
//                     <option value="">Select</option>
//                     <option value="FEASIBILITY APPROVED">FEASIBILITY APPROVED</option>
//                     <option value="FEASIBILITY REJECTED">FEASIBILITY REJECTED</option>
//                     <option value="FEASIBILITY PENDING">FEASIBILITY PENDING</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold">Comments</label>
//                   <textarea
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                     className="w-full border rounded p-2"
//                   />
//                 </div>

//                 <button
//                   onClick={updateFeasibility3W}
//                   className="bg-purple-700 text-white px-4 py-2 rounded"
//                 >
//                   Update
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ThreeWheelerCard;

import React, { useEffect, useState } from "react";
import Alert from "../../../../components/Aleartmessage";
import { api } from "../../../../api/businessApi";

interface Props {
  data: {
    id: number;
    company_name: string;
    contact_person: string;
    phone: string;
    email: string;
    project_title: string;
    expected_quantity: string;
    estimated_budget: string;
    vehicle_model: string;
    engine_capacity: string;
    fuel_type: string;
    load_capacity: string;
    business_status: string;
    comment: string;
    feasibility_status: string;
    comments: string;
    final_status?: string;
    final_comment?: string;
  };
  mode?: "all" | "update";
  onUpdate?: (updated: any) => void;
  cardIndex: number;
}

const ThreeWheelerCard: React.FC<Props> = ({ data, mode, onUpdate, cardIndex }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...data });
  const [editChanges, setEditChanges] = useState<Partial<typeof formData>>({});
  const [feasibilityStatus, setFeasibilityStatus] = useState("");
  const [comments, setComments] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Track changes for Cancel
  const handleEditChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setEditChanges((prev) => ({ ...prev, [key]: value }));
  };

  // Reset formData when modal opens
  useEffect(() => {
    if (showModal) {
      setFormData({ ...data });
      setFeasibilityStatus(data.feasibility_status || "");
      setComments(data.comments || "");
      setEditChanges({});
    }
  }, [showModal, data]);

  const render = (v: any) => (v ? v : "-");

  const updateFeasibility3W = async () => {
    try {
      const res = await api.patch(
        `/business-development/3w/update/${data.id}`,
        {
          ...formData,
          feasibility_status: feasibilityStatus,
          comments: comments,
        },
        { withCredentials: true }
      );

      const updated = res.data.data;

      // Update parent & local state
      onUpdate?.(updated);
      setFormData({ ...updated });
      setFeasibilityStatus(updated.feasibility_status || "");
      setComments(updated.comments || "");

      setAlert({ type: "success", message: "3W Request updated successfully!" });
      setTimeout(() => setAlert(null), 2000);
      setShowModal(false);
      setEditMode(false);
    } catch (err) {
      console.error("3W Update Error:", err);
      setAlert({ type: "error", message: "Failed to update 3W Request" });
      setTimeout(() => setAlert(null), 2000);
    }
  };

  const cardFields = [
    ["Company Name", data.company_name],
    ["Contact Person", data.contact_person],
    ["Phone", data.phone],
    ["Project Title", data.project_title],
    ["Vehicle Model", data.vehicle_model],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full  flex flex-col justify-between">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h3 className="text-purple-700 font-semibold text-sm mb-3">3W ID: {cardIndex + 1}</h3>

      <div className="space-y-2 flex-1">
        {cardFields.map(([label, value]) => (
          <div key={label} className="flex text-sm">
            <span className="w-36 text-gray-500">{label}:</span>
            <span className="text-gray-900 font-medium truncate">{render(value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <button
          onClick={() => {
            setEditMode(false);
            setShowModal(true);
          }}
          className="text-blue-600 font-semibold text-sm"
        >
          {mode === "update" ? "Update Feasibility" : "More Info"}
        </button>

        {mode !== "update" && !formData.feasibility_status && (
          <button
            onClick={() => {
              setEditMode(true);
              setShowModal(true);
            }}
            className="text-blue-700 font-semibold text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl rounded-none sm:rounded-2xl overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium">
              3W-{data.id} Full Info
            </h2>

            {/* ================= SECTIONS ================= */}
            {[
              {
                title: "Company Details",
                fields: [
                  ["Company Name", data.company_name],
                  ["Contact Person", data.contact_person],
                  ["Phone", data.phone],
                  ["Email", data.email],
                ],
              },
              {
                title: "Project Details",
                fields: [
                  ["Project Title", data.project_title],
                  ["Expected Quantity", data.expected_quantity],
                  ["Estimated Budget", data.estimated_budget],
                ],
              },
              {
                title: "Vehicle Details",
                fields: [
                  ["Vehicle Model", data.vehicle_model],
                  ["Engine Capacity", data.engine_capacity],
                  ["Fuel Type", data.fuel_type],
                  ["Load Capacity", data.load_capacity],
                ],
              },
              {
                title: "Current Status",
                fields: [
                  ["Business Status", data.business_status],
                  ["Comment", data.comment],
                  ["Feasibility Status", data.feasibility_status],
                  ["Feasibility Comments", data.comments],
                  ...(mode !== "update"
                    ? [
                      ["Final Status", data.final_status],
                      ["Final Comment", data.final_comment],
                    ]
                    : []),
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.fields.map(([label, value]) => {
                    const key = label.toLowerCase().replace(/ /g, "_") as keyof typeof formData;
                    return (
                      <div key={label} className="flex flex-col">
                        <span className="text-gray-600 text-xs font-medium">{label}</span>

                        {editMode ? (
                          <input
                            value={formData[key] || ""}
                            onChange={(e) => handleEditChange(key, e.target.value)}
                            className="border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900"
                          />
                        ) : (
                          <span className="bg-white border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900">
                            {render(formData[key])}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* ================= FEASIBILITY UPDATE ================= */}
            {mode === "update" && (
              <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow">
                <h3 className="text-sm font-bold mb-3 text-gray-900">Feasibility Update</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-900">Feasibility Status</label>
                    <select
                      value={feasibilityStatus}
                      onChange={(e) => setFeasibilityStatus(e.target.value)}
                      className="w-full p-2 border rounded text-xs text-gray-900"
                    >
                      <option value="">Select</option>
                      <option value="FEASIBILITY APPROVED">FEASIBILITY APPROVED</option>
                      <option value="FEASIBILITY REJECTED">FEASIBILITY REJECTED</option>
                      <option value="FEASIBILITY PENDING">FEASIBILITY PENDING</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-900">Comments</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full p-2 border rounded text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={updateFeasibility3W}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                  >
                    Update Feasibility
                  </button>
                </div>
              </div>
            )}

            {/* ================= EDIT BUTTONS ================= */}
            {editMode && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    // Reset only edited fields
                    const resetData = { ...formData };
                    Object.keys(editChanges).forEach((key) => {
                      resetData[key as keyof typeof resetData] = data[key as keyof typeof data];
                    });
                    setFormData(resetData);
                    setEditChanges({});
                  }}
                  className="bg-white border border-gray-300 text-gray-800 px-5 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={updateFeasibility3W}
                  className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                >
                  Save
                </button>
              </div>
            )}

            {/* CLOSE MODAL */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-xl text-gray-900"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeWheelerCard;