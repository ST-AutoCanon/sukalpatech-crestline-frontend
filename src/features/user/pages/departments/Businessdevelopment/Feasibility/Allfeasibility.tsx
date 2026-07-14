import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../../api/businessApi";
import ALeart from "../../../../components/Aleartmessage";
import { AuthContext } from "../../../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import WorkflowBuilder from "../Feasibility/workflow/WorkflowBuilder";

interface FeasibilityCardProps {
  data: any;
  mode: "all" | "update" | "bd-update";
  onUpdate: (updated: any) => void;

}


const FeasibilityCard: React.FC<FeasibilityCardProps> = ({
  data,
  mode,
  onUpdate
}) => {
  if (!data) return null;

  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);




  // Feasibility states
  const [feasibility_status, setFeasibilityStatus] = useState(
    data.feasibility_status ?? ""
  );
  const [feasibility_comments, setFeasibilityComments] = useState(
    data.feasibility_comments ?? ""
  );
  const [finalStatus, setfinalStatus] = useState("");
  const [finalComments, setfinalComments] = useState("");

  //  const [workflow, setWorkflow] = useState([]);
  const [projectId, setProjectId] = useState<number | null>(null);

  const renderValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // ✅ FIX: prevent object rendering crash
    if (typeof value === "object") {
      return JSON.stringify(value); // OR return "-"
    }

    return value;
  };

  const mainFields = [
    { label: "Description", key: "description" },
    { label: "Priority", key: "priority" },
    { label: "Applicant", key: "applicant_name" },
    { label: "Contact Person", key: "contact_person" },
    { label: "Mobile Number", key: "mobile_number" },
  ];

  const ADDITIONAL_FEATURES = [
    { label: "AC", key: "ac" },
    { label: "CCTV", key: "cctv" },
    { label: "GPS", key: "gps" },
    { label: "Fire Extinguisher", key: "fire_extinguisher" },
    { label: "Emergency Exit", key: "emergency_exit" },
    { label: "LED Board", key: "led_board" },
    { label: "USB", key: "usb" },
    { label: "Luggage Carrier", key: "luggage_carrier" },
    { label: "Wheelchair Access", key: "wheelchair_access" },
  ];

  const COMPLIANCE_STANDARDS = [
    { label: "AIS Compliant", key: "ais_compliant" },
    { label: "CMVR Compliant", key: "cmvr_compliant" },
    { label: "School Bus Safety", key: "school_bus_safety" },
    { label: "State Transport Norms", key: "state_transport_norms" },
  ];

  // const formatDate = (date: string | null | undefined) => {
  //   if (!date) return "-";
  //   const d = new Date(date);
  //   if (isNaN(d.getTime())) return "-";
  //   return d.toLocaleDateString("en-GB");
  // };
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";

    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();

    return `${month}/${day}/${year}`; // MM/DD/YYYY
  };
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================= FETCH PROJECT FROM BD =================
  useEffect(() => {
    const fetchProject = async () => {
      console.log("🚀 Fetching project for BD ID:", data?.id);

      try {
        const res = await api.get(`/project/by-bd/${data.id}`, {
          withCredentials: true,
        });

        console.log("✅ PROJECT RESPONSE:", res.data);

        const project = res.data.data;

        if (project) {
          console.log("🎯 Project ID FOUND:", project.id);
          setProjectId(project.id);
        } else {
          console.log("⚠️ No project found for this BD");
          setProjectId(null);
        }
      } catch (err: any) {
        console.error("❌ ERROR FETCHING PROJECT:", err?.response || err);
        setProjectId(null);
      }
    };

    if (data?.id) {
      fetchProject();
    }
  }, [data]);

  // ================= FETCH WORKFLOW =================
  // useEffect(() => {
  //   if (!projectId) {
  //     console.log("⛔ No projectId, skipping workflow fetch");
  //     return;
  //   }

  //   const fetchWorkflow = async () => {
  //     console.log("🚀 Fetching workflow for projectId:", projectId);

  //     try {
  //       const res = await api.get(`/project/${projectId}/workflow`, {
  //         withCredentials: true,
  //       });

  //       console.log("✅ WORKFLOW RESPONSE:", res.data);

  //       const formatted = res.data.data
  //         .sort((a: any, b: any) => a.sequence - b.sequence)
  //         .map((item: any) => ({
  //           id: item.id.toString(),
  //           department: item.department,
  //         }));

  //       console.log("🎯 FORMATTED WORKFLOW:", formatted);

  //       setWorkflow(formatted);
  //     } catch (err: any) {
  //       console.error("❌ ERROR FETCHING WORKFLOW:", err?.response || err);
  //     }
  //   };

  //   fetchWorkflow();
  // }, [projectId]);

  // const handleAssignProject = async () => {
  //   try {
  //     // already assigned
  //     if (projectId) {
  //       setAlert({
  //         type: "success",
  //         message: "Project already assigned successfully!",
  //       });

  //       return;
  //     }

  //     const res = await api.post(
  //       "/project-manager/projects/assign",
  //       {
  //         bd_request_id: data.id,
  //         description: data.description,
  //         required_date: data.required_date,
  //         assigned_by: user.first_name,
  //         current_department: "PROJECT_MANAGER",
  //       },
  //       { withCredentials: true }
  //     );

  //     console.log("✅ ASSIGN RESPONSE:", res.data);

  //     const createdProject = res.data.data;

  //     setProjectId(createdProject.id);

  //     // ✅ SHOW SUCCESS ALERT
  //     setAlert({
  //       type: "success",
  //       message: "Project assigned successfully!",
  //     });

  //     // ✅ refresh parent page data
  //     onUpdate(createdProject);

  //     // ❌ REMOVE NAVIGATE
  //     // navigate("/manager/project-manager", { replace: true });

  //   } catch (err: any) {
  //     console.error("❌ ASSIGN ERROR:", err);

  //     setAlert({
  //       type: "error",
  //       message:
  //         err.response?.data?.message || "Assignment failed",
  //     });
  //   }
  // };
  //  const handleSaveWorkflow = async () => {
  //   // 🚨 CHECK 1: project must exist
  //   if (!projectId) {
  //     setAlert({
  //       type: "error",
  //       message: "Please assign project first!",
  //     });
  //     return;
  //   }

  //   // 🚨 CHECK 2: workflow must not be empty
  //   if (!workflow || workflow.length === 0) {
  //     setAlert({
  //       type: "error",
  //       message: "Please select at least one department!",
  //     });
  //     return;
  //   }

  //   // 🚨 CHECK 3 (optional but BEST): no empty departments
  //   const hasEmptyDept = workflow.some(
  //     (item: any) => !item.department || item.department.trim() === ""
  //   );

  //   if (hasEmptyDept) {
  //     setAlert({
  //       type: "error",
  //       message: "Please select department for all steps!",
  //     });
  //     return;
  //   }

  //   try {
  //     await api.put(
  //       `/project/${projectId}/workflow`,
  //       {
  //         workflow: workflow.map((item, index) => ({
  //           department: item.department,
  //           sequence: index + 1,
  //         })),
  //       },
  //       { withCredentials: true }
  //     );

  //     setAlert({
  //       type: "success",
  //       message: "Workflow saved successfully!",
  //     });
  //   } catch (err: any) {
  //     console.error(err);

  //     setAlert({
  //       type: "error",
  //       message: err.response?.data?.message || "Failed to save workflow",
  //     });
  //   }
  // };

  // Handle Feasibility update
  const handleFeasibilityUpdate = async () => {
    try {
      const res = await api.patch(
        `/business-development/feasibility/${data.id}/review`,
        {
          feasibility_status,
          feasibility_comments,
        },
        {
          withCredentials: true,   // 🔥 VERY IMPORTANT
        }
      );
      onUpdate(res.data.data);

      setAlert({
        type: "success",
        message: "Feasibility updated successfully!",
      });

      setTimeout(() => {
        setAlert(null);
        setShowModal(false);
      }, 1500);

    } catch (err) {
      console.error("Failed to update feasibility", err);

      setAlert({
        type: "error",
        message: "Failed to update feasibility",
      });

      setTimeout(() => setAlert(null), 3000);
    }
  };
  // Handle BD team update
  // const handleBdUpdate = async () => {
  //   try {


  //     const res = await api.patch(
  //       `/business-development/${data.id}/bd-update`,
  //       {
  //         stage: "FINAL",   // 🔥 Change to "FINAL" when doing final update
  //         status: finalStatus,
  //         comment: finalComments,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     onUpdate(res.data.data);

  //     setAlert({
  //       type: "success",
  //       message: "Business development updated successfully!",
  //     });

  //     setTimeout(() => {
  //       setAlert(null);
  //       setShowModal(false);
  //     }, 1500);

  //   } catch (err) {
  //     console.error("Failed to update BD info", err);

  //     setAlert({
  //       type: "error",
  //       message: "Failed to update BD info",
  //     });

  //     setTimeout(() => setAlert(null), 3000);
  //   }
  // };

  // const handleBdUpdate = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await api.patch(
  //       `/business-development/${data.id}/bd-update`,
  //       {
  //         bd_status: finalStatus,
  //         bd_comments: finalComments,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` }, // ✅ send token
  //       }
  //     );
  //     onUpdate(res.data.data);

  //     setAlert({
  //       type: "success",
  //       message: "Business development updated successfully!",
  //     });

  //     setTimeout(() => {
  //       setAlert(null);
  //       setShowModal(false);
  //     }, 1500);

  //   } catch (err) {
  //     console.error("Failed to update BD info", err);

  //     setAlert({
  //       type: "error",
  //       message: "Failed to update BD info",
  //     });

  //     setTimeout(() => setAlert(null), 3000);
  //   }
  // };

  const handleBdUpdateAndAssign = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Update BD
      const bdRes = await api.patch(
        `/business-development/${data.id}/bd-update`,
        {
          bd_status: finalStatus,
          bd_comments: finalComments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update parent state
      onUpdate(bdRes.data.data);

      // 2️⃣ Assign project IF not already assigned
      if (!projectId) {
        const assignRes = await api.post(
          "/project-manager/projects/assign",
          {
            bd_request_id: data.id,
            description: data.description,
            required_date: data.required_date,
            assigned_by: user.first_name,
            current_department: "PROJECT_MANAGER",
             industry_type: data.industry_type,
          },
          {
            withCredentials: true,
          }
        );
        console.log("BD Required Date:", data.required_date);

        console.log("✅ PROJECT ASSIGNED:", assignRes.data);

        setProjectId(assignRes.data.data.id);
      }

      // ✅ Success alert
      setAlert({
        type: "success",
        message: "Business development updated and assigned successfully!",
      });

      setTimeout(() => {
        setAlert(null);
        setShowModal(false);
      }, 1500);

    } catch (err: any) {
      console.error(err);

      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to update and assign project",
      });

      setTimeout(() => setAlert(null), 3000);
    }
  };
  const renderCheckbox = (checked: boolean, label: string) => {
    return (
      <label className="flex items-center gap-2 text-xs font-semibold">
        {/* Hidden native checkbox (read-only) */}
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="hidden"
        />

        {/* Custom checkbox UI */}
        <span
          className={`
          w-4 h-4 flex items-center justify-center
          rounded border
          ${checked ? "bg-blue-600 border-blue-600" : "border-blue-400"}
        `}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>

        <span className="text-gray-700">{label}</span>
      </label>
    );
  };
  const INPUT_CLASS =
    "w-full h-[42px] px-3 border rounded text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400";



  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-sm relative">

      <h2 className="text-purple-600 font-semibold text-sm mb-2 truncate">
        BR ID: {data.id || data.id}
      </h2>

      <div className="flex flex-col gap-0.5">
        {mainFields.map((item) => (
          <div key={item.key} className="flex justify-between items-center">
            <span className="text-gray-600 font-normal shrink-0 w-32 truncate">{item.label}</span>
            <span className="font-medium text-gray-700 text-sm text-right truncate w-2/3">
              {renderValue(data[item.key as keyof typeof data])}
            </span>
          </div>
        ))}
        <button
          onClick={() => setShowModal(true)}
          className="mt-2 text-blue-600  self-start  font-semibold"
        >
          {mode === "all" ? "More Info" : "Update"}
        </button>
      </div>



      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2 sm:p-4">
          <div
            className="bg-white  w-full
        h-full
        sm:h-auto
        sm:max-h-[95vh]
        sm:max-w-6xl
        rounded-none
        sm:rounded-2xl
        overflow-y-auto
        p-4 sm:p-8
        relative
        flex flex-col gap-6
      "
          >

            {alert && (
              <div className="sticky top-0 z-50 mb-3">
                <ALeart
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-700 bg-clip-text text-transparent text-2xl font-medium mb-4">
              BR-{data.id} Info
            </h2>

            {/* Existing sections */}
            {[
              {
                title: "Request Details",
                fields: [
                  {
                    label: "Description",
                    value: data.description || data.description_request || "-",
                  },
                  {
                    label: "Priority",
                    value: data.priority || data.priority_level || "-",
                  },
                  {
                    label: "Required Date",
                    value: formatDate(data.required_date || data.required_by),
                  },
                  {
                    label: "Industry type",
                    value: data.industry_type,
                  },
                ],
              },
              {
                title: "Applicant / Organization Details",
                fields: [
                  { label: "Applicant Name", value: data.applicant_name },
                  { label: "Contact Person", value: data.contact_person },
                  { label: "Mobile Number", value: data.mobile_number },
                  { label: "Email", value: data.email },
                  { label: "Address", value: data.address },
                ],
              },
              {
                title: "Body / Chassis Details",
                fields: [
                  {
                    label: "Chassis Manufacturer",
                    value: data.chassis_manufacturer,
                  },
                  { label: "Chassis Model", value: data.chassis_model },
                  { label: "Chassis Number", value: data.chassis_number },
                  { label: "Engine Number", value: data.engine_number },
                  { label: "Wheelbase", value: data.wheelbase },
                  { label: "Fuel Type", value: data.fuel_type },
                ],
              },
              {
                title: "Seating & Interior Details",
                fields: [
                  { label: "Seating Capacity", value: data.seating_capacity },
                  { label: "Seat Type", value: data.seat_type },
                  { label: "Flooring Type", value: data.flooring_type },
                  { label: "Interior Color", value: data.interior_color },
                ],
              },
              {
                title: "Exterior Specifications",
                fields: [
                  { label: "Body Material", value: data.body_material },
                  { label: "Paint Color", value: data.paint_color },
                  { label: "Window Type", value: data.window_type },
                  { label: "Door Type", value: data.door_type },
                ],
              },
              {
                title: "Body Type Require",
                fields: [
                  { label: "Body Type Required", value: data.body_type },
                ],
              },
              {
                title: "Additional Features",
                fields: [
                  {
                    label: "Features",
                    value: (
                      <div className="flex flex-wrap gap-2">
                        {ADDITIONAL_FEATURES.map((f) =>
                          renderCheckbox(!!data[f.key], f.label),
                        )}
                      </div>
                    ),
                  },
                ],
              },
              {
                title: "Compliance & Standards",
                fields: [
                  {
                    label: "Standards",
                    value: (
                      <div className="flex flex-wrap gap-2">
                        {COMPLIANCE_STANDARDS.map((f) =>
                          renderCheckbox(!!data[f.key], f.label),
                        )}
                      </div>
                    ),
                  },
                ],
              },
              {
                title: "Timeline & Budget",
                fields: [
                  {
                    label: "Expected Delivery",
                    value: formatDate(data.expected_delivery),
                  },
                  {
                    label: "Approximate Budget",
                    value: data.approximate_budget,
                  },
                ],
              },
              {
                title: "Department Status",
                fields: [
                  {
                    label: "",
                    value: (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* BD Status */}
                        <div>
                          <span className="text-gray-600 text-xs">
                            BD Status
                          </span>
                          <div className="font-semibold text-black">
                            {renderValue(data.bd_status)}
                          </div>
                        </div>

                        {/* BD Comments */}
                        <div>
                          <span className="text-gray-600 text-xs">
                            BD Comments
                          </span>
                          <div className="font-semibold text-black">
                            {renderValue(data.bd_comments)}
                          </div>
                        </div>

                        {/* Feasibility Status */}
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 text-xs">
                            Feasibility Status
                          </span>
                          {mode === "update" ? (
                            <select
                              value={feasibility_status}
                              onChange={(e) =>
                                setFeasibilityStatus(e.target.value)
                              }
                              className="w-full h-[38px] p-2 border rounded text-xs"
                            >
                              <option value="">Select</option>
                              <option value="FEASIBILITY APPROVED">
                                FEASIBILITY APPROVED
                              </option>
                              <option value="FEASIBILITY PENDING">
                                FEASIBILITY PENDING
                              </option>
                              <option value="FEASIBILITY REJECTED">
                                FEASIBILITY REJECTED
                              </option>
                            </select>
                          ) : (
                            <div className="h-[38px] flex items-center font-semibold text-black">
                              {renderValue(data.feasibility_status)
                                ? `FEASIBILITY ${data.feasibility_status}`
                                : "-"}
                            </div>
                          )}
                        </div>

                        {/* Feasibility Comments */}
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 text-xs">
                            Feasibility Comments
                          </span>
                          {mode === "update" ? (
                            <textarea
                              value={feasibility_comments}
                              onChange={(e) =>
                                setFeasibilityComments(e.target.value)
                              }
                              className="w-full h-[38px] p-2 border rounded text-xs resize-none"
                            />
                          ) : (
                            <div className="h-[38px] flex items-center font-semibold text-black truncate">
                              {renderValue(data.feasibility_comments)}
                            </div>
                          )}
                        </div>
                        {/* Final BD Status */}
                        {/* <div>
                          <span className="text-gray-600 text-xs">Final BD Status</span>
                          <div className="font-semibold text-black">
                            {renderValue(data.finalbd_status)}
                          </div>
                        </div> */}

                        {/* Final BD Comments */}
                        {/* <div>
                          <span className="text-gray-600 text-xs">Final BD Comments</span>
                          <div className="font-semibold text-black">
                            {renderValue(data.finalbd_comment)}
                          </div>
                        </div> */}
                      </div>
                    ),
                  },
                ],
              },
              {
                title: "Attachments",
                fields: [
                  {
                    label: "Attachments",
                    value: (
                      <div className="flex flex-col gap-2">
                        {Array.isArray(data.attachments) && data.attachments.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {data.attachments.map((file: any, idx: number) => {
                              const fileName =
                                typeof file === "string"
                                  ? file.split("/").pop()
                                  : file.originalname ||
                                  file.filename ||
                                  file.name ||
                                  "Attachment";

                              return (
                                <span
                                  key={idx}
                                  className="text-xs text-blue-600 underline cursor-pointer"
                                  onClick={() => {
                                    let url = "";

                                    // backend file path
                                    if (file.file_path) {
                                      url = `${import.meta.env.VITE_BACKEND_URL}${file.file_path}`;
                                    }

                                    // fallback filename
                                    else if (file.filename) {
                                      url = `${import.meta.env.VITE_BACKEND_URL}/uploads/attachments/${file.filename}`;
                                    }

                                    // string case
                                    else if (typeof file === "string") {
                                      url = file;
                                    }

                                    if (!url) {
                                      console.error("Invalid file URL", file);
                                      return;
                                    }

                                    window.open(url, "_blank");
                                  }}
                                >
                                  {fileName}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">
                            No file uploaded
                          </span>
                        )}
                      </div>
                    ),
                  },
                ],
              },

              {
                title: "Declaration",
                fields: [
                  {
                    label: "",
                    value: (
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">
                            Declaration Date
                          </span>
                          <span className="font-semibold text-black">
                            {formatDate(data.declaration_date)}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">
                            Place
                          </span>
                          <span className="font-semibold text-black">
                            {renderValue(data.place)}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">
                            Applicant Signature
                          </span>
                          <span className="font-semibold text-black">
                            {renderValue(data.applicant_signature)}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">
                            Requested By
                          </span>
                          <span className="font-semibold text-black">
                            {renderValue(data.requested_by_person)}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-600 text-xs font-medium">
                            Created At
                          </span>
                          <span className="font-semibold text-black">
                            {formatDate(data.created_at)}
                          </span>
                        </div>
                      </div>
                    ),
                  },
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="bg-gray-100
    rounded-xl
    p-4 sm:p-5
    shadow
    flex flex-col
    gap-3
  "
              >
                <h3 className="text-gray-900 text-sm font-semibold  pb-1">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                  {section.fields.map((f) => (
                    <div key={f.label} className="flex flex-col">
                      <span className="text-gray-600 text-xs font-medium">
                        {f.label}
                      </span>
                      <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-black">
                        {React.isValidElement(f.value)
                          ? f.value
                          : typeof f.value === "object"
                            ? "-"
                            : renderValue(f.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {mode === "bd-update" && (
              <>
                {/* GRAY BOX: ONLY STATUS & COMMENTS */}
                <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow mt-4">
                  <h3 className="text-black text-sm font-bold mb-3">
                    BD Team Update
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* BD Status */}
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs">BD Status</span>

                      <select
                        value={finalStatus}
                        onChange={(e) => setfinalStatus(e.target.value)}
                        className="w-full h-[38px] p-2 border rounded text-xs"
                      >
                        <option value="">Select</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>

                    {/* BD Comments */}
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs">BD Comments</span>

                      <textarea
                        value={finalComments}
                        onChange={(e) => setfinalComments(e.target.value)}
                        placeholder="Enter comments"
                        className="w-full h-[38px] p-2 border rounded text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SINGLE BUTTON */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleBdUpdateAndAssign}
                    className="bg-purple-700 text-white px-5 py-2 rounded text-sm sm:text-base"
                  >
                    Update & Assign To Project Manager
                  </button>
                </div>
              </>
            )}


            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700  text-xl sm:text-2xl"
            >
              ×
            </button>

            {/* Feasibility Update Button */}
            {mode === "update" && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleFeasibilityUpdate}
                  className="bg-purple-700 text-white px-4 py-2 rounded text-sm sm:text-base"
                >
                  Update Feasibility
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};;

export default FeasibilityCard;