// import React, { useState, useContext } from "react";
// import { AuthContext } from "../../../../../context/AuthContext";
// import { useFeasibility } from "../../../hooks/useFeasibility";

// const UpdateFeasibility: React.FC = () => {
//   const { user, token } = useContext(AuthContext);
//   const { allPRs, fetchAllPRs, addComment, addStatus } = useFeasibility(token);
//   const [selectedPR, setSelectedPR] = useState<any | null>(null);
//   const [newComment, setNewComment] = useState("");
//   const [newStatus, setNewStatus] = useState("");

//   const BACKEND_URL =
//     import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

//   const selectPR = (prId: number) => {
//     const pr = allPRs.find((p) => p.pr_id === prId);
//     if (pr) setSelectedPR(pr);
//   };

//   const feasibilityAlreadyActed =
//     selectedPR?.comments?.some((c: any) => c.department === "Feasibility") ||
//     selectedPR?.statusLogs?.some((s: any) => s.department === "Feasibility");

//   const handleSubmit = async () => {
//     if (!selectedPR) return;

//     if (!newComment || !newStatus) {
//       return alert("Please enter comment and select status");
//     }

//     if (
//       !window.confirm(
//         "Are you sure you want to submit Feasibility comment and status?"
//       )
//     )
//       return;

//     try {
//       await addComment({
//         pr_id: selectedPR.pr_id,
//         commented_by: user.id,
//         department: "Feasibility",
//         comment: newComment,
//       });

//       await addStatus({
//         pr_id: selectedPR.pr_id,
//         new_status: newStatus,
//         old_status: selectedPR.status,
//         updated_by: user.id,
//         department: "Feasibility",
//       });

//       alert("Feasibility details submitted successfully");

//       setNewComment("");
//       setNewStatus("");
//       fetchAllPRs();
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.response?.data?.message || "Submission failed");
//     }
//   };

//   return (
//     <div className="p-5 max-w-7xl mx-auto bg-white shadow rounded space-y-6">
//       <PRSelector allPRs={allPRs} selectedPR={selectedPR} selectPR={selectPR} />

//       {selectedPR && (
//         <>
//           <PRDetails selectedPR={selectedPR} />
//           <PRTable selectedPR={selectedPR} BACKEND_URL={BACKEND_URL} />

//           <Section title="Previous Comments">
//             {selectedPR.comments.length === 0 ? (
//               <p>No comments added yet</p>
//             ) : (
//               selectedPR.comments.map((c: any) => (
//                 <p key={c.comment_id}>
//                   <strong>{c.department}:</strong> {c.comment}
//                 </p>
//               ))
//             )}
//           </Section>

//           <Section title="Status History">
//             {selectedPR.statusLogs.length === 0 ? (
//               <p>No status updates yet</p>
//             ) : (
//               selectedPR.statusLogs.map((s: any, i: number) => (
//                 <p key={i}>
//                   <strong>{s.department}:</strong> {s.new_status}
//                 </p>
//               ))
//             )}
//           </Section>

//           <div>
//             <label className="font-semibold">Add Comment</label>
//             <textarea
//               value={newComment}
//               disabled={feasibilityAlreadyActed}
//               onChange={(e) => setNewComment(e.target.value)}
//               className="w-full border p-1 rounded"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Update Status</label>
//             <select
//               value={newStatus}
//               disabled={feasibilityAlreadyActed}
//               onChange={(e) => setNewStatus(e.target.value)}
//               className="w-full border p-1 rounded"
//             >
//               <option value="">Select Status</option>
//               <option value="Feasibility Pending">Pending</option>
//               <option value="Feasibility Approved">Approved</option>
//               <option value="Feasibility Rejected">Rejected</option>
//             </select>
//           </div>

//           <button
//             disabled={feasibilityAlreadyActed}
//             onClick={handleSubmit}
//             className={`mt-4 px-6 py-2 rounded font-semibold ${
//               feasibilityAlreadyActed
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-indigo-600 text-white"
//             }`}
//           >
//             Submit Feasibility
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// /* ---------------- Helper Components (UNCHANGED) ---------------- */

// const PRSelector = ({ allPRs, selectedPR, selectPR }: any) => (
//   <div>
//     <label className="font-semibold">Select PR</label>
//     <select
//       className="w-full border rounded px-2 py-1"
//       value={selectedPR?.pr_id || ""}
//       onChange={(e) => selectPR(Number(e.target.value))}
//     >
//       <option value="">-- Select PR --</option>
//       {allPRs.map((pr: any) => (
//         <option key={pr.pr_id} value={pr.pr_id}>
//           {pr.pr_number} | {pr.project_name}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const PRDetails = ({ selectedPR }: any) => (
//   <div className="grid grid-cols-2 gap-4">
//     <Field label="Project Name" value={selectedPR.project_name} />
//     <Field label="Priority" value={selectedPR.priority} />
//     <Field label="Status" value={selectedPR.status} />
//     <Field label="Department" value={selectedPR.requesting_department} />
//     <Field
//       label="Required Delivery Date"
//       value={new Date(selectedPR.required_delivery_date).toLocaleDateString()}
//     />
//   </div>
// );

// const PRTable = ({ selectedPR, BACKEND_URL }: any) => (
//   <div className="overflow-x-auto">
//     <table className="w-full border text-sm">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="border px-2 py-1">SlNo</th>
//           <th className="border px-2 py-1">Vendor</th>
//           <th className="border px-2 py-1">Item Name</th>
//           <th className="border px-2 py-1">Item Code</th>
//           <th className="border px-2 py-1">Qty</th>
//           <th className="border px-2 py-1">Unit</th>
//           <th className="border px-2 py-1">Rate</th>
//           <th className="border px-2 py-1">Total</th>
//           <th className="border px-2 py-1">Attachment</th>
//         </tr>
//       </thead>
//       <tbody>
//         {selectedPR.items.map((item: any, idx: number) => {
//           const vendor = selectedPR.vendors[idx] || {};
//           const attach = selectedPR.attachments[idx];
//           return (
//             <tr key={item.item_id}>
//               <td className="border px-2 py-1">{idx + 1}</td>
//               <td className="border px-2 py-1">{vendor.vendor_name || "-"}</td>
//               <td className="border px-2 py-1">{item.item_name}</td>
//               <td className="border px-2 py-1">{item.item_code}</td>
//               <td className="border px-2 py-1">{item.quantity_required}</td>
//               <td className="border px-2 py-1">{item.unit}</td>
//               <td className="border px-2 py-1">{item.expected_rate}</td>
//               <td className="border px-2 py-1">{item.total_price}</td>
//               <td className="border px-2 py-1">
//                 {attach ? (
//                   <a
//                     href={`${BACKEND_URL}/${attach.file_path}`}
//                     target="_blank"
//                     className="text-blue-600 underline"
//                   >
//                     {attach.file_name}
//                   </a>
//                 ) : (
//                   "NA"
//                 )}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// );

// const Field = ({ label, value }: any) => (
//   <div>
//     <label className="font-semibold">{label}</label>
//     <input
//       value={value || ""}
//       readOnly
//       className="w-full border p-1 rounded bg-gray-100"
//     />
//   </div>
// );

// const Section = ({ title, children }: any) => (
//   <div className="mt-4">
//     <h3 className="font-bold text-lg">{title}</h3>
//     <div className="border rounded p-3 bg-gray-50">{children}</div>
//   </div>
// );

// export default UpdateFeasibility;






/////////////////////

import { useState, useEffect } from "react";
import axios from "axios";

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
  vendor_status_updated_by?: number;
  unit_price?: number;
  total_price?: number;
  quotation_validity_date?: string;
  attachments?: { id: number; file_name: string; file_path: string }[];
  comments?: VendorComment[];
}

interface Item {
  id: number;
  item_code?: string;
  item_name?: string;
  quantity_required?: number;
  vendors: Vendor[];
}

interface DepartmentStatus {
  department_status: string;
  department_comment: string;
  status_updated_by?: number;
  updated_at?: string;
}

interface FeasibilityPR {
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

export default function SubmittedRequestsPage() {
  const API_BASE = "http://localhost:5001/api/new-feasibility";

  const [requests, setRequests] = useState<FeasibilityPR[]>([]);
  const [selectedPR, setSelectedPR] = useState<FeasibilityPR | null>(null);
  const [updateData, setUpdateData] = useState<{
    department_statuses: DepartmentStatus[];
    items: Item[];
  }>({ department_statuses: [], items: [] });

  // Store temporary new comments for each vendor
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

  const VENDOR_STATUS_OPTIONS = [
    "Submitted",
    "Approved",
    "Rejected",
    "Pending",
    "In Review",
  ];

  // Fetch all submitted PRs
  const fetchSubmittedRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/submitted-requests`);
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching submitted requests:", err);
      alert("Error fetching submitted requests");
    }
  };

  useEffect(() => {
    fetchSubmittedRequests();
  }, []);

  // Select PR from dropdown
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

    // Reset new comments
    setNewComments({});
  };

  // Update department status/comment
  const handleDepartmentStatusChange = (
    index: number,
    value: string,
    comment: string
  ) => {
    const updated = [...updateData.department_statuses];
    updated[index] = {
      ...updated[index],
      department_status: value,
      department_comment: comment,
    };
    setUpdateData({ ...updateData, department_statuses: updated });
  };


  const handleVendorStatusChange = (
    itemIndex: number,
    vendorIndex: number,
    status: string
  ) => {
    const updatedItems = [...updateData.items];
    const vendor = { ...updatedItems[itemIndex].vendors[vendorIndex] };

    // Always update status, even if empty
    vendor.status = status;

    updatedItems[itemIndex].vendors[vendorIndex] = vendor;
    setUpdateData({ ...updateData, items: updatedItems });
  };


  // Update new comment input
  const handleNewCommentChange = (
    itemIndex: number,
    vendorIndex: number,
    value: string
  ) => {
    const key = `${itemIndex}-${vendorIndex}`;
    setNewComments({ ...newComments, [key]: value });
  };


  const submitUpdate = async () => {
    if (!selectedPR) return;

    // Step 1: Deep clone items
    const updatedItems = updateData.items.map((item, i) => ({
      ...item,
      vendors: item.vendors.map((vendor, vi) => {
        const key = `${i}-${vi}`;
        const newCommentText = newComments[key]?.trim();

        const updatedComments = vendor.comments ? [...vendor.comments] : [];

        if (newCommentText) {
          updatedComments.push({
            id: null,
            comment: newCommentText,
            commented_by: 2, // your department/user id
            department_id: 2,
            commented_at: new Date().toISOString(),
          });
        }

        return {
          ...vendor,
          vendor_status_updated_by: 2, // optional if needed
          comments: updatedComments,
        };
      }),
    }));

    const payload = {
      ...updateData,
      items: updatedItems,
    };

    console.log("Submitting payload:", payload);

    try {
      await axios.put(
        `${API_BASE}/feasibility-requests/${selectedPR.id}`,
        payload
      );
      alert("PR updated successfully");

      // Clear newComments after submit
      setNewComments({});

      // Refresh PRs
      fetchSubmittedRequests();
    } catch (err) {
      console.error("Error updating PR:", err);
      alert("Error updating PR");
    }
  };


  return (
    <div className="p-8 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">
        Submitted Feasibility Requests
      </h1>

      {/* PR Dropdown */}
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
          {/* PR Details */}
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

          {/* Department Statuses */}
          <h3 className="font-bold mb-2">Department Statuses (Editable)</h3>
          {updateData.department_statuses.map((dep, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input
                className="border p-2 rounded text-black"
                placeholder="Status"
                value={dep.department_status}
                onChange={(e) =>
                  handleDepartmentStatusChange(
                    i,
                    e.target.value,
                    dep.department_comment
                  )
                }
              />
              <input
                className="border p-2 rounded text-black"
                placeholder="Comment"
                value={dep.department_comment}
                onChange={(e) =>
                  handleDepartmentStatusChange(
                    i,
                    dep.department_status,
                    e.target.value
                  )
                }
              />
            </div>
          ))}

          {/* Items & Vendors */}
          <h3 className="font-bold mt-4 mb-2">Items & Vendor Updates</h3>
          {updateData.items.map((item, i) => (
            <div key={i} className="mb-4 border p-2 rounded">
              <h4 className="font-semibold mb-1">
                {item.item_name || `Item ${i + 1}`} (Code: {item.item_code})
              </h4>
              <p>Quantity Required: {item.quantity_required}</p>

              {item.vendors.map((vendor, vi) => (
                <div key={vi} className="mb-4 border p-2 rounded">
                  <p>
                    <strong>Vendor ID:</strong> {vendor.vendor_id}
                  </p>
                  <p>
                    <strong>Unit Price:</strong> {vendor.unit_price}
                  </p>
                  <p>
                    <strong>Total Price:</strong> {vendor.total_price}
                  </p>

                  {/* Vendor status input */}
                 
                  <select
                    className="border p-2 rounded text-black mb-2"
                    value={vendor.status || ""}
                    onChange={(e) =>
                      handleVendorStatusChange(i, vi, e.target.value)
                    }
                  >
                    <option value="">-- Select Status --</option>
                    {VENDOR_STATUS_OPTIONS.map((statusOption, idx) => (
                      <option key={idx} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>

                  {/* Vendor comments */}
                  <div className="mb-2">
                    <p className="font-semibold">Previous Comments:</p>
                    {vendor.comments?.map((c, ci) => (
                      <p key={ci}>
                        <strong>{c.commented_by}:</strong> {c.comment}
                      </p>
                    ))}
                  </div>

                  {/* Add new comment */}

                  <input
                    className="border p-2 rounded text-black"
                    placeholder="Add Comment"
                    value={newComments[`${i}-${vi}`] || ""}
                    onChange={(e) =>
                      handleNewCommentChange(i, vi, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
            onClick={submitUpdate}
          >
            Update PR
          </button>
        </div>
      )}
    </div>
  );
}