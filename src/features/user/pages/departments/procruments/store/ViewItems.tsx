import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
}

const ViewItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const savedItems: Item[] = JSON.parse(
      localStorage.getItem("items") || "[]"
    );
    setItems(savedItems);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>View Items</h2>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: 8 }}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewItems;
