import React, { useState } from "react";
import { api } from "../../../api/businessApi";

interface FeasibilityCardProps {
  data: any;
  mode: "all" | "update";
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

  // BD Team states
  const [bdStatus, setBdStatus] = useState(data.bd_status ?? "");
  const [bdComments, setBdComments] = useState(data.bd_comments ?? "");

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
        `/business-development/bd/${data.id}/update`,
        {
          bd_status: bdStatus,
          bd_comments: bdComments,
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
        PR-{data.id}
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
            className="bg-purple-700 relative rounded-2xl p-4 sm:p-8 
                       w-full sm:max-w-[60%] max-h-[95vh] overflow-y-auto 
                       flex flex-col gap-6 overscroll-contain"
          >
            <h2 className="text-white text-lg sm:text-2xl font-medium mb-4">
              PR-{data.id} Full Info
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
                  {
                    label: "Requested By – Department",
                    value:
                      data.requested_by_department || data.requested_department || "-",
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
                        <div>
                          <span className="text-gray-600">BD Status</span>
                          <div className="font-semibold text-black">
                            {renderValue(data.bd_status)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">BD Comments</span>
                          <div className="font-semibold text-black">
                            {renderValue(data.bd_comments)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Feasibility Status</span>
                          {mode === "update" ? (
                            <select
                              value={feasibility_status}
                              onChange={(e) => setFeasibilityStatus(e.target.value)}
                              className="w-full p-2 border rounded text-xs"
                            >
                              <option value="">Select</option>
                              <option value="APPROVED">FEASIBILITY APPROVED</option>
                              <option value="PENDING">FEASIBILITY PENDING</option>
                              <option value="REJECTED">FEASIBILITY REJECTED</option>
                            </select>
                          ) : (
                            <div className="font-semibold text-black">
                              {renderValue(data.feasibility_status)}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">Feasibility Comments</span>
                          {mode === "update" ? (
                            <textarea
                              rows={3}
                              value={feasibility_comments}
                              onChange={(e) => setFeasibilityComments(e.target.value)}
                              className="w-full p-2 border rounded text-xs resize-none"
                            />
                          ) : (
                            <div className="font-semibold text-black whitespace-pre-wrap">
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
                className="bg-white rounded-xl p-4 sm:p-6 shadow flex flex-col gap-3"
              >
                <h3 className="text-black text-xs sm:text-sm font-bold border-b-2 border-orange-500 pb-1 w-full sm:w-64">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                  {section.fields.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-gray-800 text-xs">{f.label}</span>
                      <span className="text-black font-semibold text-xs whitespace-pre-wrap">
                        {React.isValidElement(f.value) ? f.value : renderValue(f.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* --- BD Team Update Section --- */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow flex flex-col gap-3 mt-4">
              <h3 className="text-black text-sm font-bold border-b-2 border-purple-500 pb-1 w-full sm:w-64">
                BD Team Update
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="w-32 text-gray-600">BD Status:</span>
                  <select
                    value={bdStatus}
                    onChange={(e) => setBdStatus(e.target.value)}
                    className="w-full sm:w-auto p-2 border rounded text-xs"
                  >
                    <option value="">Select</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-gray-600">BD Comments:</span>
                  <textarea
                    rows={3}
                    value={bdComments}
                    onChange={(e) => setBdComments(e.target.value)}
                    className="w-full p-2 border rounded text-xs resize-none"
                  />
                </div>

                <button
                  onClick={handleBdUpdate}
                  className="w-full sm:w-auto bg-purple-700 text-white px-4 py-2 rounded text-sm sm:text-lg"
                >
                  Update BD Info
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-xl sm:text-2xl"
            >
              ×
            </button>

            {/* Feasibility Update Button */}
            {mode === "update" && (
              <button
                onClick={handleFeasibilityUpdate}
                className="w-full sm:w-auto bg-purple-700 text-white px-4 py-2 rounded text-sm sm:text-lg mt-2"
              >
                Update Feasibility
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeasibilityCard;
