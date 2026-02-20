import React, { useState, useEffect } from "react";
import axios from "axios";

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
  };
  onUpdate: (updatedData: any) => void;
}


const BusinessCard: React.FC<BusinessCardProps> = ({ data, onUpdate }) => {
  const attachments = Array.isArray(data.attachments) ? data.attachments : [];
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(data);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);




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
          className="border rounded px-2 py-1 text-xs"
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
        className="border rounded px-2 py-1 text-xs"
      />
    );
  };


  const renderCheckbox = (key: keyof typeof formData, label: string) => {
    const checked = !!formData[key];

    return (
      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
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
    return d.toISOString().split("T")[0];
  };


  const renderValue = (value: any) =>
    value === null || value === undefined || value === ""
      ? "-"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : value;

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const mainFields = [
    { label: "Description", key: "description" },
    { label: "Priority", key: "priority" },
    { label: "Applicant", key: "applicant_name" },
    { label: "Contact Person", key: "contact_person" },
    { label: "Requested By", key: "requested_by_person" },
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

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB");
  };
  const canEdit = !data.feasibility_status;


  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-sm relative">
      <h2 className="text-purple-600 font-semibold text-lg mb-2 truncate">BR ID:{data.id}</h2>

      <div className="flex flex-col gap-1">
        {mainFields.map((item) => (
          <div key={item.key} className="flex">
            <span className="w-50 font-normal text-gray-400">{item.label}:</span>
            <span className="font-medium text-gray-700 max-w-[65%] overflow-hidden text-ellipsis whitespace-nowrap">
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
      {message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-md text-white z-50 animate-fade-in ${message.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
        >
          {message.text}
        </div>
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


            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium mb-4">BR-{data.id} Full Info</h2>

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
                    label: "Features",
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
                    label: "Standards",
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
                                  className="text-xs text-blue-600 underline cursor-pointer"
                                >
                                  {fileName}
                                </span>
                              );
                            })}
                          </div>
                        ) : !editMode ? (
                          <span className="text-xs text-gray-500">No files uploaded</span>
                        ) : null}

                        {/* NEW FILE PICKER */}
                        {editMode && (
                          <input
                            type="file"
                            multiple
                            onChange={(e) =>
                              handleChange("attachments", Array.from(e.target.files || []))
                            }
                            className="text-xs"
                          />
                        )}
                      </div>
                    ),
                  }

                ],
              },


              {
                title: "Department Status",
                fields: [
                  {
                    label: "",
                    value: (
                      <div className="grid grid-cols-2 gap-4">
                        {/* BD Status */}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">BD Status</span>
                          {editMode ? (
                            <select
                              value={formData.bd_status}
                              onChange={(e) => handleChange("bd_status", e.target.value)}
                              className="border rounded text-xs px-2 py-1"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="SUBMITTED">SUBMITTED</option>
                              <option value="APPROVED">APPROVED</option>
                            </select>
                          ) : (
                            <span className="text-xs font-semibold">{formData.bd_status}</span>
                          )}
                        </div>

                        {/* BD Comments */}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">BD Comments</span>
                          {editMode ? (
                            <textarea
                              value={formData.bd_comments || ""}
                              onChange={(e) => handleChange("bd_comments", e.target.value)}
                              className="border rounded text-xs px-2 py-1"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {renderValue(formData.bd_comments)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Feasibility Status</span>
                          {editMode ? (
                            <select
                              value={formData.feasibility_status || ""}
                              onChange={(e) =>
                                handleChange("feasibility_status", e.target.value)
                              }
                              className="border rounded text-xs px-2 py-1"
                            >
                              <option value="">Select</option>
                              <option value="PENDING">PENDING</option>
                              <option value="APPROVED">APPROVED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                          ) : (
                            <span className="text-xs font-semibold">
                              {renderValue(formData.feasibility_status)}
                            </span>
                          )}
                        </div>

                        {/* Feasibility Comments */}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Feasibility Comments</span>
                          {editMode ? (
                            <textarea
                              value={formData.feasibility_comments || ""}
                              onChange={(e) =>
                                handleChange("feasibility_comments", e.target.value)
                              }
                              className="border rounded text-xs px-2 py-1"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {renderValue(formData.feasibility_comments)}
                            </span>
                          )}
                        </div>

                      </div>
                    ),
                  },
                ],
              },
              {
                title: "Declaration",
                fields: [
                  {
                    label: "",
                    value: (
                      <div className="grid grid-cols-5 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Declaration Date</span>
                          {editMode ? (
                            <input
                              type="date"
                              value={toDateInputValue(formData.declaration_date)}
                              onChange={(e) =>
                                handleChange("declaration_date", e.target.value)
                              }
                              className="border rounded text-xs px-2 py-1"
                            />

                          ) : (
                            <span className="text-xs font-semibold">
                              {formatDate(formData.declaration_date)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Place</span>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.place || ""}
                              onChange={(e) => handleChange("place", e.target.value)}
                              className="border rounded text-xs px-2 py-1"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {renderValue(formData.place)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Applicant Signature</span>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.applicant_signature || ""}
                              onChange={(e) =>
                                handleChange("applicant_signature", e.target.value)
                              }
                              className="border rounded text-xs px-2 py-1"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {renderValue(formData.applicant_signature)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Requested By</span>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.requested_by_person || ""}
                              onChange={(e) => handleChange("requested_by_person", e.target.value)}
                              className="border rounded text-xs px-2 py-1"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {renderValue(formData.requested_by_person)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-medium">Created At</span>
                          {editMode ? (
                            <input
                              type="date"
                              value={toDateInputValue(formData.created_at)}
                              onChange={(e) => handleChange("created_at", e.target.value)}
                              className="border rounded text-xs px-2 py-1"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {formatDate(formData.created_at)}
                            </span>
                          )}
                        </div>


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
                      <span className="text-gray-600 text-xs font-medium">{f.label}</span>
                      <div className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">
                        {React.isValidElement(f.value) ? f.value : renderValue(f.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {editMode && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setFormData(data); // reset
                    setEditMode(false);
                  }}
                  className="px-4 py-1 border rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
                  onClick={async () => {
                    try {
                      const fd = new FormData();

                      Object.entries(formData).forEach(([key, value]) => {
                        if (key === "attachments") return;
                        if (value !== undefined && value !== null) {
                          fd.append(key, value.toString());
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

                     const token = localStorage.getItem("token"); // or wherever you store it

const res = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/api/business-development/${data.id}`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  }
);


                      if (!res.ok) throw new Error("Update failed");

                      const result = await res.json();

                      onUpdate(result.data);
                      setEditMode(false);
                      setShowModal(false);

                      // ✅ Success message
                      setMessage({ text: "Business details updated successfully!", type: "success" });
                      setTimeout(() => setMessage(null), 3000);
                    } catch (err) {
                      console.error("Save failed", err);
                      // ✅ Error message
                      setMessage({ text: "Failed to update business details.", type: "error" });
                      setTimeout(() => setMessage(null), 3000);
                    }
                  }}


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
