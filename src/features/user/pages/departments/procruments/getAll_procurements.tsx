



import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";

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
  id: string;
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
  const [showItems, setShowItems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStatuses, setShowStatuses] = useState(true);

  const toggleItemsSection = () => {
    setShowItems((prev) => !prev);
  };

  useEffect(() => {
fetch(`${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`)
      .then((res) => res.json())
      .then((data) => {
        setPrs(data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch PR Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-6 text-gray-600">Loading PRs...</div>;
  }

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
              <h3 className="text-purple-600 font-semibold text-lg mb-2 truncate">
                PR-{pr.id}
              </h3>

              <div className="space-y-1 text-sm flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Description</span>
                  <span className="font-medium text-gray-700 truncate">{pr.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className="font-medium text-gray-700">{pr.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium text-gray-700 truncate">{pr.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Date</span>
                  <span className="font-medium text-gray-700">
                    {new Date(pr.required_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button className="mt-3 text-sm text-blue-600 hover:underline self-start">
                More Info
              </button>
            </div>
          );
        })}
      </div>
      {/* Modal */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-5xl md:max-w-7xl rounded-xl shadow-xl p-4 md:p-6 text-black flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                View Procurement Page
              </h2>
              <button onClick={() => setActivePR(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* PR Info */}
            <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4 overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 md:gap-4 text-sm font-medium mb-2">
                <span>Description</span>
                <span>Priority</span>
                <span>Required Delivery Date</span>
                <span>Department</span>
                <span>Remarks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 md:gap-4">
                <div className="bg-white border rounded px-2 py-1">{activePR.description || "-"}</div>
                <div className="bg-white border rounded px-2 py-1">{activePR.priority || "-"}</div>
                <div className="bg-white border rounded px-2 py-1">
                  {activePR.required_date ? new Date(activePR.required_date).toLocaleDateString() : "-"}
                </div>
                <div className="bg-white border rounded px-2 py-1">{activePR.department || "-"}</div>
                <div className="bg-white border rounded px-2 py-1">{activePR.remarks || "-"}</div>
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
                {activePR.items?.map((item) => (
                  <div key={item.id} className="bg-gray-100 rounded-lg p-3 md:p-4 w-full overflow-x-auto">
                    {/* Item header */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Item Code</span>
                        <div className="bg-white border rounded px-2 py-1">{item.item_code || "-"}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-medium">Description</span>
                        <div className="bg-white border rounded px-2 py-1 w-full">{item.item_name || "-"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Qty</span>
                        <div className="bg-white border rounded px-2 py-1">{item.quantity_required ?? "-"}</div>
                      </div>
                    </div>

                    {/* Vendors */}
                    <div className="overflow-x-auto">
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
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Statuses Section */}
            <div className="mb-6">
              <div className="flex justify-end mt-2 mb-2">
                <button
                  onClick={() => setShowStatuses((prev) => !prev)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
                >
                  {showStatuses ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 overflow-x-auto">
                <h3 className="font-semibold text-base mb-3">Statuses</h3>

                {showStatuses && (
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
