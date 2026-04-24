import axios from "axios";

console.log("API URL:", import.meta.env.VITE_BACKEND_URL);
// export const api = axios.create({
//   baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const api = axios.create({
//   baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });



export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true, // ✅ sends HTTP-only cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
});
