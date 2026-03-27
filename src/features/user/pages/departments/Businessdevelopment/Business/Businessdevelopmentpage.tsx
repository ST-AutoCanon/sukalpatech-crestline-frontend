import { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import BusinessCard from "./Viewbusiness";

interface BusinessListProps {
  refresh?: boolean;
  filter?: string;
}

const BusinessList = ({ refresh, filter }: BusinessListProps) => {
  const [requests, setRequests] = useState<any[]>([]);

  // const fetchRequests = async () => {
  //   try {
  //     let url = "/business-development";

  //     // ✅ send filter to backend
  //     if (filter && filter !== "ALL") {
  //       url += `?status=${filter}`;
  //     }

  //     const res = await api.get(url);

  //     setRequests(res.data.data);
  //   } catch (error) {
  //     console.error("Error fetching requests:", error);
  //   }
  // };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Selected Filter:", filter);

      let url = "/business-development";

      // 🔥 Map COMPLETED → APPROVED
      let statusToSend = filter;

      if (filter === "COMPLETED") {
        statusToSend = "APPROVED";
      }
      if (statusToSend && statusToSend !== "ALL") {
        url += `?status=${statusToSend}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(res.data.data);

    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, [refresh, filter]); // ✅ VERY IMPORTANT

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {requests.map((req, index) => (
        <BusinessCard
          key={req.id}
          data={req}
          cardIndex={index} // ✅ passed here
          onUpdate={(updated) => {
            setRequests((prev) =>
              prev.map((r) => (r.id === updated.id ? updated : r))
            );
          }}
        />
      ))}
    </div>
  );
};

export default BusinessList;
