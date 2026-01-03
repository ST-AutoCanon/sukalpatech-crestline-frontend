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

// interface StorePR {
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

// export default function SubmittedStoreRequestsPage() {
//   const API_BASE = "http://localhost:5001/api/new-store";

//   const [requests, setRequests] = useState<StorePR[]>([]);
//   const [selectedPR, setSelectedPR] = useState<StorePR | null>(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [newComment, setNewComment] = useState("");

//   const STORE_STATUS_OPTIONS = [
//     "STORE APPROVED",
//     "STORE REJECTED",
//     "STORE PENDING",
//   ];

//   const [updateData, setUpdateData] = useState<{
//     department_statuses: DepartmentStatus[];
//     items: Item[];
//   }>({
//     department_statuses: [],
//     items: [],
//   });

//   const fetchFinanceApprovedStoreRequests = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/finance-approved-store-requests`
//       );
//       setRequests(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching finance-approved store requests:", err);
//       alert("Error fetching store requests");
//     }
//   };

//   useEffect(() => {
//     fetchFinanceApprovedStoreRequests();
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
//       await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload);
//       alert("Store PR updated successfully");
//       fetchFinanceApprovedStoreRequests();
//       setNewStatus("");
//       setNewComment("");
//     } catch (err) {
//       console.error("Error updating Store PR:", err);
//       alert("Error updating Store PR");
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen text-black">
//       <h1 className="text-3xl font-bold mb-6">
//         Finance-Approved Store Requests
//       </h1>

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

//           <h3 className="font-bold mb-2">Add New Department Status</h3>
//           <div className="flex gap-2 items-center mb-4">
//             <select
//               className="border p-2 rounded text-black"
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//             >
//               <option value="">-- Select Status --</option>
//               {STORE_STATUS_OPTIONS.map((status) => (
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

interface StorePR {
  id: string;
  department?: string;
  requested_by?: string;
  description?: string;
  priority?: string;
  required_date?: string;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
  department_statuses: DepartmentStatus[];
  items: Item[];
}

export default function SubmittedStoreRequestsPage() {
  const API_BASE = "http://localhost:5001/api/new-store";

  const [requests, setRequests] = useState<StorePR[]>([]);
  const [selectedPR, setSelectedPR] = useState<StorePR | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const STORE_STATUS_OPTIONS = [
    "STORE APPROVED",
    "STORE REJECTED",
    "STORE PENDING",
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

  const fetchFinanceApprovedStoreRequests = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/finance-approved-store-requests`
      );
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching finance-approved store requests:", err);
      alert("Error fetching store requests");
    }
  };

  useEffect(() => {
    fetchFinanceApprovedStoreRequests();
  }, []);

  const selectPR = (pr: StorePR) => {
    setSelectedPR(pr);
    setUpdateData({
      department_statuses: pr.department_statuses || [],
      items: pr.items.map((item) => ({
        ...item,
        vendors: item.vendors.map((v) => ({ ...v })),
      })),
    });
    setNewStatus("");
    setNewComment("");
    setModalOpen(true);
  };

  const submitUpdate = async () => {
    if (!selectedPR || !newStatus) {
      alert("Please select a status");
      return;
    }

    const payload = {
      department_statuses: [
        {
          department_status: newStatus,
          department_comment: newComment,
          status_updated_by: 2, // replace with actual user ID
          updated_at: new Date().toISOString(),
        },
      ],
      items: updateData.items,
    };

    try {
      await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload);
      alert("Store PR updated successfully");
      fetchFinanceApprovedStoreRequests();
      setNewStatus("");
      setNewComment("");
      setModalOpen(false);
    } catch (err) {
      console.error("Error updating Store PR:", err);
      alert("Error updating Store PR");
    }
  };
  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  return (
    <div className=" text-black">
      {/* ================= PR CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {requests.map((pr) => (
          <div
            key={pr.id}
            onClick={() => selectPR(pr)}
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

      {/* MODAL */}
      {modalOpen && selectedPR && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50">
          <div className="bg-white w-full max-w-6xl rounded shadow-lg relative max-h-[90vh] flex flex-col">
            <div className="overflow-y-auto p-6 flex-1">
              {/* CLOSE BUTTON */}
              <button
                className="absolute top-3 right-4 text-xl"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>

              {/* HEADER */}
              <h2 className="text-2xl font-bold mb-4 text-violet-600">
                Update Store
              </h2>

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
                    ["Requesting Department", selectedPR.department],
                    ["Remarks", selectedPR.remarks],
                  ].map(([label, value], i) => (
                    <div key={i}>
                      <label className="text-xs font-medium mb-1 block">
                        {label}
                      </label>
                      <input
                        readOnly
                        value={value || ""}
                        className="border p-2 rounded w-full bg-white mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ITEMS TOGGLE */}
              <div className="flex justify-end mb-1">
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
                          <span className="text-sm font-semibold">
                            Item Code
                          </span>
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
                                updateVendorField(
                                  i,
                                  vi,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 bg-white font-medium"
                            >
                              <option value="">Select Status</option>
                              {STORE_STATUS_OPTIONS.map((status) => (
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
              <div className="flex justify-end mb-1">
                <button
                  onClick={() => setExpandStatus(!expandStatus)} // ✅ Correct: toggles status section
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
                >
                  {expandStatus ? "−" : "+"}
                </button>
              </div>

              {/* STATUS SECTION */}
              {expandStatus && (
                <div className=" p-4 rounded mb-4 pt-2">
                  <span className="text-gray-900 font-semibold mb-2 block">
                    Statuses
                  </span>

                  {updateData.department_statuses.map((s, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 p-3 rounded mb-3 flex justify-between items-start"
                    >
                      {/* Left side: Status + Comment stacked */}
                      <div className="flex flex-col text-sm text-gray-600 gap-1">
                        <p>
                          <strong>Status:</strong> {s.department_status}
                        </p>
                        <p>
                          <strong>Comment:</strong> {s.department_comment}
                        </p>
                      </div>

                      {/* Right side: Name + Date in one row */}
                      <div className="flex text-sm text-gray-600 gap-2 items-center">
                        <span>Arjun</span>
                        <span>
                          {s.updated_at
                            ? new Date(s.updated_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* ADD STATUS / COMMENT BOX */}
                  <div className="bg-gray-200 rounded p-4 mt-4">
                    {/* Labels Row */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <span className="text-sm font-medium">Add Status</span>
                      <span className="text-sm font-medium">Add Comment</span>
                    </div>

                    {/* Inputs Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        className="bg-white border p-2 rounded"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select</option>
                        {STORE_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Enter comment"
                        className="bg-white border p-2 rounded"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPDATE BUTTON */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={submitUpdate}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Update PR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
