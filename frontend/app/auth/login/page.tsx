"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import { LockKeyhole, Mail } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiClient.post("/auth/login", {
        data: {
          username: formData.email,
          password: formData.password
        },
        // FastAPI OAuth2PasswordRequestForm expects form-data, not JSON
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: {
          username: formData.email,
          password: formData.password
        }
      });
      
      // Note: FastAPI OAuth2PasswordRequestForm usually needs specific format
      // For a real production app, we'd use FormData object
      const formDataObj = new FormData();
      formDataObj.append("username", formData.email);
      formDataObj.append("password", formData.password);
      
      const res = await apiClient.post("/auth/login", formDataObj);
      const { access_token, user } = res.data;
      
      login(access_token, user);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome Back</h1>
          <p className="text-muted mt-2">Enter your credentials to access your panel</p>
        </div>

        <Card className="border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-danger/10 text-danger text-sm font-medium border border-danger/20">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input 
                  label="Email Address" 
                  type="email" 
                  placeholder="name@company.com" 
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-base" isLoading={isLoading}>
              Sign In to Panel
            </Button>
          </form>
        </Card>
        
        <p className="text-center text-sm text-muted mt-6">
          Don't have an account? <a href="#" className="text-primary font-semibold hover:underline">Contact Admin</a>
        </p>
      </motion.div>
    </div>
  );
}
