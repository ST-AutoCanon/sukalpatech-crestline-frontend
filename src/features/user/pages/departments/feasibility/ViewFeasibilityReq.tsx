import { useContext, useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { AuthContext } from "../../../../../context/AuthContext";
import Alert from "../../../components/Aleartmessage";

type Props = {
  filter: string;
  search: string;
  refreshKey: number;
};


type DepartmentStatus = {
  department_status: string;
  department_comment: string;
  status_updated_by: string;
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
  vendor_id: string;
  id: number;
  vendor_name: string;
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

  finance_payment_details?: FinancePaymentDetails | null;
  order_details?: PROrderDetails;
  store_receiving_details?: StoreReceivingDetails | null;
};

export default function ViewPRPage({ filter, search, refreshKey }: Props) {
  const { user, token } = useContext(AuthContext);
  const [prs, setPrs] = useState<PR[]>([]);
  const [activePR, setActivePR] = useState<PR | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showStatus, setShowStatus] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const getLatestStatus = (pr: PR) => {
    const statuses = pr.department_statuses || [];
    return statuses[statuses.length - 1]?.department_status?.toUpperCase() || "";
  };

  const matchesFilter = (status: string, filter: string) => {
    if (filter === "Pending") return status.includes("PENDING");
    if (filter === "Rejected") return status.includes("REJECTED");
    if (filter === "Completed") return status.includes("APPROVED");

    return true; // for "All" or others
  };

  //   const fetchPRs = async () => {
  //     setLoading(true);
  //     try {
  //       const token = localStorage.getItem("token"); // or however you store it

  //       let url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;

  //       if (
  //         filter === "Pending" ||
  //         filter === "Rejected" ||
  //         filter === "Completed"
  //       ) {
  //         const status =
  //           filter === "Completed" ? "STORE APPROVED" : filter.toUpperCase();
  //         url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/prs/status/${status}`;
  //       }

  //       const res = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         credentials: "include", // <-- added
  //       });

  //       if (!res.ok) {
  //         throw new Error("Failed to fetch PRs");
  //       }

  //       const data = await res.json();

  //       const prsData = (data?.data || []).map((pr: PR) => ({
  //         ...pr,
  //         items: pr.items || [],
  //         department_statuses: pr.department_statuses || [],
  //       }));

  // const filteredPRs = prsData.filter((pr) => {
  //   const latestStatus = getLatestStatus(pr);
  //   return matchesFilter(latestStatus, filter);
  // });

  // setPrs(filteredPRs);
  //     } catch (err) {
  //       console.error("Fetch PR error", err);
  //       setPrs([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const fetchPRs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;

      if (["Pending", "Rejected"].includes(filter)) {
        const status = filter.toUpperCase();

        url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/prs/status/${status}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch PRs");

      let data = await res.json();

     const rawData = data?.data || [];

// ✅ STEP 1: sort by latest store receiving update OR updated_at
rawData.sort((a: any, b: any) => {
  const aTime = new Date(
    a.store_receiving_details?.updated_at || a.updated_at || 0
  ).getTime();

  const bTime = new Date(
    b.store_receiving_details?.updated_at || b.updated_at || 0
  ).getTime();

  return bTime - aTime; // latest first
});

// ✅ STEP 2: keep only latest PR record per id
const map: Record<string, PR> = {};

for (const pr of rawData) {
  const key = String(pr.id);

  const existing = map[key];

  const newTime = new Date(
    pr.store_receiving_details?.updated_at || pr.updated_at || 0
  ).getTime();

  const oldTime = existing
    ? new Date(
        existing.store_receiving_details?.updated_at || existing.updated_at || 0
      ).getTime()
    : 0;

  if (!existing || newTime > oldTime) {
    map[key] = {
      ...pr,
      items: [
        ...(map[key]?.items || []),
        ...(pr.items || []),
      ],
    };
  }
}
let prsData = Object.values(map).sort((a: any, b: any) => b.id - a.id);
// ✅ SEARCH
if (search.trim()) {
  prsData = prsData.filter((pr) =>
    pr.description?.toLowerCase().includes(search.toLowerCase())
  );
}

// ✅ FILTER
prsData = prsData.filter((pr) => {
  const latestStatus = getLatestStatus(pr);

  if (filter === "Pending") {
    return latestStatus.includes("PENDING");
  }

  if (filter === "Rejected") {
    return latestStatus.includes("REJECTED");
  }

  if (filter === "Completed") {
    const paymentStage =
      pr.finance_payment_details?.payment_stage?.toLowerCase();

    const quantityStatus =
      pr.store_receiving_details?.quantity_status?.toUpperCase();

    if (!paymentStage || !quantityStatus) return false;

    return paymentStage === "final" && quantityStatus === "FULL";
  }

  return true;
});

      setPrs(prsData);
    } catch (err) {
      console.error(err);
      setPrs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs();
  }, [filter, search, refreshKey]);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
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
  //   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
  //     credentials: "include", // <-- added
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
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const map: Record<string, string> = {};
        (data?.data || []).forEach((v: any) => (map[String(v.vendor_id)] = v.vendor_name));
        setVendorMap(map);
      })
      .catch(err => console.error(err));
  }, []);


  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility/submitted-requests`)
  //     .then((res) => res.json())
  //     .then((data) => setPrs(data?.data || []))
  //     .catch((err) => console.error("Fetch PR Error:", err));
  // }, []);

  // Departments
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const map: Record<string, string> = {};
        (data?.data || []).forEach((d: any) => (map[String(d.department_id)] = d.name));
        setDepartmentMap(map);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility/submitted-requests`,
      {
        credentials: "include", // <-- added
      },
    )
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err));
  }, []);


  //  const isEditable = (pr: PR) => {
  //   if (filter !== "PR Raised") return false;
  //   const latestStatus = pr.department_statuses?.[pr.department_statuses.length - 1]?.department_status;
  //   return latestStatus === "CREATED";
  // };



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
  const toggleItemsSection = () => setShowItems((prev) => !prev);

  if (loading) return <div className="p-6">Loading PRs...</div>;

  const savePR = async (pr: PR) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/full/${pr.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(pr),
      }
    );

    if (!res.ok) {
      throw new Error("Save failed");
    }

    const updatedPR: PR = await res.json();
    return updatedPR;
  };

  // const handleSave = async () => {
  //   if (!activePR) return;

  //   try {
  //     let updatedPRData = { ...activePR };

  //     if (newStatus) {
  //       updatedPRData = {
  //         ...updatedPRData,
  //         department_statuses: [
  //           ...(updatedPRData.department_statuses || []),
  //           {
  //             department_status: newStatus,
  //             department_comment: newComment,
  //             status_updated_by: user?.id || "",
  //             updated_at: new Date().toISOString(),
  //           },
  //         ],
  //       };
  //     }

  //     const savedPR = await savePR(updatedPRData);

  //     setPrs((prev) =>
  //       prev.map((pr) => (pr.id === savedPR.id ? savedPR : pr))
  //     );

  //     setNewStatus("");
  //     setNewComment("");

  //     setActivePR(null);
  //     setEditMode(false);

  //     // ✅ SUCCESS ALERT
  //     setAlert({
  //       type: "success",
  //       message: "PR updated successfully!",
  //     });

  //     setTimeout(() => setAlert(null), 3000);

  //   } catch (err) {
  //     console.error("Save error:", err);

  //     // ❌ ERROR ALERT
  //     setAlert({
  //       type: "error",
  //       message: "Failed to update PR.",
  //     });

  //     setTimeout(() => setAlert(null), 3000);
  //   }
  // };

  const handleSave = async () => {
    if (!activePR) return;

    try {
      let updatedPRData = { ...activePR };

      if (newStatus) {
        updatedPRData = {
          ...updatedPRData,
          department_statuses: [
            ...(updatedPRData.department_statuses || []),
            {
              department_status: newStatus,
              department_comment: newComment,
              status_updated_by: user?.first_name || "User",
              updated_at: new Date().toISOString(),
            },
          ],
        };
      }

      // ✅ Call API
      await savePR(updatedPRData);

      // ✅ Refetch based on current tab
      await fetchPRs();

      setNewStatus("");
      setNewComment("");
      setEditMode(false);
      setActivePR(null);

      setAlert({
        type: "success",
        message: "PR updated successfully!",
      });

      setTimeout(() => setAlert(null), 3000);

    } catch (err) {
      console.error("Save error:", err);

      setAlert({
        type: "error",
        message: "Failed to update PR.",
      });

      setTimeout(() => setAlert(null), 3000);
    }
  };
   const formatDateForInput = (date: string) => {
    if (!date) return "";
    return date.split("T")[0]; // ✅ NO timezone conversion
  };

  const isEditable = (pr: PR) => {
    const latestStatus =
      pr.department_statuses?.[pr.department_statuses.length - 1]
        ?.department_status;

    if (!latestStatus) return true;

    const statusUpper = latestStatus.toUpperCase();

    // ❌ Block only final-level approvals
    if (
      statusUpper.includes("STORE APPROVED") ||
      statusUpper.includes("FINANCE APPROVED") ||
      statusUpper.includes("COMPLETED") ||
      statusUpper.includes("REJECTED")
    ) {
      return false;
    }

    // ✅ Allow editing for feasibility statuses
    return true;
  };

  const getLatestFeasibilityStatus = (pr) => {
    const statuses = pr.department_statuses || [];

    const feasibility = [...statuses]
      .reverse()
      .find((s) =>
        s.department_status?.toUpperCase().includes("FEASIBILITY")
      );

    return feasibility?.department_status?.trim() || null;
  };

  const isFeasibilityDone = (pr) => {
    const status = getLatestFeasibilityStatus(pr);

    if (!status) return false;

    const normalized = status.trim().toUpperCase();

    return (
      normalized === "FEASIBILITY APPROVED" ||
      normalized === "FEASIBILITY REJECTED" ||
      normalized === "FEASIBILITY PENDING"
    );
  };
  const formatEnumText = (value?: string) => {
  if (!value) return "";
  return value.replace(/_/g, " ");
};
  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {/* PR Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => {
          const latestStatusObj = pr.department_statuses?.[pr.department_statuses.length - 1];
          const status = latestStatusObj?.department_status || "Draft";

          return (
            <div
              key={pr.id}
              className="relative bg-white rounded-xl p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
              onClick={() => setActivePR(pr)}
            >
              <h3 className="text-purple-600 font-semibold text-lg mb-2 truncate">PR ID:{pr.id}</h3>
              <div className="space-y-1 text-sm flex-1">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 shrink-0">Description</span>
                  <span className="font-medium text-gray-700 max-w-[65%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {pr.description || "-"}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-gray-400">Priority</span><span className="font-medium text-gray-700">{pr.priority}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="font-medium text-gray-700">{status}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Department</span><span className="font-medium text-gray-700 truncate">{departmentMap[String(pr.department)] ?? pr.department}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Delivery Date</span><span className="font-medium text-gray-700">
                    {pr.required_date
                      ? new Date(pr.required_date).toLocaleDateString("en-US")
                      : "-"}
                  </span></div>
              </div>

              <div className="mt-3 flex gap-4">
                <button
                  className="text-sm font-semibold text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(false);
                    setActivePR(pr);
                  }}
                >
                  More Info
                </button>
                {isEditable(pr) && (
                  <button
                    className={`text-sm font-semibold ${isFeasibilityDone(pr)
                      ? "text-blue-600 hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                      }`}
                    disabled={!isFeasibilityDone(pr)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFeasibilityDone(pr)) return; // extra safety
                      setEditMode(true);
                      setActivePR(pr);
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal (only one, outside the map) */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-5xl md:max-w-7xl rounded-xl shadow-xl p-4 md:p-6 text-black flex flex-col">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                {editMode ? `Edit PR-${activePR.id} info` : `View PR-${activePR.id} info`}
              </h2>
              <button onClick={() => setActivePR(null)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>

            {/* PR Info */}
            <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4">
              {/* Mobile view */}
              <div className="space-y-3 sm:hidden text-sm">
                <div>
                  <div className="text-gray-900">Description</div>
                  <input
                    value={activePR.description || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Priority</div>
                  <input
                    value={activePR.priority || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
  <div className="text-gray-900">Delivery Date</div>

  <input
    type="date"
    value={
      activePR.required_date
        ? activePR.required_date.split("T")[0]
        : ""
    }
    readOnly
    onChange={(e) =>
      setActivePR({
        ...activePR,
        required_date: e.target.value,
      })
    }
    className="bg-white border rounded px-2 py-1 w-full"
  />
</div>

                <div>
                  <div className="text-gray-900">Department</div>
                  <input
                    value={
                      departmentMap[String(activePR.department)] ??
                      activePR.department ??
                      ""
                    } readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, department: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Remarks</div>
                  <input
                    value={activePR.remarks || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, remarks: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>
              </div>

              {/* Desktop view */}
              <div className="hidden sm:block overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-2">
                  <span>Description</span>
                  <span>Priority</span>
                  <span> Delivery Date</span>
                  <span>Department</span>
                  <span>Remarks</span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <input
                    value={activePR.description || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.priority || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    type="date"
                    value={formatDateForInput(activePR.required_date)}
                    readOnly={true}
                    onChange={(e) => {
                      const date = e.target.value; // "2026-03-01"
                      setActivePR({
                        ...activePR,
                        required_date: new Date(date).toISOString(), // full ISO
                      });
                    }}
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""}`}
                  />

                  <input
                    value={
                      departmentMap[String(activePR.department)] ??
                      activePR.department ??
                      ""
                    } readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, department: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.remarks || ""}
                    readOnly={true}
                    onChange={(e) =>
                      setActivePR({ ...activePR, remarks: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>
              </div>
            </div>

            {/* Items Section Toggle */}
            <div className="flex justify-end mb-2">
              <button
                onClick={toggleItemsSection}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded flex items-center"
              >
                {showItems ? <Minus size={16} /> : <Plus size={16} />}
              </button>
            </div>

            {/* Items */}
            {showItems && (
              <div className="space-y-4">
                {activePR.items?.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="bg-gray-100 rounded-lg p-3 md:p-4 w-full overflow-x-auto"
                  >
                    {/* Item header */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 text-sm">
                      {/* Item Code */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">
                          Item Code
                        </span>
                        <input
                          value={item.item_code || ""}
                          readOnly={true}
                          onChange={(e) => {
                            const updatedItems = [...activePR.items];
                            updatedItems[itemIndex] = {
                              ...updatedItems[itemIndex],
                              item_code: e.target.value,
                            };

                            setActivePR({ ...activePR, items: updatedItems });
                          }}

                          className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                            }`}
                        />

                      </div>

                      {/* Description */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">
                          Item Name
                        </span>
                        <input
                          value={item.item_name || ""}
                          readOnly={true}
                          onChange={(e) => {
                            const updatedItems = [...activePR.items];
                            updatedItems[itemIndex] = {
                              ...updatedItems[itemIndex],
                              item_name: e.target.value,
                            };

                            setActivePR({ ...activePR, items: updatedItems });
                          }}

                          className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                            }`}
                        />

                      </div>

                      {/* Qty */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">Qty</span>
                        <input
                          type="number"
                          min={0}
                          value={item.quantity_required ?? ""}
                          readOnly={true}
                          onChange={(e) => {
                            const updatedItems = [...activePR.items];
                            updatedItems[itemIndex] = {
                              ...updatedItems[itemIndex],
                              quantity_required: Math.max(0, Number(e.target.value)),
                            };

                            setActivePR({ ...activePR, items: updatedItems });
                          }}
                          className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                            }`}
                        />


                      </div>
                    </div>

                    {/* Vendors */}
                    <div className="overflow-x-auto">
                      {item.vendors?.length > 0 && (
                        <>
                          {/* ===== DESKTOP LABELS ===== */}
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

                          {/* ===== DESKTOP VALUES ===== */}
                          {item.vendors.map((vendor, vendorIndex) => {
                            const prComment =
                              vendor.comments?.[0]?.comment || "";
                            console.log("Vendor comments:", vendor.comments);



                            const feasibilityComment =
                              vendor.comments?.length > 1
                                ? vendor.comments[vendor.comments.length - 1]?.comment
                                : "";

                            return (
                              <div
                                key={vendor.id}
                                className="hidden sm:grid sm:grid-cols-8 gap-4 text-sm mb-2"
                              >
                                {/* {editMode ? (
                                  <select
                                    value={vendor.vendor_id}
                                    onChange={(e) => {
                                      const updatedItems = [...activePR.items];
                                      updatedItems[itemIndex].vendors[vendorIndex] = {
                                        ...updatedItems[itemIndex].vendors[vendorIndex],
                                        vendor_id: e.target.value, // still store the ID
                                      };
                                      setActivePR({ ...activePR, items: updatedItems });
                                    }}
                                    className="bg-white border rounded px-2 py-1 w-full border-blue-400"
                                  >
                                    {Object.entries(vendorMap).map(([id, name]) => (
                                      <option key={id} value={id}>
                                        {name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    value={vendorMap[String(vendor.vendor_id)] ?? vendor.vendor_id} // <-- show name
                                    readOnly
                                    className="bg-gray-100 border rounded px-2 py-1 w-full"
                                  />
                                )} */}
                                <input
                                  value={vendorMap[String(vendor.vendor_id)] ?? vendor.vendor_id}
                                  readOnly
                                  className="bg-gray-100 border rounded px-2 py-1 w-full"
                                />
                                {/* 
                                <label
                                  className={`border rounded px-2 py-1 w-full text-sm flex items-center ${editMode
                                    ? "cursor-pointer border-blue-400 bg-white"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                  {vendor.attachments?.[0]?.file_name || "No file uploaded"}

                                  {editMode && (
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const updatedItems = [...activePR.items];
                                        updatedItems[itemIndex].vendors[vendorIndex] = {
                                          ...updatedItems[itemIndex].vendors[vendorIndex],
                                          attachments: [
                                            {
                                              file_name: file.name,
                                              file_path: "",
                                            },
                                          ],
                                        };

                                        setActivePR({ ...activePR, items: updatedItems });
                                      }}
                                    />
                                  )}
                                </label> */}

                                {/* <label className="border rounded px-2 py-1 w-full text-sm flex items-center bg-gray-100 text-gray-600 cursor-not-allowed  truncate overflow-hidden whitespace-nowrap">
                                  {vendor.attachments?.[0]?.file_name || "No file uploaded"}
                                </label>
                                 */}
                                <div>

                                  <label
                                    className={`w-full border rounded px-2 py-1 text-sm flex items-center overflow-hidden ${editMode
                                      ? "cursor-pointer border-blue-400 bg-white"
                                      : "bg-gray-100 text-gray-600"
                                      }`}
                                  >
                                    {/* <span
                                        className="truncate w-full block text-blue-600 underline cursor-pointer"
                                        onClick={() => {
                                          if (!vendor.attachments?.[0]) return;

                                          const file = vendor.attachments[0];

                                          let fileUrl = "";

                                          // ✅ If new file (local preview)
                                          if (file.fileObject) {
                                            fileUrl = URL.createObjectURL(file.fileObject);
                                          }
                                          // ✅ If saved file (from backend)
                                          else if (file.file_path) {
                                            fileUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${file.file_path}`;
                                          }

                                          if (fileUrl) {
                                            window.open(fileUrl, "_blank");
                                          }
                                        }}
                                      >
                                        {vendor.attachments?.[0]?.file_name || "No file uploaded"}
                                      </span> */}
                                    {(() => {
                                      const validAttachment = vendor.attachments?.find(
                                        (att: any) =>
                                          (att.file_path && att.file_path.trim() !== "") || att.fileObject
                                      );

                                      if (!validAttachment) {
                                        return <span className="text-gray-400 text-sm">No file</span>;
                                      }

                                      const fileUrl = validAttachment.fileObject
                                        ? validAttachment.file_path // local preview (URL.createObjectURL)
                                        : `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`;

                                      return (
                                        <a
                                          href={fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 underline text-sm truncate block"
                                        >
                                          {validAttachment.file_name || "View File"}
                                        </a>
                                      );
                                    })()}


                                    {editMode && (
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;

                                          const updatedItems = [...activePR.items];

                                          updatedItems[itemIndex].vendors[vendorIndex] = {
                                            ...updatedItems[itemIndex].vendors[vendorIndex],
                                            attachments: [
                                              {
                                                id: Date.now(),
                                                file_name: file.name,
                                                file_path: URL.createObjectURL(file),
                                                uploaded_by: 0,
                                                uploaded_at: new Date().toISOString(),
                                                fileObject: file,
                                              },
                                            ],
                                          };

                                          setActivePR({ ...activePR, items: updatedItems });
                                        }}
                                      />
                                    )}
                                  </label>
                                </div>



                                <input
                                  type="number"
                                  min={0}
                                  value={vendor.unit_price ?? ""}
                                  readOnly={true}
                                  onChange={(e) => {
                                    const updatedItems = [...activePR.items];

                                    const price = Math.max(0, Number(e.target.value));
                                    const qty = updatedItems[itemIndex].quantity_required || 0;

                                    updatedItems[itemIndex].vendors[vendorIndex] = {
                                      ...updatedItems[itemIndex].vendors[vendorIndex],
                                      unit_price: price,
                                      total_price: qty * price,
                                    };

                                    setActivePR({ ...activePR, items: updatedItems });
                                  }}
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                    }`}
                                />



                                <input
                                  value={vendor.total_price ?? ""}
                                  readOnly={true}
                                  onChange={(e) =>
                                    updateVendorField(itemIndex, vendorIndex, "total_price", Number(e.target.value))
                                  }
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                    }`}
                                />



                                <input
                                  type="date"
                                  value={vendor.quotation_validity_date ?? ""}
                                  disabled={true}
                                  onChange={(e) => {
                                    const updatedItems = [...activePR.items];
                                    updatedItems[itemIndex].vendors[vendorIndex] = {
                                      ...updatedItems[itemIndex].vendors[vendorIndex],
                                      quotation_validity_date: e.target.value,
                                    };
                                    setActivePR({ ...activePR, items: updatedItems });
                                  }}
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : "bg-gray-100 cursor-not-allowed"
                                    }`}
                                />



                                <input
                                  readOnly
                                  value={prComment}
                                  className="bg-white border rounded px-2 py-1 w-full"
                                />


                                <input
                                  value={feasibilityComment}
                                  readOnly={!editMode}
                                  onChange={(e) => {
                                    const updatedItems = [...activePR.items];

                                    const vendorToUpdate =
                                      updatedItems[itemIndex].vendors[vendorIndex];

                                    // If no comments exist, create one
                                    if (!vendorToUpdate.comments || vendorToUpdate.comments.length === 0) {
                                      vendorToUpdate.comments = [
                                        {
                                          id: 0,
                                          comment: e.target.value,
                                          commented_by: user.id,
                                          commented_at: new Date().toISOString(),
                                        },
                                      ];
                                    } else {
                                      // Update last feasibility comment
                                      const lastIndex = vendorToUpdate.comments.length - 1;

                                      vendorToUpdate.comments[lastIndex] = {
                                        ...vendorToUpdate.comments[lastIndex],
                                        comment: e.target.value,
                                      };
                                    }

                                    setActivePR({ ...activePR, items: updatedItems });
                                  }}
                                  className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                    }`}
                                />
                                {editMode ? (
                                  <select
                                    value={vendor.status ?? ""}
                                    onChange={(e) => {
                                      const updatedItems = [...activePR.items];
                                      updatedItems[itemIndex].vendors[vendorIndex] = {
                                        ...updatedItems[itemIndex].vendors[vendorIndex],
                                        status: e.target.value,
                                      };
                                      setActivePR({ ...activePR, items: updatedItems });
                                    }}
                                    className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                                  >
                                    <option value="feasibility Pending">feasibility Pending</option>
                                    <option value="feasibility rejected">feasibility rejected</option>
                                    <option value="feasibility approved">feasibility approved</option>
                                  </select>
                                ) : (
                                  <input
                                    value={vendor.status || "-"}
                                    readOnly
                                    className="bg-gray-100 border rounded px-2 py-1 w-full"
                                  />
                                )}

                              </div>
                            );
                          })}

                          {/* ===== MOBILE VIEW ===== */}
                          {item.vendors.map((vendor) => {
                            const prComment =
                              vendor.comments?.[0]?.comment || "";


                            const feasibilityComment =
                              vendor.comments?.length > 1
                                ? vendor.comments[vendor.comments.length - 1]?.comment
                                : "";

                            return (
                              <div
                                key={vendor.id}
                                className="sm:hidden flex gap-4 overflow-x-auto mb-4"
                              >
                                {[
                                  [
                                    "Vendor",
                                    vendorMap[String(vendor.vendor_id)] ??
                                    vendor.vendor_id,
                                  ],
                                  [
                                    "Upload Quotation",
                                    (() => {
                                      const validAttachment = vendor.attachments?.find(
                                        (att: any) =>
                                          (att.file_path && att.file_path.trim() !== "") || att.fileObject
                                      );

                                      if (!validAttachment) {
                                        return <span className="text-gray-400">No file</span>;
                                      }

                                      const fileUrl = validAttachment.fileObject
                                        ? validAttachment.file_path // local preview (blob URL)
                                        : `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`;

                                      return (
                                        <a
                                          href={fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 underline block truncate"
                                        >
                                          {validAttachment.file_name || "View File"}
                                        </a>
                                      );
                                    })(),
                                  ],
                                  ["Unit Price", vendor.unit_price ?? "-"],
                                  ["Total Price", vendor.total_price ?? "-"],
                                  [
                                    "Quotation Validity",
                                    vendor.quotation_validity_date
                                      ? new Date(
                                        vendor.quotation_validity_date
                                      ).toLocaleDateString()
                                      : "-",
                                  ],
                                  ["Comments", prComment],
                                  ["Feasibility Comment", feasibilityComment],
                                  ["Status", vendor.status || "-"],
                                ].map(([label, value], idx) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col min-w-[150px]"
                                  >
                                    <span className="text-gray-500 text-xs">
                                      {label}
                                    </span>
                                    {label === "Upload Quotation" ? (
                                      <div className="bg-white border rounded px-2 py-1 w-full text-sm">
                                        {value}
                                      </div>
                                    ) : (
                                      <input
                                        readOnly
                                        value={value as string}
                                        className="bg-white border rounded px-2 py-1 w-full"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* FINANCE PAYMENT DETAILS */}
            {activePR.finance_payment_details && (
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
                        activePR.finance_payment_details.payment_stage || ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* ✅ Show Percentage ONLY if PARTIAL */}
                  {activePR.finance_payment_details.payment_stage ===
                    "PARTIAL" && (
                      <div>
                        <label className="text-xs font-medium">
                          Partial Percentage
                        </label>
                        <input
                          readOnly
                          value={
                            activePR.finance_payment_details.partial_percentage
                              ? `${activePR.finance_payment_details.partial_percentage}%`
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
                        activePR.finance_payment_details.final_completed
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
                        activePR.finance_payment_details.finance_comment || ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                </div>

                {/* Payment Proof */}
                {activePR.finance_payment_details.payment_proof_file_path && (
                  <div className="mt-4">
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/${activePR.finance_payment_details.payment_proof_file_path}`}
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

            {/* PR ORDER DETAILS */}
            {activePR.order_details && (
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
                        activePR.order_details.order_placed_at
                          ? new Date(
                            activePR.order_details.order_placed_at,
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
                        activePR.order_details.expected_delivery_date
                          ? new Date(
                            activePR.order_details.expected_delivery_date,
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
                      value={formatEnumText(activePR.order_details.transport_mode || "")}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* ✅ IN HOUSE → Show Delivery Type */}
                  {activePR.order_details.transport_mode === "IN_HOUSE" && (
                    <div>
                      <label className="text-xs font-medium">Delivery Type</label>
                      <input
                        readOnly
                        value={formatEnumText(activePR.order_details.in_house_type || "")}
                        className="border p-2 rounded w-full bg-white"
                      />
                    </div>
                  )}

                  {/* ✅ COLLECT → Show Vendor Address */}
                  {activePR.order_details.transport_mode === "COLLECT" && (
                    <div>
                      <label className="text-xs font-medium">Vendor Address</label>
                      <input
                        readOnly
                        value={activePR.order_details.vendor_address || ""}
                        className="border p-2 rounded w-full bg-white"
                      />
                    </div>
                  )}

                  {/* PO File */}
                  {activePR.order_details.po_file_path && (
                    <div>
                      <label className="text-xs font-medium">PO File</label>
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/${activePR.order_details.po_file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {activePR.order_details.po_file_name ||
                          "View PO File"}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* STORE RECEIVING DETAILS */}
            {activePR.store_receiving_details && (
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
                        activePR.store_receiving_details.quantity_status || ""
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Partial Quantity (only if applicable) */}
                  {activePR.store_receiving_details.quantity_status ===
                    "PARTIAL" && (
                      <div>
                        <label className="text-xs font-medium">
                          Partial Quantity
                        </label>
                        <input
                          readOnly
                          value={
                            activePR.store_receiving_details.partial_quantity ??
                            0
                          }
                          className="border p-2 rounded w-full bg-white"
                        />
                      </div>
                    )}

                  {/* Rejection Reason (if exists) */}
                  {activePR.store_receiving_details.rejection_reason && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium">
                        Rejection Reason
                      </label>
                      <textarea
                        readOnly
                        value={
                          activePR.store_receiving_details.rejection_reason
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
                      value={activePR.store_receiving_details.building || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Rack */}
                  <div>
                    <label className="text-xs font-medium">Rack</label>
                    <input
                      readOnly
                      value={activePR.store_receiving_details.rack || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Statuses Section */}
            <div className="mb-6">
              <div className="flex justify-end mt-2 mb-2">
                <button
                  onClick={() => setShowStatus((prev) => !prev)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded shadow"
                >
                  {showStatus ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 overflow-x-auto">
                <h3 className="font-semibold text-base mb-3">Statuses</h3>

                {showStatus && (
                  <div className="space-y-4 min-w-[350px] sm:min-w-[500px]">
                    {Array.isArray(activePR.department_statuses) &&
                      activePR.department_statuses.map((ds, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                        >
                          <div className="flex flex-col sm:flex-row justify-between mb-1 text-xs text-gray-600 gap-2">

                            {/* ALWAYS READ-ONLY STATUS */}
                            <input
                              value={ds.department_status}
                              readOnly
                              className="px-2 py-1 text-xs bg-gray-200 rounded w-full sm:w-auto"
                            />

                            <span className="font-medium text-gray-800">
                              {ds.status_updated_by ?? "—"} •{" "}
                              {ds.updated_at
                                ? new Date(ds.updated_at).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>

                          {/* ALWAYS READ-ONLY COMMENT */}
                          <div className="text-xs text-gray-600 mt-1">
                            <input
                              value={ds.department_comment || ""}
                              readOnly
                              className="px-2 py-1 rounded w-full text-xs bg-gray-200"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {editMode && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <select
                        className="px-3 py-2 border rounded text-sm"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select Feasibility Status</option>
                        <option value="FEASIBILITY PENDING">FEASIBILITY PENDING</option>
                        <option value="FEASIBILITY APPROVED">FEASIBILITY APPROVED</option>
                        <option value="FEASIBILITY REJECTED">FEASIBILITY REJECTED</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Enter comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="px-3 py-2 border rounded text-sm"
                      />
                    </div>

                    <div className="flex justify-end mt-3">

                    </div>
                  </div>
                )}
              </div>
            </div>
            {editMode && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded border border-gray-300"
                  onClick={() => {
                    setEditMode(false);
                    setActivePR(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={handleSave}
                >
                  Save
                </button>

              </div>


            )}
          </div>
        </div>
      )}
    </>
  );
}
