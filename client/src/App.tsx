
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SimpleLanguageProvider } from "@/components/SimpleLanguage";
import Home from "@/pages/Home";
import ComingSoon from "@/pages/ComingSoon";
import Dashboard from "@/pages/Dashboard";
import AnalysisProgress from "@/pages/AnalysisProgress";
import AnalysisResults from "@/pages/AnalysisResults";
import AllContracts from "@/pages/AllContracts";
import PersonalSettings from "@/pages/PersonalSettings";
import OrganizationSettings from "@/pages/OrganizationSettings";
import Chat from "@/pages/Chat";
import Help from "@/pages/Help";
import Tasks from "@/pages/Tasks";
import DesktopApp from "@/pages/help/DesktopApp";
import ReleaseNotes from "@/pages/help/ReleaseNotes";
import TermsPolicies from "@/pages/help/TermsPolicies";

// import AuthTest from "@/pages/AuthTest"; // Removed for clean slate
import NotFound from "@/pages/not-found";
import "@/styles/theme.css";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/coming-soon" component={ComingSoon} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analysis-progress" component={AnalysisProgress} />
      <Route path="/analysis-results" component={AnalysisResults} />
      <Route path="/repository" component={AllContracts} />
      <Route path="/settings/personal" component={PersonalSettings} />
      <Route path="/settings/organization" component={OrganizationSettings} />
      <Route path="/chat" component={Chat} />
      <Route path="/help" component={Help} />
      <Route path="/help/desktop-app" component={DesktopApp} />
      <Route path="/help/release-notes" component={ReleaseNotes} />
      <Route path="/help/terms" component={TermsPolicies} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/dashboard/analytics" component={Dashboard} />
      <Route path="/dashboard/parties" component={Dashboard} />
      <Route path="/dashboard/notifications" component={Dashboard} />
      <Route path="/dashboard/tags" component={Dashboard} />
      <Route path="/dashboard/contracts" component={AllContracts} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleLanguageProvider>
          <ThemeProvider>
            <Router />
            <Toaster />
          </ThemeProvider>
        </SimpleLanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;