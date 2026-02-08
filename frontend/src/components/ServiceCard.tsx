import { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Settings, Trash2 } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  className?: string;
}

export function ServiceCard({
  service,
  onStatusChange,
  onDelete,
  canEdit = false,
  canDelete = false,
  className
}: ServiceCardProps) {
  const getCardBorderColor = () => {
    switch (service.status) {
      case 'OPERATIONAL':
        return 'border-l-green-500';
      case 'DEGRADED':
        return 'border-l-yellow-500';
      case 'DOWN':
        return 'border-l-red-500';
      case 'MAINTENANCE':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Card className={cn('border-l-4 transition-all hover:shadow-lg', getCardBorderColor(), className)}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </div>
          <StatusBadge status={service.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Updated: {new Date(service.updatedAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            {canEdit && onStatusChange && (
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <select
                  className="text-sm border rounded-md px-2 py-1 bg-background"
                  value={service.status}
                  onChange={(e) => onStatusChange(service.id, e.target.value)}
                >
                  <option value="OPERATIONAL">Operational</option>
                  <option value="DEGRADED">Degraded</option>
                  <option value="DOWN">Down</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            )}
            {canDelete && onDelete && (
              <Button
                onClick={() => onDelete(service.id)}
                variant="destructive"
                size="sm"
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
