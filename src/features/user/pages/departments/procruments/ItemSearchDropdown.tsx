import { useState } from "react";
import axios from "axios";

export default function ItemSearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchItems = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/items/items/search?q=${value}`,
        {
          withCredentials: true,
        },
      );

      setResults(res.data.data || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* MODAL */}
      <div className="bg-white text-gray-900 w-[600px] rounded-xl p-4 shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg text-gray-800">Select Item</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* SEARCH INPUT */}
        <input
          value={query}
          onChange={(e) => searchItems(e.target.value)}
          placeholder="Search item code or name"
          className="w-full border p-2 rounded-lg mb-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* RESULTS */}
        <div className="max-h-60 overflow-y-auto border rounded-lg">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b transition"
              >
                <div className="font-medium text-gray-800">
                  {item.item_code}
                </div>
                <div className="text-sm text-gray-500">{item.item_name}</div>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-sm text-center">
              No items found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
