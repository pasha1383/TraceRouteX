import { cn } from '@/lib/utils';
import { ServiceStatus, IncidentSeverity, IncidentStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ServiceStatus | IncidentSeverity | IncidentStatus;
  className?: string;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps & { children?: React.ReactNode }) {
  const getStatusStyles = () => {
    // Service Status Colors
    if (status === 'OPERATIONAL') {
      return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    }
    if (status === 'DEGRADED') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    }
    if (status === 'DOWN') {
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    }
    if (status === 'MAINTENANCE') {
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    }

    // Incident Severity Colors
    if (status === 'LOW') {
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    }
    if (status === 'MEDIUM') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    }
    if (status === 'HIGH') {
      return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
    }
    if (status === 'CRITICAL') {
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    }

    // Incident Status Colors
    if (status === 'OPEN') {
      return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    }
    if (status === 'INVESTIGATING') {
      return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
    }
    if (status === 'RESOLVED') {
      return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    }
    if (status === 'CLOSED') {
      return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    }

    return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
  };

  const getStatusIcon = () => {
    if (status === 'OPERATIONAL' || status === 'RESOLVED' || status === 'CLOSED') {
      return '●';
    }
    if (status === 'DEGRADED' || status === 'MEDIUM' || status === 'INVESTIGATING') {
      return '◐';
    }
    if (status === 'DOWN' || status === 'CRITICAL' || status === 'HIGH') {
      return '✕';
    }
    if (status === 'MAINTENANCE' || status === 'LOW') {
      return '⚙';
    }
    return '●';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        getStatusStyles(),
        className
      )}
    >
      <span className="text-sm leading-none">{getStatusIcon()}</span>
      {children || status}
    </span>
  );
}
