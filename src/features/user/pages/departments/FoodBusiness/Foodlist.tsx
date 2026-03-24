import { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";
import ViewFood from "./ViewFoodpage";

interface Props {
  refresh?: boolean;
  filter?: string;
}

const FoodList = ({ refresh, filter }: Props) => {

  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {

      const token = localStorage.getItem("token");
      let url = "/business-development/food/list";

      if (filter && filter !== "ALL") {
        url += `?status=${filter}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(res.data?.data?.data || []);

    } catch (err) {
      console.error("Error fetching food requests", err);
      
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refresh, filter]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {requests.map((req) => (
        <ViewFood key={req.id} data={req} />
      ))}
    </div>
  );
};

export default FoodList