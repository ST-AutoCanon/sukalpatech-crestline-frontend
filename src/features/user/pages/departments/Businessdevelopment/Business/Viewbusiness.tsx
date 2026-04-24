import React, { useState, useEffect } from "react";
import axios from "axios";
import Aleart from "../../../../components/Aleartmessage";
import { Minus, Plus } from "lucide-react";

interface BusinessCardProps {
  data: {
    formatDate?: any;
    created_at: any;
    applicant_signature: any;
    place: any;
    declaration_date: any;
    requested_by_person?: string;
    requested_department?: string;
    required_by?: string;
    priority_level?: string;
    description_request?: string;
    id: number;
    description?: string;
    priority?: string;
    required_date?: string;
    requested_by_department?: string;
    bd_status: string;
    bd_comments: string;
    applicant_name: string;
    contact_person: string;
    mobile_number: string;
    email: string;
    address: string;
    chassis_manufacturer: string;
    chassis_model: string;
    chassis_number: string;
    engine_number: string;
    wheelbase: string;
    fuel_type: string;
    body_type: string;
    seating_capacity: number;
    seat_type: string;
    flooring_type: string;
    interior_color: string;
    body_material: string;
    paint_color: string;
    window_type: string;
    door_type: string;
    ac: boolean;
    cctv: boolean;
    gps: boolean;
    fire_extinguisher: boolean;
    emergency_exit: boolean;
    led_board: boolean;
    usb: boolean;
    luggage_carrier: boolean;
    wheelchair_access: boolean;
    ais_compliant: boolean;
    cmvr_compliant: boolean;
    school_bus_safety: boolean;
    state_transport_norms: boolean;
    expected_delivery: string;
    approximate_budget: number;
    remarks?: string;
    attachments: any[];
    feasibility_status?: string;
    feasibility_comments?: string;
    finalbd_status: string;
    finalbd_comment: string;
  };
  onUpdate: (updatedData: any) => void;
}


const BusinessCard: React.FC<BusinessCardProps> = ({ data, onUpdate }) => {
  const attachments = Array.isArray(data.attachments) ? data.attachments : [];
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(data);
  const [originalData, setOriginalData] = useState(data);




  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const INPUT_CLASS =
    "w-full border border-gray-500 rounded px-1 py-1 text-sm font-semibold bg-white outline-none focus:outline-none focus:ring-0 focus:border-gray-500";


  const STATUS_LABELS: Record<string, string> = {
    "APPROVED": "FEASIBILITY APPROVED",
    "PENDING": "FEASIBILITY PENDING",
    "REJECTED": "FEASIBILITY REJECTED",
  };
  const DROPDOWN_OPTIONS: Record<string, string[]> = {
    priority: ["LOW", "MEDIUM", "HIGH"],
    body_type: ["Mini Bus", "Sleeper", "Tourist", "School Bus", "City Bus", "staff Bus"],
    seat_type: ["Push-back", "Fixed", "Recliner", "Semi-Sleeper", "Sleeper"],
    fuel_type: ["Diesel", "CNG (Compressed Natural Gas)", "LNG (Liquefied Natural Gas)", "Electric", "Hybrid (Diesel/Electric)", "Petrol", "Hydrogen (Fuel Cell)", "Biodiesel"],
    flooring_type: ["Vinyl", "Rubber", "Anti-skid"],
  };



  const handleChange = (key: keyof typeof data, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderEditableField = (
    key: keyof typeof formData,
    type: "text" | "number" | "date" = "text"
  ) => {
    if (!editMode) {
      return renderValue(
        type === "date"
          ? formatDate(formData[key] as any)
          : formData[key]
      );
    }

    // ✅ If field has dropdown options
    if (DROPDOWN_OPTIONS[key as string]) {
      return (
        <select
          value={formData[key] ?? ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className={INPUT_CLASS}
        >
          <option value="">Select</option>
          {DROPDOWN_OPTIONS[key as string].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    // ✅ Normal input
    return (
      <input
        type={type}
        value={
          type === "date"
            ? toDateInputValue(formData[key] as string)
            : formData[key] ?? ""
        }
        onChange={(e) => handleChange(key, e.target.value)}
        className={INPUT_CLASS}
      />
    );
  };


  const renderCheckbox = (key: keyof typeof formData, label: string) => {
    const checked = !!formData[key];


    return (
      <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
        {/* Hidden native checkbox */}
        <input
          type="checkbox"
          checked={checked}
          disabled={!editMode}
          onChange={(e) => handleChange(key, e.target.checked)}
          className="hidden"
        />

        {/* Custom checkbox */}
        <span
          className={`
          w-4 h-4 flex items-center justify-center
          rounded border
          ${checked ? "bg-blue-600" : "border-blue-400"}
        `}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"  // ✅ ONLY TICK BLUE
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>

        {/* Label stays normal */}
        <span className="text-gray-700">{label}</span>
      </label>
    );
  };


  const toDateInputValue = (date: string | null | undefined) => {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "";

    // ✅ Fix timezone shift
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);

    return localDate.toISOString().split("T")[0];
  };

  const renderValue = (value: any, key?: string) => {
    if (value === null || value === undefined || value === "") return "-";

    if (typeof value === "boolean") return value ? "Yes" : "No";

    // Map feasibility_status to label
    if (key === "feasibility_status" && STATUS_LABELS[value]) {
      return STATUS_LABELS[value];
    }

    return value;
  };
  const mainFields = [
    { label: "Description", key: "description" },
    { label: "Priority", key: "priority" },
    { label: "Applicant", key: "applicant_name" },
    { label: "Contact Person", key: "contact_person" },
    { label: "Mobile Number", key: "mobile_number" },
  ];

  const ADDITIONAL_FEATURES = [
    { label: "AC", key: "ac" },
    { label: "CCTV", key: "cctv" },
    { label: "GPS", key: "gps" },
    { label: "Fire Extinguisher", key: "fire_extinguisher" },
    { label: "Emergency Exit", key: "emergency_exit" },
    { label: "LED Board", key: "led_board" },
    { label: "USB", key: "usb" },
    { label: "Luggage Carrier", key: "luggage_carrier" },
    { label: "Wheelchair Access", key: "wheelchair_access" },
  ];

  const COMPLIANCE_STANDARDS = [
    { label: "AIS Compliant", key: "ais_compliant" },
    { label: "CMVR Compliant", key: "cmvr_compliant" },
    { label: "School Bus Safety", key: "school_bus_safety" },
    { label: "State Transport Norms", key: "state_transport_norms" },
  ];

  // const formatDate = (date: string | null | undefined) => {
  //   if (!date) return "-";
  //   const d = new Date(date);
  //   if (isNaN(d.getTime())) return "-";
  //   return d.toLocaleDateString("en-GB");
  // };
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";

    const d = new Date(date);
    const offset = d.getTimezoneOffset();

    return new Date(d.getTime() - offset * 60000)
      .toISOString()
      .split("T")[0];
  };
  const canEdit = !data.feasibility_status;

  const handleSave = async () => {
    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "attachments" || key === "created_at") return;

        if (value !== undefined && value !== null) {
          if (key === "approximate_budget") {
            fd.append(key, String(Math.round(Number(value))));
          } else {
            if (key === "required_date" || key === "expected_delivery" || key === "declaration_date") {
              const localDate = new Date(value);
              const offset = localDate.getTimezoneOffset();
              const correctedDate = new Date(localDate.getTime() - offset * 60000)
                .toISOString()
                .split("T")[0];

              fd.append(key, correctedDate);
            } else {
              fd.append(key, String(value));
            }
          }
        }
      });

      if (formData.attachments) {
        const attachmentsArray = Array.isArray(formData.attachments)
          ? formData.attachments
          : [formData.attachments];

        attachmentsArray.forEach((file: any) => {
          if (file instanceof File) fd.append("attachments", file);
          else fd.append("attachments", JSON.stringify(file));
        });
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/business-development/${data.id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: fd,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Update failed");
      }

      const result = await res.json();

      onUpdate(result.data);
      setOriginalData(result.data);   // ✅ update original
      setFormData(result.data);

      setEditMode(false);
      setShowModal(false);

      setAlert({
        type: "success",
        message: "Business details updated successfully!",
      });

      setTimeout(() => setAlert(null), 3000);

    } catch (err: any) {
      console.error("Update failed", err);

      setAlert({
        type: "error",
        message: err.message || "Failed to update business details",
      });

      setTimeout(() => setAlert(null), 3000);
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    top: true,
    bottom: true,
  });

  const toggleSection = (key: "top" | "bottom") => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasFeasibilityData =
    formData.feasibility_status ||
    formData.feasibility_comments;




  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-sm relative">
      <h2 className="text-purple-600 font-semibold text-lg mb-2 truncate">
        BR ID: {data.display_id || data.id}
      </h2>
      <div className="flex flex-col gap-1">
        {mainFields.map((item) => (
          <div key={item.key} className="flex justify-between items-center">
            <span className="text-gray-400 font-medium shrink-0 w-32 truncate">{item.label}</span>
            <span className="font-medium text-gray-700 text-sm text-right truncate w-2/3">
              {renderValue(data[item.key as keyof typeof data])}
            </span>
          </div>
        ))}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              setShowModal(true);
              setEditMode(false); // read-only
            }}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            More Info
          </button>

          {canEdit && (
            <button
              onClick={() => {
                setOriginalData(data);        // store fresh original
                setFormData({ ...data });     // clone
                setShowModal(true);
                setEditMode(true);
              }}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}

        </div>

      </div>

      {alert && (
        <Aleart
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}



      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div
            className="
        bg-white
        w-full
        h-full
        sm:h-auto
        sm:max-h-[95vh]
        sm:max-w-6xl
        rounded-none
        sm:rounded-2xl
        overflow-y-auto
        p-4 sm:p-8
        relative
        flex flex-col gap-6
      "
          >


            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              {editMode ? `Edit BR-${data.display_id} info` : `View BR-${data.display_id} info`}
            </h2>
            {/* Map all sections */}
            {[
              {
                title: "Request Details",
                fields: [
                  { label: "Description", value: renderEditableField("description") },
                  { label: "Priority", value: renderEditableField("priority") },
                  { label: "Required Date", value: renderEditableField("required_date", "date") }

                ],
              },
              {
                title: "Applicant / Organization Details",
                fields: [
                  { label: "Applicant Name", value: renderEditableField("applicant_name") },
                  { label: "Contact Person", value: renderEditableField("contact_person") },
                  { label: "Mobile Number", value: renderEditableField("mobile_number") },
                  { label: "Email", value: renderEditableField("email") },
                  { label: "Address", value: renderEditableField("address") },
                  { label: "Body Type Required", value: renderEditableField("body_type") },
                ],
              },
              {
                title: "Body / Chassis Details",
                fields: [
                  { label: "Chassis Manufacturer", value: renderEditableField("chassis_manufacturer") },
                  { label: "Chassis Model", value: renderEditableField("chassis_model") },
                  { label: "Chassis Number", value: renderEditableField("chassis_number") },
                  { label: "Engine Number", value: renderEditableField("engine_number") },
                  { label: "Wheelbase", value: renderEditableField("wheelbase") },
                  { label: "Fuel Type", value: renderEditableField("fuel_type") },
                ],
              },
              {
                title: "Seating & Interior Details",
                fields: [
                  { label: "Seating Capacity", value: renderEditableField("seating_capacity") },
                  { label: "Seat Type", value: renderEditableField("seat_type") },
                  { label: "Flooring Type", value: renderEditableField("flooring_type") },
                  { label: "Interior Color", value: renderEditableField("interior_color") },
                ],
              },
              {
                title: "Exterior Specifications",
                fields: [
                  { label: "Body Material", value: renderEditableField("body_material") },
                  { label: "Paint Color / Livery Details", value: renderEditableField("paint_color") },
                  { label: "Window Type", value: renderEditableField("window_type") },
                  { label: "Door Type", value: renderEditableField("door_type") },
                ],
              },
              {
                title: "Additional Features",
                fields: [
                  {

                    value: (
                      <div className="flex flex-wrap gap-3">
                        {ADDITIONAL_FEATURES.map(f =>
                          renderCheckbox(f.key as keyof typeof formData, f.label)
                        )}
                      </div>
                    )

                  },
                ],
              },
              {
                title: "Compliance & Standards",
                fields: [
                  {
                    value: (
                      <div className="flex flex-wrap gap-3">
                        {COMPLIANCE_STANDARDS.map(f =>
                          renderCheckbox(f.key as keyof typeof formData, f.label)
                        )}
                      </div>
                    ),
                  },
                ],
              },

              {
                title: "Timeline & Budget",
                fields: [
                  {
                    label: "Expected Delivery",
                    value: renderEditableField("expected_delivery", "date"),
                  },
                  {
                    label: "Approximate Budget",
                    value: renderEditableField("approximate_budget", "number"),
                  },
                ],
              },

              {
                title: "Attachments",
                fields: [
                  {
                    label: "Attachments",
                    value: (
                      <div className="flex flex-col gap-2">
                        {/* OLD FILES */}
                        {Array.isArray(formData.attachments) && formData.attachments.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {formData.attachments.map((file: any, idx: number) => {
                              const fileName =
                                typeof file === "string"
                                  ? file.split("/").pop()
                                  : file.originalname || file.filename || file.name || "Attachment";

                              return (
                                <span
                                  key={idx}
                                  className="text-sm text-blue-600 underline cursor-pointer"
                                  onClick={() => {
                                    if (!file) return;

                                    let url = "";

                                    // ✅ NEW FILE (File object)
                                    if (file instanceof File) {
                                      url = URL.createObjectURL(file);
                                    }

                                    // ✅ If backend file path exists
                                    else if (file.file_path) {
                                      url = `${import.meta.env.VITE_BACKEND_URL}${file.file_path}`;
                                    }

                                    // ✅ fallback (OLD DATA)
                                    else if (file.filename) {
                                      url = `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${file.filename}`;
                                    }

                                    if (!url) {
                                      console.error("Invalid file URL", file);
                                      return;
                                    }

                                    window.open(url, "_blank");
                                  }}
                                >
                                  {fileName}
                                </span>
                              );
                            })}
                          </div>
                        ) : !editMode ? (
                          <span className="text-sm text-gray-500">No files uploaded</span>
                        ) : null}

                        {/* NEW FILE PICKER */}
                        {editMode && (
                          <input
                            type="file"
                            multiple
                            onChange={(e) =>
                              handleChange("attachments", Array.from(e.target.files || []))
                            }
                            className={INPUT_CLASS}
                          />
                        )}
                      </div>
                    ),
                  }

                ],
              },
              {
                title: "Declaration",
                fields: [
                  { label: "Declaration Date", value: renderEditableField("declaration_date", "date") },
                  { label: "Place", value: renderEditableField("place") },
                  { label: "Applicant Signature", value: renderEditableField("applicant_signature") },
                  { label: "Requested By", value: renderEditableField("requested_by_person") },
                  { label: "Created At", value: formatDate(data.created_at) }
                ],
              },
              {
                title: "Department Status",
                fields: [
                  {
                    label: "",
                    value: (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* BD Status */}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">BD Status</span>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.bd_status || ""}
                              onChange={(e) => handleChange("bd_status", e.target.value)}
                              className={INPUT_CLASS}
                            />
                          ) : (
                            <div className="bg-white border rounded px-2 py-1 text-sm font-semibold text-black">
                              {renderValue(formData.bd_status)}
                            </div>
                          )}
                        </div>

                        {/* BD Comments */}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">BD Comments</span>
                          {editMode ? (
                            <textarea
                              value={formData.bd_comments || ""}
                              onChange={(e) => handleChange("bd_comments", e.target.value)}
                              className={INPUT_CLASS}
                              rows={1} // adjust height
                            />
                          ) : (
                            <div className="bg-white border rounded px-2 py-1 text-sm font-semibold text-black">
                              {renderValue(formData.bd_comments)}
                            </div>
                          )}
                        </div>

                        {/* ❌ Hide in edit mode */}
                        {!editMode && hasFeasibilityData && (
                          <>
                            {/* Feasibility Status */}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Feasibility Status</span>
                              <div className="bg-white border rounded px-2 py-1 text-sm font-semibold text-black">
                                {renderValue(formData.feasibility_status, "feasibility_status")}
                              </div>
                            </div>

                            {/* Feasibility Comments */}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Feasibility Comments</span>
                              <div className="bg-white border rounded px-2 py-1 text-sm font-semibold text-black">
                                {renderValue(formData.feasibility_comments)}
                              </div>
                            </div>
                          </>
                        )}

                      </div>
                    ),
                  },
                ],
              },

            ].map(section => (
              <div key={section.title} className="bg-gray-100
    rounded-xl
    p-4 sm:p-5
    shadow
    flex flex-col
    gap-3
  ">
                <h3 className="text-gray-900 text-sm font-semibold  pb-1">{section.title}</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
                  {section.fields.map(f => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-gray-600 text-sm font-medium">{f.label}</span>
                      {React.isValidElement(f.value) ? (
                        f.value
                      ) : (
                        <div className="bg-white border rounded px-2 py-1 text-sm font-semibold text-black">
                          {renderValue(f.value)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {editMode && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setFormData({ ...originalData }); // restore original data
                    setEditMode(false);               // exit edit mode
                    setShowModal(false);              // ✅ CLOSE MODAL
                  }}
                  className="px-4 py-1 border rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
                  onClick={handleSave}
                >
                  Save
                </button>

              </div>
            )}


            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusinessCard; 