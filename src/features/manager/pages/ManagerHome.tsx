// // export default function ManagerHome() {
// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
// //       <p className="mt-2 text-gray-600">Welcome to the Manager Panel.</p>
// //     </div>
// //   );
// // }


// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// export default function ManagerHome() {
//   // Dummy data (replace with API data)
//   const stats = {
//     total: 24,
//     completed: 12,
//     pending: 8,
//     rejected: 4,
//   };

//   const chartData = [
//     { name: "Completed", value: stats.completed },
//     { name: "Pending", value: stats.pending },
//     { name: "Rejected", value: stats.rejected },
//   ];

//   const COLORS = ["#22c55e", "#eab308", "#ef4444"];

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c]">
//       {/* HEADER */}
//       <div className="mb-6 mt-10 flex flex-col gap-4">
//         <h1 className="text-3xl font-bold text-gray-100">
//           Manager Dashboard
//         </h1>

//         <p className="text-gray-100 mt-1">
//           Welcome to the Manager Panel.
//         </p>
//       </div>

//       {/* STATS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         {/* Total */}
//         <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
//           <p className="text-gray-500 text-sm">Total Projects</p>

//           <h2 className="text-3xl font-bold mt-2 text-blue-600">
//             {stats.total}
//           </h2>
//         </div>

//         {/* Completed */}
//         <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
//           <p className="text-gray-500 text-sm">Completed</p>

//           <h2 className="text-3xl font-bold mt-2 text-green-600">
//             {stats.completed}
//           </h2>
//         </div>

//         {/* Pending */}
//         <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
//           <p className="text-gray-500 text-sm">Pending</p>

//           <h2 className="text-3xl font-bold mt-2 text-yellow-600">
//             {stats.pending}
//           </h2>
//         </div>

//         {/* Rejected */}
//         <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">
//           <p className="text-gray-500 text-sm">Rejected</p>

//           <h2 className="text-3xl font-bold mt-2 text-red-600">
//             {stats.rejected}
//           </h2>
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* BAR CHART */}
//         <div className="bg-white rounded-xl shadow p-5">
//           <h2 className="text-lg font-semibold mb-4">
//             Project Status Overview
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />

//               <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//                 {chartData.map((_, index) => (
//                   <Cell key={index} fill={COLORS[index]} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* PIE CHART */}
//         <div className="bg-white rounded-xl shadow p-5">
//           <h2 className="text-lg font-semibold mb-4">
//             Projects Distribution
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={chartData}
//                 dataKey="value"
//                 nameKey="name"
//                 outerRadius={100}
//                 label
//               >
//                 {chartData.map((_, index) => (
//                   <Cell key={index} fill={COLORS[index]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// interface Project {
//   id: number;
//   status?: string;
//   name?: string;

//   // IMPORTANT:
//   // change this key according to your backend response
//   current_department?: string;
// }

// interface StatusType {
//   project_id: number;
//   department: string;
//   status: string;
//   updated_at: string;
// }

// export default function ManagerHome() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [allStatuses, setAllStatuses] = useState<
//     StatusType[]
//   >([]);

//   const departments = [
//     "engineering_design",
//     "fabrication_structure",
//     "quality_control",
//     "stores_materials",
//   ];

//   const [activeDepartment, setActiveDepartment] =
//     useState(departments[0]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         // ================= FETCH PROJECTS =================

//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/project`,
//           {
//             withCredentials: true,
//           }
//         );

//         const projectData = res.data.data || [];

//         setProjects(projectData);

//         console.log("PROJECTS:", projectData);

//         // ================= FETCH ALL STATUSES =================

//         const statusPromises = projectData.map(
//           (project: Project) =>
//             axios.get(
//               `${import.meta.env.VITE_BACKEND_URL}/api/project/status/${project.id}`,
//               {
//                 withCredentials: true,
//               }
//             )
//         );

//         const statusResponses = await Promise.all(
//           statusPromises
//         );

//         const mergedStatuses =
//           statusResponses.flatMap(
//             (res) => res.data.data || []
//           );

//         setAllStatuses(mergedStatuses);

//         console.log(
//           "ALL STATUSES:",
//           mergedStatuses
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // =========================================================
//   // ASSIGNED PROJECTS FOR ACTIVE DEPARTMENT
//   // =========================================================

//   const assignedProjects = projects.filter(
//     (project) =>
//       project.current_department?.toLowerCase() ===
//       activeDepartment.toLowerCase()
//   );

//   // =========================================================
//   // TOTAL ASSIGNED PROJECTS
//   // =========================================================

//   const total = assignedProjects.length;

//   // =========================================================
//   // GET PROJECT IDS
//   // =========================================================

//   const assignedProjectIds = assignedProjects.map(
//     (project) => project.id
//   );

//   // =========================================================
//   // FILTER STATUSES FOR ACTIVE DEPARTMENT
//   // =========================================================

//   const filteredStatuses = allStatuses.filter(
//     (status) =>
//      assignedProjectIds.includes(status.project_management_id) &&
//       status.department?.toLowerCase() ===
//         activeDepartment.toLowerCase()
//   );

//   // =========================================================
//   // KEEP ONLY LATEST STATUS OF EACH PROJECT
//   // =========================================================

//   const latestProjectStatusMap = new Map();

//   filteredStatuses.forEach((status) => {
//     const existing =
//       latestProjectStatusMap.get(
//   status.project_management_id
// )

//     if (
//       !existing ||
//       new Date(status.updated_at) >
//         new Date(existing.updated_at)
//     ) {
//       latestProjectStatusMap.set(
//   status.project_management_id,
//   status
// );
//     }
//   });

//   const departmentStatuses = Array.from(
//     latestProjectStatusMap.values()
//   );

//   // =========================================================
//   // COUNTS
//   // =========================================================

//   const approved = departmentStatuses.filter(
//     (status) =>
//       status.status?.toUpperCase() ===
//       "APPROVED"
//   ).length;

//   const pending = departmentStatuses.filter(
//     (status) =>
//       status.status?.toUpperCase() ===
//       "PENDING"
//   ).length;

//   const rejected = departmentStatuses.filter(
//     (status) =>
//       status.status?.toUpperCase() ===
//       "REJECTED"
//   ).length;

//   // =========================================================
//   // CHART DATA
//   // =========================================================

//   const chartData = [
//     {
//       name: "Completed",
//       value: approved,
//     },

//     {
//       name: "Pending",
//       value: pending,
//     },

//     {
//       name: "Rejected",
//       value: rejected,
//     },
//   ];

//   const COLORS = [
//     "#22c55e",
//     "#eab308",
//     "#ef4444",
//   ];

//   // =========================================================
//   // FORMAT DEPARTMENT NAME
//   // =========================================================

//   const formatDepartment = (
//     dept: string
//   ) => {
//     return dept
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (char) =>
//         char.toUpperCase()
//       );
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c]">
//       {/* HEADER */}

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white">
//           Manager Dashboard
//         </h1>

//         <p className="text-gray-200 mt-2">
//           Department-wise Project Analytics
//         </p>
//       </div>

//       {/* TABS */}

//       <div className="flex flex-wrap gap-4 mb-8">
//         {departments.map((dept) => (
//           <button
//             key={dept}
//             onClick={() =>
//               setActiveDepartment(dept)
//             }
//             className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300

//             ${
//               activeDepartment === dept
//                 ? "bg-white text-[#2d2a8c] shadow-lg scale-105"
//                 : "bg-white/20 text-white hover:bg-white hover:text-[#2d2a8c]"
//             }
//           `}
//           >
//             {formatDepartment(dept)}
//           </button>
//         ))}
//       </div>

//       {/* MAIN CARD */}

//       <div className="bg-white rounded-2xl shadow-xl p-6">
//         {/* TITLE */}

//         <h2 className="text-2xl font-bold text-[#2d2a8c] mb-8">
//           {formatDepartment(activeDepartment)}
//         </h2>

//         {/* STATS */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
//           {/* TOTAL */}

//           <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
//             <p className="text-gray-600 text-sm">
//               Total Assigned Projects
//             </p>

//             <h2 className="text-3xl font-bold text-blue-600 mt-2">
//               {total}
//             </h2>
//           </div>

//           {/* COMPLETED */}

//           <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
//             <p className="text-gray-600 text-sm">
//               Completed
//             </p>

//             <h2 className="text-3xl font-bold text-green-600 mt-2">
//               {approved}
//             </h2>
//           </div>

//           {/* PENDING */}

//           <div className="bg-yellow-50 rounded-xl p-5 border-l-4 border-yellow-500">
//             <p className="text-gray-600 text-sm">
//               Pending
//             </p>

//             <h2 className="text-3xl font-bold text-yellow-600 mt-2">
//               {pending}
//             </h2>
//           </div>

//           {/* REJECTED */}

//           <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
//             <p className="text-gray-600 text-sm">
//               Rejected
//             </p>

//             <h2 className="text-3xl font-bold text-red-600 mt-2">
//               {rejected}
//             </h2>
//           </div>
//         </div>

//         {/* CHART */}

//         <div className="w-full h-[350px]">
//           <ResponsiveContainer
//             width="100%"
//             height="100%"
//           >
//             <BarChart data={chartData}>
//               <XAxis dataKey="name" />

//               <YAxis />

//               <Tooltip />

//               <Bar
//                 dataKey="value"
//                 barSize={60}
//                 radius={[10, 10, 0, 0]}
//               >
//                 {chartData.map(
//                   (_, index) => (
//                     <Cell
//                       key={index}
//                       fill={COLORS[index]}
//                     />
//                   )
//                 )}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

/* =========================================================
   TYPES
========================================================= */

interface Project {
  id: number;
  status?: string;
  name?: string;
}

interface StatusType {
  id: number;
  project_management_id: number;
  department: string;
  status: string;
  updated_at: string;
}

interface WorkflowType {
  id: number;
  project_management_id: number;
  department: string;
  sequence: number;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ManagerHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowType[]>([]);
  const [allStatuses, setAllStatuses] = useState<StatusType[]>([]);

  const [activeDepartment, setActiveDepartment] = useState("");

  // GET UNIQUE DEPARTMENTS FROM ALL WORKFLOW

  const departments = Array.from(
    new Set(
      workflow
        .map((w) => w.department?.toLowerCase())
        .filter(Boolean)
    )
  );

  useEffect(() => {
    if (departments.length > 0 && !activeDepartment) {
      setActiveDepartment(departments[0]);
    }
  }, [departments, activeDepartment]);


  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ================= PROJECTS =================

        const projectRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/project`,
          {
            withCredentials: true,
          }
        );

        const projectData =
          projectRes.data.data || [];

        setProjects(projectData);


        // ================= WORKFLOW =================

        const workflowPromises = projectData.map(
          (project: Project) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/project/${project.id}/workflow`,
              {
                withCredentials: true,
              }
            )
        );

        const workflowResponses =
          await Promise.all(workflowPromises);

        const mergedWorkflow =
          workflowResponses.flatMap(
            (res) => res.data.data || []
          );

        setWorkflow(mergedWorkflow);



        // ================= STATUSES =================

        const statusPromises = projectData.map(
          (project: Project) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/project/status/${project.id}`,
              {
                withCredentials: true,
              }
            )
        );

        const statusResponses =
          await Promise.all(statusPromises);

        const mergedStatuses =
          statusResponses.flatMap(
            (res) => res.data.data || []
          );

        setAllStatuses(mergedStatuses);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  /* =========================================================
     WORKFLOW ASSIGNED PROJECTS
  ========================================================= */

  // GET FIRST DEPARTMENT OF EACH PROJECT

  /* =========================================================
     CURRENT ACTIVE WORKFLOW DEPARTMENT
  ========================================================= */

  /* =========================================================
     ASSIGNED PROJECTS BASED ON WORKFLOW MOVEMENT
  ========================================================= */

  const assignedProjectIds = projects
    .filter((project) => {
      // workflow for project
      const projectWorkflow = workflow
        .filter(
          (w) =>
            w.project_management_id ===
            project.id
        )
        .sort(
          (a, b) => a.sequence - b.sequence
        );

      // current active department step
      const currentStep =
        projectWorkflow.find(
          (w) =>
            w.department?.toLowerCase() ===
            activeDepartment.toLowerCase()
        );

      if (!currentStep) return false;

      // statuses for this project + department
      const deptStatuses =
        allStatuses.filter(
          (s) =>
            s.project_management_id ===
            project.id &&
            s.department?.toLowerCase() ===
            activeDepartment.toLowerCase()
        );

      // NO STATUS YET = ASSIGNED
      return deptStatuses.length === 0;
    })
    .map((p) => p.id);

  /* =========================================================
     TOTAL ASSIGNED
  ========================================================= */

  const total = assignedProjectIds.length;
  /* =========================================================
     FILTER STATUSES
  ========================================================= */

  const filteredStatuses = allStatuses.filter(
    (status) =>
      status.department?.toLowerCase() ===
      activeDepartment.toLowerCase()
  );

  /* =========================================================
     LATEST STATUS OF EACH PROJECT
  ========================================================= */

  const latestMap = new Map();

  filteredStatuses.forEach((status) => {
    const existing = latestMap.get(
      status.project_management_id
    );

    if (
      !existing ||
      new Date(status.updated_at) >
      new Date(existing.updated_at)
    ) {
      latestMap.set(
        status.project_management_id,
        status
      );
    }
  });

  const departmentStatuses = Array.from(
    latestMap.values()
  );

  /* =========================================================
     COUNTS
  ========================================================= */
  const inProgress = departmentStatuses.filter(
    (s) =>
      s.status?.toUpperCase() ===
      "IN_PROGRESS"
  ).length;

  const approved = departmentStatuses.filter(
    (s) =>
      s.status?.toUpperCase() ===
      "APPROVED"
  ).length;

  const pending = departmentStatuses.filter(
    (s) =>
      s.status?.toUpperCase() ===
      "PENDING"
  ).length;

  const rejected = departmentStatuses.filter(
    (s) =>
      s.status?.toUpperCase() ===
      "REJECTED"
  ).length;

  console.log({
    activeDepartment,
    total,
    inProgress,
    approved,
    pending,
    rejected,
    departmentStatuses,
  });

  /* =========================================================
     CHART DATA
  ========================================================= */

  const chartData = [
    {
      name: "Completed",
      value: approved,
    },

    {
      name: "In Progress",
      value: inProgress,
    },

    {
      name: "Pending",
      value: pending,
    },

    {
      name: "Rejected",
      value: rejected,
    },
  ];

  const COLORS = [
    "#22c55e", // completed
    "#3b82f6", // in progress
    "#eab308", // pending
    "#ef4444", // rejected
  ];

  /* =========================================================
     FORMAT DEPARTMENT
  ========================================================= */

  const formatDepartment = (
    dept: string
  ) => {
    return dept
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c]">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Manager Dashboard
        </h1>

        <p className="text-gray-200 mt-2">
          Department-wise Project Analytics
        </p>
      </div>

      {/* TABS */}

      <div className="flex flex-wrap gap-4 mb-8">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() =>
              setActiveDepartment(dept)
            }
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300
            
            ${activeDepartment === dept
                ? "bg-white text-[#2d2a8c] shadow-lg scale-105"
                : "bg-white/20 text-white hover:bg-white hover:text-[#2d2a8c]"
              }
          `}
          >
            {formatDepartment(dept)}
          </button>
        ))}
      </div>

      {/* MAIN CARD */}

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* TITLE */}

        <h2 className="text-2xl font-bold text-[#2d2a8c] mb-8">
          {formatDepartment(
            activeDepartment
          )}
        </h2>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* TOTAL */}

          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">
              Total Assigned Projects
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {total}
            </h2>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">
              In_Progress
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {inProgress}
            </h2>
          </div>

          {/* COMPLETED */}

          <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">
              Completed
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {approved}
            </h2>
          </div>

          {/* PENDING */}

          <div className="bg-yellow-50 rounded-xl p-5 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {pending}
            </h2>
          </div>

          {/* REJECTED */}

          <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {rejected}
            </h2>
          </div>
        </div>

        {/* CHART */}

        <div className="w-full h-[380px] bg-white rounded-2xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 40,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94A3B8"
                strokeOpacity={1}
              />

              <XAxis
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 13 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "#1F2937", fontSize: 13, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "No. of Projects",
                  angle: -90,
                  position: "left",
                  style: {
                    fill: "#4B5563",
                    fontSize: 15,
                    fontWeight: 700,
                  },
                }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                }}
              />

              <Bar
                dataKey="value"
                radius={[12, 12, 0, 0]}
                maxBarSize={55}
                isAnimationActive
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}