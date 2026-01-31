import { useState } from "react";
import BusinessList from "../Businessdevelopment/Businessdevelopmentpage";
import CreateBusinessModal from "../Businessdevelopment/updatebusiness";
import { useNavigate } from "react-router-dom";


const BusinessDevelopmentHome = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c]  p-4 sm:p-6 font-sans">


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



      {/* BUSINESS LIST */}
      <BusinessList />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start sm:items-center p-2 sm:p-4 overflow-y-auto">
          <div
            className="
              bg-white
              rounded-xl
              w-full
              max-w-5xl
              p-4 sm:p-6
              relative
              shadow-xl
            "
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>

            <CreateBusinessModal onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDevelopmentHome;
