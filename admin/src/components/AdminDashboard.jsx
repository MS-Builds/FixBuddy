import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import {
    Trash2, Users, Briefcase, Activity, RefreshCw, LogOut,
    ShieldCheck, ShieldOff, Eye, Star, Phone, Mail, MapPin,
    DollarSign, Calendar, Clock, Search, ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";

// ─── Status Badge ──────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const map = {
        PENDING:   'bg-amber-100 text-amber-800 border-amber-200',
        ACCEPTED:  'bg-blue-100 text-blue-800 border-blue-200',
        ONGOING:   'bg-purple-100 text-purple-800 border-purple-200',
        COMPLETED: 'bg-green-100 text-green-800 border-green-200',
        CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
        <span className={`text-[9px] font-black uppercase px-2.5 py-1 border rounded-none tracking-widest ${map[status] || 'bg-zinc-100 text-zinc-600'}`}>
            {status}
        </span>
    );
};

// ─── Stat Card ──────────────────────────────────────────────────────

const StatCard = ({ title, value, sub, icon: Icon, accent }) => (
    <Card className="border-none shadow-sm rounded-none overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
            <div className={`h-8 w-8 flex items-center justify-center ${accent}`}><Icon size={16} /></div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
            <div className="text-5xl font-black tabular-nums">{value}</div>
            {sub && <p className="text-[10px] text-muted-foreground font-bold uppercase mt-2 tracking-tighter">{sub}</p>}
        </CardContent>
    </Card>
);

// ─── USER DETAIL DIALOG ─────────────────────────────────────────────

const UserDetail = ({ user, open, onClose, onDelete }) => {
    if (!user) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-none">
                <DialogHeader>
                    <DialogTitle className="font-black uppercase tracking-tight text-lg">User Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 rounded-none">
                            <AvatarFallback className="rounded-none bg-zinc-100 text-zinc-900 font-black text-2xl">
                                {user.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-black text-xl tracking-tight">{user.name}</div>
                            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">User Account</div>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center gap-3"><Phone size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">{user.phoneNumber}</span></div>
                        {user.email && <div className="flex items-center gap-3"><Mail size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">{user.email}</span></div>}
                        {user.location && <div className="flex items-center gap-3"><MapPin size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">{user.location}</span></div>}
                        <div className="flex items-center gap-3"><Calendar size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                        <div className="flex items-center gap-3"><Activity size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">{user._count?.serviceRequests ?? 0} total service requests</span></div>
                    </div>
                </div>
                <DialogFooter className="flex gap-2 border-t pt-4">
                    <Button variant="outline" className="rounded-none border-2 font-bold flex-1" onClick={onClose}>Close</Button>
                    <Button variant="destructive" className="rounded-none font-bold flex-1" onClick={() => { onDelete(user.id); onClose(); }}>
                        <Trash2 size={14} className="mr-2" /> Delete User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ─── CAPTAIN DETAIL DIALOG ─────────────────────────────────────────

const CaptainDetail = ({ captain, open, onClose, onVerify }) => {
    if (!captain) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-none">
                <DialogHeader>
                    <DialogTitle className="font-black uppercase tracking-tight text-lg">Captain Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 rounded-none">
                            <AvatarImage src={captain.profileImage} className="object-cover" />
                            <AvatarFallback className="rounded-none bg-zinc-900 text-white font-black text-3xl">
                                {captain.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="font-black text-xl tracking-tight">{captain.name}</div>
                            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Service Professional</div>
                            <Badge className={`rounded-none font-black text-[9px] uppercase tracking-widest ${captain.isVerified ? 'bg-green-600' : 'bg-amber-500'}`}>
                                {captain.isVerified ? 'VERIFIED' : 'PENDING VERIFICATION'}
                            </Badge>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-3 col-span-2"><Phone size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">{captain.phoneNumber}</span></div>
                        {captain.email && <div className="flex items-center gap-3 col-span-2"><Mail size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">{captain.email}</span></div>}
                        {captain.hourlyRate && <div className="flex items-center gap-3"><DollarSign size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">${captain.hourlyRate}/hr</span></div>}
                        <div className="flex items-center gap-3"><Activity size={14} className="text-muted-foreground shrink-0" /><span className="font-medium">{captain._count?.reviews ?? 0} reviews</span></div>
                        <div className="flex items-center gap-3"><Calendar size={14} className="text-muted-foreground shrink-0" /><span className="font-medium col-span-2">Joined {new Date(captain.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                        <div className="flex items-center gap-3"><Briefcase size={14} className="text-muted-foreground shrink-0" /><span>{captain._count?.serviceRequests ?? 0} jobs handled</span></div>
                    </div>
                    {captain.description && (
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Bio</div>
                            <p className="text-sm leading-relaxed text-zinc-600">{captain.description}</p>
                        </div>
                    )}
                    {(captain.skills?.length > 0) && (
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Skills</div>
                            <div className="flex flex-wrap gap-1.5">
                                {captain.skills.map((s, i) => (
                                    <span key={i} className="text-[10px] font-black uppercase px-2.5 py-1 border-2 border-zinc-200 bg-zinc-50">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {captain.workImages?.length > 0 && (
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Portfolio</div>
                            <div className="grid grid-cols-3 gap-2">
                                {captain.workImages.slice(0, 6).map((img, i) => (
                                    <img key={i} src={img} alt="" className="aspect-square object-cover rounded-none" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter className="border-t pt-4 flex gap-2">
                    <Button variant="outline" className="rounded-none border-2 font-bold flex-1" onClick={onClose}>Close</Button>
                    <Button
                        className={`rounded-none font-bold flex-1 ${captain.isVerified ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        onClick={() => { onVerify(captain.id, captain.isVerified); onClose(); }}
                    >
                        {captain.isVerified ? <><ShieldOff size={14} className="mr-2" /> Revoke</> : <><ShieldCheck size={14} className="mr-2" /> Verify Captain</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────

const AdminDashboard = ({ onLogout }) => {
    const [users, setUsers] = useState([]);
    const [captains, setCaptains] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCaptain, setSelectedCaptain] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    const [captainSearch, setCaptainSearch] = useState('');
    const [requestFilter, setRequestFilter] = useState('ALL');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [uRes, cRes, rRes] = await Promise.all([
                api.getUsers(),
                api.getCaptains(),
                api.getServiceRequests()
            ]);
            setUsers(uRes.data.data || []);
            setCaptains(cRes.data.data || []);
            setRequests(rRes.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to load platform data. Check that the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await api.deleteUser(id);
            setUsers(u => u.filter(x => x.id !== id));
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleVerifyCaptain = async (id, currentStatus) => {
        try {
            const next = !currentStatus;
            await api.verifyCaptain(id, next);
            setCaptains(c => c.map(x => x.id === id ? { ...x, isVerified: next } : x));
        } catch (err) {
            alert('Update failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.phoneNumber.includes(userSearch) ||
        (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredCaptains = captains.filter(c =>
        c.name.toLowerCase().includes(captainSearch.toLowerCase()) ||
        c.phoneNumber.includes(captainSearch) ||
        (c.email || '').toLowerCase().includes(captainSearch.toLowerCase())
    );

    const filteredRequests = requestFilter === 'ALL' ? requests : requests.filter(r => r.status === requestFilter);

    const verifiedCount = captains.filter(c => c.isVerified).length;
    const completedJobs = requests.filter(r => r.status === 'COMPLETED').length;
    const pendingJobs = requests.filter(r => r.status === 'PENDING').length;

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Loading Platform Data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex h-screen items-center justify-center p-6 bg-white">
            <Card className="max-w-md border-2 border-destructive rounded-none w-full">
                <CardHeader>
                    <CardTitle className="text-destructive font-black uppercase text-sm">Connection Error</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-zinc-600 font-medium text-sm">{error}</p>
                    <Button onClick={fetchData} className="w-full rounded-none font-bold">Retry Connection</Button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-white shadow-sm">
                <div className="mx-auto max-w-[1400px] flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-black text-white flex items-center justify-center font-black text-lg">F</div>
                        <div>
                            <h1 className="text-base font-black uppercase tracking-tighter leading-none">Fixxr Admin</h1>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Platform Control</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <Button variant="outline" size="sm" className="font-bold border-2 rounded-none px-4 hidden md:flex" onClick={fetchData}>
                            <RefreshCw size={13} className="mr-2" /> Sync Data
                        </Button>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-none p-0 overflow-hidden outline-none hover:bg-zinc-100">
                                    <Avatar className="h-10 w-10 rounded-none border-2 border-black/10 transition-all hover:scale-105">
                                        <AvatarFallback className="bg-black text-white font-black">
                                            AD
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-none border-2 shadow-xl" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal p-4">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-black uppercase tracking-tight leading-none">Administrator</p>
                                        <p className="text-[10px] font-bold leading-none text-muted-foreground uppercase tracking-widest mt-1">
                                            Platform Control
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="h-0.5 bg-zinc-100" />
                                <DropdownMenuItem className="p-3 cursor-pointer flex items-center font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 focus:bg-zinc-50">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Manage Staff</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-3 cursor-pointer flex items-center font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 focus:bg-zinc-50">
                                    <Activity className="mr-2 h-4 w-4" />
                                    <span>Audit Logs</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="h-0.5 bg-zinc-100" />
                                <DropdownMenuItem
                                    className="p-3 text-destructive focus:text-destructive cursor-pointer flex items-center font-black text-xs uppercase tracking-widest hover:bg-destructive/5 focus:bg-destructive/5"
                                    onClick={onLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-white border-2 border-zinc-200 rounded-none h-11 p-1 gap-0.5">
                        {[
                            { id: 'overview',  label: 'Overview' },
                            { id: 'users',     label: `Users (${users.length})` },
                            { id: 'captains',  label: `Captains (${captains.length})` },
                            { id: 'requests',  label: `Requests (${requests.length})` },
                        ].map(tab => (
                            <TabsTrigger key={tab.id} value={tab.id}
                                className="rounded-none font-black uppercase text-[10px] tracking-widest px-5 data-[state=active]:bg-black data-[state=active]:text-white h-9"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* ── OVERVIEW ── */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <StatCard title="Total Users" value={users.length} sub="Registered accounts" icon={Users} accent="bg-blue-50 text-blue-600" />
                            <StatCard title="Total Captains" value={captains.length} sub={`${verifiedCount} verified professionals`} icon={Briefcase} accent="bg-zinc-900 text-white" />
                            <StatCard title="Completed Jobs" value={completedJobs} sub="Successfully delivered" icon={ShieldCheck} accent="bg-green-50 text-green-600" />
                            <StatCard title="Pending Jobs" value={pendingJobs} sub="Awaiting assignment" icon={Clock} accent="bg-amber-50 text-amber-600" />
                        </div>

                        {/* Quick snapshots */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-sm rounded-none">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Users</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest rounded-none h-7 px-3" onClick={() => setActiveTab('users')}>
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y">
                                        {users.slice(0, 5).map(u => (
                                            <div key={u.id} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-zinc-50 -mx-2 px-2 transition-colors" onClick={() => setSelectedUser(u)}>
                                                <Avatar className="h-8 w-8 rounded-none">
                                                    <AvatarFallback className="rounded-none bg-zinc-100 text-zinc-700 font-black text-xs">{u.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm truncate">{u.name}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{u.phoneNumber}</div>
                                                </div>
                                                <div className="text-[10px] font-bold text-zinc-400">{u._count?.serviceRequests || 0} req</div>
                                            </div>
                                        ))}
                                        {users.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No users yet</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm rounded-none">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Captains</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest rounded-none h-7 px-3" onClick={() => setActiveTab('captains')}>
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y">
                                        {captains.slice(0, 5).map(c => (
                                            <div key={c.id} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-zinc-50 -mx-2 px-2 transition-colors" onClick={() => setSelectedCaptain(c)}>
                                                <Avatar className="h-8 w-8 rounded-none">
                                                    <AvatarFallback className="rounded-none bg-zinc-900 text-white font-black text-xs">{c.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm truncate">{c.name}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{(c.skills || []).slice(0, 2).join(', ')}</div>
                                                </div>
                                                <Badge className={`rounded-none font-black text-[8px] ${c.isVerified ? 'bg-green-600' : 'bg-amber-500'}`}>
                                                    {c.isVerified ? 'VER' : 'PND'}
                                                </Badge>
                                            </div>
                                        ))}
                                        {captains.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No captains yet</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Requests status breakdown */}
                        <Card className="border-none shadow-sm rounded-none">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Request Status Breakdown</CardTitle>
                                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest rounded-none h-7 px-3" onClick={() => setActiveTab('requests')}>
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-4">
                                    {['PENDING','ACCEPTED','ONGOING','COMPLETED','CANCELLED'].map(s => {
                                        const count = requests.filter(r => r.status === s).length;
                                        const pct = requests.length ? Math.round(count / requests.length * 100) : 0;
                                        return (
                                            <div key={s} className="text-center space-y-2">
                                                <div className="text-2xl font-black">{count}</div>
                                                <StatusBadge status={s} />
                                                <div className="text-[9px] text-muted-foreground font-bold">{pct}%</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── USERS ── */}
                    <TabsContent value="users" className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
                                <Input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-9 rounded-none border-2 h-10 font-medium" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-auto">
                                {filteredUsers.length} of {users.length} users
                            </div>
                        </div>

                        <div className="bg-white shadow-sm border rounded-none overflow-hidden">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest py-5 pl-6 w-[260px]">User</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Contact</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Location</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Requests</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Joined</TableHead>
                                        <TableHead className="text-right font-black text-black uppercase text-[10px] tracking-widest pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-xs uppercase font-bold">No users found</TableCell></TableRow>
                                    ) : filteredUsers.map(user => (
                                        <TableRow key={user.id} className="hover:bg-zinc-50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 rounded-none">
                                                        <AvatarFallback className="rounded-none bg-zinc-100 text-zinc-700 font-black text-sm">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-black uppercase tracking-tight">{user.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-bold">ID: {user.id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{user.phoneNumber}</div>
                                                {user.email && <div className="text-[10px] text-zinc-400 font-bold">{user.email}</div>}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-zinc-600">{user.location || <span className="text-zinc-300 italic">—</span>}</TableCell>
                                            <TableCell>
                                                <span className="font-black text-sm">{user._count?.serviceRequests || 0}</span>
                                                <span className="text-[10px] text-muted-foreground font-bold ml-1">REQS</span>
                                            </TableCell>
                                            <TableCell className="text-xs font-bold text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-zinc-100" onClick={() => setSelectedUser(user)}>
                                                        <Eye size={15} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(user.id)}>
                                                        <Trash2 size={15} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* ── CAPTAINS ── */}
                    <TabsContent value="captains" className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
                                <Input placeholder="Search captains..." value={captainSearch} onChange={e => setCaptainSearch(e.target.value)} className="pl-9 rounded-none border-2 h-10 font-medium" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-auto">
                                {filteredCaptains.length} of {captains.length} captains
                            </div>
                        </div>

                        <div className="bg-white shadow-sm border rounded-none overflow-hidden">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest py-5 pl-6 w-[260px]">Captain</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Skills</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Rate</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Stats</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                        <TableHead className="text-right font-black text-black uppercase text-[10px] tracking-widest pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCaptains.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-xs uppercase font-bold">No captains found</TableCell></TableRow>
                                    ) : filteredCaptains.map(captain => (
                                        <TableRow key={captain.id} className="hover:bg-zinc-50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 rounded-none">
                                                        <AvatarImage src={captain.profileImage} className="object-cover" />
                                                        <AvatarFallback className="rounded-none bg-zinc-900 text-white font-black text-sm">{captain.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-black uppercase tracking-tight">{captain.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-bold">{captain.phoneNumber}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                    {(captain.skills || []).slice(0, 3).map((s, i) => (
                                                        <span key={i} className="text-[9px] font-black uppercase px-1.5 py-0.5 border bg-zinc-50">{s}</span>
                                                    ))}
                                                    {(captain.skills || []).length > 3 && (
                                                        <span className="text-[9px] font-black text-zinc-400">+{captain.skills.length - 3}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-black text-sm">
                                                {captain.hourlyRate ? `$${captain.hourlyRate}/hr` : <span className="text-zinc-300 italic font-normal text-xs">—</span>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-bold"><span className="text-zinc-900 font-black">{captain._count?.serviceRequests || 0}</span> jobs</div>
                                                    <div className="text-[10px] font-bold"><span className="text-zinc-900 font-black">{captain._count?.reviews || 0}</span> reviews</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`rounded-none font-black text-[9px] uppercase tracking-widest ${captain.isVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'}`}>
                                                    {captain.isVerified ? '✓ VERIFIED' : 'PENDING'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-zinc-100" onClick={() => setSelectedCaptain(captain)}>
                                                        <Eye size={15} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className={`font-black uppercase text-[9px] tracking-widest h-8 px-3 rounded-none border-2 ${captain.isVerified ? 'border-amber-400 text-amber-600 hover:bg-amber-50' : 'border-green-500 text-green-700 hover:bg-green-50'}`}
                                                        onClick={() => handleVerifyCaptain(captain.id, captain.isVerified)}
                                                    >
                                                        {captain.isVerified ? <><ShieldOff size={12} className="mr-1" />Revoke</> : <><ShieldCheck size={12} className="mr-1" />Verify</>}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* ── SERVICE REQUESTS ── */}
                    <TabsContent value="requests" className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <Select value={requestFilter} onValueChange={setRequestFilter}>
                                <SelectTrigger className="w-40 rounded-none border-2 h-10 font-bold text-[11px] uppercase tracking-widest">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {['ALL','PENDING','ACCEPTED','ONGOING','COMPLETED','CANCELLED'].map(s => (
                                        <SelectItem key={s} value={s} className="font-bold uppercase text-[10px] tracking-widest rounded-none">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-auto">
                                {filteredRequests.length} requests shown
                            </div>
                        </div>

                        <div className="bg-white shadow-sm border rounded-none overflow-hidden">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest py-5 pl-6">Request</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Client</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Captain</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest">Location</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                        <TableHead className="font-black text-black uppercase text-[10px] tracking-widest text-right pr-6">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-xs uppercase font-bold">No requests found</TableCell></TableRow>
                                    ) : filteredRequests.map(req => (
                                        <TableRow key={req.id} className="hover:bg-zinc-50 transition-colors">
                                            <TableCell className="pl-6 py-4 max-w-[280px]">
                                                <div className="font-bold text-sm truncate text-ellipsis">{req.description}</div>
                                                <div className="text-[10px] text-zinc-400 font-bold mt-0.5">ID: {req.id.slice(0,8)}...</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-sm">{req.user?.name || '—'}</div>
                                                <div className="text-[10px] text-zinc-400 font-bold">{req.user?.phoneNumber || ''}</div>
                                            </TableCell>
                                            <TableCell>
                                                {req.captain ? (
                                                    <>
                                                        <div className="font-bold text-sm">{req.captain.name}</div>
                                                        <div className="text-[10px] text-zinc-400 font-bold">{req.captain.phoneNumber}</div>
                                                    </>
                                                ) : <span className="text-zinc-300 italic text-xs">Unassigned</span>}
                                            </TableCell>
                                            <TableCell className="text-sm text-zinc-600 font-medium">{req.location || <span className="text-zinc-300 italic">—</span>}</TableCell>
                                            <TableCell className="text-center"><StatusBadge status={req.status} /></TableCell>
                                            <TableCell className="text-right pr-6 text-xs font-bold text-zinc-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                                <div className="text-[10px] text-zinc-400">{new Date(req.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Dialogs */}
            <UserDetail user={selectedUser} open={!!selectedUser} onClose={() => setSelectedUser(null)} onDelete={handleDeleteUser} />
            <CaptainDetail captain={selectedCaptain} open={!!selectedCaptain} onClose={() => setSelectedCaptain(null)} onVerify={handleVerifyCaptain} />
        </div>
    );
};

export default AdminDashboard;
