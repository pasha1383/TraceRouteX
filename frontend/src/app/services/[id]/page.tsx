'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Service, Incident } from '@/lib/types';
import { getAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard, SkeletonTable } from '@/components/Skeleton';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle as AlertTriangleIcon,
  XCircle,
  Wrench,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusButtons = [
  { status: 'OPERATIONAL', label: 'Operational', icon: CheckCircle, color: 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 border-green-200 dark:border-green-800' },
  { status: 'DEGRADED', label: 'Degraded', icon: AlertTriangleIcon, color: 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800' },
  { status: 'DOWN', label: 'Down', icon: XCircle, color: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800' },
  { status: 'MAINTENANCE', label: 'Maintenance', icon: Wrench, color: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = getAuth();
  const [service, setService] = useState<Service | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const canEdit = user?.role === 'ENGINEER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchServiceDetails();
    fetchIncidents();
  }, [params.id]);

  const fetchServiceDetails = async () => {
    try {
      const data = await api.getServiceById(params.id as string);
      setService(data);
    } catch (error) {
      toast.error('Failed to fetch service details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!service) return;
    
    try {
      await api.updateServiceStatus(service.id, newStatus);
      toast.success(`Service marked as ${newStatus}`);
      fetchServiceDetails();
    } catch (error) {
      toast.error('Failed to update service status');
      console.error(error);
    }
  };

  const getStatusBorder = () => {
    if (!service) return 'border-l-gray-300';
    switch (service.status) {
      case 'OPERATIONAL': return 'border-l-green-500';
      case 'DEGRADED': return 'border-l-yellow-500';
      case 'DOWN': return 'border-l-red-500';
      case 'MAINTENANCE': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <SkeletonCard />
          <SkeletonTable />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Service not found</h2>
          <p className="text-muted-foreground mb-6">The service you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/services')}>Back to Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Back link */}
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        {/* Service Header */}
        <Card className={cn('border-l-4 shadow-lg', getStatusBorder())}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <CardTitle className="text-3xl">{service.name}</CardTitle>
                <CardDescription className="text-base">
                  {service.description || 'No description provided'}
                </CardDescription>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last updated: {new Date(service.updatedAt).toLocaleString()}
                </div>
              </div>
              <StatusBadge status={service.status} />
            </div>
          </CardHeader>
          {canEdit && (
            <CardContent>
              <div>
                <p className="text-sm font-medium mb-3">Change Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusButtons.map((btn) => {
                    const Icon = btn.icon;
                    const isActive = service.status === btn.status;
                    return (
                      <button
                        key={btn.status}
                        onClick={() => handleStatusChange(btn.status)}
                        className={cn(
                          'inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                          btn.color,
                          isActive && 'ring-2 ring-offset-2 ring-current opacity-100',
                          !isActive && 'opacity-75 hover:opacity-100'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Incident History */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Incident History</CardTitle>
                <CardDescription>Recent incidents across all services</CardDescription>
              </div>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {incidents.length} total
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-semibold mb-1">No incidents</h3>
                <p className="text-muted-foreground">No incidents have been reported</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.slice(0, 10).map((incident) => {
                  const borderColor =
                    incident.severity === 'CRITICAL' ? 'border-l-red-500' :
                    incident.severity === 'HIGH' ? 'border-l-orange-500' :
                    incident.severity === 'MEDIUM' ? 'border-l-yellow-500' :
                    'border-l-blue-500';

                  return (
                    <div
                      key={incident.id}
                      className={cn(
                        'flex items-center justify-between gap-4 p-4 rounded-lg border border-l-4 hover:bg-muted/50 transition-colors cursor-pointer',
                        borderColor
                      )}
                      onClick={() => router.push(`/incidents/${incident.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{incident.title}</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <StatusBadge status={incident.severity} />
                          <StatusBadge status={incident.status} />
                          <span className="text-xs text-muted-foreground">
                            {new Date(incident.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
