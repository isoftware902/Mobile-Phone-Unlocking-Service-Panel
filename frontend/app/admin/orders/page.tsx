"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  Clock,
  MoreVertical,
  FileText,
  MessageSquare
} from "lucide-react";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState("all");

  const orders = [
    { id: "ORD-8291", user: "john_doe", service: "iPhone 15 Pro Max Factory", status: "pending", price: 45.00, date: "2023-10-20", imei: "354678...901" },
    { id: "ORD-8292", user: "jane_smith", service: "Samsung S24 Ultra Network", status: "processing", price: 30.00, date: "2023-10-19", imei: "351122...445" },
    { id: "ORD-8293", user: "mike_ross", service: "Google Pixel 8 Official", status: "completed", price: 25.00, date: "2023-10-18", imei: "359988...112" },
    { id: "ORD-8294", user: "sarah_connor", service: "iPhone 14 Factory", status: "rejected", price: 40.00, date: "2023-10-17", imei: "356677...334" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-warning/10 text-warning",
      processing: "bg-blue-100 text-blue-600",
      completed: "bg-success/10 text-success",
      rejected: "bg-danger/10 text-danger",
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted">Manage, update, and fulfill customer unlocking requests.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} /> Filter
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <FileText size={16} /> Export CSV
          </Button>
        </div>
      </div>

      <Card title="All Orders" subtitle="Real-time queue of all service requests">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
          <input 
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-transparent text-sm focus:ring-2 focus:ring-primary outline-none" 
            placeholder="Search by Order ID, User or IMEI..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm font-medium text-muted border-b border-border">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Service</th>
                <th className="pb-4">IMEI</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Date</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-sm font-medium">{order.id}</td>
                  <td className="py-4 text-sm">{order.user}</td>
                  <td className="py-4 text-sm">{order.service}</td>
                  <td className="py-4 text-sm font-mono text-muted">{order.imei}</td>
                  <td className="py-4">{getStatusBadge(order.status)}</td>
                  <td className="py-4 text-sm">${order.price.toFixed(2)}</td>
                  <td className="py-4 text-sm text-muted">{order.date}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="text-success" title="Complete">
                        <CheckCircle size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-danger" title="Reject">
                        <XCircle size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-primary" title="Note">
                        <MessageSquare size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
