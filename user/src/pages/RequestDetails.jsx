import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ArrowLeft, MapPin, Clock, Star, MessageSquare, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { toast } from "sonner";

export default function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewed, setReviewed] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await api.get(`/user/service-request/${id}`);
                setRequest(res.data.data);
            } catch (err) {
                toast.error("Failed to load request details");
                navigate("/requests");
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id, navigate]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!request?.captainId) return;

        setSubmittingReview(true);
        try {
            await api.post("/user/review", {
                captainId: request.captainId,
                rating,
                comment,
                serviceRequestId: id // Though backend might not use it yet, good for tracking
            });
            toast.success("Review submitted successfully!");
            setReviewed(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        );
    }

    if (!request) return null;

    const statusColors = {
        PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
        ACCEPTED: "bg-blue-500/10 text-blue-600 border-blue-200",
        ONGOING: "bg-orange-500/10 text-orange-600 border-orange-200",
        COMPLETED: "bg-green-500/10 text-green-600 border-green-200",
        CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Request Details</h1>
                    <p className="text-sm text-muted-foreground">ID: {request.id.substring(0, 8)}...</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 shadow-sm border-none bg-card/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between gap-4">
                            <CardTitle className="text-xl">{request.title}</CardTitle>
                            <div className="flex items-center gap-3">
                                {request.status === 'COMPLETED' && (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">
                                        Cost: ${request.amount?.toFixed(2)}
                                    </Badge>
                                )}
                                <Badge className={`rounded-full px-3 py-1 ${statusColors[request.status] || ""}`}>
                                    {request.status}
                                </Badge>
                            </div>
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(request.createdAt).toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</h4>
                            <p className="text-foreground leading-relaxed">{request.description}</p>
                        </div>

                        {request.images && request.images.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Attached Photos</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {request.images.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-xl border bg-muted overflow-hidden">
                                            <img src={img} alt={`Job detail ${i}`} className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                            <MapPin className="h-4 w-4" />
                            {request.location || "No location provided"}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {request.captain && (
                        <Card className="shadow-sm border-primary/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold">Assigned Professional</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-center">
                                <Avatar className="h-20 w-20 mx-auto border-4 border-background shadow-lg">
                                    <AvatarImage src={request.captain.profileImage} />
                                    <AvatarFallback className="text-2xl">{request.captain.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{request.captain.name}</h3>
                                    <p className="text-sm text-muted-foreground">{request.captain.skills?.join(", ") || "Professional"}</p>
                                </div>
                                <Button asChild className="w-full rounded-full" variant="outline">
                                    <a href={`/chat?captainId=${request.captain.id}`}>
                                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {!request.captain && request.status !== 'CANCELLED' && (
                        <Card className="shadow-sm bg-primary/5 border-none">
                            <CardContent className="py-8 text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary animate-pulse">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold">Matching...</h3>
                                <p className="text-xs text-muted-foreground px-4">
                                    We're notifying professionals in your area. You'll hear from them soon.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {request.status === 'COMPLETED' && !reviewed && (
                <Card className="shadow-lg border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <CheckCircle2 className="h-6 w-6" />
                            Job Completed!
                        </CardTitle>
                        <CardDescription>
                            Please take a moment to rate and review {request.captain?.name}'s service.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <Label>Rating</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comment">Your Feedback</Label>
                                <Textarea
                                    id="comment"
                                    placeholder="Tell others about your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="min-h-[100px] bg-background"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full rounded-full h-12 text-lg font-bold" disabled={submittingReview}>
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {reviewed && (
                <div className="bg-green-500/10 border border-green-200 rounded-xl p-6 text-center space-y-2">
                    <div className="h-12 w-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-green-700">Thank you for your feedback!</h3>
                    <p className="text-sm text-green-600/80">Your review helps our community maintain high service standards.</p>
                </div>
            )}
        </div>
    );
}
