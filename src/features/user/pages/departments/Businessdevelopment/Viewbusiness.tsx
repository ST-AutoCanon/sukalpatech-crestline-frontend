import React, { useState } from "react";

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
}

const BusinessCard: React.FC<BusinessCardProps> = ({ data }) => {
  const attachments = Array.isArray(data.attachments) ? data.attachments : [];
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleChange = (key: keyof typeof data, value: any) => {
    setFormData({ ...formData, [key]: value });
  };



  const renderValue = (value: any) =>
    value === null || value === undefined || value === ""
      ? "-"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : value;

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

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB");
  };

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


        </div>

      </div>

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
                  { label: "Description", value: data.description || data.description_request || "-" },
                  { label: "Priority", value: data.priority || data.priority_level || "-" },
                  { label: "Required Date", value: formatDate(data.required_date || data.required_by) },
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
                  { label: "Paint Color / Livery Details", value: data.paint_color },
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
                      <div className="flex flex-wrap gap-3">
                        {ADDITIONAL_FEATURES.filter(f => data[f.key as keyof typeof data]).map(f => (
                          <span key={f.key} className="text-black text-xs font-semibold">{f.label}</span>
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
                      <div className="flex flex-wrap gap-3">
                        {COMPLIANCE_STANDARDS.filter(f => data[f.key as keyof typeof data]).map(f => (
                          <span key={f.key} className="text-black text-xs font-semibold">{f.label}</span>
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
                title: "Attachments",
                fields: [
                  {
                    label: "Attachments",
                    value: Array.isArray(data.attachments) && data.attachments.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {data.attachments.map((file: any, idx: number) => {
                          const fileName = typeof file === "string" ? file : file.originalname || file.filename;
                          const filePath = typeof file === "string" ? file : file.path || `uploads/${file.filename}`;
                          return (
                            <a key={idx} href={`http://localhost:5000/${filePath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                              {fileName}
                            </a>
                          );
                        })}
                      </div>
                    ) : "-",
                  },
                ],
              },
              {
                title: "Department Status",
                fields: [
                  {
                    label: "",
                    value: (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">BD Status</span>
                          <span className="font-semibold text-xs text-black">{renderValue(data.bd_status)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">BD Comments</span>
                          <span className="font-semibold text-xs text-black">{renderValue(data.bd_comments)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">Feasibility Status</span>
                          <span className="font-semibold text-xs text-black">{renderValue(data.feasibility_status)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">Feasibility Comments</span>
                          <span className="font-semibold text-xs text-black">{renderValue(data.feasibility_comments)}</span>
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
                      <div className="flex justify-between gap-6">
                        <div className="flex flex-col gap-2">
                          <div>
                            <span className="text-gray-600 text-xs font-medium">Declaration Date</span>
                            <div className="font-semibold text-xs text-black">{renderValue(formatDate(data.declaration_date))}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 text-xs font-medium">Place</span>
                            <div className="font-semibold text-xs text-black">{renderValue(data.place)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 text-xs font-medium">Applicant Signature</span>
                            <div className="font-semibold text-xs text-black">{renderValue(data.applicant_signature)}</div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 text-right">
                          <div className="font-semibold text-xs text-black">{renderValue(data.requested_by_person)}</div>
                          <div className="font-semibold text-xs text-black">{formatDate(data.created_at)}</div>
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
                      <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">{React.isValidElement(f.value) ? f.value : renderValue(f.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

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
