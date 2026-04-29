import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../../context/AuthContext";
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
  id: number;
  vendor_id: number;
  status?: string;
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
}

/* ================= COMPONENT ================= */
export default function SubmittedStoreeRequestsPage() {
  const { user, token } = useContext(AuthContext);
  const API_BASE = `${
    import.meta.env.VITE_BACKEND_URL
  }/api/new-procurement`;

  const [requests, setRequests] = useState<StorePR[]>([]);
  const [selectedPR, setSelectedPR] = useState<StorePR | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [expandItems, setExpandItems] = useState(true);
  const [expandStatus, setExpandStatus] = useState(true);

  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");



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
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  //   const res = await axios.get(
  //     `${API_BASE}/purchase-requests`
  //   );
  //   setRequests(res.data.data || []);
  // };

 const fetchApprovedRequests = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_BASE}/purchase-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const rawData = res.data.data || [];

  const grouped = Object.values(
    rawData.reduce((acc: any, pr: StorePR) => {
      const key = String(pr.id);

      if (!acc[key]) {
        acc[key] = {
          ...pr,
          items: [],
        };
      }

      // merge items safely
      if (pr.items?.length) {
        acc[key].items.push(...pr.items);
      }

      return acc;
    }, {})
  );

  setRequests(grouped);
};


  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  /* ================= HANDLERS ================= */
  const openPR = (pr: StorePR) => {
    setSelectedPR(pr);
    setUpdateData({
      department_statuses: pr.department_statuses || [],
      items: pr.items || [],
    });
    setModalOpen(true);
    setNewStatus("");
    setNewComment("");
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
  gap-x-4
  gap-y-8
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

            {/* BODY */}
            <div className="flex-1 space-y-3 text-sm">
              <div className="flex gap-1">
                <span className="text-gray-500">Department :</span>
                <span className="font-medium text-gray-600 truncate">
                  {pr.department || "-"}
                </span>
              </div>

              <div className="flex gap-1">
                <span className="text-gray-500">Priority :</span>
                <span className="font-medium text-gray-600 truncate">
                  {pr.priority || "-"}
                </span>
              </div>

              <div className="flex gap-1">
                <span className="text-gray-500">Required :</span>
                <span className="font-medium text-gray-600">
                  {formatDate(pr.required_date)}
                </span>
              </div>

              <div className="flex gap-1">
                <span className="text-gray-500">Description :</span>
                <span className="font-medium text-gray-600 line-clamp-2">
                  {pr.description || "-"}
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <span className="text-blue-600 text-sm font-medium mt-4">
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
            <button
              className="absolute -top-1 -right-1 text-2xl text-gray-600 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              View PR-{selectedPR.id} info
            </h2>

            {/* PR DETAILS */}
            <div className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[300px]">
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
                      {/* HEADER */}
                      <div className="grid grid-cols-8 gap-2 min-w-[700px] text-sm font-medium text-gray-700 mb-2">
                        <div>Vendor</div>
                        <div>Unit Price</div>
                        <div>Total Price</div>
                        <div>Quotation Validity</div>
                        <div>Upload Quotation</div>
                        <div>PR Comments</div>
                        <div>Feasibility comment</div>
                        <div>status</div>
                      </div>

                      {/* VENDOR ROWS */}

                      {item.vendors.map((vendor, vi) => {
                        // Find the latest feasibility comment (commented_by = 2)
                        const feasibilityComment =
                          vendor.comments?.find((c) => c.commented_by === 2)
                            ?.comment || "";

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
