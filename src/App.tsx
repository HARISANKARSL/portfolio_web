import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

// Public Pages
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Skills from "./pages/Skills.tsx";
import Projects from "./pages/Projects.tsx";
import Analytics from "./pages/Analytics.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin Pages
import SkillsAdmin from "./pages/admin/Skills.tsx";
import ExperienceAdmin from "./pages/admin/Experience.tsx";
import ProjectsAdmin from "./pages/admin/Projects.tsx";
import TeamAdmin from "./pages/admin/Team.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/skills"
              element={
                <Layout>
                  <Skills />
                </Layout>
              }
            />
            <Route
              path="/projects"
              element={
                <Layout>
                  <Projects />
                </Layout>
              }
            />
            <Route
              path="/analytics"
              element={
                <Layout>
                  <Analytics />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />

            {/* Admin Routes - Protected */}
            <Route
              path="/admin/skills"
              element={
                <ProtectedRoute>
                  <SkillsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/experience"
              element={
                <ProtectedRoute>
                  <ExperienceAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <ProjectsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/team"
              element={
                <ProtectedRoute>
                  <TeamAdmin />
                </ProtectedRoute>
              }
            />

            {/* 404 - Must be last */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
