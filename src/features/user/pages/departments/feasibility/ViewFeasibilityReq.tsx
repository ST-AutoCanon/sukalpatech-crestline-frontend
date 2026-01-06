


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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showStatus, setShowStatus] = useState(true);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility/submitted-requests`)
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err));
  }, []);

  return (
    <>
      {/* ===== PR CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => (
          <div
            key={pr.id}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 relative flex flex-col min-h-[220px] cursor-pointer hover:shadow-md transition"
            onClick={() => setActivePR(pr)}
          >
            <h2 className="text-lg font-semibold text-purple-600 truncate">
              FEAS-{pr.id}
            </h2>

            <div className="mt-3 space-y-1 text-sm flex-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Department</span>
                <span className="truncate">{pr.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Priority</span>
                <span>{pr.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span>{pr.department_statuses?.[0]?.department_status || "Draft"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Required Date</span>
                <span>{new Date(pr.required_date).toLocaleDateString()}</span>
              </div>
            </div>

            <button className="mt-3 text-sm font-medium text-blue-600 text-left">
              More Info
            </button>
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4 sm:p-6">
          <div className="bg-white w-full max-w-5xl sm:max-w-7xl rounded-xl shadow-xl p-4 sm:p-6 text-black flex flex-col">
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
            <div className="bg-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
              <div className="min-w-[600px] grid grid-cols-1 sm:grid-cols-5 gap-4 text-sm font-medium mb-2">
                <span>Description</span>
                <span>Priority</span>
                <span>Required Delivery Date</span>
                <span>Department</span>
                <span>Remarks</span>
              </div>

              <div className="min-w-[600px] grid grid-cols-1 sm:grid-cols-5 gap-4 text-sm">
                <button className="bg-white border rounded px-3 py-2 text-left w-full">
                  {activePR.description || "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left w-full">
                  {activePR.priority || "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left w-full">
                  {activePR.required_date
                    ? new Date(activePR.required_date).toLocaleDateString()
                    : "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left w-full">
                  {activePR.department || "-"}
                </button>
                <button className="bg-white border rounded px-3 py-2 text-left w-full">
                  {activePR.remarks || "-"}
                </button>
              </div>
            </div>

            {/* Items + Vendors Section */}
            {activePR.items?.map((item) => (
              <div key={item.id} className="mb-6 overflow-x-auto">
                <div className="flex justify-end mb-1">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
                  >
                    {expandedItems[item.id] ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 min-w-[500px] sm:min-w-[700px]">
                  {expandedItems[item.id] && (
                    <>
                      {/* Item header */}
                      <div className="bg-gray-200 rounded-lg p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="font-medium">Item Code</span>
                          <div className="bg-white border rounded px-3 py-1 w-full sm:w-auto">{item.item_code || "-"}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-1 w-full">
                          <span className="font-medium">Description</span>
                          <div className="bg-white border rounded px-3 py-1 w-full">{item.item_name || "-"}</div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="font-medium">Qty</span>
                          <div className="bg-white border rounded px-3 py-1">{item.quantity_required ?? "-"} units</div>
                        </div>
                      </div>

                      {/* Vendors */}
                      {item.vendors?.map((vendor, index) => (
                        <div key={vendor.id} className="mb-4 overflow-x-auto min-w-[500px] sm:min-w-[700px]">
                          {index === 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-xs font-medium mb-1 text-gray-700">
                              <span>Vendor</span>
                              <span>Upload Quotation</span>
                              <span>Unit Price</span>
                              <span className="hidden sm:block">Total Price</span>
                              <span className="hidden sm:block">Quotation Validity</span>
                              <span className="hidden sm:block">Comments</span>
                            </div>
                          )}

                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-sm">
                            <select className="bg-white border rounded px-2 py-1 w-full">
                              <option>{vendor.vendor_id || "-"}</option>
                            </select>
                            <input
                              type="text"
                              value={vendor.attachments?.[0]?.file_name || ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 w-full"
                            />
                            <input
                              type="text"
                              value={vendor.unit_price ?? ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 w-full"
                            />
                            <input
                              type="text"
                              value={vendor.total_price ?? ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 w-full hidden sm:block"
                            />
                            <input
                              type="text"
                              value={
                                vendor.quotation_validity_date
                                  ? new Date(vendor.quotation_validity_date).toLocaleDateString()
                                  : ""
                              }
                              readOnly
                              className="bg-white border rounded px-2 py-1 w-full hidden sm:block"
                            />
                            <input
                              type="text"
                              value={vendor.comments?.map((c) => c.comment).join(", ") || ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 w-full hidden sm:block"
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
              <div className="flex justify-end mt-2 mb-2">
                <button
                  onClick={() => setShowStatus((prev) => !prev)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
                >
                  {showStatus ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <div className="border-2 border-gray-300 rounded-lg p-4 overflow-x-auto">
                <h3 className="font-semibold text-base mb-3">Statuses</h3>

                {showStatus && (
                  <div className="space-y-4 min-w-[350px] sm:min-w-[500px]">
                    {activePR.department_statuses?.map((ds, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between mb-1 text-xs text-gray-600">
                          <span className="font-medium">
                            Status: {ds.department_status}
                          </span>
                          <span className="font-medium text-gray-800">
                            Arjun • {new Date(ds.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Comment:</span> {ds.department_comment}
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
