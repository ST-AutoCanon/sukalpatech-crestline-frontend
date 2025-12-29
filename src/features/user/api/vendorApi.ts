import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const addVendor = (token: string, payload: any) => {
  return axios.post(`${BACKEND_URL}/api/vendor/vendor`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllVendors = (token: string) => {
  return axios.get(`${BACKEND_URL}/api/procurement/vendors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
