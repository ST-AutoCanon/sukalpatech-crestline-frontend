import { useEffect, useState } from "react";
import { api } from "../../../api/businessApi";
import BusinessCard from "./Viewbusiness";

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
   <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {requests.map((req) => (
    <BusinessCard key={req.id} data={req} />
  ))}
</div>

  );
};

export default BusinessList;
