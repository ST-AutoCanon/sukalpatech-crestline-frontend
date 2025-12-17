// src/features/procurement/pages/Store.tsx
import React, { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useProcurement } from "../../hooks/useProcurement";

const Store: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { prs, loading } = useProcurement(token!);

  if (loading) return <p className="p-6">Loading PRs...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Store / Inventory</h2>
    <h1>Welcome to store</h1>
    </div>
  );
};

export default Store;
