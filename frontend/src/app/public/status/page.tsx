'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Service, Incident } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PublicStatusPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchPublicData = async () => {
    try {
      const [servicesData, incidentsData] = await Promise.all([
        api.getPublicServices(),
        api.getPublicIncidents(),
      ]);
      setServices(servicesData);
      setIncidents(incidentsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch public data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPublicData, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle; label: string }> = {
    UP: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', icon: CheckCircle, label: 'Operational' },
    DEGRADED: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', icon: AlertTriangle, label: 'Degraded' },
    DOWN: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', icon: XCircle, label: 'Down' },
  };

  const severityColors: Record<string, string> = {
    LOW: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    MEDIUM: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/25 animate-bounce-subtle">
            <span className="text-2xl text-white font-bold">TX</span>
          </div>
          <p className="text-lg font-medium">Loading status...</p>
        </div>
      </div>
    );
  }

  const allUp = services.every((s) => s.status === 'UP');
  const hasDown = services.some((s) => s.status === 'DOWN');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Nav */}
      <nav className="border-b glass sticky top-0 z-50 animate-fade-in-down">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-xs">TX</span>
            </div>
            <span className="text-sm font-bold">TraceRouteX</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchPublicData} className="gap-1.5 text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Link href="/login">
              <Button size="sm" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-4xl space-y-8 page-enter">
        {/* Header */}
        <div className="text-center space-y-4 py-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-xl shadow-blue-500/25 animate-float">
            <span className="text-4xl">📡</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            System Status
          </h1>
          <div className={cn(
            'inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-lg font-semibold border shadow-lg',
            allUp
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 shadow-emerald-500/10'
              : hasDown
                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 shadow-red-500/10'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 shadow-amber-500/10'
          )}>
            <span className={cn(
              'w-3 h-3 rounded-full animate-pulse',
              allUp ? 'bg-emerald-500' : hasDown ? 'bg-red-500' : 'bg-amber-500'
            )} />
            {allUp ? 'All Systems Operational' : hasDown ? 'Major Outage Detected' : 'Some Systems Experiencing Issues'}
          </div>
        </div>

        {/* Services */}
        <Card className="shadow-xl border-0 dark:border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Service Status</CardTitle>
            <CardDescription>Current status of all services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 stagger-children">
            {services.map((service) => {
              const config = statusConfig[service.status] || statusConfig.UP;
              const Icon = config.icon;

              return (
                <div
                  key={service.id}
                  className={cn(
                    'p-5 border-l-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
                    config.bg
                  )}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm opacity-80">{service.description}</p>
                      )}
                    </div>
                    <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold', config.color)}>
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Incidents */}
        {incidents.length > 0 ? (
          <Card className="shadow-xl border-0 dark:border animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-2xl">Active Incidents</CardTitle>
              <CardDescription>Currently reported incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 stagger-children">
              {incidents.map((incident) => (
                <div key={incident.id} className="border rounded-xl p-5 space-y-3 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-xl">{incident.title}</h3>
                    <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', severityColors[incident.severity])}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{incident.description}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-semibold',
                      incident.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                    )}>
                      {incident.status}
                    </span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(incident.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Root Cause Summary */}
                  {incident.rootCauseSummary && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Root Cause</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{incident.rootCauseSummary}</p>
                    </div>
                  )}

                  {incident.updates && incident.updates.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-semibold text-sm mb-3">Recent Updates</h4>
                      <div className="space-y-3">
                        {incident.updates.slice(0, 3).map((update) => (
                          <div key={update.id} className="bg-muted/50 rounded-xl p-3 hover:bg-muted/80 transition-colors">
                            <span className="text-xs text-muted-foreground">
                              {new Date(update.createdAt).toLocaleString()}
                            </span>
                            <p className="text-sm mt-1">{update.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 dark:border animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4 animate-bounce-subtle">✅</div>
              <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">No active incidents</p>
              <p className="text-muted-foreground mt-2">All systems are running smoothly</p>
            </CardContent>
          </Card>
        )}

        <footer className="text-center text-sm text-muted-foreground py-6 space-y-2 animate-fade-in">
          <p className="flex items-center justify-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Last updated: {lastUpdated.toLocaleString()}
          </p>
          <p className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">TX</span>
            </div>
            TraceRouteX Status Page • Real-time system monitoring
          </p>
        </footer>
      </div>
    </div>
  );
}
