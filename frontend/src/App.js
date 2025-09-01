import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { Web3Provider } from './contexts/Web3Context';
import { FHEProvider } from './contexts/FHEContext';
import { AppStateProvider } from './contexts/AppStateContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import DashboardPage from './pages/DashboardPage';
import DEXPage from './pages/DEXPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Utility Components
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Styles
import './styles/globals.css';
import './styles/animations.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <FHEProvider>
            <AppStateProvider>
              <Router>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  {/* Navigation */}
                  <Navbar />
                  
                  {/* Main Content */}
                  <main className="flex-1">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                      <Route path="/dex" element={<DEXPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      
                      {/* Protected Routes */}
                      <Route path="/create" element={<CreateProjectPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  
                  {/* Footer */}
                  <Footer />
                  
                  {/* Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#1E293B',
                        color: '#F8FAFC',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                      },
                      success: {
                        iconTheme: {
                          primary: '#10B981',
                          secondary: '#F8FAFC',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: '#EF4444',
                          secondary: '#F8FAFC',
                        },
                      },
                      loading: {
                        iconTheme: {
                          primary: '#3B82F6',
                          secondary: '#F8FAFC',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </AppStateProvider>
          </FHEProvider>
        </Web3Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;