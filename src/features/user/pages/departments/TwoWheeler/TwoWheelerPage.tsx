import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../../../components/Aleartmessage";
import { useNavigate } from "react-router-dom";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

interface TwoWheelerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}


const TwoWheelerPage: React.FC<TwoWheelerModalProps> = ({ onClose, onSuccess }) => {  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    project_title: "",
    expected_quantity: "",
    estimated_budget: "",
    vehicle_model: "",
    motor_capacity: "",
    battery_type: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const[businessList,setBusinessList]=useState<any[]>([]);

  const fetchBusinesses = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5004/api/business-development/2w/list",
      {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials:true,
        }
    );

    if (res.data.success) {
      setBusinessList(res.data.data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.alert("Please login first!");
      navigate("/login");
    } else {
      fetchBusinesses();
    }
  }, [navigate]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setAlert(null);

  const token = localStorage.getItem("token");

  try {
    setLoading(true);

    const payload = {
      ...formData,
      industry_type: "2W",
    };

    let res;

    if (editId) {
      // UPDATE API
      res = await axios.put(
        `http://localhost:5004/api/business-development/2w/${editId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials:true,
        }
      );
    } else {
      // CREATE API
      res = await axios.post(
        "http://localhost:5004/api/business-development/2w/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials:true,
        }
      );
    }

    if (res.data.success) {
  setAlert({
    type: "success",
    message: editId ? "Business Updated ✅" : "Business Created ✅",
  });

  fetchBusinesses();

  setFormData({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    project_title: "",
    expected_quantity: "",
    estimated_budget: "",
    vehicle_model: "",
    motor_capacity: "",
    battery_type: "",
  });

  setEditId(null);

  // Delay modal close to let user see the alert
  if (!editId) {
    setTimeout(() => {
      onSuccess(); // close modal and refresh list
    }, 1500); // 1.5 seconds delay
  }
}
  } catch (error: any) {
    setAlert({
      type: "error",
      message: error.response?.data?.message || "Server error",
    });
  } finally {
    setLoading(false);
  }
};

const handleEdit = (item: any) => {
  setEditId(item.id);

  setFormData({
    company_name: item.company_name || "",
    contact_person: item.contact_person || "",
    phone: item.phone || "",
    email: item.email || "",
    project_title: item.project_title || "",
    expected_quantity: item.expected_quantity || "",
    estimated_budget: item.estimated_budget || "",
    vehicle_model: item.vehicle_model || "",
    motor_capacity: item.motor_capacity || "",
    battery_type: item.battery_type || "",
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("Delete this business?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(
      `http://localhost:5004/api/business-development/2w/${id}`,
      {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials:true,
        }
    );

    if (res.data.success) {
      setAlert({ type: "success", message: "Business Deleted 🗑️" });
      fetchBusinesses();
    }
  } catch (error) {
    setAlert({ type: "error", message: "Delete failed" });
  }
};
  return (
    <>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-6 lg:p-8">
        <div className="flex-1 w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              2 Wheeler Business Development
            </h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Fill in the project and vehicle details to create a new business development record.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Contact Person"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  name="project_title"
                  value={formData.project_title}
                  onChange={handleChange}
                  placeholder="Project Title"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="text"
                  name="expected_quantity"
                  value={formData.expected_quantity}
                  onChange={handleChange}
                  placeholder="Expected Quantity"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="text"
                  name="estimated_budget"
                  value={formData.estimated_budget}
                  onChange={handleChange}
                  placeholder="Estimated Budget"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-3 mt-4">
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  placeholder="Vehicle Model"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="text"
                  name="motor_capacity"
                  value={formData.motor_capacity}
                  onChange={handleChange}
                  placeholder="Motor Capacity"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="text"
                  name="battery_type"
                  value={formData.battery_type}
                  onChange={handleChange}
                  placeholder="Battery Type"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 font-semibold"
>
  {loading
    ? editId
      ? "Updating..."
      : "Creating..."
    : editId
    ? "Update Business"
    : "Save"}
</button>
              </div>
            </form>

            
</div>
          </div>
          
        </div>
    </>
  );
};

export default TwoWheelerPage;