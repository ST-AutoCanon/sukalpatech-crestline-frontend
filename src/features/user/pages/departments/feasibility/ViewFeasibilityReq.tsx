// import { Minus, Plus, X } from "lucide-react";
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../../../../../context/AuthContext";

// type DepartmentStatus = {
//   department_status: string;
//   department_comment: string;
//   status_updated_by: string;
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
//   vendor_id: string;
//   id: number;
//   vendor_name: string;
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
//   const { user, token } = useContext(AuthContext);
//   const [prs, setPrs] = useState<PR[]>([]);
//   const [activePR, setActivePR] = useState<PR | null>(null);
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
//   const [showStatus, setShowStatus] = useState(true);


//   const toggleItem = (itemId: string) => {
//     setExpandedItems((prev) => ({
//       ...prev,
//       [itemId]: !prev[itemId],
//     }));
//   };
//   useEffect(() => {
//     // Fetch vendor master
//     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`)
//       .then((res) => res.json())
//       .then((data) => {
//         const map: Record<string, string> = {};
//         (data?.data || []).forEach((v: any) => {
//           map[String(v.vendor_id)] = v.vendor_name;
//         });
//         setVendorMap(map);
//       })
//       .catch((err) => console.error("Vendor fetch error:", err));
//   }, []);


//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility/submitted-requests`)
//       .then((res) => res.json())
//       .then((data) => setPrs(data?.data || []))
//       .catch((err) => console.error("Fetch PR Error:", err));
//   }, []);

//   const [updateData, setUpdateData] = useState<{
//     department_statuses: DepartmentStatus[];
//     items: Item[];
//   }>({
//     department_statuses: [],
//     items: [],
//   });

//   const [vendorUpdates, setVendorUpdates] = useState<{
//     [key: string]: { status: string; comment: string };
//   }>({});

//   const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
//   const [departmentMap, setDepartmentMap] = useState<Record<string, string>>(
//     {}
//   );


//   return (
//     <>
//       {/* ===== PR CARDS ===== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {prs.map((pr) => (
//           <div
//             key={pr.id}
//             className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 relative flex flex-col min-h-[220px] cursor-pointer hover:shadow-md transition"
//             onClick={() => setActivePR(pr)}
//           >
//             <h2 className="text-lg font-semibold text-purple-600 truncate">
//               PR ID:{pr.id}
//             </h2>

//             <div className="mt-3 space-y-2 text-sm">
//               <div className="flex gap-2">
//                 <span className="text-gray-400 w-32 shrink-0">Department:</span>
//                 <span className="text-gray-900 truncate">
//                   {pr.department || "-"}
//                 </span>
//               </div>

//               <div className="flex gap-2">
//                 <span className="text-gray-400 w-32 shrink-0">Priority:</span>
//                 <span className="text-gray-900">{pr.priority || "-"}</span>
//               </div>

//               <div className="flex gap-2">
//                 <span className="text-gray-400 w-32 shrink-0">Status:</span>
//                 <span className="text-gray-900">
//                   {pr.department_statuses?.[0]?.department_status || "Draft"}
//                 </span>
//               </div>

//               <div className="flex gap-2">
//                 <span className="text-gray-400 w-32 shrink-0">
//                   Required Date:
//                 </span>
//                 <span className="text-gray-900">
//                   {pr.required_date
//                     ? new Date(pr.required_date).toLocaleDateString()
//                     : "-"}
//                 </span>
//               </div>
//             </div>

//             <button className="mt-3 text-sm font-medium text-blue-600 text-left">
//               More Info
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* ===== MODAL ===== */}
//       {activePR && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
//           <div className="bg-white w-full max-w-5xl md:max-w-7xl rounded-xl shadow-xl p-4 md:p-6 text-black flex flex-col">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4 md:mb-6">
//               <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
//                 View PR-{activePR.id} info
//               </h2>
//               <button
//                 onClick={() => setActivePR(null)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* PR Info */}
//             <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4 mt-2">
//               {/* Mobile view */}
//               <div className="space-y-3 sm:hidden text-sm">
//                 <div>
//                   <div className="text-gray-900">Description</div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.description || "-"}
//                   </div>
//                 </div>

//                 <div>
//                   <div className="text-gray-900">Priority</div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.priority || "-"}
//                   </div>
//                 </div>

//                 <div>
//                   <div className="text-gray-900">Required Delivery Date</div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.required_date
//                       ? new Date(activePR.required_date).toLocaleDateString()
//                       : "-"}
//                   </div>
//                 </div>

//                 <div>
//                   <div className="text-gray-900">Department</div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.department || "-"}
//                   </div>
//                 </div>

//                 <div>
//                   <div className="text-gray-900">Remarks</div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.remarks || "-"}
//                   </div>
//                 </div>
//               </div>

//               {/* Desktop view */}
//               <div className="hidden sm:block overflow-x-auto">
//                 <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-2">
//                   <span>Description</span>
//                   <span>Priority</span>
//                   <span>Required Delivery Date</span>
//                   <span>Department</span>
//                   <span>Remarks</span>
//                 </div>
//                 <div className="grid grid-cols-5 gap-4">
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.description || "-"}
//                   </div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.priority || "-"}
//                   </div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.required_date
//                       ? new Date(activePR.required_date).toLocaleDateString()
//                       : "-"}
//                   </div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.department || "-"}
//                   </div>
//                   <div className="bg-white border rounded px-2 py-1">
//                     {activePR.remarks || "-"}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Items Section Toggle */}
//             <div className="flex justify-end mb-2">
//               <button
//                 onClick={() => setShowStatus((prev) => !prev)}
//                 className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded flex items-center"
//               >
//                 {showStatus ? <Minus size={16} /> : <Plus size={16} />}
//               </button>
//             </div>

//             {/* Items */}
//             {showStatus && (
//               <div className="space-y-4">
//                 {activePR.items?.map((item) => (
//                   <div
//                     key={item.id}
//                     className="bg-gray-100 rounded-lg p-3 md:p-4 w-full overflow-x-auto"
//                   >
//                     {/* Item header */}
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 text-sm">
//                       {/* Item Code */}
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium w-24 shrink-0">
//                           Item Code
//                         </span>
//                         <div className="bg-white border rounded px-4 py-1 flex-1">
//                           {item.item_code || "-"}
//                         </div>
//                       </div>

//                       {/* Description */}
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium w-24 shrink-0">
//                           Description
//                         </span>
//                         <div className="bg-white border rounded px-2 py-1 flex-1 truncate">
//                           {item.item_name || "-"}
//                         </div>
//                       </div>

//                       {/* Qty */}
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium w-24 shrink-0">Qty</span>
//                         <div className="bg-white border rounded px-4 py-1 flex-1">
//                           {item.quantity_required ?? "-"}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Vendors */}
//                     <div className="overflow-x-auto">
//                       {item.vendors?.length > 0 && (
//                         <>
//                           {/* Desktop labels (sm and above) */}
//                           <div className="hidden sm:grid sm:grid-cols-6 gap-4 text-xs font-medium mb-1 text-gray-700">
//                             <span>Vendor</span>
//                             <span>Upload Quotation</span>
//                             <span>Unit Price</span>
//                             <span>Total Price</span>
//                             <span>Quotation Validity</span>
//                             <span>Comments</span>
//                           </div>

//                           {/* Desktop values */}
//                           {item.vendors?.map((vendor) => (
//                             <div
//                               key={vendor.id}
//                               className="hidden sm:grid sm:grid-cols-6 gap-4 text-sm mb-4"
//                             >
//                               <input
//                                 type="text"
//                                 value={
//                                   vendorMap[String(vendor.vendor_id)] ??
//                                   vendor.vendor_id
//                                 }
//                                 readOnly
//                                 className="bg-white border rounded px-2 py-1 w-full"
//                                 placeholder="Vendor"
//                               />

//                               <input
//                                 type="text"
//                                 value={vendor.attachments?.[0]?.file_name || ""}
//                                 readOnly
//                                 className="bg-white border rounded px-2 py-1 w-full"
//                               />
//                               <input
//                                 type="text"
//                                 value={vendor.unit_price ?? ""}
//                                 readOnly
//                                 className="bg-white border rounded px-2 py-1 w-full"
//                               />
//                               <input
//                                 type="text"
//                                 value={vendor.total_price ?? ""}
//                                 readOnly
//                                 className="bg-white border rounded px-2 py-1 w-full"
//                               />
//                               <input
//                                 type="text"
//                                 value={
//                                   vendor.quotation_validity_date
//                                     ? new Date(
//                                         vendor.quotation_validity_date
//                                       ).toLocaleDateString()
//                                     : ""
//                                 }
//                                 readOnly
//                                 className="bg-white border rounded px-2 py-1 w-full"
//                               />
//                               <input
//                                 type="text"
//                                 value={
//                                   vendor.comments
//                                     ?.map((c) => c.comment)
//                                     .join(", ") || ""
//                                 }
//                                 readOnly
//                                 className="bg-white border rounded px-2 py-1 w-full"
//                               />
//                             </div>
//                           ))}

//                           {/* Mobile view */}
//                           {item.vendors?.map((vendor) => (
//                             <div
//                               key={vendor.id}
//                               className="mb-4 sm:hidden flex flex-row gap-4 overflow-x-auto"
//                             >
//                               {[
//                                 [
//                                   "Vendor",
//                                   vendorMap[String(vendor.vendor_id)] ??
//                                     vendor.vendor_id,
//                                 ],
//                                 [
//                                   "Upload Quotation",
//                                   vendor.attachments?.[0]?.file_name || "-",
//                                 ],
//                                 ["Unit Price", vendor.unit_price ?? "-"],
//                                 ["Total Price", vendor.total_price ?? "-"],
//                                 [
//                                   "Quotation Validity",
//                                   vendor.quotation_validity_date
//                                     ? new Date(
//                                         vendor.quotation_validity_date
//                                       ).toLocaleDateString()
//                                     : "-",
//                                 ],
//                                 [
//                                   "Comments",
//                                   vendor.comments
//                                     ?.map((c) => c.comment)
//                                     .join(", ") || "-",
//                                 ],
//                               ].map(([label, value], idx) => (
//                                 <div
//                                   key={idx}
//                                   className="flex flex-col min-w-[120px]"
//                                 >
//                                   <span className="text-gray-500 text-xs">
//                                     {label}
//                                   </span>
//                                   <input
//                                     type="text"
//                                     value={value}
//                                     readOnly
//                                     className="bg-white px-2 py-1 w-full"
//                                   />
//                                 </div>
//                               ))}
//                             </div>
//                           ))}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Statuses Section */}
//             <div className="mb-6">
//               <div className="flex justify-end mt-2 mb-2">
//                 <button
//                   onClick={() => setShowStatus((prev) => !prev)}
//                   className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
//                 >
//                   {showStatus ? <Minus size={16} /> : <Plus size={16} />}
//                 </button>
//               </div>

//               <div className="border border-gray-300 rounded-lg p-4 overflow-x-auto">
//                 <h3 className="font-semibold text-base mb-3">Statuses</h3>

//                 {showStatus && (
//                   <div className="space-y-4 min-w-[350px] sm:min-w-[500px]">
//                     {activePR.department_statuses?.map((ds, idx) => (
//                       <div
//                         key={idx}
//                         className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
//                       >
//                         <div className="flex flex-col sm:flex-row justify-between mb-1 text-xs text-gray-600">
//                           <span className="font-medium">
//                             Status: {ds.department_status}
//                           </span>
//                           {ds.status_updated_by ?? "—"} •{" "}
//                           <span className="font-medium text-gray-800">
//                             {new Date(ds.updated_at).toLocaleDateString()}
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-600">
//                           <span className="font-medium">Comment:</span>{" "}
//                           {ds.department_comment}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useContext, useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { AuthContext } from "../../../../../context/AuthContext";

type Props = {
  filter: string;
  search: string;
  refreshKey: number;
};


type DepartmentStatus = {
  department_status: string;
  department_comment: string;
  status_updated_by: string;
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
  vendor_id: string;
  id: number;
  vendor_name: string;
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

export default function ViewPRPage({ filter, search, refreshKey }: Props) {
  const { user, token } = useContext(AuthContext);
  const [prs, setPrs] = useState<PR[]>([]);
  const [activePR, setActivePR] = useState<PR | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showStatus, setShowStatus] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPRs = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;
      if (filter === "Pending" || filter === "Rejected" || filter === "Completed") {
        const status = filter === "Completed" ? "APPROVED" : filter.toUpperCase();
        url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/prs/status/${status}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      const prsData = (data?.data || []).map((pr: PR) => ({
        ...pr,
        items: pr.items || [],
        department_statuses: pr.department_statuses || [],
      }));
      setPrs(prsData);
    } catch (err) {
      console.error("Fetch PR error", err);
      setPrs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs();
  }, [filter, search, refreshKey]);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };
  useEffect(() => {
    // Fetch vendor master
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`)
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, string> = {};
        (data?.data || []).forEach((v: any) => {
          map[String(v.vendor_id)] = v.vendor_name;
        });
        setVendorMap(map);
      })
      .catch((err) => console.error("Vendor fetch error:", err));
  }, []);


  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility/submitted-requests`)
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err));
  }, []);

  //  const isEditable = (pr: PR) => {
  //   if (filter !== "PR Raised") return false;
  //   const latestStatus = pr.department_statuses?.[pr.department_statuses.length - 1]?.department_status;
  //   return latestStatus === "CREATED";
  // };



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

  const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>(
    {}
  );
  const toggleItemsSection = () => setShowItems((prev) => !prev);

  if (loading) return <div className="p-6">Loading PRs...</div>;


  return (
    <>
      {/* PR Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => {
          const latestStatusObj = pr.department_statuses?.[pr.department_statuses.length - 1];
          const status = latestStatusObj?.department_status || "Draft";

          return (
            <div
              key={pr.id}
              className="relative bg-white rounded-xl p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
              onClick={() => setActivePR(pr)}
            >
              <h3 className="text-purple-600 font-semibold text-lg mb-2 truncate">PR ID:{pr.id}</h3>
              <div className="space-y-1 text-sm flex-1">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 shrink-0">Description</span>
                  <span className="font-medium text-gray-700 max-w-[65%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {pr.description || "-"}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-gray-400">Priority</span><span className="font-medium text-gray-700">{pr.priority}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="font-medium text-gray-700">{status}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Department</span><span className="font-medium text-gray-700 truncate">{departmentMap[String(pr.department)] ?? pr.department}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Delivery Date</span><span className="font-medium text-gray-700">{new Date(pr.required_date).toLocaleDateString()}</span></div>
              </div>

              <div className="mt-3 flex gap-4">
                <button
                  className="text-sm font-semibold text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(false);
                    setActivePR(pr);
                  }}
                >
                  More Info
                </button>

                <button
                  className="text-sm font-semibold text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(true);
                    setActivePR(pr);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal (only one, outside the map) */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-5xl md:max-w-7xl rounded-xl shadow-xl p-4 md:p-6 text-black flex flex-col">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                View PR-{activePR.id} info
              </h2>
              <button onClick={() => setActivePR(null)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>

            {/* PR Info */}
            <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4">
              {/* Mobile view */}
              <div className="space-y-3 sm:hidden text-sm">
                <div>
                  <div className="text-gray-900">Description</div>
                  <input
                    value={activePR.description || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Priority</div>
                  <input
                    value={activePR.priority || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900"> Delivery Date</div>
                  <input
                    value={activePR.required_date || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Department</div>
                  <input
                    value={activePR.department || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, department: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Remarks</div>
                  <input
                    value={activePR.remarks || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, remarks: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>
              </div>

              {/* Desktop view */}
              <div className="hidden sm:block overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-2">
                  <span>Description</span>
                  <span>Priority</span>
                  <span> Delivery Date</span>
                  <span>Department</span>
                  <span>Remarks</span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <input
                    value={activePR.description || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.priority || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.required_date || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.department || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, department: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.remarks || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, remarks: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>
              </div>
            </div>

            {/* Items Section Toggle */}
            <div className="flex justify-end mb-2">
              <button
                onClick={toggleItemsSection}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded flex items-center"
              >
                {showItems ? <Minus size={16} /> : <Plus size={16} />}
              </button>
            </div>

            {/* Items */}
            {showItems && (
              <div className="space-y-4">
                {activePR.items?.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="bg-gray-100 rounded-lg p-3 md:p-4 w-full overflow-x-auto"
                  >
                    {/* Item header */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 text-sm">
                      {/* Item Code */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">
                          Item Code
                        </span>
                        <input
                          value={item.item_code || ""}
                          readOnly={true}
                          onChange={(e) => {
                            const updatedItems = [...activePR.items];
                            updatedItems[itemIndex] = {
                              ...updatedItems[itemIndex],
                              item_code: e.target.value,
                            };

                            setActivePR({ ...activePR, items: updatedItems });
                          }}

                          className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                            }`}
                        />

                      </div>

                      {/* Description */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">
                          Item Name
                        </span>
                        <input
                          value={item.item_name || ""}
                          readOnly={true}
                          onChange={(e) => {
                            const updatedItems = [...activePR.items];
                            updatedItems[itemIndex] = {
                              ...updatedItems[itemIndex],
                              item_name: e.target.value,
                            };

                            setActivePR({ ...activePR, items: updatedItems });
                          }}

                          className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                            }`}
                        />

                      </div>

                      {/* Qty */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">Qty</span>
                        <input
                          type="number"
                          min={0}
                          value={item.quantity_required ?? ""}
                          readOnly={true}
                          onChange={(e) => {
                            const updatedItems = [...activePR.items];
                            updatedItems[itemIndex] = {
                              ...updatedItems[itemIndex],
                              quantity_required: Math.max(0, Number(e.target.value)),
                            };

                            setActivePR({ ...activePR, items: updatedItems });
                          }}
                          className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                            }`}
                        />


                      </div>
                    </div>

                    {/* Vendors */}
                    <div className="overflow-x-auto">
                      {item.vendors?.length > 0 && (
                        <>
                          {/* ===== DESKTOP LABELS ===== */}
                          <div className="hidden sm:grid sm:grid-cols-8 gap-4 text-xs font-medium mb-1 text-gray-700">
                            <span>Vendor</span>
                            <span>Upload Quotation</span>
                            <span>Unit Price</span>
                            <span>Total Price</span>
                            <span>Quotation Validity</span>
                            <span>Comments</span>
                            <span>Feasibility Comment</span>
                            <span>Status</span>
                          </div>

                          {/* ===== DESKTOP VALUES ===== */}
                          {item.vendors.map((vendor, vendorIndex) => {
                            const prComment =
                              vendor.comments?.[0]?.comment || "";


                            const feasibilityComment =
                              vendor.comments?.find((c) => c.commented_by === 2)
                                ?.comment || "";

                            return (
                              <div
                                key={vendor.id}
                                className="hidden sm:grid sm:grid-cols-8 gap-4 text-sm mb-2"
                              >
                                {/* {editMode ? (
                                  <select
                                    value={vendor.vendor_id}
                                    onChange={(e) => {
                                      const updatedItems = [...activePR.items];
                                      updatedItems[itemIndex].vendors[vendorIndex] = {
                                        ...updatedItems[itemIndex].vendors[vendorIndex],
                                        vendor_id: e.target.value, // still store the ID
                                      };
                                      setActivePR({ ...activePR, items: updatedItems });
                                    }}
                                    className="bg-white border rounded px-2 py-1 w-full border-blue-400"
                                  >
                                    {Object.entries(vendorMap).map(([id, name]) => (
                                      <option key={id} value={id}>
                                        {name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    value={vendorMap[String(vendor.vendor_id)] ?? vendor.vendor_id} // <-- show name
                                    readOnly
                                    className="bg-gray-100 border rounded px-2 py-1 w-full"
                                  />
                                )} */}
                                <input
                                  value={vendorMap[String(vendor.vendor_id)] ?? vendor.vendor_id}
                                  readOnly
                                  className="bg-gray-100 border rounded px-2 py-1 w-full"
                                />
                                {/* 
                                <label
                                  className={`border rounded px-2 py-1 w-full text-sm flex items-center ${editMode
                                    ? "cursor-pointer border-blue-400 bg-white"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                  {vendor.attachments?.[0]?.file_name || "No file uploaded"}

                                  {editMode && (
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const updatedItems = [...activePR.items];
                                        updatedItems[itemIndex].vendors[vendorIndex] = {
                                          ...updatedItems[itemIndex].vendors[vendorIndex],
                                          attachments: [
                                            {
                                              file_name: file.name,
                                              file_path: "",
                                            },
                                          ],
                                        };

                                        setActivePR({ ...activePR, items: updatedItems });
                                      }}
                                    />
                                  )}
                                </label> */}

                                <label className="border rounded px-2 py-1 w-full text-sm flex items-center bg-gray-100 text-gray-600 cursor-not-allowed">
                                  {vendor.attachments?.[0]?.file_name || "No file uploaded"}
                                </label>



                                <input
                                  type="number"
                                  min={0}
                                  value={vendor.unit_price ?? ""}
                                  readOnly={true}
                                  onChange={(e) => {
                                    const updatedItems = [...activePR.items];

                                    const price = Math.max(0, Number(e.target.value));
                                    const qty = updatedItems[itemIndex].quantity_required || 0;

                                    updatedItems[itemIndex].vendors[vendorIndex] = {
                                      ...updatedItems[itemIndex].vendors[vendorIndex],
                                      unit_price: price,
                                      total_price: qty * price,
                                    };

                                    setActivePR({ ...activePR, items: updatedItems });
                                  }}
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                    }`}
                                />



                                <input
                                  value={vendor.total_price ?? ""}
                                  readOnly={true}
                                  onChange={(e) =>
                                    updateVendorField(itemIndex, vendorIndex, "total_price", Number(e.target.value))
                                  }
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                    }`}
                                />



                                <input
                                  type="date"
                                  value={vendor.quotation_validity_date ?? ""}
                                  disabled={true}
                                  onChange={(e) => {
                                    const updatedItems = [...activePR.items];
                                    updatedItems[itemIndex].vendors[vendorIndex] = {
                                      ...updatedItems[itemIndex].vendors[vendorIndex],
                                      quotation_validity_date: e.target.value,
                                    };
                                    setActivePR({ ...activePR, items: updatedItems });
                                  }}
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : "bg-gray-100 cursor-not-allowed"
                                    }`}
                                />



                                <input
                                  readOnly
                                  value={prComment}
                                  className="bg-white border rounded px-2 py-1 w-full"
                                />


                                <input
                                  readOnly
                                  value={feasibilityComment}
                                  className="bg-white border rounded px-2 py-1 w-full"
                                />

                                <input
                                  value={vendor.status ?? ""}
                                  readOnly={false}
                                  onChange={(e) => {
                                    const updatedItems = [...activePR.items];

                                    updatedItems[itemIndex].vendors[vendorIndex] = {
                                      ...updatedItems[itemIndex].vendors[vendorIndex],
                                      status: e.target.value,
                                    };

                                    setActivePR({ ...activePR, items: updatedItems });
                                  }}
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                    }`}
                                />



                              </div>
                            );
                          })}

                          {/* ===== MOBILE VIEW ===== */}
                          {item.vendors.map((vendor) => {
                            const prComment =
                              vendor.comments?.[0]?.comment || "";


                            const feasibilityComment =
                              vendor.comments?.find((c) => c.commented_by === 2)
                                ?.comment || "";

                            return (
                              <div
                                key={vendor.id}
                                className="sm:hidden flex gap-4 overflow-x-auto mb-4"
                              >
                                {[
                                  [
                                    "Vendor",
                                    vendorMap[String(vendor.vendor_id)] ??
                                    vendor.vendor_id,
                                  ],
                                  [
                                    "Upload Quotation",
                                    vendor.attachments?.[0]?.file_name || "-",
                                  ],
                                  ["Unit Price", vendor.unit_price ?? "-"],
                                  ["Total Price", vendor.total_price ?? "-"],
                                  [
                                    "Quotation Validity",
                                    vendor.quotation_validity_date
                                      ? new Date(
                                        vendor.quotation_validity_date
                                      ).toLocaleDateString()
                                      : "-",
                                  ],
                                  ["Comments", prComment],
                                  ["Feasibility Comment", feasibilityComment],
                                  ["Status", vendor.status || "-"],
                                ].map(([label, value], idx) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col min-w-[150px]"
                                  >
                                    <span className="text-gray-500 text-xs">
                                      {label}
                                    </span>
                                    <input
                                      readOnly
                                      value={value}
                                      className="bg-white border rounded px-2 py-1 w-full"
                                    />
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Statuses Section */}
            <div className="mb-6">
              <div className="flex justify-end mt-2 mb-2">
                <button
                  onClick={() => setShowStatus((prev) => !prev)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
                >
                  {showStatus ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 overflow-x-auto">
                <h3 className="font-semibold text-base mb-3">Statuses</h3>

                {showStatus && (
                  <div className="space-y-4 min-w-[350px] sm:min-w-[500px]">
                    {activePR.department_statuses?.map((ds, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between mb-1 text-xs text-gray-600 gap-2">
                          <input
                            value={ds.department_status}
                            readOnly={!editMode} // editable
                            onChange={(e) => {
                              const updatedStatuses = [...activePR.department_statuses];
                              updatedStatuses[idx].department_status = e.target.value;
                              setActivePR({ ...activePR, department_statuses: updatedStatuses });
                            }}
                            className="px-1 py-0.5  text-xs w-full sm:w-auto"
                          />

                          <span className="font-medium text-gray-800">
                            {ds.status_updated_by ?? "—"} •{" "}
                            {new Date(ds.updated_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 mt-1">
                          <input
                            value={ds.department_comment}
                            readOnly={!editMode} // editable
                            onChange={(e) => {
                              const updatedStatuses = [...activePR.department_statuses];
                              updatedStatuses[idx].department_comment = e.target.value;
                              setActivePR({ ...activePR, department_statuses: updatedStatuses });
                            }}
                            className=" px-1 py-0.5 rounded  w-full text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
            {editMode && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded border border-gray-300"
                  onClick={() => {
                    setEditMode(false);
                    setActivePR(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={async () => {
                    try {
                      // Save changes
                      await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/full/${activePR.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(activePR),
                        }
                      );

                      // Update PR in list
                      setPrs((prevPrs) =>
                        prevPrs.map((pr) => (pr.id === activePR.id ? activePR : pr))
                      );

                      setEditMode(false); // exit edit mode
                      // setActivePR(null); // optionally close modal

                    } catch (err) {
                      console.error("Save failed", err);
                    }
                  }}
                >
                  Save
                </button>

              </div>


            )}
          </div>
        </div>
      )}
    </>
  );
}
