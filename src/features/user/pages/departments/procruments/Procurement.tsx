// import React, { useState, useContext } from "react";
// import { AuthContext } from "../../../../../context/AuthContext";
// import { useProcurement } from "../../../hooks/useProcurement";

// const Procurement: React.FC = () => {
//   const { user, token } = useContext(AuthContext);

//   const { departments, vendors, refetchAllPRs, createPR } =
//     useProcurement(token);

//   const [projectName, setProjectName] = useState("");
//   const [priority, setPriority] = useState("");
//   const [requiredDate, setRequiredDate] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [requestingDepartment, setRequestingDepartment] = useState<{
//     department_id: number | null;
//     name: string;
//   }>({ department_id: null, name: "" });

//   const [rows, setRows] = useState([
//     {
//       vendor_id: null,
//       item_code: "",
//       item_name: "",
//       quantity: "",
//       unit: "",
//       price: "",
//       total_price: "",
//       quotation: null as File | null,
//       quotationValidityDate: "",
//       comments: "",
//     },
//   ]);

//   const addRow = () =>
//     setRows([
//       ...rows,
//       {
//         vendor_id: null,
//         item_code: "",
//         item_name: "",
//         quantity: "",
//         unit: "",
//         price: "",
//         total_price: "",
//         quotation: null,
//         quotationValidityDate: "",
//         comments: "",
//       },
//     ]);

//   const submitPR = async () => {
//     if (!token) return;

//     try {
//       const formData = new FormData();
//       formData.append("project_name", projectName);
//       formData.append("requested_by", String(user.id));
//       formData.append("requested_by_person", user.email);
//       formData.append(
//         "requesting_department_id",
//         String(requestingDepartment.department_id)
//       );
//       formData.append("requesting_department", requestingDepartment.name);
//       formData.append("priority", priority);
//       formData.append("required_delivery_date", requiredDate);
//       formData.append("remarks", remarks);
//       formData.append("status", "draft");

//       const items: any[] = [];
//       const comments: any[] = [];
//       const attachments: any[] = [];
//       const vendor_ids: number[] = [];

//       rows.forEach((r) => {
//         items.push({
//           item_code: r.item_code,
//           item_name: r.item_name,
//           specification: "",
//           quantity_required: r.quantity,
//           unit: r.unit,
//           expected_rate: r.price,
//           reason: "",
//         });

//         comments.push({ commented_by: user.id, comment: r.comments });

//         if (r.quotation) {
//           attachments.push({
//             file_name: r.quotation.name,
//             file_path: "",
//             file_object: r.quotation,
//             quotation_validity_date: r.quotationValidityDate,
//           });
//         }

//         if (r.vendor_id) vendor_ids.push(r.vendor_id);
//       });

//       formData.append("items", JSON.stringify(items));
//       formData.append("comments", JSON.stringify(comments));
//       formData.append("vendor_ids", JSON.stringify(vendor_ids));

//       attachments.forEach((att) => {
//         if (att.file_object) {
//           formData.append("attachments", att.file_object);
//           formData.append(
//             "attachments_quotation_validity_date",
//             att.quotation_validity_date || ""
//           );
//         }
//       });

//       await createPR(formData);

//       alert("PR Created Successfully!");

//       setProjectName("");
//       setPriority("");
//       setRequiredDate("");
//       setRemarks("");
//       setRequestingDepartment({ department_id: null, name: "" });
//       setRows([
//         {
//           vendor_id: null,
//           item_code: "",
//           item_name: "",
//           quantity: "",
//           unit: "",
//           price: "",
//           total_price: "",
//           quotation: null,
//           quotationValidityDate: "",
//           comments: "",
//         },
//       ]);

//       refetchAllPRs();
//     } catch (error) {
//       console.error("PR Error:", error);
//       alert("Error sending PR");
//     }
//   };

//   const handleRowChange = (idx: number, field: string, value: any) => {
//     const newRows = [...rows];
//     (newRows[idx] as any)[field] = value;

//     if (field === "quantity" || field === "price") {
//       const qty = parseFloat(newRows[idx].quantity) || 0;
//       const price = parseFloat(newRows[idx].price) || 0;
//       newRows[idx].total_price = (qty * price).toFixed(2);
//     }

//     setRows(newRows);
//   };

//   const inputClass =
//     "w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

//   return (
//     <div className="p-5 max-w-6xl mx-auto bg-white shadow rounded">
//       <h1 className="text-xl font-bold mb-4 text-gray-800">
//         New Procurement Request
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//         <input
//           className={inputClass}
//           placeholder="Description"
//           value={projectName}
//           onChange={(e) => setProjectName(e.target.value)}
//         />

//         <select
//           className={inputClass}
//           value={priority}
//           onChange={(e) => setPriority(e.target.value)}
//         >
//           <option value="">Priority</option>
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>

//         <label className="block mb-2">
//           Required Delivery Date
//           <input
//             type="date"
//             className={inputClass}
//             value={requiredDate}
//             onChange={(e) => setRequiredDate(e.target.value)}
//           />
//         </label>

//         <label className="block mb-2">
//           Requesting Department
//           <select
//             className={inputClass}
//             value={requestingDepartment.department_id || ""}
//             onChange={(e) => {
//               const dept = departments.find(
//                 (d) => d.department_id === Number(e.target.value)
//               );
//               dept && setRequestingDepartment(dept);
//             }}
//           >
//             <option value="">Requesting Department</option>
//             {departments.map((d) => (
//               <option key={d.department_id} value={d.department_id}>
//                 {d.name}
//               </option>
//             ))}
//           </select>
//         </label>

//         <textarea
//           className={inputClass + " md:col-span-2"}
//           placeholder="Remarks"
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//         />
//       </div>

//       <h2 className="font-semibold mb-2 text-gray-700">Vendor Items</h2>

//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-300 mb-3 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-2 py-1">Vendor</th>
//               <th className="border px-2 py-1">Item Code</th>
//               <th className="border px-2 py-1">Item</th>
//               <th className="border px-2 py-1">Qty</th>
//               <th className="border px-2 py-1">Unit</th>
//               <th className="border px-2 py-1">Price</th>
//               <th className="border px-2 py-1">Total Price</th>
//               <th className="border px-2 py-1">Upload Quotation</th>
//               <th className="border px-2 py-1">Quotation Validity</th>
//               <th className="border px-2 py-1">Comments</th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((row, idx) => (
//               <tr key={idx}>
//                 <td className="border px-1 py-1">
//                   <select
//                     className={inputClass}
//                     value={row.vendor_id || ""}
//                     onChange={(e) =>
//                       handleRowChange(idx, "vendor_id", Number(e.target.value))
//                     }
//                   >
//                     <option value="">Select Vendor</option>
//                     {vendors.map((v) => (
//                       <option key={v.vendor_id} value={v.vendor_id}>
//                         {v.vendor_name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     className={inputClass}
//                     value={row.item_code}
//                     onChange={(e) =>
//                       handleRowChange(idx, "item_code", e.target.value)
//                     }
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     className={inputClass}
//                     value={row.item_name}
//                     onChange={(e) =>
//                       handleRowChange(idx, "item_name", e.target.value)
//                     }
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     type="number"
//                     className={inputClass}
//                     value={row.quantity}
//                     onChange={(e) =>
//                       handleRowChange(idx, "quantity", e.target.value)
//                     }
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     className={inputClass}
//                     value={row.unit}
//                     onChange={(e) =>
//                       handleRowChange(idx, "unit", e.target.value)
//                     }
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     type="number"
//                     className={inputClass}
//                     value={row.price}
//                     onChange={(e) =>
//                       handleRowChange(idx, "price", e.target.value)
//                     }
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     type="number"
//                     className={inputClass}
//                     value={row.total_price}
//                     readOnly
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     type="file"
//                     className={inputClass}
//                     onChange={(e) =>
//                       e.target.files &&
//                       handleRowChange(idx, "quotation", e.target.files[0])
//                     }
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     type="date"
//                     className={inputClass}
//                     value={row.quotationValidityDate}
//                     onChange={(e) =>
//                       handleRowChange(
//                         idx,
//                         "quotationValidityDate",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </td>

//                 <td className="border px-1 py-1">
//                   <input
//                     className={inputClass}
//                     value={row.comments}
//                     onChange={(e) =>
//                       handleRowChange(idx, "comments", e.target.value)
//                     }
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <button
//         onClick={addRow}
//         className="mb-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
//       >
//         + Add Row
//       </button>

//       <button
//         onClick={submitPR}
//         className="w-full px-4 py-2 bg-green-600 text-white rounded font-semibold"
//       >
//         Submit PR
//       </button>
//     </div>
//   );
// };

// export default Procurement;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface Department {
//   department_id: number;
//   name: string;
// }

// interface Vendor {
//   vendor_id: number;
//   vendor_name: string;
// }

// interface PRVendor {
//   vendor_id: number;
//   unit_price: number;
//   total_price: number;
//   quotation_validity_date: string;
//   attachments: File[];
//   comments: string;
//   status: string;
// }

// interface PRItem {
//   item_code: string;
//   item_name: string;
//   specification: string;
//   quantity_required: number;
//   unit: string;
//   vendors: PRVendor[];
// }

// const PRPage: React.FC = () => {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
//   const [selectedDepartment, setSelectedDepartment] = useState<number | "">("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState("Medium");
//   const [requiredDate, setRequiredDate] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [items, setItems] = useState<PRItem[]>([]);

//   useEffect(() => {
//     // Fetch departments
//     axios
//       .get("http://localhost:5001/api/departments")
//       .then((res) => setDepartments(res.data.data || []))
//       .catch(() => setDepartments([]));

//     // Fetch vendors
//     axios
//       .get("http://localhost:5001/api/test-pr/vendors")
//       .then((res) => setVendorsList(res.data.data || []))
//       .catch(() => setVendorsList([]));
//   }, []);

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         item_code: "",
//         item_name: "",
//         specification: "",
//         quantity_required: 1,
//         unit: "PCS",
//         vendors: [],
//       },
//     ]);
//   };

//   const removeItem = (index: number) => {
//     const newItems = [...items];
//     newItems.splice(index, 1);
//     setItems(newItems);
//   };

//   const addVendorToItem = (itemIndex: number) => {
//     const newItems = [...items];
//     newItems[itemIndex].vendors.push({
//       vendor_id: 0,
//       unit_price: 0,
//       total_price: 0,
//       quotation_validity_date: "",
//       attachments: [],
//       comments: "",
//       status: "SUBMITTED",
//     });
//     setItems(newItems);
//   };

//   const removeVendorFromItem = (itemIndex: number, vendorIndex: number) => {
//     const newItems = [...items];
//     newItems[itemIndex].vendors.splice(vendorIndex, 1);
//     setItems(newItems);
//   };

//   const handleItemChange = (index: number, field: string, value: any) => {
//     const newItems = [...items];
//     (newItems[index] as any)[field] = value;
//     setItems(newItems);
//   };

//   const handleVendorChange = (
//     itemIndex: number,
//     vendorIndex: number,
//     field: string,
//     value: any
//   ) => {
//     const newItems = [...items];
//     (newItems[itemIndex].vendors[vendorIndex] as any)[field] = value;

//     // Auto-calculate total price
//     if (field === "unit_price") {
//       const quantity = newItems[itemIndex].quantity_required || 1;
//       newItems[itemIndex].vendors[vendorIndex].total_price = quantity * value;
//     }
//     setItems(newItems);
//   };

//   const handleVendorFileChange = (
//     itemIndex: number,
//     vendorIndex: number,
//     files: FileList | null
//   ) => {
//     if (!files) return;
//     const newItems = [...items];
//     newItems[itemIndex].vendors[vendorIndex].attachments = Array.from(files);
//     setItems(newItems);
//   };

//   const handleSubmit = () => {
//     if (!selectedDepartment) return alert("Please select a department.");
//     const formData = new FormData();
//     formData.append("department", selectedDepartment.toString());
//     formData.append("description", description);
//     formData.append("priority", priority);
//     formData.append("required_date", requiredDate);
//     formData.append("remarks", remarks);

//     items.forEach((item, i) => {
//       formData.append(`items[${i}][item_code]`, item.item_code);
//       formData.append(`items[${i}][item_name]`, item.item_name);
//       formData.append(`items[${i}][specification]`, item.specification);
//       formData.append(`items[${i}][quantity_required]`, item.quantity_required.toString());
//       formData.append(`items[${i}][unit]`, item.unit);

//       item.vendors.forEach((vendor, j) => {
//         formData.append(`items[${i}][vendors][${j}][vendor_id]`, vendor.vendor_id.toString());
//         formData.append(`items[${i}][vendors][${j}][unit_price]`, vendor.unit_price.toString());
//         formData.append(`items[${i}][vendors][${j}][total_price]`, vendor.total_price.toString());
//         formData.append(`items[${i}][vendors][${j}][quotation_validity_date]`, vendor.quotation_validity_date);
//         formData.append(`items[${i}][vendors][${j}][comments]`, vendor.comments);
//         formData.append(`items[${i}][vendors][${j}][status]`, vendor.status);
//         vendor.attachments.forEach((file) =>
//           formData.append(`items[${i}][vendors][${j}][attachments]`, file)
//         );
//       });
//     });

//     axios
//       .post("http://localhost:5001/api/test-pr/pr", formData)
//       .then(() => alert("PR Created Successfully!"))
//       .catch((err) => console.error(err));
//   };

//   // Safe lookup for selected department name
//   const selectedDeptDetails = departments.find(d => d.department_id === selectedDepartment);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Create New PR</h1>

//       {/* Department */}
//       <div className="mb-4">
//         <label className="block mb-1 font-semibold">Department</label>
//         <select
//           className="border p-2 w-full"
//           value={selectedDepartment}
//           onChange={(e) => setSelectedDepartment(Number(e.target.value))}
//         >
//           <option value="">Select Department</option>
//           {departments?.map((d) => (
//             <option key={d.department_id} value={d.department_id}>
//               {d.name}
//             </option>
//           ))}
//         </select>
//         {selectedDeptDetails && (
//           <p className="mt-1 text-gray-500">Selected Department: {selectedDeptDetails?.name}</p>
//         )}
//       </div>

//       {/* Priority */}
//       <div className="mb-4">
//         <label className="block mb-1 font-semibold">Priority</label>
//         <select
//           className="border p-2 w-full"
//           value={priority}
//           onChange={(e) => setPriority(e.target.value)}
//         >
//           <option value="High">High</option>
//           <option value="Medium">Medium</option>
//           <option value="Low">Low</option>
//         </select>
//       </div>

//       {/* Description */}
//       <div className="mb-4">
//         <label className="block mb-1 font-semibold">Description</label>
//         <textarea
//           className="border p-2 w-full"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//       </div>

//       {/* Required Date */}
//       <div className="mb-4">
//         <label className="block mb-1 font-semibold">Required Date</label>
//         <input
//           type="date"
//           className="border p-2 w-full"
//           value={requiredDate}
//           onChange={(e) => setRequiredDate(e.target.value)}
//         />
//       </div>

//       {/* Remarks */}
//       <div className="mb-4">
//         <label className="block mb-1 font-semibold">Remarks</label>
//         <textarea
//           className="border p-2 w-full"
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//         />
//       </div>

//       {/* Items */}
//       <h2 className="text-xl font-semibold mb-2">Items</h2>
//       {items.map((item, i) => (
//         <div key={i} className="border p-4 mb-4 rounded">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-bold">Item {i + 1}</h3>
//             <button
//               className="bg-red-500 text-white px-2 py-1 rounded"
//               onClick={() => removeItem(i)}
//             >
//               Remove Item
//             </button>
//           </div>

//           <div className="grid grid-cols-2 gap-4 mb-2">
//             <input
//               type="text"
//               placeholder="Item Code"
//               className="border p-2 w-full"
//               value={item.item_code}
//               onChange={(e) => handleItemChange(i, "item_code", e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Item Name"
//               className="border p-2 w-full"
//               value={item.item_name}
//               onChange={(e) => handleItemChange(i, "item_name", e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Specification"
//               className="border p-2 w-full"
//               value={item.specification}
//               onChange={(e) => handleItemChange(i, "specification", e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Quantity"
//               className="border p-2 w-full"
//               value={item.quantity_required}
//               onChange={(e) =>
//                 handleItemChange(i, "quantity_required", Number(e.target.value))
//               }
//             />
//           </div>

//           {/* Vendors */}
//           <h4 className="font-semibold mb-1">Vendors</h4>
//           {item.vendors.map((vendor, j) => (
//             <div key={j} className="border p-2 mb-2 rounded">
//               <div className="flex justify-between mb-2">
//                 <select
//                   className="border p-2 w-1/2"
//                   value={vendor.vendor_id}
//                   onChange={(e) =>
//                     handleVendorChange(i, j, "vendor_id", Number(e.target.value))
//                   }
//                 >
//                   <option value={0}>Select Vendor</option>
//                   {vendorsList?.map((v) => (
//                     <option key={v.vendor_id} value={v.vendor_id}>
//                       {v.vendor_name}
//                     </option>
//                   ))}
//                 </select>
//                 <button
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                   onClick={() => removeVendorFromItem(i, j)}
//                 >
//                   Remove Vendor
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   type="number"
//                   placeholder="Unit Price"
//                   className="border p-2 w-full"
//                   value={vendor.unit_price}
//                   onChange={(e) =>
//                     handleVendorChange(i, j, "unit_price", Number(e.target.value))
//                   }
//                 />
//                 <input
//                   type="number"
//                   placeholder="Total Price"
//                   className="border p-2 w-full bg-gray-100"
//                   value={vendor.total_price}
//                   readOnly
//                 />
//                 <input
//                   type="date"
//                   placeholder="Quotation Validity"
//                   className="border p-2 w-full"
//                   value={vendor.quotation_validity_date}
//                   onChange={(e) =>
//                     handleVendorChange(i, j, "quotation_validity_date", e.target.value)
//                   }
//                 />
//                 <input
//                   type="text"
//                   placeholder="Comments"
//                   className="border p-2 w-full"
//                   value={vendor.comments}
//                   onChange={(e) =>
//                     handleVendorChange(i, j, "comments", e.target.value)
//                   }
//                 />
//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) => handleVendorFileChange(i, j, e.target.files)}
//                 />
//               </div>
//             </div>
//           ))}

//           <button
//             className="bg-green-500 text-white px-2 py-1 rounded"
//             onClick={() => addVendorToItem(i)}
//           >
//             Add Vendor
//           </button>
//         </div>
//       ))}

//       <button
//         className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
//         onClick={addItem}
//       >
//         Add Item
//       </button>

//       <br />
//       <button
//         className="bg-purple-600 text-white px-4 py-2 rounded"
//         onClick={handleSubmit}
//       >
//         Submit PR
//       </button>
//     </div>
//   );
// };

// export default PRPage;

// ///////////////
// import { useState } from "react";
// import axios from "axios";

// export default function NewProcurementPage() {
//   const API_BASE = "http://localhost:5001/api/new-procurement";

//   const departments = [
//     { id: 1, name: "Production" },
//     { id: 2, name: "Purchase" },
//     { id: 3, name: "Quality" },
//     { id: 4, name: "IT" },
//   ];

//   const vendorList = [
//     { id: 1, name: "Vendor One Pvt Ltd" },
//     { id: 2, name: "Alpha Suppliers" },
//     { id: 3, name: "TechnoTrade" },
//     { id: 4, name: "Metro Traders" },
//     { id: 5, name: "Elite Industrial" },
//     { id: 6, name: "Prime Components" },
//     { id: 7, name: "Galaxy Suppliers" },
//     { id: 8, name: "ProTech Vendors" },
//     { id: 9, name: "Universal Traders" },
//     { id: 10, name: "Crestline Partners" },
//   ];

//   const [vendorFiles, setVendorFiles] = useState({});
//   const [prData, setPrData] = useState({
//     department: "",
//     requested_by: 5,
//     description: "",
//     priority: "",
//     required_date: "",
//     remarks: "",
//     items: [
//       {
//         item_code: "",
//         item_name: "",
//         quantity_required: "",
//         vendors: [
//           {
//             vendor_id: "",
//             unit_price: "",
//             total_price: "",
//             quotation_validity_date: "",
//             status: "Submitted",
//             vendor_status_updated_by: 5,
//             comments: [],
//             attachments: [],
//           },
//         ],
//       },
//     ],
//   });

//   const handlePRChange = (e) => {
//     setPrData({ ...prData, [e.target.name]: e.target.value });
//   };

//   const handleItemChange = (i, field, value) => {
//     const updated = [...prData.items];
//     updated[i][field] = value;
//     setPrData({ ...prData, items: updated });
//   };

//   const handleVendorChange = (i, vi, field, value) => {
//     const updated = [...prData.items];
//     updated[i].vendors[vi][field] = value;
//     setPrData({ ...prData, items: updated });
//   };

//   const addItem = () => {
//     setPrData({
//       ...prData,
//       items: [
//         ...prData.items,
//         { item_code: "", item_name: "", quantity_required: "", vendors: [] },
//       ],
//     });
//   };

//   const addVendor = (i) => {
//     const updated = [...prData.items];
//     updated[i].vendors.push({
//       vendor_id: "",
//       unit_price: "",
//       total_price: "",
//       quotation_validity_date: "",
//       status: "Submitted",
//       vendor_status_updated_by: 5,
//       comments: [],
//       attachments: [],
//     });
//     setPrData({ ...prData, items: updated });
//   };

//   const handleFileUpload = (i, vi, files) => {
//     const key = `${i}-${vi}`;
//     setVendorFiles({
//       ...vendorFiles,
//       [key]: Array.from(files),
//     });
//   };

//   const handleComment = (i, vi, value) => {
//     const updated = [...prData.items];
//     updated[i].vendors[vi].comments = [{ comment: value, commented_by: 5 }];
//     setPrData({ ...prData, items: updated });
//   };

//   const submitPR = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("data", JSON.stringify(prData));

//       Object.values(vendorFiles).forEach((files) => {
//         files.forEach((file) => formData.append("attachments", file));
//       });

//       await axios.post(`${API_BASE}/purchase-requests`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("PR Created Successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Error creating PR");
//     }
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gray-100 text-black">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">🛒 New Procurement Request</h1>

//         {/* PR Header */}
//         <div className="bg-white shadow-md rounded-xl p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4 border-b pb-2">
//             Request Information
//           </h2>

//           <div className="grid grid-cols-2 gap-4">
//             <select
//               name="department"
//               className="border rounded-lg p-3 bg-gray-50"
//               onChange={handlePRChange}
//             >
//               <option>Select Department</option>
//               {departments.map((d) => (
//                 <option key={d.id} value={d.name}>
//                   {d.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               name="priority"
//               className="border rounded-lg p-3 bg-gray-50"
//               onChange={handlePRChange}
//             >
//               <option>Select Priority</option>
//               <option value="LOW">Low</option>
//               <option value="MEDIUM">Medium</option>
//               <option value="HIGH">High</option>
//             </select>

//             <input
//               type="date"
//               name="required_date"
//               className="border rounded-lg p-3 bg-gray-50"
//               onChange={handlePRChange}
//             />

//             <input
//               type="text"
//               name="description"
//               placeholder="Description"
//               className="border rounded-lg p-3 bg-gray-50"
//               onChange={handlePRChange}
//             />

//             <textarea
//               name="remarks"
//               placeholder="Remarks"
//               className="border rounded-lg p-3 bg-gray-50 col-span-2"
//               onChange={handlePRChange}
//             ></textarea>
//           </div>
//         </div>

//         {/* Items */}
//         {prData.items.map((item, i) => (
//           <div key={i} className="bg-white shadow-md rounded-xl p-6 mb-6">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-lg font-bold">📦 Item {i + 1}</h2>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <input
//                 className="border rounded-lg p-3 bg-gray-50"
//                 placeholder="Item Code"
//                 onChange={(e) =>
//                   handleItemChange(i, "item_code", e.target.value)
//                 }
//               />

//               <input
//                 className="border rounded-lg p-3 bg-gray-50"
//                 placeholder="Item Name"
//                 onChange={(e) =>
//                   handleItemChange(i, "item_name", e.target.value)
//                 }
//               />

//               <input
//                 className="border rounded-lg p-3 bg-gray-50"
//                 placeholder="Quantity"
//                 onChange={(e) =>
//                   handleItemChange(i, "quantity_required", e.target.value)
//                 }
//               />
//             </div>

//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
//               onClick={() => addVendor(i)}
//             >
//               ➕ Add Vendor
//             </button>

//             {/* Vendors */}
//             {item.vendors.map((vendor, vi) => (
//               <div key={vi} className="border rounded-xl p-4 mt-4 bg-gray-50">
//                 <select
//                   className="border rounded-lg p-3 w-full bg-white"
//                   onChange={(e) =>
//                     handleVendorChange(i, vi, "vendor_id", e.target.value)
//                   }
//                 >
//                   <option>Select Vendor</option>
//                   {vendorList.map((v) => (
//                     <option key={v.id} value={v.id}>
//                       {v.name}
//                     </option>
//                   ))}
//                 </select>

//                 <div className="grid grid-cols-3 gap-3 mt-3">
//                   <input
//                     className="border rounded-lg p-3 bg-white"
//                     placeholder="Unit Price"
//                     onChange={(e) =>
//                       handleVendorChange(i, vi, "unit_price", e.target.value)
//                     }
//                   />
//                   <input
//                     className="border rounded-lg p-3 bg-white"
//                     placeholder="Total Price"
//                     onChange={(e) =>
//                       handleVendorChange(i, vi, "total_price", e.target.value)
//                     }
//                   />
//                   <input
//                     type="date"
//                     className="border rounded-lg p-3 bg-white"
//                     onChange={(e) =>
//                       handleVendorChange(
//                         i,
//                         vi,
//                         "quotation_validity_date",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </div>

//                 <textarea
//                   className="border rounded-lg p-3 w-full mt-3 bg-white"
//                   placeholder="Comment"
//                   onChange={(e) => handleComment(i, vi, e.target.value)}
//                 />

//                 <input
//                   type="file"
//                   multiple
//                   className="mt-3"
//                   onChange={(e) => handleFileUpload(i, vi, e.target.files)}
//                 />
//               </div>
//             ))}
//           </div>
//         ))}

//         <button
//           className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full"
//           onClick={addItem}
//         >
//           ➕ Add Item
//         </button>

//         <button
//           className="bg-black hover:bg-gray-800 text-white px-6 py-3 mt-6 rounded-full ml-4"
//           onClick={submitPR}
//         >
//           🚀 Submit Purchase Request
//         </button>
//       </div>
//     </div>
//   );
// }



///////////////
import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

export default function NewProcurementPage({ onClose }) {
  const API_BASE = "http://localhost:5001/api/new-procurement";

  const departments = [
    { id: 1, name: "Production" },
    { id: 2, name: "Purchase" },
    { id: 3, name: "Quality" },
    { id: 4, name: "IT" },
  ];

  const vendorList = [
    { id: 1, name: "Vendor One Pvt Ltd" },
    { id: 2, name: "Alpha Suppliers" },
    { id: 3, name: "TechnoTrade" },
    { id: 4, name: "Metro Traders" },
    { id: 5, name: "Elite Industrial" },
    { id: 6, name: "Prime Components" },
    { id: 7, name: "Galaxy Suppliers" },
    { id: 8, name: "ProTech Vendors" },
    { id: 9, name: "Universal Traders" },
    { id: 10, name: "Crestline Partners" },
  ];

  const [vendorFiles, setVendorFiles] = useState({});
  const [prData, setPrData] = useState({
    department: "",
    requested_by: 5,
    description: "",
    priority: "",
    required_date: "",
    remarks: "",
    items: [
      {
        item_code: "",
        item_name: "",
        quantity_required: "",
        vendors: [
          {
            vendor_id: "",
            unit_price: "",
            total_price: "",
            quotation_validity_date: "",
            status: "Submitted",
            vendor_status_updated_by: 5,
            comments: [],
            attachments: [],
          },
        ],
      },
    ],
  });

  const handlePRChange = (e) => {
    setPrData({ ...prData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (i, field, value) => {
    const updated = [...prData.items];
    updated[i][field] = value;
    setPrData({ ...prData, items: updated });
  };

  const handleVendorChange = (i, vi, field, value) => {
    const updated = [...prData.items];
    updated[i].vendors[vi][field] = value;
    setPrData({ ...prData, items: updated });
  };

  const addItem = () => {
    setPrData({
      ...prData,
      items: [
        ...prData.items,
        { item_code: "", item_name: "", quantity_required: "", vendors: [] },
      ],
    });
  };

  const addVendor = (i) => {
    const updated = [...prData.items];
    updated[i].vendors.push({
      vendor_id: "",
      unit_price: "",
      total_price: "",
      quotation_validity_date: "",
      status: "Submitted",
      vendor_status_updated_by: 5,
      comments: [],
      attachments: [],
    });
    setPrData({ ...prData, items: updated });
  };

  const handleFileUpload = (i, vi, files) => {
    const key = `${i}-${vi}`;
    setVendorFiles({
      ...vendorFiles,
      [key]: Array.from(files),
    });
  };

  const handleComment = (i, vi, value) => {
    const updated = [...prData.items];
    updated[i].vendors[vi].comments = [{ comment: value, commented_by: 5 }];
    setPrData({ ...prData, items: updated });
  };

  const submitPR = async () => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(prData));

      Object.values(vendorFiles).forEach((files) => {
        files.forEach((file) => formData.append("attachments", file));
      });

      await axios.post(`${API_BASE}/purchase-requests`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("PR Created Successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating PR");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[95%] max-w-7xl bg-white text-gray-900 rounded-xl overflow-y-auto max-h-[95vh]">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center px-6 py-6">
          <h2 className="text-xl font-semibold text-purple-600">
            New Procurement Request
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-600"
          >
            ×
          </button>
        </div>

        {/* ================= FORM ================= */}
        <div className="p-6 space-y-6">

          {/* -------- PR INFO ROW -------- */}
          <div className="bg-gray-100 rounded-xl p-5">
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <input
                  name="description"
                  className="w-full border rounded-lg p-3 mt-1"
                  onChange={handlePRChange}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Priority</label>
                <select
                  name="priority"
                  className="w-full border rounded-lg p-3 mt-1 bg-white"
                  onChange={handlePRChange}
                >
                  <option>Medium</option>
                  <option>Low</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Required Date</label>
                <input
                  type="date"
                  name="required_date"
                  className="w-full border rounded-lg p-3 mt-1"
                  onChange={handlePRChange}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Department</label>
                <select
                  name="department"
                  className="w-full border rounded-lg p-3 mt-1 bg-white"
                  onChange={handlePRChange}
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Remarks</label>
                <input
                  name="remarks"
                  className="w-full border rounded-lg p-3 mt-1"
                  onChange={handlePRChange}
                />
              </div>
            </div>
          </div>

          {/* ================= PRIMARY ACTIONS ================= */}
          <div className="flex justify-end gap-4 mb-4">
            <button
              onClick={addItem}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              + Add Item
            </button>

            <button
              onClick={submitPR}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2"
            >
              <Upload size={16} />
              Submit PR
            </button>
          </div>

          {/* ================= ITEMS ================= */}
          {prData.items.map((item, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-5 space-y-4">

              {/* -------- ITEM HEADER -------- */}
              <div className="bg-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-6">

                  {/* ITEM CODE */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                      Item Code
                    </span>
                    <input
                      className="flex-1 border rounded-lg px-3 py-2 bg-white"
                      onChange={(e) => handleItemChange(i, "item_code", e.target.value)}
                    />
                  </div>

                  {/* ITEM NAME */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                      Item Name
                    </span>
                    <input
                      className="flex-1 border rounded-lg px-3 py-2 bg-white"
                      onChange={(e) => handleItemChange(i, "item_name", e.target.value)}
                    />
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                      Quantity
                    </span>
                    <input
                      className="w-28 border rounded-lg px-3 py-2 bg-white"
                      onChange={(e) =>
                        handleItemChange(i, "quantity_required", e.target.value)
                      }
                    />
                  </div>

                </div>
              </div>


              {/* -------- VENDORS -------- */}
              {item.vendors.map((vendor, vi) => (
                <div
                  key={vi}
                  className="grid grid-cols-7 gap-3 items-end"
                >
                  <div>
                    <label className="text-xs text-gray-600">Vendor</label>
                    <select
                      className="w-full p-2 border rounded bg-white mt-1"
                      onChange={(e) =>
                        handleVendorChange(i, vi, "vendor_id", e.target.value)
                      }
                    >
                      <option>Select</option>
                      {vendorList.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Upload Quotation</label>
                    <input
                      type="file"
                      className="w-full p-2 bg-white rounded border mt-1"
                      onChange={(e) => handleFileUpload(i, vi, e.target.files)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Unit Price</label>
                    <input
                      className="w-full p-2 border rounded mt-1"
                      onChange={(e) =>
                        handleVendorChange(i, vi, "unit_price", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Total Price</label>
                    <input
                      className="w-full p-2 border rounded mt-1"
                      onChange={(e) =>
                        handleVendorChange(i, vi, "total_price", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Quotation Validity</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded mt-1"
                      onChange={(e) =>
                        handleVendorChange(
                          i,
                          vi,
                          "quotation_validity_date",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs text-gray-600">Comments</label>
                    <input
                      className="w-full p-2 border rounded mt-1"
                      onChange={(e) => handleComment(i, vi, e.target.value)}
                    />
                  </div>
                </div>
              ))}

              {/* Add Vendor */}
              <div className="flex w-full">
                <button
                  onClick={() => addVendor(i)}
                  className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  +
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
