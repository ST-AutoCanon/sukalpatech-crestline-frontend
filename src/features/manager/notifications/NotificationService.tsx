// import axios from "axios";

// export const getNotifications = async () => {
//   const res = await axios.get("/api/notifications", {
//     withCredentials: true,
//   });
//   return res.data.data;
// };

// export const markAsRead = async (id: number) => {
//   await axios.patch(`/api/notifications/${id}/read`, {}, {
//     withCredentials: true,
//   });
// };

// export const deleteNotification = async (id: number) => {
//   await axios.delete(`/api/notifications/${id}`, {
//     withCredentials: true,
//   });
// };

// export const sendNotification = async (data: any) => {
//   await axios.post("/api/notifications", data, {
//     withCredentials: true,
//   });
// };