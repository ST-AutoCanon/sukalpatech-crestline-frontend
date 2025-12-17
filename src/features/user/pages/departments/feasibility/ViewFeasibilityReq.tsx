import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { useFeasibility } from "../../../hooks/useFeasibility";

const ViewFeasibilityReq: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { allPRs } = useFeasibility(token);

  const [selectedPR, setSelectedPR] = useState<any | null>(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  // ✅ ONLY FEASIBILITY APPROVED PRs (same logic, moved here)
  const approvedPRs = allPRs.filter((pr: any) =>
    pr.statusLogs?.some(
      (s: any) =>
        s.department === "Feasibility" &&
        s.new_status === "Feasibility Approved"
    )
  );

  const selectPR = (prId: number) => {
    const pr = approvedPRs.find((p) => p.pr_id === prId);
    if (pr) setSelectedPR(pr);
  };

  // 🔵 Feasibility-only data
  const feasibilityComments =
    selectedPR?.comments?.filter((c: any) => c.department === "Feasibility") ||
    [];

  const feasibilityStatusLogs =
    selectedPR?.statusLogs?.filter(
      (s: any) => s.department === "Feasibility"
    ) || [];

  return (
    <div className="p-5 max-w-7xl mx-auto bg-white shadow rounded space-y-6">
      {/* PR Selection */}
      <div>
        <label className="font-semibold">Select Approved PR</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={selectedPR?.pr_id || ""}
          onChange={(e) => selectPR(Number(e.target.value))}
        >
          <option value="">-- Select PR --</option>
          {approvedPRs.map((pr) => (
            <option key={pr.pr_id} value={pr.pr_id}>
              {pr.pr_number} | {pr.project_name}
            </option>
          ))}
        </select>
      </div>

      {selectedPR && (
        <>
          {/* PR Info */}
          <div className="grid grid-cols-2 gap-4">
            <Info label="Project Name" value={selectedPR.project_name} />
            <Info label="Priority" value={selectedPR.priority} />
            <Info label="Current Status" value={selectedPR.status} />
            <Info label="Department" value={selectedPR.requesting_department} />
            <Info
              label="Required Delivery Date"
              value={new Date(
                selectedPR.required_delivery_date
              ).toLocaleDateString()}
            />
          </div>

          {/* Items Table */}
          <h2 className="text-lg font-bold mt-6">PR Details</h2>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">SlNo</th>
                  <th className="border px-2 py-1">Vendor</th>
                  <th className="border px-2 py-1">Item Name</th>
                  <th className="border px-2 py-1">Qty</th>
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
                      <td className="border px-2 py-1">
                        {vendor.vendor_name || "-"}
                      </td>
                      <td className="border px-2 py-1">{item.item_name}</td>
                      <td className="border px-2 py-1">
                        {item.quantity_required}
                      </td>
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
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Feasibility Comments */}
          <div>
            <h3 className="font-bold text-lg">Feasibility Comments</h3>
            <div className="border rounded p-3 bg-gray-50">
              {feasibilityComments.length === 0 ? (
                <p>No feasibility comments</p>
              ) : (
                feasibilityComments.map((c: any) => (
                  <p key={c.comment_id}>{c.comment}</p>
                ))
              )}
            </div>
          </div>

          {/* Feasibility Status */}
          <div>
            <h3 className="font-bold text-lg">Feasibility Status History</h3>
            <div className="border rounded p-3 bg-gray-50">
              {feasibilityStatusLogs.map((s: any, i: number) => (
                <p key={i}>{s.new_status}</p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 🔵 Read-only field component (unchanged)
const Info = ({ label, value }: any) => (
  <div>
    <label className="font-semibold">{label}</label>
    <input
      value={value || ""}
      readOnly
      className="w-full border p-1 rounded bg-gray-100"
    />
  </div>
);

export default ViewFeasibilityReq;
