import React, { useContext, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    Home,
    Search,
    ClipboardList,
    MessageSquare,
    User,
    LogOut,
    Menu,
    Wrench,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ModeToggle } from "../components/mode-toggle";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Find Professionals", href: "/find", icon: Search },
    { name: "My Requests", href: "/requests", icon: ClipboardList },
    { name: "Chat", href: "/chat", icon: MessageSquare },
];

export const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const NavLinks = () => (
        <div className="space-y-1">
            {navItems.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                return (
                    <Link key={item.name} to={item.href}>
                        <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start ${isActive ? "font-bold" : "font-medium"}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-background text-foreground dot-pattern">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-card/50 backdrop-blur-xl md:flex">
                <div className="flex h-16 items-center px-6 border-b">
                    <Wrench className="mr-2 h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">FixBuddy</span>
                </div>
                <nav className="flex-1 p-4 relative">
                    <div className="mb-6 px-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</p>
                    </div>
                    <NavLinks />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b bg-card/50 backdrop-blur-md px-4 md:px-8">
                    <div className="flex items-center md:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-ml-2">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-0">
                                <div className="flex h-16 items-center px-6 border-b">
                                    <Wrench className="mr-2 h-6 w-6 text-primary" />
                                    <span className="text-xl font-bold tracking-tight">FixBuddy</span>
                                </div>
                                <nav className="p-4 relative">
                                    <NavLinks />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <span className="ml-2 text-lg font-bold">FixBuddy</span>
                    </div>

                    <div className="ml-auto flex items-center space-x-4">
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 flex items-center justify-center hover:bg-primary/5 rounded-full ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <Avatar className="h-9 w-9 border-2 border-primary/10 shadow-sm">
                                        <AvatarImage src={user?.profileImage} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {user?.name ? user.name[0].toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.phoneNumber}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/profile")}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
