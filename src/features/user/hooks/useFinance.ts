import { useEffect, useState } from "react";
import {
  fetchFinancePRs,
  addFinanceComment,
  updateFinanceStatus,
} from "../api/financeApi";

export const useFinance = (token: string | null) => {
  const [allPRs, setAllPRs] = useState<any[]>([]);

  const fetchAllPRs = async () => {
    if (!token) return;

    try {
      const res = await fetchFinancePRs(token);

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
      console.error("Error fetching Finance PRs:", error);
    }
  };

  const addComment = async (payload: any) => {
    if (!token) return;
    return addFinanceComment(token, payload);
  };

  const addStatus = async (payload: any) => {
    if (!token) return;
    return updateFinanceStatus(token, payload);
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
