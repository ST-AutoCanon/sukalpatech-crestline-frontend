// ViewPRPage.tsx
import { useEffect, useState } from "react";
import Aleart from "../../../components/Aleartmessage";
import ViewPRModal, { PR } from "./ViewPRModal";
import EditPRModal from "./EditPRModal";

type Props = {
  filter: string;
  search: string;
  refreshKey: number;
};

export default function ViewPRPage({ filter, search, refreshKey }: Props) {
  const [prs, setPrs] = useState<PR[]>([]);
  const [viewPR, setViewPR] = useState<PR | null>(null);
  const [editPR, setEditPR] = useState<PR | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorMap, setVendorMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>(
    {},
  );
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const getLatestStatus = (pr: PR) => {
    const statuses = pr.department_statuses || [];
    return (
      statuses[statuses.length - 1]?.department_status?.toUpperCase() || ""
    );
  };

  const normalizeDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isEditable = (pr: PR) => {
    const statuses = pr.department_statuses || [];
    if (statuses.length === 0) return true;
    const latestStatus =
      statuses[statuses.length - 1]?.department_status?.toUpperCase().trim() ||
      "";
    return latestStatus.includes("CREATED") || latestStatus.includes("PENDING");
  };

  // ─── Fetches ───────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/vendors`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const vendors = data?.data || [];
        const map: Record<string, string> = {};
        vendors.forEach((v: any) => {
          map[String(v.vendor_id)] = v.vendor_name;
        });
        setVendorMap(map);
      })
      .catch((err) => console.error("Vendor fetch error", err));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const departments = data?.data || [];
        const map: Record<string, string> = {};
        departments.forEach((d: any) => {
          map[String(d.department_id)] = d.name;
        });
        setDepartmentMap(map);
      })
      .catch((err) => console.error("Department fetch error", err));
  }, []);

  const fetchPRs = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests`;

      if (filter === "Pending" || filter === "Rejected") {
        const status = filter.toUpperCase();
        url = `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/prs/status/${status}`;
      }

      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();

      const prsData = (data?.data || []).map((pr: PR) => {
        const deptEntry = Object.entries(departmentMap).find(
          ([_, name]) => name === pr.department,
        );
        return {
          ...pr,
          department: deptEntry ? deptEntry[0] : String(pr.department),
          items: pr.items || [],
          department_statuses: pr.department_statuses || [],
        };
      });

      const filteredPRs = prsData.filter((pr: PR) => {
        const latestStatus = getLatestStatus(pr);
        if (filter === "Pending") return latestStatus.includes("PENDING");
        if (filter === "Rejected") return latestStatus.includes("REJECTED");
        if (filter === "Completed") {
          const paymentStage =
            pr.finance_payment_details?.payment_stage?.toLowerCase() || "";

          const quantityStatus =
            pr.store_receiving_details?.quantity_status?.toUpperCase() || "";

          return paymentStage === "final" && quantityStatus === "FULL";
        }


        return true;
      });
      // ✅ FIX DUPLICATES HERE
      const uniquePRs = Array.from(
        new Map(filteredPRs.map((pr) => [String(pr.id), pr])).values()
      );

      setPrs(uniquePRs);

    } catch (err) {
      console.error("Fetch PR error", err);
      setPrs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(departmentMap).length > 0) {
      fetchPRs();
    }
  }, [filter, search, refreshKey, departmentMap]);

  // ─── Save PR ───────────────────────────────────────────────────────────────

  const savePR = async (pr: PR) => {
    const token = localStorage.getItem("token");

    const fullRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/full/${pr.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(pr),
      },
    );

    if (!fullRes.ok) {
      const errorData = await fullRes.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData?.message || "Full PR Save failed");
    }

    const updatedFullPR = await fullRes.json();

    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/${pr.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: pr.description,
          priority: pr.priority,
          required_date: pr.required_date,
          remarks: pr.remarks,
          department: pr.department,
        }),
      },
    );

    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/purchase-requests/${pr.id}/items`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: pr.items.map((item) => ({
            id: item.id,
            item_code: item.item_code,
            item_name: item.item_name,
            quantity_required: item.quantity_required,
          })),
        }),
      },
    );

    for (const item of pr.items) {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/items/${item.id}/vendors`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendors: item.vendors.map((vendor) => ({
              id: vendor.id,
              vendor_id: vendor.vendor_id,
              status: vendor.status,
              unit_price: vendor.unit_price,
              total_price: vendor.total_price,
              quotation_validity_date: vendor.quotation_validity_date,
            })),
          }),
        },
      );

      for (const vendor of item.vendors) {
        const attachment = vendor.attachments?.[0];
        if (!attachment || !attachment.fileObject) continue;

        const formData = new FormData();
        formData.append("file", attachment.fileObject);

        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/new-procurement/vendors/${vendor.id}/attachments`,
            {
              method: "PUT",
              credentials: "include",
              body: formData,
            },
          );
          if (!res.ok) throw new Error(`Upload failed for vendor ${vendor.id}`);
          attachment.fileObject = null;
        } catch (err) {
          console.error("Attachment upload error:", err);
        }
      }
    }

    return updatedFullPR;
  };

  const handleSave = async (pr: PR) => {
    try {
      await savePR(pr);
      setEditPR(null);
      fetchPRs();
      setAlert({ type: "success", message: "PR updated successfully!" });
    } catch (err) {
      console.error("Save failed", err);
      setAlert({ type: "error", message: "Failed to update PR." });
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) return <div className="p-6">Loading PRs...</div>;

  return (
    <>
      {alert && (
        <Aleart
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* PR Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prs.map((pr) => {
          const latestStatusObj =
            pr.department_statuses?.[pr.department_statuses.length - 1];
          const status = latestStatusObj?.department_status || "Draft";

          return (
            <div
              key={pr.id}
              className="relative bg-white rounded-xl p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
              onClick={() =>
                setViewPR({
                  ...pr,
                  required_date: pr.required_date
                    ? pr.required_date.split("T")[0]
                    : "",
                })
              }
            >
              <h3 className="text-purple-600 font-semibold text-lg mb-2 truncate">
                PR ID: {pr.id}
              </h3>

              <div className="space-y-1 text-sm flex-1">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400 shrink-0">Description</span>
                  <span className="font-medium text-gray-700 max-w-[65%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {pr.description || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className="font-medium text-gray-700">
                    {pr.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium text-gray-700 truncate">
                    {departmentMap[String(pr.department)] ?? pr.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Date</span>
                  <span className="font-medium text-gray-700">
                    {pr.required_date
                      ? new Date(pr.required_date).toLocaleDateString("en-US")
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-4">
                {/* More Info */}
                <button
                  className="text-sm font-semibold text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewPR({
                      ...pr,
                      required_date: normalizeDate(pr.required_date),
                    });
                  }}
                >
                  More Info
                </button>

                {/* Edit (only when applicable) */}
                {(filter === "PR Raised" || filter === "Pending") &&
                  isEditable(pr) && (
                    <button
                      className="text-sm font-semibold text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditPR({
                          ...pr,
                          department: pr.department
                            ? String(pr.department)
                            : "",
                          required_date: normalizeDate(pr.required_date),
                        });
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

      {/* View Modal */}
      {viewPR && !editPR && (
        <ViewPRModal
          pr={viewPR}
          vendorMap={vendorMap}
          departmentMap={departmentMap}
          onClose={() => setViewPR(null)}
        />
      )}

      {/* Edit Modal */}
      {editPR && (
        <EditPRModal
          pr={editPR}
          vendorMap={vendorMap}
          departmentMap={departmentMap}
          onClose={() => setEditPR(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
