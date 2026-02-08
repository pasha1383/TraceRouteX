import { cn } from '@/lib/utils';
import { ServiceStatus, IncidentSeverity, IncidentStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ServiceStatus | IncidentSeverity | IncidentStatus | string;
  className?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, animated = false, children }: StatusBadgeProps) {
  const getStatusStyles = () => {
    // Service Status Colors
    if (status === 'UP') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    }
    if (status === 'DEGRADED') {
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    }
    if (status === 'DOWN') {
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    }

    // Incident Severity Colors
    if (status === 'LOW') {
      return 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800';
    }
    if (status === 'MEDIUM') {
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    }
    if (status === 'HIGH') {
      return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
    }
    if (status === 'CRITICAL') {
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    }

    // Incident Status Colors
    if (status === 'OPEN') {
      return 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800';
    }
    if (status === 'RESOLVED') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    }

    return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
  };

  const getStatusIcon = () => {
    if (status === 'UP' || status === 'RESOLVED') return '●';
    if (status === 'DEGRADED' || status === 'MEDIUM') return '◐';
    if (status === 'DOWN' || status === 'CRITICAL' || status === 'HIGH') return '✕';
    if (status === 'LOW') return 'ℹ';
    if (status === 'OPEN') return '◉';
    return '●';
  };

  const getDotColor = () => {
    if (status === 'UP' || status === 'RESOLVED') return 'bg-emerald-500';
    if (status === 'DEGRADED' || status === 'MEDIUM') return 'bg-amber-500';
    if (status === 'DOWN' || status === 'CRITICAL') return 'bg-red-500';
    if (status === 'HIGH') return 'bg-orange-500';
    if (status === 'LOW') return 'bg-sky-500';
    if (status === 'OPEN') return 'bg-violet-500';
    return 'bg-gray-500';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-300 hover:scale-105',
        getStatusStyles(),
        animated && 'animate-scale-in',
        className
      )}
    >
      {animated ? (
        <span className={cn('w-2 h-2 rounded-full', getDotColor(), (status === 'OPEN' || status === 'DOWN' || status === 'CRITICAL') && 'animate-pulse')} />
      ) : (
        <span className="text-sm leading-none">{getStatusIcon()}</span>
      )}
      {children || status}
    </span>
  );
}
