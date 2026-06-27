import React, { useState } from "react";
import { api } from "../../../../api/businessApi";
import Alert from "../../../../components/Aleartmessage";

interface Props {
  data: any;
  mode?: "update" | "default";
  onUpdate: (updatedItem: any) => void;
  cardIndex: number; 
}

const FoodBusinessCard: React.FC<Props> = ({
  data,
  mode = "default",
  onUpdate,
  cardIndex
}) => {
  const [showModal, setShowModal] = useState(false);
  const [finalStatus, setFinalStatus] = useState(data.final_status || "");
  const [finalComment, setFinalComment] = useState(
    data.final_comment || ""
  );
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const render = (v: any) => (v ? v : "-");

  // ✅ FINAL UPDATE
  const handleFinalUpdate = async () => {
   if (!finalStatus) {
     setAlert({
       type: "error",
       message: "Please select a final status",
     });
     return;
   }
 
   try {
     setLoading(true);
 
     // 1️⃣ Update Final Status
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
       onUpdate(res.data.data);
 
       // 2️⃣ Assign Project only when approved
       if (finalStatus === "APPROVED") {
         const assignRes = await api.post(
           "/project-manager/projects/assign",
           {
             bd_request_id: data.id,
             description:
               data.project_title ||
               data.description,
 
             required_date:
               data.required_date,
 
             assigned_by:
               data.contact_person || "System",
 
             current_department:
               "PROJECT_MANAGER",
           },
           {
             withCredentials: true,
           }
         );
 
         console.log(
           "PROJECT CREATED:",
           assignRes.data
         );
       }
 
       setAlert({
         type: "success",
         message:
           finalStatus === "APPROVED"
             ? "Final status updated and project assigned successfully!"
             : "Final status updated successfully!",
       });
     }
   } catch (err: any) {
     console.error(err);
 
     setAlert({
       type: "error",
       message:
         err.response?.data?.message ||
         "Failed to update final status",
     });
   } finally {
     setLoading(false);
   }
 };
 

  // ✅ SAME 5 FIELDS LIKE 2W
  const cardFields = [
    ["Contact Person", data.contact_person],
    ["Company Name", data.company_name],
    ["Phone", data.phone],
    ["Project Title", data.project_title],
    ["Product Name", data.product_name],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-3 w-full sm:w-[360px] md:w-[400px] m-2 flex flex-col justify-between">
      
      {/* Alert */}
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {/* Header */}
      <h3 className="text-purple-700 font-semibold text-sm mb-3">
        FOOD ID:  {cardIndex + 1}
      </h3>

      {/* ✅ CLEAN ALIGNMENT */}
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

      {/* Update Button */}
      {mode === "update" && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 text-blue-600 underline text-sm self-start"
        >
           Update & Assign To Project Manager
        </button>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2 sm:p-4">
          <div
            className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl rounded-none sm:rounded-2xl overflow-y-auto p-4 sm:p-8 relative flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                  ["Feasibility Status", data.feasibility_status],
                  ["Feasibility Comments", data.comments],
                  ["Final Status", data.final_status],
                  ["Final Comment", data.final_comment],
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
                  {section.fields.map(([label, value]) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-gray-600 text-xs font-medium">
                        {label}
                      </span>
                      <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">
                        {render(value)}
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
                    {/* Final Status */}
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

                    {/* Final Comment */}
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs">
                        Final Comment
                      </span>
                      <textarea
                        value={finalComment}
                        onChange={(e) =>
                          setFinalComment(e.target.value)
                        }
                        className="w-full h-[38px] p-2 border rounded text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex justify-end">
                  <button
                    onClick={handleFinalUpdate}
                    disabled={loading}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                  >
                    {loading ? "Updating..." : "Update Final Status"}
                  </button>
                </div>
              </>
            )}

            {/* Close */}
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

export default FoodBusinessCard;