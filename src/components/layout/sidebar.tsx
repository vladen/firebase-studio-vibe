
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Lightbulb, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Activity Feed", icon: LayoutDashboard },
  { href: "/roadmap", label: "Project Roadmap", icon: BarChart3 },
  { href: "/ideas", label: "Project Ideas", icon: Lightbulb },
  // { href: "/grooming", label: "Task Grooming", icon: ListChecks }, // Disabled for now
];

const Logo = () => (
  <div className="flex items-center gap-2 px-4 py-6 mb-2">
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <rect width="100" height="100" rx="20" fill="currentColor"/>
      <path d="M30 70L50 30L70 70" stroke="hsl(var(--background))" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="50" cy="20" r="10" fill="hsl(var(--accent))"/>
    </svg>
    <h1 className="text-xl font-headline font-semibold text-foreground">Project Sentinel</h1>
  </div>
);


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full flex flex-col bg-sidebar border-r border-sidebar-border fixed">
      <Logo />
      <ScrollArea className="flex-1">
        <nav className="px-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Button
                  variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1",
                    pathname.startsWith(item.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
