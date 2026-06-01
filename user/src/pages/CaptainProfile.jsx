import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { Separator } from "../components/ui/separator";
import { 
    Star, 
    MapPin, 
    Clock, 
    Briefcase, 
    DollarSign, 
    ArrowLeft, 
    CheckCircle2, 
    MessageSquare,
    Search,
    Image as ImageIcon
} from "lucide-react";
import api from "../services/api";
import { toast } from "sonner";

export default function CaptainProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [captain, setCaptain] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaptain = async () => {
            try {
                const res = await api.get(`/user/captain/${id}`);
                setCaptain(res.data.data);
            } catch (err) {
                toast.error("Failed to load professional profile");
                navigate("/find");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCaptain();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
                <Skeleton className="h-10 w-32 rounded-full" />
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 border-none shadow-none bg-transparent">
                        <Skeleton className="aspect-square w-full rounded-3xl" />
                    </Card>
                    <div className="md:col-span-2 space-y-4">
                        <Skeleton className="h-12 w-2/3" />
                        <Skeleton className="h-6 w-1/3" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                        <Skeleton className="h-32 w-full mt-6" />
                    </div>
                </div>
            </div>
        );
    }

    if (!captain) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="rounded-full gap-2 px-3" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Badge variant="outline" className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Professional ID: {captain.id.substring(0, 8)}
                </Badge>
            </div>

            {/* Profile Header */}
            <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Avatar Section */}
                <div className="md:col-span-1">
                    <div className="relative group">
                        <Avatar className="h-full w-full aspect-square rounded-3xl border-4 border-card shadow-2xl ring-1 ring-primary/5">
                            <AvatarImage src={captain.profileImage} alt={captain.name} className="object-cover" />
                            <AvatarFallback className="text-5xl font-black bg-primary/10 text-primary">
                                {captain.name[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {captain.isVerified && (
                            <div className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground p-2 rounded-2xl shadow-xl ring-4 ring-background">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 space-y-3">
                        <Button asChild className="w-full h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Link to={`/requests/new?captainId=${captain.id}`}>
                                Hire This Professional
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full h-12 rounded-2xl font-semibold border-2" onClick={() => navigate(`/chat?captainId=${captain.id}`)}>
                            <MessageSquare className="h-5 w-5 mr-2" /> Message
                        </Button>
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-4xl font-black tracking-tight">{captain.name}</h1>
                            {captain.isVerified && (
                                <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-200/50 rounded-full px-3 py-0.5 text-[10px] font-black tracking-widest uppercase">Verified Pro</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center text-amber-500">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="ml-1.5 font-black text-lg">{captain.avgRating?.toFixed(1) || "5.0"}</span>
                                <span className="ml-1 text-muted-foreground text-sm font-bold">({captain.reviewCount} reviews)</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="flex items-center text-primary font-black text-lg">
                                <DollarSign className="h-5 w-5 -mr-1" />
                                <span>{captain.hourlyRate || "25"}/hr</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {captain.skills?.map((skill) => (
                            <Badge key={skill} variant="secondary" className="rounded-lg px-3 py-1 text-xs font-bold bg-muted/50 border-none">
                                {skill}
                            </Badge>
                        ))}
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-sm font-semibold uppercase tracking-wider">About Professional</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            {captain.description || "No description provided."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 rounded-2xl bg-muted/30 border border-muted flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Response Time</p>
                                <p className="text-sm font-black text-foreground">Under 15 mins</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30 border border-muted flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Service Area</p>
                                <p className="text-sm font-black text-foreground">Within 15 miles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Portfolio Section */}
            {captain.workImages?.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Work Portfolio</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {captain.workImages.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border group relative cursor-zoom-in">
                                <img 
                                    src={img} 
                                    alt={`Work Portfolio ${idx + 1}`} 
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    onClick={() => window.open(img, '_blank')}
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Search className="text-white h-6 w-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Separator />

            {/* Reviews Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Customer Reviews</span>
                    </div>
                    {captain.reviewCount > 0 && (
                        <div className="text-sm font-bold text-muted-foreground">
                            Sorted by Newest
                        </div>
                    )}
                </div>

                {captain.reviews?.length === 0 ? (
                    <div className="py-12 text-center rounded-3xl bg-muted/20 border-2 border-dashed border-muted">
                        <p className="text-muted-foreground font-medium italic">No reviews yet. Be the first to hire {captain.name}!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {captain.reviews.map((review) => (
                            <Card key={review.id} className="border-none bg-muted/20 shadow-none rounded-3xl overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10 border-2 border-background">
                                            <AvatarImage src={review.user?.profileImage} alt={review.user?.name} />
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                {review.user?.name?.[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-black text-sm">{review.user?.name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted"}`} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
