"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { Bell, Shield, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted">Customize your experience.</p></div>
      <Card title="Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-warning" />}
              <div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted">Toggle dark/light theme</p></div>
            </div>
            <button onClick={toggleDark} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-border"} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${darkMode ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-muted" />
              <div><p className="text-sm font-medium">Email Notifications</p><p className="text-xs text-muted">Receive order updates via email</p></div>
            </div>
            <div className="w-12 h-6 rounded-full bg-primary relative cursor-pointer"><span className="absolute top-0.5 left-6 w-5 h-5 bg-white rounded-full" /></div>
          </div>
        </div>
      </Card>
      <Card title="Account Security">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3"><Shield size={20} className="text-success" /><div><p className="text-sm font-medium">Two-Factor Auth</p><p className="text-xs text-muted">Add extra security to your account</p></div></div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
