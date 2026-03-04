export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 h-28">
            <div className="h-3 w-24 bg-[--surface-hover] rounded mb-4 mx-auto" />
            <div className="h-8 w-36 bg-[--surface-hover] rounded mx-auto" />
          </div>
        ))}
      </div>
      {/* Block skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 h-48">
            <div className="h-4 w-32 bg-[--surface-hover] rounded mb-6" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-[--surface-hover] rounded" />
              <div className="h-3 w-3/4 bg-[--surface-hover] rounded" />
              <div className="h-3 w-1/2 bg-[--surface-hover] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
