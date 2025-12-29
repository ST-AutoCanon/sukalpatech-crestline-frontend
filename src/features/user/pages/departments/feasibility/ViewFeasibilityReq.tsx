import { useEffect, useState } from "react";

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
  id: number;
  vendor_id: number;
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
  const [prs, setPrs] = useState<PR[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/new-feasibility/submitted-requests")
      .then((res) => res.json())
      .then((data) => setPrs(data?.data || []))
      .catch((err) => console.error("Fetch PR Error:", err));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Purchase Requests</h1>

      {prs.map((pr) => (
        <div
          key={pr.id}
          className="bg-white rounded-xl shadow-md mb-6 p-6 border border-gray-200"
        >
          {/* ================= BASIC CARD ================= */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">PR #{pr.id}</h2>

            <button
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setExpanded(expanded === pr.id ? null : pr.id)}
            >
              {expanded === pr.id ? "Hide Info" : "More Info"}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <p>
              <strong>Requested By:</strong> {pr.requested_by}
            </p>
            <p>
              <strong>Priority:</strong> {pr.priority}
            </p>

            <p>
              <strong>Required Date:</strong>{" "}
              {new Date(pr.required_date).toLocaleDateString()}
            </p>

            <p>
              <strong>Created At:</strong>{" "}
              {new Date(pr.created_at).toLocaleString()}
            </p>

            <p className="col-span-2">
              <strong>Description:</strong> {pr.description}
            </p>

            <p className="col-span-2">
              <strong>Remarks:</strong> {pr.remarks}
            </p>
          </div>

          {/* ================= EXPANDED DETAILS ================= */}
          {expanded === pr.id && (
            <div className="mt-6 border-t pt-4">
              {/* ---------- Department Statuses ---------- */}
              <h3 className="text-lg font-semibold mb-2">
                Department Statuses
              </h3>

              {pr.department_statuses?.length ? (
                pr.department_statuses.map((d, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border mb-2">
                    <p>
                      <strong>Status:</strong> {d.department_status}
                    </p>
                    <p>
                      <strong>Comment:</strong> {d.department_comment}
                    </p>
                    <p>
                      <strong>Updated By:</strong> {d.status_updated_by}
                    </p>
                    <p>
                      <strong>Updated At:</strong>{" "}
                      {new Date(d.updated_at).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No department statuses</p>
              )}

              {/* ---------- Items + Vendors ---------- */}
              <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>

              {pr.items?.map((item) => (
                <div key={item.id} className="border rounded p-3 mb-3">
                  <p>
                    <strong>Item:</strong> {item.item_name} ({item.item_code})
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity_required}
                  </p>

                  <h4 className="font-semibold mt-2">Vendors</h4>

                  {item.vendors.map((v) => (
                    <div
                      key={v.id}
                      className="bg-gray-50 p-2 mb-2 rounded border"
                    >
                      <p>
                        <strong>Vendor ID:</strong> {v.vendor_id}
                      </p>
                      <p>
                        <strong>Status:</strong> {v.status || "-"}
                      </p>
                      <p>
                        <strong>Unit Price:</strong> {v.unit_price}
                      </p>
                      <p>
                        <strong>Total Price:</strong> {v.total_price}
                      </p>
                      <p>
                        <strong>Validity:</strong> {v.quotation_validity_date}
                      </p>

                      {/* Comments */}
                      <p className="mt-2 font-semibold">Comments</p>
                      {v.comments?.length ? (
                        v.comments.map((c) => (
                          <p key={c.id} className="text-sm">
                            • {c.comment}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No comments</p>
                      )}

                      {/* Attachments */}
                      <p className="mt-2 font-semibold">Attachments</p>
                      {v.attachments?.length ? (
                        v.attachments.map((a) => (
                          <p key={a.id} className="text-sm">
                            • {a.file_name}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No attachments</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
