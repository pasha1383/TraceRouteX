import { Update } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, User, MessageSquare } from 'lucide-react';

interface IncidentTimelineProps {
  updates: Update[];
  className?: string;
}

export function IncidentTimeline({ updates, className }: IncidentTimelineProps) {
  if (!updates || updates.length === 0) {
    return (
      <div className={cn('text-center py-12 text-muted-foreground animate-fade-in', className)}>
        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No updates yet</p>
        <p className="text-sm mt-1 opacity-70">Updates will appear here as the incident progresses</p>
      </div>
    );
  }

  // Sort updates by creation date (newest first)
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line with gradient */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-transparent rounded-full" />

      <div className="space-y-6 stagger-children">
        {sortedUpdates.map((update, index) => (
          <div key={update.id} className="relative flex gap-4 group">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className={cn(
                'w-8 h-8 rounded-full border-4 border-background flex items-center justify-center transition-all duration-300',
                index === 0
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-muted text-muted-foreground group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20'
              )}>
                <Clock className="h-3 w-3" />
              </div>
            </div>

            {/* Update content */}
            <div className="flex-1 pb-8">
              <div className="bg-card border rounded-xl p-4 shadow-sm group-hover:shadow-md group-hover:border-blue-200/50 dark:group-hover:border-blue-800/50 transition-all duration-300 group-hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">{update.user?.email || 'System'}</span>
                  </div>
                  <time className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
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
