import { useState, useEffect, useContext, type ReactNode, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";
import Aleart from "../../../components/Aleartmessage";

/* ================= TYPES ================= */

interface DepartmentStatus {
  status: ReactNode;
  department_status: string;
  department_comment: string;
  status_updated_by?: string;
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
  department_comment: any;
  comment: any;
  attachments: any;
  quotation_validity_date: any;
  id: number;
  vendor_id: number;
  status?: string;
  unit_price?: number;
  total_price?: number;
  comments?: VendorComment[];
  validity?: string;
  attachment?: string;
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

interface ProcurementPR {
  id: string;
  department?: string;
  requested_by?: string;
  description?: string;
  priority?: string;
  required_date?: string;
  remarks?: string;
  department_statuses: DepartmentStatus[];
  items: Item[];

  finance_payment_details?: FinancePaymentDetails | null; // ✅ ADD THIS ONLY
}

/* ================= COMPONENT ================= */

export default function SubmittedFinanceRequestsPage() {
  const { user, token } = useContext(AuthContext);
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement`;

  const [requests, setRequests] = useState<ProcurementPR[]>([]);
  const [selectedPR, setSelectedPR] = useState<ProcurementPR | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");

  const [orderDetails, setOrderDetails] = useState({
    orderPlaced: "",
    expectedDeliveryDate: "",
    file: null as File | null,
    transportMode: "",
    inHouseType: "",
    vendorAddress: "",
  });

  const PR_STATUS_OPTIONS = [
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
  const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>(
    {}
  );
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);


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
    return new Date(date).toLocaleDateString("en-GB");
  };

  const fetchApprovedRequests = async () => {
    const res = await axios.get(
      `${API_BASE}/finance-approved-pr-requests`,
      { withCredentials: true }, // ✅ send cookie
    );

    setRequests(res.data.data || []);
  };



  useEffect(() => {

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
      credentials: "include", // ✅ send cookie
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

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const openPR = (pr: ProcurementPR) => {
    setSelectedPR(pr);
    setUpdateData({
      department_statuses: pr.department_statuses || [],
      items: pr.items || [],
    });
    setModalOpen(true);
    setNewStatus("");
    setNewComment("");
  };

  // const submitUpdate = async () => {
  //   if (!selectedPR || !newStatus) {
  //     setAlert({
  //       type: "error",
  //       message: "Please select procurement PR status",
  //     });
  //     return;
  //   }


  //   const payload = {
  //     department_statuses: [
  //       {
  //         department_status: newStatus,
  //         department_comment: newComment,
  //         status_updated_by: user.first_name,
  //         updated_at: new Date().toISOString(),
  //       },
  //     ],
  //     items: updateData.items,
  //   };

  //   await axios.put(`${API_BASE}/pr-requests/${selectedPR.id}`, payload);
  //   setAlert({
  //     type: "success",
  //     message: "Procurement PR Updated",
  //   });
  //    setTimeout(() => {
  //     setModalOpen(false);
  //     setAlert(null);
  //   }, 2000);
  //   setModalOpen(false);
  //   fetchApprovedRequests();
  // };


  //   const submitUpdate = async () => {
  //     if (!selectedPR || !newStatus) {
  //       setAlert({
  //         type: "error",
  //         message: "Please select procurement PR status",
  //       });
  //       return;
  //     }

  //     const token = localStorage.getItem("token");

  //     const payload = {
  //       department_statuses: [
  //         {
  //           department_status: newStatus,
  //           department_comment: newComment,
  //           status_updated_by: user.first_name,
  //           updated_at: new Date().toISOString(),
  //         },
  //       ],
  //       items: updateData.items,
  //     };

  // await axios.put(
  //   `${API_BASE}/pr-requests/${selectedPR.id}`,
  //   payload,
  //   { withCredentials: true }, // ✅ send cookie
  // );

  //     setAlert({
  //       type: "success",
  //       message: "Procurement PR Updated",
  //     });

  //     setTimeout(() => {
  //       setModalOpen(false);
  //       setAlert(null);
  //     }, 2000);

  //     fetchApprovedRequests();
  //   };


  const submitUpdate = async () => {
    if (!selectedPR || !newStatus) {
      setAlert({
        type: "error",
        message: "Please select procurement PR status",
      });
      return;
    }

    const formData = new FormData();

    // 🔹 department status
    formData.append(
      "department_statuses",
      JSON.stringify([
        {
          department_status: newStatus,
          department_comment: newComment,
          status_updated_by: user.first_name,
          updated_at: new Date().toISOString(),
        },
      ]),
    );

    // 🔹 order details
    formData.append(
      "order_details",
      JSON.stringify({
        order_status:
          orderDetails.orderPlaced === "YES"
            ? "PLACED"
            : orderDetails.orderPlaced === "NO"
              ? "NOT_PLACED"
              : null,
        expected_delivery_date: orderDetails.expectedDeliveryDate,
        transport_mode: orderDetails.transportMode,
        in_house_type: orderDetails.inHouseType,
        vendor_address: orderDetails.vendorAddress,
      }),
    );

    // 🔹 file
    if (orderDetails.file) {
      formData.append("order_file", orderDetails.file);
    }

    await axios.put(`${API_BASE}/pr-requests/${selectedPR.id}`, formData, {
      withCredentials: true,
    });

    setAlert({
      type: "success",
      message: "Procurement PR Updated",
    });
    setTimeout(() => {
      setAlert(null); // remove alert
      setModalOpen(false); // close modal (if needed)
    }, 1500); // 1.5 seconds

    fetchApprovedRequests();
  };

  

  return (
    <div className="p-4 sm:p-6 text-black">
      {/* ================= PR CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {requests.map((pr) => (
          <div
            key={pr.id}
            onClick={() => openPR(pr)}
            className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col min-h-[220px] cursor-pointer"
          >
            <h2 className="text-purple-600 font-semibold text-lg mb-2 sm:mb-3 truncate">
              PR ID: {pr.id}
            </h2>

            <div className="flex-1 space-y-1 sm:space-y-2 text-sm">
              {[
                ["Department", pr.department],
                ["Priority", pr.priority],
                [
                  "Required",
                  pr.required_date
                    ? new Date(pr.required_date).toLocaleDateString("en-US")
                    : "-"
                ],
                ["Description", pr.description],
              ].map(([label, value], idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800 truncate">
                    {value || "-"}
                  </span>
                </div>
              ))}
            </div>

            <span className="text-blue-600 text-sm font-medium mt-2 sm:mt-3">
              Update
            </span>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && selectedPR && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50 px-2 sm:px-4">
          <div className="bg-white w-full max-w-[95vw] sm:max-w-6xl rounded shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
            {/* CLOSE */}
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Update PR-{selectedPR.id} info
            </h2>
            <button
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            {alert && (
              <Aleart
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            )}

            {/* PR DETAILS */}
            <div className="bg-gray-100 p-3 sm:p-4 rounded mb-4 overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 min-w-[300px]">
                {[
                  ["Description", selectedPR.description],
                  ["Priority", selectedPR.priority],
                  [
                    "Delivery Date",
                    selectedPR.required_date
                      ? new Date(selectedPR.required_date).toLocaleDateString("en-US")
                      : "-",
                  ],
                  ["Department", selectedPR.department],
                  ["Remarks", selectedPR.remarks],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <label className="text-xs font-medium">{label}</label>
                    <input
                      readOnly
                      value={value || ""}
                      className="border p-2 rounded w-full bg-white text-sm"
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
              <div className="bg-gray-100 p-3 sm:p-4 rounded mb-4 space-y-4 overflow-x-auto">
                {updateData.items.map((item, i) => (
                  <div key={i} className="rounded-lg p-2 sm:p-4 min-w-[300px]">
                    {/* ITEM HEADER */}
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
                          Description
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
                      <div className="grid grid-cols-8 gap-2 min-w-[700px] text-sm font-medium text-gray-700 mb-2">
                        <div>Vendor</div>
                        <div>Unit Price</div>
                        <div>Total Price</div>
                        <div>Validity</div>
                        <div>Upload Quotation</div>
                        <div>PR comment</div>
                        <div>Feasibility comment</div>
                        <div>status</div>
                      </div>

                      {item.vendors
                        .filter(
                          (vendor) =>
                            !vendor.status ||
                            !vendor.status.toLowerCase().includes("rejected")
                        )
                        .map((vendor, vi) => {  // Find the latest feasibility comment (commented_by = 2)
                          const feasibilityComment =
                            vendor.comments?.[vendor.comments.length - 1]?.comment || "";

                          return (
                            <div
                              key={vi}
                              className="grid grid-cols-8 gap-2 min-w-[700px] mb-2 text-sm"
                            >
                              {/* Vendor Name */}
                              <input
                                readOnly
                                value={vendorMap[String(vendor.vendor_id)] || "-"}
                                className="bg-white border rounded px-2 py-1 w-full text-xs sm:text-sm"
                              />

                              {/* Unit Price */}
                              <input
                                readOnly
                                value={vendor.unit_price ?? ""}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* Total Price */}
                              <input
                                readOnly
                                value={vendor.total_price ?? ""}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* Quotation Validity */}
                              <input
                                readOnly
                                value={
                                  vendor.quotation_validity_date
                                    ? new Date(
                                      vendor.quotation_validity_date
                                    ).toLocaleDateString()
                                    : ""
                                }
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* Attachments */}
                              {/* <input
                              type="text"
                              value={vendor.attachments?.[0]?.file_name || ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 text-sm"
                            /> */}
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


                              {/* PR comment */}
                              <input
                                readOnly
                                value={vendor.comments?.[0]?.comment || ""}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* Feasibility Comment (latest by commented_by = 2) */}
                              <input
                                readOnly
                                value={feasibilityComment}
                                className="border rounded px-1 py-1 bg-white text-xs sm:text-sm"
                              />

                              {/* Status */}
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



            {/* ================= FINANCE PAYMENT DETAILS ================= */}
            {selectedPR.finance_payment_details && (
              <div className="border border-gray-200 rounded p-4 mb-4">
                <h3 className="font-semibold mb-4 text-purple-600">
                  Finance Payment Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
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


            {/* ================= ORDER DETAILS SECTION ================= */}

            <div className="border border-gray-200 rounded p-4 mb-4">
              <h3 className="font-semibold mb-4 text-lg">Order Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order Placed */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Order Placed
                  </label>
                  <select
                    value={orderDetails.orderPlaced}
                    onChange={(e) => {
                      const value = e.target.value;

                      setOrderDetails({
                        ...orderDetails,
                        orderPlaced: value,
                        // reset everything if NO
                        ...(value === "NO" && {
                          expectedDeliveryDate: "",
                          transportMode: "",
                          inHouseType: "",
                          vendorAddress: "",
                          file: null,
                        }),
                      });

                      console.log("Order Placed:", value);
                    }}
                    className="border p-2 rounded w-full bg-white"
                  >
                    <option value="">Select Option</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>

                {/* Expected Delivery Date */}
                {orderDetails.orderPlaced === "YES" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Expected Delivery Date
                    </label>
                    <input
                      type="date"
                      value={orderDetails.expectedDeliveryDate}
                      onChange={(e) => {
                        setOrderDetails({
                          ...orderDetails,
                          expectedDeliveryDate: e.target.value,
                        });
                        console.log("Expected Date:", e.target.value);
                      }}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                )}

                {/* File Upload */}
                {orderDetails.orderPlaced === "YES" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Upload Document
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;

                        setOrderDetails({
                          ...orderDetails,
                          file,
                        });

                        console.log("Uploaded File:", file);
                      }}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                )}

                {/* Mode of Transportation */}
                {orderDetails.orderPlaced === "YES" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mode of Transportation
                    </label>
                    <select
                      value={orderDetails.transportMode}
                      onChange={(e) => {
                        const value = e.target.value;

                        setOrderDetails({
                          ...orderDetails,
                          transportMode: value,
                          inHouseType: "",
                          vendorAddress: "",
                        });

                        console.log("Transport Mode:", value);
                      }}
                      className="border p-2 rounded w-full bg-white"
                    >
                      <option value="">Select Mode</option>
                      <option value="IN_HOUSE">In-house Delivery</option>
                      <option value="COLLECT">Need to Collect</option>
                    </select>
                  </div>
                )}
              </div>

              {/* In-House Options */}
             {orderDetails.orderPlaced === "YES" &&
  orderDetails.transportMode === "IN_HOUSE" && (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">
        Delivery Type
      </label>
      <select
        value={orderDetails.inHouseType || ""}
        onChange={(e) =>
          setOrderDetails((prev) => ({
            ...prev,
            inHouseType: e.target.value,
            vendorAddress: "", // reset other field
          }))
        }
        className="border p-2 rounded w-full bg-white"
      >
        <option value="">Select Type</option>
        <option value="COURIER">Courier</option>
        <option value="TRANSPORT">Transportation</option>
      </select>
    </div>
)}

              {/* Collect from Vendor */}
             {orderDetails.orderPlaced === "YES" &&
  orderDetails.transportMode === "COLLECT" && (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">
        Vendor Address
      </label>
      <input
        type="text"
        value={orderDetails.vendorAddress || ""}
        onChange={(e) =>
          setOrderDetails((prev) => ({
            ...prev,
            vendorAddress: e.target.value,
            inHouseType: "", // reset other field
          }))
        }
        placeholder="Enter Vendor Address"
        className="border p-2 rounded w-full bg-white"
      />
    </div>
)}
            </div>

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
              <div className="border border-gray-200 rounded p-4 mb-4 overflow-x-auto">
                <h3 className="font-semibold mb-2">Statuses</h3>
                <div className="space-y-2">
                  {updateData.department_statuses.map((s, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 p-2 sm:p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    >
                      <div className="flex flex-col gap-1">
                        <p>
                          <strong>Status:</strong> {s.department_status}
                        </p>
                        <p>
                          <strong>Comment:</strong> {s.department_comment}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1 sm:mt-0">

                        {s.status_updated_by ?? "—"} •{" "}
                        <span>
                          {s.updated_at
                            ? new Date(s.updated_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* ADD STATUS */}
                  <div className="bg-gray-200 rounded p-2 sm:p-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="bg-white border p-2 rounded w-full"
                    >
                      <option value="">Select PR Status</option>
                      {PR_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter comment"
                      className="bg-white border p-2 rounded w-full"
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={submitUpdate}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Update Procurement PR
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
