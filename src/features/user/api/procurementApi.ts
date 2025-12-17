// const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// const handleRes = async (res: Response) => {
//   const json = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(json?.message || "API error");
//   return json.data ?? json;
// };

// // ------------------ Vendors ------------------
// export const getVendors = async (token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/vendors`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return handleRes(res);
// };

// export const createVendor = async (data: any, token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/vendor`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleRes(res);
// };

// // ------------------ Procurement Requests ------------------
// export const getPRs = async (token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/prs`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return handleRes(res);
// };

// export const createPR = async (data: any, token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/pr`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleRes(res);
// };

// // ------------------ PR Items ------------------
// export const addPRItem = async (data: any, token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/pr/item`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleRes(res);
// };

// export const getPRItems = async (pr_id: number, token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/pr/${pr_id}/items`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return handleRes(res);
// };

// // ------------------ PR Comments ------------------
// export const addPRComment = async (data: any, token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/pr/comment`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return handleRes(res);
// };

// export const getPRComments = async (pr_id: number, token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/pr/${pr_id}/comments`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return handleRes(res);
// };

// // ------------------ PR Attachments ------------------
// export const addPRAttachment = async (file: File, pr_id: number, token: string) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("pr_id", pr_id.toString());

//   const res = await fetch(`${API_URL}/api/procurement/pr/attachment`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`, // don't set Content-Type for multipart/form-data
//     },
//     body: formData,
//   });

//   return handleRes(res);
// };

// export const getPRAttachments = async (pr_id: number, token: string) => {
//   const res = await fetch(`${API_URL}/api/procurement/pr/${pr_id}/attachments`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return handleRes(res);
// };


import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllPRs = (token: string) => {
  return axios.get(`${BACKEND_URL}/api/procurement/prs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getDepartments = (token: string) => {
  return axios.get(`${BACKEND_URL}/api/departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getVendors = (token: string) => {
  return axios.get(`${BACKEND_URL}/api/procurement/vendors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createPR = (token: string, formData: FormData) => {
  return axios.post(`${BACKEND_URL}/api/procurement/pr`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
