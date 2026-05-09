import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";
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
  status: string;
  unit_price?: number;
  total_price?: number;
  comments?: VendorComment[];
  attachments?: { file_name: string }[];
  quotation_validity_date?: string;
}

interface Item {
  id: number;
  item_code?: string;
  item_name?: string;
  quantity_required?: number;
  vendors: Vendor[];
}

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
  building: string; // Stored Building
  rack: string; // Rack
  quantity_status: string; // e.g., "FULL", "PARTIAL"
  partial_quantity?: number | null;
  rejection_reason?: string | null;
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

  finance_payment_details?: FinancePaymentDetails | null;
  order_details?: PROrderDetails;
  store_receiving_details?: StoreReceivingDetails | null;
}
interface Props {
  status: "ALL" | "PENDING" | "REJECTED" | "APPROVED";
}


/* ================= COMPONENT ================= */
// export default function SubmittedFinanceRequestsPage() {
export default function SubmittedFinanceRequestsPage({ status }: Props) {
  const { user, token } = useContext(AuthContext);
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/new-finance`;

  const [requests, setRequests] = useState<FinancePR[]>([]);
  const [selectedPR, setSelectedPR] = useState<FinancePR | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");

  const FINANCE_STATUS_OPTIONS = [
    "FINANCE APPROVED",
    "FINANCE REJECTED",
    "FINANCE PENDING",
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

  const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>(
    {}
  );
  // useEffect(() => {
  //   // Fetch vendor master
  //   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const map: Record<string, string> = {};
  //       (data?.data || []).forEach((v: any) => {
  //         map[String(v.vendor_id)] = v.vendor_name;
  //       });
  //       setVendorMap(map);
  //     })
  //     .catch((err) => console.error("Vendor fetch error:", err));
  // }, []);

  useEffect(() => {


    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, {
      credentials: "include", // ✅ send cookie
    })
      .then((res) => res.json())
      .then((data) => {
        const departments = data?.data || [];
        const map: Record<string, string> = {};

        departments.forEach((d: any) => {
          map[String(d.department_id)] = d.name;
        });

        setDepartmentMap(map);
      })
      .catch((err) => console.error("Department fetch error", err));
  }, []);



  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
      credentials: "include", // send cookies automatically
    })
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
  // const fetchApprovedRequests = async () => {
  //   const res = await axios.get(`${API_BASE}/approved-finance-requests`);
  //   setRequests(res.data.data || []);
  // };

  // const fetchApprovedRequests = async () => {
  //   let url = "";

  //   switch (status) {
  //     case "pending":
  //       url = `${API_BASE}/pending-finance-requests`;
  //       break;
  //     case "rejected":
  //       url = `${API_BASE}/rejected-finance-requests`;
  //       break;
  //     default:
  //       url = `${API_BASE}/approved-finance-requests`;
  //   }

  //   const res = await axios.get(url);
  //   setRequests(res.data.data || []);
  // };

  const getLatestStatus = (pr: FinancePR) => {
    return (
      pr.department_statuses?.[
        pr.department_statuses.length - 1
      ]?.department_status?.toUpperCase() || ""
    );
  };

  const fetchApprovedRequests = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;

      const res = await axios.get(url, {
        withCredentials: true,
      });

      let data: FinancePR[] = res.data.data || [];
      // ✅ REMOVE DUPLICATES BASED ON PR ID
data = data.filter(
  (pr, index, self) =>
    index === self.findIndex((p) => p.id === pr.id)
);

      // ✅ Filter based on LATEST status only
      data = data.filter((pr) => {
        const latestStatus = getLatestStatus(pr);

        if (status === "PENDING") {
          return latestStatus.includes("PENDING");
        }

        if (status === "REJECTED") {
          return latestStatus.includes("REJECTED");
        }

        if (status === "APPROVED") {
          const paymentStage =
            pr.finance_payment_details?.payment_stage?.toLowerCase() || "";

          const quantityStatus =
            pr.store_receiving_details?.quantity_status?.toUpperCase() || "";

          return paymentStage === "final" && quantityStatus === "FULL";
        }


        return true;
      });

      setRequests(data);
    } catch (err) {
      console.error("Fetch Finance Requests Error:", err);
      setRequests([]);
    }
  };
  useEffect(() => {
    fetchApprovedRequests();
  }, [status]);



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
  const formatEnumText = (value?: string) => {
  if (!value) return "";
  return value.replace(/_/g, " ");
};

  /* ================= UI ================= */
  return (
    <div className="p-4 md:p-6 text-black">
      {/* ================= PR CARDS ================= */}
      <div
        className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-x-6
  gap-y-7
"
      >
        {requests.map((pr) => (
          <div
            key={pr.id}
            onClick={() => openPR(pr)}
            className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col cursor-pointer"
          >
            {/* HEADER */}
            <h2 className="text-purple-600 font-semibold text-lg mb-2 truncate">
              PR ID: {pr.id}
            </h2>

            <div className="space-y-1 text-sm flex-1">
              {/* Description */}
              <div className="flex justify-between gap-3">
                <span className="text-gray-400 shrink-0">Description</span>
                <span className="font-medium text-gray-700 max-w-[65%] overflow-hidden text-ellipsis whitespace-nowrap">
                  {pr.description || "-"}
                </span>
              </div>

              {/* Priority */}
              <div className="flex justify-between">
                <span className="text-gray-400">Priority</span>
                <span className="font-medium text-gray-700">
                  {pr.priority || "-"}
                </span>
              </div>


              {/* Department */}
              <div className="flex justify-between">
                <span className="text-gray-400">Department</span>
                <span className="font-medium text-gray-700 truncate">
                  {departmentMap[String(pr.department)] ?? pr.department ?? "-"}
                </span>
              </div>


              {/* Delivery Date */}
              <div className="flex justify-between">
                <span className="text-gray-400">Delivery Date</span>
                <span className="font-medium text-gray-700">
                  {pr.required_date
                    ? new Date(pr.required_date).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <span className="text-blue-600 text-sm font-semibold mt-4">
              More info
            </span>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && selectedPR && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50 overflow-auto">
          <div className="bg-white w-full max-w-[95%] md:max-w-6xl rounded shadow-lg p-4 md:p-6 relative max-h-[90vh] overflow-y-auto">
            {/* CLOSE BUTTON */}
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              View PR-{selectedPR.id} info
            </h2>
            <button
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>

            {/* PR DETAILS */}
            <div className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[300px]">
                {[
                  ["Description", selectedPR.description],
                  ["Priority", selectedPR.priority],
                  [
                    "Delivery Date",
                    selectedPR.required_date
                      ? new Date(selectedPR.required_date).toLocaleDateString("en-US")
                      : "-",
                  ],
                  [
                    "Department",
                    departmentMap[String(selectedPR.department)] ??
                    selectedPR.department,
                  ],
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
              <div className="bg-gray-100 p-4 rounded mb-4 space-y-6 overflow-x-auto">
                {updateData.items.map((item, i) => (
                  <div key={i} className="rounded-lg p-2 md:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 text-sm">
                      {/* Item Code */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">
                          Item Code
                        </span>
                        <div className="bg-white border rounded px-4 py-1 flex-1">
                          {item.item_code || "-"}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">
                          Item Name
                        </span>
                        <div className="bg-white border rounded px-2 py-1 flex-1 truncate">
                          {item.item_name || "-"}
                        </div>
                      </div>

                      {/* Qty */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">Qty</span>
                        <div className="bg-white border rounded px-4 py-1 flex-1">
                          {item.quantity_required ?? "-"}
                        </div>
                      </div>
                    </div>

                    {/* VENDOR TABLE */}
                    <div className="overflow-x-auto">
                      {/* HEADER */}
                      <div className="grid grid-cols-8 gap-2 min-w-[700px] text-sm font-medium text-gray-700 mb-2">
                        <div>Vendor</div>
                        <div>Upload Quotation</div>
                        <div>Unit Price</div>
                        <div>Total Price</div>
                        <div>Quotation Validity</div>
                        <div>PR Comments</div>
                        <div>Feasibility comment</div>
                        <div>status</div>
                      </div>

                      {/* VENDOR ROWS */}

                      {item.vendors
                        .filter(
                          (vendor) =>
                            !vendor.status ||
                            !vendor.status.toLowerCase().includes("rejected")
                        )
                        .map((vendor, vi) => {
                          // Find the latest feasibility comment (commented_by = 2)
                          const feasibilityComment =
                            vendor.comments?.[vendor.comments.length - 1]?.comment || "";


                          return (
                            <div
                              key={vi}
                              className="grid grid-cols-8 gap-2 min-w-[700px] mb-2 text-sm"
                            >
                              {/* 1️⃣ Vendor */}
                              <input
                                readOnly
                                value={vendorMap[String(vendor.vendor_id)] || "-"}
                                className="bg-white border rounded px-2 py-1 w-full text-xs sm:text-sm"
                              />

                              {/* 2️⃣ Upload Quotation */}
                              {/* <input
                                type="text"
                                value={vendor.attachments?.[0]?.file_name || ""}
                                readOnly
                                className="bg-white border rounded px-2 py-1 text-sm"
                              /> */}
                              {/* 2️⃣ Upload Quotation */}
                              <div>
                                {(() => {
                                  const validAttachment = vendor.attachments?.find(
                                    (att: any) =>
                                      (att.file_path && att.file_path.trim() !== "") || att.fileObject
                                  );

                                  if (!validAttachment) {
                                    return (
                                      <input
                                        readOnly
                                        value="No file"
                                        className="border rounded px-2 py-1 bg-gray-100 text-xs sm:text-sm w-full"
                                      />
                                    );
                                  }

                                  // Determine file URL
                                  const fileUrl = validAttachment.fileObject
                                    ? validAttachment.file_path // local preview (URL.createObjectURL)
                                    : `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`;

                                  return (
                                    <input
                                      type="text"
                                      value={validAttachment.file_name || "View File"}
                                      onClick={() => window.open(fileUrl, "_blank")}
                                      className="border rounded px-2 py-1 bg-white text-xs sm:text-sm w-full cursor-pointer text-blue-600 underline"
                                    />
                                  );
                                })()}
                              </div>
                              {/* 3️⃣ Unit Price */}
                              <input
                                readOnly
                                value={vendor.unit_price ?? ""}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* 4️⃣ Total Price */}
                              <input
                                readOnly
                                value={vendor.total_price ?? ""}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* 5️⃣ Quotation Validity */}
                              <input
                                readOnly
                                value={
                                  vendor.quotation_validity_date
                                    ? new Date(vendor.quotation_validity_date).toLocaleDateString()
                                    : ""
                                }
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* 6️⃣ Comments (PR Comment) */}
                              <input
                                readOnly
                                value={vendor.comments?.[0]?.comment || ""}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* 7️⃣ Feasibility Comment */}
                              <input
                                readOnly
                                value={feasibilityComment}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* 8️⃣ Status */}
                              <input
                                readOnly
                                value={vendor.status || ""}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* FINANCE PAYMENT DETAILS */}
            {selectedPR.finance_payment_details && (
              <div className="border border-gray-200 rounded p-4 mb-4">
                <h3 className="font-semibold mb-3 text-purple-600">
                  Finance Payment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* Payment Stage */}
                  <div>
                    <label className="text-xs font-medium">Payment Stage</label>
                    <input
                      readOnly
                      value={
                        selectedPR.finance_payment_details.payment_stage || ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* ✅ Show Percentage ONLY if PARTIAL */}
                  {selectedPR.finance_payment_details.payment_stage ===
                    "PARTIAL" && (
                      <div>
                        <label className="text-xs font-medium">
                          Partial Percentage
                        </label>
                        <input
                          readOnly
                          value={
                            selectedPR.finance_payment_details.partial_percentage
                              ? `${selectedPR.finance_payment_details.partial_percentage}%`
                              : "0%"
                          }
                          className="border p-2 rounded w-full bg-white"
                        />
                      </div>
                    )}

                  {/* Final Completed */}
                  <div>
                    <label className="text-xs font-medium">
                      Final Completed
                    </label>
                    <input
                      readOnly
                      value={
                        selectedPR.finance_payment_details.final_completed
                          ? "Yes"
                          : "No"
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Finance Comment */}
                  <div>
                    <label className="text-xs font-medium">
                      Finance Comment
                    </label>
                    <input
                      readOnly
                      value={
                        selectedPR.finance_payment_details.finance_comment || ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                </div>

                {/* Payment Proof */}
                {selectedPR.finance_payment_details.payment_proof_file_path && (
                  <div className="mt-4">
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/${selectedPR.finance_payment_details.payment_proof_file_path}`}
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

            {selectedPR.order_details && (
              <div className="border border-gray-200 rounded p-4 mb-4">
                <h3 className="font-semibold mb-4 text-purple-600">
                  PR Order Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {/* Order Placed */}
                  <div>
                    <label className="text-xs font-medium">Order Placed</label>
                    <input
                      readOnly
                      value={
                        selectedPR.order_details.order_placed_at
                          ? new Date(
                            selectedPR.order_details.order_placed_at,
                          ).toLocaleDateString()
                          : ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Expected Delivery */}
                  <div>
                    <label className="text-xs font-medium">
                      Expected Delivery
                    </label>
                    <input
                      readOnly
                      value={
                        selectedPR.order_details.expected_delivery_date
                          ? new Date(
                            selectedPR.order_details.expected_delivery_date,
                          ).toLocaleDateString()
                          : ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Transport Mode */}
                  {/* Transport Mode */}
                  <div>
                    <label className="text-xs font-medium">Transport Mode</label>
                    <input
                      readOnly
                      value={formatEnumText(selectedPR.order_details.transport_mode || "")}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* ✅ IN HOUSE → Show Delivery Type */}
                  {selectedPR.order_details.transport_mode === "IN_HOUSE" && (
                    <div>
                      <label className="text-xs font-medium">Delivery Type</label>
                      <input
                        readOnly
                        value={formatEnumText(selectedPR.order_details.transport_mode || "")}
                        className="border p-2 rounded w-full bg-white"
                      />
                    </div>
                  )}

                  {/* ✅ COLLECT → Show Vendor Address */}
                  {selectedPR.order_details.transport_mode === "COLLECT" && (
                    <div>
                      <label className="text-xs font-medium">Vendor Address</label>
                      <input
                        readOnly
                        value={selectedPR.order_details.vendor_address || ""}
                        className="border p-2 rounded w-full bg-white"
                      />
                    </div>
                  )}

                  {/* PO File */}
                  {selectedPR.order_details.po_file_path && (
                    <div>
                      <label className="text-xs font-medium">PO File</label>
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/${selectedPR.order_details.po_file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {selectedPR.order_details.po_file_name ||
                          "View PO File"}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedPR.store_receiving_details && (
              <div className="border border-gray-200 rounded p-4 mb-4">
                <h3 className="font-semibold mb-4 text-purple-600">
                  Store Receiving Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {/* Quantity Status */}
                  <div>
                    <label className="text-xs font-medium">
                      Quantity Status
                    </label>
                    <input
                      readOnly
                      value={
                        selectedPR.store_receiving_details.quantity_status || ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Partial Quantity (only if applicable) */}
                  {selectedPR.store_receiving_details.quantity_status ===
                    "PARTIAL" && (
                      <div>
                        <label className="text-xs font-medium">
                          Partial Quantity
                        </label>
                        <input
                          readOnly
                          value={
                            selectedPR.store_receiving_details.partial_quantity ??
                            0
                          }
                          className="border p-2 rounded w-full bg-white"
                        />
                      </div>
                    )}

                  {/* Rejection Reason (if exists) */}
                  {selectedPR.store_receiving_details.rejection_reason && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium">
                        Rejection Reason
                      </label>
                      <textarea
                        readOnly
                        value={
                          selectedPR.store_receiving_details.rejection_reason
                        }
                        className="border p-2 rounded w-full bg-white"
                      />
                    </div>
                  )}

                  {/* Stored Building */}
                  <div>
                    <label className="text-xs font-medium">
                      Stored Building
                    </label>
                    <input
                      readOnly
                      value={selectedPR.store_receiving_details.building || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Rack */}
                  <div>
                    <label className="text-xs font-medium">Rack</label>
                    <input
                      readOnly
                      value={selectedPR.store_receiving_details.rack || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STATUS SECTION */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setExpandStatus(!expandStatus)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
              >
                {expandStatus ? "−" : "+"}
              </button>
            </div>

            {expandStatus && (
              <div className="border-1 border-gray-200 rounded p-4 mb-4">
                <h3 className="font-semibold mb-2">Statuses</h3>

                {updateData.department_statuses.map((s, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 p-3 rounded mb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
                  >
                    <div className="flex flex-col gap-1">
                      <p>
                        <strong>Status:</strong> {s.department_status}
                      </p>
                      <p>
                        <strong>Comment:</strong> {s.department_comment}
                      </p>
                    </div>
                    <div className="flex gap-2 text-sm text-gray-600">
                      {s.status_updated_by ?? "—"} •{" "}
                      <span>
                        {s.updated_at
                          ? new Date(s.updated_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

