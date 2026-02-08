'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth } from '@/lib/auth';
import { incidentsAPI } from '@/lib/api';
import { Incident } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import { IncidentTimeline } from '@/components/IncidentTimeline';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SkeletonTimeline } from '@/components/Skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, CheckCircle, Edit, Save, X, Server, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = getAuth();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateContent, setUpdateContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [rootCauseSummary, setRootCauseSummary] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    severity: '',
    isPublic: false,
  });

  const fetchIncident = async () => {
    try {
      const response = await incidentsAPI.getById(params.id as string);
      setIncident(response.data);
      setEditData({
        title: response.data.title,
        description: response.data.description,
        severity: response.data.severity,
        isPublic: response.data.isPublic,
      });
    } catch (error) {
      console.error('Failed to fetch incident:', error);
      toast.error('Failed to load incident');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [params.id]);

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateContent.trim()) return;

    try {
      await incidentsAPI.addUpdate(params.id as string, updateContent);
      toast.success('Update added successfully');
      setUpdateContent('');
      fetchIncident();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to add update');
    }
  };

  const handleUpdateIncident = async () => {
    try {
      await incidentsAPI.update(params.id as string, editData);
      toast.success('Incident updated successfully');
      setEditMode(false);
      fetchIncident();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to update incident');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await incidentsAPI.delete(params.id as string);
      toast.success('Incident deleted successfully');
      router.push('/incidents');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to delete incident');
    }
  };

  const handleResolveConfirm = async () => {
    try {
      await incidentsAPI.resolve(params.id as string, rootCauseSummary || undefined);
      toast.success('Incident resolved!');
      setResolveDialogOpen(false);
      setRootCauseSummary('');
      fetchIncident();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to resolve incident');
    }
  };

  const handleTogglePublic = async () => {
    try {
      await incidentsAPI.publish(params.id as string, !incident?.isPublic);
      toast.success(`Incident is now ${incident?.isPublic ? 'private' : 'public'}`);
      fetchIncident();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to toggle visibility');
    }
  };

  const canEdit = user?.role === 'ENGINEER' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
            <div className="h-10 w-2/3 bg-muted rounded animate-pulse" />
          </div>
          <SkeletonTimeline />
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center animate-fade-in-up">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Incident not found</h2>
          <p className="text-muted-foreground mb-6">The incident you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/incidents')}>Back to Incidents</Button>
        </div>
      </div>
    );
  }

  const getSeverityBorder = () => {
    switch (incident.severity) {
      case 'CRITICAL': return 'border-l-red-500';
      case 'HIGH': return 'border-l-orange-500';
      case 'MEDIUM': return 'border-l-amber-500';
      case 'LOW': return 'border-l-sky-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 page-enter">
        <Link href="/incidents" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors animate-fade-in">
          <ArrowLeft className="h-4 w-4" />
          Back to Incidents
        </Link>

        {/* Incident Header */}
        <Card className={cn('mb-6 border-l-4 shadow-lg animate-fade-in-up', getSeverityBorder())}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              {editMode ? (
                <div className="flex-1 space-y-4">
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="text-2xl font-bold h-12"
                    placeholder="Incident title"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full border rounded-xl p-3 min-h-[100px] bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Incident description"
                  />
                  <div>
                    <Label>Severity</Label>
                    <select
                      value={editData.severity}
                      onChange={(e) => setEditData({ ...editData, severity: e.target.value })}
                      className="w-full border rounded-lg p-2 mt-1 bg-background cursor-pointer"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-4">{incident.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap mb-4">
                    <StatusBadge status={incident.severity} animated />
                    <StatusBadge status={incident.status} animated />
                    {incident.isPublic && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800">
                        <Eye className="h-3 w-3" />
                        Public
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{incident.description}</p>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    {incident.service && (
                      <div className="flex items-center gap-1.5">
                        <Server className="h-4 w-4" />
                        <span>Service: <span className="font-medium text-foreground">{incident.service.name}</span></span>
                      </div>
                    )}
                    {incident.createdBy && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>Created by: <span className="font-medium text-foreground">{incident.createdBy.email}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Resolved banner */}
                  {incident.resolvedAt && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3 animate-fade-in">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Incident Resolved</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                          {new Date(incident.resolvedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Root Cause Summary */}
                  {incident.rootCauseSummary && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Root Cause Summary</span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{incident.rootCauseSummary}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                {canEdit && (
                  <>
                    {editMode ? (
                      <>
                        <Button onClick={handleUpdateIncident} size="sm" className="gap-2">
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                        <Button onClick={() => setEditMode(false)} variant="outline" size="sm" className="gap-2">
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setEditMode(true)} variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button onClick={handleTogglePublic} variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform">
                          {incident.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          {incident.isPublic ? 'Private' : 'Public'}
                        </Button>
                        {incident.status === 'OPEN' && (
                          <Button onClick={() => setResolveDialogOpen(true)} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}
                {canDelete && !editMode && (
                  <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive" size="sm" className="gap-2 hover:scale-105 transition-transform">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Add Update Form */}
        {canEdit && (
          <Card className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-500" />
                Add Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="update">Update Content</Label>
                  <textarea
                    id="update"
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    className="w-full border rounded-xl p-3 mt-1 min-h-[100px] bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-y"
                    placeholder="Describe the latest developments..."
                    required
                  />
                </div>
                <Button type="submit" className="gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                  <Plus className="h-4 w-4" />
                  Add Update
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Incident Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentTimeline updates={incident.updates || []} />
          </CardContent>
        </Card>
      </div>

      {/* Resolve Dialog */}
      <ConfirmDialog
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        onConfirm={handleResolveConfirm}
        title="Resolve Incident"
        description="Mark this incident as resolved. You can optionally add a root cause summary for post-mortem analysis."
        confirmText="Resolve"
        cancelText="Cancel"
      >
        <div className="mt-4 space-y-2">
          <Label htmlFor="rootCause" className="text-sm font-semibold">Root Cause Summary (optional)</Label>
          <textarea
            id="rootCause"
            value={rootCauseSummary}
            onChange={(e) => setRootCauseSummary(e.target.value)}
            className="w-full border rounded-xl p-3 min-h-[100px] bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            placeholder="What was the root cause? What steps were taken to resolve it?"
          />
        </div>
      </ConfirmDialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Incident"
        description="Are you sure you want to delete this incident? This action cannot be undone and will remove all associated updates."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
