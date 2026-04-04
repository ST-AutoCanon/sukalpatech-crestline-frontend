import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import Aleart from "../../../components/Aleartmessage";

type Props = {
  filter: string;
  search: string;
  refreshKey: number;
};

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
  const [prs, setPrs] = useState<PR[]>([]);
  const [activePR, setActivePR] = useState<PR | null>(null);
  const [showItems, setShowItems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStatuses, setShowStatuses] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>({});
  const [originalPR, setOriginalPR] = useState(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const getLatestStatus = (pr: PR) => {
    const statuses = pr.department_statuses || [];
    return statuses[statuses.length - 1]?.department_status?.toUpperCase() || "";
  };






  // Fetch vendors
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const vendors = data?.data || [];
  //       const map: Record<string, string> = {};
  //       vendors.forEach((v: any) => (map[String(v.vendor_id)] = v.vendor_name));
  //       setVendorMap(map);
  //     })
  //     .catch((err) => console.error("Vendor fetch error", err));
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
      credentials: "include", // ✅ send cookie
    })
      .then((res) => res.json())
      .then((data) => {
        const vendors = data?.data || [];
        const map: Record<string, string> = {};

        vendors.forEach((v: any) => {
          map[String(v.vendor_id)] = v.vendor_name;
        });

        setVendorMap(map);
      })
      .catch((err) => console.error("Vendor fetch error", err));
  }, []);


  // Fetch departments
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const departments = data?.data || [];
  //       const map: Record<string, string> = {};
  //       departments.forEach((d: any) => (map[String(d.department_id)] = d.name));
  //       setDepartmentMap(map);
  //     })
  //     .catch((err) => console.error("Department fetch error", err));
  // }, []);

  useEffect(() => {


    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, {
      credentials: "include", // ✅ send cookie
    })
      .then((res) => res.json())
      .then((data) => {
        const departments = data?.data || [];
        const map: Record<string, string> = {};
        console.log("departments", departments);

        departments.forEach((d: any) => {
          map[String(d.department_id)] = d.name;
        });

        setDepartmentMap(map);
      })
      .catch((err) => console.error("Department fetch error", err));
  }, []);


  // const fetchPRs = async () => {
  //   setLoading(true);
  //   try {
  //     let url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;
  //     if (filter === "Pending" || filter === "Rejected" || filter === "Completed") {
  //       const status = filter === "Completed" ? "APPROVED" : filter.toUpperCase();
  //       url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/prs/status/${status}`;
  //     }
  //     const res = await fetch(url);
  //     const data = await res.json();
  //     const prsData = (data?.data || []).map((pr: PR) => ({
  //       ...pr,
  //       items: pr.items || [],
  //       department_statuses: pr.department_statuses || [],
  //     }));
  //     setPrs(prsData);
  //   } catch (err) {
  //     console.error("Fetch PR error", err);
  //     setPrs([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPRs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;

      if (
        filter === "Pending" ||
        filter === "Rejected" ||
        filter === "Completed"
      ) {
        const status =
          filter === "Completed" ? "STORE APPROVED" : filter.toUpperCase();
        url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/prs/status/${status}`;
      }

      const res = await fetch(url, {
        credentials: "include", // ✅ send cookie
      });

      const data = await res.json();

      // const prsData = (data?.data || []).map((pr: PR) => ({
      //   ...pr,
      //   items: pr.items || [],
      //   department_statuses: pr.department_statuses || [],
      // }));

      const prsData = (data?.data || []).map((pr: PR) => {
        // 🔥 convert department NAME → ID
        const deptEntry = Object.entries(departmentMap).find(
          ([_, name]) => name === pr.department
        );

        return {
          ...pr,
          department: deptEntry ? deptEntry[0] : String(pr.department), // ✅ FIX
          items: pr.items || [],
          department_statuses: pr.department_statuses || [],
        };
      });

      const filteredPRs = prsData.filter((pr: PR) => {
        const latestStatus = getLatestStatus(pr);

        if (filter === "Pending") return latestStatus.includes("PENDING");
        if (filter === "Rejected") return latestStatus.includes("REJECTED");
        if (filter === "Completed") return latestStatus.includes("APPROVED");

        return true;
      });

      setPrs(filteredPRs);
    } catch (err) {
      console.error("Fetch PR error", err);
      setPrs([]);
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   fetchPRs();
  // }, [filter, search, refreshKey]);

  useEffect(() => {
    if (Object.keys(departmentMap).length > 0) {
      fetchPRs(); // ✅ only after departments loaded
    }
  }, [filter, search, refreshKey, departmentMap]);

  // const isEditable = (pr: PR) => {
  //   if (filter !== "PR Raised") return false;
  //   const latestStatus = pr.department_statuses?.[pr.department_statuses.length - 1]?.department_status;
  //   return latestStatus === "CREATED";
  // };
  const isEditable = (pr: PR) => {
  const statuses = pr.department_statuses || [];

  if (statuses.length === 0) return true;

  const latestStatus =
    statuses[statuses.length - 1]?.department_status?.toUpperCase().trim() || "";

  return latestStatus.includes("CREATED") || latestStatus.includes("PENDING");
};

  const toggleItemsSection = () => setShowItems((prev) => !prev);

     const normalizeDate = (date: string) => {
       if (!date) return "";

       const d = new Date(date);

       const year = d.getFullYear();
       const month = String(d.getMonth() + 1).padStart(2, "0");
       const day = String(d.getDate()).padStart(2, "0");

       return `${year}-${month}-${day}`;
  };
  
  if (loading) return <div className="p-6">Loading PRs...</div>;
  const savePR = async (pr: PR) => {
    const token = localStorage.getItem("token");

    // 0️⃣ Full PR Save
    const fullRes = await fetch(
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

    // if (!fullRes.ok) throw new Error("Full PR Save failed");
    if (!fullRes.ok) {
      const errorData = await fullRes.json();
      console.error("❌ Backend error:", errorData);
      throw new Error(errorData?.message || "Full PR Save failed");
    }

    const updatedFullPR = await fullRes.json();

    // 1️⃣ Update PR Details
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/${pr.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: pr.description,
          priority: pr.priority,
          required_date: pr.required_date,
          remarks: pr.remarks,
          department: pr.department,
        }),
      }
    );

    // 2️⃣ Update Items
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/${pr.id}/items`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: pr.items.map((item) => ({
            id: item.id,
            item_code: item.item_code,
            item_name: item.item_name,
            quantity_required: item.quantity_required,
          })),
        }),
      }
    );

    // 3️⃣ Vendors + Attachments + Comments
    for (const item of pr.items) {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/items/${item.id}/vendors`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendors: item.vendors.map((vendor) => ({
              id: vendor.id,
              vendor_id: vendor.vendor_id,
              status: vendor.status,
              unit_price: vendor.unit_price,
              total_price: vendor.total_price,
              quotation_validity_date: vendor.quotation_validity_date,
            })),
          }),
        }
      );

      // for (const vendor of item.vendors) {
      //   await fetch(
      //     `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors/${vendor.id}/attachments`,
      //     {
      //       method: "PUT",
      //       credentials: "include",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ attachments: vendor.attachments || [] }),
      //     }
      //   );

      //   await fetch(
      //     `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors/${vendor.id}/comments`,
      //     {
      //       method: "PUT",
      //       credentials: "include",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ comments: vendor.comments || [] }),
      //     }
      //   );
      // }


      for (const vendor of item.vendors) {
        const attachment = vendor.attachments?.[0];

        // ✅ Only proceed if a NEW file is selected
        if (!attachment || !attachment.fileObject) continue;

        const formData = new FormData();
        formData.append("file", attachment.fileObject); // must match multer field

        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors/${vendor.id}/attachments`,
            {
              method: "PUT",
              credentials: "include",
              body: formData, // ❗ don't set headers
            },
          );

          if (!res.ok) {
            throw new Error(`Upload failed for vendor ${vendor.id}`);
          }

          // ✅ Clear fileObject after successful upload (VERY IMPORTANT)
          attachment.fileObject = null;
        } catch (err) {
          console.error("❌ Attachment upload error:", err);
        }
      }
    }

    return updatedFullPR;
  };

  // const handleSave = async () => {
  //   if (!activePR) return;

  //   try {
  //     await savePR(activePR);

  //     setEditMode(false);
  //     setActivePR(null); // close modal

  //     fetchPRs(); // refresh list

  //     setAlert({
  //       type: "success",
  //       message: "PR updated successfully!",
  //     });

  //   } catch (err) {
  //     console.error("Save failed", err);

  //     setAlert({
  //       type: "error",
  //       message: "Failed to update PR.",
  //     });
  //   }
  // };
  // const formatDateForInput = (date: string) => {
  //   if (!date) return "";
  //   return new Date(date).toISOString().split("T")[0];
  // };

  const handleSave = async () => {
    if (!activePR) return;

    try {
      let formattedDate = "";

      if (activePR.required_date) {
        if (activePR.required_date.includes("T")) {
          // already ISO → strip time completely
          formattedDate = activePR.required_date.split("T")[0];
        } else {
          // already YYYY-MM-DD → keep as is
          formattedDate = activePR.required_date;
        }
      }
   

      const normalizedPR: PR = {
        ...activePR,
        // required_date: formattedDate,
        required_date: activePR.required_date,
      };

      await savePR(normalizedPR);

      setEditMode(false);
      setActivePR(null);
      fetchPRs();

      setAlert({
        type: "success",
        message: "PR updated successfully!",
      });

    } catch (err) {
      console.error("Save failed", err);

      setAlert({
        type: "error",
        message: "Failed to update PR.",
      });
    }
  };
//   const formatDateForInput = (date: string) => {
//   if (!date) return "";
//   return date.split("T")[0];
  // };
  
  // const formatDateForInput = (date: string) => {
  //   if (!date) return "";
  //   const d = new Date(date);
  //   return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
  // };
const formatDateForInput = (date: string) => {
  if (!date) return "";
  return date.split("T")[0]; // ✅ NO timezone conversion
};

  return (
    <>
      {alert && (
        <Aleart
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => {
          const latestStatusObj = pr.department_statuses?.[pr.department_statuses.length - 1];
          const status = latestStatusObj?.department_status || "Draft";

          return (
            <div
              key={pr.id}
              className="relative bg-white rounded-xl p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
              // onClick={() => setActivePR(pr)}
              onClick={() =>
                setActivePR({
                  ...pr,
                  required_date: pr.required_date
                    ? pr.required_date.split("T")[0]
                    : "",
                })
              }
            >
              <h3 className="text-purple-600 font-semibold text-lg mb-2 truncate">
                PR ID:{pr.id}
              </h3>
              <div className="space-y-1 text-sm flex-1">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 shrink-0">Description</span>
                  <span className="font-medium text-gray-700 max-w-[65%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {pr.description || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className="font-medium text-gray-700">
                    {pr.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium text-gray-700 truncate">
                    {departmentMap[String(pr.department)] ?? pr.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Date</span>
                  <span className="font-medium text-gray-700">
                    {pr.required_date
                      ? new Date(pr.required_date).toLocaleDateString("en-US")
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-4">
                <button
                  className="text-sm font-semibold text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(false);
                    // setActivePR(pr);
                 setActivePR({
                   ...pr,
                   required_date: normalizeDate(pr.required_date),
                 });
                  }}
                >
                  More Info
                </button>

                {(filter === "PR Raised" || filter === "Pending") &&
                  isEditable(pr) && (
                    <button
                      className="text-sm font-semibold text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditMode(true);

                        setOriginalPR(pr); // ✅ store original data

                        // setActivePR({
                        //   ...pr,
                        //   department: pr.department ? String(pr.department) : "",
                        // });

                       setActivePR({
                         ...pr,
                         department: pr.department ? String(pr.department) : "",
                         required_date: normalizeDate(pr.required_date), // ✅ ADD THIS
                       });
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
                    readOnly={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Priority</div>
                  {editMode ? (
                    <select
                      value={activePR.priority || ""}
                      onChange={(e) =>
                        setActivePR({ ...activePR, priority: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Select Priority
                      </option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  ) : (
                    <input
                      value={activePR.priority || ""}
                      readOnly
                      className="bg-gray-100 border rounded px-2 py-1 w-full"
                    />
                  )}

                </div>

                <div>
                  <div className="text-gray-900"> Delivery Date</div>
                  <input
                    type="date"
                    value={
                      activePR.required_date
                        ? activePR.required_date.split("T")[0]
                        : ""
                    }
                    disabled={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : "bg-gray-100 cursor-not-allowed"
                      }`}
                  />



                </div>

                <div>
                  <div className="text-gray-900">Department</div>
                  {editMode ? (
                    //                     <select
                    //                       // value={String(activePR.department ?? "")}
                    //                       value={
                    //   activePR?.department
                    //     ? String(activePR.department)
                    //     : ""
                    // }
                    //                       onChange={(e) =>
                    //                         setActivePR({ ...activePR, department: String(e.target.value) })
                    //                       }
                    //                       className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                    //                     >
                    <select
                      value={
                        departmentMap[String(activePR?.department)]
                          ? String(activePR.department)
                          : ""
                      }
                      onChange={(e) =>
                        setActivePR({
                          ...activePR,
                          department: e.target.value,
                        })
                      }
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                    >
                      <option value="" disabled>
                        Select Department
                      </option>

                      {Object.entries(departmentMap).map(([id, name]) => (
                        <option key={id} value={String(id)}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={departmentMap[String(activePR.department)] ?? activePR.department}
                      readOnly
                      className="bg-gray-100 border rounded px-2 py-1 w-full"
                    />
                  )}


                </div>

                <div>
                  <div className="text-gray-900">Remarks</div>
                  <input
                    value={activePR.remarks || ""}
                    readOnly={!editMode}
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
                    readOnly={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  {editMode ? (
                    <select
                      value={activePR.priority ?? ""}
                      onChange={(e) =>
                        setActivePR({ ...activePR, priority: e.target.value })
                      }
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                    >
                      <option value="" disabled>
                        Select Priority
                      </option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  ) : (
                    <input
                      value={activePR.priority || ""}
                      readOnly
                      className="bg-gray-100 border rounded px-2 py-1 w-full"
                    />
                  )}


                  {/* <input
                    type="date"
                    value={formatDateForInput(activePR.required_date)}
                    disabled={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : "bg-gray-100 cursor-not-allowed"
                      }`}
                  /> */}
                  <input
                    type="date"
                    value={formatDateForInput(activePR.required_date)}
                    disabled={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : "bg-gray-100 cursor-not-allowed"
                      }`}
                  />


                  {editMode ? (
                    <select
                      // value={String(activePR.department ?? "")}
                      value={
                        activePR?.department
                          ? String(activePR.department)
                          : ""
                      }
                      onChange={(e) =>
                        setActivePR({ ...activePR, department: e.target.value })
                      }
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      {Object.entries(departmentMap).map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={departmentMap[String(activePR.department)] ?? activePR.department}
                      readOnly
                      className="bg-gray-100 border rounded px-2 py-1 w-full"
                    />
                  )}


                  <input
                    value={activePR.remarks || ""}
                    readOnly={!editMode}
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
                          readOnly={!editMode}
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
                          readOnly={!editMode}
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
                          readOnly={!editMode}
                          onChange={(e) => {
                            const qty = Math.max(0, Number(e.target.value));
                            const updatedItems = [...activePR.items];

                            // Update quantity only
                            updatedItems[itemIndex].quantity_required = qty;

                            // 🔥 Only recalculate total price (do NOT touch unit_price)
                            updatedItems[itemIndex].vendors =
                              updatedItems[itemIndex].vendors.map((vendor) => ({
                                ...vendor,
                                total_price: (vendor.unit_price || 0) * qty,
                              }));

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
                          {item.vendors
                            ?.filter(
                              (vendor) =>
                                !vendor.status ||
                                !vendor.status.toLowerCase().trim().includes("rejected")
                            )
                            .map((vendor, vendorIndex) => {
                              const sortedComments =
                                [...(vendor.comments || [])].sort(
                                  (a, b) =>
                                    new Date(a.commented_at).getTime() -
                                    new Date(b.commented_at).getTime()
                                );

                              const prComment =
                                sortedComments.length > 0 ? sortedComments[0].comment : "";

                              const feasibilityComment =
                                sortedComments.length > 1
                                  ? sortedComments[sortedComments.length - 1].comment
                                  : "";
                              return (
                                <div
                                  key={vendor.id}
                                  className="hidden sm:grid sm:grid-cols-8 gap-4 text-sm mb-2"
                                >
                                  {editMode ? (
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
                                  )}

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
                                    readOnly={!editMode}
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
                                    readOnly={!editMode}
                                    onChange={(e) =>
                                      updateVendorField(itemIndex, vendorIndex, "total_price", Number(e.target.value))
                                    }
                                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                      }`}
                                  />



                                  <input
                                    type="date"
                                    value={vendor.quotation_validity_date ?? ""}
                                    disabled={!editMode}
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
                                    value={prComment}
                                    readOnly={!editMode} // editable only in edit mode
                                    onChange={(e) => {
                                      const updatedItems = [...activePR.items];
                                      // Update this vendor's first comment
                                      if (!updatedItems[itemIndex].vendors[vendorIndex].comments) {
                                        updatedItems[itemIndex].vendors[vendorIndex].comments = [];
                                      }
                                      if (updatedItems[itemIndex].vendors[vendorIndex].comments.length === 0) {
                                        updatedItems[itemIndex].vendors[vendorIndex].comments.push({
                                          id: Date.now(), // temporary ID
                                          comment: e.target.value,
                                          commented_at: new Date().toISOString(),
                                          commented_by: user?.id || 0, // current user
                                        });
                                      } else {
                                        updatedItems[itemIndex].vendors[vendorIndex].comments[0].comment = e.target.value;
                                      }

                                      setActivePR({ ...activePR, items: updatedItems });
                                    }}
                                    className={`border px-2 py-1 rounded w-full ${editMode ? "border-blue-400 bg-white" : "bg-gray-100 border-gray-300"}`}
                                  />



                                  <input
                                    readOnly
                                    value={feasibilityComment}
                                    className="bg-white border rounded px-2 py-1 w-full"
                                  />

                                  <input
                                    value={vendor.status ?? ""}
                                    readOnly={!editMode}
                                    onChange={(e) => {
                                      const updatedItems = [...activePR.items];

                                      updatedItems[itemIndex].vendors[vendorIndex] = {
                                        ...updatedItems[itemIndex].vendors[vendorIndex],
                                        status: e.target.value,
                                      };

                                      setActivePR({ ...activePR, items: updatedItems });
                                    }}
                                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                                      }`}
                                  />



                                </div>
                              );
                            })}

                          {/* ===== MOBILE VIEW ===== */}
                          {item.vendors
                            ?.filter(
                              (vendor) =>
                                !vendor.status ||
                                !vendor.status.toLowerCase().trim().includes("rejected")
                            )
                            .map((vendor, vendorIndex) => {
                              const sortedComments =
                                [...(vendor.comments || [])].sort(
                                  (a, b) =>
                                    new Date(a.commented_at).getTime() -
                                    new Date(b.commented_at).getTime()
                                );

                              const prComment =
                                sortedComments.length > 0 ? sortedComments[0].comment : "";

                              const feasibilityComment =
                                sortedComments.length > 1
                                  ? sortedComments[sortedComments.length - 1].comment
                                  : "";
                              return (
                                <div
                                  key={vendor.id}
                                  className="sm:hidden bg-white border rounded-lg p-3 mb-4 space-y-3"
                                >
                                  {/* Vendor */}
                                  <div>
                                    <label className="text-xs text-gray-500">Vendor</label>
                                    {editMode ? (
                                      <select
                                        value={vendor.vendor_id}
                                        onChange={(e) => {
                                          const updatedItems = [...activePR.items];
                                          updatedItems[itemIndex].vendors[vendorIndex].vendor_id =
                                            e.target.value;
                                          setActivePR({ ...activePR, items: updatedItems });
                                        }}
                                        className="w-full border border-blue-400 rounded px-2 py-1"
                                      >
                                        {Object.entries(vendorMap).map(([id, name]) => (
                                          <option key={id} value={id}>
                                            {name}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <input
                                        readOnly
                                        value={
                                          vendorMap[String(vendor.vendor_id)] ??
                                          vendor.vendor_id
                                        }
                                        className="w-full bg-gray-100 border rounded px-2 py-1"
                                      />
                                    )}
                                  </div>
                                  {/* Upload Quotation */}
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Upload Quotation
                                    </label>

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

                                  {/* Unit Price */}
                                  <div>
                                    <label className="text-xs text-gray-500">Unit Price</label>
                                    <input
                                      type="number"
                                      min={0}
                                      value={vendor.unit_price ?? ""}
                                      readOnly={!editMode}
                                      onChange={(e) => {
                                        const updatedItems = [...activePR.items];
                                        const price = Number(e.target.value);
                                        const qty =
                                          updatedItems[itemIndex].quantity_required || 0;

                                        updatedItems[itemIndex].vendors[vendorIndex] = {
                                          ...vendor,
                                          unit_price: price,
                                          total_price: qty * price,
                                        };

                                        setActivePR({ ...activePR, items: updatedItems });
                                      }}
                                      className={`w-full border rounded px-2 py-1 ${editMode ? "border-blue-400 bg-white" : "bg-gray-100"
                                        }`}
                                    />
                                  </div>

                                  {/* Total Price */}
                                  <div>
                                    <label className="text-xs text-gray-500">Total Price</label>
                                    <input
                                      readOnly
                                      value={vendor.total_price ?? ""}
                                      className="w-full bg-gray-100 border rounded px-2 py-1"
                                    />
                                  </div>

                                  {/* Validity Date */}
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Quotation Validity
                                    </label>
                                    <input
                                      type="date"
                                      value={vendor.quotation_validity_date ?? ""}
                                      disabled={!editMode}
                                      onChange={(e) => {
                                        const updatedItems = [...activePR.items];
                                        updatedItems[itemIndex].vendors[vendorIndex]
                                          .quotation_validity_date = e.target.value;

                                        setActivePR({ ...activePR, items: updatedItems });
                                      }}
                                      className={`w-full border rounded px-2 py-1 ${editMode
                                        ? "border-blue-400 bg-white"
                                        : "bg-gray-100 cursor-not-allowed"
                                        }`}
                                    />
                                  </div>

                                  {/* Comments */}
                                  <div>
                                    <label className="text-xs text-gray-500">Comments</label>
                                    <input
                                      value={prComment}
                                      readOnly={!editMode}
                                      onChange={(e) => {
                                        const updatedItems = [...activePR.items];

                                        if (
                                          !updatedItems[itemIndex].vendors[vendorIndex]
                                            .comments
                                        ) {
                                          updatedItems[itemIndex].vendors[
                                            vendorIndex
                                          ].comments = [];
                                        }

                                        if (
                                          updatedItems[itemIndex].vendors[vendorIndex]
                                            .comments.length === 0
                                        ) {
                                          updatedItems[itemIndex].vendors[
                                            vendorIndex
                                          ].comments.push({
                                            id: Date.now(),
                                            comment: e.target.value,
                                            commented_at: new Date().toISOString(),
                                            commented_by: 1,
                                          });
                                        } else {
                                          updatedItems[itemIndex].vendors[
                                            vendorIndex
                                          ].comments[0].comment = e.target.value;
                                        }

                                        setActivePR({ ...activePR, items: updatedItems });
                                      }}
                                      className={`w-full border rounded px-2 py-1 ${editMode ? "border-blue-400 bg-white" : "bg-gray-100"
                                        }`}
                                    />
                                  </div>

                                  {/* Status */}
                                  <div>
                                    <label className="text-xs text-gray-500">Status</label>
                                    <input
                                      value={vendor.status ?? ""}
                                      readOnly={!editMode}
                                      onChange={(e) => {
                                        const updatedItems = [...activePR.items];
                                        updatedItems[itemIndex].vendors[vendorIndex]
                                          .status = e.target.value;

                                        setActivePR({ ...activePR, items: updatedItems });
                                      }}
                                      className={`w-full border rounded px-2 py-1 ${editMode ? "border-blue-400 bg-white" : "bg-gray-100"
                                        }`}
                                    />
                                  </div>

                                  {/* Feasibility Comment (Read Only) */}
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
                    <label className="text-xs font-medium">
                      Transport Mode
                    </label>
                    <input
                      readOnly
                      value={activePR.order_details.transport_mode || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* In-House Type */}
                  <div>
                    <label className="text-xs font-medium">In-House Type</label>
                    <input
                      readOnly
                      value={activePR.order_details.in_house_type || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

                  {/* Vendor Address */}
                  <div>
                    <label className="text-xs font-medium">
                      Vendor Address
                    </label>
                    <input
                      readOnly
                      value={activePR.order_details.vendor_address || ""}
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>

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
                    {activePR.department_statuses?.map((ds, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between mb-1 text-xs text-gray-600 gap-2">
                          <input
                            value={ds.department_status}
                            readOnly={!editMode} // editable
                            onChange={(e) => {
                              const updatedStatuses = [...activePR.department_statuses];
                              updatedStatuses[idx].department_status = e.target.value;
                              setActivePR({ ...activePR, department_statuses: updatedStatuses });
                            }}
                            className="px-1 py-0.5  text-xs w-full sm:w-auto"
                          />

                          <span className="font-medium text-gray-800">
                            {ds.status_updated_by ?? "—"} •{" "}
                            {new Date(ds.updated_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 mt-1">
                          <input
                            value={ds.department_comment}
                            readOnly={!editMode} // editable
                            onChange={(e) => {
                              const updatedStatuses = [...activePR.department_statuses];
                              updatedStatuses[idx].department_comment = e.target.value;
                              setActivePR({ ...activePR, department_statuses: updatedStatuses });
                            }}
                            className=" px-1 py-0.5 rounded  w-full text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
            {editMode && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded border border-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();

                    setEditMode(false);

                    setActivePR(null);        // ✅ CLOSE POPUP
                    setOriginalPR(null);      // ✅ CLEAR BACKUP (important)
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
