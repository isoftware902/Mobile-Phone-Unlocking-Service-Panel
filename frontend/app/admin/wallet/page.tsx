"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  CheckCircle, 
  XCircle, 
  Search,
  DollarSign,
  RefreshCw
} from "lucide-react";
import apiClient from "@/lib/api-client";

export default function AdminWalletPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get("/wallet/admin/reload-requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load reload requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    try {
      await apiClient.post(`/wallet/admin/reload-request/${requestId}`, { 
        action,
        admin_notes: action === "approve" ? "Approved by admin" : "Rejected by admin"
      });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.detail || `Failed to ${action} request`);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-warning/10 text-warning",
      approved: "bg-success/10 text-success",
      rejected: "bg-danger/10 text-danger",
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || ""}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet Management</h1>
          <p className="text-muted">Approve or reject customer reload requests.</p>
        </div>
        <Button variant="outline" onClick={fetchRequests} className="flex items-center gap-2">
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      <Card title="Pending Reload Requests" subtitle="Review and process customer top-up requests">
        {loading ? (
          <div className="text-center py-12 text-muted">Loading requests...</div>
        ) : requests.filter(r => r.status === "pending").length === 0 ? (
          <div className="text-center py-12 text-muted">No pending reload requests.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-medium text-muted border-b border-border">
                  <th className="pb-4">User</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.filter(r => r.status === "pending").map((req) => (
                  <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm">{req.user_email}</td>
                    <td className="py-4 text-sm font-bold">${Number(req.amount).toFixed(2)}</td>
                    <td className="py-4 text-sm text-muted">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="py-4">{getStatusBadge(req.status)}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-success" onClick={() => handleAction(req.id, "approve")}>
                          <CheckCircle size={18} /> Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger" onClick={() => handleAction(req.id, "reject")}>
                          <XCircle size={18} /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="All Requests History" subtitle="Complete log of reload requests">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm font-medium text-muted border-b border-border">
                <th className="pb-4">User</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted">No requests yet.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm">{req.user_email}</td>
                    <td className="py-4 text-sm font-medium">${Number(req.amount).toFixed(2)}</td>
                    <td className="py-4 text-sm text-muted">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="py-4">{getStatusBadge(req.status)}</td>
                    <td className="py-4 text-sm text-muted">{req.admin_notes || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
