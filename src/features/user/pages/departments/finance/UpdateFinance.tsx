import { useState, useEffect, useContext,useMemo,type ReactNode } from "react";
import axios from "axios";
import Alert from "../../../components/Aleartmessage";
import { AuthContext } from "../../../../../context/AuthContext";

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

  const [alert, setAlert] = useState<{
  type: "success" | "error";
  message: string;
} | null>(null);


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

const fetchApprovedRequests = async () => {
  try {
    const res = await axios.get(`${API_BASE}/approved-finance-requests`, {
      withCredentials: true, // <-- use cookies instead of token
    });
    setRequests(res.data.data || []);
  } catch (err) {
    console.error("Error fetching approved finance requests:", err);
  }
};


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
    fetchApprovedRequests();
  }, []);

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

  // const submitUpdate = async () => {
  //   if (!selectedPR || !newStatus) {
  //   setAlert({
  //     type: "error",
  //     message: "Please select finance status",
  //   });
  //   setTimeout(() => setAlert(null), 2000);
  //   return;
  // }



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

  //   // await axios.put(`${API_BASE}/finance-requests/${selectedPR.id}`, payload);
  //   const token = localStorage.getItem("token");

  //   await axios.put(`${API_BASE}/finance-requests/${selectedPR.id}`, payload, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //     setAlert({
  //     type: "success",
  //     message: "Feasibility PR updated successfully",
  //   });

  //    setTimeout(() => {
  //     setAlert(null);
  //   }, 4000);
    
  //   setModalOpen(false);
  //   fetchApprovedRequests();
    
    
  // };
  
const submitUpdate = async () => {
  if (!selectedPR || !newStatus) {
    setAlert({ type: "error", message: "Please select finance status" });
    setTimeout(() => setAlert(null), 2000);
    return;
  }

  const payload = {
    department_statuses: [
      {
        department_status: newStatus,
        department_comment: newComment,
        status_updated_by: user.first_name,
        updated_at: new Date().toISOString(),
      },
    ],
    items: updateData.items,
  };

  try {
    await axios.put(`${API_BASE}/finance-requests/${selectedPR.id}`, payload, {
      withCredentials: true, // <-- use cookies
    });

    setAlert({ type: "success", message: "Finance PR updated successfully" });
    setTimeout(() => setAlert(null), 4000);
    setModalOpen(false);
    fetchApprovedRequests();
  } catch (err) {
    console.error("Error updating finance PR:", err);
    setAlert({ type: "error", message: "Failed to update Finance PR" });
    setTimeout(() => setAlert(null), 4000);
  }
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
                ["Department", pr.department],
                ["Priority", pr.priority],
                ["Required", formatDate(pr.required_date)],
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
                  ["Description", selectedPR.description],
                  ["Priority", selectedPR.priority],
                  [
                    "Required Delivery Date",
                    formatDate(selectedPR.required_date),
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
                        <div>Attachments</div>
                        <div>PR comment</div>
                        <div>Feasibility comment</div>
                        <div>status</div>
                      </div>

                      {item.vendors.map((vendor, vi) => {
                        // Find the latest feasibility comment (commented_by = 2)
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
                            <input
                              type="text"
                              value={vendor.attachments?.[0]?.file_name || ""}
                              readOnly
                              className="bg-white border rounded px-2 py-1 text-sm"
                            />

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
