import React, { useEffect, useState } from "react";
import homeData from "../../data/homeData.json";

export default function Home({ lang, setActiveTab }) {
  const [scrollY, setScrollY] = useState(0);
  const data = homeData;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 scale-105 transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            backgroundImage: `url('${data.hero.backgroundImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/40 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-4xl mx-auto px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/20 border border-secondary-container/30 text-secondary-fixed font-label-sm">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{data.hero.badge[lang]}</span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-6xl text-white leading-tight" style={{ color: "#fff" }}>
            {data.hero.title[lang]}
          </h1>
          <p className="font-body-lg text-white/80 max-w-2xl mx-auto text-lg md:text-xl">
            {data.hero.subtitle[lang]}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 w-full px-4 sm:px-0">
            <button
              onClick={() => setActiveTab("disease-detection")}
              className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 px-8 py-3.5 rounded-full font-label-md transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
            >
              <span>{data.hero.buttons.scan[lang]}</span>
              <span className="material-symbols-outlined text-[20px]">shutter_speed</span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className="border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-full font-label-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>{data.hero.buttons.mission[lang]}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="page-container space-y-12 md:space-y-16">
        {/* Statistics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-gutter">
          {data.statistics.map((stat, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-2xl flex flex-col justify-between group hover:border-primary/20 transition-all duration-300">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${idx === 1 ? 'bg-secondary-container/20 text-secondary' : 'bg-primary-container text-inverse-primary'}`}>
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <div>
                <span className="font-display-lg text-4xl text-primary font-bold block mb-2">{stat.value}</span>
                <h3 className="font-label-md text-on-surface font-semibold mb-1">
                  {stat.title[lang]}
                </h3>
                <p className="font-body-md text-on-surface-variant/80 text-sm">
                  {stat.description[lang]}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Feature Highlights Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-gutter items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>{data.featureHighlights.badge}</span>
            </div>
            <h2 className="font-display-lg text-3xl md:text-4xl text-primary">
              {data.featureHighlights.title[lang]}
            </h2>
            <p className="font-body-lg text-on-surface-variant">
              {data.featureHighlights.description[lang]}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row">
              <button
                onClick={() => setActiveTab("chatbot")}
                className="bg-primary text-on-primary hover:bg-primary-container px-6 py-3 rounded-full font-label-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>{data.featureHighlights.button[lang]}</span>
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.featureHighlights.cards.map((card, idx) => (
              <div key={idx} className={`glass-panel p-6 rounded-xl space-y-4 hover:shadow-md transition-shadow ${idx === 2 ? 'col-span-1 md:col-span-2' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 1 ? 'bg-secondary-container/20 text-secondary' : 'bg-primary-container text-inverse-primary'}`}>
                  <span className="material-symbols-outlined text-xl">{card.icon}</span>
                </div>
                <h4 className="font-label-md text-primary font-semibold">
                  {card.title[lang]}
                </h4>
                <p className="font-body-md text-on-surface-variant text-sm">
                  {card.description[lang]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
