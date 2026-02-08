import { Update } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, User } from 'lucide-react';

interface IncidentTimelineProps {
  updates: Update[];
  className?: string;
}

export function IncidentTimeline({ updates, className }: IncidentTimelineProps) {
  if (!updates || updates.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <p>No updates yet</p>
      </div>
    );
  }

  // Sort updates by creation date (newest first)
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-6">
        {sortedUpdates.map((update, index) => (
          <div key={update.id} className="relative flex gap-4 group">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className={cn(
                'w-8 h-8 rounded-full border-4 border-background flex items-center justify-center transition-colors',
                index === 0 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground'
              )}>
                <Clock className="h-3 w-3" />
              </div>
            </div>

            {/* Update content */}
            <div className="flex-1 pb-8">
              <div className="bg-card border rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{update.user?.email || 'System'}</span>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(update.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="text-sm leading-relaxed">{update.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
