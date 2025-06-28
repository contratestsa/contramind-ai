import * as React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimpleLanguageProvider } from "@/components/SimpleLanguage";
import { LanguageRouter } from "@/components/LanguageRouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Language-aware routes */}
      <Route path="/:lang" component={Home} />
      <Route path="/:lang/login" component={Login} />
      <Route path="/:lang/signup" component={Signup} />
      
      {/* Fallback routes for backwards compatibility */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleLanguageProvider>
          <LanguageRouter>
            <Router />
            <Toaster />
          </LanguageRouter>
        </SimpleLanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;