import { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";
import BusinessCard from "../Businessdevelopment/Viewbusiness";

const BusinessList = () => {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const res = await api.get("/business-development");
    setRequests(res.data.data); // ✅ THIS
  };


  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      {requests.map((req) => (
        <BusinessCard key={req.id} data={req} />
      ))}
    </div>
  );
};

export default BusinessList;
