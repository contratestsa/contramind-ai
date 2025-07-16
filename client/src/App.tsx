import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { SimpleLanguageProvider } from "@/components/SimpleLanguage";
import Home from "@/pages/Home";
import { queryClient } from "@/lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleLanguageProvider>
        <AuthProvider>
          <Router>
            <Route path="/" component={Home} />
            <Route path="*" component={Home} />
          </Router>
          <Toaster />
        </AuthProvider>
      </SimpleLanguageProvider>
    </QueryClientProvider>
  );
}

export default App;