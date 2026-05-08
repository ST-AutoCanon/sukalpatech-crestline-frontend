import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import Alert from "../../../components/Aleartmessage";
import { AuthContext } from "../../../../../context/AuthContext";

/* ================= TYPES ================= */

interface DepartmentStatus {
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
  department_comment: string | number | readonly string[] | undefined;
  quotation_validity_date: any;
  attachments: string | undefined;
  id: number;
  vendor_id: string;
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

interface FeasibilityPR {
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

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id?: number; // existing
  category: string
}

/* ================= COMPONENT ================= */

export default function SubmittedRequestsPage() {
  const { user } = useContext(AuthContext);//user,category
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility`;

  const [requests, setRequests] = useState<FeasibilityPR[]>([]);
  const [selectedPR, setSelectedPR] = useState<FeasibilityPR | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const department_statuses = ["Feasibility APPROVED", "Feasibility REJECTED", "Feasibility PENDING"];
  const VENDOR_STATUS_OPTIONS = ["feasibility Approved", "feasibility Rejected", "feasibility Pending"];

  const [updateData, setUpdateData] = useState<{ department_statuses: DepartmentStatus[]; items: Item[] }>({
    department_statuses: [],
    items: [],
  });

  const [vendorUpdates, setVendorUpdates] = useState<{ [key: string]: { status: string; comment: string } }>({});
  const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>({});

  const updateVendorField = (itemIndex: number, vendorIndex: number, field: "status" | "comment", value: string) => {
    const key = `${itemIndex}-${vendorIndex}`;
    setVendorUpdates((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString("en-GB") : "");

  //   useEffect(() => {
  //     // Fetch submitted PRs

  //     axios.get(`${API_BASE}/submitted-requests`).then((res) => setRequests(res.data.data || []));
  //     // Fetch vendors
  //     axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`).then((res) => {
  //       const map: Record<string, string> = {};
  //       (res.data.data || []).forEach((v: any) => (map[String(v.vendor_id)] = v.vendor_name));
  //       setVendorMap(map);
  //     });
  //     // Fetch departments
  //     axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/departments`).then((res) => {
  //   const map: Record<string, string> = {};

  //   (res.data.data || []).forEach((d: any) => {
  //     map[String(d.department_id)] = d.name;
  //   });

  //   setDepartmentMap(map);
  // });
  // }, []);


  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   // Fetch submitted PRs
  //   axios
  //     .get(`${API_BASE}/submitted-requests`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       setRequests(res.data.data || []);
  //     });

  //   // Fetch vendors
  //   axios
  //     .get(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       const map: Record<string, string> = {};
  //       (res.data.data || []).forEach(
  //         (v: any) => (map[String(v.vendor_id)] = v.vendor_name),
  //       );
  //       setVendorMap(map);
  //     });

  //   // Fetch departments
  //   axios
  //     .get(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       const map: Record<string, string> = {};
  //       (res.data.data || []).forEach(
  //         (d: any) => (map[String(d.department_id)] = d.name),
  //       );
  //       setDepartmentMap(map);
  //     });
  // }, []);

  useEffect(() => {
    // Fetch submitted PRs
    axios
      .get(`${API_BASE}/submitted-requests`, { withCredentials: true })
      .then((res) => setRequests(res.data.data || []))
      .catch((err) => console.error(err));

    // Fetch vendors
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, { withCredentials: true })
      .then((res) => {
        const map: Record<string, string> = {};
        (res.data.data || []).forEach((v: any) => (map[String(v.vendor_id)] = v.vendor_name));
        setVendorMap(map);
      })
      .catch((err) => console.error(err));

    // Fetch departments
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, { withCredentials: true })
      .then((res) => {
        const map: Record<string, string> = {};
        (res.data.data || []).forEach((d: any) => (map[String(d.department_id)] = d.name));
        setDepartmentMap(map);
      })
      .catch((err) => console.error(err));
  }, []);

  const openPR = (pr: FeasibilityPR) => {
    setSelectedPR(pr);
    setUpdateData({ department_statuses: pr.department_statuses || [], items: pr.items || [] });
    setModalOpen(true);
    setNewStatus("");
    setNewComment("");
    setVendorUpdates({});
  };

  const totalPrice = useMemo(() => {
    return updateData.items.reduce((sum, item) => {
      return (
        sum +
        item.vendors.reduce((vendorSum, v) => {
          const price = Number(
            String(v.total_price || 0).replace(/,/g, "")
          );
          return vendorSum + (isNaN(price) ? 0 : price);
        }, 0)
      );
    }, 0);
  }, [updateData.items]);


  //  const submitUpdate = async () => {
  //   if (!selectedPR || !newStatus) {
  //     setAlert({
  //       type: "error",
  //       message: "Please select procurement PR status",
  //     });
  //     return;
  //   }

  //   const token = localStorage.getItem("token");

  //   try {
  //     // 🔹 1️⃣ Call approval check API first
  //     const approvalRes = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/categorylimit/approve`,
  //       { amount: totalPrice },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // 🔹 2️⃣ If allowed → continue update
  //     if (approvalRes.data.success) {

  //       const payload = {
  //         department_statuses: [
  //           {
  //             department_status: newStatus,
  //             department_comment: newComment,
  //             status_updated_by: user.first_name,
  //             updated_at: new Date().toISOString(),
  //           },
  //         ],
  //         items: updateData.items,
  //       };

  //       await axios.put(
  //         `${API_BASE}/feasibility-requests/${selectedPR.id}`,
  //         payload,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       setAlert({
  //         type: "success",
  //         message: "Feasibility PR approved successfully",
  //       });

  //       setModalOpen(false);
  //     }

  //   } catch (error: any) {
  //     setAlert({
  //       type: "error",
  //       message:
  //         error.response?.data?.message ||
  //         "Approval denied. Limit exceeded.",
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

    // ✅ Check if at least ONE vendor has status selected
    const hasAtLeastOneVendorStatus = updateData.items.some((item, itemIndex) =>
      item.vendors.some((vendor, vendorIndex) => {
        const key = `${itemIndex}-${vendorIndex}`;
        return vendorUpdates[key]?.status; // check if status exists
      })
    );

    if (!hasAtLeastOneVendorStatus) {
      setAlert({
        type: "error",
        message: "Please select status for at least one vendor",
      });
      return;
    }

    try {
      const approvalRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/categorylimit/approve`,
        { amount: totalPrice },
        { withCredentials: true }
      );

      if (approvalRes.data.success) {

        // 🔥 MERGE vendorUpdates INTO items
        const updatedItems = updateData.items.map((item, itemIndex) => ({
          ...item,
          vendors: item.vendors.map((vendor, vendorIndex) => {
            const key = `${itemIndex}-${vendorIndex}`;
            const updates = vendorUpdates[key];

            if (!updates) return vendor;

            return {
              ...vendor,
              status: updates.status || vendor.status,
              comments: updates.comment
                ? [
                  ...(vendor.comments || []),
                  {
                    comment: updates.comment,
                    commented_by: user.id,
                    commented_at: new Date().toISOString(),
                  },
                ]
                : vendor.comments,
            };
          }),
        }));

        const payload = {
          department_statuses: [
            {
              department_status: newStatus,
              department_comment: newComment,
              status_updated_by: user.first_name,
              updated_at: new Date().toISOString(),
            },
          ],
          items: updatedItems, // ✅ send merged items
        };

        await axios.put(
          `${API_BASE}/feasibility-requests/${selectedPR.id}`,
          payload,
          { withCredentials: true }
        );

        setAlert({
          type: "success",
          message: "Feasibility PR updated successfully",
        });

        setModalOpen(false);
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Approval denied. Limit exceeded.",
      });
    }
  };
  return (
    <div className="p-4 sm:p-6 text-black">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* PR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {requests.map((pr) => (
          <div key={pr.id} onClick={() => openPR(pr)} className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col">
            <h2 className="text-purple-600 font-semibold text-lg mb-2 truncate">PR ID: {pr.id}</h2>
            <div className="flex-1 space-y-1 text-sm">
              {[
                ["Department", departmentMap[String(pr.department)] ?? pr.department],
                ["Priority", pr.priority],
                [
                  "Required",
                  pr.required_date
                    ? new Date(pr.required_date).toLocaleDateString("en-US")
                    : "-"
                ],
                ["Description", pr.description],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800 truncate">{value || "-"}</span>
                </div>
              ))}
            </div>
            <span className="text-blue-600 text-sm font-medium mt-2">Update</span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && selectedPR && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50 px-2 sm:px-4">
          <div className="bg-white w-full max-w-[95vw] sm:max-w-6xl rounded shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Update PR-{selectedPR.id} info
            </h2>
            <button className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800" onClick={() => setModalOpen(false)}>
              ×
            </button>
            {/* PR DETAILS */}
            <div className="bg-gray-100 p-4 rounded mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
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
            {/* ITEM SECTION TOGGLE */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setExpandItems(!expandItems)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded"
              >
                {expandItems ? "−" : "+"}
              </button>
            </div>

            {/* ITEMS */}
            {expandItems &&
              updateData.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-100 p-3 sm:p-4 rounded mb-4 space-y-4"
                >
                  {/* ITEM HEADER */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-2 sm:mb-4 py-2 sm:py-4">
                    {/* mobile */}
                    <div className="flex flex-col sm:hidden gap-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold">
                          Item Code:
                        </span>
                        <span className="bg-white border rounded px-2 py-1 flex-1 ml-5">
                          {item.item_code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold">
                          Item Name:
                        </span>
                        <span className="bg-white border rounded px-2 py-1 flex-1 ml-3">
                          {item.item_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold">Qty:</span>
                        <span className="bg-white border rounded px-2 py-1 flex-1 ml-16">
                          {item.quantity_required} units
                        </span>
                      </div>
                    </div>

                    {/* desktop */}
                    <div className="hidden sm:grid sm:grid-cols-3 gap-8 mb-4 text-sm w-full">
                      {/* Item Code */}
                      <div className="flex items-center gap-3">
                        <label className="font-medium min-w-[80px] text-gray-700">
                          Item Code
                        </label>

                        <input
                          readOnly
                          value={item.item_code || ""}
                          className="border rounded px-3 py-1 w-[180px] bg-white"
                        />
                      </div>

                      {/* Item Name */}
                      <div className="flex items-center gap-3">
                        <label className="font-medium min-w-[80px] text-gray-700">
                          Item Name
                        </label>

                        <input
                          readOnly
                          value={item.item_name || ""}
                          className="border rounded px-3 py-1 w-[260px] bg-white"
                        />
                      </div>

                      {/* Qty */}
                      <div className="flex items-center gap-3">
                        <label className="font-medium min-w-[50px] text-gray-700">
                          Qty
                        </label>

                        <input
                          readOnly
                          value={item.quantity_required ?? ""}
                          className="border rounded px-3 py-1 w-[260px] bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* VENDORS */}

                  {item.vendors?.map((vendor, vi) => {
                    const key = `${i}-${vi}`;
                    const vendorData = vendorUpdates[key] || {
                      status: "",
                      comment: "",
                    };
                    return (
                      <div key={vendor.id} className="mb-4">
                        
                        {/* MOBILE VIEW */}
                        <div className="sm:hidden overflow-x-auto">
                          <div className="flex gap-3 min-w-[900px]">
                            {/* Vendor */}
                            <div className="flex flex-col min-w-[140px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Vendor
                              </span>
                              <input
                                readOnly
                                value={
                                  vendorMap[String(vendor.vendor_id)] || "-"
                                }
                                placeholder="Select Vendor"
                                className="border rounded px-2 py-1 bg-white"
                              />
                            </div>

                            {/* Upload Quotation */}
                            <div className="flex flex-col min-w-[160px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Upload Quotation
                              </span>
                              {/* <input
                                readOnly
                                value={vendor.attachments?.[0]?.file_name || ""}
                                placeholder="No attachment"
                                className="border rounded px-2 py-1 bg-white"
                              /> */}

                              {(() => {
                                const validAttachment = vendor.attachments?.find(
                                  (att: any) => att.file_path && att.file_path.trim() !== ""
                                );

                                return validAttachment ? (
                                  <a
                                    href={`${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border rounded px-2 py-1 bg-white text-blue-600 truncate block"
                                    title={validAttachment.file_name}
                                  >
                                    {validAttachment.file_name || validAttachment.file_path}
                                  </a>
                                ) : (
                                  <input
                                    readOnly
                                    value="No file"
                                    className="border rounded px-2 py-1 bg-gray-100 text-gray-400"
                                  />
                                );
                              })()}
                            </div>

                            {/* Unit Price */}
                            <div className="flex flex-col min-w-[120px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Unit Price
                              </span>
                              <input
                                readOnly
                                value={vendor.unit_price ?? ""}
                                placeholder="Unit Price"
                                className="border rounded px-2 py-1 bg-white"
                              />
                            </div>

                            {/* Total Price */}
                            <div className="flex flex-col min-w-[120px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Total Price
                              </span>
                              <input
                                readOnly
                                value={vendor.total_price ?? ""}
                                placeholder="Total Price"
                                className="border rounded px-2 py-1 bg-white"
                              />
                            </div>

                            {/* Validity */}
                            <div className="flex flex-col min-w-[150px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Validity
                              </span>
                              <input
                                readOnly
                                value={
                                  vendor.quotation_validity_date
                                    ? new Date(
                                      vendor.quotation_validity_date
                                    ).toLocaleDateString()
                                    : ""
                                }
                                placeholder="Validity Date"
                                className="border rounded px-2 py-1 bg-white"
                              />
                            </div>

                            {/* Existing Comments */}
                            <div className="flex flex-col min-w-[200px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Feasibility Comments
                              </span>
                              <input
                                readOnly
                                value={
                                  vendor.comments
                                    ?.map((c) => c.comment)
                                    .join(", ") || ""
                                }
                                placeholder="Comment"
                                className="border rounded px-2 py-1 bg-gray-50"
                              />
                            </div>

                            {/* New Comment */}
                            <div className="flex flex-col min-w-[200px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Feasibility Comment
                              </span>
                              <input
                                value={vendorData.comment}
                                onChange={(e) =>
                                  updateVendorField(
                                    i,
                                    vi,
                                    "comment",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter feasibility comment"
                                className="border rounded px-2 py-1 bg-white"
                              />
                            </div>

                            {/* Status */}
                            <div className="flex flex-col min-w-[140px]">
                              <span className="text-xs font-medium text-gray-600 mb-1">
                                Status
                              </span>
                              <select
                                value={vendorData.status}
                                onChange={(e) =>
                                  updateVendorField(
                                    i,
                                    vi,
                                    "status",
                                    e.target.value
                                  )
                                }
                                className="border rounded px-2 py-1 bg-white"
                              >
                                <option value="">Select Status</option>
                                {VENDOR_STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* DESKTOP VIEW */}
                        <div className="hidden sm:grid sm:grid-cols-8 gap-4 text-sm">
                          {/* Vendor */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              Vendor
                            </span>
                            <input
                              readOnly
                              value={vendorMap[String(vendor.vendor_id)] || ""}
                              placeholder="Select Vendor"
                              className="border rounded px-2 py-1 w-full"
                            />
                          </div>

                          {/* Upload Quotation */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              Upload Quotation
                            </span>
                            {/* <input
                              readOnly
                              value={vendor.attachments?.[0]?.file_name || ""}
                              placeholder="No attachment"
                              className="border rounded px-2 py-1 w-full"
                            /> */}
                            {(() => {
                              const validAttachment = vendor.attachments?.find(
                                (att: any) => att.file_path && att.file_path.trim() !== ""
                              );

                              return validAttachment ? (
                                <a
                                  href={`${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="border rounded px-2 py-1 bg-white text-blue-600 truncate block"
                                  title={validAttachment.file_name}
                                >
                                  {validAttachment.file_name || validAttachment.file_path}
                                </a>
                              ) : (
                                <input
                                  readOnly
                                  value="No file"
                                  className="border rounded px-2 py-1 bg-gray-100 text-gray-400"
                                />
                              );
                            })()}
                          </div>

                          {/* Unit Price */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              Unit Price
                            </span>
                            <input
                              readOnly
                              value={vendor.unit_price ?? ""}
                              placeholder="Unit Price"
                              className="border rounded px-2 py-1 w-full"
                            />
                          </div>

                          {/* Total Price */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              Total Price
                            </span>
                            <input
                              readOnly
                              value={vendor.total_price ?? ""}
                              placeholder="Total Price"
                              className="border rounded px-2 py-1 w-full"
                            />
                          </div>

                          {/* Quotation Validity */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              Validity
                            </span>
                            <input
                              readOnly
                              value={
                                vendor.quotation_validity_date
                                  ? new Date(
                                    vendor.quotation_validity_date
                                  ).toLocaleDateString()
                                  : ""
                              }
                              placeholder="Validity Date"
                              className="border rounded px-2 py-1 w-full"
                            />
                          </div>

                          {/* Existing Comments */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              PR Comments
                            </span>
                            <input
                              readOnly
                              value={
                                vendor.comments
                                  ?.map((c) => c.comment)
                                  .join(", ") || ""
                              }
                              placeholder="Comment"
                              className="border rounded px-2 py-1 w-full bg-gray-50"
                            />
                          </div>

                          {/* New Comment */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              Feasibility Comment
                            </span>
                            <input
                              value={vendorData.comment}
                              onChange={(e) =>
                                updateVendorField(
                                  i,
                                  vi,
                                  "comment",
                                  e.target.value
                                )
                              }
                              placeholder="Enter feasibility comment"
                              className="border rounded px-2 py-1 w-full"
                            />
                          </div>

                          {/* Status */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              Status
                            </span>
                            <select
                              value={vendorData.status}
                              onChange={(e) =>
                                updateVendorField(
                                  i,
                                  vi,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            >
                              <option value="">Select Status</option>
                              {VENDOR_STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

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
              <div className="border border-gray-300 rounded p-4 mb-4">
                <h3 className="font-semibold mb-2">Statuses</h3>
                <div className="space-y-4">
                  {updateData.department_statuses.map((s, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 p-4 rounded flex flex-col sm:flex-row sm:justify-between gap-2"
                    >
                      <div className="flex flex-col gap-1">
                        <p>
                          <strong>Status:</strong> {s.department_status}
                        </p>
                        <p>
                          <strong>Comment:</strong> {s.department_comment}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        {s.status_updated_by ?? "—"} •{" "}
                        <span>
                          {s.updated_at
                            ? new Date(s.updated_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* Add new status */}
                  <div className="bg-gray-200 rounded p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="bg-white border p-2 rounded w-full"
                      >
                        <option value="">Select Feasibility Status</option>
                        {department_statuses.map((s) => (
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
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={submitUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Feasibility PR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
