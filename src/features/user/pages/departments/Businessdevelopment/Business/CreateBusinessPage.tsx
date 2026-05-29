import { useEffect, useState, useRef, memo } from "react";
import { api } from "../../../../api/businessApi";
import axios from "axios";
import Alert from "../../../../components/Aleartmessage";
import { Upload } from "lucide-react";

interface Request {
  id: number;
  description: string;
  priority: string;
  required_date: string;
  requested_by_department: string;
  requested_by_person: string;
}


export const Section = memo(
  ({
    title,
    sectionKey,
    expanded,
    toggle,
    children,
  }: {
    title: string;
    sectionKey: string;
    expanded: boolean;
    toggle: (key: string) => void;
    children: React.ReactNode;
  }) => (
    <section className="bg-gray-100 rounded-xl shadow-md mb-6">
      <div
        className="flex justify-between items-center px-4 py-3 cursor-pointer"
        onClick={() => toggle(sectionKey)}
      >
        <h3 className="text-sm sm:text-base font-bold text-gray-800">
          {title}
        </h3>
        <span className="text-xl font-bold">
          {expanded ? "−" : "+"}
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-5 pt-2 sm:px-6 space-y-4">
          {children}
        </div>
      )}
    </section>
  )
);
const initialForm = {
  bd_status: "CREATED",
  bd_comments: "Initial Review",
  description: "",
  priority: "",
  required_date: "",
  requested_by_department: "",
  requested_by_person: "",
  applicant_name: "",
  contact_person: "",
  mobile_number: "",
  email: "",
  address: "",
  chassis_manufacturer: "",
  chassis_model: "",
  chassis_number: "",
  engine_number: "",
  wheelbase: "",
  fuel_type: "",
  body_type: "",
  seating_capacity: "",
  seat_type: "",
  flooring_type: "",
  interior_color: "",
  body_material: "",
  paint_color: "",
  window_type: "",
  door_type: "",
  ac: false,
  cctv: false,
  gps: false,
  fire_extinguisher: false,
  emergency_exit: false,
  led_board: false,
  usb: false,
  luggage_carrier: false,
  wheelchair_access: false,
  ais_compliant: false,
  cmvr_compliant: false,
  school_bus_safety: false,
  state_transport_norms: false,
  expected_delivery: "",
  approximate_budget: "",
  remarks: "",
  attachments: [],
  declaration_date: "",
  place: "",
  applicant_signature: "",
};




const TestBusinessDev = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void; }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState<any>({ ...initialForm });
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);


  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };


  const API_BASE2 = `${import.meta.env.VITE_BACKEND_URL}/api/departments`;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE2}`);
        console.log(res.data.data);
        setDepartments(res.data.data);
      } catch (err) {
        console.error("Department fetch error", err);
      }
    };

    fetchDepartments();
  }, []);


  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await api.get("/bd");
    setRequests(res.data.data);
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const scrollTop = scrollRef.current?.scrollTop;

    const { name, value, type, checked } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    requestAnimationFrame(() => {
      if (scrollRef.current && scrollTop !== undefined) {
        scrollRef.current.scrollTop = scrollTop;
      }
    });
  };
  const validateForm = () => {
    const requiredFields = [
      { key: "description", label: "Description" },
      { key: "priority", label: "Priority" },
      { key: "required_date", label: "Required Date" },
      { key: "requested_by_person", label: "Requested By Person" },
      { key: "applicant_name", label: "Applicant Name" },
    ];

    const filledFields = requiredFields.filter(
      (f) => form[f.key] && form[f.key].toString().trim() !== ""
    );

    const missingFields = requiredFields.filter(
      (f) => !form[f.key] || form[f.key].toString().trim() === ""
    );

    // ❌ Nothing filled
    if (filledFields.length === 0) {
      return "Please fill all required fields";
    }

    // ⚠️ Some missing
    if (missingFields.length > 0) {
      return `Missing: ${missingFields.map((f) => f.label).join(", ")}`;
    }

    // ✅ All good
    return null;
  };


  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   Object.keys(form).forEach((key) => {
  //     if (key === "attachments") {
  //       form.attachments.forEach((file: File) => {
  //         formData.append("attachments", file);
  //       });
  //     } else {
  //       formData.append(key, form[key]);
  //     }
  //   });

  //   await api.post("/business-development", formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });

  //   alert("Request Created Successfully");
  //   fetchRequests();
  // };

  useEffect(() => {
    setExpandedSections({
      businessRequest: true,
    });
  }, []);



  const handleSubmit = async (e: any, bdId?: number) => {
    e.preventDefault();

    const errorMessage = validateForm();

    if (errorMessage) {
      setAlert({
        type: "error",
        message: errorMessage,
      });
      return; // 🚫 stop API call
    }
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (change if needed)

    const invalidFile = form.attachments.find(
      (file: File) => file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setAlert({
        type: "error",
        message: `File "${invalidFile.name}" is too large. Max allowed size is 10MB.`,
      });
      return;
    }


    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "attachments") {
        form.attachments.forEach((file: File) => {
          formData.append("attachments", file);
        });
      } else {
        formData.append(key, form[key]);
      }
    });

    try {
      if (bdId) {
        await api.patch(
          `/business-development/${bdId}/submit`,
          formData
        );

        setAlert({
          type: "success",
          message: "BD info updated successfully!",
        });
      } else {
        await api.post("/business-development", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setAlert({
          type: "success",
          message: "Request created successfully!",
        });
      }

      setForm({ ...initialForm });
      fetchRequests();

      // ✅ Delay closing so alert is visible
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500); // adjust time if needed

    } catch (err: any) {
      console.error("Failed to submit BD info", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      setAlert({
        type: "error",
        message: backendMessage || "Failed to submit BD info",
      });
    }
  };
  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };


  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/30 p-2 sm:p-4">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className=" w-full
  sm:max-w-7xl
  bg-white
  text-gray-900
  rounded-none sm:rounded-xl
  flex flex-col
  max-h-screen sm:max-h-[95vh]
">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-purple-600">
            New Bus Body Request
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-600"
          >
            ×
          </button>
        </div>
        <div
          ref={scrollRef}
          className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-6"
        >


          <form>

            {/* Business Request Details */}
            <Section
              title="Business Request Details"
              sectionKey="businessRequest" expanded={expandedSections.businessRequest}
              toggle={toggleSection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Description <span className="text-red-500">*</span></label>
                  <input
                    name="description"
                    placeholder="Enter Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Priority<span className="text-red-500">*</span></label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                  >
                    <option value="">Select Priority</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Required Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="required_date"
                    value={form.required_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]} // today
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Requested By Person<span className="text-red-500">*</span></label>
                  <input
                    name="requested_by_person"
                    placeholder="Enter Person name"
                    value={form.requested_by_person}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                  />
                </div>
              </div>
            </Section>

            {/* Applicant / Organization Details */}
            <Section title="Applicant / Organization Details" sectionKey="applicant" expanded={expandedSections.applicant}
              toggle={toggleSection}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Applicant Name <span className="text-red-500">*</span></label>
                  <input name="applicant_name" placeholder="Enter Applicant name" value={form.applicant_name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Contact Person</label>
                  <input name="contact_person" placeholder="Enter Contact person" value={form.contact_person} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                  <input name="email" placeholder="Enter Email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={form.mobile_number || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers
                      if (value.length <= 10) {
                        handleChange({
                          target: { name: "mobile_number", value },
                        });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Address</label>
                  <input name="address" placeholder="Enter Address" value={form.address} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                </div>
              </div>
            </Section>

            {/* Chassis / Body Details */}
            <Section
              title="Body / Chassis Details"
              sectionKey="chassis"
              expanded={expandedSections.chassis}
              toggle={toggleSection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "chassis_manufacturer",
                  "chassis_model",
                  "chassis_number",
                  "engine_number",
                  "wheelbase",
                  "fuel_type",
                ].map((f) => (
                  <div key={f}>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">
                      {formatLabel(f)}
                    </label>

                    {f === "fuel_type" ? (
                      <select
                        name={f}
                        value={form[f] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG (Compressed Natural Gas)</option>
                        <option value="LNG">LNG (Liquefied Natural Gas)</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid (Diesel/Electric)</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Hydrogen">Hydrogen (Fuel Cell)</option>
                        <option value="Biodiesel">Biodiesel</option>
                      </select>
                    ) : (
                      <input
                        name={f}
                        value={form[f] || ""}
                        placeholder={`Enter ${formatLabel(f)}`}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                      />
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Seating & Interior */}
            <Section
              title="Seating & Interior"
              sectionKey="seating"
              expanded={expandedSections.seating}
              toggle={toggleSection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "seating_capacity",
                  "seat_type",
                  "flooring_type",
                  "interior_color",
                ].map((f) => (
                  <div key={f}>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">
                      {formatLabel(f)}
                    </label>
                    {/* SEAT TYPE */}
                    {f === "seat_type" && (
                      <select
                        name={f}
                        value={form[f] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                      >
                        <option value="">Select Seat Type</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Push-back">Push-back</option>
                        <option value="Recliner">Recliner</option>
                        <option value="Semi-Sleeper">Semi-Sleeper</option>
                        <option value="Sleeper">Sleeper</option>
                      </select>
                    )}

                    {/* FLOORING TYPE */}
                    {f === "flooring_type" && (
                      <select
                        name={f}
                        value={form[f] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                      >
                        <option value="">Select Flooring Type</option>
                        <option value="Anti-skid">Anti-skid</option>
                        <option value="Vinyl">Vinyl</option>
                        <option value="Rubber">Rubber</option>
                      </select>
                    )}

                    {/* DEFAULT INPUT */}
                    {f !== "seat_type" && f !== "flooring_type" && (
                      <input
                        name={f}
                        value={form[f] || ""}
                        placeholder={`Enter ${formatLabel(f)}`}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                      />
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Exterior */}
            <Section title="Exterior Specifications" sectionKey="exterior" expanded={expandedSections.exterior}
              toggle={toggleSection}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {["body_material", "paint_color", "window_type", "door_type"].map((f) => (
                  <div key={f} className="flex flex-col">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">
                      {formatLabel(f)}
                    </label>
                    <input
                      name={f}
                      value={form[f] || ""}
                      placeholder={`Enter ${formatLabel(f)}`}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Body Type */}
            <Section title="Body Type Required" sectionKey="bodyType" expanded={expandedSections.bodyType}
              toggle={toggleSection}>
              <select name="body_type" value={form.body_type} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base">
                <option value="">Select Body Type</option>
                <option value="City Bus">City Bus</option>
                <option value="School Bus">School Bus</option>
                <option value="Staff Bus">Staff Bus</option>
                <option value="Tourist">Tourist</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Mini Bus">Mini Bus</option>
              </select>
            </Section>

            {/* Additional Features */}
            <Section
              title="Additional Features"
              sectionKey="features"
              expanded={expandedSections.features}
              toggle={toggleSection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "ac",
                  "cctv",
                  "gps",
                  "fire_extinguisher",
                  "emergency_exit",
                  "led_board",
                  "usb",
                  "luggage_carrier",
                  "wheelchair_access",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1 block"
                  >
                    <input
                      type="checkbox"
                      name={f}
                      checked={!!form[f]}
                      onChange={handleChange}
                      className="w-5 h-5 cursor-pointer accent-blue-600"
                    />
                    {formatLabel(f)}
                  </div>
                ))}
              </div>
            </Section>

            {/* Compliance */}
            <Section
              title="Compliance & Standards"
              sectionKey="compliance"
              expanded={expandedSections.compliance}
              toggle={toggleSection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "ais_compliant",
                  "cmvr_compliant",
                  "school_bus_safety",
                  "state_transport_norms",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1 block"
                  >
                    <input
                      type="checkbox"
                      name={f}
                      checked={!!form[f]}
                      onChange={handleChange}
                      className="w-5 h-5 cursor-pointer accent-blue-600"
                    />
                    {formatLabel(f)}
                  </div>
                ))}
              </div>
            </Section>

            {/* Timeline & Budget */}
            <Section title="Timeline & Budget" sectionKey="timeline" expanded={expandedSections.timeline}
              toggle={toggleSection}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <input type="date" name="expected_delivery" value={form.expected_delivery} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                <input type="number" name="approximate_budget" value={form.approximate_budget} placeholder="Enter Budget" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
              </div>
            </Section>

            {/* Attachments */}
            <Section
              title="Attachments"
              sectionKey="attachments"
              expanded={expandedSections.attachments}
              toggle={toggleSection}
            >
              {/* Hidden Native Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".tsx,.pdf,.xls,.xlsx,image/*"
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files) return;

                  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

                  const selectedFiles = Array.from(e.target.files);

                  // ❌ Find oversized files
                  const invalidFile = selectedFiles.find(
                    (file) => file.size > MAX_FILE_SIZE
                  );

                  if (invalidFile) {
                    setAlert({
                      type: "error",
                      message: `File "${invalidFile.name}" exceeds 10MB limit`,
                    });

                    e.target.value = ""; // reset input
                    return;
                  }

                  setForm((prev: any) => {
                    const existingFiles = prev.attachments || [];

                    const uniqueFiles = selectedFiles.filter(
                      (file) =>
                        !existingFiles.some(
                          (f: File) =>
                            f.name === file.name && f.size === file.size
                        )
                    );

                    return {
                      ...prev,
                      attachments: [...existingFiles, ...uniqueFiles],
                    };
                  });

                  // allow selecting same file again
                  e.target.value = "";
                }}
              />

              {/* Custom Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Upload size={20} />
                Upload Files
              </button>

              {/* Selected Files List */}
              {form.attachments.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {form.attachments.map((file: File, idx: number) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md"
                    >
                      <span className="truncate">
                        {file.name} (
                        {(file.size / 1024).toFixed(1)} KB)
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev: any) => ({
                            ...prev,
                            attachments: prev.attachments.filter(
                              (_: any, i: number) => i !== idx
                            ),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  No files selected
                </p>
              )}
            </Section>


            {/* Declaration */}
            <Section title="Declaration" sectionKey="declaration" expanded={expandedSections.declaration}
              toggle={toggleSection}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Declaration Date</label>
                  <input type="date" name="declaration_date" value={form.declaration_date} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Place</label>
                  <input type="text" name="place" value={form.place} placeholder="Enter Place" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Applicant Signature</label>
                  <input type="text" name="applicant_signature" value={form.applicant_signature} placeholder="Enter Signature" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
                </div>
              </div>
            </Section>

            {/* BD Review */}
            {/* <Section title="BD Review" sectionKey="bdReview" expanded={expandedSections.bdReview}
              toggle={toggleSection}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                <select name="bd_status" value={form.bd_status} onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm">
                  <option value="CREATED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <input name="bd_comments" value={form.bd_comments} placeholder="BD Comments" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm" />
              </div>
            </Section> */}


          </form>
        </div>
        <div className="flex justify-end p-4  sticky bottom-0 bg-white z-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
          >
            Submit for Feasibility
          </button>
        </div>

      </div>
    </div>
  )
};

export default TestBusinessDev;

