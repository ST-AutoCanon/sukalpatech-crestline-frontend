// import React, { useContext } from "react";
// import { AuthContext } from "../../../../context/AuthContext";
// import { useEmployee } from "../../hooks/useEmployee";

// export default function Finance() {
//   const { user, token } = useContext(AuthContext);
//   const { departments } = useEmployee(user.email, token!);

//   if (user.role === "admin") {
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>store Department</h2>
//         <p>Permission: full (admin)</p>
//         <p>You can view and edit everything here.</p>
//       </div>
//     );
//   }

//   const dept = departments.find((d) => d.name.toLowerCase() === "finance");
//   if (!dept) return null;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Store Department</h2>
//       <p>Permission: {dept.permission}</p>
//       {dept.permission === "edit" ? (
//         <p>You can edit finance records here.</p>
//       ) : (
//         <p>You can only view finance records.</p>
//       )}
//     </div>
//   );
// }


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
