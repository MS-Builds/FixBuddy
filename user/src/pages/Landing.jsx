import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Wrench, Star, Shield, Clock, CheckCircle2, Users, Zap, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const services = [
    { icon: "🔧", name: "Plumber" },
    { icon: "⚡", name: "Electrical" },
    { icon: "🪚", name: "Carpentry" },
    { icon: "❄️", name: "AC Repair" },
    { icon: "🎨", name: "Painting" },
    { icon: "🏠", name: "Cleaning" },
];

export default function Landing() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground animate-in fade-in duration-700">

            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                            <Wrench className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FixBuddy</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</a>
                        <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
                        <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Button asChild className="rounded-full shadow-lg hover:shadow-xl transition-all font-semibold gap-2">
                                <Link to="/dashboard">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Log In</Link>
                                <Button asChild className="rounded-full shadow-lg hover:shadow-xl transition-all font-semibold">
                                    <Link to="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-primary/8 blur-[120px] rounded-full pointer-events-none -z-10" />
                <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none -z-10" />

                <div className="container mx-auto px-4 text-center z-10 relative">
                    <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-sm">
                        <Zap className="h-3.5 w-3.5" />
                        Trusted by 10,000+ homeowners
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl mx-auto leading-[1.1]">
                        Get any job done by{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                            verified pros.
                        </span>
                    </h1>
                    <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        FixBuddy connects you with skilled, background-checked professionals for all your home repair, maintenance, and improvement needs. Fast, reliable, and hassle-free.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                                {isAuthenticated ? "Go to Dashboard" : "Book a Professional"}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full hover:bg-secondary transition-colors duration-300 border-2">
                            <a href="#how-it-works">See How It Works</a>
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span>Background Checked Pros</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>4.9 / 5 Average Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>Avg. Response in 15 min</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Services */}
            <section id="services" className="py-24 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Popular Services</h2>
                        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Whatever you need fixed or built, we've got an expert for it.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                        {services.map((s) => (
                            <Link to="/signup" key={s.name}>
                                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all text-center cursor-pointer group">
                                    <span className="text-3xl block mb-3">{s.icon}</span>
                                    <span className="text-sm font-semibold group-hover:text-primary transition-colors">{s.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How FixBuddy Works</h2>
                        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Three simple steps to get your problem solved today.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { step: "1", icon: <Users className="h-6 w-6" />, title: "Describe Your Issue", desc: "Tell us what you need help with. Add photos and details so professionals know exactly what's needed." },
                            { step: "2", icon: <Search2 />, title: "Match with a Pro", desc: "We instantly connect you with top-rated, nearby professionals who specialize in your task." },
                            { step: "3", icon: <CheckCircle2 className="h-6 w-6" />, title: "Job Done & Reviewed", desc: "Your pro arrives, completes the work, and you pay only when you're satisfied. Then rate your experience." },
                        ].map((item) => (
                            <div key={item.step} className="relative bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all">
                                <div className="absolute -top-4 -left-4 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-extrabold text-lg shadow-lg">
                                    {item.step}
                                </div>
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 [background-image:radial-gradient(white_1px,transparent_0)] [background-size:24px_24px]" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to get started?</h2>
                    <p className="mt-4 text-primary-foreground/80 text-xl max-w-xl mx-auto">Join thousands of happy homeowners who trust FixBuddy for their home needs.</p>
                    <Button asChild size="lg" variant="secondary" className="mt-10 h-14 px-10 text-lg rounded-full font-bold shadow-xl hover:scale-105 transition-transform text-primary">
                        <Link to="/signup">Sign Up Free</Link>
                    </Button>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
                    <p className="mt-4 text-muted-foreground">Everything you need to know about FixBuddy.</p>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {[
                        { q: "How are professionals verified?", a: "All professionals on FixBuddy undergo a rigorous background and identity check before they are approved on the platform. We also verify their trade certifications and qualifications." },
                        { q: "How do I pay for a service?", a: "Payment is made securely through our platform only after the job is completed to your satisfaction. We support cards and digital wallets." },
                        { q: "What if I'm not happy with the service?", a: "We have a satisfaction guarantee. If you're not happy, contact our support team within 24 hours and we'll arrange a redo or a full refund." },
                        { q: "How quickly can I get a professional?", a: "For most services, you can book a professional within the hour. For specialized tasks, same-day or next-day booking is typically available." },
                    ].map((item, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all">
                            <AccordionTrigger className="text-left font-semibold text-base hover:no-underline py-5">{item.q}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-5">{item.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Footer */}
            <footer className="bg-secondary/50 py-12 border-t border-border/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                            <Wrench className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-bold">FixBuddy</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2026 FixBuddy Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function Search2() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
    );
}
