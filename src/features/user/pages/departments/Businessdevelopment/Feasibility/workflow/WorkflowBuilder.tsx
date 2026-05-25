// import React, { useState } from "react";
// import {
//   DndContext,
//   closestCenter,
//   useSensor,
//   useSensors,
//   PointerSensor,
//   DragEndEvent,
// } from "@dnd-kit/core";

// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// import { CSS } from "@dnd-kit/utilities";

// /* ================= TYPES ================= */
// export interface WorkflowItem {
//   id: string;
//   department: string;
// }

// interface WorkflowBuilderProps {
//   onChange: (workflow: WorkflowItem[]) => void;
// }

// /* ================= SINGLE ROW ================= */
// interface SortableItemProps {
//   item: WorkflowItem;
//   index: number;
//   updateDept: (index: number, value: string) => void;
//   remove: (index: number) => void;
// }

// const SortableItem: React.FC<SortableItemProps> = ({
//   item,
//   index,
//   updateDept,
//   remove,
// }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: item.id });

//   const style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="flex items-center gap-2 p-2 bg-white border rounded mb-2"
//     >
//       {/* Drag Handle */}
//       <div {...attributes} {...listeners} className="cursor-grab px-2">
//         ☰
//       </div>

//       {/* Department Input */}
//       <input
//         value={item.department}
//         onChange={(e) => updateDept(index, e.target.value)}
//         placeholder="Department name"
//         className="border p-1 flex-1 text-sm"
//       />

//       {/* Order */}
//       <span className="text-xs text-gray-500">#{index + 1}</span>

//       {/* Remove */}
//       <button onClick={() => remove(index)} className="text-red-500 text-sm">
//         ✕
//       </button>
//     </div>
//   );
// };

// /* ================= MAIN COMPONENT ================= */
// const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onChange }) => {
//   const [workflow, setWorkflow] = useState<WorkflowItem[]>([
//     { id: "1", department: "BD" },
//     { id: "2", department: "ENGINEERING" },
//   ]);

//   const sensors = useSensors(useSensor(PointerSensor));

//   /* ================= DRAG END ================= */
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (!over || active.id === over.id) return;

//     const oldIndex = workflow.findIndex((i) => i.id === active.id);
//     const newIndex = workflow.findIndex((i) => i.id === over.id);

//     const newOrder = arrayMove(workflow, oldIndex, newIndex);
//     setWorkflow(newOrder);
//     onChange(newOrder);
//   };

//   /* ================= UPDATE DEPARTMENT ================= */
//   const updateDept = (index: number, value: string) => {
//     const updated = [...workflow];
//     updated[index].department = value;
//     setWorkflow(updated);
//     onChange(updated);
//   };

//   /* ================= ADD STEP ================= */
//   const addStep = () => {
//     const newStep: WorkflowItem = {
//       id: Date.now().toString(),
//       department: "",
//     };

//     const updated = [...workflow, newStep];
//     setWorkflow(updated);
//     onChange(updated);
//   };

//   /* ================= REMOVE STEP ================= */
//   const removeStep = (index: number) => {
//     const updated = workflow.filter((_, i) => i !== index);
//     setWorkflow(updated);
//     onChange(updated);
//   };

//   return (
//     <div className="p-4 border rounded bg-gray-50">
//       <h2 className="font-semibold mb-3">Workflow Builder</h2>

//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={workflow.map((i) => i.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           {workflow.map((item, index) => (
//             <SortableItem
//               key={item.id}
//               item={item}
//               index={index}
//               updateDept={updateDept}
//               remove={removeStep}
//             />
//           ))}
//         </SortableContext>
//       </DndContext>

//       <button
//         onClick={addStep}
//         className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm"
//       >
//         + Add Department
//       </button>
//     </div>
//   );
// };

// export default WorkflowBuilder;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


  const API_BASE2 = `${import.meta.env.VITE_BACKEND_URL}/api/departments`;
/* ================= TYPES ================= */
export interface WorkflowItem {
  id: string;
  department: string;
}
interface Department {
  department_id: number;
  name: string;
}

interface WorkflowBuilderProps {
  workflow: WorkflowItem[]; // ✅ added
  onChange: (workflow: WorkflowItem[]) => void;
}

/* ================= SINGLE ROW ================= */
interface SortableItemProps {
  item: WorkflowItem;
  index: number;
  updateDept: (index: number, value: string) => void;
  remove: (index: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  index,
  updateDept,
  remove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const [departments, setDepartments] = useState([]);
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE2}`, {
          withCredentials: true, // ✅ required for HTTP-only cookie
        });

        console.log(res.data.data);
        setDepartments(res.data.data);
      } catch (err) {
        console.error("Department fetch error", err);
      }
    };

    fetchDepartments();
  }, []);
  const formatDepartment = (name: string) => {
  return name
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("_");
};


  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-white border rounded mb-2"
    >
      <div {...attributes} {...listeners} className="cursor-grab px-2">
        ☰
      </div>

      {/* <input
        value={item.department}
        onChange={(e) => updateDept(index, e.target.value)}
        placeholder="Department name"
        className="border p-1 flex-1 text-sm"
      /> */}

      <select
        value={item.department}
        onChange={(e) => updateDept(index, e.target.value)}
        className="border p-1 flex-1 text-sm bg-white"
      >
        <option value="">Select Department</option>

        {departments.map((dept) => (
          <option key={dept.department_id} value={dept.name}>
            {formatDepartment(dept.name)}
          </option>
        ))}
      </select>

      <span className="text-xs text-gray-500">#{index + 1}</span>

      <button onClick={() => remove(index)} className="text-red-500 text-sm">
        ✕
      </button>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onChange,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = workflow.findIndex((i) => i.id === active.id);
    const newIndex = workflow.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(workflow, oldIndex, newIndex);
    onChange(newOrder);
  };

  const updateDept = (index: number, value: string) => {
    const updated = [...workflow];
    updated[index].department = value;
    onChange(updated);
  };

  const addStep = () => {
    const newStep: WorkflowItem = {
      id: Date.now().toString(),
      department: "",
    };

    onChange([...workflow, newStep]);
  };

  const removeStep = (index: number) => {
    const updated = workflow.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="font-semibold mb-3">Workflow Builder</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workflow.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {workflow.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              updateDept={updateDept}
              remove={removeStep}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={addStep}
        className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        + Add Department
      </button>
    </div>
  );
};

export default WorkflowBuilder;