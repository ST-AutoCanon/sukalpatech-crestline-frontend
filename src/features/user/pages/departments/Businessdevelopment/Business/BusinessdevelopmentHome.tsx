// import { useState } from "react";
// import BusinessList from "./Businessdevelopmentpage";
// import CreateBusinessModal from "./CreateBusinessPage";
// import { useNavigate, useLocation } from "react-router-dom";


// const BusinessDevelopmentHome = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [refreshList, setRefreshList] = useState(false);
//   const navigate = useNavigate();
//   const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");

//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const type = queryParams.get("type"); // "updated" or null



//   const handleModalSuccess = () => {
//     setRefreshList((prev) => !prev); // toggle to refresh BusinessList
//   };

//   const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
//   type FilterType = (typeof filters)[number];


//   return (
//     <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c]  p-4 sm:p-6 font-sans">


//       {/* HEADER BAR */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 mt-3">

//         {/* LEFT BUTTON */}
//         <button
//           className="
//     px-4 sm:px-5
//     py-2
//     rounded-full
//     font-medium
//     text-sm sm:text-base
//     whitespace-nowrap
//     transition
//     bg-white text-purple-700 shadow
//   "
//         >
//           Business Requests
//         </button>


//         {/* RIGHT BUTTONS */}
//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

//           {/* CREATE */}
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap"

//           >
//             + Create Request
//           </button>

//           {/* UPDATE */}
//           <button
//             onClick={() => navigate("/employee/bd?type=updated")} // absolute path
//             className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap"
//           >
//             Update Request
//           </button>

//         </div>
//       </div>
//       <div className="flex overflow-x-auto gap-3 sm:gap-1 text-sm font-medium text-white w-full sm:w-auto mt-10 mb-6">
//         {filters.map((filter) => (
//           <button
//             key={filter}
//             onClick={() => {
//               setActiveFilter(filter);

//               // ✅ CLEAR updated mode when switching filters
//               navigate("/employee/bd");
//             }}
//             className={` pb-1 px-2 sm:px-4  ${activeFilter === filter
//               ? "border-b-2 border-white text-white"
//               : "text-white/70 "
//               }`}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>




//       {/* BUSINESS LIST */}
//       <BusinessList
//         refresh={refreshList}
//         filter={
//           activeFilter === "All PR"
//             ? "ALL"
//             : activeFilter.toUpperCase()
//         }
//         type={type}   // ✅ ADD THIS
//       />

//       {/* MODAL */}
//       <div
//         className={`fixed inset-0 z-50 bg-black/50 flex justify-center items-start sm:items-center p-2 sm:p-4 overflow-y-auto ${showModal ? "block" : "hidden"
//           }`}
//       >
//         <div className="bg-white rounded-xl w-full max-w-5xl p-4 sm:p-6 relative shadow-xl">
//           <button
//             onClick={() => setShowModal(false)}
//             className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
//           >
//             ×
//           </button>

//           <CreateBusinessModal
//             onClose={() => setShowModal(false)}
//             onSuccess={() => {
//               handleModalSuccess();
//               setShowModal(false);
//             }}
//           />
//         </div>
//       </div>
//     </div>

//   )
// };

// export default BusinessDevelopmentHome;

import { useState } from "react";
import BusinessList from "./Businessdevelopmentpage";
import CreateBusinessModal from "./CreateBusinessPage";
import { useNavigate } from "react-router-dom";


const BusinessDevelopmentHome = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");
  const [showUpdatePage, setShowUpdatePage] = useState(false);




  const handleModalSuccess = () => {
    setRefreshList((prev) => !prev); // toggle to refresh BusinessList
  };

  const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
  type FilterType = (typeof filters)[number];


  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c]  p-4 sm:p-6 font-sans">


      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 mt-3">

        {/* LEFT BUTTON */}
        <button
          className="
    px-4 sm:px-5
    py-2
    rounded-full
    font-medium
    text-sm sm:text-base
    whitespace-nowrap
    transition
    bg-white text-purple-700 shadow
  "
        >
          Business Requests
        </button>


        {/* RIGHT BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

          {/* CREATE */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap"

          >
            + Create Request
          </button>

          {/* UPDATE */}
          <button
            onClick={() => navigate("/employee/bd/updated")} // absolute path
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap"
          >
            Update Request
          </button>

        </div>
      </div>
      <div className="flex overflow-x-auto gap-3 sm:gap-1 text-sm font-medium text-white w-full sm:w-auto mt-10 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setShowUpdatePage(false);
            }}
            className={` pb-1 px-2 sm:px-4  ${activeFilter === filter
              ? "border-b-2 border-white text-white"
              : "text-white/70 "
              }`}
          >
            {filter}
          </button>
        ))}
      </div>




      {/* BUSINESS LIST */}
      <BusinessList
        refresh={refreshList}
        filter={
          activeFilter === "All PR"
            ? "ALL"
            : activeFilter.toUpperCase()
        }
      />

      {/* MODAL */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 flex justify-center items-start sm:items-center p-2 sm:p-4 overflow-y-auto ${showModal ? "block" : "hidden"
          }`}
      >
        <div className="bg-white rounded-xl w-full max-w-5xl p-4 sm:p-6 relative shadow-xl">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>

          <CreateBusinessModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              handleModalSuccess();
              setShowModal(false);
            }}
          />
        </div>
      </div>
    </div>

  )
};

export default BusinessDevelopmentHome;
