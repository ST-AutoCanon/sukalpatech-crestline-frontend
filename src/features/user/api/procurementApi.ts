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
