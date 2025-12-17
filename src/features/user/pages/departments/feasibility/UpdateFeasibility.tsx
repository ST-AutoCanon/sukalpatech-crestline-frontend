import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { useFeasibility } from "../../../hooks/useFeasibility";

const UpdateFeasibility: React.FC = () => {
  const { user, token } = useContext(AuthContext);
  const { allPRs, fetchAllPRs, addComment, addStatus } = useFeasibility(token);
  const [selectedPR, setSelectedPR] = useState<any | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  const selectPR = (prId: number) => {
    const pr = allPRs.find((p) => p.pr_id === prId);
    if (pr) setSelectedPR(pr);
  };

  const feasibilityAlreadyActed =
    selectedPR?.comments?.some((c: any) => c.department === "Feasibility") ||
    selectedPR?.statusLogs?.some((s: any) => s.department === "Feasibility");

  const handleSubmit = async () => {
    if (!selectedPR) return;

    if (!newComment || !newStatus) {
      return alert("Please enter comment and select status");
    }

    if (
      !window.confirm(
        "Are you sure you want to submit Feasibility comment and status?"
      )
    )
      return;

    try {
      await addComment({
        pr_id: selectedPR.pr_id,
        commented_by: user.id,
        department: "Feasibility",
        comment: newComment,
      });

      await addStatus({
        pr_id: selectedPR.pr_id,
        new_status: newStatus,
        old_status: selectedPR.status,
        updated_by: user.id,
        department: "Feasibility",
      });

      alert("Feasibility details submitted successfully");

      setNewComment("");
      setNewStatus("");
      fetchAllPRs();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="p-5 max-w-7xl mx-auto bg-white shadow rounded space-y-6">
      <PRSelector allPRs={allPRs} selectedPR={selectedPR} selectPR={selectPR} />

      {selectedPR && (
        <>
          <PRDetails selectedPR={selectedPR} />
          <PRTable selectedPR={selectedPR} BACKEND_URL={BACKEND_URL} />

          <Section title="Previous Comments">
            {selectedPR.comments.length === 0 ? (
              <p>No comments added yet</p>
            ) : (
              selectedPR.comments.map((c: any) => (
                <p key={c.comment_id}>
                  <strong>{c.department}:</strong> {c.comment}
                </p>
              ))
            )}
          </Section>

          <Section title="Status History">
            {selectedPR.statusLogs.length === 0 ? (
              <p>No status updates yet</p>
            ) : (
              selectedPR.statusLogs.map((s: any, i: number) => (
                <p key={i}>
                  <strong>{s.department}:</strong> {s.new_status}
                </p>
              ))
            )}
          </Section>

          <div>
            <label className="font-semibold">Add Comment</label>
            <textarea
              value={newComment}
              disabled={feasibilityAlreadyActed}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border p-1 rounded"
            />
          </div>

          <div>
            <label className="font-semibold">Update Status</label>
            <select
              value={newStatus}
              disabled={feasibilityAlreadyActed}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border p-1 rounded"
            >
              <option value="">Select Status</option>
              <option value="Feasibility Pending">Pending</option>
              <option value="Feasibility Approved">Approved</option>
              <option value="Feasibility Rejected">Rejected</option>
            </select>
          </div>

          <button
            disabled={feasibilityAlreadyActed}
            onClick={handleSubmit}
            className={`mt-4 px-6 py-2 rounded font-semibold ${
              feasibilityAlreadyActed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            Submit Feasibility
          </button>
        </>
      )}
    </div>
  );
};

/* ---------------- Helper Components (UNCHANGED) ---------------- */

const PRSelector = ({ allPRs, selectedPR, selectPR }: any) => (
  <div>
    <label className="font-semibold">Select PR</label>
    <select
      className="w-full border rounded px-2 py-1"
      value={selectedPR?.pr_id || ""}
      onChange={(e) => selectPR(Number(e.target.value))}
    >
      <option value="">-- Select PR --</option>
      {allPRs.map((pr: any) => (
        <option key={pr.pr_id} value={pr.pr_id}>
          {pr.pr_number} | {pr.project_name}
        </option>
      ))}
    </select>
  </div>
);

const PRDetails = ({ selectedPR }: any) => (
  <div className="grid grid-cols-2 gap-4">
    <Field label="Project Name" value={selectedPR.project_name} />
    <Field label="Priority" value={selectedPR.priority} />
    <Field label="Status" value={selectedPR.status} />
    <Field label="Department" value={selectedPR.requesting_department} />
    <Field
      label="Required Delivery Date"
      value={new Date(selectedPR.required_delivery_date).toLocaleDateString()}
    />
  </div>
);

const PRTable = ({ selectedPR, BACKEND_URL }: any) => (
  <div className="overflow-x-auto">
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">SlNo</th>
          <th className="border px-2 py-1">Vendor</th>
          <th className="border px-2 py-1">Item Name</th>
          <th className="border px-2 py-1">Item Code</th>
          <th className="border px-2 py-1">Qty</th>
          <th className="border px-2 py-1">Unit</th>
          <th className="border px-2 py-1">Rate</th>
          <th className="border px-2 py-1">Total</th>
          <th className="border px-2 py-1">Attachment</th>
        </tr>
      </thead>
      <tbody>
        {selectedPR.items.map((item: any, idx: number) => {
          const vendor = selectedPR.vendors[idx] || {};
          const attach = selectedPR.attachments[idx];
          return (
            <tr key={item.item_id}>
              <td className="border px-2 py-1">{idx + 1}</td>
              <td className="border px-2 py-1">{vendor.vendor_name || "-"}</td>
              <td className="border px-2 py-1">{item.item_name}</td>
              <td className="border px-2 py-1">{item.item_code}</td>
              <td className="border px-2 py-1">{item.quantity_required}</td>
              <td className="border px-2 py-1">{item.unit}</td>
              <td className="border px-2 py-1">{item.expected_rate}</td>
              <td className="border px-2 py-1">{item.total_price}</td>
              <td className="border px-2 py-1">
                {attach ? (
                  <a
                    href={`${BACKEND_URL}/${attach.file_path}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {attach.file_name}
                  </a>
                ) : (
                  "NA"
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const Field = ({ label, value }: any) => (
  <div>
    <label className="font-semibold">{label}</label>
    <input
      value={value || ""}
      readOnly
      className="w-full border p-1 rounded bg-gray-100"
    />
  </div>
);

const Section = ({ title, children }: any) => (
  <div className="mt-4">
    <h3 className="font-bold text-lg">{title}</h3>
    <div className="border rounded p-3 bg-gray-50">{children}</div>
  </div>
);

export default UpdateFeasibility;
