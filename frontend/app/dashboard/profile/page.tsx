"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Shield, DollarSign, Calendar } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/users/me").then(r => { setUser(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-muted">Loading...</div>;
  if (!user) return <div className="text-center py-12 text-muted">Not logged in</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold">My Profile</h1><p className="text-muted">Manage your account information.</p></div>
      <Card title="Account Details">
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">{user.username?.charAt(0).toUpperCase()}</div>
            <div><h2 className="text-xl font-bold">{user.username}</h2><p className="text-muted capitalize">{user.role?.replace("_", " ")}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><Mail size={18} className="text-muted" /><div><p className="text-xs text-muted">Email</p><p className="text-sm font-medium">{user.email}</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><User size={18} className="text-muted" /><div><p className="text-xs text-muted">Username</p><p className="text-sm font-medium">{user.username}</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><Shield size={18} className="text-muted" /><div><p className="text-xs text-muted">Group</p><p className="text-sm font-medium capitalize">{user.group}</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><DollarSign size={18} className="text-muted" /><div><p className="text-xs text-muted">Balance</p><p className="text-sm font-medium">${Number(user.balance).toFixed(2)}</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><Calendar size={18} className="text-muted" /><div><p className="text-xs text-muted">Member Since</p><p className="text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</p></div></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
