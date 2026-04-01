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
  cardIndex: number;
}

const TwoWheelerCard: React.FC<Props> = ({ data, mode, onUpdate, cardIndex }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...data });
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [feasibilityStatus, setFeasibilityStatus] = useState("");
  const [comments, setComments] = useState("");


  const [editChanges, setEditChanges] = useState<Partial<typeof formData>>({});

  // When editing any field, track the changes
  const handleEditChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setEditChanges((prev) => ({ ...prev, [key]: value }));
  };

  // Sync formData and feasibility fields whenever modal opens or data changes
  useEffect(() => {
    if (showModal) {
      setFormData({ ...data });
      setFeasibilityStatus(data.feasibility_status || "");
      setComments(data.comments || "");
    }
  }, [showModal, data]);

  const render = (v: any) => (v ? v : "-");

  const update2W = async () => {
    try {
      const res = await api.patch(
        `/business-development/2w/update/${data.id}`,
        formData,
        { withCredentials: true }
      );

      setFormData(res.data.data); // update local state instantly
      onUpdate?.(res.data.data);

      setAlert({ type: "success", message: "2W Request updated successfully!" });
      setTimeout(() => setAlert(null), 2000);

      setShowModal(false);
      setEditMode(false);
    } catch (err) {
      console.error("2W Update Error:", err);
      setAlert({ type: "error", message: "Failed to update 2W Request" });
      setTimeout(() => setAlert(null), 2000);
    }
  };

  const allFields: [string, keyof typeof data][] = [
    ["Contact Person", "contact_person"],
    ["Company Name", "company_name"],
    ["Phone", "phone"],
    ["Project Title", "project_title"],
    ["Vehicle Model", "vehicle_model"],
    ["Expected Quantity", "expected_quantity"],
    ["Email", "email"],
    ["Estimated Budget", "estimated_budget"],
    ["Motor Capacity", "motor_capacity"],
    ["Battery Type", "battery_type"],
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
    <div className="bg-white rounded-xl shadow p-4 text-gray-900 w-full flex flex-col justify-between">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h3 className="text-purple-700 font-semibold text-sm mb-3">
        2W ID: {cardIndex + 1}  {/* index from map function */}
      </h3>
      <div className="space-y-2 flex-1">
        {cardFields.map(([label, key]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-500">{label}:</span>
            <span className="font-medium text-gray-900">{render(formData[key])}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <button
          onClick={() => {
            setEditMode(false);
            setShowModal(true);
          }}
          className="text-blue-700 font-semibold text-sm"
        >
          {mode === "update" ? "Update Feasibility" : "More info"}
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

      {/* Modal */}
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
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium">
              2W-{formData.id} Full Info
            </h2>

            {[{
              title: "Company Details",
              fields: [
                { label: "Company Name", key: "company_name" },
                { label: "Contact Person", key: "contact_person" },
                { label: "Phone", key: "phone" },
                { label: "Email", key: "email" },
              ],
            }, {
              title: "Project Details",
              fields: [
                { label: "Project Title", key: "project_title" },
                { label: "Expected Quantity", key: "expected_quantity" },
                { label: "Estimated Budget", key: "estimated_budget" },
              ],
            }, {
              title: "Vehicle Details",
              fields: [
                { label: "Vehicle Model", key: "vehicle_model" },
                { label: "Motor Capacity", key: "motor_capacity" },
                { label: "Battery Type", key: "battery_type" },
              ],
            }, {
              title: "Current Status",
              fields: [
                { label: "Business Status", key: "business_status" },
                { label: "Comment", key: "comment" },

                // ❌ Hide these in edit mode
                ...(!editMode
                  ? [
                    { label: "Feasibility Status", key: "feasibility_status" },
                    { label: "Feasibility Comments", key: "comments" },
                  ]
                  : []),

                // ❌ Hide final fields also in edit mode
                ...(!editMode && mode !== "update"
                  ? [
                    { label: "Final Status", key: "final_status" },
                    { label: "Final Comment", key: "final_comment" },
                  ]
                  : []),
              ],
            }].map((section) => (
              <div key={section.title} className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3">
                <h3 className="text-gray-900 text-sm font-semibold">{section.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.fields.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-gray-600 text-xs font-medium">{f.label}</span>
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
                  <h3 className="text-sm font-bold mb-3 text-gray-900">Feasibility Update</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      value={feasibilityStatus}
                      onChange={(e) => setFeasibilityStatus(e.target.value)}
                      className="border p-2 rounded text-xs text-gray-900"
                    >
                      <option value="">Select</option>
                      <option value="FEASIBILITY APPROVED">FEASIBILITY APPROVED</option>
                      <option value="FEASIBILITY REJECTED">FEASIBILITY REJECTED</option>
                      <option value="FEASIBILITY PENDING">FEASIBILITY PENDING</option>
                    </select>

                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="border p-2 rounded text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.patch(`/business-development/2w/review`, {
                          id: data.id,
                          feasibility_status: feasibilityStatus,
                          comments: comments,
                        });

                        // ✅ Update local state immediately
                        setFormData((prev) => ({
                          ...prev,
                          feasibility_status: res.data.data.feasibility_status,
                          comments: res.data.data.comments,
                        }));

                        onUpdate?.(res.data.data);

                        setAlert({ type: "success", message: "Feasibility updated!" });
                        setShowModal(false);
                      } catch {
                        setAlert({ type: "error", message: "Update failed" });
                      }
                    }}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                  >
                    Update Feasibility
                  </button>
                </div>
              </>
            )}

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
                  onClick={update2W}
                  className="bg-purple-700 text-white px-5 py-2 rounded text-sm"
                >
                  Save
                </button>
              </div>
            )}
            {/* CLOSE */}
            <button
              onClick={() => { setShowModal(false); setEditMode(false); }}
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

export default TwoWheelerCard;