"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TrendingUp, ShoppingBag, Users, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes] = await Promise.all([
          apiClient.get("/orders/all"),
        ]);
        const orders = ordersRes.data;
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === "pending").length,
          completedOrders: orders.filter((o: any) => o.status === "completed").length,
          totalUsers: new Set(orders.map((o: any) => o.user_id)).size,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Orders", value: String(stats.totalOrders), icon: ShoppingBag, color: "text-primary" },
    { label: "Pending", value: String(stats.pendingOrders), icon: AlertCircle, color: "text-warning" },
    { label: "Completed", value: String(stats.completedOrders), icon: CheckCircle, color: "text-success" },
    { label: "Active Users", value: String(stats.totalUsers), icon: Users, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted">Overview of your unlocking business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">{card.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{loading ? "..." : card.value}</h3>
                </div>
                <div className={`p-3 rounded-full bg-slate-50 ${card.color}`}>
                  <card.icon size={24} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 text-lg" onClick={() => window.location.href = "/admin/orders"}>
            <ShoppingBag size={20} className="mr-2" /> Manage Orders
          </Button>
          <Button variant="outline" className="h-20 text-lg" onClick={() => window.location.href = "/admin/services"}>
            <TrendingUp size={20} className="mr-2" /> Edit Services
          </Button>
          <Button variant="outline" className="h-20 text-lg" onClick={() => window.location.href = "/admin/wallet"}>
            <DollarSign size={20} className="mr-2" /> Wallet Requests
          </Button>
        </div>
      </Card>
    </div>
  );
}
