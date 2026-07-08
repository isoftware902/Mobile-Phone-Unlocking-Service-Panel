"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Globe, Lock, Bell, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold">System Settings</h1><p className="text-muted">Configure your unlocking service platform.</p></div>
      <Card title="General Settings">
        <div className="space-y-4">
          <Input label="Site Name" defaultValue="Phone Unlock Pro" />
          <Input label="Support Email" defaultValue="support@example.com" />
          <Input label="Default Currency" defaultValue="USD" />
          <Button>Save Settings</Button>
        </div>
      </Card>
      <Card title="Service Configuration">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div><p className="text-sm font-medium">Auto-approve orders</p><p className="text-xs text-muted">Skip admin approval for new orders</p></div>
            <div className="w-12 h-6 rounded-full bg-border relative cursor-pointer"><span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full" /></div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div><p className="text-sm font-medium">Maintenance Mode</p><p className="text-xs text-muted">Disable all services temporarily</p></div>
            <div className="w-12 h-6 rounded-full bg-border relative cursor-pointer"><span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full" /></div>
          </div>
        </div>
      </Card>
      <Card title="Security">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3"><Lock size={20} className="text-muted" /><div><p className="text-sm font-medium">Force 2FA for all admins</p><p className="text-xs text-muted">Require two-factor authentication</p></div></div>
          <Button variant="outline" size="sm">Configure</Button>
        </div>
      </Card>
      <Card title="Database">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3"><Database size={20} className="text-muted" /><div><p className="text-sm font-medium">Backup Database</p><p className="text-xs text-muted">Download a SQL backup of all data</p></div></div>
          <Button variant="outline" size="sm">Download</Button>
        </div>
      </Card>
    </div>
  );
}
