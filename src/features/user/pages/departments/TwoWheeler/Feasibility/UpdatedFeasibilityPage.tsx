// UpdatedTwoWheelerRequests.tsx
import React, { useEffect, useState } from "react";
import TwoWheelerCard from "../Business/TwoWheelerCard"; // <-- import your card component here
import { api } from "../../../../api/businessApi";

interface Props {
  onBack: () => void;
}

const UpdatedTwoWheelerRequests: React.FC<Props> = ({ onBack }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdatedRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get("/business-development/2w/review");

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
        <h2 className="text-white text-xl">Updated 2W Feasibility Requests</h2>
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
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item,index) => (
            <TwoWheelerCard
              key={item.id}
              data={item}
              mode="update"
              cardIndex={index} 
              onUpdate={(updatedItem) => {
                setData((prev) =>
                  prev.map((pr) => (pr.id === updatedItem.id ? updatedItem : pr))
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

export default UpdatedTwoWheelerRequests;