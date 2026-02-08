'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Service, Incident } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublicStatusPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const [servicesData, incidentsData] = await Promise.all([
        api.getPublicServices(),
        api.getPublicIncidents(),
      ]);
      setServices(servicesData);
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Failed to fetch public data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    OPERATIONAL: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    DEGRADED: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    DOWN: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    MAINTENANCE: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  };

  const severityColors: Record<string, string> = {
    LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Loading status...</p>
      </div>
    );
  }

  const allOperational = services.every((s) => s.status === 'OPERATIONAL');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <span className="text-4xl">📡</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            System Status
          </h1>
          <p className="text-2xl font-medium">
            {allOperational ? (
              <span className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                All Systems Operational
              </span>
            ) : (
              <span className="text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                Some Systems Experiencing Issues
              </span>
            )}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Service Status</CardTitle>
            <CardDescription>Current status of all services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-5 border-l-4 rounded-lg transition-all hover:shadow-md ${statusColors[service.status]}`}
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm opacity-90">{service.description}</p>
                    )}
                  </div>
                  <span className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {incidents.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Active Incidents</CardTitle>
              <CardDescription>Currently reported incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {incidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-xl">{incident.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{incident.description}</p>
                  <div className="text-sm text-muted-foreground">
                    Status: <span className="font-medium">{incident.status}</span> •{' '}
                    {new Date(incident.createdAt).toLocaleString()}
                  </div>
                  {incident.updates && incident.updates.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-semibold text-sm mb-3">Recent Updates</h4>
                      <div className="space-y-3">
                        {incident.updates.slice(0, 3).map((update) => (
                          <div key={update.id} className="bg-muted/50 rounded-lg p-3">
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
        )}

        {incidents.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl font-medium text-green-600 dark:text-green-400">No active incidents</p>
              <p className="text-muted-foreground mt-2">All systems are running smoothly</p>
            </CardContent>
          </Card>
        )}
        
        <footer className="text-center text-sm text-muted-foreground py-6">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-2">TraceRouteX Status Page • Real-time system monitoring</p>
        </footer>
      </div>
    </div>
  );
}
