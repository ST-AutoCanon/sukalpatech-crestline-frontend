import { useState, useEffect } from "react";
import { api } from "../../../../api/businessApi";
import Alert from "../../../../components/Aleartmessage";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ThreeWheelerPage({ onClose, onSuccess }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState<any>(null);
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

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setAlertData(null);

    const token = localStorage.getItem("token");
    // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.email.trim()) {
    setAlertData({
      type: "error",
      message: "Email is required.",
    });
    return;
  }

  if (!emailRegex.test(formData.email)) {
    setAlertData({
      type: "error",
      message: "Please enter a valid email address.",
    });
    return;
  }

    try {
      setLoading(true);
      const payload = { ...formData, industry_type: "3W" };

     const res = await api.post(
  `/business-development/3w/create`,
  payload
);

      if (res.data.success) {
        setAlertData({ type: "success", message: "3W Business Created ✅" });
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

        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setAlertData({ type: "error", message: err.response?.data?.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alertData && (
        <Alert
          type={alertData.type}
          message={alertData.message}
          onClose={() => setAlertData(null)}
        />
      )}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg relative max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
            <h2 className="text-xl font-semibold text-purple-600">
              New 3W Business Request
            </h2>
            <button
              onClick={onClose}
              className="text-xl font-bold hover:text-red-600"
            >
              ×
            </button>
          </div>


          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* ================= BUSINESS DETAILS ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Business Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" className="bg-white border rounded-lg p-2" />
                <input name="contact_person" value={formData.contact_person} onChange={handleChange} placeholder="Contact Person" className="bg-white border rounded-lg p-2" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="bg-white border rounded-lg p-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="bg-white border rounded-lg p-2"
                  required
                />              </div>
            </div>

            {/* ================= PROJECT DETAILS ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Project Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="project_title" value={formData.project_title} onChange={handleChange} placeholder="Project Title" className="bg-white border rounded-lg p-2" />
                <input name="expected_quantity" value={formData.expected_quantity} onChange={handleChange} placeholder="Expected Quantity" className="bg-white border rounded-lg p-2" />
                <input name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} placeholder="Estimated Budget" className="bg-white border rounded-lg p-2" />
              </div>
            </div>

            {/* ================= VEHICLE DETAILS ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} placeholder="Vehicle Model" className="bg-white border rounded-lg p-2" />
                <input name="engine_capacity" value={formData.engine_capacity} onChange={handleChange} placeholder="Engine Capacity" className="bg-white border rounded-lg p-2" />
                <input name="fuel_type" value={formData.fuel_type} onChange={handleChange} placeholder="Fuel Type" className="bg-white border rounded-lg p-2" />
                <input name="load_capacity" value={formData.load_capacity} onChange={handleChange} placeholder="Load Capacity" className="bg-white border rounded-lg p-2" />
              </div>
            </div>

            {/* ================= BUSINESS REVIEW ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Business Review</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="business_status" value={formData.business_status} onChange={handleChange} className="bg-white border rounded-lg p-2">
                  <option value="">Select Status</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <textarea name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" className="bg-white border rounded-lg p-2" />
              </div>
            </div>

            {/* ================= SUBMIT ================= */}
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold">
                {loading ? "Saving..." : "Submit for Feasibility"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}