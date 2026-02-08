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
import { UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.register(email, password);
      const { token, user } = response.data;

      setAuth(token, user);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left - Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 right-20 w-48 h-48 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-32 left-20 w-56 h-56 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 left-1/2 w-36 h-36 rounded-full bg-white/15 blur-2xl animate-float" style={{ animationDelay: '0.8s' }} />
        </div>
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
            Join the team.<br />Start monitoring.
          </h2>
          <p className="text-lg text-purple-100 max-w-md">
            Create your account and gain instant access to powerful incident management and service monitoring tools.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { icon: '📊', title: 'Dashboard', desc: 'Real-time overview of all services' },
              { icon: '🚨', title: 'Incidents', desc: 'Track and resolve issues fast' },
              { icon: '📝', title: 'Timeline', desc: 'Chronological update tracking' },
              { icon: '🔒', title: 'Secure', desc: 'Role-based access control' },
            ].map((item, i) => (
              <div key={item.title} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm animate-fade-in-up hover:bg-white/15 transition-colors" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <div className="text-xl font-bold mb-1">{item.icon} {item.title}</div>
                <div className="text-sm text-purple-200">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-sm text-purple-200 animate-fade-in">
          © {new Date().getFullYear()} TraceRouteX. All rights reserved.
        </div>
      </div>

      {/* Right - Register form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 page-enter">
          <div className="lg:hidden text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold">TX</span>
              </div>
              <span className="text-xl font-bold">TraceRouteX</span>
            </div>
          </div>

          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">Get started with TraceRouteX in seconds</p>
          </div>

          <Card className="border-0 shadow-xl shadow-gray-200/50 dark:shadow-none dark:border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 transition-shadow focus:shadow-lg focus:shadow-purple-500/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-11 transition-shadow focus:shadow-lg focus:shadow-purple-500/10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
                </div>
                <Button type="submit" className="w-full h-11 text-base gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in <ArrowRight className="inline h-3 w-3" />
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
