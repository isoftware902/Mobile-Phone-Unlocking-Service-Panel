"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  MoreVertical,
  FileText,
  MessageSquare
} from "lucide-react";
import apiClient from "@/lib/api-client";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get("/orders/all");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await apiClient.patch(`/orders/${orderId}`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update order");
    }
  };

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
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-500"}`}>{status.toUpperCase()}</span>;
  };

  const filteredOrders = orders.filter(o => 
    !search || 
    String(o.id).toLowerCase().includes(search.toLowerCase()) ||
    (o.order_data && String(o.order_data).toLowerCase().includes(search.toLowerCase()))
  );

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-medium text-muted border-b border-border">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Service</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted">No orders found.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-medium">#{String(order.id).substring(0, 8)}</td>
                      <td className="py-4 text-sm">{order.service?.name || "Service"}</td>
                      <td className="py-4">{getStatusBadge(order.status)}</td>
                      <td className="py-4 text-sm">${Number(order.price_paid).toFixed(2)}</td>
                      <td className="py-4 text-sm text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="text-success" onClick={() => handleStatusUpdate(order.id, "completed")} title="Complete">
                            <CheckCircle size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-danger" onClick={() => handleStatusUpdate(order.id, "rejected")} title="Reject">
                            <XCircle size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-primary" title="Note">
                            <MessageSquare size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
