"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, ArrowUpRight, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  const filtered = orders.filter(o =>
    !search || String(o.id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order History</h1>
        <p className="text-muted">Track all your unlocking service requests.</p>
      </div>
      <Card>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-transparent text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center py-12 text-muted">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted">No orders found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">#{String(order.id).substring(0, 8)}</p>
                    <p className="text-xs text-muted mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm text-muted max-w-xs truncate">
                    {order.service?.name || "Service Order"}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold">${Number(order.price_paid).toFixed(2)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <Button variant="ghost" size="sm"><ArrowUpRight size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
