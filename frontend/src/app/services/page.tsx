'use client';

import { useEffect, useState } from 'react';
import { getAuth } from '@/lib/auth';
import { servicesAPI } from '@/lib/api';
import { Service } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { ServiceCard } from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SkeletonCard } from '@/components/Skeleton';
import { toast } from 'sonner';
import { Plus, Server } from 'lucide-react';

export default function ServicesPage() {
  const { user } = getAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'UP',
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
      setFormData({ name: '', description: '', status: 'UP' });
      fetchServices();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to create service');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await servicesAPI.updateStatus(id, status);
      toast.success('Service status updated');
      fetchServices();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to update service');
    }
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      await servicesAPI.delete(serviceToDelete);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to delete service');
    } finally {
      setServiceToDelete(null);
    }
  };

  // Only ADMIN can create services
  const canCreateService = user?.role === 'ADMIN';
  // ENGINEER and ADMIN can change status
  const canChangeStatus = user?.role === 'ENGINEER' || user?.role === 'ADMIN';
  // Only ADMIN can delete services
  const canDeleteService = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Services
            </h1>
            <p className="text-muted-foreground mt-2">Manage and monitor all system services</p>
          </div>
          {canCreateService && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-105">
                  <Plus className="h-5 w-5" />
                  Create Service
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-scale-in">
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
                      placeholder="e.g., API Gateway"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full border rounded-lg p-3 mt-1 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[80px]"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the service..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Initial Status</Label>
                    <select
                      id="status"
                      className="w-full border rounded-lg p-2.5 mt-1 bg-background cursor-pointer"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="UP">Up</option>
                      <option value="DEGRADED">Degraded</option>
                      <option value="DOWN">Down</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">Create Service</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 stagger-children">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <Server className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground mb-6">Get started by creating your first service</p>
            {canCreateService && (
              <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Service
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 stagger-children">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                onStatusChange={handleUpdateStatus}
                onDelete={handleDeleteClick}
                canChangeStatus={canChangeStatus}
                canDelete={canDeleteService}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
