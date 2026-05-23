import React from "react";
import pricingData from "../../data/pricingData.json";

export default function Pricing({ lang }) {
  const data = pricingData;

  const getThemeClasses = (theme) => {
    switch (theme) {
      case "golden":
        return {
          card: "bg-gradient-to-br from-[#1a1400] to-[#2b2200] border-[#d4af37]/30 text-white shadow-xl shadow-[#d4af37]/10 scale-105 z-10",
          header: "text-[#d4af37]",
          price: "text-[#fcf0b3]",
          button: "bg-gradient-to-r from-[#d4af37] to-[#aa8920] text-black hover:from-[#fcf0b3] hover:to-[#d4af37]",
          check: "text-[#d4af37]",
          badge: "bg-[#d4af37] text-black"
        };
      case "prime":
        return {
          card: "bg-white border-primary/20 shadow-lg relative",
          header: "text-primary",
          price: "text-on-surface",
          button: "bg-primary text-white hover:bg-primary-container hover:text-on-primary-container",
          check: "text-primary",
          badge: "bg-primary text-white"
        };
      case "basic":
      default:
        return {
          card: "bg-surface-container-lowest border-outline-variant/30",
          header: "text-on-surface",
          price: "text-on-surface",
          button: "border border-outline-variant hover:bg-surface text-on-surface",
          check: "text-outline",
          badge: ""
        };
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] pb-24">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-20 pb-12 md:pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundColor: "#f8f9fa",
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }} />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl text-primary font-bold">
            {data.header.title[lang]}
          </h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto">
            {data.header.subtitle[lang]}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center justify-center mt-4">
          {data.tiers.map((tier) => {
            const theme = getThemeClasses(tier.theme);
            
            return (
              <div 
                key={tier.id}
                className={`flex-1 w-full max-w-[420px] rounded-3xl p-8 border transition-all duration-300 ${theme.card}`}
              >
                {tier.popular && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-label-md text-xs font-bold shadow-md ${theme.badge}`}>
                    {tier.popular[lang]}
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`font-display-lg text-xl font-bold mb-2 ${theme.header}`}>
                      {tier.name[lang]}
                    </h3>
                    <p className="font-body-sm text-sm opacity-80 min-h-[40px]">
                      {tier.description[lang]}
                    </p>
                  </div>
                  
                  <div className="py-6 border-y border-outline-variant/20">
                    <div className="flex items-end gap-2">
                      <span className={`font-display-lg text-4xl font-bold ${theme.price}`}>
                        {tier.price[lang]}
                      </span>
                      <span className="font-label-md opacity-70 mb-1">
                        / {tier.period[lang]}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 min-h-[220px]">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className={`material-symbols-outlined text-[20px] ${theme.check}`}>
                          check_circle
                        </span>
                        <span className="font-body-md text-sm opacity-90">
                          {feature[lang]}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3.5 rounded-xl font-label-md text-sm font-bold transition-all shadow-sm active:scale-95 ${theme.button}`}>
                    {tier.button[lang]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-20 md:mt-32 space-y-6 md:space-y-8">
        <h2 className="font-display-lg text-2xl text-center text-primary font-bold">
          {data.faq.title[lang]}
        </h2>
        <div className="space-y-4">
          {data.faq.questions.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
              <h4 className="font-label-md text-on-surface font-bold text-base mb-2">
                {item.q[lang]}
              </h4>
              <p className="font-body-md text-on-surface-variant text-sm">
                {item.a[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
