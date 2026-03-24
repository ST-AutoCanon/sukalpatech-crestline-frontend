// src/pages/businessDevFood/FoodBusinessCard.tsx
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
}

const FoodBusinessCard: React.FC<Props> = ({ data, mode, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [feasibilityStatus, setFeasibilityStatus] = useState("");
  const [comments, setComments] = useState("");

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (showModal) {
      setFeasibilityStatus(data.feasibility_status || "");
      setComments(data.comments || "");
    }
  }, [showModal, data]);

  const render = (v: any) => (v ? v : "-");

  const updateFeasibilityFood = async () => {
    try {
      const res = await api.patch(
        `/business-development/food/review`, // ✅ FOOD API
        {
          id: data.id,
          feasibility_status: feasibilityStatus,
          comments: comments,
        },
        { withCredentials: true }
      );

      onUpdate?.(res.data.data);

      setAlert({
        type: "success",
        message: "Feasibility updated successfully!",
      });

      setTimeout(() => setAlert(null), 2000);
      setShowModal(false);
    } catch (err) {
      console.error("Food Feasibility Update Error:", err);

      setAlert({
        type: "error",
        message: "Failed to update feasibility",
      });

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

    ["Product Category", data.product_category],
    ["Product Name", data.product_name],
    ["Packaging Type", data.packaging_type],
    ["Shelf Life", data.shelf_life],
    ["Storage Condition", data.storage_condition],

    ["Business Status", data.business_status],
    ["Comment", data.comment],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 text-gray-900">
      {/* Alert */}
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h3 className="text-purple-700 font-semibold">
        Food Request ID: {data.id}
      </h3>

      {/* Preview fields */}
      {fields.slice(0, 8).map(([label, value]) => (
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

      {/* MODAL */}
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
              Food Request Details
            </h2>

            {/* All fields */}
            {fields.map(([label, value]) => (
              <p key={label} className="text-sm mb-1">
                <strong>{label}:</strong> {render(value)}
              </p>
            ))}

            {/* UPDATE MODE */}
            {mode === "update" && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold">
                    Feasibility Status
                  </label>
                  <select
                    value={feasibilityStatus}
                    onChange={(e) =>
                      setFeasibilityStatus(e.target.value)
                    }
                    className="w-full border rounded p-2"
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
                  <label className="block text-sm font-semibold">
                    Comments
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>

                <button
                  onClick={updateFeasibilityFood}
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

export default FoodBusinessCard;