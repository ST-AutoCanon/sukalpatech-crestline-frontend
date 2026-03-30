// UpdatedThreeWheelerRequests.tsx
import React, { useEffect, useState } from "react";
import ThreeWheelerCard from "../Business/ThreeWheelerCard"; // <-- import your card component here
import { api } from "../../../../api/businessApi";

interface Props {
  onBack: () => void;
}

const UpdatedThreeWheelerRequests: React.FC<Props> = ({ onBack }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdatedRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get("/business-development/3w/review");

        if (res.data.success && res.data.data?.data) {
          setData(res.data.data.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Fetch Updated Requests Error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdatedRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-white text-xl">Updated 3W Feasibility Requests</h2>
        <button
          onClick={onBack}
          className="bg-white text-purple-700 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 space-y-4">
          {data
            ?.filter((item) => item && item.id) // ✅ remove bad items
            .map((item,index) => (
              <ThreeWheelerCard
                key={item.id}
                data={item}
                mode="update"
                cardIndex={index} 
                onUpdate={(updatedItem) => {
                  if (!updatedItem?.id) return; // ✅ safety

                  setData((prev) =>
                    prev.map((pr) =>
                      pr?.id === updatedItem.id ? updatedItem : pr
                    )
                  );
                }}
              />
            ))}
        </div>
      ) : (
        <p className="text-white">No feasibility updated requests found.</p>
      )}
    </div>
  );
};

export default UpdatedThreeWheelerRequests;