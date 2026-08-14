import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AIChatbot } from './components/AIChatbot';
import { CustomerView } from './views/CustomerView';
import { PartnerView } from './views/PartnerView';
import { AdminView } from './views/AdminView';
import { AdminLoginView } from './views/AdminLoginView';
import { AdminVerifyOtpView } from './views/AdminVerifyOtpView';

function App() {
  const { role, setRole } = useApp();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [verifyingEmail, setVerifyingEmail] = useState('');

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Sync route and role states
  useEffect(() => {
    const isAdminTokenPresent = !!sessionStorage.getItem('adminToken');

    if (currentPath.startsWith('/admin')) {
      if (currentPath === '/admin/dashboard') {
        if (!isAdminTokenPresent) {
          navigateTo('/admin/login');
        } else if (role !== 'admin') {
          setRole('admin');
        }
      } else if (currentPath === '/admin/verify-otp') {
        if (!verifyingEmail) {
          navigateTo('/admin/login');
        }
      }
    } else {
      // If path is not admin, but role is admin, verify session
      if (role === 'admin') {
        if (isAdminTokenPresent) {
          navigateTo('/admin/dashboard');
        } else {
          navigateTo('/admin/login');
        }
      }
    }
  }, [currentPath, role, verifyingEmail]);

  const handleLoginSuccess = (email: string) => {
    setVerifyingEmail(email);
    navigateTo('/admin/verify-otp');
  };

  const handleVerificationSuccess = (token: string) => {
    sessionStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminEmail', verifyingEmail);
    setVerifyingEmail('');
    setRole('admin');
    navigateTo('/admin/dashboard');
  };

  const handleCancelVerification = () => {
    setVerifyingEmail('');
    navigateTo('/admin/login');
  };

  const isAdminPath = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-slate-100 transition-colors duration-300 select-none">
      {/* Navigation Navbar (Sticky Header) */}
      <Navbar />
      
      {/* Switchable Role & Admin Secure Views */}
      <main className="pb-8">
        {isAdminPath ? (
          <>
            {currentPath === '/admin/login' && (
              <AdminLoginView onLoginSuccess={handleLoginSuccess} />
            )}
            {currentPath === '/admin/verify-otp' && (
              <AdminVerifyOtpView
                email={verifyingEmail}
                onVerificationSuccess={handleVerificationSuccess}
                onCancel={handleCancelVerification}
              />
            )}
            {currentPath === '/admin/dashboard' && sessionStorage.getItem('adminToken') && (
              <AdminView />
            )}
          </>
        ) : (
          <>
            {role === 'customer' && <CustomerView />}
            {role === 'partner' && <PartnerView />}
            {role === 'admin' && sessionStorage.getItem('adminToken') && <AdminView />}
          </>
        )}
      </main>

      {/* Persistent Floating AI Chatbot & Voice Assistant */}
      <AIChatbot />
    </div>
  );
}

export default App;
