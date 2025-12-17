// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../../../../../context/AuthContext";

// const AddVendor: React.FC = () => {
//   const { user, token } = useContext(AuthContext);

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
//       const res = await axios.post(
//         "http://localhost:5001/api/procurement/vendor",
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
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

const AddVendor: React.FC = () => {
  const { user, token } = useContext(AuthContext);
  const { createVendor } = useVendor(token);

  const [vendorData, setVendorData] = useState({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
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
    } catch (err) {
      console.error(err);
      alert("Error adding vendor");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Vendor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="Vendor Name"
          name="vendor_name"
          value={vendorData.vendor_name}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          placeholder="Contact Person"
          name="contact_person"
          value={vendorData.contact_person}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          placeholder="Phone"
          name="phone"
          value={vendorData.phone}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          placeholder="Email"
          name="email"
          value={vendorData.email}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          placeholder="GST Number"
          name="gst_number"
          value={vendorData.gst_number}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          placeholder="PAN Number"
          name="pan_number"
          value={vendorData.pan_number}
          onChange={handleChange}
        />
        <textarea
          className={inputClass + " md:col-span-2"}
          placeholder="Address"
          name="address"
          value={vendorData.address}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          placeholder="Rating"
          name="rating"
          value={vendorData.rating}
          onChange={handleChange}
        />
      </div>

      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleSubmit}
      >
        Add Vendor
      </button>
    </div>
  );
};

export default AddVendor;
