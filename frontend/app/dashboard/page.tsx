"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight 
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Total Balance", value: "$1,500.00", icon: TrendingUp, color: "text-primary", trend: "+12% this month" },
    { label: "Active Orders", value: "12", icon: Clock, color: "text-warning", trend: "3 pending approval" },
    { label: "Completed", value: "148", icon: CheckCircle, color: "text-success", trend: "98% success rate" },
    { label: "Rejected", value: "2", icon: AlertCircle, color: "text-danger", trend: "-1% from last month" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Admin</h1>
          <p className="text-muted">Here's what's happening with your services today.</p>
        </div>
        <Button className="flex items-center gap-2">
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
                  <th className="pb-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium">#ORD-829{i}</td>
                    <td className="py-4 text-sm">iPhone 15 Pro Max - Factory Unlock</td>
                    <td className="py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
                        Processing
                      </span>
                    </td>
                    <td className="py-4 text-sm">$45.00</td>
                    <td className="py-4 text-sm text-muted">Oct 2{i}, 2023</td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="sm" className="p-1">
                        <ArrowUpRight size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions/Balance */}
        <div className="space-y-6">
          <Card title="Quick Wallet" subtitle="Manage your account funds">
            <div className="text-center py-4">
              <p className="text-sm text-muted">Current Balance</p>
              <h2 className="text-4xl font-bold text-foreground mt-2">$1,500.00</h2>
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
