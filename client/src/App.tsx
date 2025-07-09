import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimpleLanguageProvider } from "@/components/SimpleLanguage";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import ComingSoon from "@/pages/ComingSoon";
import Dashboard from "@/pages/Dashboard";
import AnalysisProgress from "@/pages/AnalysisProgress";
import AnalysisResults from "@/pages/AnalysisResults";
import Repository from "@/pages/Repository";
import PersonalSettings from "@/pages/PersonalSettings";
import OrganizationSettings from "@/pages/OrganizationSettings";
import HelpCenter from "@/pages/HelpCenter";
import WhatsNew from "@/pages/WhatsNew";
// import AuthTest from "@/pages/AuthTest"; // Removed for clean slate
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/coming-soon" component={ComingSoon} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analysis-progress" component={AnalysisProgress} />
      <Route path="/analysis-results" component={AnalysisResults} />
      <Route path="/repository" component={Repository} />
      <Route path="/settings/personal" component={PersonalSettings} />
      <Route path="/settings/organization" component={OrganizationSettings} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/whats-new" component={WhatsNew} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleLanguageProvider>
          <Router />
          <Toaster />
        </SimpleLanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;