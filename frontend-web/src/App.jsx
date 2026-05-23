import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Chatbot from "./pages/Chatbot/Chatbot";
import DiseaseDetection from "./pages/DiseaseDetection/DiseaseDetection";
import Dashboard from "./pages/Dashboard/Dashboard";
import Marketplace from "./pages/Marketplace/Marketplace";
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import { translations } from "./utils/translations";

function AppContent() {
  const [lang, setLang] = useState("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const t = translations[lang] || translations.en;

  const handleLangToggle = () => {
    setLang((prev) => (prev === "en" ? "am" : "en"));
  };

  // Nav menus
  const navItems = [
    { id: "home", label: lang === "en" ? "Home" : "መነሻ ገጽ", icon: "home", path: "/" },
    { id: "landing", label: lang === "en" ? "Landing" : "መነሻ", icon: "home", path: "/landing" },
    { id: "features", label: lang === "en" ? "Features" : "ባህሪያት", icon: "star", path: "/features" },
    { id: "pricing", label: lang === "en" ? "Pricing" : "ዋጋ", icon: "payments", path: "/pricing" },
    { id: "dashboard", label: t.dashboard || "Dashboard", icon: "dashboard", path: "/dashboard" },
    { id: "disease-detection", label: t.detection || "Detection", icon: "biotech", path: "/detection" },
    { id: "marketplace", label: t.marketplace || "Marketplace", icon: "store", path: "/marketplace" },
    { id: "chatbot", label: lang === "en" ? "Chatbot" : "ቻትቦት", icon: "chat", path: "/chatbot" },
    { id: "contact", label: lang === "en" ? "Contact" : "ያግኙን", icon: "mail", path: "/contact" },
    { id: "about", label: t.about || "About Us", icon: "info", path: "/about" },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/landing") return "landing";
    if (path === "/features") return "features";
    if (path === "/pricing") return "pricing";
    if (path === "/dashboard") return "dashboard";
    if (path === "/detection") return "disease-detection";
    if (path === "/marketplace") return "marketplace";
    if (path === "/chatbot") return "chatbot";
    if (path === "/contact") return "contact";
    if (path === "/about") return "about";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-3.5 max-w-container-max mx-auto">
          {/* Logo & Platform Name */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <div>
              <span className="font-display-lg text-lg md:text-xl font-bold text-primary tracking-tight block">
                AgriIntel
              </span>
              <span className="text-[10px] text-outline tracking-wider font-semibold uppercase block -mt-1">
                Ethiopia
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-2xl">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 font-label-md text-xs px-2.5 py-2 rounded-full transition-all whitespace-nowrap ${
                  activeTab === item.id
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={handleLangToggle}
              className="flex items-center gap-1.5 font-label-md text-xs text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/60 px-4 py-2 rounded-full hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[16px]">language</span>
              <span>{lang === "en" ? "አማርኛ" : "English"}</span>
            </button>
            <Link
              to="/dashboard"
              className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 font-label-md text-xs px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
            >
              {lang === "en" ? "Open Platform" : "መድረኩን ክፈት"}
            </Link>
          </div>

          {/* Mobile Menu Action Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={handleLangToggle}
              className="p-2 rounded-full border border-outline-variant/50 text-primary flex items-center justify-center hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-lg">language</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-outline-variant/20 bg-surface/95 backdrop-blur-lg animate-in slide-in-from-top duration-200">
            <div className="px-4 py-4 space-y-2.5">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-label-md transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-on-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-outline-variant/20 flex gap-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-grow text-center bg-primary text-on-primary font-label-md text-xs py-3 rounded-xl hover:bg-primary-container"
                >
                  {lang === "en" ? "Open Platform" : "መድረኩን ክፈት"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Pages Container */}
      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home lang={lang} setActiveTab={(tab) => window.location.href = `/${tab === 'home' ? '' : tab}`} />} />
          <Route path="/landing" element={<Landing setCurrentPage={(page) => window.location.href = `/${page === 'home' ? '' : page}`} />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing setCurrentPage={(page) => window.location.href = `/${page === 'home' ? '' : page}`} />} />
          <Route path="/dashboard" element={<Dashboard lang={lang} />} />
          <Route path="/detection" element={<DiseaseDetection lang={lang} />} />
          <Route path="/marketplace" element={<Marketplace lang={lang} />} />
          <Route path="/chatbot" element={<Chatbot lang={lang} setActiveTab={(tab) => window.location.href = `/${tab === 'home' ? '' : tab}`} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About lang={lang} />} />
        </Routes>
      </div>

      {/* Premium Footer */}
      {activeTab !== "chatbot" && (
        <footer className="bg-primary text-white border-t border-primary-container py-12 relative overflow-hidden mt-auto">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.3px,transparent_0.3px)] opacity-5 pointer-events-none" />
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-2xl">eco</span>
                <span className="font-display-lg text-lg font-bold text-white tracking-tight">
                  AgriIntel Ethiopia
                </span>
              </div>
              <p className="font-body-md text-white/60 text-xs leading-relaxed max-w-xs">
                Empowering local cooperative unions and smallholders with precision soil analytics, crop disease diagnosis, and investment marketplace access.
              </p>
            </div>

            <div>
              <h4 className="font-label-md text-white font-bold text-xs uppercase tracking-wider mb-4">
                Platform Features
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">
                    IoT Farm Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/detection" className="hover:text-white transition-colors">
                    AI Disease Detection
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="hover:text-white transition-colors">
                    Crop Investment Market
                  </Link>
                </li>
                <li>
                  <Link to="/chatbot" className="hover:text-white transition-colors">
                    AI Agronomist Expert
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-md text-white font-bold text-xs uppercase tracking-wider mb-4">
                Our Vision
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    Precision Telemetry
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    Satellite NDVI Monitoring
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    Ethiopian Food Security
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-label-md text-white font-bold text-xs uppercase tracking-wider mb-2">
                National Digital Platform
              </h4>
              <p className="font-body-md text-white/60 text-[11px] leading-relaxed">
                Designed in partnership with agricultural cooperatives across Oromia, Amhara, and Sidama regions.
              </p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded bg-white/10 text-[9px] font-bold text-secondary-fixed">
                  v1.2.0 Stable
                </span>
                <span className="px-2.5 py-1 rounded bg-white/10 text-[9px] font-bold text-secondary-fixed">
                  M-PESA Ready
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/50 relative z-10">
            <span>{t.footer || "© 2026 AgriIntel Ethiopia. Empowering Farmers, Securing Food."}</span>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
