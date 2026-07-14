import React, { useState } from "react";
import { api } from "../../../api/businessApi";
import Alert from "../../../components/Aleartmessage";

interface Props {
  data: any;
  mode?: "update" | "default";
  onUpdate: (updatedItem: any) => void;
}

const GoldFinalBusinessCard: React.FC<Props> = ({
  data,
  mode = "default",
  onUpdate,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [feasibilityStatus, setFeasibilityStatus] = useState(data.feasibility_status || "");
    const [feasibilityComments, setFeasibilityComments] = useState(data.comments || "");
  const [finalStatus, setFinalStatus] = useState(data.final_status || "");
  const [finalComment, setFinalComment] = useState(data.final_comment || "");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const render = (v: any) => (v ? v : "-");

  
  // ✅ Initialize state when modal opens
  const openModal = () => {
    setFeasibilityStatus(data.feasibility_status || "");
    setFeasibilityComments(data.comments || "");
    setFinalStatus(data.final_status || "");
    setFinalComment(data.final_comment || "");
    setShowModal(true);
  };

  /* ---------------- UPDATE FINAL ---------------- */
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
        "/business-development/gold/review/final",
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
              industry_type:data.industry_type,
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
  

  /* ---------------- CARD FIELDS (ONLY 5) ---------------- */
  const cardFields = [
    ["Description",data.description],
    ["Company Name", data.company_name],
    ["Contact Person", data.contact_person],
    ["Required date", data.required_date],
    ["Gold Type", data.gold_type],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-3 w-full flex flex-col justify-between">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {/* HEADER */}
      <h3 className="text-purple-700 font-semibold text-sm mb-3">
        GOLD ID: {data.id}
      </h3>

      {/* FIELDS */}
       <div className="flex flex-col gap-1">
        {cardFields.map(([label, value]) => (
          <div key={label} className="flex justify-between items-center">
            <span className="w-32 shrink-0 text-gray-400 text-sm">{label}:</span>
            <span className="font-medium text-gray-700 text-sm truncate">{render(value)}</span>
          </div>
        ))}
      </div>

      {/* UPDATE BUTTON */}
      {mode === "update" && (
        <button onClick={openModal} className="mt-3 text-blue-600 text-sm self-start">
          Update
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
                    onClick={handleFinalUpdate}
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 py-2 rounded text-sm"
                  >
                    {loading ? "Updating..." : "Update & Assign To Project Manager"}
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