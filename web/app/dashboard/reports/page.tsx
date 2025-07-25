'use client';

export default function Reports() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2 sm:mb-4">
            Medical Reports
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generate and view medical reports and documentation.
          </p>
        </div>
      </div>
      
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-4">Report Templates</h3>
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <div className="text-sm sm:text-base">Report generation feature is coming soon.</div>
          </div>
        </div>
      </div>
    </div>
  );
}