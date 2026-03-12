import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TwoWheelerPage from "./TwoWheelerPage";

const TwoWheelerHome = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const filters = ["All PR", "Pending", "Rejected", "Completed"];
  const [activeFilter, setActiveFilter] = useState("All PR");

  // Fetch 2W businesses
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/business-development/2w/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // FIX: nested data array
      setBusinesses(res.data?.data?.data || []);
    } catch (err) {
      console.error("Error fetching 2W businesses:", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBusinesses();
  }, [refreshList]);

  const handleSuccess = () => {
    setRefreshList((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 font-sans">

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

          {/* UPDATE (optional if you have 2W update page) */}
          <button
            onClick={() => navigate("/bd2/2w/updated")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap"
          >
            Update Request
          </button>

        </div>
      </div>

      {/* FILTERS */}
      <div className="flex overflow-x-auto gap-3 sm:gap-1 text-sm font-medium text-white w-full sm:w-auto mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`pb-1 px-2 sm:px-4 ${activeFilter === filter
              ? "border-b-2 border-white text-white"
              : "text-white/70"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>
      {/* BUSINESS LIST - CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.length === 0 ? (
          <p className="text-white col-span-full">No business requests found.</p>
        ) : (
          businesses.map((b: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-1">{b.company_name}</h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Contact person:</span> {b.contact_person} 
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Email:</span> {b.email}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Vehicle:</span> {b.vehicle_model} 
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Battery:</span> {b.battery_type}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Status:</span> {b.status}
              </p>
            </div>
          ))
        )}
      </div>


      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-start bg-black/30 p-4 overflow-auto">
          <div className="w-full max-w-3xl relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>

            {/* 2W Form */}
            <TwoWheelerPage
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false); // close modal
                setRefreshList(prev => !prev); // refresh list
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoWheelerHome;