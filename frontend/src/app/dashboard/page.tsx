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
import { SkeletonDashboard } from '@/components/Skeleton';
import Link from 'next/link';
import { Activity, AlertTriangle, Server, TrendingUp, ArrowRight, CheckCircle, Clock } from 'lucide-react';

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
            <div className="h-10 w-64 bg-muted rounded-lg animate-pulse mb-2" />
            <div className="h-6 w-96 bg-muted rounded-lg animate-pulse" />
          </div>
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  const activeIncidents = incidents.filter((i) => i.status === 'OPEN');
  const resolvedIncidents = incidents.filter((i) => i.status === 'RESOLVED');
  const degradedServices = services.filter((s) => s.status !== 'UP');
  const upServices = services.filter((s) => s.status === 'UP');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, <span className="font-semibold text-foreground">{user?.email?.split('@')[0]}</span>
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {user?.role}
            </span>
          </p>
        </div>

        {/* System Health Banner */}
        <div className={`mb-8 rounded-2xl p-6 border animate-fade-in-up ${
          degradedServices.length === 0
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800'
        }`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            {degradedServices.length === 0 ? (
              <>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">All Systems Operational</span>
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 ml-auto" />
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  {degradedServices.length} service{degradedServices.length > 1 ? 's' : ''} experiencing issues
                </span>
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 ml-auto" />
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
          <Card className="border-l-4 border-l-red-500 card-hover shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase font-semibold tracking-wider">Open Incidents</CardDescription>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{activeIncidents.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 card-hover shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase font-semibold tracking-wider">Resolved</CardDescription>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{resolvedIncidents.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Successfully resolved</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 card-hover shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase font-semibold tracking-wider">Total Services</CardDescription>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{services.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-emerald-600 font-medium">{upServices.length} up</span> · {degradedServices.length} issues
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 card-hover shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase font-semibold tracking-wider">Affected Services</CardDescription>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{degradedServices.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Degraded or down</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incidents */}
          <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Incidents</CardTitle>
                <CardDescription>Latest incident reports</CardDescription>
              </div>
              <Link href="/incidents">
                <Button variant="outline" size="sm" className="gap-2 hover:shadow-md transition-shadow">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {incidents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="font-medium">No incidents reported</p>
                  <p className="text-sm mt-1">Everything is running smoothly</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.slice(0, 5).map((incident, index) => (
                    <Link href={`/incidents/${incident.id}`} key={incident.id}>
                      <div
                        className="p-3 rounded-xl border hover:bg-muted/50 hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 hover:shadow-sm"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <h3 className="font-semibold mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{incident.title}</h3>
                        <div className="flex gap-2 flex-wrap items-center">
                          <StatusBadge status={incident.severity} />
                          <StatusBadge status={incident.status} />
                          {incident.service && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {incident.service.name}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(incident.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Status */}
          <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Services Status</CardTitle>
                <CardDescription>Current service health</CardDescription>
              </div>
              <Link href="/services">
                <Button variant="outline" size="sm" className="gap-2 hover:shadow-md transition-shadow">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="font-medium">No services configured</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.slice(0, 7).map((service, index) => (
                    <Link href={`/services/${service.id}`} key={service.id}>
                      <div
                        className="flex justify-between items-center gap-4 p-3 rounded-xl border hover:bg-muted/50 hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 hover:shadow-sm"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            service.status === 'UP' ? 'bg-emerald-500' :
                            service.status === 'DEGRADED' ? 'bg-amber-500 animate-pulse' :
                            'bg-red-500 animate-pulse'
                          }`} />
                          <h3 className="font-semibold truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{service.name}</h3>
                        </div>
                        <StatusBadge status={service.status} animated />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
