import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Subscription } from "@shared/schema";
import { CreditCard, Check, Zap, Building2, Star, Shield } from "lucide-react";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: 99,
    icon: Zap,
    color: "border-gray-200",
    badge: "",
    description: "Perfect for individual agents",
    features: [
      "Up to 10 property listings",
      "Basic 3D model viewer",
      "5 virtual tours/month",
      "Email support",
      "Lead capture forms",
      "Mobile AR viewer",
    ]
  },
  {
    key: "professional",
    name: "Professional",
    price: 299,
    icon: Star,
    color: "border-primary",
    badge: "Most Popular",
    description: "For growing brokerages",
    features: [
      "Unlimited property listings",
      "Full 3D model creation",
      "Unlimited virtual tours",
      "Live virtual open houses",
      "CRM & lead management",
      "Deal pipeline tracker",
      "Document vault",
      "Priority support",
      "White-label branding",
      "Calendar integration",
    ]
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 999,
    icon: Building2,
    color: "border-gray-800 dark:border-gray-200",
    badge: "Best Value",
    description: "For large firms & teams",
    features: [
      "Everything in Professional",
      "Meta Quest VR integration",
      "Apple Vision Pro support",
      "MLS data sync",
      "Market comps & analytics",
      "Custom AI recommendations",
      "Dedicated account manager",
      "SSO & enterprise security",
      "API access",
      "Custom integrations",
    ]
  }
];

export default function SubscriptionBilling() {
  const { toast } = useToast();
  const { data: sub } = useQuery<Subscription>({ queryKey: ["/api/subscription"] });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/subscription", data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      toast({ title: `Switched to ${vars.plan.charAt(0).toUpperCase() + vars.plan.slice(1)} plan!`, description: "Your plan has been updated successfully." });
    }
  });

  const currentPlan = sub?.plan || "professional";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" /> Subscription & Billing
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your ARRE subscription plan</p>
            </div>

            {/* Current Status */}
            {sub && (
              <Card className="mb-8 border-primary/30 bg-primary/5">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-gray-900 dark:text-white">Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Next billing date: {sub.currentPeriodEnd || "December 31, 2024"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${PLANS.find(p => p.key === currentPlan)?.price || 0}</div>
                    <div className="text-xs text-gray-500">/month</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map(plan => {
                const Icon = plan.icon;
                const isCurrent = currentPlan === plan.key;
                return (
                  <Card key={plan.key} className={`border-2 relative ${isCurrent ? "border-primary" : plan.color} ${plan.key === "professional" ? "shadow-lg" : ""}`}>
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-white border-0 px-3">{plan.badge}</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${isCurrent ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-5">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{f}</span>
                          </li>
                        ))}
                      </ul>
                      {isCurrent ? (
                        <Button className="w-full" disabled>Current Plan</Button>
                      ) : (
                        <Button
                          className="w-full"
                          variant={plan.key === "professional" ? "default" : "outline"}
                          onClick={() => updateMutation.mutate({ plan: plan.key })}
                          disabled={updateMutation.isPending}
                        >
                          {plan.price > (PLANS.find(p => p.key === currentPlan)?.price || 0) ? "Upgrade" : "Downgrade"} to {plan.name}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Billing Info */}
            <Card className="mt-8">
              <CardHeader><CardTitle className="text-base">Billing Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Payment Method</div>
                    <div className="flex items-center gap-2 font-medium"><CreditCard className="h-4 w-4 text-gray-400" />Visa ending in 4242</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Billing Email</div>
                    <div className="font-medium">mike@eolianvr.com</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Billing Address</div>
                    <div className="font-medium">Miami, FL 33101</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Update your payment method in account settings." })}>Update Payment</Button>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Invoice emailed to mike@eolianvr.com" })}>Download Invoice</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
