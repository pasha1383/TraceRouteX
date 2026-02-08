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
    OPERATIONAL: 'bg-green-100 text-green-800 border-green-300',
    DEGRADED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    DOWN: 'bg-red-100 text-red-800 border-red-300',
    MAINTENANCE: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const severityColors: Record<string, string> = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">System Status</h1>
          <p className="text-xl text-gray-600">
            {allOperational ? (
              <span className="text-green-600">All Systems Operational</span>
            ) : (
              <span className="text-yellow-600">Some Systems Experiencing Issues</span>
            )}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Current status of all services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-4 border-l-4 rounded ${statusColors[service.status]}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm opacity-80">{service.description}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {incidents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>Currently reported incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{incident.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-gray-600">{incident.description}</p>
                  <div className="text-sm text-gray-500">
                    Status: <span className="font-medium">{incident.status}</span> •{' '}
                    {new Date(incident.createdAt).toLocaleString()}
                  </div>
                  {incident.updates && incident.updates.length > 0 && (
                    <div className="mt-3 border-t pt-3">
                      <h4 className="font-semibold text-sm mb-2">Updates</h4>
                      <div className="space-y-2">
                        {incident.updates.slice(0, 3).map((update) => (
                          <div key={update.id} className="text-sm">
                            <span className="text-gray-500">
                              {new Date(update.createdAt).toLocaleString()}
                            </span>
                            <p className="text-gray-700">{update.content}</p>
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
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <p className="text-lg">No active incidents</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
