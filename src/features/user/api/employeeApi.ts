const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleRes = async (res: Response) => {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "API error");
  return json.data ?? json;
};

// Get all employees + department relation
export const getEmployees = async (token: string) => {
  const res = await fetch(`${API_URL}/api/departments/employees-departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleRes(res);
};

// Get only current employee's departments
export const getMyDepartments = async (email: string, token: string) => {
  const employees = await getEmployees(token);
  const me = employees.find((emp: any) => emp.email === email);
  return Array.isArray(me?.departments) ? me.departments : [];
};

// 🔥 NEW – Fetch Full Department List
export const getAllDepartments = async (token: string) => {
  const res = await fetch(`${API_URL}/api/departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleRes(res); // returns [{department_id,name,...}]
};
