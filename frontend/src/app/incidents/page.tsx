'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth } from '@/lib/auth';
import { incidentsAPI } from '@/lib/api';
import { Incident } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Incidents</h1>
          {canCreateIncident && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create Incident</Button>
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
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardHeader>
                  <Link href={`/incidents/${incident.id}`}>
                    <CardTitle className="hover:text-blue-600 cursor-pointer">
                      {incident.title}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {incident.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded ${
                      incident.severity === 'CRITICAL' ? 'bg-red-200 dark:bg-red-900' :
                      incident.severity === 'HIGH' ? 'bg-orange-200 dark:bg-orange-900' :
                      incident.severity === 'MEDIUM' ? 'bg-yellow-200 dark:bg-yellow-900' :
                      'bg-green-200 dark:bg-green-900'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-200 dark:bg-blue-900">
                      {incident.status}
                    </span>
                    {incident.isPublic && (
                      <span className="text-xs px-2 py-1 rounded bg-purple-200 dark:bg-purple-900">
                        Public
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                      {new Date(incident.createdAt).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
