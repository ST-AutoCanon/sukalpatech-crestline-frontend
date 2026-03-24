// src/pages/TwoWheeler/TwoWheelerCard.tsx
import React, { useEffect, useState } from "react";
import Alert from "../../../components/Aleartmessage";
import { api } from "../../../api/businessApi";

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
    motor_capacity: string;
    battery_type: string;
    business_status: string;
    comment: string;
    feasibility_status: string;
    comments: string;
    final_status: string;
    final_comment: string;
  };
  mode?: "all" | "update";
  onUpdate?: (updated: any) => void;
}

const ThreeWheelerCard: React.FC<Props> = ({ data, mode, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [feasibilityStatus, setFeasibilityStatus] = useState("");
  const [comments, setComments] = useState("");

  // Alert state
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (showModal) {
      setFeasibilityStatus(data.feasibility_status || "");
      setComments(data.comments || "");
    }
  }, [showModal, data]);

  const render = (v: any) => (v ? v : "-");

  const updateFeasibility3W = async () => {
    try {
      const res = await api.patch(
        `/business-development/3w/review`,
        {
          id: data.id,
          feasibility_status: feasibilityStatus,
          comments: comments,
        },
        { withCredentials: true }
      );

      onUpdate?.(res.data.data);

      setAlert({ type: "success", message: "Feasibility updated successfully!" });
      setTimeout(() => setAlert(null), 2000);
      setShowModal(false);
    } catch (err) {
      console.error("3W Feasibility Update Error:", err);
      setAlert({ type: "error", message: "Failed to update feasibility" });
      setTimeout(() => setAlert(null), 2000);
    }
  };

  const fields = [
    ["Company Name", data.company_name],
    ["Contact Person", data.contact_person],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Project Title", data.project_title],
    ["Expected Quantity", data.expected_quantity],
    ["Estimated Budget", data.estimated_budget],
    ["Vehicle Model", data.vehicle_model],
    ["Business Status", data.business_status],
    ["Comment", data.comment],
   
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 text-gray-900">

      {/* Alert */}
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h3 className="text-purple-700 font-semibold">
        3W Request ID: {data.id}
      </h3>

      {fields.slice(0, 12).map(([label, value]) => (
        <p key={label} className="text-sm mb-1">
          <strong>{label}:</strong> {render(value)}
        </p>
      ))}

      <button
        onClick={() => setShowModal(true)}
        className="mt-2 text-blue-600 underline text-xs"
      >
        {mode === "update" ? "Update Feasibility" : "More Info"}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white text-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">
              3W Request Details
            </h2>

            {/* Show all fields including feasibility & final */}
            {fields.map(([label, value]) => (
              <p key={label} className="text-sm mb-1">
                <strong>{label}:</strong> {render(value)}
              </p>
            ))}

            {/* Update section for update mode */}
            {mode === "update" && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold">Feasibility Status</label>
                  <select
                    value={feasibilityStatus}
                    onChange={(e) => setFeasibilityStatus(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select</option>
                    <option value="FEASIBILITY APPROVED">FEASIBILITY APPROVED</option>
                    <option value="FEASIBILITY REJECTED">FEASIBILITY REJECTED</option>
                    <option value="FEASIBILITY PENDING">FEASIBILITY PENDING</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold">Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>

                <button
                  onClick={updateFeasibility3W}
                  className="bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeWheelerCard;