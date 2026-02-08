'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { incidentsAPI, servicesAPI } from '@/lib/api';
import { Incident, Service } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/Skeleton';
import Link from 'next/link';
import { Activity, AlertTriangle, Server, TrendingUp, ArrowRight } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-10 w-64 bg-muted rounded animate-pulse mb-2" />
            <div className="h-6 w-96 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'CLOSED' && i.status !== 'RESOLVED'
  );
  const degradedServices = services.filter((s) => s.status !== 'OPERATIONAL');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase font-semibold">Active Incidents</CardDescription>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{activeIncidents.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Open or investigating</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase font-semibold">Total Services</CardDescription>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{services.length}</p>
              <p className="text-sm text-muted-foreground mt-1">All monitored services</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase font-semibold">Degraded Services</CardDescription>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{degradedServices.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Not operational</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Incidents</CardTitle>
                <CardDescription>Latest incident reports</CardDescription>
              </div>
              <Link href="/incidents">
                <Button variant="outline" size="sm" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {incidents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No incidents reported</p>
                </div>
              ) : (
                incidents.slice(0, 5).map((incident) => (
                  <Link href={`/incidents/${incident.id}`} key={incident.id}>
                    <div className="mb-4 pb-4 border-b last:border-0 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors cursor-pointer">
                      <h3 className="font-semibold mb-2">{incident.title}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <StatusBadge status={incident.severity} />
                        <StatusBadge status={incident.status} />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Services Status</CardTitle>
                <CardDescription>Current service health</CardDescription>
              </div>
              <Link href="/services">
                <Button variant="outline" size="sm" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No services configured</p>
                </div>
              ) : (
                services.slice(0, 5).map((service) => (
                  <div key={service.id} className="mb-4 pb-4 border-b last:border-0">
                    <div className="flex justify-between items-center gap-4">
                      <h3 className="font-semibold flex-1">{service.name}</h3>
                      <StatusBadge status={service.status} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
