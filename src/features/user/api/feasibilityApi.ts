import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// 🔵 Fetch PRs
export const fetchFeasibilityPRs = (token: string) => {
  return axios.get(`${BACKEND_URL}/api/feasibility/prs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔵 Add Feasibility Comment
export const addFeasibilityComment = (
  token: string,
  payload: {
    pr_id: number;
    commented_by: number;
    department: string;
    comment: string;
  }
) => {
  return axios.post(
    `${BACKEND_URL}/api/feasibility/pr/comment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// 🔵 Update Feasibility Status
export const updateFeasibilityStatus = (
  token: string,
  payload: {
    pr_id: number;
    new_status: string;
    old_status: string;
    updated_by: number;
    department: string;
  }
) => {
  return axios.post(
    `${BACKEND_URL}/api/feasibility/pr/status`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
