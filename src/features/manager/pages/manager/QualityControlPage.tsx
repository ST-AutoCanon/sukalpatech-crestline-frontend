export default function QualityControlPage() {
  return (
    <div className="w-full min-h-[80vh] p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quality Control
        </h2>

        <p className="text-gray-600 mb-6">
          Ensure product quality through inspections and compliance checks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">Inspections</h3>
            <p className="text-sm text-gray-500">
              Perform quality inspections for products and materials.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Compliance Checks
            </h3>
            <p className="text-sm text-gray-500">
              Ensure adherence to industry standards and regulations.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Quality Reports
            </h3>
            <p className="text-sm text-gray-500">
              Generate reports on quality performance and defects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
