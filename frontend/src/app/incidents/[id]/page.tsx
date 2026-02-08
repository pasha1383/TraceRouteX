'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { incidentsAPI, updatesAPI } from '@/lib/api';
import { Incident } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = getAuth();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateContent, setUpdateContent] = useState('');
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
    try {
      await updatesAPI.create({
        incidentId: params.id as string,
        content: updateContent,
      });
      toast.success('Update added successfully');
      setUpdateContent('');
      fetchIncident();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add update');
    }
  };

  const handleUpdateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await incidentsAPI.update(params.id as string, editData);
      toast.success('Incident updated successfully');
      setEditMode(false);
      fetchIncident();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update incident');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this incident?')) return;
    
    try {
      await incidentsAPI.delete(params.id as string);
      toast.success('Incident deleted successfully');
      router.push('/incidents');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete incident');
    }
  };

  const canEdit = user?.role === 'ENGINEER' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">Incident not found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{incident.title}</h1>
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
              </div>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Button onClick={() => setEditMode(!editMode)} variant="outline">
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              )}
              {canDelete && (
                <Button onClick={handleDelete} variant="destructive">
                  Delete
                </Button>
              )}
            </div>
          </div>

          {editMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateIncident} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea
                      className="w-full border rounded-md p-2"
                      rows={4}
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={editData.severity}
                      onChange={(e) => setEditData({ ...editData, severity: e.target.value })}
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
                      className="w-full border rounded-md p-2"
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    >
                      <option value="OPEN">Open</option>
                      <option value="INVESTIGATING">Investigating</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editData.isPublic}
                      onChange={(e) => setEditData({ ...editData, isPublic: e.target.checked })}
                      className="mr-2"
                    />
                    <Label>Public Incident</Label>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{incident.description}</p>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>Created: {new Date(incident.createdAt).toLocaleString()}</p>
                  {incident.resolvedAt && (
                    <p>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Updates ({incident.updates?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {canEdit && (
              <form onSubmit={handleAddUpdate} className="mb-6 space-y-2">
                <textarea
                  className="w-full border rounded-md p-2"
                  placeholder="Add an update..."
                  rows={3}
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  required
                />
                <Button type="submit">Post Update</Button>
              </form>
            )}

            <div className="space-y-4">
              {incident.updates?.map((update) => (
                <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="whitespace-pre-wrap">{update.content}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {update.user?.email || 'Unknown'} • {new Date(update.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
