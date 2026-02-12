import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";

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
};

export default function ViewPRPage({ filter, search, refreshKey}: Props) {
  const [prs, setPrs] = useState<PR[]>([]);
  const [activePR, setActivePR] = useState<PR | null>(null);
  const [showItems, setShowItems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStatuses, setShowStatuses] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>({});

  
  

  // Fetch vendors
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`)
      .then((res) => res.json())
      .then((data) => {
        const vendors = data?.data || [];
        const map: Record<string, string> = {};
        vendors.forEach((v: any) => (map[String(v.vendor_id)] = v.vendor_name));
        setVendorMap(map);
      })
      .catch((err) => console.error("Vendor fetch error", err));
  }, []);

  // Fetch departments
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`)
      .then((res) => res.json())
      .then((data) => {
        const departments = data?.data || [];
        const map: Record<string, string> = {};
        departments.forEach((d: any) => (map[String(d.department_id)] = d.name));
        setDepartmentMap(map);
      })
      .catch((err) => console.error("Department fetch error", err));
  }, []);

  const fetchPRs = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;
      if (filter === "Pending" || filter === "Rejected" || filter === "Completed") {
        const status = filter === "Completed" ? "APPROVED" : filter.toUpperCase();
        url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/prs/status/${status}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      const prsData = (data?.data || []).map((pr: PR) => ({
        ...pr,
        items: pr.items || [],
        department_statuses: pr.department_statuses || [],
      }));
      setPrs(prsData);
    } catch (err) {
      console.error("Fetch PR error", err);
      setPrs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs();
  }, [filter, search, refreshKey]);

  const isEditable = (pr: PR) => {
    if (filter !== "PR Raised") return false;
    const latestStatus = pr.department_statuses?.[pr.department_statuses.length - 1]?.department_status;
    return latestStatus === "CREATED";
  };

  const toggleItemsSection = () => setShowItems((prev) => !prev);

  if (loading) return <div className="p-6">Loading PRs...</div>;

  return (
    <>
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
                <div className="flex justify-between"><span className="text-gray-400">Delivery Date</span><span className="font-medium text-gray-700">{new Date(pr.required_date).toLocaleDateString()}</span></div>
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

                {filter === "PR Raised" && isEditable(pr) && (
                  <button
                    className="text-sm font-semibold text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
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
                View PR-{activePR.id} info
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
                  <input
                    value={activePR.priority || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900"> Delivery Date</div>
                  <input
                    value={activePR.required_date || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Department</div>
                  <input
                    value={activePR.department || ""}
                    readOnly={!editMode}
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

                  <input
                    value={activePR.priority || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.required_date || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

                  <input
                    value={activePR.department || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setActivePR({ ...activePR, department: e.target.value })
                    }
                    className={`bg-white border rounded px-2 py-1 w-full ${editMode ? "border-blue-400" : ""
                      }`}
                  />

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


                            const feasibilityComment =
                              vendor.comments?.find((c) => c.commented_by === 2)
                                ?.comment || "";

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
                                </label>



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
                          {item.vendors.map((vendor) => {
                            const prComment =
                              vendor.comments?.[0]?.comment || "";


                            const feasibilityComment =
                              vendor.comments?.find((c) => c.commented_by === 2)
                                ?.comment || "";

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
                                    vendor.attachments?.[0]?.file_name || "-",
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
                                    <input
                                      readOnly
                                      value={value}
                                      className="bg-white border rounded px-2 py-1 w-full"
                                    />
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
                  onClick={() => {
                    setEditMode(false);
                    setActivePR(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={async () => {
                    try {
                      await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/full/${activePR.id}`, // <-- NEW route
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(activePR),
                        }
                      );


                      setEditMode(false);
                      setActivePR(null);
                      fetchPRs(); // refresh list
                    } catch (err) {
                      console.error("Save failed", err);
                    }
                  }}
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
