
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Admin from "./pages/Admin";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Context Providers
import { MovieProvider } from "./contexts/MovieContext";
import AdminRoute from "./components/auth/AdminRoute";
import AuthorizeView from "./components/auth/AuthorizeView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      
        <MovieProvider>
          <Toaster />
          <AuthorizeView >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route element={<AdminRoute/>}>
                <Route path="/admin" element={<Admin />} />
              </Route>
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </AuthorizeView>
        </MovieProvider>
      
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
