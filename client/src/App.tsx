import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Properties from "@/pages/Properties";
import Projects from "@/pages/Projects";
import Models from "@/pages/Models";
import PropertyDetails from "@/pages/PropertyDetails";
import LeadCRM from "@/pages/LeadCRM";
import DealPipeline from "@/pages/DealPipeline";
import OfferManagement from "@/pages/OfferManagement";
import DocumentVault from "@/pages/DocumentVault";
import LiveOpenHouse from "@/pages/LiveOpenHouse";
import CalendarIntegration from "@/pages/CalendarIntegration";
import SubscriptionBilling from "@/pages/SubscriptionBilling";
import MarketData from "@/pages/MarketData";
import AutomatedReports from "@/pages/AutomatedReports";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetails} />
      <Route path="/projects" component={Projects} />
      <Route path="/models" component={Models} />
      <Route path="/leads" component={LeadCRM} />
      <Route path="/deals" component={DealPipeline} />
      <Route path="/offers" component={OfferManagement} />
      <Route path="/documents" component={DocumentVault} />
      <Route path="/open-houses" component={LiveOpenHouse} />
      <Route path="/calendar" component={CalendarIntegration} />
      <Route path="/subscription" component={SubscriptionBilling} />
      <Route path="/market-data" component={MarketData} />
      <Route path="/reports" component={AutomatedReports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
