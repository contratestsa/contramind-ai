
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimpleLanguageProvider } from "@/components/SimpleLanguage";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";
import ComingSoon from "@/pages/ComingSoon";
import Dashboard from "@/pages/Dashboard";
import AnalysisProgress from "@/pages/AnalysisProgress";
import AnalysisResults from "@/pages/AnalysisResults";
import Repository from "@/pages/Repository";
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

// Wrapper component for dashboard routes
function DashboardWrapper({ component: Component }: { component: React.ComponentType }) {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/coming-soon" component={ComingSoon} />
      <Route path="/dashboard">{() => <DashboardWrapper component={Dashboard} />}</Route>
      <Route path="/analysis-progress">{() => <DashboardWrapper component={AnalysisProgress} />}</Route>
      <Route path="/analysis-results">{() => <DashboardWrapper component={AnalysisResults} />}</Route>
      <Route path="/repository">{() => <DashboardWrapper component={Repository} />}</Route>
      <Route path="/settings/personal">{() => <DashboardWrapper component={PersonalSettings} />}</Route>
      <Route path="/settings/organization">{() => <DashboardWrapper component={OrganizationSettings} />}</Route>
      <Route path="/chat">{() => <DashboardWrapper component={Chat} />}</Route>
      <Route path="/help">{() => <DashboardWrapper component={Help} />}</Route>
      <Route path="/help/desktop-app">{() => <DashboardWrapper component={DesktopApp} />}</Route>
      <Route path="/help/release-notes">{() => <DashboardWrapper component={ReleaseNotes} />}</Route>
      <Route path="/help/terms">{() => <DashboardWrapper component={TermsPolicies} />}</Route>
      <Route path="/tasks">{() => <DashboardWrapper component={Tasks} />}</Route>
      <Route path="/dashboard/analytics">{() => <DashboardWrapper component={Dashboard} />}</Route>
      <Route path="/dashboard/parties">{() => <DashboardWrapper component={Dashboard} />}</Route>
      <Route path="/dashboard/notifications">{() => <DashboardWrapper component={Dashboard} />}</Route>
      <Route path="/dashboard/tags">{() => <DashboardWrapper component={Dashboard} />}</Route>

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