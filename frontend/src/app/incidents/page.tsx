'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth } from '@/lib/auth';
import { incidentsAPI } from '@/lib/api';
import { Incident } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/Skeleton';
import { toast } from 'sonner';
import { Plus, AlertTriangle, Clock } from 'lucide-react';

export default function IncidentsPage() {
  const router = useRouter();
  const { user } = getAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    isPublic: false,
  });

  const fetchIncidents = async () => {
    try {
      const response = await incidentsAPI.getAll();
      setIncidents(response.data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await incidentsAPI.create(formData);
      toast.success('Incident created successfully');
      setDialogOpen(false);
      setFormData({ title: '', description: '', severity: 'MEDIUM', isPublic: false });
      fetchIncidents();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create incident');
    }
  };

  const canCreateIncident = user?.role === 'ENGINEER' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Incidents
            </h1>
            <p className="text-muted-foreground mt-2">Track and manage system incidents</p>
          </div>
          {canCreateIncident && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create Incident
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Incident</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full border rounded-md p-2"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <select
                      id="severity"
                      className="w-full border rounded-md p-2"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="mr-2"
                    />
                    <Label htmlFor="isPublic">Public Incident</Label>
                  </div>
                  <Button type="submit" className="w-full">Create</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No incidents found</h3>
            <p className="text-muted-foreground mb-6">All systems running smoothly</p>
            {canCreateIncident && (
              <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Incident
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {incidents.map((incident) => {
              const getBorderColor = () => {
                if (incident.severity === 'CRITICAL') return 'border-l-red-500';
                if (incident.severity === 'HIGH') return 'border-l-orange-500';
                if (incident.severity === 'MEDIUM') return 'border-l-yellow-500';
                return 'border-l-blue-500';
              };

              return (
                <Link href={`/incidents/${incident.id}`} key={incident.id}>
                  <Card className={`border-l-4 transition-all hover:shadow-lg cursor-pointer ${getBorderColor()}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                            {incident.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {incident.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                          <StatusBadge status={incident.severity} />
                          <StatusBadge status={incident.status} />
                          {incident.isPublic && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                              Public
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
