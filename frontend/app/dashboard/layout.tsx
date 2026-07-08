"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: ShoppingBag, label: "Create Order", href: "/dashboard/orders/new" },
    { icon: ShoppingBag, label: "Order History", href: "/dashboard/orders" },
    { icon: Wallet, label: "Wallet & Funds", href: "/dashboard/wallet" },
    { icon: MessageSquare, label: "Support", href: "/dashboard/support" },
    { icon: User, label: "My Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-bold text-xl text-primary truncate">Unlock Pro</span>}
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

        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-danger hover:bg-red-50" 
            onClick={logout}
          >
            <LogOut size={20} className="min-w-[20px]" />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-card"></span>
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.username || "User"}</p>
                <p className="text-xs text-muted mt-1">${user?.balance?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
