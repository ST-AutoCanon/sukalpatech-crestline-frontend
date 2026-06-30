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
}

const FoodBusinessCard: React.FC<Props> = ({ data, mode, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [feasibilityStatus, setFeasibilityStatus] = useState("");
  const [comments, setComments] = useState("");
  const [alert, setAlert] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...data });

  const [editChanges, setEditChanges] = useState<Partial<typeof formData>>({});

  // When editing any field, track the changes
  const handleEditChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setEditChanges((prev) => ({ ...prev, [key]: value }));
  };

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
      console.log(res.data.data);

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

  type FormKey = keyof typeof formData;

  type Field = {
    label: string;
    key: FormKey;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full sm:w-[340px] m-2 flex flex-col justify-between">

      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {/* HEADER */}
      <h3 className="text-purple-700 font-semibold text-sm mb-3">
        FOOD ID:  {data.id}
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
      <div className="mt-3 flex items-center gap-8">
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
              {editMode
                ? `FOOD-${data.id} Edit Full Info`
                : mode === "update"
                  ? `FOOD-${data.id} Feasibility Update`
                  : `FOOD-${data.id} Full Info`}
            </h2>

            {/* ================= SECTIONS ================= */}
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
                title: "Project Details",
                fields: [
                  { label: "Project Title", key: "project_title" },
                  { label: "Expected Quantity", key: "expected_quantity" },
                  { label: "Estimated Budget", key: "estimated_budget" },
                ],
              },
              {
                title: "Product Details",
                fields: [
                  { label: "Product Category", key: "product_category" },
                  { label: "Product Name", key: "product_name" },
                  { label: "Packaging Type", key: "packaging_type" },
                  { label: "Shelf Life", key: "shelf_life" },
                  { label: "Storage Condition", key: "storage_condition" },
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
                      { label: "Feasibility Comments", key: "comments" },
                    ]
                    : []),

                  ...(mode !== "update"
                    ? [
                      ...(data.final_status || data.final_comment
                        ? [
                          { label: "Final Status", key: "final_status" as keyof typeof formData },
                          { label: "Final Comment", key: "final_comment" as keyof typeof formData },
                        ]
                        : []),
                    ]
                    : []),
                ],
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
                        <input
                          value={formData[field.key] || ""}
                          onChange={(e) => handleEditChange(field.key, e.target.value)}
                          className="border rounded px-3 py-2 text-sm sm:text-base font-medium text-gray-900"
                        />
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