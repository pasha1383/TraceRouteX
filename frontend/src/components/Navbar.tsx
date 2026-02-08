'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, clearAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Navbar() {
  const router = useRouter();
  const { user } = getAuth();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold">
              TraceRouteX
            </Link>
            {user && (
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/incidents" className="hover:text-blue-600">
                  Incidents
                </Link>
                <Link href="/services" className="hover:text-blue-600">
                  Services
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/audit-logs" className="hover:text-blue-600">
                    Audit Logs
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email} ({user.role})
                </span>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
