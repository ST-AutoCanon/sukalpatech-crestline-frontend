import { AlertTriangle, X } from "lucide-react";

export default function ConfirmAlert({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-[360px] rounded-lg shadow-lg bg-white border border-yellow-400">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 text-white bg-yellow-500">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={18} />
            Confirmation
          </div>
          <button onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-gray-700 text-sm">
          {message || "Are you sure you want to delete?"}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 pb-4">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded bg-gray-400 text-white text-sm"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded bg-red-600 text-white text-sm"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}