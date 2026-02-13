import { useEffect, useState } from "react";
import { addVendor, getAllVendors } from "../api/vendorApi";

export const useVendor = (token: string | null) => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVendor = async (payload: any) => {
    if (!token) return;
    return addVendor(token, payload);
  };

  const fetchVendors = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getAllVendors(token);
      setVendors(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [token]);

  return {
    createVendor,
    vendors,
    loading,
    error,
    fetchVendors,
  };
};
