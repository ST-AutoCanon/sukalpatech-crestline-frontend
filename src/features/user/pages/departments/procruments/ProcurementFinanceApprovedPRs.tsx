
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
  quotation_validity_date: any;
  attachments: any;
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
  const API_BASE =  `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement`;

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
    const res = await axios.get(`${API_BASE}/finance-approved-pr-requests`);
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
      `${API_BASE}/pr-requests/${selectedPR.id}`,

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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-4 sm:pt-10 z-50 overflow-auto">
          <div className="bg-white w-full max-w-6xl rounded shadow-lg relative flex flex-col max-h-[90vh] overflow-hidden">
            {/* CLOSE BUTTON */}
            <button className="absolute top-3 right-4 text-xl" onClick={() => setModalOpen(false)}>×</button>

            {/* CONTENT */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-4">
              <h2 className="text-2xl font-bold text-violet-600 mb-2">Update Procrument</h2>

              {/* PR DETAILS */}
              <div className="bg-gray-100 p-3 rounded mb-4 overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 min-w-[300px]">
                  {[
                    ["Description", selectedPR.description],
                    ["Priority", selectedPR.priority],
                    ["Required Delivery Date", formatDate(selectedPR.required_date)],
                    ["Requesting Department", selectedPR.department],
                    ["Remarks", selectedPR.remarks],
                  ].map(([label, value], i) => (
                    <div key={i}>
                      <label className="text-xs font-medium mb-1 block">{label}</label>
                      <input readOnly value={value || ""} className="border p-2 rounded w-full bg-white mt-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ITEMS TOGGLE */}
              <div className="flex justify-end mb-1">
                <button onClick={() => setExpandItems(!expandItems)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded">{expandItems ? "−" : "+"}</button>
              </div>

              {/* ITEMS */}
              {expandItems && (
                <div className="bg-gray-100 p-2 sm:p-4 rounded mb-4 space-y-4 overflow-x-auto">
                  {updateData.items.map((item, i) => (
                    <div key={i} className="rounded-lg p-2 sm:p-4 bg-gray-200 space-y-2">
                      {/* ITEM HEADER */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                        <div className="flex items-center gap-2"><span className="text-sm font-semibold">Item Code</span><div className="bg-white px-2 py-1 rounded border">{item.item_code}</div></div>
                        <div className="flex items-center gap-2 flex-1"><span className="text-sm font-semibold">Description</span><div className="bg-white px-2 py-1 rounded border w-full">{item.item_name}</div></div>
                        <div className="flex items-center gap-2"><span className="text-sm font-semibold">Qty</span><div className="bg-white px-2 py-1 rounded border">{item.quantity_required} units</div></div>
                      </div>

                      {/* VENDOR TABLE */}
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-8 gap-2 min-w-[700px] text-sm font-medium text-gray-700">
                          <div>Vendor</div>
                          <div>Unit Price</div>
                          <div>Total Price</div>
                          <div>Validity</div>
                          <div>Attachments</div>
                          <div>Feasibility Comment</div>
                          <div>Comments</div>
                          <div>Status</div>
                        </div>

                        {item.vendors.map((vendor, vi) => {
                          const key = `${i}-${vi}`;
                          const vendorData = vendorUpdates[key] || { status: "", comment: "" };
                          return (
                            <div key={vi} className="grid grid-cols-1 sm:grid-cols-8 gap-2 mb-2 min-w-[700px]">
                              {/* Vendor */}
                              <input readOnly value={vendor.vendor_id || ""} className="flex-1 border rounded px-2 py-1 bg-white min-w-0" />
                              {/* Unit Price */}
                              <input readOnly value={vendor.unit_price ?? ""} className="flex-1 border rounded px-2 py-1 bg-white min-w-0" />
                              {/* Total Price */}
                              <input readOnly value={vendor.total_price ?? ""} className="flex-1 border rounded px-2 py-1 bg-white min-w-0" />
                              {/* Validity */}
                              <div className="flex-1 border rounded px-2 py-1 bg-white text-center min-w-0">{vendor.quotation_validity_date ? new Date(vendor.quotation_validity_date).toLocaleDateString() : ""}</div>
                              {/* Attachments */}
                              <div className="flex-1 border rounded px-2 py-1 bg-white text-center min-w-0">
                                {vendor.attachments && vendor.attachments.length > 0 ? (
                                  vendor.attachments.map((file: any) => (
                                    <a
                                      key={file.id || file.file_name}
                                      href={file.file_url || file.file_name} // use actual URL
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-900 underline block"
                                    >
                                      {file.file_name}
                                    </a>
                                  ))
                                ) : (
                                  <span className="text-gray-500">No attachment</span>
                                )}
                              </div>

                              {/* Feasibility Comment */}
                              <input readOnly value={vendor.comments?.[0]?.comment || ""} className="flex-1 border rounded px-2 py-1 bg-gray-50 text-gray-700 min-w-0" />
                              {/* New Comment */}
                              <input value={vendorData.comment} placeholder="Enter comment" onChange={(e) => updateVendorField(i, vi, "comment", e.target.value)} className="flex-1 border rounded px-2 py-1 bg-white min-w-0" />
                              {/* Status */}
                              <select value={vendorData.status} onChange={(e) => updateVendorField(i, vi, "status", e.target.value)} className="flex-1 border rounded px-2 py-1 bg-white min-w-0">
                                <option value="">Select Status</option>
                                {FINANCE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STATUS TOGGLE */}
              <div className="flex justify-end mb-1">
                <button onClick={() => setExpandStatus(!expandStatus)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded">{expandStatus ? "−" : "+"}</button>
              </div>

              {/* STATUS SECTION */}
              {expandStatus && (
                <div className="p-4 rounded mb-4 space-y-2 bg-gray-200">
                  <span className="text-gray-900 font-semibold block mb-2">Statuses</span>
                  {updateData.department_statuses.map((s, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-2 rounded mb-2">
                      <div className="flex flex-col text-sm text-gray-600 gap-1">
                        <p><strong>Status:</strong> {s.department_status}</p>
                        <p><strong>Comment:</strong> {s.department_comment}</p>
                      </div>
                      <div className="flex text-sm text-gray-600 gap-2 items-center mt-2 sm:mt-0">
                        <span>Arjun</span>
                        <span>{s.updated_at ? new Date(s.updated_at).toLocaleDateString() : ""}</span>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-100 p-2 rounded">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select className="border p-2 rounded" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                        <option value="">Select</option>
                        {FINANCE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="text" placeholder="Enter comment" className="border p-2 rounded" value={newComment} onChange={e => setNewComment(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* UPDATE BUTTON */}
              <div className="flex justify-end mt-4">
                <button onClick={submitUpdate} className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700">Update PR</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
