'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { getAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SkeletonTable } from '@/components/Skeleton';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Trash2, Users, Shield, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleBadgeStyles: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  ENGINEER: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  VIEWER: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
};

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser } = getAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchUsers();
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await api.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    } finally {
      setUserToDelete(null);
    }
  };

  const roleCount = (role: string) => users.filter((u) => u.role === role).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage user accounts, roles, and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
          <Card className="shadow-md card-hover">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold mt-1">{users.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          {(['ADMIN', 'ENGINEER', 'VIEWER'] as const).map((role) => (
            <Card key={role} className="shadow-md card-hover">
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{role.charAt(0) + role.slice(1).toLowerCase()}s</p>
                    <p className="text-3xl font-bold mt-1">{roleCount(role)}</p>
                  </div>
                  <div className={cn('p-3 rounded-xl', role === 'ADMIN' ? 'bg-red-100 dark:bg-red-900/30' : role === 'ENGINEER' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800')}>
                    <Shield className={cn('h-6 w-6', role === 'ADMIN' ? 'text-red-600 dark:text-red-400' : role === 'ENGINEER' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-xl">All Users</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonTable />
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-lg font-semibold mb-1">No users found</h3>
                <p className="text-muted-foreground">No users have been registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">
                        <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Role</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Joined</div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                              {u.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{u.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className={cn(
                              'px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105',
                              roleBadgeStyles[u.role]
                            )}
                          >
                            <option value="VIEWER">Viewer</option>
                            <option value="ENGINEER">Engineer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(u)}
                            className="gap-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description={`Are you sure you want to delete "${userToDelete?.email}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
