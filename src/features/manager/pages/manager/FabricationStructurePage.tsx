export default function FabricationStructurePage() {
  return (
    <div className="w-full min-h-[80vh] p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Fabrication & Structure
        </h2>

        <p className="text-gray-600 mb-6">
          Monitor fabrication progress and structural assembly processes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Fabrication Tasks
            </h3>
            <p className="text-sm text-gray-500">
              Manage fabrication work orders and progress.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Structural Assembly
            </h3>
            <p className="text-sm text-gray-500">
              Track structural assembly and installation stages.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Production Reports
            </h3>
            <p className="text-sm text-gray-500">
              Monitor fabrication output and productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
