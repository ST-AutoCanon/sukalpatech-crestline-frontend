import { useState, useEffect, useContext, type ReactNode } from "react";
import axios from "axios";
import Aleart from "../../../../components/Aleartmessage";
import { AuthContext } from "../../../../../../context/AuthContext";


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
  quantity_status?: string;
  partial_quantity?: number;
  rejection_reason?: string;
  building?: string;
  rack?: string;
  received_at?: string;
  received_by?: string;
}


interface StorePR {
  id: string;
  department?: string;
  requested_by?: string;
  description?: string;
  priority?: string;
  required_date?: string;
  remarks?: string;
  department_statuses: DepartmentStatus[];
  items: Item[];

  finance_payment_details?: FinancePaymentDetails;
  order_details?: PROrderDetails;
  store_receiving_details?: StoreReceivingDetails[];
}

/* ================= COMPONENT ================= */

export default function SubmittedFinanceRequestsPage() {
  const { user, token } = useContext(AuthContext);
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/new-store`;

  const [requests, setRequests] = useState<StorePR[]>([]);
  const [selectedPR, setSelectedPR] = useState<StorePR | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");

  const [orderDetails, setOrderDetails] = useState({
    quantityStatus: "",
    partialQuantity: "",
    rejectionReason: "",
    building: "",
    rack: "",
  });

  const STORE_STATUS_OPTIONS = [
    "STORE APPROVED",
    "STORE REJECTED",
    "STORE PENDING",
  ];

  const [updateData, setUpdateData] = useState<{
    department_statuses: DepartmentStatus[];
    items: Item[];
  }>({
    department_statuses: [],
    items: [],
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
   
  
  const formatEnumText = (value?: string) => {
  if (!value) return "";
  return value.replace(/_/g, " ");
};




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

  // const fetchApprovedRequests = async () => {
  //   const res = await axios.get(`${API_BASE}/finance-approved-store-requests`);
  //   setRequests(res.data.data || []);
  // };

  // const fetchApprovedRequests = async () => {
  //   try {
  //     const [allRes, filteredRes] = await Promise.all([
  //       axios.get(`${API_BASE}/finance-approved-store-requests`, {
  //         withCredentials: true,
  //       }),
  //       axios.get(`${API_BASE}/finance-approved-store-requests/partial`, {
  //         withCredentials: true,
  //       }),
  //     ]);

  //     const allData = allRes.data.data || [];
  //     const filteredData = filteredRes.data.data || [];

  //     // 👉 Merge or use separately
  //     const uniquePRs = Object.values(
  //       allData.reduce((acc: any, pr: any) => {
  //         acc[pr.id] = pr; // overwrite duplicates
  //         return acc;
  //       }, {})
  //     );

  //     setRequests(uniquePRs);
  //     console.log("🔥 FULL API RESPONSE:", allRes.data);
  //     console.log("🔥 PR LIST:", allData);
  //     console.log("PR IDs:", allData.map((pr: any) => pr.id));

  //   } catch (err) {
  //     console.error("Error fetching requests:", err);
  //   }
  // };

  const fetchApprovedRequests = async () => {
    try {
      const [allRes, filteredRes] = await Promise.all([
        axios.get(`${API_BASE}/finance-approved-store-requests`, {
          withCredentials: true,
        }),
        axios.get(`${API_BASE}/finance-approved-store-requests/partial`, {
          withCredentials: true,
        }),
      ]);

      const allData = allRes.data.data || [];

      const uniquePRs = Object.values(
        allData.reduce((acc: any, pr: any) => {
          acc[pr.id] = pr;
          return acc;
        }, {})
      ) as StorePR[];

      // ✅ FILTER OUT COMPLETED PRs
      const activePRs = uniquePRs.filter((pr) => {
        let details: StoreReceivingDetails[] = [];

        // ✅ Ensure it's always an array
        if (Array.isArray(pr.store_receiving_details)) {
          details = pr.store_receiving_details;
        } else if (pr.store_receiving_details) {
          // if backend sends single object → wrap it
          details = [pr.store_receiving_details as StoreReceivingDetails];
        }

        // ✅ If no details → keep PR
        if (details.length === 0) return true;

        // ✅ Find latest safely
        const latest = details.reduce((latest, current) => {
          if (!latest) return current;

          const currentTime = current.received_at
            ? new Date(current.received_at).getTime()
            : 0;

          const latestTime = latest.received_at
            ? new Date(latest.received_at).getTime()
            : 0;

          return currentTime > latestTime ? current : latest;
        }, null as StoreReceivingDetails | null);

        // ✅ Normalize status
        const status = latest?.quantity_status?.trim().toUpperCase();

        // ❌ Remove FULL
        return status !== "FULL";
      });
      // ✅ Sort latest PR first (15,14,13...)
      const sortedPRs = activePRs.sort(
        (a, b) => Number(b.id) - Number(a.id)
      );

      setRequests(sortedPRs);

    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };



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

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
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
    const fetchVendors = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`,
          {
            method: "GET",
            credentials: "include", // enables cookies
          },
        );

        const data = await res.json();


        const map: Record<string, string> = {};
        (data?.data || []).forEach((v: any) => {
          map[String(v.vendor_id)] = v.vendor_name;
        });
        setVendorMap(map);
      } catch (err) {
        console.error("Vendor fetch error:", err);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const openPR = (pr: StorePR) => {
    setSelectedPR(pr);

    setUpdateData({
      department_statuses: pr.department_statuses || [],
      items: pr.items || [],
    });

    // 🔥 PREFILL STORE RECEIVING DETAILS
    let details: StoreReceivingDetails[] = [];

    // ✅ normalize to array
    if (Array.isArray(pr.store_receiving_details)) {
      details = pr.store_receiving_details;
    } else if (pr.store_receiving_details) {
      details = [pr.store_receiving_details as StoreReceivingDetails];
    }

    // ✅ find latest safely
    let latest: StoreReceivingDetails | null = null;

    if (details.length > 0) {
      latest = details.reduce((prev, curr) => {
        const prevTime = prev?.received_at
          ? new Date(prev.received_at).getTime()
          : 0;

        const currTime = curr?.received_at
          ? new Date(curr.received_at).getTime()
          : 0;

        return currTime > prevTime ? curr : prev;
      }, details[0]);
    }
    setOrderDetails({
      quantityStatus: latest?.quantity_status || "",
      partialQuantity: latest?.partial_quantity || "",
      rejectionReason: latest?.rejection_reason || "",
      building: latest?.building || "",
      rack: latest?.rack || "",
    });
    setModalOpen(true);
    setNewStatus("");
    setNewComment("");
  };

  //  const submitUpdate = async () => {
  //   if (!selectedPR || !newStatus) {
  //     setAlert({
  //       type: "error",
  //       message: "Please select procurement PR status",
  //     });
  //     return;
  //   }

  //   try {
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

  //     await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload);

  //     // Show success alert
  //     setAlert({
  //       type: "success",
  //       message: "Procurement PR Updated",
  //     });

  //     // Close modal after a short delay (optional)
  //     setTimeout(() => {
  //       setModalOpen(false);
  //       setAlert(null);
  //     }, 2000);

  //     // Refresh the PR list
  //     fetchApprovedRequests();
  //   } catch (err) {
  //     console.error(err);
  //     setAlert({
  //       type: "error",
  //       message: "Failed to update PR",
  //     });
  //   }
  // };


  // const submitUpdate = async () => {
  //   if (!selectedPR || !newStatus) {
  //     setAlert({
  //       type: "error",
  //       message: "Please select procurement PR status",
  //     });
  //     return;
  //   }

  //   try {
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

  //     // await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload, {
  //     //   headers: {
  //     //     Authorization: `Bearer ${token}`,
  //     //   },
  //     // });
  //     await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload, {
  //       withCredentials: true,
  //     });

  //     setAlert({
  //       type: "success",
  //       message: "Procurement PR Updated",
  //     });

  //     setTimeout(() => {
  //       setModalOpen(false);
  //       setAlert(null);
  //     }, 2000);

  //     fetchApprovedRequests();
  //   } catch (err) {
  //     console.error(err);
  //     setAlert({
  //       type: "error",
  //       message: "Failed to update PR",
  //     });
  //   }
  // };



  // const submitUpdate = async () => {
  //   if (!selectedPR || !newStatus) {
  //     setAlert({
  //       type: "error",
  //       message: "Please select procurement PR status",
  //     });
  //     return;
  //   }

  //   try {
  //     // Map frontend state to backend expected key
  //     const storeReceivingDetails = {
  //       quantity_status: orderDetails.quantityStatus,
  //       partial_quantity: orderDetails.partialQuantity || null,
  //       rejection_reason: orderDetails.rejectionReason || null,
  //       building: orderDetails.building || null,
  //       rack: orderDetails.rack || null,
  //       received_at: new Date().toISOString(),
  //       received_by: user.first_name,
  //     };

  //     console.log("Submitting Store Receiving Details:", storeReceivingDetails);

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
  //       store_receiving_details: storeReceivingDetails, // <- key matches backend
  //     };

  //     // Send to backend
  //     await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload, {
  //       withCredentials: true,
  //     });

  //     setAlert({
  //       type: "success",
  //       message: "Store PR updated successfully",
  //     });

  //     setTimeout(() => {
  //       setModalOpen(false);
  //       setAlert(null);
  //     }, 2000);

  //     // Refresh list
  //     fetchApprovedRequests();
  //   } catch (err) {
  //     console.error("❌ Failed to update Store PR:", err);
  //     setAlert({
  //       type: "error",
  //       message: "Failed to update Store PR",
  //     });
  //   }
  // };

  const submitUpdate = async () => {
    if (!selectedPR || !newStatus) {
      setAlert({
        type: "error",
        message: "Please select procurement PR status",
      });
      return;
    }

    try {
      const paymentStage =
        selectedPR.finance_payment_details?.payment_stage;

      const quantityStatus = orderDetails.quantityStatus;

      // 🔥 CONDITION HERE
      let overrideStatus = newStatus;

      const finalStatus = newStatus;
      const storeReceivingDetails = {
        quantity_status: quantityStatus,
        partial_quantity: orderDetails.partialQuantity || null,
        rejection_reason: orderDetails.rejectionReason || null,
        building: orderDetails.building || null,
        rack: orderDetails.rack || null,
        received_at: new Date().toISOString(),
        received_by: user.first_name,
      };

      const payload = {
        department_statuses: [
          {
            department_status: finalStatus, // 👈 use override
            department_comment: newComment,
            status_updated_by: user.first_name,
            updated_at: new Date().toISOString(),
          },
        ],
        items: updateData.items,
        store_receiving_details: storeReceivingDetails,
      };

      await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload, {
        withCredentials: true,
      });

      setAlert({
        type: "success",
        message: "Store PR updated successfully",
      });

      setTimeout(() => {
        setModalOpen(false);
        setAlert(null);
      }, 2000);

      fetchApprovedRequests();
    } catch (err) {
      console.error("❌ Failed to update Store PR:", err);
      setAlert({
        type: "error",
        message: "Failed to update Store PR",
      });
    }
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
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Update PR-{selectedPR.id} info
            </h2>

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

                  {/* Partial Percentage (only if stage = PARTIAL) */}
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

            {/* ================= PR ORDER DETAILS ================= */}
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


            {/* =================  ORDER Receiving DETAILS ================= */}
            {selectedPR && (
              <div className="border border-gray-200 rounded p-4 mb-4">
                <h3 className="font-semibold mb-4 text-purple-600">
                  Order Receiving Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {/* Quantity Status */}
                  <div>
                    <label className="text-xs font-medium">Quantity Status</label>
                    <select
                      value={orderDetails.quantityStatus}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          quantityStatus: e.target.value,
                          partialQuantity: "", // reset if changed
                        })
                      }
                      className="border p-2 rounded w-full bg-white"
                    >
                      <option value="">Select</option>
                      <option value="FULL">Full</option>
                      <option value="PARTIAL">Partial</option>
                    </select>
                  </div>

                  {/* Partial Quantity */}
                  {orderDetails.quantityStatus === "PARTIAL" && (
                    <div>
                      <label className="text-xs font-medium">Partial Quantity</label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        value={orderDetails.partialQuantity}
                        onChange={(e) =>
                          setOrderDetails({
                            ...orderDetails,
                            partialQuantity: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full bg-white"
                      />
                    </div>
                  )}

                  {/* Rejection Reason */}
                  <div>
                    <label className="text-xs font-medium">Rejection Reason</label>
                    <input
                      type="text"
                      placeholder="Enter reason (if rejected)"
                      value={orderDetails.rejectionReason}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          rejectionReason: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Stored Building */}
                  <div>
                    <label className="text-xs font-medium">Stored Building</label>
                    <select
                      value={orderDetails.building}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          building: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full bg-white"
                    >
                      <option value="">Select Building</option>
                      <option value="Building A">Building A</option>
                      <option value="Building B">Building B</option>
                    </select>
                  </div>

                  {/* Rack */}
                  <div>
                    <label className="text-xs font-medium">Rack</label>
                    <select
                      value={orderDetails.rack}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          rack: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full bg-white"
                    >
                      <option value="">Select Rack</option>
                      <option value="R1">Rack 1</option>
                      <option value="R2">Rack 2</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {(() => {
              let details: StoreReceivingDetails[] = [];

              if (Array.isArray(selectedPR.store_receiving_details)) {
                details = selectedPR.store_receiving_details;
              } else if (selectedPR.store_receiving_details) {
                details = [selectedPR.store_receiving_details];
              }

              if (details.length === 0) return null;

              return (
                <div className="border border-gray-200 rounded p-4 mb-4">
                  <h3 className="font-semibold mb-4 text-purple-600">
                    Order Received History
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">Date</th>
                          <th className="p-2 border">Status</th>
                          <th className="p-2 border">Partial Qty</th>
                          <th className="p-2 border">Building</th>
                          <th className="p-2 border">Rack</th>
                          <th className="p-2 border">Received By</th>
                        </tr>
                      </thead>

                      <tbody>
                        {details.map((rec, i) => (
                          <tr key={i} className="text-center">
                            <td className="p-2 border">
                              {rec.received_at
                                ? new Date(rec.received_at).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="p-2 border">{rec.quantity_status || "-"}</td>
                            <td className="p-2 border">{rec.partial_quantity || "-"}</td>
                            <td className="p-2 border">{rec.building || "-"}</td>
                            <td className="p-2 border">
                              {rec.rack
                                ? rec.rack.startsWith("R")
                                  ? `Rack${rec.rack.slice(1)}`
                                  : rec.rack
                                : "-"}
                            </td>
                            <td className="p-2 border">{rec.received_by || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
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
                      <option value="">Select Store Status</option>
                      {STORE_STATUS_OPTIONS.map((s) => (
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
                      Update Store PR
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