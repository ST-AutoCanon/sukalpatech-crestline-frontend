import { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";

interface Request {
  id: number;
  description: string;
  priority: string;
  required_date: string;
  requested_by_department: string;
  requested_by_person: string;
}

const TestBusinessDev = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [form, setForm] = useState<any>({
    bd_status: "CREATED",
    bd_comments:"",
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
  });

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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
const handleSubmit = async (e: any, bdId?: number) => {
  e.preventDefault();

  const formData = new FormData();

  // Append all form fields
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
    let res;

    if (bdId) {
      // BD Update
      res = await api.patch(`/business-development/bd/${bdId}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("BD info updated successfully!");
    } else {
      // BD Create
      res = await api.post("/business-development", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Request created successfully!");
    }

    // Refresh list or update state
    fetchRequests();

  } catch (err: any) {
    console.error("Failed to submit BD info", err);
    alert("Failed to submit BD info");
  }
};

  return (
     <div className="min-h-screen overflow-y-auto">
    <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="overflow-y-auto max-h-[90vh] p-6 space-y-6">

      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6">
        New Bus Body Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Business Request Details */}
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="text-sm sm:text-base font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">
            Business Request Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Priority</label>
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
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Required Date</label>
              <input
                type="date"
                name="required_date"
                value={form.required_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Requested By Department</label>
              <input
                name="requested_by_department"
                value={form.requested_by_department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Requested By Person</label>
              <input
                name="requested_by_person"
                value={form.requested_by_person}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
              />
            </div>
          </div>
        </section>

        {/* Applicant / Organization Details */}
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="text-sm sm:text-base font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Applicant / Organization Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Applicant Name</label>
              <input name="applicant_name" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Contact Person</label>
              <input name="contact_person" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Email</label>
              <input name="email" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Mobile Number</label>
              <input name="mobile_number" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Address</label>
              <input name="address" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
            </div>
          </div>
        </section>

        {/* Chassis / Body Details */}
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="text-sm sm:text-base font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Body / Chassis Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["chassis_manufacturer", "chassis_model", "chassis_number", "engine_number", "wheelbase", "fuel_type"].map(f => (
              <div key={f}>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">{f.replace(/_/g, " ").toUpperCase()}</label>
                <input name={f} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
              </div>
            ))}
          </div>
        </section>

        {/* Seating & Interior */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Seating & Interior</h3>
          <div className="grid grid-cols-3 gap-4">
            {["seating_capacity", "seat_type", "flooring_type", "interior_color"].map(f => (
              <div key={f}>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">{f.replace(/_/g, " ").toUpperCase()}</label>
                <input name={f} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
              </div>
            ))}
          </div>
        </section>
        {/* Exterior */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-orange-400 pb-1">
            Exterior Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["body_material", "paint_color", "window_type", "door_type"].map((f) => (
              <div key={f} className="flex flex-col">
                <label className="text-sm font-medium text-gray-500 mb-1">
                  {f.replace(/_/g, " ").toUpperCase()}
                </label>
                <input
                  name={f}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Body Type */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Body Type Required</h3>
          <select name="body_type" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm">
            <option value="">Select Body Type</option>
            <option value="City Bus">City Bus</option>
            <option value="School Bus">School Bus</option>
            <option value="Staff Bus">Staff Bus</option>
            <option value="Tourist">Tourist</option>
            <option value="Sleeper">Sleeper</option>
            <option value="Mini Bus">Mini Bus</option>
          </select>
        </section>

        {/* Additional Features */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Additional Features</h3>
          <div className="grid grid-cols-3 gap-2">
            {["ac", "cctv", "gps", "fire_extinguisher", "emergency_exit", "led_board", "usb", "luggage_carrier", "wheelchair_access"].map(f => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={f} onChange={handleChange} />
                {f.replace(/_/g, " ").toUpperCase()}
              </label>
            ))}
          </div>
        </section>

        {/* Compliance */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Compliance & Standards</h3>
          <div className="grid grid-cols-3 gap-2">
            {["ais_compliant", "cmvr_compliant", "school_bus_safety", "state_transport_norms"].map(f => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={f} onChange={handleChange} />
                {f.replace(/_/g, " ").toUpperCase()}
              </label>
            ))}
          </div>
        </section>

        {/* Timeline & Budget */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Timeline & Budget</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="expected_delivery" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm" />
            <input type="number" name="approximate_budget" placeholder="Approx Budget" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm" />
          </div>
        </section>

        {/* Attachments */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Attachments</h3>
          <input
            type="file"
            multiple
            accept=".tsx,.pdf,.xls,.xlsx,image/*"
            onChange={(e) => {
              if (e.target.files) {
                const filesArray = Array.from(e.target.files);
                setForm((prev: any) => ({
                  ...prev,
                  attachments: [...(prev.attachments || []), ...filesArray],
                }));
              }
            }}
            className="mb-2"
          />
          {form.attachments && form.attachments.length > 0 && (
            <ul className="list-disc pl-5">
              {form.attachments.map((file: File, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  {file.name}
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev: any) => ({
                        ...prev,
                        attachments: prev.attachments.filter((_: File, i: number) => i !== idx),
                      }));
                    }}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Declaration */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Declaration</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Declaration Date</label>
              <input type="date" name="declaration_date" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Place</label>
              <input type="text" name="place" placeholder="Enter Place" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Applicant Signature</label>
              <input type="text" name="applicant_signature" placeholder="Enter Signature" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm w-full" />
            </div>
          </div>
        </section>

        {/* BD Review */}
        <section className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">BD Review</h3>
          <div className="grid grid-cols-2 gap-4">
            <select name="bd_status" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm">
              <option value="CREATED">CREATED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <input name="bd_comments" placeholder="BD Comments" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm" />
          </div>
        </section>

        <button type="submit" className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-3 px-6 rounded-xl font-bold text-sm sm:text-base hover:opacity-90 transition">
          Submit for Feasibility
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default TestBusinessDev;
