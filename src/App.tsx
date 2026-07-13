import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AIChatbot } from './components/AIChatbot';
import { CustomerView } from './views/CustomerView';
import { PartnerView } from './views/PartnerView';
import { AdminView } from './views/AdminView';

function App() {
  const { role } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-slate-100 transition-colors duration-300 select-none">
      {/* Navigation Navbar (Sticky Header) */}
      <Navbar />
      
      {/* Switchable Role Views */}
      <main className="pb-8">
        {role === 'customer' && <CustomerView />}
        {role === 'partner' && <PartnerView />}
        {role === 'admin' && <AdminView />}
      </main>

      {/* Persistent Floating AI Chatbot & Voice Assistant */}
      <AIChatbot />
    </div>
  );
}

export default App;
