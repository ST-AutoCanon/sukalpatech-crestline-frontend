import { useState } from "react";

interface Item {
  id: number;
  name: string;
}

const AddItem: React.FC = () => {
  const [itemName, setItemName] = useState<string>("");

  const handleAdd = () => {
    if (itemName.trim() === "") {
      alert("Please enter an item name.");
      return;
    }

    const savedItems: Item[] = JSON.parse(
      localStorage.getItem("items") || "[]"
    );

    const newItem: Item = {
      id: Date.now(),
      name: itemName,
    };

    const updatedItems = [...savedItems, newItem];

    localStorage.setItem("items", JSON.stringify(updatedItems));

    alert("Item added!");
    setItemName("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Item</h2>

      <input
        type="text"
        placeholder="Enter item name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        style={{ padding: 8, width: 250 }}
      />

      <button
        onClick={handleAdd}
        style={{ marginLeft: 10, padding: "8px 20px" }}
      >
        Add
      </button>
    </div>
  );
};

export default AddItem;
