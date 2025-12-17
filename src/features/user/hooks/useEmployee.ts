// import { useState, useEffect } from "react";
// import * as api from "../api/employeeApi";

// export const useEmployee = (email: string, token: string) => {
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDepartments = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const data = await api.getMyDepartments(email, token);
//       setDepartments(data);
//     } catch (err) {
//       console.error("❌ fetchDepartments:", err);
//       setDepartments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (email && token) fetchDepartments();
//   }, [email, token]);

//   return {
//     departments,
//     loading,
//     fetchDepartments,
//   };
// };


// import { useState, useEffect } from "react";
// import * as api from "../api/employeeApi";

// export const useEmployee = (email: string, token: string) => {
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDepartments = async () => {
//     if (!token) return;
//     setLoading(true);

//     try {
//       const data = await api.getMyDepartments(email, token);

//       // 🛑 SAFETY FIX → ensures departments is always array
//       setDepartments(Array.isArray(data) ? data : []);

//     } catch (err) {
//       console.error("❌ fetchDepartments:", err);
//       setDepartments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (email && token) fetchDepartments();
//   }, [email, token]);

//   return { departments, loading, fetchDepartments };
// };



// import { useState, useEffect } from "react";
// import * as api from "../api/employeeApi";

// export const useEmployee = (email: string, token: string) => {
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDepartments = async () => {
//     if (!email || !token) return;

//     try {
//       const deptList = await api.getMyDepartments(email, token);
//       setDepartments(Array.isArray(deptList) ? deptList : []);
//     } catch (err) {
//       console.error("❌ fetchDepartments:", err);
//       setDepartments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, [email, token]);

//   return { departments, loading, refetch: fetchDepartments };
// };


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
