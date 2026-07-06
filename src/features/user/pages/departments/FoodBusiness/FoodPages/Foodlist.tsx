// src/pages/businessDevFood/Foodlist.tsx
import { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ViewFood from "./ViewFoodpage";

interface Props {
  refresh?: boolean;
  filter?: string; // "ALL", "PENDING", "REJECTED", "COMPLETED"
}

const FoodList = ({ refresh, filter }: Props) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = "/business-development/food/list";

      // Append status filter if not ALL
      if (filter && filter !== "ALL") {
        url += `?status=${filter}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      // Access innermost data array
const dataArray = Array.isArray(res.data.data)
  ? res.data.data
  : res.data?.data?.data || [];

setRequests(dataArray);    } catch (err) {
      console.error("Error fetching food requests", err);
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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {requests
  .filter((req) => req && req.id)
  .map((req) => (
    <ViewFood
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

export default FoodList;