// import React, { useEffect, useState } from "react";
// import { api } from "../../user/api/businessApi";
// import WorkflowBuilder from "../../user/pages/departments/Businessdevelopment/Feasibility/workflow/WorkflowBuilder";
// import ALeart from "../../user/components/Aleartmessage";

// interface Props {
//   data: any;
//   onUpdate: () => void;
// }

// const ProjectManagerCard: React.FC<Props> = ({ data, onUpdate }) => {
//   const [workflow, setWorkflow] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState(false);

//   const [alert, setAlert] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   // ================= FETCH WORKFLOW =================
//   useEffect(() => {
//     if (!data?.id) return;

//     const fetchWorkflow = async () => {
//       try {
//         const res = await api.get(`/project/${data.id}/workflow`, {
//           withCredentials: true,
//         });

//         const formatted = (res.data.data || []).map((item: any) => ({
//           id: item.id?.toString(),
//           department: item.department,
//         }));

//         setWorkflow(formatted);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchWorkflow();
//   }, [data]);

//   // ================= SAVE WORKFLOW =================
//   const handleSaveWorkflow = async () => {
//     try {
//       if (workflow.length === 0) {
//         setAlert({
//           type: "error",
//           message: "Please add departments",
//         });
//         return;
//       }

//       await api.put(
//         `/project/${data.id}/workflow`,
//         {
//           workflow: workflow.map((item, index) => ({
//             department: item.department,
//             sequence: index + 1,
//           })),
//         },
//         { withCredentials: true }
//       );

//       await api.post(
//         "/project/status",
//         {
//           project_management_id: data.id,
//           department: "PROJECT_MANAGER",
//           status: "APPROVED",
//           comments: "Workflow created",
//         },
//         { withCredentials: true }
//       );

//       setAlert({
//         type: "success",
//         message: "Workflow saved successfully!",
//       });

//       onUpdate();

//       setTimeout(() => setShowModal(false), 1200);
//     } catch (err: any) {
//       setAlert({
//         type: "error",
//         message: err.response?.data?.message || "Failed to save workflow",
//       });
//     }
//   };

//   return (
//     <>
//       {/* ================= CARD (LIKE ProjectPage) ================= */}
//       <div
//         onClick={() => setShowModal(true)}
//         className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col min-h-[180px] cursor-pointer"
//       >
//         <h2 className="text-purple-600 font-semibold text-lg mb-2">
//           Project ID: {data.id}
//         </h2>

//         <div className="flex-1 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span className="text-gray-500">Description</span>
//             <span className="font-medium truncate ml-2">
//               {data.description || "-"}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-gray-500">Required Date</span>
//             <span className="font-medium">
//               {new Date(data.required_date).toLocaleDateString()}
//             </span>
//           </div>
//         </div>

//         <span className="text-blue-600 text-sm font-medium mt-3">
//           Manage Workflow →
//         </span>
//       </div>

//       {/* ================= MODAL ================= */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
//           <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">

//             {alert && (
//               <ALeart
//                 type={alert.type}
//                 message={alert.message}
//                 onClose={() => setAlert(null)}
//               />
//             )}

//             <h2 className="text-xl font-bold mb-4 text-purple-700">
//               Workflow Builder (Project ID: {data.id})
//             </h2>

//             {/* WORKFLOW BUILDER */}
//             <WorkflowBuilder
//               workflow={workflow}
//               onChange={setWorkflow}
//             />

//             {/* ACTIONS */}
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSaveWorkflow}
//                 className="bg-green-600 text-white px-5 py-2 rounded"
//               >
//                 Save Workflow
//               </button>
//             </div>

//             {/* CLOSE ICON */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-4 text-2xl text-gray-600"
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProjectManagerCard;


import React, { useEffect, useState, useContext } from "react";
import { api } from "../../user/api/businessApi";
import WorkflowBuilder from "../../user/pages/departments/Businessdevelopment/Feasibility/workflow/WorkflowBuilder";
import ALeart from "../../user/components/Aleartmessage";
import { AuthContext } from "../../../context/AuthContext";

interface Props {
  data: any;
  onUpdate: () => void;
   isUpdateMode?: boolean;
}

const ProjectManagerCard: React.FC<Props> = ({ data, onUpdate,isUpdateMode }) => {
  const [workflow, setWorkflow] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [selectedManager, setSelectedManager] = useState("");
  

  const { user }: any = useContext(AuthContext);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const handleAssignManager = async () => {
  try {
    if (!selectedManager) {
      setAlert({
        type: "error",
        message: "Please select project manager",
      });

      return;
    }

  await api.put(
  `/project-manager/projects/${data.id}/assign-manager`,
  {
    assigned_project_manager: selectedManager.toLowerCase(),
  },
  { withCredentials: true }
);

    setAlert({
      type: "success",
      message: `Assigned to ${selectedManager}`,
    });

    setTimeout(() => {
      setShowModal(false);
      onUpdate();
    }, 1500);

  } catch (err: any) {
    console.error(err);

    setAlert({
      type: "error",
      message:
        err.response?.data?.message ||
        "Failed to assign manager",
    });
  }
};

  // ================= FETCH WORKFLOW =================
  // useEffect(() => {
  //   if (!data?.id) return;

  //   const fetchWorkflow = async () => {
  //     try {
  //       const res = await api.get(`/project/${data.id}/workflow`, {
  //         withCredentials: true,
  //       });

  //       const formatted = (res.data.data || []).map((item: any) => ({
  //         id: item.id?.toString(),
  //         department: item.department,
  //       }));

  //       setWorkflow(formatted);

  //       // existing project id if available
  //       if (res.data.project_id) {
  //         setProjectId(res.data.project_id);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchWorkflow();
  // }, [data]);

  // ================= ASSIGN PROJECT =================
  // const handleAssignProject = async () => {
  //   try {
  //     console.log("🚀 Assigning project for BD:", data.id);

  //     const res = await api.post(
  //       "/project/assign",
  //       {
  //         bd_request_id: data.id,
  //         description: data.description,
  //         required_date: data.required_date,
  //         assigned_by: user.first_name,
  //       },
  //       { withCredentials: true }
  //     );

  //     console.log("✅ PROJECT CREATED:", res.data);

  //     const createdProject = res.data.data;

  //     setProjectId(createdProject.id);

  //     return createdProject.id;

  //   } catch (err: any) {
  //     console.error("❌ ASSIGN PROJECT ERROR:", err?.response || err);

  //     // ================= PROJECT ALREADY EXISTS =================
  //     if (
  //       err.response?.data?.message === "Project already exists"
  //     ) {
  //       try {
  //         // fetch existing project id
  //         const existingRes = await api.get(
  //           `/project/by-bd/${data.id}`,
  //           { withCredentials: true }
  //         );

  //         const existingProject = existingRes.data.data;

  //         console.log("✅ EXISTING PROJECT:", existingProject);

  //         setProjectId(existingProject.id);

  //         setAlert({
  //           type: "success",
  //           message: "Project already assigned",
  //         });

  //         return existingProject.id;

  //       } catch (fetchErr) {
  //         console.error(fetchErr);

  //         throw new Error(
  //           "Project exists but failed to fetch details"
  //         );
  //       }
  //     }

  //     throw new Error(
  //       err.response?.data?.message || "Assignment failed"
  //     );
  //   }
  // };
  // // ================= SAVE WORKFLOW =================
  // const handleSaveWorkflow = async () => {
  //   try {
  //     if (workflow.length === 0) {
  //       setAlert({
  //         type: "error",
  //         message: "Please add departments",
  //       });
  //       return;
  //     }

  //     let currentProjectId = projectId;

  //     // STEP 1 → Assign Project First
  //     if (!currentProjectId) {
  //       currentProjectId = await handleAssignProject();
  //     }

  //     // STEP 2 → Save Workflow
  //     await api.put(
  //       `/project/${currentProjectId}/workflow`,
  //       {
  //         workflow: workflow.map((item, index) => ({
  //           department: item.department,
  //           sequence: index + 1,
  //         })),
  //       },
  //       { withCredentials: true }
  //     );

  //     // STEP 3 → Update Status
  //     await api.post(
  //       "/project/status",
  //       {
  //         project_management_id: currentProjectId,
  //         department: "PROJECT_MANAGER",
  //         status: "APPROVED",
  //         comments: "Workflow created",
  //       },
  //       { withCredentials: true }
  //     );

  //     // ✅ SHOW ALERT
  //     // ✅ SHOW SUCCESS ALERT
  //     setAlert({
  //       type: "success",
  //       message: "Workflow saved successfully!",
  //     });

  //     // ✅ KEEP ALERT VISIBLE
  //     setTimeout(() => {
  //       setShowModal(false);
  //     }, 2000);

  //     // ✅ REFRESH AFTER MODAL CLOSES
  //     setTimeout(() => {
  //       setAlert(null);
  //       onUpdate();
  //     }, 2500);
  //   } catch (err: any) {
  //     console.error(err);

  //     setAlert({
  //       type: "error",
  //       message:
  //         err.response?.data?.message ||
  //         err.message ||
  //         "Failed to save workflow",
  //     });
  //   }
  // };

  return (
    <>
      {/* ================= CARD ================= */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col min-h-[180px] cursor-pointer"      >
        <h2 className="text-purple-600 font-semibold text-lg mb-2">
          Project ID: {data.id}
        </h2>

        <div className="flex-1 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Description</span>
            <span className="font-medium truncate ml-2">
              {data.description || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Required Date</span>
            <span className="font-medium">
              {new Date(data.required_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Assigned Date</span>
            <span className="font-medium">
              {data.assigned_date
                ? new Date(data.assigned_date).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Assigned By</span>
            <span className="font-medium truncate ml-2">
              {data.assigned_by || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Created At</span>
            <span className="font-medium">
              {data.created_at
                ? new Date(data.created_at).toLocaleDateString()
                : "-"}
            </span>
          </div>


        </div>



        <span className="text-blue-600 text-sm font-medium mt-3">
          View Details →
        </span>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50 px-2 sm:px-4">
          <div className="bg-white w-full max-w-4xl rounded shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">

            {/* HEADER */}
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Project Manager Details
            </h2>

            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>

            {/* ALERT */}
            {alert && (
              <div className="mt-4 sticky top-0 z-50">
                <ALeart
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}

            {/* ================= PROJECT DETAILS ================= */}
            <div className="bg-gray-100 p-4 rounded mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-xs font-medium">
                    BD Request ID
                  </label>

                  <input
                    readOnly
                    value={data.bd_request_id || ""}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Project ID
                  </label>

                  <input
                    readOnly
                    value={data.id}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Required Date
                  </label>

                  <input
                    readOnly
                    value={
                      data.required_date
                        ? new Date(data.required_date).toLocaleDateString()
                        : "-"
                    }
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">
                    Assigned Date
                  </label>

                  <input
                    readOnly
                    value={
                      data.assigned_date
                        ? new Date(data.assigned_date).toLocaleDateString()
                        : "-"
                    }
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Assigned By
                  </label>

                  <input
                    readOnly
                    value={data.assigned_by || "-"}
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Created At
                  </label>

                  <input
                    readOnly
                    value={
                      data.created_at
                        ? new Date(data.created_at).toLocaleDateString()
                        : "-"
                    }
                    className="border p-2 rounded w-full bg-white text-sm"
                  />
                </div>



                <div>
                  <label className="text-xs font-medium">
                    Status
                  </label>

                  <input
  readOnly
 value={
  data.assigned_project_manager
    ? "Assigned"
    : "Pending"
}
  className={`border p-2 rounded w-full text-sm font-medium ${
  data.assigned_project_manager
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700"
}`}
/>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium">
                    Description
                  </label>

                  <textarea
                    readOnly
                    value={data.description || ""}
                    className="border p-2 rounded w-full bg-white text-sm"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* ================= ASSIGN BUTTON ================= */}
        {isUpdateMode && (
  <div className="bg-gray-100 p-4 rounded mt-6">
    <h3 className="font-semibold mb-4">
      Assign To Project Manager
    </h3>

    <select
      value={selectedManager}
      onChange={(e) => setSelectedManager(e.target.value)}
      className="border p-2 rounded w-full"
    >
      <option value="">Select Project Manager</option>
      <option value="project_manager_a">Project Manager A</option>
      <option value="project_manager_b">Project Manager B</option>
      <option value="project_manager_c">Project Manager C</option>
      <option value="project_manager_d">Project Manager D</option>
      <option value="project_manager_e">Project Manager E</option>
    </select>

    <div className="flex justify-end mt-4">
      <button
        onClick={handleAssignManager}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
      >
        Assign
      </button>
    </div>
  </div>
)}
            {/* ================= WORKFLOW BUILDER ================= */}
            {projectId && (
              <div className="mt-8 border border-gray-200 rounded p-4">

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    Workflow Builder
                  </h3>

                  <span className="text-green-600 text-sm font-medium">
                    Project Assigned
                  </span>
                </div>

                <WorkflowBuilder
                  workflow={workflow}
                  onChange={setWorkflow}
                />

                
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectManagerCard;