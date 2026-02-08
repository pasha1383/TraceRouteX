'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth } from '@/lib/auth';
import { incidentsAPI, servicesAPI } from '@/lib/api';
import { Incident, Service, IncidentFilters } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/Skeleton';
import { toast } from 'sonner';
import { Plus, AlertTriangle, Clock, Filter, X, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IncidentsPage() {
  const router = useRouter();
  const { user } = getAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IncidentFilters>({});

  const fetchIncidents = async (currentFilters?: IncidentFilters) => {
    try {
      const response = await incidentsAPI.getAll(currentFilters || filters);
      setIncidents(response.data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchServices();
  }, []);

  const handleApplyFilters = () => {
    setLoading(true);
    fetchIncidents(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setLoading(true);
    fetchIncidents({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  const canCreateIncident = user?.role === 'ENGINEER' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
        <div className="flex justify-between items-center mb-6 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Incidents
            </h1>
            <p className="text-muted-foreground mt-2">Track and manage system incidents</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn('gap-2 transition-all', hasActiveFilters && 'ring-2 ring-blue-400/50')}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== undefined && v !== '').length}
                </span>
              )}
            </Button>
            {canCreateIncident && (
              <Link href="/incidents/new">
                <Button size="sm" className="gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-105">
                  <Plus className="h-4 w-4" />
                  New Incident
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-6 animate-fade-in-down border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Severity</label>
                  <select
                    className="w-full border rounded-lg p-2.5 bg-background text-sm cursor-pointer"
                    value={filters.severity || ''}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value as IncidentFilters['severity'] || undefined })}
                  >
                    <option value="">All</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
                  <select
                    className="w-full border rounded-lg p-2.5 bg-background text-sm cursor-pointer"
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as IncidentFilters['status'] || undefined })}
                  >
                    <option value="">All</option>
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Service</label>
                  <select
                    className="w-full border rounded-lg p-2.5 bg-background text-sm cursor-pointer"
                    value={filters.serviceId || ''}
                    onChange={(e) => setFilters({ ...filters, serviceId: e.target.value || undefined })}
                  >
                    <option value="">All Services</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Start Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-2.5 bg-background text-sm"
                    value={filters.startDate || ''}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">End Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-2.5 bg-background text-sm"
                    value={filters.endDate || ''}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button size="sm" onClick={handleApplyFilters} className="gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  Apply Filters
                </Button>
                {hasActiveFilters && (
                  <Button size="sm" variant="ghost" onClick={handleClearFilters} className="gap-2 text-muted-foreground">
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid gap-6 stagger-children">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">
              {hasActiveFilters ? 'No matching incidents' : 'No incidents found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {hasActiveFilters ? 'Try adjusting your filters' : 'All systems running smoothly'}
            </p>
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 stagger-children">
            {incidents.map((incident) => {
              const getBorderColor = () => {
                if (incident.severity === 'CRITICAL') return 'border-l-red-500';
                if (incident.severity === 'HIGH') return 'border-l-orange-500';
                if (incident.severity === 'MEDIUM') return 'border-l-amber-500';
                return 'border-l-sky-500';
              };

              return (
                <Link href={`/incidents/${incident.id}`} key={incident.id}>
                  <Card className={cn('border-l-4 card-hover cursor-pointer group', getBorderColor())}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-2 flex items-center gap-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{incident.title}</span>
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {incident.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex gap-2 flex-wrap items-center">
                          <StatusBadge status={incident.severity} />
                          <StatusBadge status={incident.status} />
                          {incident.isPublic && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800">
                              Public
                            </span>
                          )}
                          {incident.service && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              <Server className="h-3 w-3" />
                              {incident.service.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(incident.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
