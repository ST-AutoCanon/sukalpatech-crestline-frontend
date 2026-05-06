// import { markAsRead } from "./NotificationService";

// export default function NotificationDropdown({ notifications, refresh }: any) {
//   return (
//     <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3 z-50">
//       <h3 className="font-semibold mb-2">Notifications</h3>

//       {notifications.slice(0, 5).map((n: any) => (
//         <div key={n.id} className="border-b py-2">
//           <p className="font-medium">{n.title}</p>
//           <p className="text-sm text-gray-600">{n.message}</p>

//           {!n.is_read && (
//             <button
//               className="text-blue-500 text-xs"
//               onClick={async () => {
//                 await markAsRead(n.id);
//                 refresh();
//               }}
//             >
//               Mark as read
//             </button>
//           )}
//         </div>
//       ))}

//       <a href="/manager/notifications" className="text-blue-500 text-sm">
//         View all
//       </a>
//     </div>
//   );
// }