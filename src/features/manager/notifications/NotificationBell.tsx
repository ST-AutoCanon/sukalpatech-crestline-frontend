// import { useEffect, useState } from "react";
// import NotificationDropdown from "./NotificationDropdown";
// import { getNotifications } from "./NotificationService";

// export default function NotificationBell() {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<any[]>([]);

//   const fetchData = async () => {
//     const data = await getNotifications();
//     setNotifications(data);
//   };

//   useEffect(() => {
//     fetchData();

//     // polling (optional)
//     const interval = setInterval(fetchData, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const unread = notifications.filter(n => !n.is_read).length;

//   return (
//     <div className="relative">
//       <button onClick={() => setOpen(!open)}>
//         🔔
//         {unread > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
//             {unread}
//           </span>
//         )}
//       </button>

//       {open && (
//         <NotificationDropdown
//           notifications={notifications}
//           refresh={fetchData}
//         />
//       )}
//     </div>
//   );
// }