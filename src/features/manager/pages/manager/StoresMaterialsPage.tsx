export default function StoresMaterialsPage() {
  return (
    <div className="w-full min-h-[80vh] p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Stores & Materials
        </h2>

        <p className="text-gray-600 mb-6">
          Manage inventory, material requests, and stock tracking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Inventory</h3>
            <p className="text-sm text-gray-500">
              Track available materials and stock levels.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Material Requests
            </h3>
            <p className="text-sm text-gray-500">
              Manage incoming material requests from departments.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Stock Reports</h3>
            <p className="text-sm text-gray-500">
              View reports of material usage and stock movement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
