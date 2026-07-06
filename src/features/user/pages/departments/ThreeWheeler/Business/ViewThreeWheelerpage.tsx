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
   allowEdit?: boolean;
}

const ThreeWheelerCard: React.FC<Props> = ({ data, mode, onUpdate,allowEdit=true }) => {
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
    console.log("3W Data:", data);
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

  type FormKey = keyof typeof formData;

  type Field = {
    label: string;
    key: FormKey;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full  flex flex-col justify-between">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h3 className="text-purple-700 font-semibold text-sm mb-3">3W ID: {data.id}</h3>

      <div className="space-y-2 flex-1">
        {cardFields.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-500">{label}:</span>
            <span className="text-gray-900 font-medium truncate">{render(value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex  items-center gap-8">
        <button
          onClick={() => {
            setEditMode(false);
            setShowModal(true);
          }}
          className="text-blue-600 font-semibold text-sm"
        >
          {mode === "update" ? "Update Feasibility" : "More Info"}
        </button>

       {allowEdit &&
  mode !== "update" &&
  !formData.feasibility_status && (
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
              {editMode
                ? `3W-${data.id} Edit Full Info`
                : mode === "update"
                  ? `3W-${data.id} Feasibility Update`
                  : `3W-${data.id} Full Info`}
            </h2>
            { }
            {[
              {
                title: "Company Details",
                fields: [
                  { label: "Company Name", key: "company_name" },
                  { label: "Contact Person", key: "contact_person" },
                  { label: "Phone", key: "phone" },
                  { label: "Email", key: "email" },
                ] as Field[],
              },
              {
                title: "Project Details",
                fields: [
                  { label: "Project Title", key: "project_title" },
                  { label: "Expected Quantity", key: "expected_quantity" },
                  { label: "Estimated Budget", key: "estimated_budget" },
                ] as Field[],
              },
              {
                title: "Vehicle Details",
                fields: [
                  { label: "Vehicle Model", key: "vehicle_model" },
                  { label: "Engine Capacity", key: "engine_capacity" },
                  { label: "Fuel Type", key: "fuel_type" },
                  { label: "Load Capacity", key: "load_capacity" },
                ] as Field[],
              },
              {
                title: "Current Status",
                fields: [
                  { label: "Business Status", key: "business_status" },
                  { label: "Comment", key: "comment" },

                  ...(formData.feasibility_status || formData.comments
                    ? [
                      {
                        label: "Feasibility Status",
                        key: "feasibility_status" as FormKey,
                      },
                      {
                        label: "Feasibility Comments",
                        key: "comments" as FormKey,
                      },
                    ]
                    : []),

                  ...(mode !== "update" &&
                    (formData.final_status || formData.final_comment)
                    ? [
                      {
                        label: "Final Status",
                        key: "final_status" as FormKey,
                      },
                      {
                        label: "Final Comment",
                        key: "final_comment" as FormKey,
                      },
                    ]
                    : []),
                ] as Field[],
              },
            ].map((section) => (
              <div key={section.title} className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.fields.map((field: Field) => (
                    <div key={field.label} className="flex flex-col">
                      <span className="text-gray-600 text-xs font-medium">
                        {field.label}
                      </span>

                       {editMode ? (
                        field.key === "business_status" ? (
                          <select
                            value={formData.business_status || ""}
                            onChange={(e) =>
                              handleEditChange("business_status", e.target.value)
                            }
                            className="border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        ) : (
                          <input
                            value={formData[field.key] || ""}
                            onChange={(e) => handleEditChange(field.key, e.target.value)}
                            className="border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900"
                          />
                        )
                      ) : (
                        <span className="bg-white border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900">
                          {render(formData[field.key])}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ================= FEASIBILITY UPDATE ================= */}
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
                      className="border p-2 rounded text-sm text-gray-900 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.patch(`/business-development/3w/review`, {
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