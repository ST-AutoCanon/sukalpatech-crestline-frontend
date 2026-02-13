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
