import React, { useState } from 'react';
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { login } from '../services/api';
import { BrandWordmark } from './BrandWordmark';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginModern = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      const { token, admin } = response.data.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col overflow-hidden rounded-[36px] border border-border/70 bg-card shadow-[0_30px_120px_rgba(15,23,42,0.1)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-primary px-8 py-10 text-primary-foreground lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.25),_transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <BrandWordmark subtitle="Admin portal" compact light />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground/65">Operations, refined</p>
              <h1 className="mt-4 max-w-md text-5xl font-extrabold tracking-[-0.04em]">
                A calmer control center for FixBuddy.
              </h1>
              <p className="mt-6 max-w-md text-base leading-8 text-primary-foreground/78">
                The admin experience now follows the same modern visual system as the user product, with stronger hierarchy and cleaner entry screens.
              </p>
              <div className="mt-10 flex items-center gap-3 text-sm text-primary-foreground/82">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-foreground/10">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                Secure access for operations and support workflows
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-14">
          <div className="w-full max-w-md p-4">
            <div className="mb-8 lg:hidden">
              <BrandWordmark subtitle="Admin portal" compact />
            </div>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="space-y-8 px-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Administrator login</p>
                  <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.06em]">Sign in to manage FixBuddy.</h2>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    Access users, captains, requests, and system activity from one consistent admin workspace.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@fixbuddy.com"
                        className="h-14 rounded-2xl border-border/80 pl-11 text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="h-14 rounded-2xl border-border/80 pl-11 text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                      {error}
                    </div>
                  ) : null}

                  <Button type="submit" className="h-14 w-full rounded-full text-base font-semibold" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                    {loading ? 'Signing in...' : 'Continue to admin'}
                    {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                  </Button>
                </form>

                <p className="text-sm text-muted-foreground">
                  Protected FixBuddy workspace for operations and platform oversight.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModern;
