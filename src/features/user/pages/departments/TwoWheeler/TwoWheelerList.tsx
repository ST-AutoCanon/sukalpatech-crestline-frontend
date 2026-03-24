import { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";
import ViewTwoWheeler from "./ViewTwoWheelerpage";

interface Props {
  refresh?: boolean;
  filter?: string;
}

const TwoWheelerList = ({ refresh, filter }: Props) => {

  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {

      const token = localStorage.getItem("token");
      let url = "/business-development/2w/list";

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
      console.error("Error fetching 2W requests", err);
      
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refresh, filter]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {requests.map((req) => (
        <ViewTwoWheeler key={req.id} data={req} />
      ))}
    </div>
  );
};

export default TwoWheelerList;