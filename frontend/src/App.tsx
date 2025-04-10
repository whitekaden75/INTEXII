import React from 'react';
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
import UserLoader from "./components/auth/AuthorizeView"; // This is the global user loader (replaces AuthorizeViewWrapper)
import ProtectedRoute from "./components/auth/ProtectedRoute"; // This route guard only allows access for authenticated users

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MovieProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {/* The UserLoader provides the user context for every route */}
          <UserLoader>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/movies" element={<Movies />} />
                <Route path="/movies/:id" element={<MovieDetail />} />
                <Route path="/admin" element={<Admin />} />
              </Route>

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserLoader>
        </BrowserRouter>
      </TooltipProvider>
    </MovieProvider>
  </QueryClientProvider>
);

export default App;
