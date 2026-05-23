import React, { useState, useEffect } from "react";
import { translations } from "../../utils/translations";
import aboutData from "../../data/aboutData.json";

export default function About({ lang }) {
  const t = translations[lang] || translations.en;
  // Get data for current language with fallback to english
  const data = aboutData;
  const dHero = data.hero;
  const dEngine = data.intelligenceEngine;
  const dForm = data.contactForm;

  const [formState, setFormState] = useState({
    name: "",
    organization: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", organization: "", email: "", message: "" });
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroBg = document.querySelector('.parallax-bg');
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex-grow w-full">
      {/* Hero Section: Vision Narrative */}
      <section className="relative pt-16 md:pt-20 pb-24 md:pb-32 px-4 sm:px-margin-mobile md:px-margin-desktop overflow-hidden parallax-wrapper">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            className="parallax-bg w-full h-full object-cover object-center absolute top-0 left-0 right-0 bottom-0 z-[-1]" 
            alt="Aerial view of terraced fields" 
            src={dHero.backgroundImage} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/70 to-surface"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-gutter items-center">
          <div className="lg:col-span-8 lg:col-start-3 text-center space-y-6 md:space-y-8 glass-panel p-6 sm:p-8 md:p-12 rounded-2xl ambient-shadow w-full mx-auto">
            <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary leading-tight">
              {dHero.title[lang].part1}<br/>
              <span className="text-secondary-container">{dHero.title[lang].part2}</span>
            </h1>
            <div className="space-y-6 text-left">
              {dHero.paragraphs.map((para, idx) => (
                <p 
                  key={idx} 
                  className={`font-body-lg text-body-lg text-on-surface-variant leading-relaxed ${idx === dHero.paragraphs.length - 1 ? 'font-semibold text-primary' : ''}`}
                >
                  {para[lang]}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Tech: AI & Sensory Integration (Bento Grid) */}
      <section className="py-16 md:py-24 px-4 sm:px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">
              {dEngine.sectionTitle[lang]}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {dEngine.sectionSubtitle[lang]}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-gutter auto-rows-[minmax(250px,auto)]">
            {/* Feature 1: Satellite */}
            <div className="glass-panel p-8 rounded-xl md:col-span-2 relative overflow-hidden group flex flex-col justify-end min-h-[300px] ambient-shadow">
              <div className="absolute inset-0 z-0 opacity-40 transition-opacity group-hover:opacity-60 duration-500">
                <img className="w-full h-full object-cover" alt={dEngine.features[0].title.en} src={dEngine.features[0].image}/>
              </div>
              <div className="relative z-10 bg-surface/90 p-6 rounded-lg backdrop-blur-md">
                <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-inverse-primary">{dEngine.features[0].icon}</span>
                </div>
                <h3 className="font-headline-md text-[20px] text-primary mb-2">
                  {dEngine.features[0].title[lang]}
                </h3>
                <p className="font-body-md text-label-md text-on-surface-variant font-normal">
                  {dEngine.features[0].description[lang]}
                </p>
              </div>
            </div>

            {/* Feature 2: IoT Sensors */}
            <div className="glass-panel p-8 rounded-xl relative overflow-hidden group flex flex-col min-h-[300px] ambient-shadow">
              <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary">{dEngine.features[1].icon}</span>
              </div>
              <h3 className="font-headline-md text-[20px] text-primary mb-3 mt-auto">
                {dEngine.features[1].title[lang]}
              </h3>
              <p className="font-body-md text-label-md text-on-surface-variant font-normal">
                {dEngine.features[1].description[lang]}
              </p>
            </div>

            {/* Feature 3: Predictive AI */}
            <div className="glass-panel p-6 sm:p-8 rounded-xl md:col-span-3 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 ambient-shadow">
              <div className="flex-1">
                <div className="w-12 h-12 bg-tertiary-container/20 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-tertiary">{dEngine.features[2].icon}</span>
                </div>
                <h3 className="font-headline-md text-[24px] text-primary mb-4">
                  {dEngine.features[2].title[lang]}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  {dEngine.features[2].description[lang]}
                </p>
              </div>
              <div className="flex-1 w-full h-[250px] bg-surface-variant rounded-lg relative overflow-hidden border border-outline-variant/30">
                <div className="absolute inset-0 flex items-end p-6 gap-2">
                  <div className="w-1/6 bg-secondary-container/40 h-[30%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-secondary-container/60 h-[50%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-secondary-container/80 h-[45%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-primary/40 h-[70%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-primary/70 h-[85%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-primary h-[100%] rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action / Contact Form */}
      <section className="py-16 md:py-24 px-4 sm:px-margin-mobile md:px-margin-desktop bg-surface relative">
        <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-8 md:p-12 rounded-2xl ambient-shadow w-full">
          <div className="text-center mb-10">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">
              {dForm.title[lang]}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {dForm.subtitle[lang]}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="name">
                  {dForm.fields.name.label[lang]}
                </label>
                <input 
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 transition-colors font-body-md text-on-surface placeholder:text-outline" 
                  id="name" 
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder={dForm.fields.name.placeholder[lang]} 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="organization">
                  {dForm.fields.organization.label[lang]}
                </label>
                <input 
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 transition-colors font-body-md text-on-surface placeholder:text-outline" 
                  id="organization" 
                  type="text"
                  value={formState.organization}
                  onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                  placeholder={dForm.fields.organization.placeholder[lang]} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">
                {dForm.fields.email.label[lang]}
              </label>
              <input 
                className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 transition-colors font-body-md text-on-surface placeholder:text-outline" 
                id="email" 
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder={dForm.fields.email.placeholder[lang]} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="message">
                {dForm.fields.message.label[lang]}
              </label>
              <textarea 
                className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 transition-colors font-body-md text-on-surface placeholder:text-outline resize-none" 
                id="message" 
                rows="4"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                placeholder={dForm.fields.message.placeholder[lang]}
              ></textarea>
            </div>

            {status === "success" && (
              <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm font-label-md">
                {dForm.messages.success[lang]}
              </div>
            )}

            {status === "error" && (
              <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-label-md">
                {dForm.messages.error[lang]}
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row justify-end">
              <button 
                type="submit"
                disabled={status === "submitting"}
                className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-full hover:bg-primary-container transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
              >
                <span>{status === "submitting" ? dForm.messages.submitting[lang] : dForm.messages.submitButton[lang]}</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
