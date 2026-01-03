// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../../../../../context/AuthContext";

// const AllVendors: React.FC = () => {
//   const { token } = useContext(AuthContext);
//   const [vendors, setVendors] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5001/api/new-procurement/vendors",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setVendors(res.data?.data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchVendors();
//   }, [token]);

//   return (
//     <div className="p-10 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">All Vendors</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {vendors.map((v) => (
//           <div key={v.vendor_id} className="p-4 border rounded shadow">
//             <h2 className="font-semibold">{v.vendor_name}</h2>
//             <p>Contact: {v.contact_person}</p>
//             <p>Phone: {v.phone}</p>
//             <p>Email: {v.email}</p>
//             <p>GST: {v.gst_number}</p>
//             <p>PAN: {v.pan_number}</p>
//             <p>Rating: {v.rating}</p>
//             <p>Status: {v.status}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllVendors;



import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../../context/AuthContext";

const AllVendors: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/new-procurement/vendors",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVendors(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVendors();
  }, [token]);

  return (
    <div className="px-8 py-6">
      {/* VENDOR GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendors.map((v) => (
          <div
            key={v.vendor_id}
            className="relative bg-white rounded-2xl shadow-md p-5"
          >
            {/* VENDOR NAME */}
            <h3 className="text-purple-600 font-semibold text-lg mb-4">
              {v.vendor_name}
            </h3>

            {/* DETAILS */}
            <div className="space-y-2 text-sm">
              <Row label="Contact" value={v.contact_person} />
              <Row label="Phone" value={v.phone} />
              <Row label="Email" value={v.email} />
              <Row label="GST" value={v.gst_number} />
              <Row label="PAN" value={v.pan_number} />
              <Row label="Rating" value={v.rating} />
              <Row label="Status" value={v.status} />
            </div>

            {/* MORE INFO */}
            <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
              More Info
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVendors;

/* ---------- Helper Row ---------- */
const Row = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex text-gray-700">
    <span className="w-20 text-gray-400">{label}</span>
    <span className="font-medium truncate">{value || "-"}</span>
  </div>
);
