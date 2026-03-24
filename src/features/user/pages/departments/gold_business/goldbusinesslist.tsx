import { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";
import ViewGold from "./viewgoldbusiness";

interface Props {
  refresh?: boolean;
  filter?: string;
}

const GoldList = ({ refresh, filter }: Props) => {

  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {

      const token = localStorage.getItem("token");
      let url = "/business-development/gold/list";

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
        <ViewGold key={req.id} data={req} />
      ))}
    </div>
  );
};

export default GoldList