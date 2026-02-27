import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../../../components/Aleartmessage";

type Organisation = {
  id: number;
  name: string;
  org_code: string;
};

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

const DeleteOrganisation = () => {
  const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch Organisations
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axios.get<ApiResponse<Organisation[]>>(
          `${ADMIN_API_BASE}/organisations-admin`,
          { withCredentials: true },
        );
        if (res.data.success) setOrganisations(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch organisations");
      }
    };
    fetchOrgs();
  }, []);

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedOrgId) {
      setAlert({
        type: "error",
        message: "Please select an organisation to delete",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this organisation?"))
      return;

    try {
      setLoading(true);

      const res = await axios.delete<ApiResponse>(
        `${ADMIN_API_BASE}/organisations-admin/${selectedOrgId}`,
        { withCredentials: true },
      );

      setAlert({
        type: res.data.success ? "success" : "error",
        message:
          res.data.message ||
          (res.data.success
            ? "Organisation deleted successfully 🎉"
            : "Delete failed"),
      });

      if (res.data.success) {
        // Remove deleted org from dropdown
        setOrganisations((prev) =>
          prev.filter((org) => org.id !== selectedOrgId),
        );
        setSelectedOrgId(null);
        setTimeout(() => setAlert(null), 4000);
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message || "Server error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 lg:p-8">
        <div className="flex-1 w-full max-w-4xl mx-auto">
          <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              Delete Organisation
            </h2>

            <div className="space-y-6">
              {/* Select Organisation */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Select Organisation
                </label>
                <select
                  className="w-full border rounded-xl px-4 py-3 text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                  value={selectedOrgId ?? ""}
                  onChange={(e) => setSelectedOrgId(Number(e.target.value))}
                >
                  <option value="">-- Select --</option>
                  {organisations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.org_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                disabled={!selectedOrgId || loading}
                onClick={handleDelete}
                className="w-full rounded-xl bg-red-600 text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Organisation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteOrganisation;
