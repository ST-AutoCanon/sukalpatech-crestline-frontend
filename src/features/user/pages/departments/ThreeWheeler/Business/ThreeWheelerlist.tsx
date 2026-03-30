// import { useEffect, useState } from "react";
// import { api } from "../../../api/businessApi";
// import ViewThreeWheeler from "./ViewThreeWheelerpage";

// interface Props {
//   refresh?: boolean;
//   filter?: string;
// }

// const ThreeWheelerList = ({ refresh, filter }: Props) => {

//   const [requests, setRequests] = useState<any[]>([]);

//   const fetchRequests = async () => {
//     try {

//       const token = localStorage.getItem("token");
//       let url = "/business-development/3w/list";

//       if (filter && filter !== "ALL") {
//         url += `?status=${filter}`;
//       }

//       const res = await api.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setRequests(res.data?.data?.data || []);

//     } catch (err) {
//       console.error("Error fetching 3W requests", err);
      
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, [refresh, filter]);

//   return (
//     <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       {requests.map((req) => (
//         <ViewThreeWheeler key={req.id} data={req} />
//       ))}
//     </div>
//   );
// };

// export default ThreeWheelerList;

import { useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ViewThreeWheeler from "./ViewThreeWheelerpage";

interface Props {
  refresh?: boolean;
  filter?: string; // "ALL", "PENDING", "REJECTED", "COMPLETED"
}

const ThreeWheelerList = ({ refresh, filter }: Props) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = "/business-development/3w/list";

      if (filter && filter !== "ALL") {
        url += `?status=${filter}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      setRequests(res.data?.data?.data || []);
    } catch (err) {
      console.error("Error fetching 3W requests", err);
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
      {requests.map((req,i) => (
        <ViewThreeWheeler key={req.id} data={req} cardIndex={i}  />
      ))}
    </div>
  );
};

export default ThreeWheelerList;