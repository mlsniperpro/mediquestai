'use client';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Medical Reports
          </h2>
          <p className="text-gray-600">
            Generate and view medical reports and documentation.
          </p>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Report Templates</h3>
          <div className="text-center py-8 text-gray-500">
            Report generation feature is coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}