// import { useEffect, useState } from "react";
// import axios from "axios";

// interface CategoryLimits {
//   high: number;
//   medium: number;
//   low: number;
// }

// export default function CategoryLimitPage() {
//   const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/categorylimit`;
//   const token = localStorage.getItem("token");

//   const [Limits, setLimits] = useState<CategoryLimits>({ high: 0, medium: 0, low: 0 });
//   const [newLimits, setNewLimits] = useState<Partial<CategoryLimits>>({});
//   const [updatedLimits, setUpdatedLimits] = useState<CategoryLimits | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(false);

//   /* ================= FETCH CURRENT LIMITS ================= */
//   const fetchLimits = async () => {
//      try {
//       const res = await axios.get(`${ADMIN_API_BASE}/category-limits`, {
//         withCredentials: true,
//       });

//       const limits = res.data?.data?.data; // 👈 correct path

//       if (limits) {
//         setLimits({
//           high: Number(limits.high),
//           medium: Number(limits.medium),
//           low: Number(limits.low),
//         });
//       }
//     } catch (err) {
//       console.error("Failed to fetch category limits", err);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       await fetchLimits();
//     };
//     init();
//   }, []);

//   /* ================= ADD/UPDATE ================= */
//   const handleUpdate = async () => {
//     try {
//       setLoading(true);

//       const payload = {
//         high: Number(newLimits.high),
//         medium: Number(newLimits.medium),
//         low: Number(newLimits.low),
//       };

//      const res = await axios.put(
//         `${ADMIN_API_BASE}/category-limits/update`,
//         payload,
//         { withCredentials: true },
//       );

//       // Save updated values separately
//       setUpdatedLimits(res.data.data);

//       // Refresh current limits from DB
//       await fetchLimits();

//     } catch (err) {
//       console.error("Update failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8 text-black">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Category Limits</h1>

//         {/* ================= CURRENT LIMITS TABLE ================= */}
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 sm:mb-8 mt-4">
//           <h2 className="font-semibold mb-4">Current Limits</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <div className="font-semibold">High</div>
//               <div>{Limits.high}</div>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <div className="font-semibold">Medium</div>
//               <div>{Limits.medium}</div>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <div className="font-semibold">Low</div>
//               <div>{Limits.low}</div>
//             </div>
//           </div>
//         </div>

//         {/* ================= NEW LIMITS INPUT ================= */}
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 sm:mb-8">
//           <h2 className="font-semibold mb-4">Add / Update Limits</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             {["high", "medium", "low"].map((level) => (
//               <div key={level}>
//                 <label className="block mb-1 capitalize">{level}</label>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   placeholder={`Enter ${level} limit`}
//                   className="border p-2 rounded-lg w-full"
//                   value={newLimits[level as keyof CategoryLimits] || ""}
//                   onChange={(e) =>
//                     setNewLimits({
//                       ...newLimits,
//                       [level]: e.target.value === "" ? undefined : Number(e.target.value),
//                     })
//                   }
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-col sm:flex-row gap-2">
//             <button
//               onClick={handleUpdate}
//               disabled={loading}
//               className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg"
//             >
//               {loading ? "Updating..." : "Update"}
//             </button>
//             <button
//               onClick={() => {
//                 setNewLimits(Limits); // Reset to current DB values
//               }}
//               className="w-full sm:w-auto bg-gray-300 text-black px-6 py-2 rounded-lg"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>

//         {/* ================= UPDATED LIMITS TABLE ================= */}
//         {updatedLimits && (
//           <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
//             <h2 className="font-semibold mb-4">Updated Limits</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//               {["high", "medium", "low"].map((level) => (
//                 <div key={level} className="bg-gray-100 p-4 rounded-lg">
//                   <div className="font-semibold capitalize">{level}</div>
//                   <div>{updatedLimits[level as keyof CategoryLimits]}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../../components/Aleartmessage";

interface CategoryLimits {
  high: number;
  medium: number;
  low: number;
}

export default function CategoryLimitPage() {
  const ADMIN_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/categorylimit`;
  const token = localStorage.getItem("token");

  const [limits, setLimits] = useState<CategoryLimits>({
    high: 0,
    medium: 0,
    low: 0,
  });
  const [newLimits, setNewLimits] = useState<Partial<CategoryLimits>>({});
  const [updatedLimits, setUpdatedLimits] = useState<CategoryLimits | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
  type: "success" | "error";
  message: string;
} | null>(null);

  /* ================= FETCH CURRENT LIMITS ================= */
  const fetchLimits = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_BASE}/category-limits`, {
        withCredentials: true,
      });

      const limitsData = res.data?.data?.data; // correct path

      if (limitsData) {
        setLimits({
          high: Number(limitsData.high),
          medium: Number(limitsData.medium),
          low: Number(limitsData.low),
        });
      }
    } catch (err) {
      console.error("Failed to fetch category limits", err);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
  try {
    setLoading(true);

    const payload = {
      high:
        newLimits.high !== undefined ? Number(newLimits.high) : limits.high,

      medium:
        newLimits.medium !== undefined
          ? Number(newLimits.medium)
          : limits.medium,

      low:
        newLimits.low !== undefined ? Number(newLimits.low) : limits.low,
    };

    const res = await axios.put(
      `${ADMIN_API_BASE}/category-limits/update`,
      payload,
      { withCredentials: true }
    );

    setUpdatedLimits(res.data.data);

    setAlert({
      type: "success",
      message: "Category limits updated successfully ✅",
    });

    setNewLimits({});
    await fetchLimits();

  } catch (err: any) {
    setAlert({
      type: "error",
      message:
        err.response?.data?.message || "Failed to update category limits ❌",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    {alert && (
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(null)}
      />
    )}
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ================= PAGE TITLE ================= */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Category Limits
        </h1>

        {/* ================= CURRENT LIMITS ================= */}
        <div className="bg-white text-black rounded-2xl shadow-md p-5 sm:p-6 mb-6 mt-8">
          <h2 className="font-semibold text-lg mb-4">Current Limits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded-xl">
              <div className="font-semibold">High</div>
              <div>{limits.high}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <div className="font-semibold">Medium</div>
              <div>{limits.medium}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <div className="font-semibold">Low</div>
              <div>{limits.low}</div>
            </div>
          </div>
        </div>

        {/* ================= NEW LIMITS INPUT ================= */}
        <div className="bg-white text-black rounded-2xl shadow-md p-5 sm:p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Add / Update Limits</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {["high", "medium", "low"].map((level) => (
              <div key={level}>
                <label className="block mb-1 capitalize">{level}</label>
                <input
                  type="number"
                  min={0}
                  placeholder={`Enter ${level} limit`}
                  className="border p-2.5 rounded-xl w-full"
                  value={newLimits[level as keyof CategoryLimits] ?? ""}
                  onChange={(e) =>
                    setNewLimits({
                      ...newLimits,
                      [level]:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
            >
              {loading ? "Updating..." : "Update"}
            </button>

            <button
              onClick={() => setNewLimits({})}
              className="w-full sm:w-auto bg-gray-300 text-black px-6 py-2.5 rounded-xl hover:opacity-90 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ================= UPDATED LIMITS ================= */}
        {updatedLimits && (
          <div className="bg-white text-black rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="font-semibold text-lg mb-4">Updated Limits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {["high", "medium", "low"].map((level) => (
                <div key={level} className="bg-gray-100 p-4 rounded-xl">
                  <div className="font-semibold capitalize">{level}</div>
                  <div>{updatedLimits[level as keyof CategoryLimits]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}