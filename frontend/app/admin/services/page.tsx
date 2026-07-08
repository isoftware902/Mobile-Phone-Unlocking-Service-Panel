"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Edit3, Search, Filter } from "lucide-react";

export default function AdminServicesPage() {
  const [isAdding, setIsAdding] = useState(false);

  const mockServices = [
    { id: "1", name: "iPhone 15 Pro Max - Factory Unlock", cat: "Apple", price: 45, cost: 30, time: "1-3 Days" },
    { id: "2", name: "Samsung S24 Ultra - Network Unlock", cat: "Samsung", price: 30, cost: 20, time: "24 Hours" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Management</h1>
          <p className="text-muted">Configure your unlocking services and pricing tiers.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add New Service
        </Button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card title="Add New Service" subtitle="Define pricing for all user groups">
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Service Name" placeholder="e.g. iPhone 13 Official Unlock" required />
              <Input label="Category" placeholder="e.g. Apple" required />
              <Input label="Processing Time" placeholder="e.g. 2-5 Days" required />
              
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-lg border border-border">
                <Input label="Retail Price ($)" type="number" placeholder="0.00" required />
                <Input label="Wholesale ($)" type="number" placeholder="0.00" required />
                <Input label="VIP ($)" type="number" placeholder="0.00" required />
                <Input label="Reseller ($)" type="number" placeholder="0.00" required />
                <Input label="Distributor ($)" type="number" placeholder="0.00" required />
              </div>
              
              <Input label="Admin Cost (Wholesale)" type="number" placeholder="What you pay" required />
              <Input label="Requirements" placeholder="IMEI, Country, etc." required />
              
              <div className="md:col-span-3 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Save Service</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <Card title="Active Services" subtitle="Currently available for customer purchase">
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <input className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Search services..." />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-sm font-medium text-muted border-b border-border">
              <tr>
                <th className="pb-4">Service Name</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Retail Price</th>
                <th className="pb-4">Admin Cost</th>
                <th className="pb-4">Time</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockServices.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-sm font-medium">{s.name}</td>
                  <td className="py-4 text-sm text-muted">{s.cat}</td>
                  <td className="py-4 text-sm font-bold">${s.price}</td>
                  <td className="py-4 text-sm text-muted">${s.cost}</td>
                  <td className="py-4 text-sm">{s.time}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-primary"><Edit3 size={16} /></Button>
                      <Button variant="ghost" size="sm" className="text-danger"><Trash2 size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
