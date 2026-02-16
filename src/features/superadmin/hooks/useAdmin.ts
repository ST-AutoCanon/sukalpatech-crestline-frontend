

import { useState, useEffect } from "react";
import * as api from "../api/adminApi";

export const useAdmin = (token: string | null) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]); // all employees for assignment
  const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
    useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===================== GET DEPARTMENTS ===================== */
  const fetchDepartments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getDepartments(token);
      setDepartments(data || []);
    } catch (err) {
      console.error("❌ fetchDepartments:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== GET ALL EMPLOYEES ===================== */
  const fetchEmployees = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getEmployees(token);
      setEmployees(data || []); // used for Assign Modal list
    } catch (err) {
      console.error("❌ fetchEmployees:", err);
    } finally {
      setLoading(false);
    }
  };


  
const fetchEmployeesByDept = async (deptId: number) => {
  if (!token) return;
  setLoading(true);
  try {
    const data = await api.getEmployeesByDepartment(deptId, token);

    // Normalize permission for UI
    const normalized = (data || []).map((emp: any) => {
      const dept = emp.departments.find((d: any) => d.id === deptId); // ✅ change here
      return {
        ...emp,
        permission: dept?.permission || "",
      };
    });

    setSelectedDepartmentEmployees(normalized);
  } catch (err) {
    console.error("❌ fetchEmployeesByDept:", err);
  } finally {
    setLoading(false);
  }
};





  /* ================== ADD NEW DEPARTMENT ================== */
  const addDepartment = async (name: string) => {
    if (!token) return null;
    try {
      const d = await api.createDepartment(name, token);
      setDepartments((prev) => [...prev, d]);
      return d;
    } catch (err) {
      console.error("❌ addDepartment:", err);
      throw err;
    }
  };

  /* =================🔥 ASSIGN EMPLOYEE ================= */
  const assignDept = async (employeeId: number, deptId: number, permission: string) => {
    if (!token) return;
    await api.assignEmployeeDepartment(employeeId, deptId, permission, token);

    await fetchEmployeesByDept(deptId); // 🔥 refresh current dept only!
    await fetchEmployees(); // update available list
  };

  /* =================🔥 UPDATE PERMISSION ================= */
  const updatePerm = async (employeeId: number, deptId: number, permission: string) => {
    if (!token) return;
    await api.updatePermission(employeeId, deptId, permission, token);

    await fetchEmployeesByDept(deptId); // update UI immediately!
  };

  /* =================🔥 REMOVE EMPLOYEE FROM DEPT ================= */
  const deleteDept = async (employeeId: number, deptId: number) => {
    if (!token) return;
    await api.unassignEmployee(employeeId, deptId, token);

    await fetchEmployeesByDept(deptId); // refresh this department only
    await fetchEmployees();
  };

  /* ================= REMOVE ONLY PERMISSION ================= */
  const removePerm = async (employeeId: number, deptId: number) => {
    if (!token) return;
    await api.removePermission(employeeId, deptId, token);

    await fetchEmployeesByDept(deptId);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!token) return;
    fetchDepartments();
    fetchEmployees(); // load employees on start
  }, [token]);

  return {
    departments,
    employees,                     // ← Use this inside assign modal dropdown
    selectedDepartmentEmployees,
    loading,
    addDepartment,
    assignDept,
    updatePerm,
    deleteDept,
    removePerm,
    fetchEmployeesByDept,
  };
};
