import { useEffect, useState } from "react";
import * as api from "../api/employeeApi";

export const useEmployee = (email: string, token: string) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartmentData = async () => {
    if (!email || !token) return;

    try {
      const userDept = await api.getMyDepartments(email, token);
      const deptMaster = await api.getAllDepartments(token);

      setDepartments(Array.isArray(userDept) ? userDept : []);
      setAllDepartments(Array.isArray(deptMaster) ? deptMaster : []);

    } catch (err) {
      console.error("❌ Department Fetch Error", err);
      setDepartments([]);
      setAllDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [email, token]);

  return { departments, allDepartments, loading, refetch: fetchDepartmentData };
};
