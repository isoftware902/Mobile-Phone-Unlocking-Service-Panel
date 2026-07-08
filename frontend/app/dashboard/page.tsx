"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight 
} from "lucide-react";
import apiClient from "@/lib/api-client";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          apiClient.get("/users/me"),
          apiClient.get("/orders/my-orders"),
        ]);
        setUser(userRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeOrders = orders.filter(o => o.status === "pending" || o.status === "processing" || o.status === "waiting").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const rejectedOrders = orders.filter(o => o.status === "rejected").length;

  const stats = [
    { label: "Total Balance", value: user ? `$${Number(user.balance).toFixed(2)}` : "$0.00", icon: TrendingUp, color: "text-primary", trend: "Available for orders" },
    { label: "Active Orders", value: String(activeOrders), icon: Clock, color: "text-warning", trend: `${orders.filter(o => o.status === "pending").length} pending approval` },
    { label: "Completed", value: String(completedOrders), icon: CheckCircle, color: "text-success", trend: "Total fulfilled" },
    { label: "Rejected", value: String(rejectedOrders), icon: AlertCircle, color: "text-danger", trend: "Requires attention" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-warning/10 text-warning",
      waiting: "bg-blue-100 text-blue-600",
      processing: "bg-purple-100 text-purple-600",
      completed: "bg-success/10 text-success",
      rejected: "bg-danger/10 text-danger",
      cancelled: "bg-gray-100 text-gray-500",
      refunded: "bg-orange-100 text-orange-600",
      hold: "bg-yellow-100 text-yellow-600",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-500"}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.username || "User"}</h1>
          <p className="text-muted">Here's what's happening with your services today.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => router.push("/dashboard/orders/new")}>
          <ShoppingBag size={18} />
          New Order
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className={`text-xs mt-1 ${stat.color}`}>{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-full bg-slate-50 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2" title="Recent Orders" subtitle="Track your latest unlocking requests">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-medium text-muted border-b border-border">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Service</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Price</th>
                  <th className="pb-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted">No orders yet. Create your first order!</td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-medium">#{String(order.id).substring(0, 8)}</td>
                      <td className="py-4 text-sm">{order.service?.name || "Service"}</td>
                      <td className="py-4">{getStatusBadge(order.status)}</td>
                      <td className="py-4 text-sm">${Number(order.price_paid).toFixed(2)}</td>
                      <td className="py-4 text-sm text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions/Balance */}
        <div className="space-y-6">
          <Card title="Quick Wallet" subtitle="Manage your account funds">
            <div className="text-center py-4">
              <p className="text-sm text-muted">Current Balance</p>
              <h2 className="text-4xl font-bold text-foreground mt-2">${Number(user?.balance || 0).toFixed(2)}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button variant="outline" className="w-full">Add Funds</Button>
              <Button variant="primary" className="w-full">Withdraw</Button>
            </div>
          </Card>

          <Card title="System Status" subtitle="Real-time API connectivity">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">Global API</span>
                <span className="flex items-center gap-2 text-xs text-success font-bold">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">Payment Gateway</span>
                <span className="flex items-center gap-2 text-xs text-success font-bold">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
