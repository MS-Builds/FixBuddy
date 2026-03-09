import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Briefcase, CheckCircle2, ShieldCheck, Wrench, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

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
            <span className="text-xl font-bold tracking-tight">Fixxr Captain</span>
          </div>
          <div className="flex items-center gap-4">
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
                  <Link to="/signup">Become a Captain</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 text-center z-10 relative">
          <Badge className="mb-6 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default border-none shadow-sm backdrop-blur-sm">
            🚀 The Future of Professional Services
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl mx-auto leading-[1.1]">
            Turn your skills into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">a thriving business.</span>
          </h1>
          <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join Fixxr's elite network of professional craftsmen, plumbers, electricians, and more. Work on your own terms, earn premium rates, and get jobs delivered straight to your phone.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                {isAuthenticated ? "Go to Dashboard" : "Apply Now"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full hover:bg-secondary transition-colors duration-300 border-2">
              <a href="#how-it-works">Learn How It Works</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features / Why Fixxr */}
      <section id="how-it-works" className="py-24 bg-secondary/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why partner with Fixxr?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">We handle the marketing, booking, and payments so you can focus on what you do best.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Be Your Own Boss</h3>
              <p className="text-muted-foreground leading-relaxed">Toggle your availability instantly. Work when you want, where you want, and only accept the jobs that fit your schedule.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Guaranteed Payments</h3>
              <p className="text-muted-foreground leading-relaxed">No more chasing invoices. Fixxr ensures secure, immediate transactions directly to your bank account after every completed job.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Clientele</h3>
              <p className="text-muted-foreground leading-relaxed">We connect you with high-intent customers who value quality craftsmanship and are willing to pay for professional-grade services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fixxr Tools Kits Promo */}
      <section className="py-24 relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10 background-grid-pattern mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Introducing Fixxr Pro Kits</h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-lg">
              Equip yourself with the industry standard. Buy or rent premium Fixxr-branded tool kits specifically curated for electricians, plumbers, and carpenters. Stand out with professional gear that ensures quality and safety.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="font-medium">Exclusive discounts for Active Captains</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="font-medium">Durable, enterprise-grade tools</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="font-medium">Free replacement on wear & tear</span>
              </li>
            </ul>
            <div className="pt-4">
              <Button size="lg" variant="secondary" className="rounded-full shadow-lg hover:scale-105 transition-transform text-primary font-bold">
                Explore Tool Kits
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center">
            {/* Visual Placeholder for Tools Kit */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-primary-foreground/10 border border-primary-foreground/20 shadow-2xl backdrop-blur-sm flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-foreground/5 to-transparent pointer-events-none" />
              <Wrench className="h-32 w-32 text-primary-foreground/50 group-hover:scale-110 transition-transform duration-500 ease-in-out" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to know about becoming a Fixxr Captain.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">What are the requirements to join?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
              You must have documented experience in your specific trade (Plumber, electrical, carpentry, etc.), pass a standard background check, and possess a valid identification. Fixxr Pro Kits are recommended but not strictly required to start.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">How and when do I get paid?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
              Payments are processed instantly upon job completion via our integrated secure payment gateway. Earnings are deposited directly into your linked bank account within 1-2 business days.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">Do I pay a fee to use the platform?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
              Fixxr takes a small percentage commission on completed jobs only. There are no monthly subscription fees, lead fees, or hidden costs. You only pay when you earn.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">Can I choose which jobs to accept?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
              Absolutely! You have complete autonomy. In the Fixxr Captain timeline, you can review a service request—including distance, estimated payout, and user problem description—before choosing to Accept or Reject it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer CTA */}
      <footer className="bg-secondary/50 py-16 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to upgrade your career?</h2>
          <Button asChild size="lg" className="rounded-full h-14 px-8 font-semibold shadow-md">
            <Link to="/signup">Apply Now</Link>
          </Button>
          <p className="mt-8 text-sm text-muted-foreground">© 2026 Fixxr Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Quick fallback Badge component to avoid importing missing shadcn badge locally
function Badge({ className, children }) {
  return <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>;
}
