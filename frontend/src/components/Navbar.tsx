'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, clearAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  Server,
  Shield,
  ScrollText,
  LogOut,
  Menu,
  X,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { href: '/services', label: 'Services', icon: Server },
];

const adminLinks = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = getAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const allLinks = user?.role === 'ADMIN' ? [...navLinks, ...adminLinks] : navLinks;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                <span className="text-white font-bold text-sm">TX</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent hidden sm:block">
                TraceRouteX
              </span>
            </Link>

            {/* Desktop Nav */}
            {user && (
              <div className="hidden md:flex items-center gap-1">
                {allLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        isActive(link.href)
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{user.email.split('@')[0]}</span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                      user.role === 'ENGINEER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/public/status">
                  <Button variant="ghost" size="sm">Status</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {user && mobileOpen && (
          <div className="md:hidden pb-4 border-t pt-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {allLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive(link.href)
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="sm:hidden pt-2 border-t mt-2">
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                {user.email}
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase',
                  user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                  user.role === 'ENGINEER' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                )}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
