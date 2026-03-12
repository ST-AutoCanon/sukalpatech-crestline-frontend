// src/pages/businessDevFood/FoodBusinessHome.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FoodBusinessPage from "./FoodBusiness"; // Modal component

interface FoodBusiness {
  id: number;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  project_title: string;
  expected_quantity: string;
  estimated_budget: string;
  packaging_type: string;
  status: string;
}

const FoodBusinessHome = () => {
  const [showModal, setShowModal] = useState(false);
  const [businesses, setBusinesses] = useState<FoodBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All PR");
  const navigate = useNavigate();

  const filters = ["All PR", "Pending", "Rejected", "Completed"];

  // Fetch Food businesses
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/business-development/food/list`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const businessesArray = res.data?.data?.data || [];
      setBusinesses(businessesArray);
    } catch (err) {
      console.error("Fetch Food Businesses Error:", err);
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

  const filteredBusinesses = businesses.filter((b) => activeFilter === "All PR" || b.status === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 mt-3">
        <button className="px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap bg-white text-purple-700 shadow">
          Food Business Requests
        </button>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap">
            + Create Request
          </button>
          <button onClick={() => navigate("/bd-food/updated")} className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap">
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
            className={`pb-1 px-2 sm:px-4 ${activeFilter === filter ? "border-b-2 border-white text-white" : "text-white/70"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* BUSINESS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.length === 0 && !loading && <p className="text-white col-span-full">No business requests found.</p>}
        {filteredBusinesses.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-1">{b.company_name}</h3>
            <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Contact Person:</span> {b.contact_person}</p>
            <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Email:</span> {b.email}</p>
            <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Project Title:</span> {b.project_title}</p>
            <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Expected Quantity:</span> {b.expected_quantity}</p>
            <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Estimated Budget:</span> {b.estimated_budget}</p>
            <p className="text-gray-600 text-sm mb-1"><span className="font-medium">Packaging Type:</span> {b.packaging_type}</p>
            <p className="text-gray-600 text-sm"><span className="font-medium">Status:</span> {b.status}</p>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-start bg-black/30 p-4 overflow-auto">
          <div className="w-full max-w-3xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black">
              ×
            </button>

            <FoodBusinessPage
              onClose={() => setShowModal(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodBusinessHome;