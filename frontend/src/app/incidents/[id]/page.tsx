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
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, CheckCircle, Edit, Save, X } from 'lucide-react';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = getAuth();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateContent, setUpdateContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    severity: '',
    status: '',
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
        status: response.data.status,
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
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add update');
    }
  };

  const handleUpdateIncident = async () => {
    try {
      await incidentsAPI.update(params.id as string, editData);
      toast.success('Incident updated successfully');
      setEditMode(false);
      fetchIncident();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update incident');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await incidentsAPI.delete(params.id as string);
      toast.success('Incident deleted successfully');
      router.push('/incidents');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete incident');
    }
  };

  const handleTogglePublic = async () => {
    try {
      await incidentsAPI.publish(params.id as string, !incident?.isPublic);
      toast.success(`Incident is now ${incident?.isPublic ? 'private' : 'public'}`);
      fetchIncident();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to toggle visibility');
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
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p>Incident not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/incidents" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Incidents
        </Link>

        {/* Incident Header */}
        <Card className="mb-6 border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              {editMode ? (
                <div className="flex-1 space-y-4">
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="text-2xl font-bold"
                    placeholder="Incident title"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full border rounded-md p-3 min-h-[100px]"
                    placeholder="Incident description"
                  />
                  <div className="flex gap-4">
                    <div>
                      <Label>Severity</Label>
                      <select
                        value={editData.severity}
                        onChange={(e) => setEditData({ ...editData, severity: e.target.value })}
                        className="w-full border rounded-md p-2 mt-1"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full border rounded-md p-2 mt-1"
                      >
                        <option value="OPEN">Open</option>
                        <option value="INVESTIGATING">Investigating</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-4">{incident.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap mb-4">
                    <StatusBadge status={incident.severity} />
                    <StatusBadge status={incident.status} />
                    {incident.isPublic && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                        <Eye className="h-3 w-3" />
                        Public
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{incident.description}</p>
                  
                  {incident.resolvedAt && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Incident Resolved</p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {new Date(incident.resolvedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 flex-shrink-0">
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
                        <Button onClick={() => setEditMode(true)} variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button onClick={handleTogglePublic} variant="outline" size="sm" className="gap-2">
                          {incident.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          {incident.isPublic ? 'Make Private' : 'Make Public'}
                        </Button>
                      </>
                    )}
                  </>
                )}
                {canDelete && !editMode && (
                  <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Add Update Form */}
        {canEdit && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Add Update</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="update">Update Content</Label>
                  <textarea
                    id="update"
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    className="w-full border rounded-md p-3 mt-1 min-h-[100px]"
                    placeholder="Describe the latest developments..."
                    required
                  />
                </div>
                <Button type="submit" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Update
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incident Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentTimeline updates={incident.updates || []} />
          </CardContent>
        </Card>
      </div>

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
