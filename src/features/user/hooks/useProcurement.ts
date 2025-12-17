// import { useEffect, useState } from "react";
// import * as api from "../api/procurementApi";

// export const useProcurement = (token: string) => {
//   const [vendors, setVendors] = useState<any[]>([]);
//   const [prs, setPRs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchProcurementData = async () => {
//     if (!token) return;

//     try {
//       const vendorsData = await api.getVendors(token);
//       const prsData = await api.getPRs(token);

//       setVendors(Array.isArray(vendorsData) ? vendorsData : []);
//       setPRs(Array.isArray(prsData) ? prsData : []);
//     } catch (err) {
//       console.error("❌ Procurement Fetch Error", err);
//       setVendors([]);
//       setPRs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProcurementData();
//   }, [token]);

//   // ------------------ Action Functions ------------------
//   const createPR = async (data: any) => {
//     const newPR = await api.createPR(data, token);
//     setPRs((prev) => [newPR, ...prev]);
//     return newPR;
//   };

//   const addPRItem = async (data: any, pr_id?: number) => {
//     const newItem = await api.addPRItem(data, token);
//     if (pr_id) {
//       const prIndex = prs.findIndex((pr) => pr.pr_id === pr_id);
//       if (prIndex > -1) {
//         prs[prIndex].items = prs[prIndex].items || [];
//         prs[prIndex].items.push(newItem);
//         setPRs([...prs]);
//       }
//     }
//     return newItem;
//   };

//   const addPRComment = async (data: any, pr_id?: number) => {
//     const newComment = await api.addPRComment(data, token);
//     if (pr_id) {
//       const prIndex = prs.findIndex((pr) => pr.pr_id === pr_id);
//       if (prIndex > -1) {
//         prs[prIndex].comments = prs[prIndex].comments || [];
//         prs[prIndex].comments.push(newComment);
//         setPRs([...prs]);
//       }
//     }
//     return newComment;
//   };

//   const addPRAttachment = async (file: File, pr_id: number) => {
//     const newAttachment = await api.addPRAttachment(file, pr_id, token);
//     const prIndex = prs.findIndex((pr) => pr.pr_id === pr_id);
//     if (prIndex > -1) {
//       prs[prIndex].attachments = prs[prIndex].attachments || [];
//       prs[prIndex].attachments.push(newAttachment);
//       setPRs([...prs]);
//     }
//     return newAttachment;
//   };

//   const createVendor = async (data: any) => {
//     const newVendor = await api.createVendor(data, token);
//     setVendors((prev) => [newVendor, ...prev]);
//     return newVendor;
//   };

//   return {
//     vendors,
//     prs,
//     loading,
//     refetch: fetchProcurementData,
//     createPR,
//     addPRItem,
//     addPRComment,
//     addPRAttachment,
//     createVendor,
//   };
// };





import { useEffect, useState } from "react";
import { getAllPRs, getDepartments, getVendors, createPR as createPRApi } from "../api/procurementApi";

export const useProcurement = (token: string | null) => {
  const [allPRs, setAllPRs] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [prRes, deptRes, vendorRes] = await Promise.all([
        getAllPRs(token),
        getDepartments(token),
        getVendors(token),
      ]);

      setAllPRs(prRes.data?.data || []);
      setDepartments(deptRes.data?.data || []);
      setVendors(vendorRes.data?.data || []);
    } catch (err) {
      console.error("Fetch procurement data failed:", err);
      setError("Failed to fetch procurement data");
    } finally {
      setLoading(false);
    }
  };

  const refetchAllPRs = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getAllPRs(token);
      setAllPRs(res.data?.data || []);
    } catch (err) {
      console.error("Fetch PRs failed:", err);
      setError("Failed to fetch procurement requests");
    } finally {
      setLoading(false);
    }
  };

  const createPR = async (formData: FormData) => {
    if (!token) return;
    return createPRApi(token, formData);
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  return {
    allPRs,
    departments,
    vendors,
    loading,
    error,
    refetchAllPRs,
    createPR,
  };
};
