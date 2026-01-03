import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState, type Key } from "react";

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
  const [activePR, setActivePR] = useState<any | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [showStatuses, setShowStatuses] = useState(true);
  const [loading, setLoading] = useState(true);

  const toggleItem = (itemId: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  useEffect(() => {
    fetch("http://localhost:5001/api/new-finance/approved-finance-requests")
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err));
  }, []);

  return (
    <div className="pb-6 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => {
          const status =
            pr.department_statuses?.[0]?.department_status?.toLowerCase();

          return (
            <div
              key={pr.id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 relative"
            >
              {/* PR ID */}
              <h2 className="text-xl font-semibold text-purple-600">
                PR-{pr.id}
              </h2>

              {/* Details */}
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Project</span>
                  <span className="font-medium">{pr.department}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className="font-medium">{pr.priority}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium">
                    {pr.department_statuses?.[0]?.department_status || "Draft"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium">{pr.department}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Date</span>
                  <span className="font-medium">
                    {new Date(pr.required_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* More Info */}
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

      {/* ===== MODAL (OUTSIDE MAP) ===== */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-7xl rounded-xl shadow-xl p-6 text-black">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                View Finance
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
            {activePR.items?.map(
              (item: {
                id: Key | null | undefined;
                item_code: any;
                item_name: any;
                quantity_required: any;
                vendors: any[];
              }) => (
                <div key={item.id} className="mb-6">
                  <div className="flex justify-end mb-1">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
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
                                    ?.map((c: { comment: any }) => c.comment)
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
              )
            )}

            <div className="mb-6 relative mt-[40px]">
              {" "}
              {/* Add mt-6 to move the section down */}
              {/* Floating toggle button */}
              <button
                onClick={() => setShowStatuses((prev) => !prev)}
                className="absolute -top-8 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
              >
                {showStatuses ? <Minus size={16} /> : <Plus size={16} />}
              </button>
              <div className="border border-gray-300 rounded-lg p-4 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Statuses</h3>
                </div>

                {showStatuses && (
                  <div className="flex flex-col gap-2">
                    {activePR.department_statuses?.map(
                      (
                        ds: {
                          department_status: any;
                          department_comment: any;
                          updated_at: string | number | Date;
                        },
                        idx: Key
                      ) => (
                        <div
                          key={idx}
                          className="bg-gray-100 border border-gray-300 rounded-lg p-3 flex justify-between items-start text-sm border"
                        >
                          {/* Left side: Status and Comment */}
                          <div className="flex flex-col gap-1">
                            <div>
                              <span className="font-medium">Status:</span>{" "}
                              <span>{ds.department_status || "-"}</span>
                            </div>
                            <div>
                              <span className="font-medium">Comment:</span>{" "}
                              <span>{ds.department_comment || "-"}</span>
                            </div>
                          </div>

                          {/* Right side: Name + Date */}
                          <div className="text-xs text-gray-400 text-right">
                            <span>Arjun</span>{" "}
                            {new Date(ds.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      )
                    )}
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
