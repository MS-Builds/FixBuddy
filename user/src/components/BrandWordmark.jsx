import { Link } from "react-router-dom";

export function BrandWordmark({ to = "/", subtitle, className = "", compact = false, light = false }) {
    return (
        <Link to={to} className={`inline-flex flex-col ${className}`}>
            <span className={`wordmark font-extrabold ${light ? "text-white" : "text-foreground"} ${compact ? "text-xl" : "text-2xl md:text-3xl"}`}>
                fix<span className={light ? "text-[#7CF058]" : "wordmark-accent"}>Buddy</span>
            </span>
            {subtitle ? (
                <span className={`mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${light ? "text-white/70" : "text-muted-foreground"}`}>
                    {subtitle}
                </span>
            ) : null}
        </Link>
    );
}
