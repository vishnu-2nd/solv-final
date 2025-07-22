import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { DisclaimerProvider } from './components/DisclaimerManager';
import { DisclaimerPopup } from './components/DisclaimerPopup';
import { LandingPage } from './pages/LandingPage';
import { AboutUs } from './pages/AboutUs';
import { Services } from './pages/Services';
import { Research } from './pages/Research';
import { Careers } from './pages/Careers';
import { Contact } from './pages/Contact';
import { Disclaimer } from './pages/Disclaimer';
import { BlogPost } from './pages/BlogPost';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBlogs } from './pages/admin/AdminBlogs';
import { AdminJobs } from './pages/admin/AdminJobs';
import { UserManagement } from './pages/admin/UserManagement';
import { TagManagement } from './pages/admin/TagManagement';
import { CreateBlog } from './pages/admin/CreateBlog';
import { EditBlog } from './pages/admin/EditBlog';
import { CreateJob } from './pages/admin/CreateJob';
import { EditJob } from './pages/admin/EditJob';
import { ProtectedRoute } from './components/ProtectedRoute';

// Component to handle scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Component to conditionally render Navigation and Footer
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
};
function App() {
  return (
    <DisclaimerProvider>
      <Router>
        <ScrollToTop />
        <DisclaimerPopup />
        <div className="min-h-screen bg-slate-50">
          <ConditionalLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/research" element={<Research />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* Admin Login Routes - NOT PROTECTED */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/blogs" element={
                <ProtectedRoute>
                  <AdminBlogs />
                </ProtectedRoute>
              } />
              <Route path="/admin/blogs/create" element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/blogs/edit/:id" element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <ProtectedRoute>
                  <AdminJobs />
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs/create" element={
                <ProtectedRoute>
                  <CreateJob />
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs/edit/:id" element={
                <ProtectedRoute>
                  <EditJob />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/tags" element={
                <ProtectedRoute>
                  <TagManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </ConditionalLayout>
        </div>
      </Router>
    </DisclaimerProvider>
  );
}

export default App;