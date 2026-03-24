// src/pages/TwoWheeler/TwoWheelerCard.tsx
import React, { useState } from "react";
import { api } from "../../../api/businessApi";
import Alert from "../../../components/Aleartmessage"; // <-- import alert

interface Props {
  data: any;
  mode?: "update" | "default";
  onUpdate: (updatedItem: any) => void;
}

const TwoWheelerCard: React.FC<Props> = ({ data, mode = "default", onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [finalStatus, setFinalStatus] = useState(data.final_status || "");
  const [finalComment, setFinalComment] = useState(data.final_comment || "");
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleUpdate = async () => {
    if (!finalStatus) return alert("Please select a final status");

    try {
      setLoading(true);
      const res = await api.patch("/business-development/2w/review", {
        id: data.id,
        final_status: finalStatus,
        final_comment: finalComment,
        feasibility_status: data.feasibility_status,
        comments: data.comments || ""
      });

      if (res.data.success) {
        onUpdate(res.data.data);
        setShowModal(false);

        // Show success alert
        setAlert({ type: "success", message: "Final status updated successfully!" });
        setTimeout(() => setAlert(null), 2000);
      }
    } catch (err) {
      console.error("Failed to update final status", err);
      setAlert({ type: "error", message: "Failed to update final status" });
      setTimeout(() => setAlert(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex flex-col justify-between h-full">
      {/* Alert */}
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

     <div className="space-y-1 text-gray-800">
  <p><strong>ID:</strong> {data.id}</p>

  <p><strong>Company Name:</strong> {data.company_name}</p>
  <p><strong>Contact Person:</strong> {data.contact_person}</p>
  <p><strong>Phone:</strong> {data.phone}</p>
  <p><strong>Email:</strong> {data.email}</p>
  <p><strong>Project Title:</strong> {data.project_title}</p>
  <p><strong>Expected Quantity:</strong> {data.expected_quantity}</p>
  <p><strong>Estimated Budget:</strong> {data.estimated_budget}</p>
  <p><strong>Vehicle Model:</strong> {data.vehicle_model}</p>
  <p><strong>Motor Capacity:</strong> {data.motor_capacity}</p>
  <p><strong>Battery Type:</strong> {data.battery_type}</p>

        {mode === "update" && (
          <>
            <p><strong>Feasibility Status:</strong> {data.feasibility_status}</p>
            <p><strong>Comments:</strong> {data.comments}</p>
           
          </>
        )}
      </div>

      {mode === "update" && (
        <p
          onClick={() => setShowModal(true)}
          className="mt-3 text-blue-600 underline cursor-pointer w-fit"
        >
          Update
        </p>
      )}

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4">Update Feasibility</h2>

            <div className="space-y-3 text-gray-800">
              <p><strong>Company:</strong> {data.company_name}</p>
              <p><strong>Project Title:</strong> {data.project_title}</p>
              <p><strong>Contact Person:</strong> {data.contact_person}</p>
              <p><strong>Phone:</strong> {data.phone}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Expected Quantity:</strong> {data.expected_quantity}</p>
              <p><strong>Estimated Budget:</strong> {data.estimated_budget}</p>

              <div>
                <label className="block font-medium mb-1">Final Status</label>
                <select
                  className="w-full border border-gray-300 rounded p-2"
                  value={finalStatus}
                  onChange={(e) => setFinalStatus(e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Final Comment</label>
                <textarea
                  className="w-full border border-gray-300 rounded p-2"
                  value={finalComment}
                  onChange={(e) => setFinalComment(e.target.value)}
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoWheelerCard;