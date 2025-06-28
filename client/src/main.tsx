import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageRouter } from "@/components/LanguageRouter";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <LanguageRouter>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/ar" component={Home} />
              <Route path="/en" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/ar/login" component={Login} />
              <Route path="/en/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/ar/signup" component={Signup} />
              <Route path="/en/signup" component={Signup} />
              <Route component={NotFound} />
            </Switch>
          </LanguageRouter>
        </LanguageProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
