import { useState, useEffect } from "react";
import { api } from "../../../../api/businessApi";
import AleartMessage from "../../../../components/Aleartmessage";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TwoWheelerPage({ onClose, onSuccess }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [alertData, setAlertData] = useState<any>(null);


  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    project_title: "",
    required_date: "",
    description: "",
    expected_quantity: "",
    estimated_budget: "",
    vehicle_model: "",
    motor_capacity: "",
    battery_type: "",
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
    setAlert(null);
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
      const payload = { ...formData, industry_type: "2W" };
      let res;

      if (editId) {
        res = await api.put(`/business-development/2w/${editId}`, payload);
      } else {
        res = await api.post(`/business-development/2w/create`, payload);
      }

      if (res.data.success) {
        setAlert({ type: "success", message: editId ? "Updated ✅" : "2W Business Created ✅" });
        setFormData({
          company_name: "",
          contact_person: "",
          phone: "",
          email: "",
          project_title: "",
          required_date: "",
          description: "",
          expected_quantity: "",
          estimated_budget: "",
          vehicle_model: "",
          motor_capacity: "",
          battery_type: "",
          business_status: "",
          comment: "",
        });
        setEditId(null);
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.response?.data?.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alert && (
        <AleartMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg relative max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
            <h2 className="text-xl font-semibold text-purple-600">
              New 2W Business Request
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
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Company Name
                  </label>
                  <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Contact Person
                  </label>
                  <input
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="Enter contact Person"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone Number"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    className="bg-white border rounded-lg h-11 px-3"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ================= PROJECT DETAILS ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Project Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Project Title
                  </label>
                  <input
                    name="project_title"
                    value={formData.project_title}
                    onChange={handleChange}
                    placeholder="Project Title"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Required Date
                  </label>
                  <input
                    type="date"
                    name="required_date"
                    value={formData.required_date}
                    onChange={handleChange}
                    placeholder="required date"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Expected Quantity
                  </label>
                  <input
                    name="expected_quantity"
                    value={formData.expected_quantity}
                    onChange={handleChange}
                    placeholder="Expected quantity"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Estimated Budget
                  </label>
                  <input
                    name="estimated_budget"
                    value={formData.estimated_budget}
                    onChange={handleChange}
                    placeholder="Estimated budget"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

              </div>
            </div>

            {/* ================= VEHICLE DETAILS ================= */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Vehicle Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Vehicle Model
                  </label>
                  <input
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    placeholder="Vehicle modal"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Motor Capacity
                  </label>
                  <input
                    name="motor_capacity"
                    value={formData.motor_capacity}
                    onChange={handleChange}
                    placeholder="motor capacity"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Battery Type
                  </label>
                  <input
                    name="battery_type"
                    value={formData.battery_type}
                    onChange={handleChange}
                    placeholder="battery type"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>
              </div>
            </div>

            {/* Wrap the button in a sticky container at the bottom of the modal */}
            <div className="sticky bottom-0 bg-white p-4  flex justify-end z-10">
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md"
              >
                {loading ? "Saving..." : "Submit for Feasibility"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}