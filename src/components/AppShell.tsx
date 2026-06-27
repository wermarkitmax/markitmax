import { type ReactNode, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, UserSquare2, FolderKanban, FileText, Wallet,
  Receipt, ShoppingBag, Globe, BarChart3, Settings, Activity, LogOut,
  Briefcase, Menu, ChevronDown, UsersRound,
} from "lucide-react";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; roles: AppRole[] };

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "employee"] },
    ],
  },
  {
    section: "CRM",
    items: [
      { to: "/leads", label: "Leads", icon: Users, roles: ["admin", "employee"] },
      { to: "/contacts", label: "Contacts", icon: UserSquare2, roles: ["admin", "employee"] },
      { to: "/projects", label: "Projects", icon: FolderKanban, roles: ["admin", "employee"] },
    ],
  },
  {
    section: "Finance",
    items: [
      { to: "/invoices", label: "Invoices", icon: FileText, roles: ["admin"] },
      { to: "/accounts", label: "Accounts", icon: Wallet, roles: ["admin"] },
      { to: "/expenses", label: "Expenses", icon: Receipt, roles: ["admin"] },
      { to: "/sales", label: "Sales", icon: ShoppingBag, roles: ["admin"] },
    ],
  },
  {
    section: "Catalog",
    items: [
      { to: "/products", label: "Products", icon: ShoppingBag, roles: ["admin"] },
    ],
  },
  {
    section: "Team",
    items: [
      { to: "/employees", label: "Employees", icon: UsersRound, roles: ["admin"] },
    ],
  },
  {
    section: "System",
    items: [
      { to: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
      { to: "/activity", label: "Activity", icon: Activity, roles: ["admin"] },
      { to: "/settings", label: "Settings", icon: Settings, roles: ["admin"] },
    ],
  },
];

export function AppShell({ children, title, actions }: { children: ReactNode; title?: string; actions?: ReactNode }) {
  const { user, role, profile, signOut } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    nav({ to: "/auth" });
  };

  const initials = (profile?.full_name || user?.email || "U")
    .split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const visibleSections = NAV.map((s) => ({
    ...s,
    items: s.items.filter((i) => !role || i.roles.includes(role)),
  })).filter((s) => s.items.length > 0);

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground">
          <Briefcase className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="font-serif text-base">MARKITMAX</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Agency OS</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {visibleSections.map((section) => (
          <div key={section.section} className="mb-4">
            <div className="px-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {section.section}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                      )}
                    >
                      <Icon className="h-4 w-4 opacity-70" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-sidebar-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent text-accent-foreground text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium">{profile?.full_name || user?.email}</div>
                <div className="truncate text-xs text-muted-foreground">{role}</div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => nav({ to: "/settings" })} disabled={role !== "admin"}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden lg:block">{Sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0">{Sidebar}</div>
        </div>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {title && <h1 className="font-serif text-xl">{title}</h1>}
          </div>
          <div className="flex items-center gap-2">
            {role && <Badge variant="secondary" className="capitalize">{role}</Badge>}
            {actions}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
