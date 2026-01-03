// import { useState, useEffect } from "react";
// import axios from "axios";

// interface DepartmentStatus {
//   department_status: string;
//   department_comment: string;
//   status_updated_by?: number;
//   updated_at?: string;
// }

// interface VendorComment {
//   id?: number;
//   comment: string;
//   commented_by: number;
//   commented_at?: string;
// }

// interface Vendor {
//   id: number;
//   vendor_id: number;
//   status?: string;
//   unit_price?: number;
//   total_price?: number;
//   comments?: VendorComment[];
// }

// interface Item {
//   id: number;
//   item_code?: string;
//   item_name?: string;
//   quantity_required?: number;
//   vendors: Vendor[];
// }

// interface PR {
//   id: string;
//   department?: string;
//   requested_by?: string;
//   description?: string;
//   priority?: string;
//   required_date?: string;
//   remarks?: string;
//   created_at?: string;
//   updated_at?: string;
//   department_statuses: DepartmentStatus[];
//   items: Item[];
// }

// export default function SubmittedPRRequestsPage() {
//   const API_BASE = "http://localhost:5001/api/new-procurement";

//   const [requests, setRequests] = useState<PR[]>([]);
//   const [selectedPR, setSelectedPR] = useState<PR | null>(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [newComment, setNewComment] = useState("");

//   const PR_STATUS_OPTIONS = ["PR APPROVED", "PR REJECTED", "PR PENDING"];

//   const [updateData, setUpdateData] = useState<{
//     department_statuses: DepartmentStatus[];
//     items: Item[];
//   }>({
//     department_statuses: [],
//     items: [],
//   });

//   // -------------------------------
//   // Fetch FINANCE APPROVED PRs
//   // -------------------------------
//   const fetchFinanceApprovedPRs = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/finance-approved-pr-requests`);
//       setRequests(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching finance-approved PRs:", err);
//       alert("Error fetching PRs");
//     }
//   };

//   useEffect(() => {
//     fetchFinanceApprovedPRs();
//   }, []);

//   // -------------------------------
//   // Select PR
//   // -------------------------------
//   const selectPR = (prId: string) => {
//     const pr = requests.find((r) => r.id === prId);
//     if (!pr) {
//       setSelectedPR(null);
//       setUpdateData({ department_statuses: [], items: [] });
//       return;
//     }

//     setSelectedPR(pr);
//     setUpdateData({
//       department_statuses: pr.department_statuses || [],
//       items: pr.items.map((item) => ({
//         ...item,
//         vendors: item.vendors.map((v) => ({ ...v })),
//       })),
//     });

//     setNewStatus("");
//     setNewComment("");
//   };

//   // -------------------------------
//   // Submit Department Status Update
//   // -------------------------------
//   const submitUpdate = async () => {
//     if (!selectedPR || !newStatus) {
//       alert("Please select a status");
//       return;
//     }

//     const payload = {
//       department_statuses: [
//         {
//           department_status: newStatus,
//           department_comment: newComment,
//           status_updated_by: 2, // finance user id
//           updated_at: new Date().toISOString(),
//         },
//       ],
//     };

//     try {
//       await axios.put(`${API_BASE}/pr-requests/${selectedPR.id}`, payload);
//       alert("PR updated successfully");
//       fetchFinanceApprovedPRs();
//       setNewStatus("");
//       setNewComment("");
//     } catch (err) {
//       console.error("Error updating PR:", err);
//       alert("Error updating PR");
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen text-black">
//       <h1 className="text-3xl font-bold mb-6">
//         Finance-Approved Purchase Requests
//       </h1>

//       {/* PR Selector */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Select a PR</h2>
//         <select
//           className="border p-2 rounded-lg w-full text-black"
//           onChange={(e) => selectPR(e.target.value)}
//           value={selectedPR?.id || ""}
//         >
//           <option value="">-- Select PR --</option>
//           {requests.map((pr) => (
//             <option key={pr.id} value={pr.id}>
//               {pr.id} - {pr.description || "No description"}
//             </option>
//           ))}
//         </select>
//       </div>

//       {!selectedPR && <p className="text-red-600">No PR selected</p>}

//       {selectedPR && (
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           {/* PR Details */}
//           <h2 className="text-xl font-semibold mb-4">PR Details</h2>
//           <div className="mb-4">
//             <p>
//               <strong>ID:</strong> {selectedPR.id}
//             </p>
//             <p>
//               <strong>Department:</strong> {selectedPR.department}
//             </p>
//             <p>
//               <strong>Description:</strong> {selectedPR.description}
//             </p>
//             <p>
//               <strong>Priority:</strong> {selectedPR.priority}
//             </p>
//             <p>
//               <strong>Required Date:</strong> {selectedPR.required_date}
//             </p>
//             <p>
//               <strong>Remarks:</strong> {selectedPR.remarks}
//             </p>
//           </div>

//           {/* Previous Statuses */}
//           <h3 className="font-bold mb-2">Previous Department Statuses</h3>
//           <div className="mb-4">
//             {updateData.department_statuses.length > 0 ? (
//               updateData.department_statuses.map((dep, i) => (
//                 <div key={i} className="mb-2 border p-2 rounded bg-gray-50">
//                   <p>
//                     <strong>Status:</strong> {dep.department_status}
//                   </p>
//                   <p>
//                     <strong>Comment:</strong>{" "}
//                     {dep.department_comment || "No comment"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Updated At:{" "}
//                     {dep.updated_at
//                       ? new Date(dep.updated_at).toLocaleString()
//                       : "-"}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p>No previous department statuses</p>
//             )}
//           </div>

//           {/* Add New Status */}
//           <h3 className="font-bold mb-2">Add New Department Status</h3>
//           <div className="flex gap-2 items-center mb-4">
//             <select
//               className="border p-2 rounded text-black"
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//             >
//               <option value="">-- Select Status --</option>
//               {PR_STATUS_OPTIONS.map((status) => (
//                 <option key={status} value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               className="border p-2 rounded text-black flex-1"
//               placeholder="Add comment"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             />

//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               onClick={submitUpdate}
//             >
//               Add Status
//             </button>
//           </div>

//           {/* Items & Vendors */}
//           <h3 className="font-bold mt-4 mb-2">Items & Vendors (Read-Only)</h3>

//           {updateData.items.map((item, i) => (
//             <div key={i} className="mb-4 border p-2 rounded">
//               <h4 className="font-semibold mb-1">
//                 {item.item_name || `Item ${i + 1}`} (Code: {item.item_code})
//               </h4>
//               <p>Quantity Required: {item.quantity_required}</p>

//               {item.vendors?.map((vendor, vi) => (
//                 <div key={vi} className="mb-4 border p-2 rounded bg-gray-50">
//                   <p>
//                     <strong>Vendor ID:</strong> {vendor.vendor_id}
//                   </p>
//                   <p>
//                     <strong>Unit Price:</strong> {vendor.unit_price}
//                   </p>
//                   <p>
//                     <strong>Total Price:</strong> {vendor.total_price}
//                   </p>

//                   <div className="mb-2">
//                     <p className="font-semibold">Previous Comments:</p>
//                     {vendor.comments?.length ? (
//                       vendor.comments.map((c, ci) => (
//                         <p key={ci}>
//                           <strong>{c.commented_by}:</strong> {c.comment}
//                         </p>
//                       ))
//                     ) : (
//                       <p>No comments</p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import axios from "axios";

// interface DepartmentStatus {
//   department_status: string;
//   department_comment: string;
//   status_updated_by?: number;
//   updated_at?: string;
// }

// interface VendorComment {
//   id?: number;
//   comment: string;
//   commented_by: number;
//   department_id?: number;
//   commented_at?: string;
// }

// interface Vendor {
//   id: number;
//   vendor_id: number;
//   status?: string;
//   unit_price?: number;
//   total_price?: number;
//   comments?: VendorComment[];
// }

// interface Item {
//   id: number;
//   item_code?: string;
//   item_name?: string;
//   quantity_required?: number;
//   vendors: Vendor[];
// }

// interface FinancePR {
//   id: string;
//   department?: string;
//   requested_by?: string;
//   description?: string;
//   priority?: string;
//   required_date?: string;
//   remarks?: string;
//   created_at?: string;
//   updated_at?: string;
//   department_statuses: DepartmentStatus[];
//   items: Item[];
// }

// export default function SubmittedFinanceRequestsPage() {
//   const API_BASE = "http://localhost:5001/api/new-finance";

//   const [requests, setRequests] = useState<FinancePR[]>([]);
//   const [selectedPR, setSelectedPR] = useState<FinancePR | null>(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [newComment, setNewComment] = useState("");

//   const FINANCE_STATUS_OPTIONS = [
//     "FINANCE APPROVED",
//     "FINANCE REJECTED",
//     "FINANCE PENDING",
//   ];

//   const [updateData, setUpdateData] = useState<{
//     department_statuses: DepartmentStatus[];
//     items: Item[];
//   }>({
//     department_statuses: [],
//     items: [],
//   });

//   const fetchApprovedRequests = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/approved-finance-requests`);
//       setRequests(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching approved finance requests:", err);
//       alert("Error fetching approved finance requests");
//     }
//   };

//   useEffect(() => {
//     fetchApprovedRequests();
//   }, []);

//   const selectPR = (prId: string) => {
//     const pr = requests.find((r) => r.id === prId);
//     if (!pr) {
//       setSelectedPR(null);
//       setUpdateData({ department_statuses: [], items: [] });
//       return;
//     }

//     setSelectedPR(pr);
//     setUpdateData({
//       department_statuses: pr.department_statuses || [],
//       items: pr.items.map((item) => ({
//         ...item,
//         vendors: item.vendors.map((v) => ({ ...v })),
//       })),
//     });

//     setNewStatus("");
//     setNewComment("");
//   };

//   const submitUpdate = async () => {
//     if (!selectedPR || !newStatus) {
//       alert("Please select a status");
//       return;
//     }

//     const payload = {
//       department_statuses: [
//         {
//           department_status: newStatus,
//           department_comment: newComment,
//           status_updated_by: 2, // your user id
//           updated_at: new Date().toISOString(),
//         },
//       ],
//       items: updateData.items,
//     };

//     try {
//       await axios.put(`${API_BASE}/finance-requests/${selectedPR.id}`, payload);
//       alert("Finance PR updated successfully");
//       fetchApprovedRequests();
//       setNewStatus("");
//       setNewComment("");
//     } catch (err) {
//       console.error("Error updating Finance PR:", err);
//       alert("Error updating Finance PR");
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen text-black">
//       <h1 className="text-3xl font-bold mb-6">Approved Finance Requests</h1>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Select a PR</h2>
//         <select
//           className="border p-2 rounded-lg w-full text-black"
//           onChange={(e) => selectPR(e.target.value)}
//           value={selectedPR?.id || ""}
//         >
//           <option value="">-- Select PR --</option>
//           {requests.map((pr) => (
//             <option key={pr.id} value={pr.id}>
//               {pr.id} - {pr.description || "No description"}
//             </option>
//           ))}
//         </select>
//       </div>

//       {!selectedPR && <p className="text-red-600">No PR selected</p>}

//       {selectedPR && (
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           {/* PR Details */}
//           <h2 className="text-xl font-semibold mb-4">PR Details</h2>
//           <div className="mb-4">
//             <p>
//               <strong>ID:</strong> {selectedPR.id}
//             </p>
//             <p>
//               <strong>Department:</strong> {selectedPR.department}
//             </p>
//             <p>
//               <strong>Description:</strong> {selectedPR.description}
//             </p>
//             <p>
//               <strong>Priority:</strong> {selectedPR.priority}
//             </p>
//             <p>
//               <strong>Required Date:</strong> {selectedPR.required_date}
//             </p>
//             <p>
//               <strong>Remarks:</strong> {selectedPR.remarks}
//             </p>
//           </div>

//           {/* Previous Department Statuses */}
//           <h3 className="font-bold mb-2">Previous Department Statuses</h3>
//           <div className="mb-4">
//             {updateData.department_statuses.length > 0 ? (
//               updateData.department_statuses.map((dep, i) => (
//                 <div key={i} className="mb-2 border p-2 rounded bg-gray-50">
//                   <p>
//                     <strong>Status:</strong> {dep.department_status}
//                   </p>
//                   <p>
//                     <strong>Comment:</strong>{" "}
//                     {dep.department_comment || "No comment"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Updated At:{" "}
//                     {dep.updated_at
//                       ? new Date(dep.updated_at).toLocaleString()
//                       : "-"}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p>No previous department statuses</p>
//             )}
//           </div>

//           {/* New Department Status + Comment */}
//           <h3 className="font-bold mb-2">Add New Department Status</h3>
//           <div className="flex gap-2 items-center mb-4">
//             <select
//               className="border p-2 rounded text-black"
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//             >
//               <option value="">-- Select Status --</option>
//               {["FINANCE APPROVED", "FINANCE REJECTED", "FINANCE PENDING"].map(
//                 (status) => (
//                   <option key={status} value={status}>
//                     {status}
//                   </option>
//                 )
//               )}
//             </select>

//             <input
//               type="text"
//               className="border p-2 rounded text-black flex-1"
//               placeholder="Add comment"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             />

//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               onClick={submitUpdate}
//             >
//               Add Status
//             </button>
//           </div>

//           {/* Items & Vendors (Read-Only) */}
//           <h3 className="font-bold mt-4 mb-2">Items & Vendors (Read-Only)</h3>
//           {updateData.items.map((item, i) => (
//             <div key={i} className="mb-4 border p-2 rounded">
//               <h4 className="font-semibold mb-1">
//                 {item.item_name || `Item ${i + 1}`} (Code: {item.item_code})
//               </h4>
//               <p>Quantity Required: {item.quantity_required}</p>

//               {item.vendors?.map((vendor, vi) => (
//                 <div key={vi} className="mb-4 border p-2 rounded bg-gray-50">
//                   <p>
//                     <strong>Vendor ID:</strong> {vendor.vendor_id}
//                   </p>
//                   <p>
//                     <strong>Unit Price:</strong> {vendor.unit_price}
//                   </p>
//                   <p>
//                     <strong>Total Price:</strong> {vendor.total_price}
//                   </p>

//                   <div className="mb-2">
//                     <p className="font-semibold">Previous Comments:</p>
//                     {vendor.comments?.map((c, ci) => (
//                       <p key={ci}>
//                         <strong>{c.commented_by}:</strong> {c.comment}
//                       </p>
//                     )) || <p>No comments</p>}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";

/* ================= TYPES ================= */

interface DepartmentStatus {
  department_status: string;
  department_comment: string;
  status_updated_by?: number;
  updated_at?: string;
}

interface VendorComment {
  id?: number;
  comment: string;
  commented_by: number;
  department_id?: number;
  commented_at?: string;
}

interface Vendor {
  id: number;
  vendor_id: number;
  status?: string;
  unit_price?: number;
  total_price?: number;
  comments?: VendorComment[];
}

interface Item {
  id: number;
  item_code?: string;
  item_name?: string;
  quantity_required?: number;
  vendors: Vendor[];
}

interface FinancePR {
  id: string;
  department?: string;
  requested_by?: string;
  description?: string;
  priority?: string;
  required_date?: string;
  remarks?: string;
  department_statuses: DepartmentStatus[];
  items: Item[];
}

/* ================= COMPONENT ================= */

export default function SubmittedFinanceRequestsPage({ onClose }) {
  const API_BASE = "http://localhost:5001/api/new-finance";

  const [requests, setRequests] = useState<FinancePR[]>([]);
  const [selectedPR, setSelectedPR] = useState<FinancePR | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");

  const FINANCE_STATUS_OPTIONS = [
    "PR APPROVED",
    "PR REJECTED",
    "PR PENDING",
  ];

  const [updateData, setUpdateData] = useState<{
    department_statuses: DepartmentStatus[];
    items: Item[];
  }>({
    department_statuses: [],
    items: [],
  });
  const [vendorUpdates, setVendorUpdates] = useState<{
    [key: string]: { status: string; comment: string };
  }>({});

  const updateVendorField = (
    itemIndex: number,
    vendorIndex: number,
    field: "status" | "comment",
    value: string
  ) => {
    const key = `${itemIndex}-${vendorIndex}`;
    setVendorUpdates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };
  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  /* ================= API ================= */

  const fetchApprovedRequests = async () => {
    const res = await axios.get(`${API_BASE}/approved-finance-requests`);
    setRequests(res.data.data || []);
  };

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  /* ================= HANDLERS ================= */

  const openPR = (pr: FinancePR) => {
    setSelectedPR(pr);
    setUpdateData({
      department_statuses: pr.department_statuses || [],
      items: pr.items || [],
    });
    setModalOpen(true);
    setNewStatus("");
    setNewComment("");
  };

  const submitUpdate = async () => {
    if (!selectedPR || !newStatus) {
      alert("Please select finance status");
      return;
    }

    const payload = {
      department_statuses: [
        {
          department_status: newStatus,
          department_comment: newComment,
          status_updated_by: 2,
          updated_at: new Date().toISOString(),
        },
      ],
      items: updateData.items,
    };

    await axios.put(
      `${API_BASE}/finance-approved-pr-requests/${selectedPR.id}`,

      payload
    );

    alert("Finance PR Updated");
    setModalOpen(false);
    onClose();
    fetchApprovedRequests();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 text-black">
      {/* FINANCE PR CARDS */}
      {/* ================= PR CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {requests.map((pr) => (
          <div
            key={pr.id}
            onClick={() => openPR(pr)}
            className="
        bg-white
        border border-gray-300
        rounded-xl
        shadow-sm
        hover:shadow-md
        transition-all
        p-6
        h-72
        cursor-pointer
        flex flex-col
      "
          >
            {/* HEADER */}
            <h2 className="text-purple-600 font-semibold text-lg mb-4">
              PR ID: {pr.id}
            </h2>

            {/* BODY */}
            <div className="flex-1 space-y-3 text-sm">
              <div className="grid grid-cols-[110px_1fr]">
                <span className="text-gray-500">Department</span>
                <span className="font-medium text-gray-800">
                  {pr.department || "-"}
                </span>
              </div>

              <div className="grid grid-cols-[110px_1fr]">
                <span className="text-gray-500">Priority</span>
                <span className="font-medium text-gray-800">
                  {pr.priority || "-"}
                </span>
              </div>

              <div className="grid grid-cols-[110px_1fr]">
                <span className="text-gray-500">Required</span>
                <span className="font-medium text-gray-800">
                  {formatDate(pr.required_date)}
                </span>
              </div>

              <div className="grid grid-cols-[110px_1fr]">
                <span className="text-gray-500">Description</span>
                <span className="font-medium text-gray-800 line-clamp-2">
                  {pr.description || "-"}
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <span className="text-blue-600 text-sm font-medium mt-4">
              Update
            </span>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && selectedPR && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50">
          <div className="bg-white w-full max-w-6xl rounded shadow-lg p-6 relative max-h-[85vh] overflow-y-auto">
            {/* CLOSE */}
            <button
              className="absolute -top-1 -right-1 text-2xl text-gray-600 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>

            {/* PR DETAILS */}
            <div className="bg-gray-100 p-4 rounded mb-4">
              <div className="grid grid-cols-5 gap-4">
                {[
                  ["Description", selectedPR.description],
                  ["Priority", selectedPR.priority],
                  [
                    "Required Delivery Date",
                    formatDate(selectedPR.required_date),
                  ],
                  ["Department", selectedPR.department],
                  ["Remarks", selectedPR.remarks],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <label className="text-xs font-medium">{label}</label>
                    <input
                      readOnly
                      value={value || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ITEMS TOGGLE */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setExpandItems(!expandItems)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
              >
                {expandItems ? "−" : "+"}
              </button>
            </div>

            {/* ITEMS */}
            {expandItems && (
              <div className="bg-gray-100 p-4 rounded mb-4 space-y-6">
                {updateData.items.map((item, i) => (
                  <div key={i} className="rounded-lg p-4">
                    {/* ================= ITEM HEADER ================= */}
                    <div className="bg-gray-200 rounded-lg flex items-center gap-6 mb-4 py-4 min-h-[64px]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Item Code</span>
                        <div className="bg-white px-4 py-2 rounded border">
                          {item.item_code}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-semibold">
                          Description
                        </span>
                        <div className="bg-white px-4 py-2 rounded border w-full">
                          {item.item_name}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Qty</span>
                        <div className="bg-white px-4 py-2 rounded border">
                          {item.quantity_required} units
                        </div>
                      </div>
                    </div>

                    {/* ================= VENDOR HEADER ================= */}
                    <div className="grid grid-cols-8 gap-3 text-sm font-medium text-gray-700 mb-2">
                      <div>Vendor</div>
                      <div>Unit Price</div>
                      <div>Total Price</div>
                      <div>Quotation Validity</div>
                      <div>Attachments</div>
                      <div>Comments</div>
                      <div>Comments by Feasibility</div>
                      <div>Status</div>
                    </div>

                    {/* ================= VENDOR ROWS ================= */}
                    {item.vendors.map((vendor, vi) => {
                      const key = `${i}-${vi}`;
                      const vendorData = vendorUpdates[key] || {
                        status: "",
                        comment: "",
                      };

                      return (
                        <div key={vi} className="grid grid-cols-8 gap-3 mb-2">
                          {/* Vendor */}
                          <input
                            readOnly
                            value={vendor.vendor_id || ""}
                            className="border rounded px-2 py-1 bg-white"
                          />

                          {/* Unit Price */}
                          <input
                            readOnly
                            value={vendor.unit_price ?? ""}
                            className="border rounded px-2 py-1 bg-white"
                          />

                          {/* Total Price */}
                          <input
                            readOnly
                            value={vendor.total_price ?? ""}
                            className="border rounded px-2 py-1 bg-white"
                          />

                          {/* Validity */}
                          <div className="border rounded px-2 py-1 bg-white text-sm text-center">
                            {(vendor as any).validity
                              ? new Date(
                                  (vendor as any).validity
                                ).toLocaleDateString()
                              : ""}
                          </div>

                          {/* Attachments */}
                          <div className="border rounded px-2 py-1 bg-white text-sm text-center">
                            {(vendor as any).attachment ? (
                              <a
                                href={(vendor as any).attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {(vendor as any).attachment.split("/").pop()}
                              </a>
                            ) : (
                              ""
                            )}
                          </div>

                          {/* ADD COMMENT (same as bottom) */}
                          <input
                            placeholder="Enter comment"
                            value={vendorData.comment}
                            onChange={(e) =>
                              updateVendorField(
                                i,
                                vi,
                                "comment",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1 bg-white"
                          />

                          {/* COMMENTS BY FEASIBILITY (readonly existing) */}
                          <input
                            readOnly
                            value={vendor.comments?.[0]?.comment || ""}
                            className="border rounded px-2 py-1 bg-white"
                          />

                          {/* ADD STATUS (same dropdown as bottom) */}
                          <select
                            value={vendorData.status}
                            onChange={(e) =>
                              updateVendorField(i, vi, "status", e.target.value)
                            }
                            className="border rounded px-2 py-1 bg-white font-medium"
                          >
                            <option value="">Select Status</option>
                            {FINANCE_STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* STATUS TOGGLE */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setExpandStatus(!expandStatus)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
              >
                {expandStatus ? "−" : "+"}
              </button>
            </div>

            <div className="border-1 border-gray-200 rounded p-4 mb-4">
              <h3 className="font-semibold">Statuses</h3>

              {/* STATUS SECTION */}
              {expandStatus && (
                <div className="p-4 rounded">
                  {/* EXISTING STATUSES */}
                  {updateData.department_statuses.map((s, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 p-4 rounded mb-4 flex justify-between items-start"
                    >
                      {/* LEFT */}
                      <div className="flex flex-col gap-1">
                        <p>
                          <strong>Status:</strong> {s.department_status}
                        </p>
                        <p>
                          <strong>Comment:</strong> {s.department_comment}
                        </p>
                      </div>

                      {/* RIGHT */}
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Arjun</span>
                        <span>
                          {s.updated_at
                            ? new Date(s.updated_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* ADD STATUS + COMMENT (ALWAYS BELOW STATUSES) */}
                  <div className="bg-gray-200 rounded p-4 mt-2">
                    {/* Labels */}
                    <div className="grid grid-cols-2 gap-4 mb-1">
                      <span className="text-sm font-medium">Add Status</span>
                      <span className="text-sm font-medium">Add Comment</span>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="bg-white border p-2 rounded"
                      >
                        <option value="">Select Finance Status</option>
                        {FINANCE_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Enter comment"
                        className="bg-white border p-2 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPDATE */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={submitUpdate}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Update Finance PR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
