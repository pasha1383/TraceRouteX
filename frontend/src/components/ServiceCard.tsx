import { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Settings, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  service: Service;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  canChangeStatus?: boolean;
  canDelete?: boolean;
  className?: string;
  index?: number;
}

export function ServiceCard({
  service,
  onStatusChange,
  onDelete,
  canChangeStatus = false,
  canDelete = false,
  className,
  index = 0
}: ServiceCardProps) {
  const getCardBorderColor = () => {
    switch (service.status) {
      case 'UP':
        return 'border-l-emerald-500';
      case 'DEGRADED':
        return 'border-l-amber-500';
      case 'DOWN':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getGlowColor = () => {
    switch (service.status) {
      case 'UP':
        return 'hover:shadow-emerald-500/10';
      case 'DEGRADED':
        return 'hover:shadow-amber-500/10';
      case 'DOWN':
        return 'hover:shadow-red-500/10';
      default:
        return 'hover:shadow-gray-500/10';
    }
  };

  return (
    <Card
      className={cn(
        'border-l-4 card-hover group relative overflow-hidden',
        getCardBorderColor(),
        getGlowColor(),
        className
      )}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-50/30 group-hover:via-transparent group-hover:to-purple-50/30 dark:group-hover:from-blue-950/10 dark:group-hover:to-purple-950/10 transition-all duration-500 pointer-events-none" />

      <CardHeader className="relative">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 flex items-center gap-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {service.name}
              <Link href={`/services/${service.id}`}>
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity cursor-pointer" />
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">{service.description}</CardDescription>
          </div>
          <StatusBadge status={service.status} animated />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Updated: {new Date(service.updatedAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            {canChangeStatus && onStatusChange && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Settings className="h-4 w-4 text-muted-foreground animate-[spin_8s_linear_infinite]" />
                <select
                  className="text-sm border rounded-lg px-2 py-1.5 bg-background hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-400/30 cursor-pointer"
                  value={service.status}
                  onChange={(e) => onStatusChange(service.id, e.target.value)}
                >
                  <option value="UP">Up</option>
                  <option value="DEGRADED">Degraded</option>
                  <option value="DOWN">Down</option>
                </select>
              </div>
            )}
            {canDelete && onDelete && (
              <Button
                onClick={() => onDelete(service.id)}
                variant="destructive"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
