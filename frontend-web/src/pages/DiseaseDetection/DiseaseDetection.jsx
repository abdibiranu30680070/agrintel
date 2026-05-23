import React, { useState } from "react";
import axios from "axios";
import diseaseData from "../../data/diseaseData.json";

export default function DiseaseDetection({ lang }) {
  const data = diseaseData;
  const [scanState, setScanState] = useState("idle"); // idle, scanning, result
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [liveResult, setLiveResult] = useState(null);

  const startScan = async (cropName) => {
    setSelectedCrop(cropName);
    setScanState("scanning");
    
    try {
      const response = await axios.post("/api/detect-disease");
      if (response.data) {
        setLiveResult({
          status: response.data.status,
          disease: response.data.disease,
          confidence: `${Math.round(response.data.confidence * 100)}%`,
          immediate: response.data.advice,
          organic: "Apply organic compost and clean farming tools regularly to minimize propagation.",
          chemical: "If symptoms persist, use standard copper-based fungicide spray."
        });
      }
    } catch (error) {
      console.warn("Failed to get live diagnosis, using high-quality local fallback", error);
      setLiveResult(null);
    } finally {
      setTimeout(() => {
        setScanState("result");
      }, 1500);
    }
  };

  const resetScan = () => {
    setScanState("idle");
    setSelectedCrop(null);
    setLiveResult(null);
  };

  const getDiagnosis = () => {
    if (liveResult) {
      return {
        status: liveResult.status === "Healthy" ? "HEALTHY" : "ISSUE DETECTED",
        confidence: liveResult.confidence,
        disease: {
          en: liveResult.disease === "None" ? "No disease detected" : liveResult.disease,
          am: liveResult.disease === "None" ? "ምንም ዓይነት በሽታ አልተገኘም" : (liveResult.disease === "Wheat Rust" ? "የስንዴ ዝገት በሽታ" : liveResult.disease)
        },
        immediate: {
          en: liveResult.immediate,
          am: "ተገቢውን ፀረ-ፈንገስ መድኃኒት ይተግብሩ እና የእርጥበት መጠንን ይቆጣጠሩ።"
        },
        organic: {
          en: liveResult.organic,
          am: "ኦርጋኒክ ማዳበሪያዎችን ይጠቀሙ እና የበሽታ መከላከልን ያጠናክሩ።"
        },
        chemical: {
          en: liveResult.chemical,
          am: "የፈንገስ በሽታው ከቀጠለ የኬሚካል ፀረ-ተባይ መድኃኒቶችን በደህንነት መመሪያው መሠረት ይረጩ።"
        }
      };
    }

    switch (selectedCrop) {
      case "wheat":
        return data.diseases.wheat;
      case "coffee":
        return data.diseases.coffee;
      default:
        return data.diseases.default;
    }
  };

  return (
    <div className="relative w-full">
      <main className="max-w-container-max mx-auto px-4 sm:px-margin-mobile md:px-margin-desktop py-12 md:py-16 space-y-16 md:space-y-20">
        {/* Upload & Diagnostics Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-gutter items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm">
              <span className="material-symbols-outlined text-[16px]">shutter_speed</span>
              <span>{data.hero.badge}</span>
            </div>
            <h1 className="font-display-lg text-4xl text-primary leading-tight">
              {data.hero.title[lang]}
            </h1>
            <p className="font-body-lg text-on-surface-variant text-base">
              {data.hero.description[lang]}
            </p>
            <div className="flex items-center gap-4 py-2">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnm3vyG7iMqJ38403nJz-m85VwAgY9GFDbWQK1JSFkJUxXYVB6Gc6F9gknUV9j2B96TO97VoVJjNxyMcbjE_hjKoJm8uduIJoc6iglGP0FAGzQTMXCdeNOnED_qWN8RGOElMZPkP8oDhH1BGDr1-ky9uGtynUaQ7j6PlVhSKMT4isnwN11y_ITmwHKrx4KPA_u3nlYIU3ayCHFC8vCwrREvuC-uCALBdk6jVuS4V9XDfW9-pJ8opfgVss9-zgx8BcDXT2-ZFTNmhei"
                  alt="farmer"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEgrc-WYQts1hQu2yfsCDMLklYKGInl9vfDnRSYCDV82J_eCPu9yuF3AbO32TBoCe6d_zjJIkayn68ZiEBCGQ5ZpSipoSD2stRbFZZ5Uo5a5ZfW4N6O7mKC614GCR4wsKq29UpR7yqMgOvyl0oPW_FEQXT_SvpLIfLJGC61R7BQiNFNd1EZlAsW25Wh_GytyWgdA-nWRb3bgZy_468DNg1jLd2EvF9D-GNIrI2uiJBNUiMd5_FxWAmeLGxXRH1Y8dTO5lyvjlPrhPI"
                  alt="agronomist"
                />
              </div>
              <p className="font-label-sm text-outline text-xs">
                {data.hero.trustedBy[lang]}
              </p>
            </div>
          </div>

          {/* Interactive Upload/Scanning Panel */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
              {scanState === "idle" && (
                <div className="border-2 border-dashed border-outline-variant/60 rounded-xl flex flex-col items-center justify-center py-16 px-6 text-center hover:bg-primary/5 transition-all">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
                  </div>
                  <h3 className="font-display-lg text-[22px] text-primary mb-2">
                    {data.scanArea.idle.title[lang]}
                  </h3>
                  <p className="font-body-md text-on-surface-variant/80 text-sm max-w-sm mb-6">
                    {data.scanArea.idle.subtitle[lang]}
                  </p>
                  
                  {/* Preset triggers for simulation */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => startScan("wheat")}
                      className="px-4 py-2 bg-surface border border-outline-variant text-primary rounded-lg text-xs font-label-md hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">grass</span>
                      <span>{data.scanArea.idle.buttons.wheat}</span>
                    </button>
                    <button
                      onClick={() => startScan("coffee")}
                      className="px-4 py-2 bg-surface border border-outline-variant text-primary rounded-lg text-xs font-label-md hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">eco</span>
                      <span>{data.scanArea.idle.buttons.coffee}</span>
                    </button>
                  </div>
                </div>
              )}

              {scanState === "scanning" && (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center relative min-h-[300px]">
                  {/* Animated scanner green beam line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-bounce shadow-[0_0_8px_#22c55e]" />

                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-green-600 text-3xl">document_scanner</span>
                  </div>
                  <h3 className="font-display-lg text-[22px] text-primary mb-2 animate-pulse">
                    {data.scanArea.scanning.title[lang]}
                  </h3>
                  <p className="font-body-md text-on-surface-variant text-sm max-w-xs">
                    {data.scanArea.scanning.subtitle[lang]}
                  </p>
                </div>
              )}

              {scanState === "result" && (
                <div className="space-y-6 min-h-[300px]">
                  <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4">
                    <div>
                      <span className="font-label-sm text-outline text-xs block mb-1">{data.scanArea.result.reportLabel}</span>
                      <h3 className="font-display-lg text-2xl text-primary">{getDiagnosis().disease[lang]}</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold uppercase">
                      {getDiagnosis().status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                      <h5 className="font-label-md text-primary text-xs mb-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">verified</span>
                        <span>{data.scanArea.result.confidenceLabel}</span>
                      </h5>
                      <span className="text-2xl font-bold text-primary">{getDiagnosis().confidence}</span>
                    </div>

                    <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                      <h5 className="font-label-md text-primary text-xs mb-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">report</span>
                        <span>{data.scanArea.result.priorityLabel}</span>
                      </h5>
                      <p className="font-label-sm text-on-surface-variant text-[11px] leading-normal">
                        {getDiagnosis().immediate[lang]}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-label-md text-primary text-sm font-semibold">{data.scanArea.result.treatmentTitle}</h4>
                    <div className="p-4 bg-green-50/50 border-l-4 border-green-600 rounded-r-xl">
                      <h5 className="font-label-md text-green-800 text-xs mb-1">{data.scanArea.result.organicTitle}</h5>
                      <p className="font-body-md text-on-surface-variant text-xs leading-relaxed">
                        {getDiagnosis().organic[lang]}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary-container/10 border-l-4 border-secondary rounded-r-xl">
                      <h5 className="font-label-md text-secondary text-xs mb-1">{data.scanArea.result.chemicalTitle}</h5>
                      <p className="font-body-md text-on-surface-variant text-xs leading-relaxed">
                        {getDiagnosis().chemical[lang]}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      onClick={resetScan}
                      className="px-6 py-2.5 rounded-lg border border-outline-variant text-primary font-label-md hover:bg-surface transition-all text-xs w-full sm:w-auto"
                    >
                      {data.scanArea.result.buttons.scanAnother[lang]}
                    </button>
                    <button
                      onClick={() => alert("Report printed / saved.")}
                      className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-md transition-all text-xs flex items-center justify-center gap-1.5 shadow-md w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>{data.scanArea.result.buttons.save[lang]}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Workflow steps */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display-lg text-3xl text-primary">{data.workflow.title}</h2>
            <p className="font-body-md text-on-surface-variant max-w-xl mx-auto text-sm">
              {data.workflow.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {data.workflow.steps.map((step, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-xl space-y-4 text-center hover:scale-[1.02] transition-transform">
                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${
                  idx === 0 ? "bg-surface-container-high text-primary" :
                  idx === 1 ? "bg-primary-container text-inverse-primary" :
                  "bg-secondary-container/20 text-secondary"
                }`}>
                  <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                </div>
                <h4 className="font-display-lg text-lg text-primary">{step.title}</h4>
                <p className="font-body-md text-on-surface-variant text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent field scans feeds */}
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
            <div>
              <h2 className="font-display-lg text-2xl text-primary">{data.recentScans.title}</h2>
              <p className="font-body-md text-on-surface-variant text-xs">{data.recentScans.subtitle}</p>
            </div>
            <button className="text-primary font-label-md text-sm flex items-center gap-1 hover:underline">
              <span>{data.recentScans.viewAll}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {data.recentScans.items.map((item, idx) => (
              <div key={idx} className="glass-panel rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="h-36 relative">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.crop}
                  />
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    item.statusColor === 'error' ? 'bg-white/95 backdrop-blur-sm text-error' :
                    item.statusColor === 'secondary' ? 'bg-white/95 backdrop-blur-sm text-secondary' :
                    item.statusColor === 'primary' ? 'bg-primary text-white' :
                    'bg-secondary-container text-white'
                  }`}>
                    {item.status}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-label-md text-primary text-xs mb-0.5">{item.crop}</h5>
                    <p className="text-[10px] text-outline mb-2">Scan ID: {item.scanId}</p>
                    <p className={`font-display-lg text-sm font-semibold mb-3 ${
                      item.findingColor === 'error' ? 'text-error' :
                      item.findingColor === 'secondary' ? 'text-secondary' :
                      item.findingColor === 'primary' ? 'text-primary' :
                      'text-secondary-fixed-dim'
                    }`}>{item.finding}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/80 border-t border-outline-variant/20 pt-2">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
