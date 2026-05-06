// import { markAsRead, deleteNotification } from "./NotificationService";

// interface Props {
//   notification: any;
//   refresh: () => void;
// }

// export default function NotificationItem({ notification, refresh }: Props) {
//   const getIcon = (type: string) => {
//     switch (type) {
//       case "success":
//         return "✅";
//       case "error":
//         return "❌";
//       case "warning":
//         return "⏳";
//       case "info":
//       default:
//         return "🔔";
//     }
//   };

//   const getBg = (is_read: boolean) => {
//     return is_read ? "bg-gray-100" : "bg-blue-50";
//   };

//   return (
//     <div
//       className={`p-3 rounded-lg mb-2 flex justify-between items-start ${getBg(
//         notification.is_read
//       )}`}
//     >
//       {/* LEFT */}
//       <div className="flex gap-2">
//         <div className="text-xl">{getIcon(notification.type)}</div>

//         <div>
//           <h4 className="font-semibold text-sm">
//             {notification.title}
//           </h4>

//           <p className="text-xs text-gray-600">
//             {notification.message}
//           </p>

//           <span className="text-[10px] text-gray-400">
//             {new Date(notification.created_at).toLocaleString()}
//           </span>
//         </div>
//       </div>

//       {/* RIGHT ACTIONS */}
//       <div className="flex flex-col gap-1 items-end">
//         {!notification.is_read && (
//           <button
//             className="text-blue-500 text-xs"
//             onClick={async () => {
//               await markAsRead(notification.id);
//               refresh();
//             }}
//           >
//             Mark
//           </button>
//         )}

//         <button
//           className="text-red-500 text-xs"
//           onClick={async () => {
//             await deleteNotification(notification.id);
//             refresh();
//           }}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }