'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { incidentsAPI, servicesAPI } from '@/lib/api';
import { Incident, Service } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = getAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [incidentsRes, servicesRes] = await Promise.all([
          incidentsAPI.getAll(),
          servicesAPI.getAll(),
        ]);
        setIncidents(incidentsRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>
      </div>
    );
  }

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'CLOSED' && i.status !== 'RESOLVED'
  );
  const degradedServices = services.filter((s) => s.status !== 'OPERATIONAL');

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>Open or investigating</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeIncidents.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Services</CardTitle>
              <CardDescription>All monitored services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{services.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Degraded Services</CardTitle>
              <CardDescription>Not operational</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{degradedServices.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>Latest incident reports</CardDescription>
              </div>
              <Link href="/incidents">
                <Button variant="outline">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="mb-4 pb-4 border-b last:border-0">
                  <Link href={`/incidents/${incident.id}`}>
                    <h3 className="font-semibold hover:text-blue-600">{incident.title}</h3>
                  </Link>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                      {incident.severity}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-200 dark:bg-blue-900">
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Services Status</CardTitle>
                <CardDescription>Current service health</CardDescription>
              </div>
              <Link href="/services">
                <Button variant="outline">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {services.slice(0, 5).map((service) => (
                <div key={service.id} className="mb-4 pb-4 border-b last:border-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{service.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        service.status === 'OPERATIONAL'
                          ? 'bg-green-200 dark:bg-green-900'
                          : service.status === 'DEGRADED'
                          ? 'bg-yellow-200 dark:bg-yellow-900'
                          : service.status === 'DOWN'
                          ? 'bg-red-200 dark:bg-red-900'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
