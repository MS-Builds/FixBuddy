import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { Star, StarHalf, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function Reviews() {
  const { captain } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/captain/reviews");
        if (res.data && res.data.success) {
          setReviews(res.data.data || []);
          setAvgRating(res.data.avgRating || 0);
        } else {
          throw new Error(res.data?.message || "Invalid response format");
        }
      } catch (error) {
        console.error("Reviews Fetch Error:", error);
        toast.error("Failed to load reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      else if (i === fullStars && hasHalf) stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      else stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground/30" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Reviews</h1>
          <p className="text-muted-foreground mt-1">See what users are saying about your work.</p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-3 border rounded-xl shadow-sm">
          <div className="text-3xl font-bold">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</div>
          <div>
            <div className="flex">{renderStars(avgRating)}</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
          <p className="font-semibold">No reviews yet</p>
          <p className="text-sm mt-1">Complete jobs to start receiving feedback from customers.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarImage src={review.user?.profileImage} alt={review.user?.name} />
                  <AvatarFallback>{review.user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold leading-none">{review.user?.name || "Anonymous"}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed italic">"{review.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
