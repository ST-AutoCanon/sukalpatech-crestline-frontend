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

    business_type: string;
    gold_type: string;
    product_type: string;
    purity_required: string;
    expected_quantity: string;
    estimated_budget: string;

    making_charges: string;
    hallmark_required: string;
    design_type: string;
    delivery_location: string;
    timeline: string;

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

const GoldBusinessCard: React.FC<Props> = ({ data, mode, onUpdate}) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...data });

  const [feasibilityStatus, setFeasibilityStatus] = useState("");
  const [comments, setComments] = useState("");

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [editChanges, setEditChanges] = useState<Partial<typeof formData>>({});

  // When editing any field, track the changes
  const handleEditChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setEditChanges((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (showModal) {
      setFormData({ ...data });
      setFeasibilityStatus(data.feasibility_status || "");
      setComments(data.comments || "");
    }
  }, [showModal, data]);

  const render = (v: any) => (v ? v : "-");

  /* ================= UPDATE FULL (EDIT MODE) ================= */
  const updateGold = async () => {
    try {
      const res = await api.patch(
        `/business-development/gold/update/${data.id}`, // ✅ backend route
        formData,
        { withCredentials: true }
      );
      console.log("PAYLOAD:", formData);

      onUpdate?.(res.data.data);

      setAlert({
        type: "success",
        message: "Gold request updated successfully!",
      });

      setTimeout(() => setAlert(null), 2000);
      setShowModal(false);
      setEditMode(false);
    } catch (err) {
      console.error("Gold Update Error:", err);

      setAlert({
        type: "error",
        message: "Failed to update gold request",
      });

      setTimeout(() => setAlert(null), 2000);
    }
  };

  /* ================= CARD FIELDS ================= */
  const allFields: [string, keyof typeof data][] = [
    ["Contact Person", "contact_person"],
    ["Company Name", "company_name"],
    ["Phone", "phone"],
    ["Gold Type", "gold_type"],
    ["Expected Quantity", "expected_quantity"],
    ["Email", "email"],
    ["Estimated Budget", "estimated_budget"],
    ["Purity Required", "purity_required"],
    ["Making Charges", "making_charges"],
    ["Hallmark Required", "hallmark_required"],
    ["Design Type", "design_type"],
    ["Delivery Location", "delivery_location"],
    ["Timeline", "timeline"],
    ["Business Status", "business_status"],
    ["Comment", "comment"],
    ["Feasibility Status", "feasibility_status"],
    ["Comments", "comments"],

    ...(mode !== "update"
      ? [
        ["Final Status", "final_status"] as [string, keyof typeof data],
        ["Final Comment", "final_comment"] as [string, keyof typeof data],
      ]
      : []),
  ];

  const cardFields = allFields.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full sm:w-[300px] m-2 flex flex-col justify-between">

      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h3 className="text-purple-700 font-semibold text-sm mb-3">
        GOLD ID: {data.id}
      </h3>

      {/* CARD */}
      <div className="space-y-2 flex-1">
        {cardFields.map(([label, key]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-900">{label}:</span>
            <span className="font-medium text-gray-900">
              {render(data[key])}
            </span>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
     <div className="mt-3 flex  items-center gap-8">
        <button
          onClick={() => {
            setEditMode(false);
            setShowModal(true);
          }}
          className="text-blue-700 font-semibold text-sm"
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
          onClick={() => {
            setShowModal(false);
            setEditMode(false);
          }}
        >
          <div
            className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl rounded-none sm:rounded-2xl overflow-y-auto p-4 sm:p-8 relative flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium">
              {editMode
                ? `GOLD-${data.id} Edit Full Info`
                : mode === "update"
                  ? `GOLD-${data.id} Feasibility Update`
                  : `GOLD-${data.id} Full Info`}
            </h2>

            {/* SECTIONS */}
            {[
              {
                title: "Company Details",
                fields: [
                  { label: "Company Name", key: "company_name" },
                  { label: "Contact Person", key: "contact_person" },
                  { label: "Phone", key: "phone" },
                  { label: "Email", key: "email" },
                ],
              },
              {
                title: "Gold Details",
                fields: [
              
                  { label: "Gold Type", key: "gold_type" },
                  { label: "Purity Required", key: "purity_required" },
                  { label: "Expected Quantity", key: "expected_quantity" },
                  { label: "Estimated Budget", key: "estimated_budget" },
                ],
              },
              {
                title: "Additional Details",
                fields: [
                  { label: "Making Charges", key: "making_charges" },
                  { label: "Hallmark Required", key: "hallmark_required" },
                  { label: "Design Type", key: "design_type" },
                  { label: "Delivery Location", key: "delivery_location" },
                  { label: "Timeline", key: "timeline" },
                ],
              },
              {
                title: "Current Status",
                fields: [
                  { label: "Business Status", key: "business_status" },
                  { label: "Comment", key: "comment" },
                  ...(formData.feasibility_status || formData.comments
                    ? [
                      { label: "Feasibility Status", key: "feasibility_status" },
                      { label: "Comments", key: "comments" },
                    ]
                    : []),

                  ...(mode !== "update"
                    ? [
                      ...(formData.final_status || formData.final_comment
                        ? [
                          { label: "Final Status", key: "final_status" },
                          { label: "Final Comment", key: "final_comment" },
                        ]
                        : []),
                    ]
                    : []),
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3">
                <h3 className="text-gray-900 text-sm font-semibold">
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.fields.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-xs text-gray-900">{f.label}</span>

                      {editMode ? (
                        <input
                          value={formData[f.key] || ""}
                          onChange={(e) => handleEditChange(f.key, e.target.value)}
                          className="border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900"
                        />
                      ) : (
                        <span className="bg-white border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900">
                          {render(formData[f.key])}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* FEASIBILITY UPDATE */}
            {mode === "update" && (
              <>
                <div className="bg-gray-100 p-5 rounded-xl">
                  <h3 className="text-sm font-bold mb-3 text-gray-900">
                    Feasibility Update
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      value={feasibilityStatus}
                      onChange={(e) =>
                        setFeasibilityStatus(e.target.value)
                      }
                      className="border p-2 rounded text-xs text-gray-900"
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

                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="border p-2 rounded text-sm text-gray-900 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.patch(
                          `/business-development/gold/review`,
                          {
                            id: data.id,
                            feasibility_status: feasibilityStatus,
                            comments: comments,
                          }
                        );

                        onUpdate?.(res.data.data);

                        setAlert({
                          type: "success",
                          message: "Feasibility updated!",
                        });

                        setShowModal(false);
                      } catch {
                        setAlert({
                          type: "error",
                          message: "Update failed",
                        });
                      }
                    }}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                  >
                    Update Feasibility
                  </button>
                </div>
              </>
            )}

            {/* EDIT SAVE */}
            {editMode && (
              <div className="flex justify-end gap-2">
                {/* Cancel Button */}
                <button
                  onClick={() => {
                    // Reset only fields changed during this edit session
                    const resetData = { ...formData };
                    Object.keys(editChanges).forEach((key) => {
                      resetData[key as keyof typeof resetData] = data[key as keyof typeof data];
                    });
                    setFormData(resetData);
                    setEditChanges({}); // clear the session changes
                  }}
                  className="bg-white border border-gray-300 text-gray-800 px-5 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>

                {/* Save Button */}
                <button
                  onClick={updateGold}
                  className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                >
                  Save
                </button>
              </div>
            )}

            {/* CLOSE */}
            <button
              onClick={() => {
                setShowModal(false);
                setEditMode(false);
              }}
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

export default GoldBusinessCard; 