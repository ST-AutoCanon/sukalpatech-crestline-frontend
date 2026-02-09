import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";

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

export default function ViewPRPage() {
  const { user, token } = useContext(AuthContext);
  const [prs, setPrs] = useState<PR[]>([]);
  const [activePR, setActivePR] = useState<PR | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showStatus, setShowStatus] = useState(true);

  const [mode, setMode] = useState<"view" | "edit">("view");



  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };
  useEffect(() => {
    // Fetch vendor master
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`)
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
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility/submitted-requests`)
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err));
  }, []);

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

  const updateItemField = (
    itemId: number,
    field: keyof Item,
    value: any
  ) => {
    if (!activePR) return;

    setActivePR({
      ...activePR,
      items: activePR.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const updateVendorField = (
    itemId: number,
    vendorId: number,
    field: keyof Vendor,
    value: any
  ) => {
    if (!activePR) return;

    setActivePR({
      ...activePR,
      items: activePR.items.map((item) =>
        item.id === itemId
          ? {
            ...item,
            vendors: item.vendors.map((vendor) =>
              vendor.id === vendorId
                ? { ...vendor, [field]: value }
                : vendor
            ),
          }
          : item
      ),
    });
  };



  return (
    <>
      {/* ===== PR CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => (
          <div
            key={pr.id}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 relative flex flex-col min-h-[220px] cursor-pointer hover:shadow-md transition"
            onClick={() => setActivePR(pr)}
          >
            <h2 className="text-lg font-semibold text-purple-600 truncate">
              PR ID:{pr.id}
            </h2>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-400 w-32 shrink-0">Department:</span>
                <span className="text-gray-900 truncate">
                  {pr.department || "-"}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-400 w-32 shrink-0">Priority:</span>
                <span className="text-gray-900">{pr.priority || "-"}</span>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-400 w-32 shrink-0">Status:</span>
                <span className="text-gray-900">
                  {pr.department_statuses?.[0]?.department_status || "Draft"}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-400 w-32 shrink-0">
                  Required Date:
                </span>
                <span className="text-gray-900">
                  {pr.required_date
                    ? new Date(pr.required_date).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>

            <div className="mt-3 flex gap-3 items-center text-sm ">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMode("view");
                  setActivePR(pr);
                }}
                className="font-semibold text-blue-600 hover:underline"
              >
                More Info
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMode("edit");
                  setActivePR(pr);
                }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Edit
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {activePR && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-5xl md:max-w-7xl rounded-xl shadow-xl p-4 md:p-6 text-black flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                {mode === "edit" ? "Edit" : "View"} PR-{activePR.id} info
              </h2>
              <button
                onClick={() => setActivePR(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* PR Info */}
            <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4 mt-2">
              {/* Mobile view */}
              <div className="space-y-3 sm:hidden text-sm">
                <div>
                  <div className="text-gray-900">Description</div>
                  <input
                    type="text"
                    value={activePR.description || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Priority</div>
                  <input
                    type="text"
                    value={activePR.priority || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Required Delivery Date</div>
                  <input
                    type="text"
                    value={activePR.required_date || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Department</div>
                  <input
                    type="text"
                    value={activePR.department || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, department: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                </div>

                <div>
                  <div className="text-gray-900">Remarks</div>
                  <input
                    type="text"
                    value={activePR.remarks || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, remarks: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                </div>
              </div>

              {/* Desktop view */}
              <div className="hidden sm:block overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-2">
                  <span>Description</span>
                  <span>Priority</span>
                  <span>Required Delivery Date</span>
                  <span>Department</span>
                  <span>Remarks</span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <input
                    type="text"
                    value={activePR.description || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, description: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                  <input
                    type="text"
                    value={activePR.priority || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, priority: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                  <input
                    type="text"
                    value={activePR.required_date || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, required_date: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                  <input
                    type="text"
                    value={activePR.department || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, department: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                  <input
                    type="text"
                    value={activePR.remarks || ""}
                    readOnly={mode === "view"}
                    onChange={(e) =>
                      setActivePR({ ...activePR, remarks: e.target.value })
                    }
                    className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                      }`}
                  />

                </div>
              </div>
            </div>

            {/* Items Section Toggle */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowStatus((prev) => !prev)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded flex items-center"
              >
                {showStatus ? <Minus size={16} /> : <Plus size={16} />}
              </button>
            </div>

            {/* Items */}
            {showStatus && (
              <div className="space-y-4">
                {activePR.items?.map((item) => (
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
                          type="text"
                          value={item.item_code || ""}
                          readOnly={mode === "view"}
                          onChange={(e) =>
                            updateItemField(item.id, "item_code", e.target.value)
                          }
                          className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                            }`}
                        />



                      </div>

                      {/* Description */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">
                          Description
                        </span>
                        <input
                          type="text"
                          value={item.item_name || ""}
                          readOnly={mode === "view"}
                          onChange={(e) =>
                            updateItemField(item.id, "item_name", e.target.value)
                          }
                          className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                            }`}
                        />


                      </div>

                      {/* Qty */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-24 shrink-0">Qty</span>
                        <input
                          type="number"
                          value={item.quantity_required || ""}
                          readOnly={mode === "view"}
                          onChange={(e) =>
                            updateItemField(item.id, "quantity_required", Number(e.target.value))
                          }
                          className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"
                            }`}
                        />


                      </div>
                    </div>

                    {/* Vendors */}
                    <div className="overflow-x-auto">
                      {item.vendors?.length > 0 && (
                        <>
                          {/* Desktop labels (sm and above) */}
                          <div className="hidden sm:grid sm:grid-cols-6 gap-4 text-xs font-medium mb-1 text-gray-700">
                            <span>Vendor</span>
                            <span>Upload Quotation</span>
                            <span>Unit Price</span>
                            <span>Total Price</span>
                            <span>Quotation Validity</span>
                            <span>Comments</span>
                          </div>

                          {/* Desktop values */}
                          {item.vendors?.map((vendor) => (
                            <div
                              key={vendor.id}
                              className="hidden sm:grid sm:grid-cols-6 gap-4 text-sm mb-4"
                            >
                              {/* Vendor Selection */}
                              {mode === "edit" ? (
                                <select
                                  value={vendor.vendor_id}
                                  onChange={(e) =>
                                    updateVendorField(item.id, vendor.id, "vendor_id", e.target.value)
                                  }
                                  className="border rounded px-2 py-1 w-full bg-white"
                                >
                                  {Object.entries(vendorMap).map(([id, name]) => (
                                    <option key={id} value={id}>
                                      {name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={vendorMap[String(vendor.vendor_id)] ?? vendor.vendor_id}
                                  readOnly
                                  className="bg-white border rounded px-2 py-1 w-full"
                                  placeholder="Vendor"
                                />
                              )}

                              {/* Attachment Upload */}
                              {mode === "edit" ? (
                                <div className="flex flex-col">
                                  {/* Hidden file input */}
                                  <input
                                    type="file"
                                    id={`vendor-file-${vendor.id}`}
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        updateVendorField(item.id, vendor.id, "attachments", [
                                          {
                                            id: vendor.attachments?.[0]?.id ?? 0,
                                            file_name: file.name,
                                            file_path: URL.createObjectURL(file), // temporary preview
                                            uploaded_by: user?.id || 0,
                                            uploaded_at: new Date().toISOString(),
                                          },
                                        ]);
                                      }
                                    }}
                                  />

                                  {/* Visible input showing file name and opening file picker */}
                                  <input
                                    type="text"
                                    readOnly
                                    placeholder="No file selected"
                                    value={vendor.attachments?.[0]?.file_name || ""}
                                    onClick={() => document.getElementById(`vendor-file-${vendor.id}`)?.click()}
                                    className="border rounded px-2 py-1 w-full cursor-pointer bg-white"
                                  />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={vendor.attachments?.[0]?.file_name || ""}
                                  readOnly
                                  className="bg-white border rounded px-2 py-1 w-full"
                                />
                              )}

                              <input
                                type="number"
                                value={vendor.unit_price ?? ""}
                                readOnly={mode === "view"} // editable only in edit mode
                                onChange={(e) =>
                                  updateVendorField(item.id, vendor.id, "unit_price", Number(e.target.value))
                                }
                                className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"}`}
                              />

                              <input
                                type="number"
                                value={(vendor.unit_price || 0) * (item.quantity_required || 0)}
                                readOnly
                                className="bg-gray-100 border rounded px-2 py-1 w-full"
                              />


                              <input
                                type="date"
                                value={
                                  vendor.quotation_validity_date
                                    ? new Date(vendor.quotation_validity_date).toISOString().split("T")[0]
                                    : ""
                                }
                                readOnly={mode === "view"} // editable only in edit mode
                                onChange={(e) =>
                                  updateVendorField(item.id, vendor.id, "quotation_validity_date", e.target.value)
                                }
                                className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"}`}
                              />

                              <input
                                type="text"
                                value={vendor.comments?.[0]?.comment || ""}
                                readOnly={mode === "view"}
                                onChange={(e) => {
                                  updateVendorField(item.id, vendor.id, "comments", [
                                    {
                                      id: vendor.comments?.[0]?.id ?? 0,
                                      comment: e.target.value, // allow spaces normally
                                      commented_at: new Date().toISOString(),
                                      commented_by: user?.id || 0,
                                    },
                                  ]);
                                }}
                                className={`border rounded px-2 py-1 w-full ${mode === "view" ? "bg-gray-100" : "bg-white"}`}
                              />
                            </div>
                          ))}

                          {/* Mobile view */}
                          {item.vendors?.map((vendor) => (
                            <div
                              key={vendor.id}
                              className="mb-4 sm:hidden flex flex-row gap-4 overflow-x-auto"
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
                                [
                                  "Comments",
                                  vendor.comments
                                    ?.map((c) => c.comment)
                                    .join(", ") || "-",
                                ],
                              ].map(([label, value], idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-col min-w-[120px]"
                                >
                                  <span className="text-gray-500 text-xs">
                                    {label}
                                  </span>
                                  <input
                                    type="text"
                                    value={value}
                                    readOnly
                                    className="bg-white px-2 py-1 w-full"
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
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
                    {activePR.department_statuses?.map((ds, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 border border-blue-200 rounded-xl p-4 text-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between mb-1 text-xs text-gray-600">
                          <span className="font-medium">
                            Status: {ds.department_status}
                          </span>
                          <span className="font-medium text-gray-800">
                            {ds.status_updated_by ?? "—"} •{" "}
                            {new Date(ds.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Comment:</span>{" "}
                          {ds.department_comment}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Save / Cancel Buttons */}
            {mode === "edit" && (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    // Cancel: discard changes and go back to view mode
                    // Ideally reload PR data from prs array to reset
                    const originalPR = prs.find((p) => p.id === activePR?.id);
                    if (originalPR) setActivePR(originalPR);
                    setMode("view");
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!activePR) return;

                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/new-feasibility/feasibility-requests/${activePR.id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(activePR),
                        }
                      );

                      const data = await res.json();

                      if (data.success === false) {
                        console.error("Save failed:", data.message);
                        alert("Failed to save PR: " + data.message);
                        return;
                      }

                      // Update PR list
                      setPrs((prev) =>
                        prev.map((p) => (p.id === activePR.id ? data.data || activePR : p))
                      );

                      // ✅ Close the modal after successful save
                      setActivePR(null);

                      alert("Changes saved successfully!");
                    } catch (err) {
                      console.error("Save failed", err);
                      alert("Failed to save PR. Check console for details.");
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
