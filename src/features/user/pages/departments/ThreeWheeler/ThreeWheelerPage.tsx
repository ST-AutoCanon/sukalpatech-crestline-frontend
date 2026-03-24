
import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../../../components/Aleartmessage";
import { useNavigate } from "react-router-dom";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};


interface ThreeWheelerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}


const ThreeWheelerPage: React.FC<ThreeWheelerModalProps> = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    project_title: "",
    expected_quantity: "",
    estimated_budget: "",
    vehicle_model: "",
    engine_capacity: "",
    fuel_type: "",
    load_capacity: "",
    business_status: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("Please login first!");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.company_name || !formData.contact_person || !formData.phone) {
      setAlert({ type: "error", message: "Please fill all required fields." });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        industry_type: "3W",
      };

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5004/api/business-development/3w/create",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setAlert({ type: "success", message: "3W Business Created ✅" });

        setFormData({
          company_name: "",
          contact_person: "",
          phone: "",
          email: "",
          project_title: "",
          expected_quantity: "",
          estimated_budget: "",
          vehicle_model: "",
          engine_capacity: "",
          fuel_type: "",
          load_capacity: "",
          business_status: "",
          comment: "",
        });
        // Close modal after 1.5 seconds
        setTimeout(() => {
          setAlert(null);
          onSuccess(); // trigger parent refresh
          onClose();   // close modal
        }, 1500);
      } else {
        setAlert({ type: "error", message: res.data.message || "Failed to save" });
      }
    } catch (error: any) {
      console.error("API ERROR:", error);
      setAlert({ type: "error", message: error.response?.data?.message || "Server Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 lg:p-8">
        <div className="flex-1 w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              3 Wheeler Business Development
            </h2>

            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Fill in the project and vehicle details to create a new 3W business development record.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 mt-3">

              {/* Company Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  required
                />

                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Contact Person"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  required
                />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <input
                  type="text"
                  name="project_title"
                  value={formData.project_title}
                  onChange={handleChange}
                  placeholder="Project Title"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

                <input
                  type="text"
                  name="expected_quantity"
                  value={formData.expected_quantity}
                  onChange={handleChange}
                  placeholder="Expected Quantity"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

                <input
                  type="text"
                  name="estimated_budget"
                  value={formData.estimated_budget}
                  onChange={handleChange}
                  placeholder="Estimated Budget"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              {/* Vehicle Details */}
              <h3 className="text-md sm:text-lg font-semibold text-gray-800 mt-4">
                Vehicle Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <input
                  type="text"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  placeholder="Vehicle Model"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

                <input
                  type="text"
                  name="engine_capacity"
                  value={formData.engine_capacity}
                  onChange={handleChange}
                  placeholder="Engine Capacity"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

                <input
                  type="text"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  placeholder="Fuel Type"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

                <input
                  type="text"
                  name="load_capacity"
                  value={formData.load_capacity}
                  onChange={handleChange}
                  placeholder="Load Capacity"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

              </div>

              <h3 className="text-md sm:text-lg font-semibold text-gray-800 mt-4">
                Business Review
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <select
                  name="business_status"
                  value={formData.business_status}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Status</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>

                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Comment"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Creating Business..." : "Save"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreeWheelerPage;