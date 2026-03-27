// // src/pages/businessDevFood/FoodBusinessCard.tsx
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
//     product_category: string;
//     product_name: string;
//     packaging_type: string;
//     shelf_life: string;
//     storage_condition: string;
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

// const FoodBusinessCard: React.FC<Props> = ({ data, mode, onUpdate }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [feasibilityStatus, setFeasibilityStatus] = useState("");
//   const [comments, setComments] = useState("");

//   const [alert, setAlert] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   useEffect(() => {
//     if (showModal) {
//       setFeasibilityStatus(data.feasibility_status || "");
//       setComments(data.comments || "");
//     }
//   }, [showModal, data]);

//   const render = (v: any) => (v ? v : "-");

//   const updateFeasibilityFood = async () => {
//     try {
//       const res = await api.patch(
//         `/business-development/food/review`, // ✅ FOOD API
//         {
//           id: data.id,
//           feasibility_status: feasibilityStatus,
//           comments: comments,
//         },
//         { withCredentials: true }
//       );

//       onUpdate?.(res.data.data);

//       setAlert({
//         type: "success",
//         message: "Feasibility updated successfully!",
//       });

//       setTimeout(() => setAlert(null), 2000);
//       setShowModal(false);
//     } catch (err) {
//       console.error("Food Feasibility Update Error:", err);

//       setAlert({
//         type: "error",
//         message: "Failed to update feasibility",
//       });

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

//     ["Product Category", data.product_category],
//     ["Product Name", data.product_name],
//     ["Packaging Type", data.packaging_type],
//     ["Shelf Life", data.shelf_life],
//     ["Storage Condition", data.storage_condition],

//     ["Business Status", data.business_status],
//     ["Comment", data.comment],
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow p-4 text-gray-900">
//       {/* Alert */}
//       {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

//       <h3 className="text-purple-700 font-semibold">
//         Food Request ID: {data.id}
//       </h3>

//       {/* Preview fields */}
//       {fields.slice(0, 8).map(([label, value]) => (
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

//       {/* MODAL */}
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
//               Food Request Details
//             </h2>

//             {/* All fields */}
//             {fields.map(([label, value]) => (
//               <p key={label} className="text-sm mb-1">
//                 <strong>{label}:</strong> {render(value)}
//               </p>
//             ))}

//             {/* UPDATE MODE */}
//             {mode === "update" && (
//               <div className="mt-4 space-y-3">
//                 <div>
//                   <label className="block text-sm font-semibold">
//                     Feasibility Status
//                   </label>
//                   <select
//                     value={feasibilityStatus}
//                     onChange={(e) =>
//                       setFeasibilityStatus(e.target.value)
//                     }
//                     className="w-full border rounded p-2"
//                   >
//                     <option value="">Select</option>
//                     <option value="FEASIBILITY APPROVED">
//                       FEASIBILITY APPROVED
//                     </option>
//                     <option value="FEASIBILITY REJECTED">
//                       FEASIBILITY REJECTED
//                     </option>
//                     <option value="FEASIBILITY PENDING">
//                       FEASIBILITY PENDING
//                     </option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold">
//                     Comments
//                   </label>
//                   <textarea
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                     className="w-full border rounded p-2"
//                   />
//                 </div>

//                 <button
//                   onClick={updateFeasibilityFood}
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

// export default FoodBusinessCard;

// src/pages/businessDevFood/FoodBusinessCard.tsx

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
    product_category: string;
    product_name: string;
    packaging_type: string;
    shelf_life: string;
    storage_condition: string;
    business_status: string;
    comment: string;
    feasibility_status: string;
    comments: string;
    final_status: string;
    final_comment: string;
  };
  mode?: "all" | "update";
  onUpdate?: (updated: any) => void;
  cardIndex: number; 
}

const FoodBusinessCard: React.FC<Props> = ({ data, mode, onUpdate,cardIndex }) => {
  const [showModal, setShowModal] = useState(false);
  const [feasibilityStatus, setFeasibilityStatus] = useState("");
  const [comments, setComments] = useState("");
  const [alert, setAlert] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...data });

  useEffect(() => {
    if (showModal) {
      setFormData({ ...data }); // ✅ important
      setFeasibilityStatus(data.feasibility_status || "");
      setComments(data.comments || "");
    }
  }, [showModal, data]);

  const render = (v: any) => (v ? v : "-");

  const updateFood = async () => {
    try {
     const res = await api.patch(
  `/business-development/food/update/${data.id}`,
  {
    ...formData,
    feasibility_status: feasibilityStatus,
    comments: comments,
  },
  { withCredentials: true }
);

      onUpdate?.(res.data.data);

      setAlert({
        type: "success",
        message: "Food request updated successfully!",
      });

      setTimeout(() => setAlert(null), 2000);
      setShowModal(false);
      setEditMode(false);
    } catch (err) {
      console.error("Food Update Error:", err);

      setAlert({
        type: "error",
        message: "Failed to update food request",
      });

      setTimeout(() => setAlert(null), 2000);
    }
  };

  // ✅ Only 5 fields like 2W
  const cardFields = [
    ["Contact Person", data.contact_person],
    ["Company Name", data.company_name],
    ["Phone", data.phone],
    ["Project Title", data.project_title],
    ["Product Name", data.product_name],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full sm:w-[340px] m-2 flex flex-col justify-between">

      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {/* HEADER */}
      <h3 className="text-purple-700 font-semibold text-sm mb-3">
        FOOD ID:  {cardIndex+1}
      </h3>

      {/* CARD FIELDS */}
      <div className="flex flex-col gap-1">
        {cardFields.map(([label, value]) => (
          <div key={label} className="flex text-sm">
            <span className="w-36 text-gray-500">{label}:</span>
            <span className="text-gray-900 font-medium truncate">
              {render(value)}
            </span>
          </div>
        ))}
      </div>

      {/* BUTTON */}
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
              FOOD-{data.id} Full Info
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
                title: "Product Details",
                fields: [
                  ["Product Category", data.product_category],
                  ["Product Name", data.product_name],
                  ["Packaging Type", data.packaging_type],
                  ["Shelf Life", data.shelf_life],
                  ["Storage Condition", data.storage_condition],
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
              <div
                key={section.title}
                className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3"
              >
                <h3 className="text-sm font-semibold text-gray-800">
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.fields.map(([label, value]) => {
                    const key = label.toLowerCase().replace(/ /g, "_");

                    return (
                      <div key={label} className="flex flex-col">
                        <span className="text-gray-600 text-xs font-medium">
                          {label}
                        </span>

                        {editMode ? (
                          <input
                            value={formData[key] || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            className="bg-white border rounded px-2 py-1 text-xs"
                          />
                        ) : (
                          <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-gray-900">
                            {render(value)}
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
              <>
                <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow">
                  <h3 className="text-sm font-bold mb-3 text-gray-900">
                    Feasibility Update
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">
                        Feasibility Status
                      </label>
                      <select
                        value={feasibilityStatus}
                        onChange={(e) => setFeasibilityStatus(e.target.value)}
                        className="w-full p-2 border rounded text-xs text-gray-900 bg-white"
                      >
                        <option value="">Select</option>
                        <option value="FEASIBILITY APPROVED">
                          FEASIBILITY APPROVED
                        </option>
                        <option value="FEASIBILITY REJECTED">
                          FEASIBILITY REJECTED
                        </option>
                        <option value="FEASIBILITY PENDING">
                          FEASIBILITY PENDING
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600">
                        Comments
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full p-2 border rounded text-xs text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={updateFood}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                  >
                    Update Feasibility
                  </button>
                </div>
              </>
            )}
            {editMode && (
              <div className="flex justify-end">
                <button
                  onClick={updateFood}
                  className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                >
                  Save
                </button>
              </div>
            )}

            {/* CLOSE */}
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

export default FoodBusinessCard;