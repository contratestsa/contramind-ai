import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimpleLanguageProvider } from "@/components/SimpleLanguage";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Home />}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard">
        {user ? <Dashboard /> : <Redirect to="/" />}
      </Route>
      <Route path="/coming-soon">
        {() => {
          window.location.href = '/dashboard';
          return null;
        }}
      </Route>

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