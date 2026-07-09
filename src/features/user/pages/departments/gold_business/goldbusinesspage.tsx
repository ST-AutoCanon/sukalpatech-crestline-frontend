import { useState, useEffect } from "react";
import { api } from "../../../api/businessApi";
import Alert from "../../../components/Aleartmessage";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoldBusinessPage({ onClose, onSuccess }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    business_type: "",
    gold_type: "",
    product_type: "",
    purity_required: "",
    required_date: "",
    description: "",
    expected_quantity: "",
    estimated_budget: "",
    making_charges: "",
    hallmark_required: "",
    design_type: "",
    timeline: "",
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

      const payload = {
        ...formData,
        industry_type: "gold_business",
      };

      const res = await api.post("/business-development/gold/create", payload);

      if (res.data.success) {
        setAlertData({
          type: "success",
          message: "Gold Business Created ✅",
        });

        setFormData({
          company_name: "",
          contact_person: "",
          phone: "",
          email: "",
          business_type: "",
          gold_type: "",
          product_type: "",
          purity_required: "",
          required_date: "",
          description: "",
          expected_quantity: "",
          estimated_budget: "",
          making_charges: "",
          hallmark_required: "",
          design_type: "",
          timeline: "",
          business_status: "",
          comment: "",
        });

        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setAlertData({
        type: "error",
        message: err.response?.data?.message || "Error",
      });
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

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
            <h2 className="text-xl font-semibold text-purple-600">
              New Gold Business Request
            </h2>
            <button
              onClick={onClose}
              className="text-xl font-bold hover:text-red-600"
            >
              ×
            </button>
          </div>


          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* BUSINESS DETAILS */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Business Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Company Name</label>
                  <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Company Name"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Contact Person</label>
                  <input
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="Contact Person"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="bg-white border rounded-lg h-11 px-3"
                    required
                  />
                </div>
              </div>
            </div>
            { }
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Gold Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Gold Type</label>
                  <input
                    name="gold_type"
                    value={formData.gold_type}
                    onChange={handleChange}
                    placeholder="Gold Type"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Purity Required</label>
                  <input
                    name="purity_required"
                    value={formData.purity_required}
                    onChange={handleChange}
                    placeholder="Purity Required"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Expected Quantity</label>
                  <input
                    name="expected_quantity"
                    value={formData.expected_quantity}
                    onChange={handleChange}
                    placeholder="Expected Quantity"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Estimated Budget</label>
                  <input
                    name="estimated_budget"
                    value={formData.estimated_budget}
                    onChange={handleChange}
                    placeholder="Estimated Budget"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Required Date</label>
                  <input
                    type="date"
                    name="required_date"
                    value={formData.required_date}
                    onChange={handleChange}
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>
              </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-4">Additional Info</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Making Charges</label>
                  <input
                    name="making_charges"
                    value={formData.making_charges}
                    onChange={handleChange}
                    placeholder="Making Charges"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Hallmark Required</label>
                  <select
                    name="hallmark_required"
                    value={formData.hallmark_required}
                    onChange={handleChange}
                    className="bg-white border rounded-lg h-11 px-3"
                  >
                    <option value="">Select</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Design Type</label>
                  <input
                    name="design_type"
                    value={formData.design_type}
                    onChange={handleChange}
                    placeholder="Design Type"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Timeline</label>
                  <input
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="Timeline"
                    className="bg-white border rounded-lg h-11 px-3"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT */}
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