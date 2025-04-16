import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Discover from "@/pages/discover";
import Calendar from "@/pages/calendar";
import Recommendations from "@/pages/recommendations";
import Clubs from "@/pages/clubs";
import Organizer from "@/pages/organizer";
import Profile from "@/pages/profile";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-6">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/clubs" component={Clubs} />
          <Route path="/organizer" component={Organizer} />
          <Route path="/profile" component={Profile} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
