import React, { useState } from 'react';
import { login } from '../services/api';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await login(email, password);
            console.log("Response:", response)
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
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-2xl font-black">F</div>
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Fixxr Admin</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the portal
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@fixxr.com"
                                    className="pl-10 h-12 border-2 focus-visible:ring-black"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-12 border-2 focus-visible:ring-black"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required autoComplete="off"
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-xs font-bold p-3 rounded-none border-l-4 border-destructive">
                                {error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest bg-black hover:bg-zinc-800 text-white rounded-none" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Log In'}
                        </Button>
                        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                            © 2026 Fixxr Inc. Secure Portal
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Login;
