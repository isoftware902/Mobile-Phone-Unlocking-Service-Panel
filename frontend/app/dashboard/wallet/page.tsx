"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  History,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from "lucide-react";
import apiClient from "@/lib/api-client";

export default function WalletPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [reloadRequests, setReloadRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReload, setShowReload] = useState(false);
  const [reloadAmount, setReloadAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, txnRes, reloadRes] = await Promise.all([
          apiClient.get("/users/me"),
          apiClient.get("/wallet/transactions"),
          apiClient.get("/wallet/reload-requests"),
        ]);
        setUser(userRes.data);
        setTransactions(txnRes.data);
        setReloadRequests(reloadRes.data);
      } catch (err) {
        console.error("Failed to load wallet data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReloadRequest = async () => {
    const amount = parseFloat(reloadAmount);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount");
    setSubmitting(true);
    try {
      await apiClient.post("/wallet/reload-request", { amount, description: "User requested top-up" });
      alert("Reload request submitted for admin approval");
      setShowReload(false);
      setReloadAmount("");
      // Refresh
      const reloadRes = await apiClient.get("/wallet/reload-requests");
      setReloadRequests(reloadRes.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-warning/10 text-warning",
      approved: "bg-success/10 text-success",
      rejected: "bg-danger/10 text-danger",
      credit: "bg-success/10 text-success",
      debit: "bg-danger/10 text-danger",
      refund: "bg-blue-100 text-blue-600",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-500"}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted">Loading wallet...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet & Funds</h1>
          <p className="text-muted">Manage your balance and view transaction history.</p>
        </div>
        <Button onClick={() => setShowReload(!showReload)} className="flex items-center gap-2">
          <Plus size={18} /> Request Top-Up
        </Button>
      </div>

      {showReload && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card title="Request Balance Top-Up" subtitle="Your request will be reviewed by an administrator">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Input 
                  label="Amount (USD)" 
                  type="number" 
                  step="0.01" 
                  min="1"
                  placeholder="e.g. 100.00"
                  value={reloadAmount}
                  onChange={(e) => setReloadAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleReloadRequest} isLoading={submitting} className="mb-0.5">
                Submit Request
              </Button>
              <Button variant="outline" onClick={() => setShowReload(false)} className="mb-0.5">
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Transaction History" subtitle="All credits and debits on your account">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted">No transactions yet.</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((txn: any) => (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      txn.transaction_type === "credit" || txn.transaction_type === "refund" 
                        ? "bg-success/10" : "bg-danger/10"
                    }`}>
                      {txn.transaction_type === "credit" || txn.transaction_type === "refund" ? (
                        <ArrowDownLeft size={16} className="text-success" />
                      ) : (
                        <ArrowUpRight size={16} className="text-danger" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.description || "Transaction"}</p>
                      <p className="text-xs text-muted">{new Date(txn.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      txn.transaction_type === "credit" || txn.transaction_type === "refund" 
                        ? "text-success" : "text-danger"
                    }`}>
                      {txn.transaction_type === "credit" || txn.transaction_type === "refund" ? "+" : "-"}${Number(txn.amount).toFixed(2)}
                    </p>
                    {getStatusBadge(txn.transaction_type)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Current Balance" subtitle="Available funds for orders">
            <div className="text-center py-6">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                <Wallet size={32} className="text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">${Number(user?.balance || 0).toFixed(2)}</h2>
              <p className="text-sm text-muted mt-2">USD Balance</p>
            </div>
          </Card>

          <Card title="Recent Reload Requests" subtitle="Status of your top-up requests">
            {reloadRequests.length === 0 ? (
              <div className="text-center py-4 text-muted text-sm">No reload requests yet.</div>
            ) : (
              <div className="space-y-3">
                {reloadRequests.slice(0, 5).map((req: any) => (
                  <div key={req.id} className="flex items-center justify-between p-2">
                    <div>
                      <p className="text-sm font-medium">${Number(req.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
