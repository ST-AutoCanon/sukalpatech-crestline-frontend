const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleRes = async (res: Response) => {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "API error");
  return json.data ?? json;
};

// ---------------- DEPARTMENTS ---------------- //
export const getDepartments = async (token: string) => {
  const res = await fetch(`${API_URL}/api/departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleRes(res);
};

export const createDepartment = async (name: string, token: string) => {
  const res = await fetch(`${API_URL}/api/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  return handleRes(res);
};

// ---------------- EMPLOYEES WITH DEPARTMENTS ---------------- //
export const getEmployees = async (token: string) => {
  const res = await fetch(`${API_URL}/api/departments/employees-departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleRes(res);
};

// ---------------- GET EMPLOYEES OF ONE DEPARTMENT ---------------- //
export const getEmployeesByDepartment = async (deptId: number, token: string) => {
  const res = await fetch(`${API_URL}/api/departments/${deptId}/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleRes(res);
};


// ---------------- ASSIGN / UNASSIGN DEPARTMENT ---------------- //
export const assignEmployeeDepartment = async (
  employeeId: number,
  deptId: number,
  permission: string | null,
  token: string
) => {
  const res = await fetch(`${API_URL}/api/departments/employee/${employeeId}/assign-department`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ department_id: deptId, permission }),
  });
  return handleRes(res);
};

export const unassignEmployee = async (
  employeeId: number,
  deptId: number,
  token: string
) => {
  const res = await fetch(`${API_URL}/api/departments/employee/${employeeId}/unassign-department`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ department_id: deptId }),
  });
  return handleRes(res);
};

// ---------------- ASSIGN / UPDATE PERMISSION ---------------- //
export const updatePermission = async (
  employeeId: number,
  deptId: number,
  permission: string,
  token: string
) => {
  const res = await fetch(`${API_URL}/api/departments/employee/${employeeId}/assign-permission`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ department_id: deptId, permission }),
  });
  return handleRes(res);
};

// ---------------- UNASSIGN PERMISSION ---------------- //
export const removePermission = async (
  employeeId: number,
  deptId: number,
  token: string
) => {
  const res = await fetch(`${API_URL}/api/departments/employee/${employeeId}/unassign-permission`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ department_id: deptId }),
  });
  return handleRes(res);
};
