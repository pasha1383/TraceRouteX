'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Server,
  Shield,
  ScrollText,
  Globe,
  Lock,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: AlertTriangle,
    title: 'Incident Management',
    description: 'Track and manage incidents with severity levels, status updates, and detailed timeline tracking.',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
  },
  {
    icon: Server,
    title: 'Service Monitoring',
    description: 'Monitor service health with real-time status indicators: Operational, Degraded, Down, or Maintenance.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Control access with three roles: Viewer, Engineer, and Admin with granular permissions.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: ScrollText,
    title: 'Audit Logs',
    description: 'Complete audit trail of all system changes for compliance and accountability.',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    icon: Globe,
    title: 'Public Status Page',
    description: 'Share status updates with stakeholders via a public, no-login-required status page.',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: Lock,
    title: 'Secure & Reliable',
    description: 'Built with JWT authentication, bcrypt password hashing, and role-based access control.',
    color: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-50 dark:bg-gray-900/50',
  },
];

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-sm">TX</span>
            </div>
            <span className="text-lg font-bold">TraceRouteX</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/public/status">
              <Button variant="ghost" size="sm">Status Page</Button>
            </Link>
            {isAuth ? (
              <Link href="/dashboard">
                <Button size="sm" className="gap-2">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-white dark:from-blue-950/20 dark:via-purple-950/10 dark:to-gray-950" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Real-time incident management platform
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Monitor. Manage.
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Stay Informed.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track your services, manage incidents in real-time, and keep your entire team aligned
              with a beautiful, intuitive status dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuth ? (
                <Button size="lg" onClick={() => router.push('/dashboard')} className="gap-2 h-12 px-8 text-base">
                  Go to Dashboard <ArrowRight className="h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => router.push('/register')} className="gap-2 h-12 px-8 text-base shadow-lg shadow-blue-500/25">
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => router.push('/login')} className="h-12 px-8 text-base">
                    Sign In
                  </Button>
                </>
              )}
              <Button size="lg" variant="secondary" onClick={() => router.push('/public/status')} className="gap-2 h-12 px-8 text-base">
                <Globe className="h-5 w-5" />
                Live Status
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Role-based access
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Real-time updates
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Audit logging
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-sm font-medium">
              <BarChart3 className="h-4 w-4" />
              Everything you need
            </div>
            <h2 className="text-4xl font-bold">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything your team needs to manage incidents and monitor services effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-5`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Set up your status page and start monitoring in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuth ? (
              <Button size="lg" onClick={() => router.push('/dashboard')} className="gap-2 h-12 px-8 text-base">
                Open Dashboard <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => router.push('/register')} className="gap-2 h-12 px-8 text-base shadow-lg shadow-blue-500/25">
                  Create Free Account <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/public/status')} className="gap-2 h-12 px-8 text-base">
                  <Globe className="h-5 w-5" />
                  View Live Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">TX</span>
              </div>
              <span className="text-sm font-semibold">TraceRouteX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Express, TypeORM & PostgreSQL
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/public/status" className="hover:text-foreground transition-colors">Status</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
