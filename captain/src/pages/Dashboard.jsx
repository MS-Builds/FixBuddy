import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { CheckCircle2, Clock, DollarSign, Activity, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening today.</p>
        </div>

        <div className="flex items-center gap-3 bg-card px-4 py-2 border rounded-full shadow-sm">
          <span className="text-sm font-semibold">Status:</span>
          <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-green-500 hover:bg-green-600" : ""}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className={`rounded-full transition-colors ${isOnline ? 'text-destructive border-destructive hover:bg-destructive/10' : 'text-green-500 border-green-500 hover:bg-green-500/10'}`}
            onClick={toggleStatus}
          >
            Go {isOnline ? 'Offline' : 'Online'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
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

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jobs Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.completedJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">Great job!</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pendingRequests}</div>
            <Link to="/requests" className="text-xs text-primary hover:underline mt-1 inline-block">
              View all requests &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Job History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentJobs?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No jobs found yet.</p>
            ) : (
              stats?.recentJobs?.map((job) => (
                <div key={job.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src={job.user?.profileImage} alt={job.user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {job.user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground flex items-center mt-0.5">
                        <MapPin className="h-3 w-3 mr-1" /> {job.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${job.amount.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs capitalize">{job.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
