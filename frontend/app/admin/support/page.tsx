"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MessageSquare, ChevronRight } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    apiClient.get("/support/admin/tickets").then(r => { setTickets(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const openTicket = async (id: string) => {
    try { const r = await apiClient.get(`/support/tickets/${id}`); setSelected(r.data); }
    catch (e) { console.error(e); }
  };

  const sendReply = async () => {
    if (!reply) return;
    try {
      await apiClient.post(`/support/tickets/${selected.id}/reply`, { message: reply });
      setReply("");
      openTicket(selected.id);
    } catch (e: any) { alert(e.response?.data?.detail || "Error"); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.post(`/support/admin/tickets/${id}/status?status_str=${status}`);
      setSelected(null);
      const r = await apiClient.get("/support/admin/tickets");
      setTickets(r.data);
    } catch (e: any) { alert(e.response?.data?.detail || "Error"); }
  };

  const badge = (s: string) => {
    const m: any = { open: "bg-success/10 text-success", in_progress: "bg-blue-100 text-blue-600", waiting: "bg-warning/10 text-warning", resolved: "bg-green-100 text-green-600", closed: "bg-gray-100 text-gray-500" };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${m[s] || ""}`}>{s.replace("_", " ").toUpperCase()}</span>;
  };

  if (selected) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back</Button>
        <div className="flex gap-2">
          {selected.status !== "closed" && <Button size="sm" onClick={() => updateStatus(selected.id, "closed")}>Close</Button>}
          {selected.status === "open" && <Button size="sm" onClick={() => updateStatus(selected.id, "in_progress")}>Accept</Button>}
        </div>
      </div>
      <Card title={selected.subject} subtitle={`Status: ${selected.status} · Priority: ${selected.priority}`}>
        <div className="p-4 bg-slate-50 rounded-lg mb-4"><p className="text-sm">{selected.message}</p></div>
        {(selected.replies || []).map((r: any) => (
          <div key={r.id} className={`p-3 rounded-lg mb-2 ${r.is_staff ? "bg-primary/5 ml-8" : "bg-slate-50 mr-8"}`}>
            <p className="text-xs text-muted mb-1">{r.is_staff ? "Staff" : "Customer"} · {new Date(r.created_at).toLocaleString()}</p>
            <p className="text-sm">{r.message}</p>
          </div>
        ))}
        {selected.status !== "closed" && (
          <div className="flex gap-3 mt-4">
            <Input placeholder="Type reply..." value={reply} onChange={e => setReply(e.target.value)} />
            <Button onClick={sendReply}>Reply</Button>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold">Support Tickets</h1><p className="text-muted">Manage customer support requests.</p></div>
      <Card title="All Tickets">
        {loading ? <div className="text-center py-8 text-muted">Loading...</div> : tickets.length === 0 ? <div className="text-center py-8 text-muted">No tickets.</div> : (
          <div className="space-y-2">
            {tickets.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 hover:bg-slate-50 cursor-pointer" onClick={() => openTicket(t.id)}>
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="text-xs text-muted">{t.user_email} · {new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">{badge(t.status)}<ChevronRight size={16} className="text-muted" /></div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
