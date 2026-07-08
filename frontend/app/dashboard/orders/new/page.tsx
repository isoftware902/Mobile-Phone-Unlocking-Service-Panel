"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { Search, Info, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CreateOrderPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    imei: "",
    carrier: "",
    country: "",
    notes: "",
  });

  // Mock services list - this will come from API
  const mockServices = [
    { id: "1", name: "iPhone 15 Pro Max - Factory Unlock", price: 45.00, requirements: "IMEI, Country", time: "1-3 Days", category: "Apple" },
    { id: "2", name: "Samsung S24 Ultra - Network Unlock", price: 30.00, requirements: "IMEI", time: "24 Hours", category: "Samsung" },
    { id: "3", name: "Google Pixel 8 - Official Unlock", price: 25.00, requirements: "IMEI, Email", time: "2-5 Days", category: "Google" },
  ];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API Call
    setTimeout(() => {
      alert("Order submitted successfully!");
      setIsLoading(false);
      setStep(1);
      setSelectedService(null);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Order</h1>
          <p className="text-muted">Select a service and provide the required device details.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={step >= 1 ? "text-primary" : "text-muted"}>1. Select Service</span>
          <span className="text-muted">→</span>
          <span className={step >= 2 ? "text-primary" : "text-muted"}>2. Order Details</span>
        </div>
      </div>

      {step === 1 ? (
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="space-y-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <Input 
              placeholder="Search for your phone model or service..." 
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockServices.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:border-primary transition-all group"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{service.category}</span>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{service.name}</h3>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted">
                      <span className="flex items-center gap-1"><Clock size={14}/> {service.time}</span>
                      <span className="flex items-center gap-1"><Info size={14}/> {service.requirements}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">${service.price.toFixed(2)}</p>
                    <Button variant="outline" size="sm" className="mt-2">Select</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2">
            <Card title="Order Details" subtitle="Please ensure all information is correct to avoid rejection">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="IMEI / Serial Number" 
                    placeholder="Enter 15-digit IMEI" 
                    required
                    value={formData.imei}
                    onChange={(e) => setFormData({...formData, imei: e.target.value})}
                  />
                  <Input 
                    label="Carrier/Network" 
                    placeholder="e.g. T-Mobile, Vodafone" 
                    required
                    value={formData.carrier}
                    onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                  />
                  <Input 
                    label="Country" 
                    placeholder="Country of origin" 
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                  <Input 
                    label="Model" 
                    placeholder="e.g. A3102"                     
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                  />
                </div>
                <Input 
                  label="Additional Notes" 
                  placeholder="Any specific instructions for the technician..." 
                  type="text"
                  className="h-24"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back to Services</Button>
                  <Button type="submit" className="flex-1" isLoading={isLoading}>Confirm & Pay</Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Order Summary">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Delivery Time:</span>
                  <span className="font-medium">{selectedService?.time}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-semibold">Total Cost:</span>
                  <span className="text-xl font-bold text-primary">${selectedService?.price.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="bg-blue-50 border-primary/20">
              <div className="flex gap-3">
                <AlertCircle className="text-primary shrink-0" size={20} />
                <div className="text-sm text-primary/80">
                  <p className="font-semibold">Balance Check</p>
                  <p>Your balance will be deducted immediately upon confirmation.</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
