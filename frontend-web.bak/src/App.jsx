
import React, { useState } from 'react';
import { Leaf, Bell, User, Menu, X, Globe } from 'lucide-react';
import './App.css';

// Import Pages
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import Crops from './pages/Crops';
import About from './pages/About';
import Detection from './pages/Detection';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Ask from './pages/Ask';
import { translations } from './utils/translations';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[lang];

  const renderPage = () => {
    const pages = {
      dashboard: <Dashboard t={t} />,
      farmers: <Farmers />,
      crops: <Crops />,
      detection: <Detection />,
      profile: <Profile />,
      analytics: <Analytics />,
      ask: <Ask />,
      about: <About />
    };
    return pages[currentPage] || <Dashboard t={t} />;
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard },
    { id: 'ask', label: 'Ask AI' },
    { id: 'analytics', label: t.analytics },
    { id: 'detection', label: t.detection },
    { id: 'farmers', label: t.farmers },
    { id: 'crops', label: t.crops },
    { id: 'about', label: t.about }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col">
      {/* Premium Header - Force Centered */}
      <header className="sticky top-0 z-50 bg-dark-bg/60 backdrop-blur-2xl border-b border-white/5 w-full shadow-[0_1px_10px_rgba(0,0,0,0.5)] flex justify-center">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-24">
            {/* Left: Logo */}
            <div 
              className="flex items-center gap-4 cursor-pointer group flex-shrink-0"
              onClick={() => setCurrentPage('dashboard')}
            >
              <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all duration-500 group-hover:rotate-12">
                <Leaf className="w-8 h-8 text-primary-light" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black tracking-tighter text-white leading-none">AgriIntel</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary-light font-black mt-1">Ethiopia</p>
              </div>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden lg:flex items-center gap-1 mx-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-4 py-2 text-[13px] font-black uppercase tracking-wider transition-all duration-200 rounded-lg ${
                    currentPage === item.id 
                      ? 'bg-primary/10 text-primary-light' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button 
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                <Globe size={14} className="text-primary-light" />
                {lang === 'en' ? 'አማርኛ' : 'English'}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <button className="hidden sm:block p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                  <Bell size={20} />
                </button>
                <button 
                  onClick={() => setCurrentPage('profile')}
                  className="p-1 border-2 border-primary/20 rounded-full hover:border-primary/50 transition-all"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary-light font-bold text-xs">
                    {lang === 'en' ? 'A' : 'አ'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Force Centered Layout */}
      <main className="flex-1 w-full bg-dark-bg flex flex-col items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-12">
          {renderPage()}
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-dark-bg border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Leaf className="w-6 h-6 text-primary-light" />
              <span className="text-lg font-bold text-white">AgriIntel Ethiopia</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{t.footer}</p>
            <div className="flex gap-6 text-xs font-semibold text-gray-400">
              <a href="#" className="hover:text-primary-light transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-light transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-light transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-widest">
            More Confidence. Better Decisions. Powered by Helena Agri-Intelligence Inspiration.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
