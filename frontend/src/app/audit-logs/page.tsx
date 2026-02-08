'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { auditLogsAPI } from '@/lib/api';
import { AuditLog } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SkeletonTable } from '@/components/Skeleton';
import { ScrollText, Clock, User, Tag, Hash, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const actionStyles: Record<string, string> = {
  CREATED: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  UPDATED: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  DELETED: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const getActionStyle = (action: string) => {
  if (action.includes('CREATE') || action.includes('REGISTER') || action.includes('LOGIN')) return actionStyles.CREATED;
  if (action.includes('DELETE')) return actionStyles.DELETED;
  return actionStyles.UPDATED;
};

const getActionIcon = (action: string) => {
  if (action.includes('CREATE') || action.includes('REGISTER')) return '✨';
  if (action.includes('DELETE')) return '🗑️';
  if (action.includes('LOGIN')) return '🔐';
  if (action.includes('RESOLVE')) return '✅';
  if (action.includes('PUBLISH')) return '📢';
  return '✏️';
};

export default function AuditLogsPage() {
  const router = useRouter();
  const { user } = getAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEntity, setFilterEntity] = useState<string>('all');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchLogs = async () => {
      try {
        const response = await auditLogsAPI.getAll();
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user, router]);

  const entityTypes = ['all', ...Array.from(new Set(logs.map((l) => l.entityType)))];
  const filteredLogs = filterEntity === 'all' ? logs : logs.filter((l) => l.entityType === filterEntity);

  const actionCount = (type: string) => {
    if (type === 'create') return logs.filter((l) => l.action.includes('CREATE') || l.action.includes('REGISTER')).length;
    if (type === 'update') return logs.filter((l) => l.action.includes('UPDATE') || l.action.includes('RESOLVE') || l.action.includes('PUBLISH') || l.action.includes('LOGIN')).length;
    if (type === 'delete') return logs.filter((l) => l.action.includes('DELETE')).length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <ScrollText className="h-9 w-9 text-blue-500" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-2">Complete activity trail for compliance and accountability</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
          <Card className="shadow-md card-hover">
            <CardContent className="pt-6 pb-4">
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-3xl font-bold mt-1">{logs.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-l-4 border-l-emerald-500 card-hover">
            <CardContent className="pt-6 pb-4">
              <p className="text-sm text-muted-foreground">Creates</p>
              <p className="text-3xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{actionCount('create')}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-l-4 border-l-blue-500 card-hover">
            <CardContent className="pt-6 pb-4">
              <p className="text-sm text-muted-foreground">Updates</p>
              <p className="text-3xl font-bold mt-1 text-blue-600 dark:text-blue-400">{actionCount('update')}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-l-4 border-l-red-500 card-hover">
            <CardContent className="pt-6 pb-4">
              <p className="text-sm text-muted-foreground">Deletes</p>
              <p className="text-3xl font-bold mt-1 text-red-600 dark:text-red-400">{actionCount('delete')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter by entity:</span>
          <div className="flex gap-2 flex-wrap">
            {entityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterEntity(type)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border hover:scale-105',
                  filterEntity === type
                    ? 'bg-foreground text-background border-foreground shadow-md'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
                )}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Activity Log</CardTitle>
                <CardDescription>Showing {filteredLogs.length} of {logs.length} events</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonTable />
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <ScrollText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-lg font-semibold mb-1">No logs found</h3>
                <p className="text-muted-foreground">No audit events match your current filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Timestamp</div></TableHead>
                      <TableHead><div className="flex items-center gap-2"><User className="h-4 w-4" /> Actor</div></TableHead>
                      <TableHead><div className="flex items-center gap-2"><Tag className="h-4 w-4" /> Action</div></TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead><div className="flex items-center gap-2"><Hash className="h-4 w-4" /> ID</div></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                              {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                              {log.actorId.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                              {log.actorId.substring(0, 8)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all group-hover:scale-105',
                            getActionStyle(log.action)
                          )}>
                            <span>{getActionIcon(log.action)}</span>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium">
                            {log.entityType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {log.entityId.substring(0, 8)}...
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
