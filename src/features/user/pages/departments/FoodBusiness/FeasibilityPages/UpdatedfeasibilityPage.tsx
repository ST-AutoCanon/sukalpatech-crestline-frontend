// UpdatedThreeWheelerRequests.tsx
import React, { useEffect, useState } from "react";
import FoodBusiness from "../FoodPages/FoodBusinessCard"; // <-- import your card component here
import { api } from "../../../../api/businessApi";

interface Props {
  filter: string;
}

const UpdatedFoodRequests: React.FC<Props> = ({ filter }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdatedRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get("/business-development/food/review");

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

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data
            ?.filter((item) => item && item.id)
            .map((item) => (   // ✅ add index here
              <FoodBusiness
                key={item.id}
                data={item}
                mode="update"
                onUpdate={(updatedItem) => {
                  if (!updatedItem?.id) return;

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

export default UpdatedFoodRequests;