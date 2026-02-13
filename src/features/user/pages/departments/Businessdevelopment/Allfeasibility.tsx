import React, { useState } from "react";
import { api } from "../../../api/businessApi";

interface FeasibilityCardProps {
  data: any;
  mode: "all" | "update" | "bd-update";
  onUpdate: (updated: any) => void;
}


const FeasibilityCard: React.FC<FeasibilityCardProps> = ({
  data,
  mode,
  onUpdate,
}) => {
  if (!data) return null;

  const [showModal, setShowModal] = useState(false);

  // Feasibility states
  const [feasibility_status, setFeasibilityStatus] = useState(
    data.feasibility_status ?? ""
  );
  const [feasibility_comments, setFeasibilityComments] = useState(
    data.feasibility_comments ?? ""
  );
  const [finalStatus, setfinalStatus] = useState("");
  const [finalComments, setfinalComments] = useState("");

  const renderValue = (value: any) =>
    value === null || value === undefined || value === ""
      ? "-"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : value;

  const mainFields = [
    { label: "BD Status", key: "bd_status" },
    { label: "BD Comments", key: "bd_comments" },
    { label: "Applicant", key: "applicant_name" },
    { label: "Contact Person", key: "contact_person" },
    { label: "Mobile Number", key: "mobile_number" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
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

  // Handle Feasibility update
  const handleFeasibilityUpdate = async () => {
    try {
      const res = await api.patch(
        `/business-development/feasibility/${data.id}/review`,
        {
          feasibility_status,
          feasibility_comments,
        }
      );
      onUpdate(res.data);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update feasibility", err);
      alert("Failed to update feasibility");
    }
  };

  // Handle BD team update
  const handleBdUpdate = async () => {
    try {
      const res = await api.patch(
        `/business-development/${data.id}/bd-update`,
        {
          bd_status: finalStatus,
          bd_comments: finalComments,
        }
      );
      onUpdate(res.data);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update BD info", err);
      alert("Failed to update BD info");
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-xs">
      <h2 className="text-purple-700 font-bold text-sm sm:text-base mb-2">
      BR-{data.id}
      </h2>

      <div className="flex flex-col gap-1">
        {mainFields.map((item) => (
          <div key={item.key} className="flex gap-2 item-center">
            <span className="w-32 text-gray-400">{item.label}:</span>
            <span className="font-medium text-black">
              {renderValue(data[item.key as keyof typeof data])}
            </span>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="mt-2 text-blue-600 underline self-start text-xs"
        >
          {mode === "all" ? "More Info" : "Update"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2 sm:p-4">
          <div
            className="bg-white  w-full
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
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium mb-4">
              BR-{data.id} Full Info
            </h2>

            {/* Existing sections */}
            {[
              {
                title: "Request Details",
                fields: [
                  {
                    label: "Description",
                    value:
                      data.description || data.description_request || "-",
                  },
                  { label: "Priority", value: data.priority || data.priority_level || "-" },
                  {
                    label: "Required Date",
                    value: formatDate(data.required_date || data.required_by),
                  },
                 
                ],
              },
              {
                title: "Applicant / Organization Details",
                fields: [
                  { label: "Applicant Name", value: data.applicant_name },
                  { label: "Contact Person", value: data.contact_person },
                  { label: "Mobile Number", value: data.mobile_number },
                  { label: "Email", value: data.email },
                  { label: "Address", value: data.address },
                  { label: "Body Type Required", value: data.body_type },
                ],
              },
              {
                title: "Body / Chassis Details",
                fields: [
                  { label: "Chassis Manufacturer", value: data.chassis_manufacturer },
                  { label: "Chassis Model", value: data.chassis_model },
                  { label: "Chassis Number", value: data.chassis_number },
                  { label: "Engine Number", value: data.engine_number },
                  { label: "Wheelbase", value: data.wheelbase },
                  { label: "Fuel Type", value: data.fuel_type },
                ],
              },
              {
                title: "Seating & Interior Details",
                fields: [
                  { label: "Seating Capacity", value: data.seating_capacity },
                  { label: "Seat Type", value: data.seat_type },
                  { label: "Flooring Type", value: data.flooring_type },
                  { label: "Interior Color", value: data.interior_color },
                ],
              },
              {
                title: "Exterior Specifications",
                fields: [
                  { label: "Body Material", value: data.body_material },
                  { label: "Paint Color", value: data.paint_color },
                  { label: "Window Type", value: data.window_type },
                  { label: "Door Type", value: data.door_type },
                ],
              },
              {
                title: "Additional Features",
                fields: [
                  {
                    label: "Features",
                    value: (
                      <div className="flex flex-wrap gap-2">
                        {ADDITIONAL_FEATURES.filter((f) => data[f.key]).map((f) => (
                          <span key={f.key} className="text-black text-xs font-semibold">
                            {f.label}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                ],
              },
              {
                title: "Compliance & Standards",
                fields: [
                  {
                    label: "Standards",
                    value: (
                      <div className="flex flex-wrap gap-2">
                        {COMPLIANCE_STANDARDS.filter((f) => data[f.key]).map((f) => (
                          <span key={f.key} className="text-black text-xs font-semibold">
                            {f.label}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                ],
              },
              {
                title: "Timeline & Budget",
                fields: [
                  { label: "Expected Delivery", value: formatDate(data.expected_delivery) },
                  { label: "Approximate Budget", value: data.approximate_budget },
                ],
              },
              {
                title: "Department Status",
                fields: [
                  {
                    label: "",
                    value: (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* BD Status */}
                        <div>
                          <span className="text-gray-600 text-xs">BD Status</span>
                          <div className="font-semibold text-black">
                            {renderValue(data.bd_status)}
                          </div>
                        </div>

                        {/* BD Comments */}
                        <div>
                          <span className="text-gray-600 text-xs">BD Comments</span>
                          <div className="font-semibold text-black">
                            {renderValue(data.bd_comments)}
                          </div>
                        </div>

                        {/* Feasibility Status */}
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 text-xs">Feasibility Status</span>
                          {mode === "update" ? (
                            <select
                              value={feasibility_status}
                              onChange={(e) => setFeasibilityStatus(e.target.value)}
                              className="w-full h-[38px] p-2 border rounded text-xs"
                            >
                              <option value="">Select</option>
                              <option value="APPROVED">FEASIBILITY APPROVED</option>
                              <option value="PENDING">FEASIBILITY PENDING</option>
                              <option value="REJECTED">FEASIBILITY REJECTED</option>
                            </select>
                          ) : (
                            <div className="h-[38px] flex items-center font-semibold text-black">
                              {renderValue(data.feasibility_status)}
                            </div>
                          )}
                        </div>

                        {/* Feasibility Comments */}
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 text-xs">Feasibility Comments</span>
                          {mode === "update" ? (
                            <textarea
                              value={feasibility_comments}
                              onChange={(e) => setFeasibilityComments(e.target.value)}
                              className="w-full h-[38px] p-2 border rounded text-xs resize-none"
                            />
                          ) : (
                            <div className="h-[38px] flex items-center font-semibold text-black truncate">
                              {renderValue(data.feasibility_comments)}
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  },
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="bg-gray-100
    rounded-xl
    p-4 sm:p-5
    shadow
    flex flex-col
    gap-3
  "
              >
                <h3 className="text-gray-900 text-sm font-semibold  pb-1">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                  {section.fields.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-gray-600 text-xs font-medium">{f.label}</span>
                      <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">
                        {React.isValidElement(f.value) ? f.value : renderValue(f.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {mode === "bd-update" && (
              <>
                {/* GRAY BOX: ONLY STATUS & COMMENTS */}
                <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow mt-4">
                  <h3 className="text-black text-sm font-bold mb-3">
                    BD Team Update
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* BD Status */}
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs">BD Status</span>
                      <select
                        value={finalStatus}
                        onChange={(e) => setfinalStatus(e.target.value)}
                        className="w-full h-[38px] p-2 border rounded text-xs"
                      >
                        <option value="">Select</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>

                    {/* BD Comments */}
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs">BD Comments</span>
                      <textarea
                        value={finalComments}
                        onChange={(e) => setfinalComments(e.target.value)}
                        placeholder="Enter comments"
                        className="w-full h-[38px] p-2 border rounded text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* BUTTON: OUTSIDE GRAY BOX, RIGHT END */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleFeasibilityUpdate}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm sm:text-base"
                  >
                    Update Business Development
                  </button>
                </div>
              </>
            )}



            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700  text-xl sm:text-2xl"
            >
              ×
            </button>

            {/* Feasibility Update Button */}
            {mode === "update" && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleFeasibilityUpdate}
                  className="bg-purple-700 text-white px-4 py-2 rounded text-sm sm:text-base"
                >
                  Update Feasibility
                </button>
              </div>

            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeasibilityCard;
