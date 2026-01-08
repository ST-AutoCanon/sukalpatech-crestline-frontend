

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

export default function ProcurementViewPage() {
  const [prs, setPrs] = useState<PR[]>([]);
  const [activePR, setActivePR] = useState<PR | null>(null);
  const [showItems, setShowItems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStatuses, setShowStatuses] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`)
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleItemsSection = () => setShowItems((prev) => !prev);

  const Row = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex text-sm mb-1">
      <span className="w-32 text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{value || "-"}</span>
    </div>
  );

  if (loading) return <div className="text-center p-6 text-gray-600">Loading PRs...</div>;

  return (
    <div className="p-6 max-w-full">
      {/* PR Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => {
          const latestStatus =
            pr.department_statuses?.[pr.department_statuses.length - 1]?.department_status || "Draft";
          return (
            <div
              key={pr.id}
              className="bg-white rounded-2xl shadow-lg p-6 min-h-[180px] flex flex-col justify-between"
            >
              <h2 className="text-purple-600 font-semibold text-lg">PR-{pr.id}</h2>
              <div className="mt-4 space-y-1 text-sm">
                <Row label="Priority" value={pr.priority} />
                <Row label="Status" value={latestStatus} />
                <Row label="Department" value={pr.department} />
                <Row label="Required Date" value={new Date(pr.required_date).toLocaleDateString()} />
              </div>
              <button
                onClick={() => setActivePR(pr)}
                className="mt-4 text-sm font-medium text-blue-600 hover:underline self-start"
              >
                More Info
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-7xl rounded-xl shadow-xl p-6 text-black">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                View Store Page
              </h2>
              <button onClick={() => setActivePR(null)} className="text-gray-500 hover:text-gray-700">
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

            {/* Items + Vendors Toggle */}
            <div className="flex justify-end mb-2">
              <button
                onClick={toggleItemsSection}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
              >
                {showItems ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </div>

            {/* Items + Vendors Section */}
            {showItems && (
              <div className="space-y-6">
                {activePR.items?.map((item) => (
                  <div key={item.id} className="bg-gray-100 rounded-lg p-4">
                    {/* Item header */}
                    <div className="bg-gray-200 rounded-lg p-3 mb-4 flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Item Code</span>
                        <div className="bg-white border rounded px-3 py-1">{item.item_code || "-"}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-medium">Description</span>
                        <div className="bg-white border rounded px-3 py-1 w-full">{item.item_name || "-"}</div>
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
                                ? new Date(vendor.quotation_validity_date).toLocaleDateString()
                                : ""
                            }
                            readOnly
                            className="bg-white border rounded px-2 py-1 text-sm"
                          />
                          <input
                            type="text"
                            value={vendor.comments?.map((c) => c.comment).join(", ") || ""}
                            readOnly
                            className="bg-white border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Statuses Section */}
            <div className="mb-6">
              {/* Max/Min button above thin black border */}
              <div className="flex justify-end mt-2 mb-2">
                <button
                  onClick={() => setShowStatuses((prev) => !prev)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
                >
                  {showStatuses ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <div className="border border-black rounded-lg p-4">
                <h3 className="font-semibold text-base mb-3">Statuses</h3>
                {showStatuses && (
                  <div className="space-y-4">
                    {activePR.department_statuses?.map((ds, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                      >
                        <div className="flex justify-between mb-1 text-xs text-gray-600">
                          <span className="font-medium">Status: {ds.department_status}</span>
                          <span className="text-right font-medium text-gray-800">
                            Arjun {new Date(ds.updated_at).toLocaleDateString()}
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
    </div>
  );
}
