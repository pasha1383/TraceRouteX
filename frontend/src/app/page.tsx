'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900">
            TraceRouteX
          </h1>
          <p className="text-2xl text-gray-600">
            Incident & Service Status Management System
          </p>
          <p className="text-lg text-gray-500">
            Monitor your services, manage incidents, and keep your team informed with real-time status updates.
          </p>
          
          <div className="flex gap-4 justify-center pt-6">
            {isAuth ? (
              <Button size="lg" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/register')}>
                  Register
                </Button>
              </>
            )}
            <Button size="lg" variant="secondary" onClick={() => router.push('/public/status')}>
              Public Status
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚨</span>
                Incident Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track and manage incidents with severity levels, status updates, and timeline tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Service Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor service health with real-time status indicators: Operational, Degraded, Down, or Maintenance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Role-Based Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Control access with three roles: Viewer, Engineer, and Admin with granular permissions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete audit trail of all system changes for compliance and accountability.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                Public Status Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share status updates with stakeholders via a public, no-login-required status page.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                Secure & Reliable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with JWT authentication, bcrypt password hashing, and role-based access control.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>TraceRouteX - Built with Next.js, Express, TypeORM & PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
