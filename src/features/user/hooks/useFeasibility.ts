import { useEffect, useState } from "react";
import {
  fetchFeasibilityPRs,
  addFeasibilityComment,
  updateFeasibilityStatus,
} from "../api/feasibilityApi";

export const useFeasibility = (token: string | null) => {
  const [allPRs, setAllPRs] = useState<any[]>([]);

  const fetchAllPRs = async () => {
    if (!token) return;

    try {
      const res = await fetchFeasibilityPRs(token);

      if (res.data?.data) {
        const prs = res.data.data.map((pr: any) => ({
          ...pr,
          items:
            pr.items?.map((item: any) => ({
              ...item,
              total_price:
                item.quantity_required * (item.expected_rate || 0),
            })) || [],
          vendors: pr.vendors || [],
          comments: pr.comments || [],
          attachments: pr.attachments || [],
          statusLogs: pr.statusLogs || [],
        }));

        setAllPRs(prs);
      }
    } catch (error) {
      console.error("Error fetching PRs:", error);
    }
  };

  // ✅ MATCHING API NAMES
  const addComment = async (payload: any) => {
    if (!token) return;
    return addFeasibilityComment(token, payload);
  };

  const addStatus = async (payload: any) => {
    if (!token) return;
    return updateFeasibilityStatus(token, payload);
  };

  useEffect(() => {
    fetchAllPRs();
  }, [token]);

  return {
    allPRs,
    fetchAllPRs,
    addComment,
    addStatus,
  };
};
