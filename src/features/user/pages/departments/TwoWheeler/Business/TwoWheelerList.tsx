import { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ViewTwoWheeler from "./ViewTwoWheelerpage";

interface Props {
  refresh?: boolean;
  filter?: string; // "ALL", "PENDING", "REJECTED", "COMPLETED"
  isUpdated?: boolean; // ✅ NEW
}

const TwoWheelerList = ({ refresh, filter }: Props) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
  try {
    setLoading(true);

    const res = await api.get(
      `/business-development/2w/list${filter && filter !== "ALL" ? `?status=${filter}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const list = res.data?.data;

    setRequests(Array.isArray(list) ? list : []);
  } catch (err) {
    console.error("Error fetching 2W requests", err);
    setRequests([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRequests();
  }, [refresh, filter]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!requests.length) return <div className="text-white">No requests found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {requests.map((req) => (
  <ViewTwoWheeler
    key={req.id}
    data={req}
    onUpdate={(updated) => {
      setRequests((prev) =>
        prev.map((item) =>
          item.id === updated.id ? updated : item
        )
      );
    }}
  />
))}
    </div>
  );
};

export default TwoWheelerList;