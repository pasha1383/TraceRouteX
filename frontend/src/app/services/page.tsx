'use client';

import { useEffect, useState } from 'react';
import { getAuth } from '@/lib/auth';
import { servicesAPI } from '@/lib/api';
import { Service } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ServicesPage() {
  const { user } = getAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'OPERATIONAL',
  });

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await servicesAPI.create(formData);
      toast.success('Service created successfully');
      setDialogOpen(false);
      setFormData({ name: '', description: '', status: 'OPERATIONAL' });
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create service');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await servicesAPI.update(id, { status });
      toast.success('Service status updated');
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await servicesAPI.delete(id);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete service');
    }
  };

  const canCreateService = user?.role === 'ENGINEER' || user?.role === 'ADMIN';
  const canDeleteService = user?.role === 'ADMIN';

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Services</h1>
          {canCreateService && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create Service</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Service</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full border rounded-md p-2"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full border rounded-md p-2"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="OPERATIONAL">Operational</option>
                      <option value="DEGRADED">Degraded</option>
                      <option value="DOWN">Down</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
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
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{service.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {canCreateService && (
                        <select
                          className="border rounded-md p-2 text-sm"
                          value={service.status}
                          onChange={(e) => handleUpdateStatus(service.id, e.target.value)}
                        >
                          <option value="OPERATIONAL">Operational</option>
                          <option value="DEGRADED">Degraded</option>
                          <option value="DOWN">Down</option>
                          <option value="MAINTENANCE">Maintenance</option>
                        </select>
                      )}
                      {canDeleteService && (
                        <Button
                          onClick={() => handleDelete(service.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 items-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      service.status === 'OPERATIONAL' ? 'bg-green-200 dark:bg-green-900' :
                      service.status === 'DEGRADED' ? 'bg-yellow-200 dark:bg-yellow-900' :
                      service.status === 'DOWN' ? 'bg-red-200 dark:bg-red-900' :
                      'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {service.status}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Updated: {new Date(service.updatedAt).toLocaleString()}
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
