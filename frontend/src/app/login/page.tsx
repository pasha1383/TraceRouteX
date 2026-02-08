'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      setAuth(token, user);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left - Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-40 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/15 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">TX</span>
            </div>
            <span className="text-2xl font-bold">TraceRouteX</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-bold leading-tight">
            Monitor, Manage,<br />Stay Informed.
          </h2>
          <p className="text-lg text-blue-100 max-w-md">
            Track your services, manage incidents in real-time, and keep your entire team aligned with a beautiful status dashboard.
          </p>
          <div className="flex gap-8 pt-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm text-blue-200">Uptime Tracking</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl font-bold">&lt;5min</div>
              <div className="text-sm text-blue-200">Incident Response</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-blue-200">Monitoring</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-sm text-blue-200 animate-fade-in">
          © {new Date().getFullYear()} TraceRouteX. All rights reserved.
        </div>
      </div>

      {/* Right - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 page-enter">
          {/* Mobile logo */}
          <div className="lg:hidden text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold">TX</span>
              </div>
              <span className="text-xl font-bold">TraceRouteX</span>
            </div>
          </div>

          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <Card className="border-0 shadow-xl shadow-gray-200/50 dark:shadow-none dark:border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 transition-shadow focus:shadow-lg focus:shadow-blue-500/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-11 transition-shadow focus:shadow-lg focus:shadow-blue-500/10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 text-base gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Create one <ArrowRight className="inline h-3 w-3" />
              </Link>
            </p>
            <Link href="/public/status" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              View public status page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
