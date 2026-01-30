import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";
import { Upload } from "lucide-react";
import Aleart from "../../../components/Aleartmessage";

export default function NewProcurementPage({ onClose, onCreated }) {
  const { user, token } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement`;
  const API_BASE1 = `${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`;
  const API_BASE2 = `${import.meta.env.VITE_BACKEND_URL}/api/departments`;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE2}`);
        console.log(res.data.data);
        setDepartments(res.data.data);
      } catch (err) {
        console.error("Department fetch error", err);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${API_BASE1}`);
        console.log(res.data.data);
        setVendorList(res.data.data);
      } catch (err) {
        console.error("Vendor fetch error", err);
      }
    };

    fetchVendors();
  }, []);

  const [vendorFiles, setVendorFiles] = useState({});
  const [prData, setPrData] = useState({
    department: "",
    requested_by: user.first_name,
    description: "",
    priority: "",
    required_date: "",
    remarks: "",
    items: [
      {
        item_code: "",
        item_name: "",
        quantity_required: "",
        vendors: [
          {
            vendor_id: "",
            unit_price: "",
            total_price: "",
            quotation_validity_date: "",
            status: "Submitted",
            vendor_status_updated_by: user.id,
            comments: [],
            attachments: [],
          },
        ],
      },
    ],
  });

  const handlePRChange = (e) => {
    setPrData({ ...prData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (itemIndex: number, field: string, value: any) => {
    setPrData((prev) => {
      const items = [...prev.items];
      items[itemIndex] = {
        ...items[itemIndex],
        [field]: value,
      };

      // Recalculate total price for all vendors
      if (field === "quantity_required") {
        items[itemIndex].vendors = items[itemIndex].vendors.map((v) => ({
          ...v,
          total_price: Number(value || 0) * Number(v.unit_price || 0),
        }));
      }

      return { ...prev, items };
    });
  };

  const handleVendorChange = (
    itemIndex: number,
    vendorIndex: number,
    field: string,
    value: any
  ) => {
    setPrData((prev) => {
      const items = [...prev.items];
      const item = items[itemIndex];

      item.vendors[vendorIndex] = {
        ...item.vendors[vendorIndex],
        [field]: value,
      };

      // Auto-calculate total price
      if (field === "unit_price") {
        const qty = Number(item.quantity_required || 0);
        item.vendors[vendorIndex].total_price = qty * Number(value || 0);
      }

      return { ...prev, items };
    });
  };

  const addItem = () => {
    setPrData({
      ...prData,
      items: [
        ...prData.items,
        { item_code: "", item_name: "", quantity_required: "", vendors: [] },
      ],
    });
  };
  const removeItem = (itemIndex: number) => {
    if (prData.items.length === 1) return;
    setPrData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== itemIndex),
    }));
  };

  const addVendor = (i) => {
    const updated = [...prData.items];
    updated[i].vendors.push({
      vendor_id: "",
      unit_price: "",
      total_price: "",
      quotation_validity_date: "",
      status: "Submitted",
      vendor_status_updated_by: 5,
      comments: [],
      attachments: [],
    });
    setPrData({ ...prData, items: updated });
  };
  const removeVendor = (itemIndex: number, vendorIndex: number) => {
    setPrData((prev) => {
      const items = [...prev.items];

      // Remove the vendor at vendorIndex
      items[itemIndex].vendors = items[itemIndex].vendors.filter(
        (_, i) => i !== vendorIndex
      );

      return { ...prev, items };
    });
  };

  const handleFileUpload = (i, vi, files) => {
    const key = `${i}-${vi}`;
    setVendorFiles({
      ...vendorFiles,
      [key]: Array.from(files),
    });
  };

  const handleComment = (i, vi, value) => {
    const updated = [...prData.items];
    updated[i].vendors[vi].comments = [{ comment: value, commented_by: 5 }];
    setPrData({ ...prData, items: updated });
  };

  const submitPR = async () => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(prData));

      Object.values(vendorFiles).forEach((files: any) => {
        files.forEach((file: File) => formData.append("attachments", file));
      });

      await axios.post(`${API_BASE}/purchase-requests`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ SUCCESS ALERT
      setAlert({
        type: "success",
        message: "PR created successfully",
      });
      // 🔥 THIS IS THE KEY LINE
      onCreated();

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);

      // ❌ ERROR ALERT
      setAlert({
        type: "error",
        message: "Something went wrong while creating PR",
      });
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 sm:p-4">
      <div className="w-full max-w-7xl bg-white text-gray-900 rounded-xl flex flex-col max-h-[95vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4  border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-purple-600">
            New Procurement Request
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-600"
          >
            ×
          </button>
        </div>
        {alert && (
          <Aleart
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* FORM AREA */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* PR INFO */}
          <div className="bg-gray-100 rounded-xl p-4 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <input
                  name="description"
                  placeholder="Add description"
                  className="w-full border rounded-lg p-2 mt-1"
                  onChange={handlePRChange}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Priority</label>
                <select
                  name="priority"
                  defaultValue=""
                  className="w-full border rounded-lg p-2 mt-1 bg-white"
                  onChange={handlePRChange}
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Delivery Date</label>
                <input
                  type="date"
                  name="required_date"
                  className="w-full border rounded-lg p-2 mt-1"
                  min={new Date().toISOString().split("T")[0]} // disables past dates
                  onChange={handlePRChange}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Department</label>
                {/* <select name="department" className="w-full border rounded-lg p-2 mt-1 bg-white" onChange={handlePRChange}>
                  <option value="">Select</option>
                  {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select> */}
                <select
                  name="department"
                  className="w-full border rounded-lg p-2 mt-1 bg-white"
                  onChange={handlePRChange}
                >
                  <option value="">Select</option>
                  {departments.map((d) => (
                    <option key={d.department_name} value={d.department_name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Remarks</label>
                <input
                  name="remarks"
                  placeholder="Add remarks"
                  className="w-full border rounded-lg p-2 mt-1"
                  onChange={handlePRChange}
                />
              </div>
            </div>
          </div>

          {/* ADD ITEM BUTTON */}
          <div className="flex justify-end gap-3">
            <button
              onClick={addItem}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              + Add Item
            </button>

            {prData.items.length > 1 && (
              <button
                onClick={() => removeItem(prData.items.length - 1)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Remove Item
              </button>
            )}
          </div>

          {/* ITEMS */}
          {prData.items.map((item, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4 space-y-4">
              {/* ITEM HEADER */}
              <div className="bg-gray-200 rounded-lg p-3 overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold">Item Code</span>
                    <input
                      className="flex-1 border rounded-lg px-2 py-1"
                      onChange={(e) =>
                        handleItemChange(i, "item_code", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold">Item Name</span>
                    <input
                      className="flex-1 border rounded-lg px-2 py-1"
                      onChange={(e) =>
                        handleItemChange(i, "item_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold">Quantity</span>
                    <input
                      type="number"
                      min={1} // prevents 0 or negative in UI
                      className="w-full sm:w-28 border rounded-lg px-2 py-1"
                      onChange={(e) => {
                        const value = e.target.value;

                        // Only allow positive integers
                        if (/^[1-9]\d*$/.test(value)) {
                          handleItemChange(i, "quantity_required", Number(value));
                        } else if (value === "") {
                          // allow clearing input
                          handleItemChange(i, "quantity_required", "");
                        }
                        // Otherwise ignore invalid input
                      }}
                    />
                  </div>

                </div>
              </div>

              {/* VENDORS */}
              <div className="overflow-x-auto space-y-2">
                {item.vendors.map((vendor, vi) => (
                  <div
                    key={vi}
                    className="grid grid-cols-1 sm:grid-cols-8 gap-2 sm:gap-3 items-end"
                  >
                    {/* Vendor */}
                    <div>
                      <label className="text-xs text-gray-600">Vendor</label>
                      <select
                        className="w-full p-2 border rounded mt-1"
                        onChange={(e) =>
                          handleVendorChange(i, vi, "vendor_id", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {vendorList.map((v) => (
                          <option key={v.vendor_id} value={v.vendor_id}>
                            {v.vendor_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Upload */}
                    <div>
                      <label className="text-xs text-gray-600">
                        Upload Quotation
                      </label>
                      <input
                        type="file"
                        className="w-full p-2 border rounded mt-1"
                        onChange={(e) =>
                          handleFileUpload(i, vi, e.target.files)
                        }
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="text-xs text-gray-600">Unit Price</label>
                      <input
                        className="w-full p-2 border rounded mt-1"
                        placeholder="Enter positive number"
                        onChange={(e) => {
                          let value = e.target.value;

                          // Remove all non-digit and non-dot characters
                          value = value.replace(/[^0-9.]/g, "");

                          // Prevent multiple dots
                          const parts = value.split(".");
                          if (parts.length > 2) {
                            value = parts[0] + "." + parts[1];
                          }

                          // Convert to number
                          const num = Number(value);

                          // Only allow positive numbers greater than 0
                          if (!isNaN(num) && num > 0) {
                            handleVendorChange(i, vi, "unit_price", num);
                          } else if (value === "") {
                            handleVendorChange(i, vi, "unit_price", "");
                          }
                          // Otherwise ignore invalid input (0, negative, letters, symbols)
                        }}
                      />
                    </div>


                    {/* Total Price */}
                    <div>
                      <label className="text-xs text-gray-600">
                        Total Price
                      </label>
                      <input
                        className="w-full p-2 border rounded mt-1 bg-gray-100"
                        value={vendor.total_price || ""}
                        readOnly
                      />
                    </div>

                    {/* Validity */}
                    <div>
                      <label className="text-xs text-gray-600">Quotation Validity</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded mt-1"
                        min={new Date().toISOString().split("T")[0]} // prevent past dates
                        onChange={(e) =>
                          handleVendorChange(i, vi, "quotation_validity_date", e.target.value)
                        }
                      />
                    </div>


                    {/* Comments */}
                    <div>
                      <label className="text-xs text-gray-600">Comments</label>
                      <input
                        className="w-full p-2 border rounded mt-1"
                        onChange={(e) => handleComment(i, vi, e.target.value)}
                      />
                    </div>

                    {/* 🗑 REMOVE VENDOR */}
                    <div className="flex items-end justify-end">
                      <button
                        onClick={() => removeVendor(i, vi)}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white"
                        title="Remove Vendor"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}

                {/* ADD VENDOR BUTTON - RIGHT */}
                <div className="flex justify-end">
                  <button
                    onClick={() => addVendor(i)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    + Add Vendor
                  </button>
                </div>
              </div>
            </div>


          ))}
        </div>



        {/* SUBMIT BUTTON - sticky bottom right */}
        <div className="flex justify-end p-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <button onClick={submitPR} className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2">
            <Upload size={16} /> Submit PR
          </button>
        </div>

      </div>
    </div>
  );
}
