import React, { useContext, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  Home, 
  Briefcase, 
  ListOrdered, 
  Star, 
  User, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
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
  { name: "Requests", href: "/requests", icon: ListOrdered },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Profile", href: "/profile", icon: User },
];

export const MainLayout = () => {
  const location = useLocation();
  const { logout, captain } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const NavLinks = () => (
    <>
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
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
      <div className="mt-auto absolute bottom-4 w-full left-0 px-4">
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground dot-pattern">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card/50 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center px-6 border-b">
          <Briefcase className="mr-2 h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Fixxr Captain</span>
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
                  <Briefcase className="mr-2 h-6 w-6 text-primary" />
                  <span className="text-xl font-bold tracking-tight">Fixxr Captain</span>
                </div>
                <nav className="p-4 relative h-[calc(100vh-4rem)]">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <span className="ml-2 text-lg font-bold">Fixxr</span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden outline-none">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 transition-all hover:scale-105">
                    <AvatarImage src={captain?.profileImage} alt={captain?.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {captain?.name ? captain.name[0].toUpperCase() : "C"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{captain?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {captain?.email || captain?.phoneNumber}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                  onClick={handleLogout}
                >
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
