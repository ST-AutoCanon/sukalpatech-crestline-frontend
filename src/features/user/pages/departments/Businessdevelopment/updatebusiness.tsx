// import { useEffect, useState } from "react";
// import { api } from "../../../api/businessApi";
// import { useRef } from "react";
// import axios from "axios";


// interface Request {
//   id: number;
//   description: string;
//   priority: string;
//   required_date: string;
//   requested_by_department: string;
//   requested_by_person: string;
// }

// const TestBusinessDev = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void; }) => {
//   const [requests, setRequests] = useState<Request[]>([]);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [expandedSections, setExpandedSections] = useState<{
//     [key: string]: boolean;
//   }>({});

//   const toggleSection = (section: string) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };
//   const [form, setForm] = useState<any>({

//     bd_status: "CREATED",
//     bd_comments: "",
//     description: "",
//     priority: "",
//     required_date: "",
//     requested_by_department: "",
//     requested_by_person: "",
//     applicant_name: "",
//     contact_person: "",
//     mobile_number: "",
//     email: "",
//     address: "",
//     chassis_manufacturer: "",
//     chassis_model: "",
//     chassis_number: "",
//     engine_number: "",
//     wheelbase: "",
//     fuel_type: "",
//     body_type: "",
//     seating_capacity: "",
//     seat_type: "",
//     flooring_type: "",
//     interior_color: "",
//     body_material: "",
//     paint_color: "",
//     window_type: "",
//     door_type: "",
//     ac: false,
//     cctv: false,
//     gps: false,
//     fire_extinguisher: false,
//     emergency_exit: false,
//     led_board: false,
//     usb: false,
//     luggage_carrier: false,
//     wheelchair_access: false,
//     ais_compliant: false,
//     cmvr_compliant: false,
//     school_bus_safety: false,
//     state_transport_norms: false,
//     expected_delivery: "",
//     approximate_budget: "",
//     remarks: "",
//     attachments: [],
//     declaration_date: "",
//     place: "",
//     applicant_signature: "",
//   });

//   const API_BASE2 = `${import.meta.env.VITE_BACKEND_URL}/api/departments`;

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await axios.get(`${API_BASE2}`);
//         console.log(res.data.data);
//         setDepartments(res.data.data);
//       } catch (err) {
//         console.error("Department fetch error", err);
//       }
//     };

//     fetchDepartments();
//   }, []);


//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     const res = await api.get("/bd");
//     setRequests(res.data.data);
//   };


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // const handleSubmit = async (e: any) => {
//   //   e.preventDefault();
//   //   const formData = new FormData();
//   //   Object.keys(form).forEach((key) => {
//   //     if (key === "attachments") {
//   //       form.attachments.forEach((file: File) => {
//   //         formData.append("attachments", file);
//   //       });
//   //     } else {
//   //       formData.append(key, form[key]);
//   //     }
//   //   });

//   //   await api.post("/business-development", formData, {
//   //     headers: { "Content-Type": "multipart/form-data" },
//   //   });

//   //   alert("Request Created Successfully");
//   //   fetchRequests();
//   // };


//   const handleSubmit = async (e: any, bdId?: number) => {
//     e.preventDefault();

//     const formData = new FormData();

//     Object.keys(form).forEach((key) => {
//       if (key === "attachments") {
//         form.attachments.forEach((file: File) => {
//           formData.append("attachments", file);
//         });
//       } else {
//         formData.append(key, form[key]);
//       }
//     });

//     try {
//       if (bdId) {
//         await api.patch(
//           `/business-development/${bdId}/submit`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         alert("BD info updated successfully!");
//       } else {
//         await api.post(
//           "/business-development",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         alert("Request created successfully!");
//       }

//       // ✅ refresh list
//       fetchRequests();

//       // ✅ CLOSE MODAL AUTOMATICALLY
//       onClose();

//     } catch (err) {
//       console.error("Failed to submit BD info", err);
//       alert("Failed to submit BD info");
//     }
//   };


//   return (
//     <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/30 p-2 sm:p-4">
//       <div className=" w-full
//   sm:max-w-7xl
//   bg-white
//   text-gray-900
//   rounded-none sm:rounded-xl
//   flex flex-col
//   max-h-screen sm:max-h-[95vh]
// ">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-white z-10">
//           <h2 className="text-xl font-semibold text-purple-600">
//             New Bus Body Request
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-xl font-bold hover:text-red-600"
//           >
//             ×
//           </button>
//         </div>
//         <div className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-6">


//           <form onSubmit={(e) => handleSubmit(e)}>

//             {/* Business Request Details */}
//             <section className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow-md">
//               <h3 className="text-sm sm:text-base font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">
//                 Business Request Details
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Description</label>
//                   <input
//                     name="description"
//                     value={form.description}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Priority</label>
//                   <select
//                     name="priority"
//                     value={form.priority}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
//                   >
//                     <option value="">Select Priority</option>
//                     <option value="HIGH">HIGH</option>
//                     <option value="MEDIUM">MEDIUM</option>
//                     <option value="LOW">LOW</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Required Date</label>
//                   <input
//                     type="date"
//                     name="required_date"
//                     value={form.required_date}
//                     onChange={handleChange}
//                     min={new Date().toISOString().split("T")[0]} // today
//                     className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">
//                     Department
//                   </label>
//                   <select
//                     name="requested_by_department"
//                     value={form.requested_by_department}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map((d: any) => (
//                       <option key={d.id} value={d.name}>
//                         {d.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>


//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Requested By Person</label>
//                   <input
//                     name="requested_by_person"
//                     value={form.requested_by_person}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Applicant / Organization Details */}
//             <section className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow-md">
//               <h3 className="text-sm sm:text-base font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Applicant / Organization Details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Applicant Name</label>
//                   <input name="applicant_name" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Contact Person</label>
//                   <input name="contact_person" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Email</label>
//                   <input name="email" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
//                 </div>
//                 <div>
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">
//                     Mobile Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="mobile_number"
//                     value={form.mobile_number || ""}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers
//                       if (value.length <= 10) {
//                         handleChange({
//                           target: { name: "mobile_number", value },
//                         });
//                       }
//                     }}
//                     className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
//                     placeholder="Enter mobile number"
//                   />
//                 </div>

//                 <div className="col-span-1 sm:col-span-2">
//                   <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">Address</label>
//                   <input name="address" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
//                 </div>
//               </div>
//             </section>

//             {/* Chassis / Body Details */}
//             <section className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow-md">
//               <h3 className="text-sm sm:text-base font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Body / Chassis Details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {["chassis_manufacturer", "chassis_model", "chassis_number", "engine_number", "wheelbase", "fuel_type"].map(f => (
//                   <div key={f}>
//                     <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 block">{f.replace(/_/g, " ").toUpperCase()}</label>
//                     <input name={f} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base" />
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Seating & Interior */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Seating & Interior</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {["seating_capacity", "seat_type", "flooring_type", "interior_color"].map(f => (
//                   <div key={f}>
//                     <label className="text-xs font-semibold text-gray-700 mb-1 block">{f.replace(/_/g, " ").toUpperCase()}</label>
//                     <input name={f} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
//                   </div>
//                 ))}
//               </div>
//             </section>
//             {/* Exterior */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-orange-400 pb-1 w-fit">
//                 Exterior Specifications
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {["body_material", "paint_color", "window_type", "door_type"].map((f) => (
//                   <div key={f} className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-500 mb-1">
//                       {f.replace(/_/g, " ").toUpperCase()}
//                     </label>
//                     <input
//                       name={f}
//                       onChange={handleChange}
//                       className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Body Type */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Body Type Required</h3>
//               <select name="body_type" onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm">
//                 <option value="">Select Body Type</option>
//                 <option value="City Bus">City Bus</option>
//                 <option value="School Bus">School Bus</option>
//                 <option value="Staff Bus">Staff Bus</option>
//                 <option value="Tourist">Tourist</option>
//                 <option value="Sleeper">Sleeper</option>
//                 <option value="Mini Bus">Mini Bus</option>
//               </select>
//             </section>

//             {/* Additional Features */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Additional Features</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">

//                 {["ac", "cctv", "gps", "fire_extinguisher", "emergency_exit", "led_board", "usb", "luggage_carrier", "wheelchair_access"].map(f => (
//                   <label key={f} className="flex items-center gap-2 text-sm">
//                     <input type="checkbox" name={f} onChange={handleChange} />
//                     {f.replace(/_/g, " ").toUpperCase()}
//                   </label>
//                 ))}
//               </div>
//             </section>

//             {/* Compliance */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Compliance & Standards</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">

//                 {["ais_compliant", "cmvr_compliant", "school_bus_safety", "state_transport_norms"].map(f => (
//                   <label key={f} className="flex items-center gap-2 text-sm">
//                     <input type="checkbox" name={f} onChange={handleChange} />
//                     {f.replace(/_/g, " ").toUpperCase()}
//                   </label>
//                 ))}
//               </div>
//             </section>

//             {/* Timeline & Budget */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Timeline & Budget</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 <input type="date" name="expected_delivery" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm" />
//                 <input type="number" name="approximate_budget" placeholder="Approx Budget" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm" />
//               </div>
//             </section>

//             {/* Attachments */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">
//                 Attachments
//               </h3>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept=".tsx,.pdf,.xls,.xlsx,image/*"
//                 onChange={(e) => {
//                   if (!e.target.files) return;

//                   const selectedFiles = Array.from(e.target.files);

//                   setForm((prev: any) => {
//                     const existingFiles = prev.attachments || [];

//                     const uniqueFiles = selectedFiles.filter(
//                       (file) =>
//                         !existingFiles.some(
//                           (f: File) => f.name === file.name && f.size === file.size
//                         )
//                     );

//                     return {
//                       ...prev,
//                       attachments: [...existingFiles, ...uniqueFiles],
//                     };
//                   });

//                   // ✅ keep this
//                   e.target.value = "";
//                 }}
//               />


//               {form.attachments.length > 0 ? (
//                 <ul className="mt-2 space-y-1 text-sm">
//                   {form.attachments.map((file: File, idx: number) => (
//                     <li key={idx} className="flex justify-between items-center">
//                       <span className="truncate">{file.name}</span>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setForm((prev: any) => ({
//                             ...prev,
//                             attachments: prev.attachments.filter((_: any, i: number) => i !== idx),
//                           }))
//                         }
//                         className="text-red-500 text-xs"
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-xs text-gray-400 mt-1">No files selected</p>
//               )}

//             </section>

//             {/* Declaration */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">Declaration</h3>
//               <div className="grid grid-cols-3 gap-2">
//                 <div>
//                   <label className="text-xs font-semibold text-gray-700 mb-1 block">Declaration Date</label>
//                   <input type="date" name="declaration_date" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm w-full" />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-700 mb-1 block">Place</label>
//                   <input type="text" name="place" placeholder="Enter Place" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm w-full" />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-700 mb-1 block">Applicant Signature</label>
//                   <input type="text" name="applicant_signature" placeholder="Enter Signature" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm w-full" />
//                 </div>
//               </div>
//             </section>

//             {/* BD Review */}
//             <section className="bg-gray-100 rounded-xl p-6 shadow-md">
//               <h3 className="text-sm font-bold mb-4 border-b-2 border-orange-500 pb-1 w-fit">BD Review</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 <select name="bd_status" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm">
//                   <option value="CREATED">CREATED</option>
//                   <option value="IN_PROGRESS">IN PROGRESS</option>
//                   <option value="REJECTED">REJECTED</option>
//                 </select>
//                 <input name="bd_comments" placeholder="BD Comments" onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm" />
//               </div>
//             </section>


//           </form>
//         </div>
//         <div className="flex justify-end p-4  sticky bottom-0 bg-white z-10">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
//           >
//             Submit for Feasibility
//           </button>
//         </div>

//       </div>
//     </div>
//   );

// };

// export default TestBusinessDev;

import { useEffect, useState, useRef } from "react";
import { api } from "../../../api/businessApi";
import axios from "axios";

interface Request {
  id: number;
  description: string;
  priority: string;
  required_date: string;
  requested_by_department: string;
  requested_by_person: string;
}

const TestBusinessDev = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [form, setForm] = useState<any>({
    bd_status: "CREATED",
    bd_comments: "",
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

  const API_BASE2 = `${import.meta.env.VITE_BACKEND_URL}/api/departments`;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE2}`);
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
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any, bdId?: number) => {
    e.preventDefault();
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
        await api.patch(`/business-development/${bdId}/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("BD info updated successfully!");
      } else {
        await api.post("/business-development", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Request created successfully!");
      }
      fetchRequests();
      onClose();
    } catch (err) {
      console.error("Failed to submit BD info", err);
      alert("Failed to submit BD info");
    }
  };

  // Helper for rendering section wrapper
  const Section: React.FC<{
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, sectionKey, children }) => (
    <section className="bg-gray-100 rounded-xl shadow-md mb-4">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => toggleSection(sectionKey)}
      >
        <h3 className="font-bold text-gray-700">{title}</h3>
        <span className="text-lg font-bold">
          {expandedSections[sectionKey] ? "−" : "+"}
        </span>
      </div>
      {expandedSections[sectionKey] && <div className="p-4 sm:p-6">{children}</div>}
    </section>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/30 p-2 sm:p-4">
      <div className="w-full sm:max-w-7xl bg-white text-gray-900 rounded-none sm:rounded-xl flex flex-col max-h-screen sm:max-h-[95vh]">
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

        {/* FORM */}
        <div className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-6">
          <form onSubmit={(e) => handleSubmit(e)}>

            {/* Sections */}
            <Section title="Business Request Details" sectionKey="businessRequest">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label>Description</label>
                  <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Select Priority</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label>Required Date</label>
                  <input
                    type="date"
                    name="required_date"
                    value={form.required_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label>Department</label>
                  <select
                    name="requested_by_department"
                    value={form.requested_by_department}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d: any) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Requested By Person</label>
                  <input
                    name="requested_by_person"
                    value={form.requested_by_person}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </div>
            </Section>

            <Section title="Applicant / Organization Details" sectionKey="applicantDetails">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label>Applicant Name</label>
                  <input name="applicant_name" onChange={handleChange} className="w-full border rounded-md p-2" />
                </div>
                <div>
                  <label>Contact Person</label>
                  <input name="contact_person" onChange={handleChange} className="w-full border rounded-md p-2" />
                </div>
                <div>
                  <label>Email</label>
                  <input name="email" onChange={handleChange} className="w-full border rounded-md p-2" />
                </div>
                <div>
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={form.mobile_number || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      if (value.length <= 10) {
                        handleChange({ target: { name: "mobile_number", value } });
                      }
                    }}
                    className="w-full border rounded-md p-2"
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label>Address</label>
                  <input name="address" onChange={handleChange} className="w-full border rounded-md p-2" />
                </div>
              </div>
            </Section>

            <Section title="Body / Chassis Details" sectionKey="chassisDetails">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {["chassis_manufacturer", "chassis_model", "chassis_number", "engine_number", "wheelbase", "fuel_type"].map(f => (
                  <div key={f}>
                    <label>{f.replace(/_/g, " ").toUpperCase()}</label>
                    <input name={f} onChange={handleChange} className="w-full border rounded-md p-2" />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Seating & Interior" sectionKey="seatingInterior">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {["seating_capacity", "seat_type", "flooring_type", "interior_color"].map(f => (
                  <div key={f}>
                    <label>{f.replace(/_/g, " ").toUpperCase()}</label>
                    <input name={f} onChange={handleChange} className="w-full border rounded-md p-2" />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Exterior Specifications" sectionKey="exterior">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {["body_material", "paint_color", "window_type", "door_type"].map(f => (
                  <div key={f}>
                    <label>{f.replace(/_/g, " ").toUpperCase()}</label>
                    <input name={f} onChange={handleChange} className="w-full border rounded-md p-2" />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Body Type Required" sectionKey="bodyType">
              <select name="body_type" onChange={handleChange} className="w-full border rounded-md p-2">
                <option value="">Select Body Type</option>
                <option value="City Bus">City Bus</option>
                <option value="School Bus">School Bus</option>
                <option value="Staff Bus">Staff Bus</option>
                <option value="Tourist">Tourist</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Mini Bus">Mini Bus</option>
              </select>
            </Section>

            <Section title="Additional Features" sectionKey="additionalFeatures">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {["ac", "cctv", "gps", "fire_extinguisher", "emergency_exit", "led_board", "usb", "luggage_carrier", "wheelchair_access"].map(f => (
                  <label key={f} className="flex items-center gap-2">
                    <input type="checkbox" name={f} onChange={handleChange} />
                    {f.replace(/_/g, " ").toUpperCase()}
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Compliance & Standards" sectionKey="compliance">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {["ais_compliant", "cmvr_compliant", "school_bus_safety", "state_transport_norms"].map(f => (
                  <label key={f} className="flex items-center gap-2">
                    <input type="checkbox" name={f} onChange={handleChange} />
                    {f.replace(/_/g, " ").toUpperCase()}
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Timeline & Budget" sectionKey="timelineBudget">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <input type="date" name="expected_delivery" onChange={handleChange} className="border rounded-md p-2" />
                <input type="number" name="approximate_budget" placeholder="Approx Budget" onChange={handleChange} className="border rounded-md p-2" />
              </div>
            </Section>

            <Section title="Attachments" sectionKey="attachments">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".tsx,.pdf,.xls,.xlsx,image/*"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const selectedFiles = Array.from(e.target.files);
                  setForm((prev: any) => {
                    const existingFiles = prev.attachments || [];
                    const uniqueFiles = selectedFiles.filter(
                      (file) =>
                        !existingFiles.some(
                          (f: File) => f.name === file.name && f.size === file.size
                        )
                    );
                    return { ...prev, attachments: [...existingFiles, ...uniqueFiles] };
                  });
                  e.target.value = "";
                }}
              />
              {form.attachments.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {form.attachments.map((file: File, idx: number) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev: any) => ({
                            ...prev,
                            attachments: prev.attachments.filter((_: any, i: number) => i !== idx),
                          }))
                        }
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 mt-1">No files selected</p>
              )}
            </Section>

            <Section title="Declaration" sectionKey="declaration">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label>Declaration Date</label>
                  <input type="date" name="declaration_date" onChange={handleChange} className="border rounded-md p-2 w-full" />
                </div>
                <div>
                  <label>Place</label>
                  <input type="text" name="place" onChange={handleChange} className="border rounded-md p-2 w-full" />
                </div>
                <div>
                  <label>Applicant Signature</label>
                  <input type="text" name="applicant_signature" onChange={handleChange} className="border rounded-md p-2 w-full" />
                </div>
              </div>
            </Section>

            <Section title="BD Review" sectionKey="bdReview">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <select name="bd_status" onChange={handleChange} className="border rounded-md p-2">
                  <option value="CREATED">CREATED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <input name="bd_comments" placeholder="BD Comments" onChange={handleChange} className="border rounded-md p-2" />
              </div>
            </Section>

          </form>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end p-4 sticky bottom-0 bg-white z-10">
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
  );
};

export default TestBusinessDev;

