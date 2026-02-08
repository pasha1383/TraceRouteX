'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Service, Incident } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Filter incidents for this service (you'd need to add serviceId to Incident entity)
      setIncidents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!service) return;
    
    try {
      await api.updateServiceStatus(service.id, newStatus);
      toast.success('Service status updated');
      fetchServiceDetails();
    } catch (error) {
      toast.error('Failed to update service status');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-6">
          <p>Service not found</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    OPERATIONAL: 'bg-green-100 text-green-800',
    DEGRADED: 'bg-yellow-100 text-yellow-800',
    DOWN: 'bg-red-100 text-red-800',
    MAINTENANCE: 'bg-blue-100 text-blue-800',
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{service.name}</h1>
          <Button variant="outline" onClick={() => router.push('/services')}>
            Back to Services
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-semibold">Status: </span>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[service.status]}`}>
                {service.status}
              </span>
            </div>
            <div>
              <span className="font-semibold">Description: </span>
              <span>{service.description || 'No description'}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleStatusChange('OPERATIONAL')} size="sm">
                Mark Operational
              </Button>
              <Button onClick={() => handleStatusChange('DEGRADED')} size="sm" variant="outline">
                Mark Degraded
              </Button>
              <Button onClick={() => handleStatusChange('DOWN')} size="sm" variant="destructive">
                Mark Down
              </Button>
              <Button onClick={() => handleStatusChange('MAINTENANCE')} size="sm" variant="secondary">
                Mark Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident History</CardTitle>
            <CardDescription>Recent incidents for this service</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No incidents found
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.title}</TableCell>
                      <TableCell>{incident.severity}</TableCell>
                      <TableCell>{incident.status}</TableCell>
                      <TableCell>{new Date(incident.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/incidents/${incident.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
