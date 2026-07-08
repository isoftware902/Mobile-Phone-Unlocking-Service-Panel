"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Shield, UserCheck, UserX, DollarSign } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try { const r = await apiClient.get("/admin/users"); setUsers(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleActive = async (userId: string, current: boolean) => {
    try { await apiClient.patch(`/admin/users/${userId}`, { is_active: !current }); fetchUsers(); }
    catch (e: any) { alert(e.response?.data?.detail || "Error"); }
  };

  const filtered = users.filter((u: any) =>
    !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase())
  );

  const badge = (role: string) => {
    const m: any = { super_admin: "bg-danger/10 text-danger", admin: "bg-warning/10 text-warning", user: "bg-primary/10 text-primary" };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${m[role] || ""}`}>{role.replace("_", " ").toUpperCase()}</span>;
  };

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold">User Management</h1><p className="text-muted">Manage all registered users.</p></div>
      <Card title="All Users">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
          <input className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-transparent text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Search by email or username..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <div className="text-center py-8 text-muted">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="text-sm font-medium text-muted border-b border-border"><th className="pb-4">User</th><th className="pb-4">Email</th><th className="pb-4">Role</th><th className="pb-4">Group</th><th className="pb-4">Balance</th><th className="pb-4">Status</th><th className="pb-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-4 text-sm font-medium">{u.username}</td>
                    <td className="py-4 text-sm text-muted">{u.email}</td>
                    <td className="py-4">{badge(u.role)}</td>
                    <td className="py-4 text-sm capitalize">{u.group}</td>
                    <td className="py-4 text-sm font-medium">${Number(u.balance).toFixed(2)}</td>
                    <td className="py-4">{u.is_active ? <span className="text-success text-xs font-medium">ACTIVE</span> : <span className="text-danger text-xs font-medium">SUSPENDED</span>}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className={u.is_active ? "text-danger" : "text-success"} onClick={() => toggleActive(u.id, u.is_active)}>
                          {u.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
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
    </div>
  );
}
