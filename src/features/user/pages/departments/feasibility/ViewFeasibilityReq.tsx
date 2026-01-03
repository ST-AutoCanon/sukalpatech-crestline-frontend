// import { useEffect, useState } from "react";

// type DepartmentStatus = {
//   department_status: string;
//   department_comment: string;
//   status_updated_by: number;
//   updated_at: string;
// };

// type VendorComment = {
//   id: number;
//   comment: string;
//   commented_at: string;
//   commented_by: number;
// };

// type VendorAttachment = {
//   id: number;
//   file_name: string;
//   file_path: string;
//   uploaded_by: number;
//   uploaded_at: string;
// };

// type Vendor = {
//   id: number;
//   vendor_id: number;
//   status: string;
//   unit_price: number;
//   total_price: number;
//   quotation_validity_date: string;
//   vendor_status_updated_by: number;
//   comments: VendorComment[];
//   attachments: VendorAttachment[];
// };

// type Item = {
//   id: number;
//   item_code: string;
//   item_name: string;
//   quantity_required: number;
//   vendors: Vendor[];
// };

// type PR = {
//   id: string;
//   department: string;
//   requested_by: string;
//   description: string;
//   priority: string;
//   required_date: string;
//   remarks: string;
//   created_at: string;
//   updated_at: string;
//   department_statuses: DepartmentStatus[];
//   items: Item[];
// };

// export default function ViewPRPage() {
//   const [prs, setPrs] = useState<PR[]>([]);
//   const [expanded, setExpanded] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("http://localhost:5001/api/new-feasibility/submitted-requests")
//       .then((res) => res.json())
//       .then((data) => setPrs(data?.data || []))
//       .catch((err) => console.error("Fetch PR Error:", err));
//   }, []);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Purchase Requests</h1>

//       {prs.map((pr) => (
//         <div
//           key={pr.id}
//           className="bg-white rounded-xl shadow-md mb-6 p-6 border border-gray-200"
//         >
//           {/* ================= BASIC CARD ================= */}
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">PR #{pr.id}</h2>

//             <button
//               className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//               onClick={() => setExpanded(expanded === pr.id ? null : pr.id)}
//             >
//               {expanded === pr.id ? "Hide Info" : "More Info"}
//             </button>
//           </div>

//           <div className="mt-3 grid grid-cols-2 gap-4">
//             <p>
//               <strong>Requested By:</strong> {pr.requested_by}
//             </p>
//             <p>
//               <strong>Priority:</strong> {pr.priority}
//             </p>

//             <p>
//               <strong>Required Date:</strong>{" "}
//               {new Date(pr.required_date).toLocaleDateString()}
//             </p>

//             <p>
//               <strong>Created At:</strong>{" "}
//               {new Date(pr.created_at).toLocaleString()}
//             </p>

//             <p className="col-span-2">
//               <strong>Description:</strong> {pr.description}
//             </p>

//             <p className="col-span-2">
//               <strong>Remarks:</strong> {pr.remarks}
//             </p>
//           </div>

//           {/* ================= EXPANDED DETAILS ================= */}
//           {expanded === pr.id && (
//             <div className="mt-6 border-t pt-4">
//               {/* ---------- Department Statuses ---------- */}
//               <h3 className="text-lg font-semibold mb-2">
//                 Department Statuses
//               </h3>

//               {pr.department_statuses?.length ? (
//                 pr.department_statuses.map((d, idx) => (
//                   <div key={idx} className="bg-gray-50 p-3 rounded border mb-2">
//                     <p>
//                       <strong>Status:</strong> {d.department_status}
//                     </p>
//                     <p>
//                       <strong>Comment:</strong> {d.department_comment}
//                     </p>
//                     <p>
//                       <strong>Updated By:</strong> {d.status_updated_by}
//                     </p>
//                     <p>
//                       <strong>Updated At:</strong>{" "}
//                       {new Date(d.updated_at).toLocaleString()}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No department statuses</p>
//               )}

//               {/* ---------- Items + Vendors ---------- */}
//               <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>

//               {pr.items?.map((item) => (
//                 <div key={item.id} className="border rounded p-3 mb-3">
//                   <p>
//                     <strong>Item:</strong> {item.item_name} ({item.item_code})
//                   </p>
//                   <p>
//                     <strong>Quantity:</strong> {item.quantity_required}
//                   </p>

//                   <h4 className="font-semibold mt-2">Vendors</h4>

//                   {item.vendors.map((v) => (
//                     <div
//                       key={v.id}
//                       className="bg-gray-50 p-2 mb-2 rounded border"
//                     >
//                       <p>
//                         <strong>Vendor ID:</strong> {v.vendor_id}
//                       </p>
//                       <p>
//                         <strong>Status:</strong> {v.status || "-"}
//                       </p>
//                       <p>
//                         <strong>Unit Price:</strong> {v.unit_price}
//                       </p>
//                       <p>
//                         <strong>Total Price:</strong> {v.total_price}
//                       </p>
//                       <p>
//                         <strong>Validity:</strong> {v.quotation_validity_date}
//                       </p>

//                       {/* Comments */}
//                       <p className="mt-2 font-semibold">Comments</p>
//                       {v.comments?.length ? (
//                         v.comments.map((c) => (
//                           <p key={c.id} className="text-sm">
//                             • {c.comment}
//                           </p>
//                         ))
//                       ) : (
//                         <p className="text-gray-500 text-sm">No comments</p>
//                       )}

//                       {/* Attachments */}
//                       <p className="mt-2 font-semibold">Attachments</p>
//                       {v.attachments?.length ? (
//                         v.attachments.map((a) => (
//                           <p key={a.id} className="text-sm">
//                             • {a.file_name}
//                           </p>
//                         ))
//                       ) : (
//                         <p className="text-gray-500 text-sm">No attachments</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }



import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

type DepartmentStatus = {
  department_status: string;
  department_comment: string;
  status_updated_by: number;
  updated_at: string;
};

type VendorComment = {
  id: number;
  comment: string;
  commented_at: string;
  commented_by: number;
};

type VendorAttachment = {
  id: number;
  file_name: string;
  file_path: string;
  uploaded_by: number;
  uploaded_at: string;
};

type Vendor = {
  id: number;
  vendor_id: number;
  status: string;
  unit_price: number;
  total_price: number;
  quotation_validity_date: string;
  vendor_status_updated_by: number;
  comments: VendorComment[];
  attachments: VendorAttachment[];
};

type Item = {
  id: number;
  item_code: string;
  item_name: string;
  quantity_required: number;
  vendors: Vendor[];
};

type PR = {
  id: string;
  department: string;
  requested_by: string;
  description: string;
  priority: string;
  required_date: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  department_statuses: DepartmentStatus[];
  items: Item[];
};

export default function ViewPRPage() {
  const [prs, setPrs] = useState<PR[]>([]);
  const [activePR, setActivePR] = useState<PR | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [showStatus, setShowStatus] = useState(true);
  const [loading, setLoading] = useState(true);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  useEffect(() => {
    fetch("http://localhost:5001/api/new-feasibility/submitted-requests")
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err));
  }, []);

  return (
    <>
      {/* ===== PR CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => {
          const status =
            pr.department_statuses?.[0]?.department_status?.toLowerCase();

          return (
            <div
              key={pr.id}
              className="bg-white rounded-2xl shadow-lg p-6 relative"
            >
              <h2 className="text-lg font-semibold text-purple-600">
                FEAS-{pr.id}
              </h2>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span>{pr.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span>{pr.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span>
                    {pr.department_statuses?.[0]?.department_status || "Draft"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Required Date</span>
                  <span>{new Date(pr.required_date).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => setActivePR(pr)}
                className="mt-4 text-sm font-medium text-blue-600"
              >
                More Info
              </button>
            </div>
          );
        })}
      </div>

      {/* ===== MODAL ===== */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-7xl rounded-xl shadow-xl p-6 text-black">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-violet-600">
                View Feasibility
              </h2>

              <button
                onClick={() => setActivePR(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* PR Info Section */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-black">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-sm font-medium mb-2">
                <span>Description</span>
                <span>Priority</span>
                <span>Required Delivery Date</span>
                <span>Department</span>
                <span>Remarks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <button className="bg-white border rounded px-3 py-2 text-left">
                  {activePR.description || "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left">
                  {activePR.priority || "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left">
                  {activePR.required_date
                    ? new Date(activePR.required_date).toLocaleDateString()
                    : "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left">
                  {activePR.department || "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left">
                  {activePR.remarks || "-"}
                </button>
              </div>
            </div>

            {/* Items + Vendors Section */}
            {activePR.items?.map((item) => (
              <div key={item.id} className="mb-6">
                <div className="flex justify-end mb-1">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
                  >
                    {expandedItems[item.id] ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  {expandedItems[item.id] && (
                    <>
                      {/* Item header */}
                      <div className="bg-gray-200 rounded-lg p-3 mb-4 flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Item Code</span>
                          <div className="bg-white border rounded px-3 py-1">
                            {item.item_code || "-"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="font-medium">Description</span>
                          <div className="bg-white border rounded px-3 py-1 w-full">
                            {item.item_name || "-"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Qty</span>
                          <div className="bg-white border rounded px-3 py-1">
                            {item.quantity_required ?? "-"} units
                          </div>
                        </div>
                      </div>

                      {/* Vendors */}
                      {item.vendors?.map((vendor, index) => (
                        <div key={vendor.id} className="mb-4">
                          {index === 0 && (
                            <div className="grid grid-cols-6 gap-4 text-xs font-medium mb-1 text-gray-700">
                              <span>Vendor</span>
                              <span>Upload Quotation</span>
                              <span>Unit Price</span>
                              <span>Total Price</span>
                              <span>Quotation Validity</span>
                              <span>Comments</span>
                            </div>
                          )}

                          <div className="grid grid-cols-6 gap-4">
                            <select className="bg-white border rounded px-2 py-1 text-sm">
                              <option>{vendor.vendor_id || "-"}</option>
                            </select>
                            <input
                              type="text"
                              value={vendor.attachments?.[0]?.file_name || ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              value={vendor.unit_price ?? ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              value={vendor.total_price ?? ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              value={
                                vendor.quotation_validity_date
                                  ? new Date(
                                      vendor.quotation_validity_date
                                    ).toLocaleDateString()
                                  : ""
                              }
                              readOnly
                              className="bg-white border rounded px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              value={
                                vendor.comments
                                  ?.map((c) => c.comment)
                                  .join(", ") || ""
                              }
                              readOnly
                              className="bg-white border rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* ===== Department Statuses ===== */}
            <div className="mb-6">
              {/* Max / Min button ABOVE border */}
              <div className="flex justify-end mt-2 mb-2">
                <button
                  onClick={() => setShowStatus((prev) => !prev)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
                >
                  {showStatus ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>

              {/* Black border container */}
              <div className="border-2 border-black rounded-lg p-4">
                <h3 className="font-semibold text-base mb-3">Statuses</h3>

                {showStatus && (
                  <div className="space-y-4">
                    {activePR.department_statuses?.map((ds, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                      >
                        <div className="flex justify-between mb-1 text-xs text-gray-600">
                          <span className="font-medium">
                            Status: {ds.department_status}
                          </span>
                          <span className="font-medium text-gray-800">
                            Arjun •{" "}
                            {new Date(ds.updated_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Comment:</span>{" "}
                          {ds.department_comment}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

