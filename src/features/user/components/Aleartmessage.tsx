import { CheckCircle, XCircle, X } from "lucide-react";

export default function Alert({ type, message, onClose }) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div
        className={`w-[360px] rounded-lg shadow-lg bg-white border
        ${isSuccess ? "border-green-400" : "border-red-400"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 text-white
          ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {isSuccess ? "Success" : "Error"}
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-gray-700 text-sm">{message}</div>

        {/* Footer */}
        <div className="flex justify-end px-4 pb-4">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded text-white text-sm
            ${isSuccess ? "bg-green-600" : "bg-red-600"}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
