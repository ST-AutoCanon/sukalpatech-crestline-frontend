import { useState } from "react";
import {
  FaArrowRight,
  FaArrowLeft,
  FaPaperPlane,
  FaDownload,
} from "react-icons/fa";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default function Quote() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    busType: "",
    seatingCapacity: "",
    fuelType: "",
    acRequired: "",
    wheelchairAccess: "",
    luggageCapacity: "",
    customBranding: "",
    paintColor: "",
    interiorMaterial: "",
    specialFeatures: "",
    deliveryTimeframe: "",
    budget: "",
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const steps = [
    { id: 1, title: "Company Details" },
    { id: 2, title: "Bus Requirements" },
    { id: 3, title: "Preferences" },
    { id: 4, title: "Additional Notes" },
    { id: 5, title: "Preview & Submit" },
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Quote request submitted successfully!");
  };

  // PDF Generation
const generatePDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("CrestlineTech - Quote Request", 14, 20);

  let currentY = 30;

  const addSection = (title: string, data: Record<string, string>) => {
    doc.setFontSize(14);
    doc.text(title, 14, currentY);
    currentY += 6;

    const body = Object.entries(data).map(([key, value]) => [
      key,
      value || "Not Provided",
    ]);

    (doc as any).autoTable({
      startY: currentY,
      head: [["Field", "Value"]],
      body,
      theme: "grid",
      headStyles: { fillColor: [22, 34, 86] },
      styles: { fontSize: 11 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  };

  addSection("🏢 Company Details", {
    "Company Name": formData.companyName,
    "Contact Person": formData.contactPerson,
    Email: formData.email,
    Phone: formData.phone,
    Address: formData.address,
  });

  addSection("🚌 Bus Requirements", {
    "Bus Type": formData.busType,
    "Seating Capacity": formData.seatingCapacity,
    "Fuel Type": formData.fuelType,
    "Air Conditioning": formData.acRequired,
    "Wheelchair Access": formData.wheelchairAccess,
    "Luggage Capacity": formData.luggageCapacity,
    "Custom Branding": formData.customBranding,
  });

  addSection("🎨 Preferences & Features", {
    "Paint Color": formData.paintColor,
    "Interior Material": formData.interiorMaterial,
    "Special Features": formData.specialFeatures,
    "Delivery Timeframe": formData.deliveryTimeframe,
    Budget: formData.budget,
  });

  addSection("📝 Additional Notes", {
    Notes: formData.additionalNotes,
  });

  doc.save("Quote_Request.pdf");
};


  return (
    <section className="min-h-screen bg-gradient-to-br from-[#3F006E] via-[#162456] to-[#223FA4] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/crestlinetech_logo.png"
            alt="CrestlineTech Logo"
            className="h-10 mx-auto mb-3"
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Request a Quote
          </h1>
          <p className="text-sm text-gray-200 mt-1">
            Please fill in your requirements step-by-step below.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex-1 text-center text-xs sm:text-sm ${
                s.id === step ? "text-white font-semibold" : "text-gray-400"
              }`}
            >
              {s.title}
              {s.id !== steps.length && (
                <div
                  className={`h-[2px] w-full ${
                    s.id < step ? "bg-white" : "bg-gray-500/50"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Steps 1-4 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Company Details</h2>
              <input
                name="companyName"
                placeholder="Company Name *"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                name="contactPerson"
                placeholder="Contact Person *"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Bus Requirements</h2>
              <select
                name="busType"
                value={formData.busType}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white text-gray-900"
              >
                <option value="">Select Bus Type *</option>
                <option>Executive Coach</option>
                <option>City Bus</option>
                <option>Tourist Coach</option>
                <option>Electric Bus</option>
              </select>
              <input
                name="seatingCapacity"
                placeholder="Seating Capacity *"
                required
                value={formData.seatingCapacity}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900"
              >
                <option value="">Fuel Type</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
              <select
                name="acRequired"
                value={formData.acRequired}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900"
              >
                <option value="">Air Conditioning</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <select
                name="wheelchairAccess"
                value={formData.wheelchairAccess}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900"
              >
                <option value="">Wheelchair Access</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <input
                name="luggageCapacity"
                placeholder="Luggage Capacity (in liters)"
                value={formData.luggageCapacity}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <textarea
                name="customBranding"
                placeholder="Custom Branding Requirements"
                value={formData.customBranding}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">
                Preferences & Features
              </h2>
              <input
                name="paintColor"
                placeholder="Preferred Paint Color"
                value={formData.paintColor}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                name="interiorMaterial"
                placeholder="Interior Material"
                value={formData.interiorMaterial}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <textarea
                name="specialFeatures"
                placeholder="Special Features"
                value={formData.specialFeatures}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                name="deliveryTimeframe"
                placeholder="Expected Delivery Timeframe"
                value={formData.deliveryTimeframe}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <input
                name="budget"
                placeholder="Estimated Budget (€)"
                value={formData.budget}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Additional Notes</h2>
              <textarea
                name="additionalNotes"
                placeholder="Any other specific requirements or notes..."
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={6}
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
          )}

          {/* Step 5 - Preview & PDF */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-center text-white">
                Quote Request Preview
              </h2>
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={generatePDF}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition mx-auto"
                >
                  <FaDownload /> Download PDF
                </button>
              </div>
              <div className="bg-white text-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 space-y-6">
                <div className="flex justify-between mb-4 border-b pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      CrestlineTech
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quote Request Summary
                    </p>
                  </div>
                  <img
                    src="/crestlinetech_black.png"
                    alt="Logo"
                    className="h-8"
                  />
                </div>

                <Section
                  title="🏢 Company Details"
                  data={{
                    "Company Name": formData.companyName,
                    "Contact Person": formData.contactPerson,
                    Email: formData.email,
                    Phone: formData.phone,
                    Address: formData.address,
                  }}
                />

                <Section
                  title="🚌 Bus Requirements"
                  data={{
                    "Bus Type": formData.busType,
                    "Seating Capacity": formData.seatingCapacity,
                    "Fuel Type": formData.fuelType,
                    "Air Conditioning": formData.acRequired,
                    "Wheelchair Access": formData.wheelchairAccess,
                    "Luggage Capacity": formData.luggageCapacity,
                    "Custom Branding": formData.customBranding,
                  }}
                />

                <Section
                  title="🎨 Preferences & Features"
                  data={{
                    "Paint Color": formData.paintColor,
                    "Interior Material": formData.interiorMaterial,
                    "Special Features": formData.specialFeatures,
                    "Delivery Timeframe": formData.deliveryTimeframe,
                    Budget: formData.budget,
                  }}
                />

                <Section
                  title="📝 Additional Notes"
                  data={{ Notes: formData.additionalNotes }}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 rounded-lg bg-white text-gray-800 font-medium flex items-center gap-2 hover:bg-gray-200 transition"
              >
                <FaArrowLeft /> Back
              </button>
            ) : (
              <div />
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center gap-2 hover:opacity-90 transition"
              >
                Next <FaArrowRight />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center gap-2 hover:opacity-90 transition"
              >
                <FaPaperPlane /> Submit Request
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

// Section Component
function Section({
  title,
  data,
}: {
  title: string;
  data: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-sm">
        {Object.entries(data).map(([label, value]) => (
          <div key={label}>
            <span className="block font-medium text-gray-600">{label}</span>
            <span className="text-gray-800">
              {value || <span className="text-gray-400">Not Provided</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
