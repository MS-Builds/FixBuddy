import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, LayoutDashboard, MapPin, Search, ShieldCheck, Sparkles, Star, Wallet } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { BrandWordmark } from "../components/BrandWordmark";
import { AuthContext } from "../context/AuthContext";

const services = ["Plumbing", "Electrical", "AC Repair", "Cleaning", "Painting", "Carpentry"];

const steps = [
    {
        title: "Tell us what needs fixing",
        description: "Share the issue, location, and photos in under a minute so the right professional can respond quickly.",
        icon: Search,
    },
    {
        title: "Match with verified pros",
        description: "Choose from relevant nearby professionals instead of guessing through cluttered listings.",
        icon: ShieldCheck,
    },
    {
        title: "Track the job clearly",
        description: "Follow status, messages, and progress from accepted to completed in one consistent flow.",
        icon: CheckCircle2,
    },
];

const faqs = [
    {
        q: "How are professionals verified?",
        a: "FixBuddy reviews professional profiles before they appear in the marketplace so users can book with more confidence.",
    },
    {
        q: "Can I request urgent help?",
        a: "Yes. The platform is designed for quick service requests and faster responses for common home issues.",
    },
    {
        q: "Will I get updates after I book?",
        a: "Yes. You can see request status changes and continue the conversation directly in the app.",
    },
    {
        q: "Can I cancel if no one has started yet?",
        a: "Yes. Pending requests can be changed or canceled so users can submit a clearer request if needed.",
    },
];

export default function LandingModern() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <BrandWordmark subtitle="Home services, simplified" compact />
                    <nav className="hidden items-center gap-8 md:flex">
                        <a href="#services" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">Services</a>
                        <a href="#experience" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">Experience</a>
                        <a href="#faq" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Button asChild className="h-11 rounded-full px-5 font-semibold">
                                <Link to="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Link to="/login" className="hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
                                    Log in
                                </Link>
                                <Button asChild className="h-11 rounded-full px-5 font-semibold">
                                    <Link to="/signup">Get started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <section className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_55%)]" />
                <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
                <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-28 lg:pt-24">
                    <div className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-foreground/10 bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-accent-foreground">
                            <Sparkles className="h-3.5 w-3.5" />
                            Faster, calmer booking
                        </div>
                        <h1 className="max-w-4xl text-5xl font-extrabold tracking-[-0.08em] sm:text-6xl lg:text-7xl">
                            Home help that feels immediate, clear, and reliable.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                            FixBuddy connects users with verified professionals through a cleaner request flow, better updates, and a more modern service experience.
                        </p>
                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg" className="h-14 rounded-full px-7 text-base font-semibold shadow-[0_20px_45px_rgba(15,23,42,0.16)]">
                                <Link to={isAuthenticated ? "/requests/new" : "/signup"}>
                                    Book a professional
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-7 text-base font-semibold">
                                <a href="#experience">See how it works</a>
                            </Button>
                        </div>
                        <div className="mt-12 grid gap-4 sm:grid-cols-3">
                            <StatCard icon={ShieldCheck} value="100%" label="Verified profiles before booking" />
                            <StatCard icon={Clock3} value="15 min" label="Average response for common jobs" />
                            <StatCard icon={Star} value="4.9/5" label="Average customer satisfaction" />
                        </div>
                    </div>

                    <div className="lg:pt-8">
                        <div className="surface-glass rounded-[32px] border border-border/70 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Live booking preview</p>
                                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight">One request, less friction</h2>
                                </div>
                                <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">Online now</div>
                            </div>
                            <div className="mt-6 space-y-4">
                                <PreviewCard title="Leak under kitchen sink" subtitle="Need a plumber this evening" badge="Urgent" />
                                <div className="rounded-[24px] border border-border bg-background/70 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground font-bold text-background">RK</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">Ravi Kumar</p>
                                            <p className="text-sm text-muted-foreground">Plumbing - 4.9 rating - 1.2 km away</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <MiniFeature icon={MapPin} title="Near you" description="Nearby pros are prioritized first." />
                                    <MiniFeature icon={Wallet} title="Transparent" description="Clear progress through the full job lifecycle." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="services" className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Popular categories</p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">The services people book most</h2>
                        </div>
                        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                            Clean, direct categories make it easier for users to submit the right request the first time.
                        </p>
                    </div>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {services.map((service) => (
                            <Link
                                key={service}
                                to={isAuthenticated ? "/requests/new" : "/signup"}
                                className="surface-glass group rounded-[28px] border border-border/70 p-5 shadow-[0_16px_60px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Service</div>
                                <div className="mt-8 flex items-end justify-between">
                                    <h3 className="text-lg font-extrabold tracking-tight">{service}</h3>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section id="experience" className="border-y border-border/60 bg-secondary/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Designed for clarity</p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A more confident experience from need to completion.</h2>
                            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                                The updated experience reduces visual noise and gives users a clear path through request creation, matching, and progress tracking.
                            </p>
                        </div>
                        <div className="grid items-stretch gap-4 md:grid-cols-3">
                            {steps.map((step, index) => (
                                <div key={step.title} className="surface-glass flex h-full flex-col rounded-[28px] border border-border/70 p-6 shadow-[0_16px_60px_rgba(15,23,42,0.06)]">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <div className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Step {index + 1}</div>
                                    <h3 className="mt-2 text-xl font-extrabold tracking-tight">{step.title}</h3>
                                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" className="py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">FAQ</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A few quick answers before you book</h2>
                    </div>
                    <Accordion type="single" collapsible className="mt-10 space-y-4">
                        {faqs.map((item, index) => (
                            <AccordionItem key={index} value={`faq-${index}`} className="surface-glass rounded-[24px] border border-border/70 px-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                                <AccordionTrigger className="py-6 text-left text-base font-semibold hover:no-underline">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            <section className="px-4 pb-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl rounded-[36px] bg-primary px-6 py-12 text-primary-foreground shadow-[0_30px_120px_rgba(15,23,42,0.22)] sm:px-10 lg:flex lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/70">Ready when you are</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Get help at home with a faster, cleaner booking experience.</h2>
                    </div>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
                        <Button asChild size="lg" variant="secondary" className="h-14 rounded-full px-7 text-base font-semibold text-primary">
                            <Link to={isAuthenticated ? "/requests/new" : "/signup"}>Start a request</Link>
                        </Button>
                        {!isAuthenticated ? (
                            <Button asChild size="lg" className="h-14 rounded-full border border-primary-foreground/20 bg-transparent px-7 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10">
                                <Link to="/login">Log in</Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </section>

            <footer className="border-t border-border/60 py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <BrandWordmark subtitle="Built for modern home service" compact />
                    <p className="text-sm text-muted-foreground">(c) 2026 FixBuddy. Clearer booking for everyday home help.</p>
                </div>
            </footer>
        </div>
    );
}

function StatCard({ icon: Icon, value, label }) {
    return (
        <div className="surface-glass rounded-[28px] border border-border/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <Icon className="h-5 w-5 text-accent-foreground" />
            <div className="mt-4 text-2xl font-extrabold tracking-tight">{value}</div>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

function PreviewCard({ title, subtitle, badge }) {
    return (
        <div className="rounded-[24px] border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <div className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">{badge}</div>
            </div>
        </div>
    );
}

function MiniFeature({ icon: Icon, title, description }) {
    return (
        <div className="rounded-[24px] border border-border bg-background/70 p-4">
            <Icon className="h-4 w-4 text-accent-foreground" />
            <p className="mt-3 text-sm font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
