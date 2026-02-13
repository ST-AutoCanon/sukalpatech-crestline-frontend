
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../../context/AuthContext";
import { useVendor } from "../../../../hooks/useVendor";
import Aleart from "../../../../components/Aleartmessage";

const AddVendor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, token } = useContext(AuthContext);
  const { createVendor } = useVendor(token);

  const [step, setStep] = useState(1);

  const [vendorData, setVendorData] = useState({
    vendor_name: "",
    contact_person: "",
    phone: "",
    email: "",
    gst_number: "",
    pan_number: "",
    address: "",
    rating: 0,
    status: "active",
  });

  const [bankData, setBankData] = useState({
    bank_name: "",
    bank_branch: "",
    account_number: "",
    ifsc_code: "",
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleVendorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (star: number) => {
    setVendorData((prev) => ({ ...prev, rating: star }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...vendorData,
        ...bankData,
        created_by: user.id,
      };

      await createVendor(payload);

      setAlert({
        type: "success",
        message: "Vendor added successfully!",
      });

      // Reset form
      setVendorData({
        vendor_name: "",
        contact_person: "",
        phone: "",
        email: "",
        gst_number: "",
        pan_number: "",
        address: "",
        rating: 0,
        status: "active",
      });

      setBankData({
        bank_name: "",
        bank_branch: "",
        account_number: "",
        ifsc_code: "",
      });

      // Close modal after alert
      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Error adding vendor",
      });
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-2 py-1 text-sm text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* ALERT */}
      {alert && (
        <Aleart
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="w-full max-w-4xl rounded-xl bg-white p-8 relative">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600">Add Vendor</h1>
          <button onClick={onClose} className="text-3xl text-gray-500">
            &times;
          </button>
        </div>

        {/* STEP INDICATOR */}
        <div className="mb-6 flex gap-6 text-sm font-semibold">
          <span className={step === 1 ? "text-purple-600" : "text-gray-400"}>
            ● Vendor Details
          </span>
          <span className={step === 2 ? "text-purple-600" : "text-gray-400"}>
            ● Bank Details
          </span>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className={inputClass}
              name="vendor_name"
              placeholder="Vendor Name"
              value={vendorData.vendor_name}
              onChange={handleVendorChange}
            />
            <input
              className={inputClass}
              name="contact_person"
              placeholder="Contact Person"
              value={vendorData.contact_person}
              onChange={handleVendorChange}
            />
            <input
              className={inputClass}
              name="phone"
              placeholder="Phone"
              value={vendorData.phone}
              onChange={handleVendorChange}
            />
            <input
              className={inputClass}
              name="email"
              placeholder="Email"
              value={vendorData.email}
              onChange={handleVendorChange}
            />
            <input
              className={inputClass}
              name="gst_number"
              placeholder="GST Number"
              value={vendorData.gst_number}
              onChange={handleVendorChange}
            />
            <input
              className={inputClass}
              name="pan_number"
              placeholder="PAN Number"
              value={vendorData.pan_number}
              onChange={handleVendorChange}
            />
            <textarea
              className={inputClass}
              name="address"
              placeholder="Address"
              value={vendorData.address}
              onChange={handleVendorChange}
            />

            {/* Rating */}
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl cursor-pointer ${
                    star <= vendorData.rating
                      ? "text-orange-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className={inputClass}
              name="bank_name"
              placeholder="Bank Name"
              value={bankData.bank_name}
              onChange={handleBankChange}
            />
            <input
              className={inputClass}
              name="bank_branch"
              placeholder="Branch"
              value={bankData.bank_branch}
              onChange={handleBankChange}
            />
            <input
              className={inputClass}
              name="account_number"
              placeholder="Account Number"
              value={bankData.account_number}
              onChange={handleBankChange}
            />
            <input
              className={inputClass}
              name="ifsc_code"
              placeholder="IFSC Code"
              value={bankData.ifsc_code}
              onChange={handleBankChange}
            />
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-8 flex justify-between">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="rounded bg-purple-600 px-6 py-2 text-white"
            >
              ← Back
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="rounded bg-purple-600 px-6 py-2 text-white"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded bg-green-600 px-6 py-2 text-white"
            >
              Add Vendor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddVendor;
