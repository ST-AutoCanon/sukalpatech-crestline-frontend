import { useState, useEffect, useContext, useMemo, type ReactNode } from "react";
import axios from "axios";
import Alert from "../../../components/Aleartmessage";
import { AuthContext } from "../../../../../context/AuthContext";
import { Upload } from "lucide-react";

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
  payment_proof_file_name?: string;
  payment_proof_file_path?: string;
}



/* ================= COMPONENT ================= */

export default function SubmittedFinanceRequestsPage() {
  const { user, token } = useContext(AuthContext);
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/new-finance`;

  const [requests, setRequests] = useState<FinancePR[]>([]);
  const [selectedPR, setSelectedPR] = useState<FinancePR | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [receivingDetails, setReceivingDetails] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);


  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [finance, setFinance] = useState({
    paymentType: "",
    partialPercentage: "",
    finalCompleted: "",
    paymentProof: null as File | null,
    paymentProofName: "",
    paymentProofPath: "",
    comment: "",
  });

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



  //   const fetchApprovedRequests = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${API_BASE}/approved-finance-requests`,
  //       { withCredentials: true }
  //     );

  //     const allPRs = res.data.data || [];

  //     const filteredPRs = allPRs.filter((pr: any) => {
  //       const payment = pr.finance_payment_details;
  //       const stage = payment?.payment_stage?.toLowerCase()?.trim();

  //       // ❌ Hide FINAL
  //       if (stage === "final") return false;

  //       // -------------------------------
  //       // ✅ Feasibility Approval Check
  //       // -------------------------------
  //       const isFeasibilityApproved = pr.department_statuses?.some(
  //         (s: any) =>
  //           s.department_status?.toLowerCase().includes("feasibility approved")
  //       );

  //       if (!isFeasibilityApproved) return false;

  //       // -------------------------------
  //       // ✅ Payment Stage Logic
  //       // -------------------------------
  //       if (stage === "partial") return true;

  //       // -------------------------------
  //       // ✅ Existing Logic
  //       // -------------------------------
  //       if (!pr.department_statuses || pr.department_statuses.length === 0) {
  //         return false;
  //       }

  //       const latestStatus =
  //         pr.department_statuses[pr.department_statuses.length - 1];

  //       const status = latestStatus.department_status?.toLowerCase().trim();

  //       if (status?.includes("rejected")) return false;
  //       if (status === "finance approved") return false;

  //       return true;
  //     });

  //     setRequests(filteredPRs);

  //   } catch (err) {
  //     console.error("Error fetching approved finance requests:", err);
  //   }
  // };

  //   const fetchPartialFinanceRequests = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${API_BASE}/partial-finance-requests`,
  //       { withCredentials: true }
  //     );

  //     const allPRs = res.data.data || [];

  //     // ✅ Keep your existing status filtering
  //     const filteredPRs = allPRs.filter((pr: any) => {
  //       if (!pr.department_statuses || pr.department_statuses.length === 0) {
  //         return true;
  //       }

  //       const latestStatus =
  //         pr.department_statuses[pr.department_statuses.length - 1];

  //       const status = latestStatus.department_status?.toLowerCase().trim();

  //       if (status?.includes("rejected")) return false;
  //       if (status === "finance approved") return false;

  //       return true;
  //     });

  //     setRequests(filteredPRs);

  //   } catch (err) {
  //     console.error("Error fetching PARTIAL finance requests:", err);
  //   }
  // };




  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
      credentials: "include", // <-- cookies for auth
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
    fetchAllFinanceRequests();
  }, []);

  const openPR = async (pr: FinancePR) => {
    try {
      // 🔥 Call API to get FULL PR details
      const res = await axios.get(
        `${API_BASE}/finance-requests/${pr.id}`,
        { withCredentials: true }
      );
      const historyRes = await axios.get(
        `${API_BASE}/finance-payment-history/${pr.id}`,
        { withCredentials: true }
      );

      setPaymentHistory(historyRes.data?.data || []);

      const fullPR = res.data?.data;

      console.log("Receiving details:", fullPR.order_receiving_details);

      setSelectedPR(fullPR);

      // -------------------------
      // ✅ PAYMENT
      // -------------------------
      const payment = fullPR.finance_payment_details || {};

      setFinance({
        paymentType: payment.payment_stage || "",
        partialPercentage: payment.partial_percentage || "",
        finalCompleted: payment.final_completed ? "YES" : "NO",
        paymentProof: null,
        paymentProofName: payment.payment_proof_file_name || "",
        paymentProofPath: payment.payment_proof_file_path || "",
        comment: payment.finance_comment || "",
      });

      // -------------------------
      // ✅ ITEMS
      // -------------------------
      setUpdateData({
        department_statuses: fullPR.department_statuses || [],
        items: fullPR.items || [],
      });

      // -------------------------
      // ✅ ORDER DETAILS
      // -------------------------
      const order = fullPR.order_details || {};

      setOrderDetails({
        orderPlaced: order.order_placed_at ? "YES" : "NO",
        expectedDeliveryDate: order.expected_delivery_date || "",
        transportMode: order.transport_mode || "",
        inHouseType: order.in_house_type || "",
        vendorAddress: order.vendor_address || "",
        file: null,
        filePath: order.po_file_path || "",
        fileName: order.po_file_name || "",
      });

      // -------------------------
      // ✅ RECEIVING DETAILS
      // -------------------------
      const receiving = fullPR.order_receiving_details || {};

      setReceivingDetails({
        quantity_status: receiving.quantity_status || "",
        partial_quantity: receiving.partial_quantity || "",
        rejection_reason: receiving.rejection_reason || "",
        building: receiving.building || "",
        rack: receiving.rack || "",
      });

      setModalOpen(true);
      setNewStatus("");
      setNewComment("");

    } catch (err) {
      console.error("Error fetching PR details:", err);
    }
  };
  // const submitUpdate = async () => {
  //   if (!selectedPR || !newStatus) {
  //     setAlert({ type: "error", message: "Please select finance status" });
  //     setTimeout(() => setAlert(null), 2000);
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

  //   try {
  //     await axios.put(`${API_BASE}/finance-requests/${selectedPR.id}`, payload, {
  //       withCredentials: true, // <-- use cookies
  //     });

  //     setAlert({ type: "success", message: "Finance PR updated successfully" });
  //     setTimeout(() => setAlert(null), 4000);
  //     setModalOpen(false);
  //     fetchApprovedRequests();
  //   } catch (err) {
  //     console.error("Error updating finance PR:", err);
  //     setAlert({ type: "error", message: "Failed to update Finance PR" });
  //     setTimeout(() => setAlert(null), 4000);
  //   }
  // };

  const fetchAllFinanceRequests = async () => {
    try {
      const [approvedRes, partialRes] = await Promise.all([
        axios.get(`${API_BASE}/approved-finance-requests`, { withCredentials: true }),
        axios.get(`${API_BASE}/partial-finance-requests`, { withCredentials: true }),
      ]);

      const approvedPRs = approvedRes.data.data || [];
      const partialPRs = partialRes.data.data || [];

      // ✅ Merge
      let merged = [...approvedPRs, ...partialPRs];

      // ✅ Remove duplicates
      merged = merged.filter(
        (pr, index, self) =>
          index === self.findIndex((p) => p.id === pr.id)
      );

      // ✅ Apply filter
      const filtered = merged.filter((pr: any) => {
        const payment = pr.finance_payment_details || {};

        const stage = String(payment.payment_stage || "").toLowerCase().trim();
        const type = String(payment.payment_type || "").toLowerCase().trim();
        const finalCompletedRaw = payment.final_completed;

        // normalize finalCompleted safely
        const finalCompleted =
          typeof finalCompletedRaw === "boolean"
            ? finalCompletedRaw
            : String(finalCompletedRaw || "").toLowerCase().trim();

        // ❌ BLOCK FINAL (ALL CASES)
        const isFinal =
          stage.includes("final") ||
          type.includes("final") ||
          finalCompleted === "yes" ||
          finalCompleted === "true" ||
          finalCompleted === "1";

        if (isFinal) return false;

        const latestStatus =
          pr.department_statuses?.[pr.department_statuses.length - 1];

        const status = latestStatus?.department_status?.toLowerCase().trim();

        if (status?.includes("rejected")) return false;
        if (status === "finance approved") return false;

        const isFeasibilityApproved = pr.department_statuses?.some((s: any) =>
          s.department_status?.toLowerCase().includes("feasibility approved")
        );

        if (!isFeasibilityApproved) return false;

        return true;
      });
      setRequests(filtered);
    } catch (err) {
      console.error("Error fetching finance requests:", err);
    }
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, string> = {};
        (data?.data || []).forEach((dept: any) => {
          map[String(dept.id)] = dept.name; // map id → name
        });
        setDepartmentMap(map);
      })
      .catch((err) => console.error("Department fetch error:", err));
  }, []);


  const submitUpdate = async () => {
    if (!selectedPR || !newStatus) {
      setAlert({ type: "error", message: "Please select finance status" });
      setTimeout(() => setAlert(null), 2000);
      return;
    }

    try {
      const formData = new FormData();

      // ---------------------------
      // 1️⃣ Department Status
      // ---------------------------
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

      // ---------------------------
      // 2️⃣ Payment Fields
      // ---------------------------
      formData.append("payment_stage", finance.paymentType || "");
      if (finance.partialPercentage) {
        formData.append("partial_percentage", finance.partialPercentage);
      }
      formData.append("final_completed", finance.finalCompleted || "");
      formData.append("finance_comment", finance.comment || "");

      // ---------------------------
      // 3️⃣ File Upload (if exists)
      // ---------------------------
      if (finance.paymentProof) {
        formData.append("payment_proof", finance.paymentProof);
      }

      // ---------------------------
      // 4️⃣ API Call
      // ---------------------------
      await axios.put(
        `${API_BASE}/finance-requests/${selectedPR.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setAlert({
        type: "success",
        message: "Finance PR updated successfully",
      });

      setTimeout(() => {
        setAlert(null);
        setModalOpen(false);
      }, 3000);

      fetchAllFinanceRequests();
    } catch (err) {
      console.error("Error updating finance PR:", err);
      setAlert({
        type: "error",
        message: "Failed to update Finance PR",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Max size (5MB)
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setAlert({
        type: "error",
        message: "File size must be less than 5MB",
      });

      e.target.value = ""; // reset input
      return;
    }

    // ✅ Accept any file type (PDF, image, Excel, etc.)
    setFinance({
      ...finance,
      paymentProof: file,
    });
  };



  return (
    <div className="p-4 sm:p-6 text-black">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
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
                ["Department", departmentMap[pr.department] || pr.department || "-"],
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


            {/* PR DETAILS */}
            <div className="bg-gray-100 p-3 sm:p-4 rounded mb-4 overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 min-w-[300px]">
                {[
                  ["Department", departmentMap[selectedPR.department] || selectedPR.department || "-"],
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
                        <div>Upload Quotation</div>
                        <div>Unit Price</div>
                        <div>Total Price</div>
                        <div>quotation Validity</div>
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
                        .map((vendor, vi) => {                        // Find the latest feasibility comment (commented_by = 2)
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

                              {/* 6️⃣ Comments */}
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




            {/* ================= FINANCE SECTION ================= */}
            <div className="border border-gray-200 bg-gray-100 rounded p-4 mb-4">
              <h3 className="font-semibold mb-4 text-purple-600">
                Finance Payment Update
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

                {/* Payment Type */}
                <div>
                  <label className="text-xs font-medium">Payment Type</label>
                  <select
                    value={finance.paymentType || ""}
                    onChange={(e) =>
                      setFinance({ ...finance, paymentType: e.target.value })
                    }
                    className="border p-2 rounded w-full bg-white"
                  >
                    <option value="">Select Payment Type</option>
                    {/* <option value="ADVANCE">Advance</option> */}
                    <option value="FINAL">Final</option>
                    <option value="PARTIAL">Partial</option>
                  </select>
                </div>

                {/* Partial Percentage (Only if PARTIAL selected) */}
                {finance.paymentType === "PARTIAL" && (
                  <div>
                    <label className="text-xs font-medium">
                      Partial Payment Percentage
                    </label>
                    <select
                      value={finance.partialPercentage || ""}
                      onChange={(e) =>
                        setFinance({
                          ...finance,
                          partialPercentage: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full bg-white"
                    >
                      <option value="">Select Percentage</option>
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((p) => (
                        <option key={p} value={p}>
                          {p}%
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Final Payment Completed (ONLY when FINAL selected) */}
                {finance.paymentType === "FINAL" && (
                  <div>
                    <label className="text-xs font-medium">
                      Final Payment Completed
                    </label>
                    <select
                      value={finance.finalCompleted || ""}
                      onChange={(e) =>
                        setFinance({ ...finance, finalCompleted: e.target.value })
                      }
                      className="border p-2 rounded w-full bg-white"
                    >
                      <option value="">Select</option>
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                    </select>
                  </div>
                )}

                {/* Payment Proof Upload */}
                <div className="sm:col-span-3">
                  <label className="text-xs font-medium block mb-1">
                    Upload Payment Proof
                  </label>

                  <label className="flex items-center gap-2 border p-2 rounded w-full bg-white cursor-pointer hover:bg-gray-50">
                    <Upload size={18} className="text-blue-600" />

                    <span className="text-sm text-gray-700 truncate">
                      {finance.paymentProof ? finance.paymentProof.name : "Choose file"}
                    </span>

                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {finance.paymentProofPath && (
                  <div className="text-sm text-blue-600 mt-2">
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/${finance.paymentProofPath}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Existing File
                    </a>
                  </div>
                )}

                {/* Finance Comment */}
                <div className="sm:col-span-3">
                  <label className="text-xs font-medium">
                    Finance Comment
                  </label>
                  <input
                    type="text"
                    placeholder="Enter finance comment"
                    value={finance.comment || ""}
                    onChange={(e) =>
                      setFinance({ ...finance, comment: e.target.value })
                    }
                    className="border p-2 rounded w-full bg-white"
                  />
                </div>

              </div>
            </div>

            {/* ================= PAYMENT HISTORY ================= */}
            {paymentHistory.length > 0 && (
              <div className="border border-gray-200 bg-gray-100 rounded p-4 mb-4">
                <h3 className="font-semibold mb-3 text-purple-600">
                  Payment History
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-300">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="border px-3 py-2">Date</th>
                        <th className="border px-3 py-2">Stage</th>
                        <th className="border px-3 py-2">Partial %</th>
                        <th className="border px-3 py-2">Final</th>
                        <th className="border px-3 py-2">Comment</th>
                        <th className="border px-3 py-2">File</th>

                      </tr>
                    </thead>

                    <tbody>
                      {paymentHistory.map((h, i) => (
                        <tr key={i} className="bg-white">
                          <td className="border px-3 py-2">
                            {h.created_at
                              ? new Date(h.created_at).toLocaleDateString()
                              : "-"}
                          </td>

                          <td className="border px-3 py-2">
                            {h.payment_stage || "-"}
                          </td>

                          <td className="border px-3 py-2">
                            {h.partial_percentage || "-"}
                          </td>

                          <td className="border px-3 py-2">
                            {h.final_completed ? "YES" : "NO"}
                          </td>

                          <td className="border px-3 py-2">
                            {h.finance_comment || "-"}
                          </td>

                          <td className="border px-3 py-2">
                            {h.payment_proof_file_path ? (
                              <a
                                href={`${import.meta.env.VITE_BACKEND_URL}/${h.payment_proof_file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                              >
                                View
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>


                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {selectedPR.order_details &&
              (
                selectedPR.order_details.order_placed_at ||
                selectedPR.order_details.expected_delivery_date ||
                selectedPR.order_details.transport_mode ||
                selectedPR.order_details.in_house_type ||
                selectedPR.order_details.vendor_address ||
                selectedPR.order_details.po_file_path
              ) && (
                <div className="border border-gray-200 bg-gray-100 rounded p-4 mb-4">
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
                          selectedPR.order_details?.order_placed_at
                            ? new Date(
                              selectedPR.order_details?.order_placed_at,
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
                          selectedPR.order_details?.expected_delivery_date
                            ? new Date(
                              selectedPR.order_details?.expected_delivery_date,
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
                        value={selectedPR.order_details.transport_mode || ""}
                        className="border p-2 rounded w-full bg-white"
                      />
                    </div>

                    {/* ✅ IN HOUSE → Show Delivery Type */}
                    {selectedPR.order_details.transport_mode === "IN_HOUSE" && (
                      <div>
                        <label className="text-xs font-medium">Delivery Type</label>
                        <input
                          readOnly
                          value={selectedPR.order_details.in_house_type || ""}
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
                    {selectedPR.order_details?.po_file_path && (
                      <div>
                        <label className="text-xs font-medium">PO File</label>
                        <a
                          href={`${import.meta.env.VITE_BACKEND_URL}/${selectedPR.order_details?.po_file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {selectedPR.order_details?.po_file_name ||
                            "View PO File"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            {receivingDetails &&
              (
                receivingDetails.quantity_status ||
                receivingDetails.partial_quantity ||
                receivingDetails.rejection_reason ||
                receivingDetails.building ||
                receivingDetails.rack
              ) && (
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <h3 className="font-semibold mb-3 text-purple-600">Store Receiving Details</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">

                    <div>
                      <label>Quantity Status</label>
                      <input readOnly value={receivingDetails.quantity_status || ""} className="border p-2 rounded w-full bg-white" />
                    </div>

                    <div>
                      <label>Partial Quantity</label>
                      <input readOnly value={receivingDetails.partial_quantity || ""} className="border p-2 rounded w-full bg-white" />
                    </div>

                    <div>
                      <label>Rejection Reason</label>
                      <input readOnly value={receivingDetails.rejection_reason || ""} className="border p-2 rounded w-full bg-white" />
                    </div>

                    <div>
                      <label>Building</label>
                      <input readOnly value={receivingDetails.building || ""} className="border p-2 rounded w-full bg-white" />
                    </div>

                    <div>
                      <label>Rack</label>
                      <input readOnly value={receivingDetails.rack || ""} className="border p-2 rounded w-full bg-white" />
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
                      <option value="">Select Finance Status</option>
                      {FINANCE_STATUS_OPTIONS.map((s) => (
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
                      Update Finance PR
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