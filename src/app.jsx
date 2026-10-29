import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteHeader from './components/site-header.jsx';
import SiteFooter from './components/site-footer.jsx';
import Home from './pages/home.jsx';
import About from './pages/about.jsx';
import Services from './pages/services.jsx';
import Contact from './pages/contact.jsx';
import AdminSetup from './pages/admin-setup.jsx';
import AdminLogin from './pages/admin-login.jsx';
import AdminDashboard from './pages/admin-dashboard.jsx';
import NotFound from './pages/not-found.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-purple-900 selection:text-purple-100">
      <SiteHeader />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <SiteFooter />
    </div>
  );
}