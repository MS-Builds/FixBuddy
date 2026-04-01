import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { CheckCircle2, Clock, DollarSign, Activity, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { BrandWordmark } from "../components/BrandWordmark";

export default function Dashboard() {
  const { captain, setCaptain } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, requestsRes] = await Promise.all([
          api.get("/captain/stats"),
          api.get("/captain/requests")
        ]);
        
        const statsData = statsRes.data.data;
        const requestsData = requestsRes.data.data || [];

        setStats({
          completedJobs: statsData.totalJobs,
          pendingRequests: statsData.activeJobs,
          earnings: statsData.totalEarnings || 0,
          recentJobs: requestsData.slice(0, 5).map(req => ({
            id: req.id,
            title: req.title || req.serviceType,
            status: req.status.toLowerCase(),
            date: new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            amount: 0, // Placeholder
            user: req.user
          }))
        });
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const toggleStatus = async () => {
    try {
      const res = await api.patch("/captain/toggle-active");
      const newStatus = res.data.data.isActive;
      setCaptain({ ...captain, isActive: newStatus });
      toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  const isOnline = captain?.isActive || false;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary via-primary to-slate-800 px-6 py-7 text-primary-foreground shadow-[0_24px_60px_rgba(15,23,42,0.22)] md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <BrandWordmark subtitle="Captain Dashboard" light className="mb-5" />
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Run your jobs with more clarity and less friction.</h1>
            <p className="mt-3 text-sm leading-6 text-white/72 md:text-base">
              Track requests, stay available for the right work, and keep your customer experience polished from first response to completion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-full bg-white/10 px-4 py-3 backdrop-blur">
            <span className="text-sm font-semibold">Status</span>
            <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-[#22c55e] text-white hover:bg-[#16a34a]" : "bg-white/15 text-white hover:bg-white/20"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={toggleStatus}
            >
              Go {isOnline ? "Offline" : "Online"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[1.75rem] border-border/70 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats?.earnings?.toFixed(2)}</div>
            <p className="text-xs flex items-center mt-1 text-green-500">
              <Activity className="mr-1 h-3 w-3" /> Real-time Earnings
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/70 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jobs Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.completedJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">Great job!</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/70 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pendingRequests}</div>
            <Link to="/requests" className="mt-1 inline-flex items-center text-xs text-primary hover:underline">
              View all requests <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="rounded-[1.75rem] border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Job History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentJobs?.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No jobs found yet.</p>
              ) : (
                stats?.recentJobs?.map((job) => (
                  <div key={job.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/30 p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarImage src={job.user?.profileImage} alt={job.user?.name} />
                        <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                          {job.user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="mt-0.5 flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" /> {job.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${job.amount.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs capitalize">{job.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/70 bg-gradient-to-br from-accent to-secondary shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-accent-foreground">
              <Sparkles className="h-4 w-4" />
              <CardTitle className="text-base">Today&apos;s Focus</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Availability</p>
              <p className="mt-2 text-sm font-semibold">{isOnline ? "You are visible for new requests right now." : "Turn online when you are ready to accept nearby work."}</p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Momentum</p>
              <p className="mt-2 text-sm font-semibold">{stats?.pendingRequests || 0} active jobs need attention and {stats?.completedJobs || 0} jobs are already completed.</p>
            </div>
            <Button asChild className="h-11 w-full rounded-full font-semibold">
              <Link to="/requests">Review Incoming Requests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
