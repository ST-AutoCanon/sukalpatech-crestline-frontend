import { useState } from "react";
import BusinessList from "../Businessdevelopment/Businessdevelopmentpage";
import CreateBusinessModal from "../Businessdevelopment/updatebusiness";
import { useNavigate } from "react-router-dom";


const BusinessDevelopmentHome = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 font-sans">
      {/* PAGE TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold mb-6">
        Business Development
      </h1>

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 mt-3">

        {/* LEFT BUTTON */}
        <button
          className="
      w-full sm:w-auto
      px-4 py-2.5
      rounded-lg
      bg-purple-700
      text-white
      font-semibold
      text-sm
    "
        >
          All Business Requests
        </button>

        {/* RIGHT BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

          {/* CREATE */}
          <button
            onClick={() => setShowModal(true)}
            className="
        w-full sm:w-auto
        px-4 py-2.5
        rounded-lg
        bg-gradient-to-r from-purple-500 to-purple-700
        text-white
        font-bold
        text-sm
      "
          >
            + Create Request
          </button>

          {/* UPDATE */}
          <button
            onClick={() => navigate("/employee/bd/updated")} // absolute path
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-purple-500 text-white font-semibold text-sm"
          >
            Update Request
          </button>

        </div>
      </div>



      {/* BUSINESS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <BusinessList />
      </div>

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
