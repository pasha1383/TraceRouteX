import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="border rounded-xl p-6 space-y-4 animate-fade-in">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3 animate-fade-in">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center" style={{ animationDelay: `${i * 0.1}s` }}>
          <Skeleton className="h-12 flex-1 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTimeline() {
  return (
    <div className="space-y-6 animate-fade-in">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4" style={{ animationDelay: `${i * 0.15}s` }}>
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-xl p-6 space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
        <div className="border rounded-xl p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
