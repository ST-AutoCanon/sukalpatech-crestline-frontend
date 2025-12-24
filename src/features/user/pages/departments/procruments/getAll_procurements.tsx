// import React, { useState, useContext } from "react";
// import { AuthContext } from "../../../../../context/AuthContext";
// import { useProcurement } from "../../../hooks/useProcurement";

// const AllPRs: React.FC = () => {
//   const { token } = useContext(AuthContext);

//   const { allPRs } = useProcurement(token);

//   const [selectedPR, setSelectedPR] = useState<any | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//   const openPRModal = (pr: any) => {
//     setSelectedPR(pr);
//     setModalOpen(true);
//   };

//   const closePRModal = () => {
//     setSelectedPR(null);
//     setModalOpen(false);
//   };

//   return (
//     <div className="p-5 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//         All Procurement Requests
//       </h1>

//       {/* PR Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {allPRs.map((pr) => (
//           <div
//             key={pr.pr_id}
//             className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
//             onClick={() => openPRModal(pr)}
//           >
//             <h2 className="font-semibold mb-1">{pr.pr_number}</h2>
//             <p>
//               <strong>Project:</strong> {pr.project_name}
//             </p>
//             <p>
//               <strong>Priority:</strong> {pr.priority}
//             </p>
//             <p>
//               <strong>Status:</strong> {pr.status}
//             </p>
//             <p>
//               <strong>Department:</strong> {pr.requesting_department}
//             </p>
//             <p>
//               <strong>Required Delivery:</strong>{" "}
//               {new Date(pr.required_delivery_date).toLocaleDateString()}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Modal for PR Details */}
//       {modalOpen && selectedPR && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
//           <div className="bg-white rounded shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
//             <button
//               onClick={closePRModal}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
//             >
//               ×
//             </button>

//             <h2 className="text-xl font-bold mb-4">{selectedPR.pr_number}</h2>

//             <p>
//               <strong>Project:</strong> {selectedPR.project_name}
//             </p>
//             <p>
//               <strong>Priority:</strong> {selectedPR.priority}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedPR.status}
//             </p>
//             <p>
//               <strong>Department:</strong> {selectedPR.requesting_department}
//             </p>
//             <p>
//               <strong>Required Delivery:</strong>{" "}
//               {new Date(selectedPR.required_delivery_date).toLocaleDateString()}
//             </p>
//             <p>
//               <strong>Remarks:</strong> {selectedPR.remarks}
//             </p>

//             {/* Items */}
//             <h3 className="font-semibold mt-4">Items</h3>
//             <ul className="list-disc ml-5">
//               {selectedPR.items.map((item: any) => (
//                 <li key={item.item_id}>
//                   {item.item_code} - {item.item_name} | Qty:{" "}
//                   {item.quantity_required} | Unit: {item.unit} | Rate:{" "}
//                   {item.expected_rate}
//                 </li>
//               ))}
//             </ul>

//             {/* Comments */}
//             <h3 className="font-semibold mt-4">Comments</h3>
//             <ul className="list-disc ml-5">
//               {selectedPR.comments.map((c: any) => (
//                 <li key={c.comment_id}>
//                   <strong>{c.department}:</strong> {c.comment}
//                 </li>
//               ))}
//             </ul>

//             {/* Status Log */}
//             <h3 className="font-semibold mt-4">Status Log</h3>
//             <ul className="list-disc ml-5">
//               {selectedPR.statusLogs && selectedPR.statusLogs.length > 0 ? (
//                 selectedPR.statusLogs.map((s: any) => (
//                   <li key={s.log_id}>
//                     <strong>{s.department}</strong> - {s.new_status} by{" "}
//                     {s.updated_by_person || s.updated_by} on{" "}
//                     {new Date(s.updated_at).toLocaleString()}
//                     {s.note && ` | Note: ${s.note}`}
//                   </li>
//                 ))
//               ) : (
//                 <li>No status updates yet</li>
//               )}
//             </ul>

//             {/* Vendors */}
//             <h3 className="font-semibold mt-4">Vendors</h3>
//             <ul className="list-disc ml-5">
//               {selectedPR.vendors.map((v: any) => (
//                 <li key={v.id}>{v.vendor_name}</li>
//               ))}
//             </ul>

//             {/* Attachments */}
//             <h3 className="font-semibold mt-4">Attachments</h3>
//             <ul className="list-disc ml-5">
//               {selectedPR.attachments.length > 0 ? (
//                 selectedPR.attachments.map((att: any) => (
//                   <li key={att.id}>
//                     <a
//                       href={`${BACKEND_URL}/${att.file_path}`}
//                       target="_blank"
//                       className="text-blue-600 underline"
//                     >
//                       {att.file_name}
//                     </a>
//                   </li>
//                 ))
//               ) : (
//                 <li>No attachments</li>
//               )}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllPRs;


import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { useProcurement } from "../../../hooks/useProcurement";

const statusColorMap: Record<string, string> = {
  Approved: "bg-green-500",
  Completed: "bg-green-500",
  Pending: "bg-orange-400",
  Draft: "bg-gray-400",
  Rejected: "bg-red-500",
};

const AllPRs: React.FC<{ statusFilter?: string }> = ({ statusFilter }) => {
  const { token } = useContext(AuthContext);
  const { allPRs } = useProcurement(token);

  const [selectedPR, setSelectedPR] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const filteredPRs =
    statusFilter && statusFilter !== "all"
      ? allPRs.filter(
          (pr: any) => pr.status?.toLowerCase() === statusFilter.toLowerCase()
        )
      : allPRs;

  const openPRModal = (pr: any) => {
    setSelectedPR(pr);
    setModalOpen(true);
  };

  const closePRModal = () => {
    setSelectedPR(null);
    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* PR Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPRs.map((pr: any) => (
          <div
            key={pr.pr_id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer p-5 relative"
            onClick={() => openPRModal(pr)}
          >
            {/* Status Dot */}
            <span
              className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                statusColorMap[pr.status] || "bg-gray-300"
              }`}
            />

            {/* PR Number */}
            <h2 className="text-purple-600 font-bold text-sm mb-3">
              {pr.pr_number}
            </h2>

            {/* Details */}
            <div className="space-y-1 text-sm text-gray-700">
              <p className="flex justify-between">
                <span className="text-gray-400">Project</span>
                <span>{pr.project_name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Priority</span>
                <span>{pr.priority}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span>{pr.status}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Department</span>
                <span>{pr.requesting_department}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Delivery Date</span>
                <span>
                  {new Date(pr.required_delivery_date).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* More Info */}
            <button className="mt-4 text-sm text-blue-600 hover:underline">
              More Info
            </button>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && selectedPR && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-16 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 lg:w-3/4 max-h-[85vh] overflow-y-auto p-6 relative">
            {/* Close Icon */}
            <button
              onClick={closePRModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-xl font-bold text-purple-600 mb-6">
              {selectedPR.pr_number}
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DETAILS */}
              <div className="border rounded-xl p-4">
                <h3 className="text-purple-600 font-semibold mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Project</span> :{" "}
                    {selectedPR.project_name}
                  </p>
                  <p>
                    <span className="text-gray-400">Priority</span> :{" "}
                    {selectedPR.priority}
                  </p>
                  <p>
                    <span className="text-gray-400">Status</span> :{" "}
                    {selectedPR.status}
                  </p>
                  <p>
                    <span className="text-gray-400">Department</span> :{" "}
                    {selectedPR.requesting_department}
                  </p>
                  <p>
                    <span className="text-gray-400">Delivery Date</span> :{" "}
                    {new Date(
                      selectedPR.required_delivery_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="border rounded-xl p-4">
                <h3 className="text-purple-600 font-semibold mb-3">Items</h3>
                <ul className="space-y-2 text-sm">
                  {selectedPR.items.map((item: any) => (
                    <li key={item.item_id}>
                      {item.item_code} - {item.item_name} | Qty:{" "}
                      {item.quantity_required} | Unit: {item.unit} | Rate:{" "}
                      {item.expected_rate}
                    </li>
                  ))}
                </ul>
              </div>

              {/* COMMENTS */}
              <div className="border rounded-xl p-4">
                <h3 className="text-purple-600 font-semibold mb-3">Comments</h3>
                <ul className="space-y-2 text-sm">
                  {selectedPR.comments.map((c: any) => (
                    <li key={c.comment_id}>
                      <strong>{c.department}</strong> : {c.comment}
                    </li>
                  ))}
                </ul>
              </div>

              {/* VENDORS */}
              <div className="border rounded-xl p-4">
                <h3 className="text-purple-600 font-semibold mb-3">Vendors</h3>
                <ul className="list-disc ml-5 text-sm">
                  {selectedPR.vendors.map((v: any) => (
                    <li key={v.id}>{v.vendor_name}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* STATUS LOG */}
            <div className="border rounded-xl p-4 mt-6">
              <h3 className="text-purple-600 font-semibold mb-3">Status Log</h3>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {selectedPR.statusLogs?.length ? (
                  selectedPR.statusLogs.map((s: any) => (
                    <li key={s.log_id}>
                      <strong>{s.department}</strong> – {s.new_status} by{" "}
                      {s.updated_by_person || s.updated_by} on{" "}
                      {new Date(s.updated_at).toLocaleString()}
                      {s.note && ` | Note: ${s.note}`}
                    </li>
                  ))
                ) : (
                  <li>No status updates yet</li>
                )}
              </ul>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end mt-6">
              <button
                onClick={closePRModal}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-sm"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPRs;
