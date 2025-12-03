import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SchoolStudent from "./pages/SchoolStudent";
import CollegeStudent from "./pages/CollegeStudent";
import SchoolResults from "./pages/SchoolResults";
import CollegeResults from "./pages/CollegeResults";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Explore from "./pages/Explore";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/school-student" element={<SchoolStudent />} />
          <Route path="/college-student" element={<CollegeStudent />} />
          <Route path="/school-results" element={<SchoolResults />} />
          <Route path="/college-results" element={<CollegeResults />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/explore" element={<Explore />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
