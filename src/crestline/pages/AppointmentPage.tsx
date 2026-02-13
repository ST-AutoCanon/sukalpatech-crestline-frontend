// import React, { useState } from "react";

// export default function AppointmentPage() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [date, setDate] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!fullName || !email || !phone) {
//       alert("Please fill all required fields before booking your appointment.");
//       return;
//     }

//     alert("Appointment booked successfully! Our team will contact you soon.");
//       setFullName("");
//       setEmail("");
//       setPhone("");
//       setFile(null);
//       setDate("");
//       setMessage("");
//   };

//   return (
//     // <seconion className="min-h-screen bg-[#3D268C] flex items-center justify-center p-6">
//     //   <div className="max-w-lg w-full bg-white rounded-xl shadow-md p-6">
//     <section className="min-h-screen bg-[#3D268C] flex items-center justify-center p-6">
//       <div className="max-w-lg w-full bg-white rounded-xl shadow-md p-6 mt-20">
//         <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
//           Book an Appointment
//         </h2>

//         <p className="text-gray-600 text-sm mt-1 mb-6">
//           Schedule a consultation with our experts.
//         </p>

//         <form className="space-y-4 mt-3" onSubmit={handleSubmit}>
//           {/* Full Name */}
//           <input
//             type="text"
//             placeholder="Full Name *"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
//                        focus:ring-2 focus:ring-blue-500 outline-none text-black
//                        placeholder-gray-400 placeholder-opacity-100"
//           />

//           {/* Email */}
//           <input
//             type="email"
//             placeholder="Email Address *"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
//                        focus:ring-2 focus:ring-blue-500 outline-none text-black
//                        placeholder-gray-400 placeholder-opacity-100"
//           />

//           {/* Phone */}
//           <input
//             type="tel"
//             placeholder="Phone Number *"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
//                        focus:ring-2 focus:ring-blue-500 outline-none text-black
//                        placeholder-gray-400 placeholder-opacity-100"
//           />

//           {/* Preferred Date & Time */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Preferred Date
//               </label>
//               <input
//                 type="date"
//                 value={date.split("T")[0]} // extract date if datetime string
//                 onChange={(e) =>
//                   setDate(`${e.target.value}T${date.split("T")[1] || "12:00"}`)
//                 }
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
//                  focus:ring-2 focus:ring-blue-500 outline-none text-black"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Preferred Time
//               </label>
//               <input
//                 type="time"
//                 value={date.split("T")[1] || "12:00"}
//                 onChange={(e) =>
//                   setDate(
//                     `${date.split("T")[0] || "2025-12-06"}T${e.target.value}`
//                   )
//                 }
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
//                  focus:ring-2 focus:ring-blue-500 outline-none text-black"
//               />
//             </div>
//           </div>

//           {/* Message */}
//           <textarea
//             rows={3}
//             placeholder="Message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
//                        focus:ring-2 focus:ring-blue-500 outline-none resize-none text-black
//                        placeholder-gray-400 placeholder-opacity-100"
//           ></textarea>

//           {/* File Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Upload File (optional)
//             </label>
//             <label className="w-full flex flex-col items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition">
//               <span className="text-sm">Click to select a file</span>
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={(e) =>
//                   setFile(e.target.files ? e.target.files[0] : null)
//                 }
//               />
//             </label>
//             {file && (
//               <p className="mt-2 text-sm text-gray-500">
//                 Selected file: <span className="font-medium">{file.name}</span>
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-[#00B8DB] to-[#9810FA]
//                        text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition"
//           >
//             Confirm Appointment
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppointmentPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone) {
      alert("Please fill all required fields before booking your appointment.");
      return;
    }

    alert("Appointment booked successfully! Our team will contact you soon.");
    setFullName("");
    setEmail("");
    setPhone("");
    setFile(null);
    setDate("");
    setMessage("");
  };

  return (
    <section className="min-h-screen bg-[#3D268C] flex items-center justify-center p-6">
      <div className="relative max-w-lg w-full bg-white rounded-xl shadow-md p-6 mt-20">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Book an Appointment
        </h2>

        <p className="text-gray-600 text-sm mt-1 mb-6">
          Schedule a consultation with our experts.
        </p>

        <form className="space-y-4 mt-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:ring-2 focus:ring-blue-500 outline-none text-black
                       placeholder-gray-400 placeholder-opacity-100"
          />

          <input
            type="email"
            placeholder="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:ring-2 focus:ring-blue-500 outline-none text-black
                       placeholder-gray-400 placeholder-opacity-100"
          />

          <input
            type="tel"
            placeholder="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                       focus:ring-2 focus:ring-blue-500 outline-none text-black
                       placeholder-gray-400 placeholder-opacity-100"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={date.split("T")[0]}
                onChange={(e) =>
                  setDate(`${e.target.value}T${date.split("T")[1] || "12:00"}`)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                 focus:ring-2 focus:ring-blue-500 outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time
              </label>
              <input
                type="time"
                value={date.split("T")[1] || "12:00"}
                onChange={(e) =>
                  setDate(
                    `${date.split("T")[0] || "2025-12-06"}T${e.target.value}`
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                 focus:ring-2 focus:ring-blue-500 outline-none text-black"
              />
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm 
                       focus:ring-2 focus:ring-blue-500 outline-none resize-none text-black
                       placeholder-gray-400 placeholder-opacity-100"
          ></textarea>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File (optional)
            </label>
            <label className="w-full flex flex-col items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition">
              <span className="text-sm">Click to select a file</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                Selected file: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00B8DB] to-[#9810FA]
                       text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Confirm Appointment
          </button>
        </form>
      </div>
    </section>
  );
}
