import { Switch, Route } from "wouter";
import { LanguageProvider } from "@/components/LanguageProvider";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router />
    </LanguageProvider>
  );
}

export default App;
