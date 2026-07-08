"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  BarChart3,
  Shield,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: BarChart3, label: "Services", href: "/admin/services" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Wallet, label: "Wallet", href: "/admin/wallet" },
    { icon: MessageSquare, label: "Support", href: "/admin/support" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              <span className="font-bold text-xl text-primary truncate">Admin Panel</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted hover:bg-slate-100"
              }`}
            >
              <item.icon size={20} className="min-w-[20px]" />
              {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/dashboard"}>
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">User Panel</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start text-danger hover:bg-red-50" onClick={logout}>
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-foreground">
            {menuItems.find(m => isActive(m.href))?.label || "Admin"}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-card"></span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.username || "Admin"}</p>
                <p className="text-xs text-muted mt-1 capitalize">{user?.role?.replace("_", " ") || "User"}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold">
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
