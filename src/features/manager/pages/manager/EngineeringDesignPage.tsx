export default function EngineeringDesignPage() {
  return (
    <div className="w-full min-h-[80vh] p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Engineering & Design
        </h2>

        <p className="text-gray-600 mb-6">
          Manage engineering drawings, design approvals, and technical
          documentation.
        </p>

        {/* Example Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Drawings</h3>
            <p className="text-sm text-gray-500">
              Upload and manage engineering drawings.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Design Approvals
            </h3>
            <p className="text-sm text-gray-500">
              Review and approve design submissions.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Documentation</h3>
            <p className="text-sm text-gray-500">
              Manage technical documentation and revisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
