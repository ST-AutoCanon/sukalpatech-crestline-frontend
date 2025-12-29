import { useState, useEffect } from "react";
import axios from "axios";

interface DepartmentStatus {
  department_status: string;
  department_comment: string;
  status_updated_by?: number;
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
  created_at?: string;
  updated_at?: string;
  department_statuses: DepartmentStatus[];
  items: Item[];
}

export default function SubmittedStoreRequestsPage() {
  const API_BASE = "http://localhost:5001/api/new-store";

  const [requests, setRequests] = useState<StorePR[]>([]);
  const [selectedPR, setSelectedPR] = useState<StorePR | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newComment, setNewComment] = useState("");

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

  const fetchFinanceApprovedStoreRequests = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/finance-approved-store-requests`
      );
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching finance-approved store requests:", err);
      alert("Error fetching store requests");
    }
  };

  useEffect(() => {
    fetchFinanceApprovedStoreRequests();
  }, []);

  const selectPR = (prId: string) => {
    const pr = requests.find((r) => r.id === prId);
    if (!pr) {
      setSelectedPR(null);
      setUpdateData({ department_statuses: [], items: [] });
      return;
    }

    setSelectedPR(pr);
    setUpdateData({
      department_statuses: pr.department_statuses || [],
      items: pr.items.map((item) => ({
        ...item,
        vendors: item.vendors.map((v) => ({ ...v })),
      })),
    });

    setNewStatus("");
    setNewComment("");
  };

  const submitUpdate = async () => {
    if (!selectedPR || !newStatus) {
      alert("Please select a status");
      return;
    }

    const payload = {
      department_statuses: [
        {
          department_status: newStatus,
          department_comment: newComment,
          status_updated_by: 2, // your user id
          updated_at: new Date().toISOString(),
        },
      ],
      items: updateData.items,
    };

    try {
      await axios.put(`${API_BASE}/store-requests/${selectedPR.id}`, payload);
      alert("Store PR updated successfully");
      fetchFinanceApprovedStoreRequests();
      setNewStatus("");
      setNewComment("");
    } catch (err) {
      console.error("Error updating Store PR:", err);
      alert("Error updating Store PR");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">
        Finance-Approved Store Requests
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select a PR</h2>
        <select
          className="border p-2 rounded-lg w-full text-black"
          onChange={(e) => selectPR(e.target.value)}
          value={selectedPR?.id || ""}
        >
          <option value="">-- Select PR --</option>
          {requests.map((pr) => (
            <option key={pr.id} value={pr.id}>
              {pr.id} - {pr.description || "No description"}
            </option>
          ))}
        </select>
      </div>

      {!selectedPR && <p className="text-red-600">No PR selected</p>}

      {selectedPR && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">PR Details</h2>
          <div className="mb-4">
            <p>
              <strong>ID:</strong> {selectedPR.id}
            </p>
            <p>
              <strong>Department:</strong> {selectedPR.department}
            </p>
            <p>
              <strong>Description:</strong> {selectedPR.description}
            </p>
            <p>
              <strong>Priority:</strong> {selectedPR.priority}
            </p>
            <p>
              <strong>Required Date:</strong> {selectedPR.required_date}
            </p>
            <p>
              <strong>Remarks:</strong> {selectedPR.remarks}
            </p>
          </div>

          <h3 className="font-bold mb-2">Previous Department Statuses</h3>
          <div className="mb-4">
            {updateData.department_statuses.length > 0 ? (
              updateData.department_statuses.map((dep, i) => (
                <div key={i} className="mb-2 border p-2 rounded bg-gray-50">
                  <p>
                    <strong>Status:</strong> {dep.department_status}
                  </p>
                  <p>
                    <strong>Comment:</strong>{" "}
                    {dep.department_comment || "No comment"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated At:{" "}
                    {dep.updated_at
                      ? new Date(dep.updated_at).toLocaleString()
                      : "-"}
                  </p>
                </div>
              ))
            ) : (
              <p>No previous department statuses</p>
            )}
          </div>

          <h3 className="font-bold mb-2">Add New Department Status</h3>
          <div className="flex gap-2 items-center mb-4">
            <select
              className="border p-2 rounded text-black"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">-- Select Status --</option>
              {STORE_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="border p-2 rounded text-black flex-1"
              placeholder="Add comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={submitUpdate}
            >
              Add Status
            </button>
          </div>

          <h3 className="font-bold mt-4 mb-2">Items & Vendors (Read-Only)</h3>
          {updateData.items.map((item, i) => (
            <div key={i} className="mb-4 border p-2 rounded">
              <h4 className="font-semibold mb-1">
                {item.item_name || `Item ${i + 1}`} (Code: {item.item_code})
              </h4>
              <p>Quantity Required: {item.quantity_required}</p>

              {item.vendors?.map((vendor, vi) => (
                <div key={vi} className="mb-4 border p-2 rounded bg-gray-50">
                  <p>
                    <strong>Vendor ID:</strong> {vendor.vendor_id}
                  </p>
                  <p>
                    <strong>Unit Price:</strong> {vendor.unit_price}
                  </p>
                  <p>
                    <strong>Total Price:</strong> {vendor.total_price}
                  </p>

                  <div className="mb-2">
                    <p className="font-semibold">Previous Comments:</p>
                    {vendor.comments?.map((c, ci) => (
                      <p key={ci}>
                        <strong>{c.commented_by}:</strong> {c.comment}
                      </p>
                    )) || <p>No comments</p>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
