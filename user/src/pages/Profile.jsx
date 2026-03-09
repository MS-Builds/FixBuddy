import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { User, Phone, Mail, MapPin, LogOut, Edit, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";

export default function Profile() {
    const { user, setUser, logout } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        location: user?.location || "",
        profileImage: user?.profileImage || "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            const res = await api.put("/user/profile", form);
            setUser((prev) => ({ ...prev, ...res.data.data }));
            setEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your personal information and account.</p>
            </div>

            {/* Avatar Card */}
            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20 text-2xl border-2 border-primary/10 shadow-sm">
                            <AvatarImage src={user?.profileImage} alt={user?.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                            <p className="text-muted-foreground text-sm mt-0.5">{user?.phoneNumber || "No phone number"}</p>
                            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Client Account
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Personal Information</CardTitle>
                        <CardDescription>Your contact and location details.</CardDescription>
                    </div>
                    <Button
                        variant={editing ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={editing ? handleSave : () => setEditing(true)}
                    >
                        {editing ? (
                            <><Save className="h-4 w-4 mr-1.5" />Save</>
                        ) : (
                            <><Edit className="h-4 w-4 mr-1.5" />Edit</>
                        )}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                                <User className="h-3.5 w-3.5" /> Full Name
                            </Label>
                            {editing ? (
                                <Input id="name" name="name" value={form.name} onChange={handleChange} className="h-10" />
                            ) : (
                                <p className="font-medium">{user?.name || "—"}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                                <Phone className="h-3.5 w-3.5" /> Phone Number
                            </Label>
                            {editing ? (
                                <Input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="h-10" disabled />
                            ) : (
                                <p className="font-medium">{user?.phoneNumber || "—"}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                                <Mail className="h-3.5 w-3.5" /> Email Address
                            </Label>
                            {editing ? (
                                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="h-10" />
                            ) : (
                                <p className="font-medium">{user?.email || "—"}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                                <MapPin className="h-3.5 w-3.5" /> Location
                            </Label>
                            {editing ? (
                                <Input id="location" name="location" value={form.location} onChange={handleChange} className="h-10" />
                            ) : (
                                <p className="font-medium">{user?.location || "—"}</p>
                            )}
                        </div>

                        {editing && (
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="profileImage" className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                                    <User className="h-3.5 w-3.5" /> Profile Image URL
                                </Label>
                                <Input 
                                    id="profileImage" 
                                    name="profileImage" 
                                    value={form.profileImage} 
                                    onChange={handleChange} 
                                    placeholder="https://example.com/image.jpg"
                                    className="h-10" 
                                />
                            </div>
                        )}
                    </div>

                    {editing && (
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setEditing(false)}>
                            Cancel
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="shadow-sm border-destructive/20">
                <CardHeader>
                    <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Sign Out</p>
                            <p className="text-sm text-muted-foreground">You will be logged out of your account.</p>
                        </div>
                        <Button variant="destructive" size="sm" className="rounded-full" onClick={logout}>
                            <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
