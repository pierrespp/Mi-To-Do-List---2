import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import WorkspacePage from "@/pages/WorkspacePage";
import { ThemeProvider, ThemeToggle } from "@/components/ThemeToggle";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/w/:slug" component={WorkspacePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { petBridge } from "../../../src/integrations/petBridge";
import { PetSystemMount } from "../../../src/integrations/PetSystemMount";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
          <ThemeToggle />
          <PetSystemMount />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
