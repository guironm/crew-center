export default function EmployeeListSkeleton() {
  return (
    <div>
      <div className="h-8 bg-slate-200 rounded w-1/6 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse border-2 border-slate-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 mr-4"></div>
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-200 rounded-full mr-2"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-200 rounded-full mr-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
