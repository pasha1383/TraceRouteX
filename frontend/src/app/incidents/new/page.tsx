'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { ArrowLeft, AlertTriangle, Eye, EyeOff, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const severityOptions = [
  { value: 'LOW', label: 'Low', description: 'Minor issue, no user impact', color: 'border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' },
  { value: 'MEDIUM', label: 'Medium', description: 'Moderate issue, limited impact', color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400' },
  { value: 'HIGH', label: 'High', description: 'Major issue, significant impact', color: 'border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400' },
  { value: 'CRITICAL', label: 'Critical', description: 'System down, all users affected', color: 'border-red-300 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400' },
];

export default function NewIncidentPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const incident = await api.createIncident(formData);
      toast.success('Incident created successfully');
      router.push(`/incidents/${incident.id}`);
    } catch (error) {
      toast.error('Failed to create incident');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/incidents" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Incidents
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <AlertTriangle className="h-9 w-9 text-orange-500" />
            Report Incident
          </h1>
          <p className="text-muted-foreground mt-2">Create a new incident report to track and resolve issues</p>
        </div>

        <Card className="shadow-xl border-0 dark:border">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Incident Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., API Gateway returning 500 errors"
                  className="h-12 text-base"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full min-h-[140px] px-4 py-3 border rounded-lg text-base bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Describe the incident in detail: what happened, what's affected, and any initial observations..."
                />
              </div>

              {/* Severity */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Severity Level <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {severityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: opt.value })}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        formData.severity === opt.value
                          ? `${opt.color} ring-2 ring-offset-2 ring-current shadow-sm`
                          : 'border-muted hover:border-foreground/20'
                      )}
                    >
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs mt-0.5 opacity-80">{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Public toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Visibility</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: false })}
                    className={cn(
                      'flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                      !formData.isPublic
                        ? 'border-foreground/30 bg-muted/50 ring-2 ring-offset-2 ring-foreground/20'
                        : 'border-muted hover:border-foreground/20'
                    )}
                  >
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Private</div>
                      <div className="text-xs text-muted-foreground">Only visible to team members</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: true })}
                    className={cn(
                      'flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                      formData.isPublic
                        ? 'border-purple-300 bg-purple-50 dark:bg-purple-950/30 ring-2 ring-offset-2 ring-purple-400/50'
                        : 'border-muted hover:border-foreground/20'
                    )}
                  >
                    <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Public</div>
                      <div className="text-xs text-muted-foreground">Visible on the status page</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" disabled={loading} className="gap-2 h-11 px-6">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Create Incident
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/incidents')} className="h-11">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
