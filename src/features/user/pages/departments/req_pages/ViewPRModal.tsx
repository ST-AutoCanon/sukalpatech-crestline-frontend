// ViewPRModal.tsx
import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";

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
  fileObject?: File | null;
};

type Vendor = {
  comment: any;
  id: number;
  vendor_id: string;
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

interface FinancePaymentDetails {
  id: number;
  payment_stage?: string;
  partial_percentage?: number | null;
  final_completed?: boolean;
  finance_comment?: string;
  payment_proof_file_name?: string;
  payment_proof_file_path?: string;
  created_at?: string;
  updated_at?: string;
}

interface PROrderDetails {
  order_placed_at: string;
  expected_delivery_date: string;
  po_file_name?: string | null;
  po_file_path?: string | null;
  transport_mode: string;
  in_house_type: string;
  vendor_address: string | null;
}

interface StoreReceivingDetails {
  building: string;
  rack: string;
  quantity_status: string;
  partial_quantity?: number | null;
  rejection_reason?: string | null;
}

export type PR = {
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
  finance_payment_details?: FinancePaymentDetails | null;
  order_details?: PROrderDetails;
  store_receiving_details?: StoreReceivingDetails | null;
};

type Props = {
  pr: PR;
  vendorMap: Record<string, string>;
  departmentMap: Record<string, string>;
  onClose: () => void;
};

export default function ViewPRModal({
  pr,
  vendorMap,
  departmentMap,
  onClose,
}: Props) {
  const [showItems, setShowItems] = useState(false);
  const [showStatuses, setShowStatuses] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
      <div className="bg-white w-full max-w-5xl md:max-w-7xl rounded-xl shadow-xl p-4 md:p-6 text-black flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
            View PR-{pr.id} info
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* PR Info */}
        <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4">
          {/* Mobile */}
          <div className="space-y-3 sm:hidden text-sm">
            <div>
              <div className="text-gray-900">Description</div>
              <input
                value={pr.description || ""}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <div className="text-gray-900">Priority</div>
              <input
                value={pr.priority || ""}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <div className="text-gray-900">Delivery Date</div>
              <input
                type="date"
                value={pr.required_date ? pr.required_date.split("T")[0] : ""}
                disabled
                className="bg-gray-100 border rounded px-2 py-1 w-full cursor-not-allowed"
              />
            </div>
            <div>
              <div className="text-gray-900">Department</div>
              <input
                value={departmentMap[String(pr.department)] ?? pr.department}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <div className="text-gray-900">Remarks</div>
              <input
                value={pr.remarks || ""}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-2">
              <span>Description</span>
              <span>Priority</span>
              <span>Delivery Date</span>
              <span>Department</span>
              <span>Remarks</span>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <input
                value={pr.description || ""}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
              <input
                value={pr.priority || ""}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
              <input
                type="date"
                value={pr.required_date ? pr.required_date.split("T")[0] : ""}
                disabled
                className="bg-gray-100 border rounded px-2 py-1 w-full cursor-not-allowed"
              />
              <input
                value={departmentMap[String(pr.department)] ?? pr.department}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
              <input
                value={pr.remarks || ""}
                readOnly
                className="bg-gray-100 border rounded px-2 py-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* Items Toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setShowItems((prev) => !prev)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded flex items-center"
          >
            {showItems ? <Minus size={16} /> : <Plus size={16} />}
          </button>
        </div>

        {/* Items */}
        {showItems && (
          <div className="space-y-4">
            {pr.items?.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 rounded-lg p-3 md:p-4 w-full overflow-x-auto"
              >
                {/* Item Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 shrink-0">Item Code</span>
                    <input
                      value={item.item_code || ""}
                      readOnly
                      className="bg-white border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 shrink-0">Item Name</span>
                    <input
                      value={item.item_name || ""}
                      readOnly
                      className="bg-white border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 shrink-0">Qty</span>
                    <input
                      type="number"
                      value={item.quantity_required ?? ""}
                      readOnly
                      className="bg-white border rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>

                {/* Vendors */}
                {item.vendors?.length > 0 && (
                  <div className="overflow-x-auto">
                    {/* Desktop Labels */}
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

                    {/* Desktop Rows */}
                    {item.vendors
                      .filter(
                        (v) =>
                          !v.status?.toLowerCase().trim().includes("rejected"),
                      )
                      .map((vendor) => {
                        const sorted = [...(vendor.comments || [])].sort(
                          (a, b) =>
                            new Date(a.commented_at).getTime() -
                            new Date(b.commented_at).getTime(),
                        );
                        const prComment = sorted[0]?.comment ?? "";
                        const feasibilityComment =
                          sorted.length > 1
                            ? sorted[sorted.length - 1].comment
                            : "";
                        const validAttachment = vendor.attachments?.find(
                          (att) =>
                            (att.file_path && att.file_path.trim() !== "") ||
                            att.fileObject,
                        );

                        return (
                          <div
                            key={vendor.id}
                            className="hidden sm:grid sm:grid-cols-8 gap-4 text-sm mb-2"
                          >
                            <input
                              value={
                                vendorMap[String(vendor.vendor_id)] ??
                                vendor.vendor_id
                              }
                              readOnly
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            />
                            <div className="border rounded px-2 py-1 w-full bg-gray-100 truncate">
                              {validAttachment ? (
                                <a
                                  href={
                                    validAttachment.fileObject
                                      ? validAttachment.file_path
                                      : `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline text-sm block truncate"
                                >
                                  {validAttachment.file_name || "View File"}
                                </a>
                              ) : (
                                <span className="text-gray-400 text-sm">No file</span>
                              )}
                            </div>
                            <input
                              value={vendor.unit_price ?? ""}
                              readOnly
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            />
                            <input
                              value={vendor.total_price ?? ""}
                              readOnly
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            />
                            <input
                              type="date"
                              value={vendor.quotation_validity_date ?? ""}
                              disabled
                              className="bg-gray-100 border rounded px-2 py-1 w-full cursor-not-allowed"
                            />
                            <input
                              value={prComment}
                              readOnly
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            />
                            <input
                              value={feasibilityComment}
                              readOnly
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            />
                            <input
                              value={vendor.status ?? ""}
                              readOnly
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            />
                          </div>
                        );
                      })}

                    {/* Mobile Rows */}
                    {item.vendors
                      .filter(
                        (v) =>
                          !v.status?.toLowerCase().trim().includes("rejected"),
                      )
                      .map((vendor) => {
                        const sorted = [...(vendor.comments || [])].sort(
                          (a, b) =>
                            new Date(a.commented_at).getTime() -
                            new Date(b.commented_at).getTime(),
                        );
                        const prComment = sorted[0]?.comment ?? "";
                        const feasibilityComment =
                          sorted.length > 1
                            ? sorted[sorted.length - 1].comment
                            : "";
                        const validAttachment = vendor.attachments?.find(
                          (att) =>
                            (att.file_path && att.file_path.trim() !== "") ||
                            att.fileObject,
                        );

                        return (
                          <div
                            key={vendor.id}
                            className="sm:hidden bg-white border rounded-lg p-3 mb-4 space-y-3"
                          >
                            <div>
                              <label className="text-xs text-gray-500">
                                Vendor
                              </label>
                              <input
                                readOnly
                                value={
                                  vendorMap[String(vendor.vendor_id)] ??
                                  vendor.vendor_id
                                }
                                className="w-full bg-gray-100 border rounded px-2 py-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">
                                Quotation
                              </label>
                              {validAttachment ? (
                                <a
                                  href={
                                    validAttachment.fileObject
                                      ? validAttachment.file_path
                                      : `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline text-sm truncate block"
                                >
                                  {validAttachment.file_name || "View File"}
                                </a>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  No file
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">
                                Unit Price
                              </label>
                              <input
                                readOnly
                                value={vendor.unit_price ?? ""}
                                className="w-full bg-gray-100 border rounded px-2 py-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">
                                Total Price
                              </label>
                              <input
                                readOnly
                                value={vendor.total_price ?? ""}
                                className="w-full bg-gray-100 border rounded px-2 py-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">
                                Quotation Validity
                              </label>
                              <input
                                type="date"
                                value={vendor.quotation_validity_date ?? ""}
                                disabled
                                className="w-full bg-gray-100 border rounded px-2 py-1 cursor-not-allowed"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">
                                Comments
                              </label>
                              <input
                                readOnly
                                value={prComment}
                                className="w-full bg-gray-100 border rounded px-2 py-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">
                                Feasibility Comment
                              </label>
                              <input
                                readOnly
                                value={feasibilityComment}
                                className="w-full bg-gray-100 border rounded px-2 py-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">
                                Status
                              </label>
                              <input
                                readOnly
                                value={vendor.status ?? ""}
                                className="w-full bg-gray-100 border rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Finance Payment Details */}
        {pr.finance_payment_details && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-semibold mb-3 text-purple-600">
              Finance Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-xs font-medium">Payment Stage</label>
                <input
                  readOnly
                  value={pr.finance_payment_details.payment_stage || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              {pr.finance_payment_details.payment_stage === "PARTIAL" && (
                <div>
                  <label className="text-xs font-medium">
                    Partial Percentage
                  </label>
                  <input
                    readOnly
                    value={
                      pr.finance_payment_details.partial_percentage
                        ? `${pr.finance_payment_details.partial_percentage}%`
                        : "0%"
                    }
                    className="border p-2 rounded w-full bg-white"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium">Final Completed</label>
                <input
                  readOnly
                  value={
                    pr.finance_payment_details.final_completed ? "Yes" : "No"
                  }
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Finance Comment</label>
                <input
                  readOnly
                  value={pr.finance_payment_details.finance_comment || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
            </div>
            {pr.finance_payment_details.payment_proof_file_path && (
              <div className="mt-4">
                <a
                  href={`${import.meta.env.VITE_BACKEND_URL}/${pr.finance_payment_details.payment_proof_file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Payment Proof
                </a>
              </div>
            )}
          </div>
        )}

        {/* PR Order Details */}
        {pr.order_details && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-semibold mb-4 text-purple-600">
              PR Order Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-xs font-medium">Order Placed</label>
                <input
                  readOnly
                  value={
                    pr.order_details.order_placed_at
                      ? new Date(
                        pr.order_details.order_placed_at,
                      ).toLocaleDateString()
                      : ""
                  }
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Expected Delivery</label>
                <input
                  readOnly
                  value={
                    pr.order_details.expected_delivery_date
                      ? new Date(
                        pr.order_details.expected_delivery_date,
                      ).toLocaleDateString()
                      : ""
                  }
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Transport Mode</label>
                <input
                  readOnly
                  value={pr.order_details.transport_mode || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">In-House Type</label>
                <input
                  readOnly
                  value={pr.order_details.in_house_type || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Vendor Address</label>
                <input
                  readOnly
                  value={pr.order_details.vendor_address || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              {pr.order_details.po_file_path && (
                <div>
                  <label className="text-xs font-medium">PO File</label>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/${pr.order_details.po_file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {pr.order_details.po_file_name || "View PO File"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Store Receiving Details */}
        {pr.store_receiving_details && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-semibold mb-4 text-purple-600">
              Store Receiving Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs font-medium">Quantity Status</label>
                <input
                  readOnly
                  value={pr.store_receiving_details.quantity_status || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              {pr.store_receiving_details.quantity_status === "PARTIAL" && (
                <div>
                  <label className="text-xs font-medium">
                    Partial Quantity
                  </label>
                  <input
                    readOnly
                    value={pr.store_receiving_details.partial_quantity ?? 0}
                    className="border p-2 rounded w-full bg-white"
                  />
                </div>
              )}
              {pr.store_receiving_details.rejection_reason && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium">
                    Rejection Reason
                  </label>
                  <textarea
                    readOnly
                    value={pr.store_receiving_details.rejection_reason}
                    className="border p-2 rounded w-full bg-white"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium">Stored Building</label>
                <input
                  readOnly
                  value={pr.store_receiving_details.building || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Rack</label>
                <input
                  readOnly
                  value={pr.store_receiving_details.rack || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Statuses */}
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
                {pr.department_statuses?.map((ds, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                  >
                    <div className="flex flex-col sm:flex-row justify-between mb-1 text-xs text-gray-600 gap-2">
                      <input
                        value={ds.department_status}
                        readOnly
                        className="px-1 py-0.5 text-xs w-full sm:w-auto bg-transparent"
                      />
                      <span className="font-medium text-gray-800">
                        {ds.status_updated_by ?? "—"} •{" "}
                        {new Date(ds.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <input
                        value={ds.department_comment}
                        readOnly
                        className="px-1 py-0.5 rounded w-full text-xs bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
