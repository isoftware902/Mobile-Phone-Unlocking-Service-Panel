"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MessageSquare, Plus, ChevronRight } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState("");

  const fetchTickets = async () => {
    try { const r = await apiClient.get("/support/tickets"); setTickets(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const createTicket = async () => {
    if (!subject || !message) return alert("Fill in all fields");
    setSubmitting(true);
    try { await apiClient.post("/support/tickets", { subject, message }); setShowNew(false); setSubject(""); setMessage(""); fetchTickets(); }
    catch (e: any) { alert(e.response?.data?.detail || "Error"); }
    finally { setSubmitting(false); }
  };

  const openTicket = async (id: string) => {
    try { const r = await apiClient.get(`/support/tickets/${id}`); setSelectedTicket(r.data); }
    catch (e) { console.error(e); }
  };

  const sendReply = async () => {
    if (!reply) return;
    try { await apiClient.post(`/support/tickets/${selectedTicket.id}/reply`, { message: reply }); setReply(""); openTicket(selectedTicket.id); }
    catch (e: any) { alert(e.response?.data?.detail || "Error"); }
  };

  const closeTicket = async (id: string) => {
    try { await apiClient.post(`/support/tickets/${id}/close`); setSelectedTicket(null); fetchTickets(); }
    catch (e) { console.error(e); }
  };

  const badge = (s: string) => {
    const m: any = { open: "bg-success/10 text-success", in_progress: "bg-blue-100 text-blue-600", waiting: "bg-warning/10 text-warning", resolved: "bg-green-100 text-green-600", closed: "bg-gray-100 text-gray-500" };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${m[s] || ""}`}>{s.replace("_", " ").toUpperCase()}</span>;
  };

  if (selectedTicket) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => setSelectedTicket(null)}>← Back to Tickets</Button>
      <Card title={selectedTicket.subject} subtitle={`Status: ${selectedTicket.status} · Priority: ${selectedTicket.priority}`}>
        <div className="p-4 bg-slate-50 rounded-lg mb-4"><p className="text-sm">{selectedTicket.message}</p></div>
        <div className="space-y-3 mb-4">
          {(selectedTicket.replies || []).map((r: any) => (
            <div key={r.id} className={`p-3 rounded-lg ${r.is_staff ? "bg-primary/5 ml-8" : "bg-slate-50 mr-8"}`}>
              <p className="text-xs text-muted mb-1">{r.is_staff ? "Staff" : "You"} · {new Date(r.created_at).toLocaleString()}</p>
              <p className="text-sm">{r.message}</p>
            </div>
          ))}
        </div>
        {selectedTicket.status !== "closed" && (
          <div className="flex gap-3">
            <Input placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} />
            <Button onClick={sendReply}>Send</Button>
            <Button variant="outline" onClick={() => closeTicket(selectedTicket.id)}>Close</Button>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Support Tickets</h1><p className="text-muted">Get help from our support team.</p></div>
        <Button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2"><Plus size={18} /> New Ticket</Button>
      </div>
      {showNew && (
        <Card title="Create New Ticket">
          <div className="space-y-4">
            <Input label="Subject" placeholder="e.g. Payment issue" value={subject} onChange={e => setSubject(e.target.value)} />
            <Input label="Message" placeholder="Describe your issue in detail..." value={message} onChange={e => setMessage(e.target.value)} className="h-32" />
            <div className="flex gap-3">
              <Button onClick={createTicket} isLoading={submitting}>Submit Ticket</Button>
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}
      <Card title="My Tickets">
        {loading ? <div className="text-center py-8 text-muted">Loading...</div> : tickets.length === 0 ? <div className="text-center py-8 text-muted">No tickets yet.</div> : (
          <div className="space-y-2">
            {tickets.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => openTicket(t.id)}>
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="text-xs text-muted">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {badge(t.status)}
                  <ChevronRight size={16} className="text-muted" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
