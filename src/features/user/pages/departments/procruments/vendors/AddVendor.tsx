// import React, { useState, useContext } from "react";
// import { AuthContext } from "../../../../../../context/AuthContext";
// import { useVendor } from "../../../../hooks/useVendor";

// const AddVendor: React.FC = () => {
//   const { user, token } = useContext(AuthContext);
//   const { createVendor } = useVendor(token);

//   const [vendorData, setVendorData] = useState({
//     vendor_name: "",
//     contact_person: "",
//     phone: "",
//     email: "",
//     gst_number: "",
//     pan_number: "",
//     address: "",
//     rating: "",
//     status: "active",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setVendorData({ ...vendorData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const payload = { ...vendorData, created_by: user.id };
//       await createVendor(payload);

//       alert("Vendor added successfully!");

//       setVendorData({
//         vendor_name: "",
//         contact_person: "",
//         phone: "",
//         email: "",
//         gst_number: "",
//         pan_number: "",
//         address: "",
//         rating: "",
//         status: "active",
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Error adding vendor");
//     }
//   };

//   const inputClass =
//     "w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

//   return (
//     <div className="p-10 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Add Vendor</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <input
//           className={inputClass}
//           placeholder="Vendor Name"
//           name="vendor_name"
//           value={vendorData.vendor_name}
//           onChange={handleChange}
//         />
//         <input
//           className={inputClass}
//           placeholder="Contact Person"
//           name="contact_person"
//           value={vendorData.contact_person}
//           onChange={handleChange}
//         />
//         <input
//           className={inputClass}
//           placeholder="Phone"
//           name="phone"
//           value={vendorData.phone}
//           onChange={handleChange}
//         />
//         <input
//           className={inputClass}
//           placeholder="Email"
//           name="email"
//           value={vendorData.email}
//           onChange={handleChange}
//         />
//         <input
//           className={inputClass}
//           placeholder="GST Number"
//           name="gst_number"
//           value={vendorData.gst_number}
//           onChange={handleChange}
//         />
//         <input
//           className={inputClass}
//           placeholder="PAN Number"
//           name="pan_number"
//           value={vendorData.pan_number}
//           onChange={handleChange}
//         />
//         <textarea
//           className={inputClass + " md:col-span-2"}
//           placeholder="Address"
//           name="address"
//           value={vendorData.address}
//           onChange={handleChange}
//         />
//         <input
//           className={inputClass}
//           placeholder="Rating"
//           name="rating"
//           value={vendorData.rating}
//           onChange={handleChange}
//         />
//       </div>

//       <button
//         className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         onClick={handleSubmit}
//       >
//         Add Vendor
//       </button>
//     </div>
//   );
// };

// export default AddVendor;


import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../../context/AuthContext";
import { useVendor } from "../../../../hooks/useVendor";

const AddVendor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, token } = useContext(AuthContext);
  const { createVendor } = useVendor(token);

  // Modal visibility state
  const [showModal, setShowModal] = useState(true);

  const [vendorData, setVendorData] = useState({
    vendor_name: "",
    contact_person: "",
    phone: "",
    email: "",
    gst_number: "",
    pan_number: "",
    address: "",
    rating: 0, // ✅ number
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };
  const handleRatingChange = (star: number) => {
    setVendorData((prev) => ({ ...prev, rating: star }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...vendorData, created_by: user.id };
      await createVendor(payload);

      alert("Vendor added successfully!");

      setVendorData({
        vendor_name: "",
        contact_person: "",
        phone: "",
        email: "",
        gst_number: "",
        pan_number: "",
        address: "",
        rating: "",
        status: "active",
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding vendor");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-2 py-1 text-sm text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500";

  if (!showModal) return null; // Hide modal when showModal is false

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl rounded-xl bg-white p-8 relative">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600">Add Vendor</h1>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Vendor Name
            </label>
            <input
              className={inputClass}
              name="vendor_name"
              value={vendorData.vendor_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Contact Person
            </label>
            <input
              className={inputClass}
              name="contact_person"
              value={vendorData.contact_person}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Phone
            </label>
            <input
              className={inputClass}
              name="phone"
              value={vendorData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Email
            </label>
            <input
              className={inputClass}
              name="email"
              value={vendorData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              GST Number
            </label>
            <input
              className={inputClass}
              name="gst_number"
              value={vendorData.gst_number}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              PAN Number
            </label>
            <input
              className={inputClass}
              name="pan_number"
              value={vendorData.pan_number}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-1 flex flex-col justify-end">
            <label className="mb-2 block text-sm font-medium text-black">
              Address
            </label>
            <textarea
              className={inputClass + " h-10"}
              name="address"
              value={vendorData.address}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium text-black">
              Rating
            </label>

            <div className="flex flex-row items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                >
                  <span
                    className={`text-3xl ${
                      star <= vendorData.rating
                        ? "text-orange-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-2 text-purple-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-purple-600 px-6 py-2 text-white"
          >
            <span className="text-xl">+</span> Add Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVendor;
