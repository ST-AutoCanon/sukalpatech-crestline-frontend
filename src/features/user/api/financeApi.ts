import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// 🔵 Fetch Finance PRs
export const fetchFinancePRs = (token: string) => {
  return axios.get(`${BACKEND_URL}/api/finance/prs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔵 Add Finance Comment
export const addFinanceComment = (
  token: string,
  payload: {
    pr_id: number;
    commented_by: number;
    department: string;
    comment: string;
  }
) => {
  return axios.post(`${BACKEND_URL}/api/finance/pr/comment`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔵 Update Finance Status
export const updateFinanceStatus = (
  token: string,
  payload: {
    pr_id: number;
    new_status: string;
    old_status: string;
    updated_by: number;
    department: string;
    note: string;
  }
) => {
  return axios.post(`${BACKEND_URL}/api/finance/pr/status`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
