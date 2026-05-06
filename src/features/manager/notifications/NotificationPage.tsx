// import { useEffect, useState } from "react";
// import { getNotifications } from "./NotificationService";

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<any[]>([]);

//   useEffect(() => {
//     getNotifications().then(setNotifications);
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl mb-4">Notifications</h2>

//       {notifications.map(n => (
//         <div
//           key={n.id}
//           className={`p-3 mb-2 rounded ${
//             n.is_read ? "bg-gray-100" : "bg-blue-50"
//           }`}
//         >
//           <h4>{n.title}</h4>
//           <p>{n.message}</p>
//         </div>
//       ))}
//     </div>
//   );
// }