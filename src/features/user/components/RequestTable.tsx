// src/features/user/components/RequestTable.tsx
import React from "react";
import type { Request } from "../../../data/requestsData";

interface RequestTableProps {
  requests: Request[];
  permission: "view" | "edit";
}

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  permission,
}) => {
  return (
    <div className="overflow-auto bg-white rounded shadow p-4">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Created By</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="text-center">
              <td className="p-2 border">{req.title}</td>
              <td className="p-2 border">{req.description}</td>
              <td className="p-2 border">{req.createdBy}</td>
              <td className="p-2 border">{req.status}</td>
              <td className="p-2 border">
                {permission === "edit" ? (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 mr-2 rounded">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">View Only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
