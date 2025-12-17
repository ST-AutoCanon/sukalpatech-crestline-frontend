import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { useProcurement } from "../../../hooks/useProcurement";

const Procurement: React.FC = () => {
  const { user, token } = useContext(AuthContext);

  const { departments, vendors, refetchAllPRs, createPR } =
    useProcurement(token);

  const [projectName, setProjectName] = useState("");
  const [priority, setPriority] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [requestingDepartment, setRequestingDepartment] = useState<{
    department_id: number | null;
    name: string;
  }>({ department_id: null, name: "" });

  const [rows, setRows] = useState([
    {
      vendor_id: null,
      item_code: "",
      item_name: "",
      quantity: "",
      unit: "",
      price: "",
      total_price: "",
      quotation: null as File | null,
      quotationValidityDate: "",
      comments: "",
    },
  ]);

  const addRow = () =>
    setRows([
      ...rows,
      {
        vendor_id: null,
        item_code: "",
        item_name: "",
        quantity: "",
        unit: "",
        price: "",
        total_price: "",
        quotation: null,
        quotationValidityDate: "",
        comments: "",
      },
    ]);

  const submitPR = async () => {
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append("project_name", projectName);
      formData.append("requested_by", String(user.id));
      formData.append("requested_by_person", user.email);
      formData.append(
        "requesting_department_id",
        String(requestingDepartment.department_id)
      );
      formData.append("requesting_department", requestingDepartment.name);
      formData.append("priority", priority);
      formData.append("required_delivery_date", requiredDate);
      formData.append("remarks", remarks);
      formData.append("status", "draft");

      const items: any[] = [];
      const comments: any[] = [];
      const attachments: any[] = [];
      const vendor_ids: number[] = [];

      rows.forEach((r) => {
        items.push({
          item_code: r.item_code,
          item_name: r.item_name,
          specification: "",
          quantity_required: r.quantity,
          unit: r.unit,
          expected_rate: r.price,
          reason: "",
        });

        comments.push({ commented_by: user.id, comment: r.comments });

        if (r.quotation) {
          attachments.push({
            file_name: r.quotation.name,
            file_path: "",
            file_object: r.quotation,
            quotation_validity_date: r.quotationValidityDate,
          });
        }

        if (r.vendor_id) vendor_ids.push(r.vendor_id);
      });

      formData.append("items", JSON.stringify(items));
      formData.append("comments", JSON.stringify(comments));
      formData.append("vendor_ids", JSON.stringify(vendor_ids));

      attachments.forEach((att) => {
        if (att.file_object) {
          formData.append("attachments", att.file_object);
          formData.append(
            "attachments_quotation_validity_date",
            att.quotation_validity_date || ""
          );
        }
      });

      await createPR(formData);

      alert("PR Created Successfully!");

      setProjectName("");
      setPriority("");
      setRequiredDate("");
      setRemarks("");
      setRequestingDepartment({ department_id: null, name: "" });
      setRows([
        {
          vendor_id: null,
          item_code: "",
          item_name: "",
          quantity: "",
          unit: "",
          price: "",
          total_price: "",
          quotation: null,
          quotationValidityDate: "",
          comments: "",
        },
      ]);

      refetchAllPRs();
    } catch (error) {
      console.error("PR Error:", error);
      alert("Error sending PR");
    }
  };

  const handleRowChange = (idx: number, field: string, value: any) => {
    const newRows = [...rows];
    (newRows[idx] as any)[field] = value;

    if (field === "quantity" || field === "price") {
      const qty = parseFloat(newRows[idx].quantity) || 0;
      const price = parseFloat(newRows[idx].price) || 0;
      newRows[idx].total_price = (qty * price).toFixed(2);
    }

    setRows(newRows);
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4 text-gray-800">
        New Procurement Request
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          className={inputClass}
          placeholder="Description"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <select
          className={inputClass}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className="block mb-2">
          Required Delivery Date
          <input
            type="date"
            className={inputClass}
            value={requiredDate}
            onChange={(e) => setRequiredDate(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          Requesting Department
          <select
            className={inputClass}
            value={requestingDepartment.department_id || ""}
            onChange={(e) => {
              const dept = departments.find(
                (d) => d.department_id === Number(e.target.value)
              );
              dept && setRequestingDepartment(dept);
            }}
          >
            <option value="">Requesting Department</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <textarea
          className={inputClass + " md:col-span-2"}
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <h2 className="font-semibold mb-2 text-gray-700">Vendor Items</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 mb-3 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Vendor</th>
              <th className="border px-2 py-1">Item Code</th>
              <th className="border px-2 py-1">Item</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total Price</th>
              <th className="border px-2 py-1">Upload Quotation</th>
              <th className="border px-2 py-1">Quotation Validity</th>
              <th className="border px-2 py-1">Comments</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-1 py-1">
                  <select
                    className={inputClass}
                    value={row.vendor_id || ""}
                    onChange={(e) =>
                      handleRowChange(idx, "vendor_id", Number(e.target.value))
                    }
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v.vendor_id} value={v.vendor_id}>
                        {v.vendor_name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border px-1 py-1">
                  <input
                    className={inputClass}
                    value={row.item_code}
                    onChange={(e) =>
                      handleRowChange(idx, "item_code", e.target.value)
                    }
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    className={inputClass}
                    value={row.item_name}
                    onChange={(e) =>
                      handleRowChange(idx, "item_name", e.target.value)
                    }
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    type="number"
                    className={inputClass}
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(idx, "quantity", e.target.value)
                    }
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    className={inputClass}
                    value={row.unit}
                    onChange={(e) =>
                      handleRowChange(idx, "unit", e.target.value)
                    }
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    type="number"
                    className={inputClass}
                    value={row.price}
                    onChange={(e) =>
                      handleRowChange(idx, "price", e.target.value)
                    }
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    type="number"
                    className={inputClass}
                    value={row.total_price}
                    readOnly
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    type="file"
                    className={inputClass}
                    onChange={(e) =>
                      e.target.files &&
                      handleRowChange(idx, "quotation", e.target.files[0])
                    }
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    type="date"
                    className={inputClass}
                    value={row.quotationValidityDate}
                    onChange={(e) =>
                      handleRowChange(
                        idx,
                        "quotationValidityDate",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="border px-1 py-1">
                  <input
                    className={inputClass}
                    value={row.comments}
                    onChange={(e) =>
                      handleRowChange(idx, "comments", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="mb-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
      >
        + Add Row
      </button>

      <button
        onClick={submitPR}
        className="w-full px-4 py-2 bg-green-600 text-white rounded font-semibold"
      >
        Submit PR
      </button>
    </div>
  );
};

export default Procurement;
