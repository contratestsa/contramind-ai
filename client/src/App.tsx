
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
import Chat from "@/pages/Chat";
import Help from "@/pages/Help";
import Tasks from "@/pages/Tasks";
import DesktopApp from "@/pages/help/DesktopApp";
import ReleaseNotes from "@/pages/help/ReleaseNotes";
import TermsPolicies from "@/pages/help/TermsPolicies";
import AnalyticsReports from "@/pages/AnalyticsReports";
import PartiesContacts from "@/pages/PartiesContacts";
import Notifications from "@/pages/Notifications";
import TagsCategories from "@/pages/TagsCategories";
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
      <Route path="/chat" component={Chat} />
      <Route path="/help" component={Help} />
      <Route path="/help/desktop-app" component={DesktopApp} />
      <Route path="/help/release-notes" component={ReleaseNotes} />
      <Route path="/help/terms" component={TermsPolicies} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/analytics" component={Dashboard} />
      <Route path="/parties" component={Dashboard} />
      <Route path="/notifications" component={Dashboard} />
      <Route path="/tags" component={Dashboard} />

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