// EditPRModal.tsx
import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import type { PR } from "./ViewPRModal";
import ItemSearchModal from "../procruments/ItemSearchDropdown";
type Props = {
  pr: PR;
  vendorMap: Record<string, string>;
  departmentMap: Record<string, string>;
  onClose: () => void;
  onSave: (pr: PR) => Promise<void>;
};

export default function EditPRModal({
  pr,
  vendorMap,
  departmentMap,
  onClose,
  onSave,
}: Props) {
  const [activePR, setActivePR] = useState<PR>({ ...pr });
  const [showItems, setShowItems] = useState(false);
  const [showStatuses, setShowStatuses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showItemSearch, setShowItemSearch] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const formatDateForInput = (date: string) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(activePR);
    } finally {
      setSaving(false);
    }
  };

  const handleItemSelect = (selectedItem: any) => {
    if (selectedItemIndex === null) return;

    const updatedItems = [...activePR.items];

    updatedItems[selectedItemIndex] = {
      ...updatedItems[selectedItemIndex],
      item_code: selectedItem.item_code,
      item_name: selectedItem.item_name,
    };

    setActivePR({ ...activePR, items: updatedItems });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
      <div className="bg-white w-full max-w-5xl md:max-w-7xl rounded-xl shadow-xl p-4 md:p-6 text-black flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
            Edit PR-{activePR.id} info
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* PR Info */}
        <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4">
          {/* Mobile */}
          <div className="space-y-3 sm:hidden text-sm">
            <div>
              <div className="text-gray-900">Description</div>
              <input
                value={activePR.description || ""}
                onChange={(e) =>
                  setActivePR({ ...activePR, description: e.target.value })
                }
                className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <div className="text-gray-900">Priority</div>
              <select
                value={activePR.priority || ""}
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
            </div>
            <div>
              <div className="text-gray-900">Delivery Date</div>
              <input
                type="date"
                value={formatDateForInput(activePR.required_date)}
                onChange={(e) =>
                  setActivePR({ ...activePR, required_date: e.target.value })
                }
                className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <div className="text-gray-900">Department</div>
              <select
                value={
                  departmentMap[String(activePR?.department)]
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
                  <option key={id} value={String(id)}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-gray-900">Remarks</div>
              <input
                value={activePR.remarks || ""}
                onChange={(e) =>
                  setActivePR({ ...activePR, remarks: e.target.value })
                }
                className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium mb-2">
              <span>Description</span>
              <span>Priority</span>
              <span>Delivery Date</span>
              <span>Department</span>
              <span>Remarks</span>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <input
                value={activePR.description || ""}
                onChange={(e) =>
                  setActivePR({ ...activePR, description: e.target.value })
                }
                className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
              />
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
              <input
                type="date"
                value={formatDateForInput(activePR.required_date)}
                onChange={(e) =>
                  setActivePR({ ...activePR, required_date: e.target.value })
                }
                className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
              />
              <select
                value={activePR?.department ? String(activePR.department) : ""}
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
              <input
                value={activePR.remarks || ""}
                onChange={(e) =>
                  setActivePR({ ...activePR, remarks: e.target.value })
                }
                className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* Items Toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setShowItems((prev) => !prev)}
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
                {/* Item Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 shrink-0">Item Code</span>
                    {/* <input
                      value={item.item_code || ""}
                      onChange={(e) => {
                        const updatedItems = [...activePR.items];
                        updatedItems[itemIndex] = {
                          ...updatedItems[itemIndex],
                          item_code: e.target.value,
                        };
                        setActivePR({ ...activePR, items: updatedItems });
                      }}
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                    /> */}
                    <input
                      value={item.item_code || ""}
                      readOnly
                      onClick={() => {
                        setSelectedItemIndex(itemIndex);
                        setShowItemSearch(true);
                      }}
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 shrink-0">Item Name</span>
                    {/* <input
                      value={item.item_name || ""}
                      onChange={(e) => {
                        const updatedItems = [...activePR.items];
                        updatedItems[itemIndex] = {
                          ...updatedItems[itemIndex],
                          item_name: e.target.value,
                        };
                        setActivePR({ ...activePR, items: updatedItems });
                      }}
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                    /> */}
                    <input
                      value={item.item_name || ""}
                      readOnly
                      onClick={() => {
                        setSelectedItemIndex(itemIndex);
                        setShowItemSearch(true);
                      }}
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 shrink-0">Qty</span>
                    <input
                      type="number"
                      min={0}
                      value={item.quantity_required ?? ""}
                      onChange={(e) => {
                        const qty = Math.max(0, Number(e.target.value));
                        const updatedItems = [...activePR.items];
                        updatedItems[itemIndex].quantity_required = qty;
                        updatedItems[itemIndex].vendors = updatedItems[
                          itemIndex
                        ].vendors.map((v) => ({
                          ...v,
                          total_price: (v.unit_price || 0) * qty,
                        }));
                        setActivePR({ ...activePR, items: updatedItems });
                      }}
                      className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>

                {/* Vendors */}
                {item.vendors?.length > 0 && (
                  <div className="overflow-x-auto">
                    {/* Desktop Labels */}
                    <div className="hidden sm:grid sm:grid-cols-8 gap-4 text-xs font-medium mb-1 text-gray-700">
                      <span>Vendor</span>
                      <span>Upload Quotation</span>
                      <span>Unit Price</span>
                      <span>Total Price</span>
                      <span>Quotation Validity</span>
                      <span>Comments</span>
                      {/* <span>Feasibility Comment</span> */}
                      {/* <span>Status</span> */}
                    </div>

                    {/* Desktop Rows */}
                    {item.vendors
                      .filter(
                        (v) =>
                          !v.status?.toLowerCase().trim().includes("rejected"),
                      )
                      .map((vendor, vendorIndex) => {
                        const sorted = [...(vendor.comments || [])].sort(
                          (a, b) =>
                            new Date(a.commented_at).getTime() -
                            new Date(b.commented_at).getTime(),
                        );
                        const prComment = sorted[0]?.comment ?? "";
                        const feasibilityComment =
                          sorted.length > 1
                            ? sorted[sorted.length - 1].comment
                            : "";
                        const validAttachment = vendor.attachments?.find(
                          (att) =>
                            (att.file_path && att.file_path.trim() !== "") ||
                            att.fileObject,
                        );

                        return (
                          <div
                            key={vendor.id}
                            className="hidden sm:grid sm:grid-cols-8 gap-4 text-sm mb-2"
                          >
                            {/* Vendor Select */}
                            <select
                              value={vendor.vendor_id}
                              onChange={(e) => {
                                const updatedItems = [...activePR.items];
                                updatedItems[itemIndex].vendors[vendorIndex] = {
                                  ...updatedItems[itemIndex].vendors[
                                  vendorIndex
                                  ],
                                  vendor_id: e.target.value,
                                };
                                setActivePR({
                                  ...activePR,
                                  items: updatedItems,
                                });
                              }}
                              className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                            >
                              {Object.entries(vendorMap).map(([id, name]) => (
                                <option key={id} value={id}>
                                  {name}
                                </option>
                              ))}
                            </select>

                            {/* Upload Quotation */}
                            <label className="w-full border border-gray-300 bg-white rounded px-2 py-1 text-sm flex items-center overflow-hidden cursor-pointer">

                              {/* File Name */}
                              {validAttachment ? (
                                <span className="text-gray-500 text-sm truncate block">
                                  {validAttachment.file_name || "View File"}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  No file
                                </span>
                              )}

                              {/* Hidden File Input */}
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

                                  setActivePR({
                                    ...activePR,
                                    items: updatedItems,
                                  });
                                }}
                              />
                            </label>

                            {/* Unit Price */}
                            <input
                              type="number"
                              min={0}
                              value={vendor.unit_price ?? ""}
                              onChange={(e) => {
                                const updatedItems = [...activePR.items];
                                const price = Math.max(
                                  0,
                                  Number(e.target.value),
                                );
                                const qty =
                                  updatedItems[itemIndex].quantity_required ||
                                  0;
                                updatedItems[itemIndex].vendors[vendorIndex] = {
                                  ...updatedItems[itemIndex].vendors[
                                  vendorIndex
                                  ],
                                  unit_price: price,
                                  total_price: qty * price,
                                };
                                setActivePR({
                                  ...activePR,
                                  items: updatedItems,
                                });
                              }}
                              className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                            />

                            {/* Total Price */}
                            <input
                              value={vendor.total_price ?? ""}
                              readOnly
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            />

                            {/* Quotation Validity */}
                            <input
                              type="date"
                              value={vendor.quotation_validity_date ?? ""}
                              onChange={(e) => {
                                const updatedItems = [...activePR.items];
                                updatedItems[itemIndex].vendors[vendorIndex] = {
                                  ...updatedItems[itemIndex].vendors[
                                  vendorIndex
                                  ],
                                  quotation_validity_date: e.target.value,
                                };
                                setActivePR({
                                  ...activePR,
                                  items: updatedItems,
                                });
                              }}
                              className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                            />

                            {/* PR Comment */}
                            <input
                              value={prComment}
                              onChange={(e) => {
                                const updatedItems = [...activePR.items];
                                const comments =
                                  updatedItems[itemIndex].vendors[vendorIndex]
                                    .comments || [];
                                if (comments.length === 0) {
                                  comments.push({
                                    id: Date.now(),
                                    comment: e.target.value,
                                    commented_at: new Date().toISOString(),
                                    commented_by: 0,
                                  });
                                } else {
                                  comments[0] = {
                                    ...comments[0],
                                    comment: e.target.value,
                                  };
                                }
                                updatedItems[itemIndex].vendors[
                                  vendorIndex
                                ].comments = comments;
                                setActivePR({
                                  ...activePR,
                                  items: updatedItems,
                                });
                              }}
                              className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                            />

                            {/* Feasibility Comment (read-only) */}
                            {/* <input
                              readOnly
                              value={feasibilityComment}
                              className="bg-gray-100 border rounded px-2 py-1 w-full"
                            /> */}

                            {/* Status */}
                            {/* <input
                              value={vendor.status ?? ""}
                              onChange={(e) => {
                                const updatedItems = [...activePR.items];
                                updatedItems[itemIndex].vendors[vendorIndex] = {
                                  ...updatedItems[itemIndex].vendors[
                                    vendorIndex
                                  ],
                                  status: e.target.value,
                                };
                                setActivePR({
                                  ...activePR,
                                  items: updatedItems,
                                });
                              }}
                              className="bg-white border border-blue-400 rounded px-2 py-1 w-full"
                            /> */}
                          </div>
                        );
                      })}

                    {/* Mobile Rows */}
                    {item.vendors
                      .filter(
                        (v) =>
                          !v.status?.toLowerCase().trim().includes("rejected"),
                      )
                      .map((vendor, vendorIndex) => {
                        const sorted = [...(vendor.comments || [])].sort(
                          (a, b) =>
                            new Date(a.commented_at).getTime() -
                            new Date(b.commented_at).getTime(),
                        );
                        const prComment = sorted[0]?.comment ?? "";
                        const feasibilityComment =
                          sorted.length > 1
                            ? sorted[sorted.length - 1].comment
                            : "";
                        const validAttachment = vendor.attachments?.find(
                          (att) =>
                            (att.file_path && att.file_path.trim() !== "") ||
                            att.fileObject,
                        );

                        return (
                          <div
                            key={vendor.id}
                            className="sm:hidden bg-white border rounded-lg p-3 mb-4 space-y-3"
                          >
                            <div>
                              <label className="text-xs text-gray-500">
                                Vendor
                              </label>
                              <select
                                value={vendor.vendor_id}
                                onChange={(e) => {
                                  const updatedItems = [...activePR.items];
                                  updatedItems[itemIndex].vendors[
                                    vendorIndex
                                  ].vendor_id = e.target.value;
                                  setActivePR({
                                    ...activePR,
                                    items: updatedItems,
                                  });
                                }}
                                className="w-full border border-blue-400 rounded px-2 py-1"
                              >
                                {Object.entries(vendorMap).map(([id, name]) => (
                                  <option key={id} value={id}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">
                                Upload Quotation
                              </label>
                              <label className="w-full border border-blue-400 bg-white rounded px-2 py-1 text-sm flex items-center overflow-hidden cursor-pointer">
                                {validAttachment ? (
                                  <a
                                    href={
                                      validAttachment.fileObject
                                        ? validAttachment.file_path
                                        : `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${validAttachment.file_path}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm truncate block"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {validAttachment.file_name || "View File"}
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    No file
                                  </span>
                                )}
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const updatedItems = [...activePR.items];
                                    updatedItems[itemIndex].vendors[
                                      vendorIndex
                                    ] = {
                                      ...updatedItems[itemIndex].vendors[
                                      vendorIndex
                                      ],
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
                                    setActivePR({
                                      ...activePR,
                                      items: updatedItems,
                                    });
                                  }}
                                />
                              </label>
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">
                                Unit Price
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={vendor.unit_price ?? ""}
                                onChange={(e) => {
                                  const updatedItems = [...activePR.items];
                                  const price = Number(e.target.value);
                                  const qty =
                                    updatedItems[itemIndex].quantity_required ||
                                    0;
                                  updatedItems[itemIndex].vendors[vendorIndex] =
                                  {
                                    ...vendor,
                                    unit_price: price,
                                    total_price: qty * price,
                                  };
                                  setActivePR({
                                    ...activePR,
                                    items: updatedItems,
                                  });
                                }}
                                className="w-full border border-blue-400 bg-white rounded px-2 py-1"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">
                                Total Price
                              </label>
                              <input
                                readOnly
                                value={vendor.total_price ?? ""}
                                className="w-full bg-gray-100 border rounded px-2 py-1"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">
                                Quotation Validity
                              </label>
                              <input
                                type="date"
                                value={vendor.quotation_validity_date ?? ""}
                                onChange={(e) => {
                                  const updatedItems = [...activePR.items];
                                  updatedItems[itemIndex].vendors[
                                    vendorIndex
                                  ].quotation_validity_date = e.target.value;
                                  setActivePR({
                                    ...activePR,
                                    items: updatedItems,
                                  });
                                }}
                                className="w-full border border-blue-400 bg-white rounded px-2 py-1"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">
                                Comments
                              </label>
                              <input
                                value={prComment}
                                onChange={(e) => {
                                  const updatedItems = [...activePR.items];
                                  const comments =
                                    updatedItems[itemIndex].vendors[vendorIndex]
                                      .comments || [];
                                  if (comments.length === 0) {
                                    comments.push({
                                      id: Date.now(),
                                      comment: e.target.value,
                                      commented_at: new Date().toISOString(),
                                      commented_by: 1,
                                    });
                                  } else {
                                    comments[0] = {
                                      ...comments[0],
                                      comment: e.target.value,
                                    };
                                  }
                                  updatedItems[itemIndex].vendors[
                                    vendorIndex
                                  ].comments = comments;
                                  setActivePR({
                                    ...activePR,
                                    items: updatedItems,
                                  });
                                }}
                                className="w-full border border-blue-400 bg-white rounded px-2 py-1"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">
                                Status
                              </label>
                              <input
                                value={vendor.status ?? ""}
                                onChange={(e) => {
                                  const updatedItems = [...activePR.items];
                                  updatedItems[itemIndex].vendors[
                                    vendorIndex
                                  ].status = e.target.value;
                                  setActivePR({
                                    ...activePR,
                                    items: updatedItems,
                                  });
                                }}
                                className="w-full border border-blue-400 bg-white rounded px-2 py-1"
                              />
                            </div>

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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Finance Payment Details (read-only in edit modal too) */}
        {activePR.finance_payment_details && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-semibold mb-3 text-purple-600">
              Finance Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-xs font-medium">Payment Stage</label>
                <input
                  readOnly
                  value={activePR.finance_payment_details.payment_stage || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              {activePR.finance_payment_details.payment_stage === "PARTIAL" && (
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
              <div>
                <label className="text-xs font-medium">Final Completed</label>
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
              <div>
                <label className="text-xs font-medium">Finance Comment</label>
                <input
                  readOnly
                  value={activePR.finance_payment_details.finance_comment || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
            </div>
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

        {/* PR Order Details (read-only) */}
        {activePR.order_details && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-semibold mb-4 text-purple-600">
              PR Order Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
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
              <div>
                <label className="text-xs font-medium">Expected Delivery</label>
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
              <div>
                <label className="text-xs font-medium">Transport Mode</label>
                <input
                  readOnly
                  value={activePR.order_details.transport_mode || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">In-House Type</label>
                <input
                  readOnly
                  value={activePR.order_details.in_house_type || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Vendor Address</label>
                <input
                  readOnly
                  value={activePR.order_details.vendor_address || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              {activePR.order_details.po_file_path && (
                <div>
                  <label className="text-xs font-medium">PO File</label>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/${activePR.order_details.po_file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {activePR.order_details.po_file_name || "View PO File"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Store Receiving Details (read-only) */}
        {activePR.store_receiving_details && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-semibold mb-4 text-purple-600">
              Store Receiving Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs font-medium">Quantity Status</label>
                <input
                  readOnly
                  value={activePR.store_receiving_details.quantity_status || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
              {activePR.store_receiving_details.quantity_status ===
                "PARTIAL" && (
                  <div>
                    <label className="text-xs font-medium">
                      Partial Quantity
                    </label>
                    <input
                      readOnly
                      value={
                        activePR.store_receiving_details.partial_quantity ?? 0
                      }
                      className="border p-2 rounded w-full bg-white"
                    />
                  </div>
                )}
              {activePR.store_receiving_details.rejection_reason && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium">
                    Rejection Reason
                  </label>
                  <textarea
                    readOnly
                    value={activePR.store_receiving_details.rejection_reason}
                    className="border p-2 rounded w-full bg-white"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium">Stored Building</label>
                <input
                  readOnly
                  value={activePR.store_receiving_details.building || ""}
                  className="border p-2 rounded w-full bg-white"
                />
              </div>
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

        {/* Statuses */}
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
                        onChange={(e) => {
                          const updated = [...activePR.department_statuses];
                          updated[idx] = {
                            ...updated[idx],
                            department_status: e.target.value,
                          };
                          setActivePR({
                            ...activePR,
                            department_statuses: updated,
                          });
                        }}
                        className="px-1 py-0.5 border rounded text-xs w-full sm:w-auto"
                      />
                      <span className="font-medium text-gray-800">
                        {ds.status_updated_by ?? "—"} •{" "}
                        {new Date(ds.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <input
                        value={ds.department_comment}
                        onChange={(e) => {
                          const updated = [...activePR.department_statuses];
                          updated[idx] = {
                            ...updated[idx],
                            department_comment: e.target.value,
                          };
                          setActivePR({
                            ...activePR,
                            department_statuses: updated,
                          });
                        }}
                        className="px-1 py-0.5 border rounded w-full text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {showItemSearch && (
        <ItemSearchModal
          onClose={() => setShowItemSearch(false)}
          onSelect={handleItemSelect}
        />
      )}
    </div>
  );

}
