import React, { useState, useEffect } from "react";
import axios from "axios";
import marketplaceData from "../../data/marketplaceData.json";

export default function Marketplace({ lang }) {
  const data = marketplaceData;
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [investAmt, setInvestAmt] = useState("100");
  const [investSuccess, setInvestSuccess] = useState(false);

  // Live market search state
  const [marketSearch, setMarketSearch] = useState("");
  const [marketCategory, setMarketCategory] = useState("All");
  const [marketLocation, setMarketLocation] = useState("All");
  
  // Price predictions state
  const [pricePredictions, setPricePredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(true);

  // Fetch price predictions from AI service
  useEffect(() => {
    const fetchPricePredictions = async () => {
      try {
        const response = await axios.get('/api/price-predictions-all');
        setPricePredictions(response.data.predictions || []);
      } catch (error) {
        console.error('Error fetching price predictions:', error);
        // Fallback to hardcoded data if API fails
        setPricePredictions([
          { name: "Teff", current: "Birr 4,150", predicted: "Birr 4,320", change: "+4.1%", trend: "up", confidence: "87%" },
          { name: "Coffee", current: "$5.25/kg", predicted: "$5.45/kg", change: "+3.8%", trend: "up", confidence: "92%" },
          { name: "Maize", current: "Birr 2,800", predicted: "Birr 2,650", change: "-5.4%", trend: "down", confidence: "79%" },
          { name: "Sesame", current: "$1,850/MT", predicted: "$1,920/MT", change: "+3.8%", trend: "up", confidence: "84%" }
        ]);
      } finally {
        setLoadingPredictions(false);
      }
    };

    fetchPricePredictions();
  }, []);

  const filteredMarketRows = data.liveMarket.table.rows.filter(row => {
    const textMatch = row.name[lang].toLowerCase().includes(marketSearch.toLowerCase());
    const categoryMatch = marketCategory === "All" || row.category.includes(marketCategory);
    const locationMatch = marketLocation === "All" || row.location.includes(marketLocation);
    return textMatch && categoryMatch && locationMatch;
  });

  // Use state for opportunities to allow local simulation of funding
  const [opportunities, setOpportunities] = useState(data.opportunities);

  // Filter opportunities list
  const filteredList = opportunities.filter(item => {
    const textMatch = item.title[lang]
      .toLowerCase()
      .includes(search.toLowerCase());
    const regionMatch = regionFilter === "All" || item.region.en.includes(regionFilter) || item.region.am.includes(regionFilter);
    const riskMatch = riskFilter === "All" || item.riskKey === riskFilter;
    return textMatch && regionMatch && riskMatch;
  });

  const handleOpenInvestModal = (project) => {
    setSelectedProject(project);
    setInvestSuccess(false);
  };

  const handleConfirmInvestment = (e) => {
    e.preventDefault();
    if (!investAmt || Number(investAmt) <= 0) return;
    setInvestSuccess(true);
    setTimeout(() => {
      // Simulate funded increment locally
      setOpportunities(prev => prev.map(opp => {
        if (opp.id === selectedProject.id) {
          return {
            ...opp,
            fundedPercent: Math.min(100, opp.fundedPercent + Math.round((Number(investAmt) / 1000)))
          };
        }
        return opp;
      }));
      setSelectedProject(null);
    }, 2000);
  };

  return (
    <div className="relative w-full bg-[#F8F9FA] min-h-screen pb-20">
      {/* Hero section */}
      <section className="relative pt-8 md:pt-12 pb-12 md:pb-16 px-4 sm:px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundColor: "#f8f9fa",
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }} />
        
        <div className="relative z-10 max-w-container-max mx-auto space-y-8">
          <div className="max-w-2xl space-y-4">
            <h1 className="font-display-lg text-[40px] text-primary leading-tight font-bold tracking-tight">
              {data.hero.title[lang]}
            </h1>
            <p className="font-body-md text-on-surface-variant text-[15px] leading-relaxed">
              {data.hero.subtitle[lang]}
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center w-full max-w-4xl">
            <div className="relative w-full flex-grow bg-white border border-outline-variant/40 rounded-lg shadow-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-10 py-3 rounded-lg font-body-md text-[14px] outline-none text-on-surface"
                placeholder={data.filters.searchPlaceholder[lang]}
                type="text"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <div className="relative bg-white border border-outline-variant/40 rounded-lg shadow-sm w-full sm:w-auto">
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="bg-transparent pl-4 pr-10 py-3 font-body-md text-[14px] text-on-surface focus:outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="All">{data.filters.allRegions[lang]}</option>
                  <option value="Oromia">Oromia</option>
                  <option value="Sidama">Sidama</option>
                  <option value="Amhara">Amhara</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
              <div className="relative bg-white border border-outline-variant/40 rounded-lg shadow-sm w-full sm:w-auto">
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="bg-transparent pl-4 pr-10 py-3 font-body-md text-[14px] text-on-surface focus:outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="All">{data.filters.allRisks[lang]}</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
              <button className="bg-[#9D5215] hover:bg-[#854511] text-white px-8 py-3 rounded-lg font-label-md transition-colors shadow-sm text-[14px] w-full sm:w-auto">
                {data.filters.filterButton[lang]}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <main className="max-w-container-max mx-auto px-4 sm:px-margin-mobile md:px-margin-desktop py-6 md:py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-end pb-2">
            <div>
              <h2 className="font-display-lg text-[22px] text-primary font-bold">
                {data.grid.title[lang]}
              </h2>
              <p className="font-body-md text-on-surface-variant text-[13px] mt-1">
                {data.grid.subtitle[lang]}
              </p>
            </div>
            <button className="text-[#9D5215] font-label-md text-[13px] flex items-center gap-1 hover:underline">
              <span>{data.grid.viewAll[lang]}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenInvestModal(item)}
                className="bg-white rounded-[16px] overflow-hidden flex flex-col group cursor-pointer border border-outline-variant/30 hover:shadow-md transition-all duration-300"
              >
                <div className="h-[180px] relative overflow-hidden p-2">
                  <div className="w-full h-full relative rounded-[12px] overflow-hidden">
                    <img
                      alt={item.title[lang]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={item.img}
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-[6px] font-label-sm text-[11px] text-white shadow-sm backdrop-blur-sm ${
                      item.riskKey === "low" ? "bg-[#012d1d]/80" : "bg-[#9D5215]/80"
                    }`}>
                      {item.risk[lang]}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px]">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span>{item.region[lang]}</span>
                    </div>
                    <h3 className="font-display-lg text-[18px] text-primary font-bold leading-tight">
                      {item.title[lang]}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-body-sm text-outline text-[11px] mb-1">Target</p>
                      <p className="font-label-md text-on-surface font-bold text-[15px]">{item.target}</p>
                    </div>
                    <div>
                      <p className="font-body-sm text-outline text-[11px] mb-1">Expected ROI</p>
                      <p className="font-label-md text-[#9D5215] font-bold text-[15px]">{item.roi}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-label-sm text-[11px] mb-2">
                      <span className="text-on-surface">Funded</span>
                      <span className="text-on-surface font-bold">{item.fundedPercent}%</span>
                    </div>
                    <div className="w-full bg-[#E8EAE9] rounded-full h-1.5">
                      <div
                        className="bg-primary rounded-full h-1.5 transition-all duration-500"
                        style={{ width: `${item.fundedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredList.length === 0 && (
              <div className="col-span-full py-16 text-center space-y-4">
                <span className="material-symbols-outlined text-5xl text-outline-variant">info</span>
                <p className="font-body-lg text-on-surface-variant">
                  {data.grid.noMatch[lang]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Market Price Prediction Box */}
        <div className="mt-20 space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-white">trending_up</span>
                </div>
                <div>
                  <h2 className="font-display-lg text-2xl text-white font-bold">
                    AI Price Predictions
                  </h2>
                  <p className="text-emerald-100 text-sm">
                    Next 30-day forecast for major crops
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loadingPredictions ? (
                  <div className="col-span-full text-center text-white py-8">
                    <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
                    <p>Loading AI predictions...</p>
                  </div>
                ) : (
                  pricePredictions.map((crop, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold text-lg">{crop.name}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${crop.trend === 'up' ? 'bg-green-400/30 text-green-200' : 'bg-red-400/30 text-red-200'}`}>
                          {crop.change}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-200">Current</span>
                          <span className="text-white font-medium">{crop.current}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-200">Predicted</span>
                          <span className="text-white font-bold">{crop.predicted}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-2 border-t border-white/10">
                          <span className="text-emerald-300">Confidence</span>
                          <span className="text-emerald-100 font-medium">{crop.confidence}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-emerald-100 text-sm">
                <span className="material-symbols-outlined text-base">info</span>
                <span>Predictions based on historical data, weather patterns, and market trends</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Produce Market Section */}
        <div className="mt-20 space-y-8 bg-white/50 p-8 rounded-[24px] border border-outline-variant/20 shadow-sm">
          <div className="text-center space-y-2">
            <h2 className="font-display-lg text-[28px] text-primary font-bold">
              {data.liveMarket.title[lang]}
            </h2>
            <p className="font-body-md text-on-surface-variant text-[14px]">
              {data.liveMarket.subtitle[lang]}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center w-full max-w-4xl mx-auto">
            <div className="relative w-full flex-grow bg-white border border-outline-variant/40 rounded-lg shadow-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                className="w-full bg-transparent px-10 py-3 rounded-lg font-body-md text-[14px] outline-none text-on-surface"
                placeholder={data.liveMarket.filters.searchPlaceholder[lang]}
                type="text"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <div className="relative bg-white border border-outline-variant/40 rounded-lg shadow-sm w-full sm:w-auto">
                <select
                  value={marketCategory}
                  onChange={(e) => setMarketCategory(e.target.value)}
                  className="bg-transparent pl-4 pr-10 py-3 font-body-md text-[14px] text-on-surface focus:outline-none appearance-none cursor-pointer w-full min-w-[140px]"
                >
                  <option value="All">{data.liveMarket.filters.category[lang]}</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Export">Export</option>
                  <option value="Local">Local</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
              <div className="relative bg-white border border-outline-variant/40 rounded-lg shadow-sm w-full sm:w-auto">
                <select
                  value={marketLocation}
                  onChange={(e) => setMarketLocation(e.target.value)}
                  className="bg-transparent pl-4 pr-10 py-3 font-body-md text-[14px] text-on-surface focus:outline-none appearance-none cursor-pointer w-full min-w-[140px]"
                >
                  <option value="All">{data.liveMarket.filters.location[lang]}</option>
                  <option value="Adama">Adama</option>
                  <option value="Bishoftu">Bishoftu</option>
                  <option value="Hawassa">Hawassa</option>
                  <option value="Humera">Humera</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-[11px] text-on-surface-variant font-bold tracking-wider">
                    <th className="px-6 py-4 uppercase">{data.liveMarket.table.headers.produceName[lang]}</th>
                    <th className="px-6 py-4 uppercase">{data.liveMarket.table.headers.categoryGrade[lang]}</th>
                    <th className="px-6 py-4 uppercase">{data.liveMarket.table.headers.location[lang]}</th>
                    <th className="px-6 py-4 uppercase">{data.liveMarket.table.headers.currentPrice[lang]}</th>
                    <th className="px-6 py-4 uppercase">{data.liveMarket.table.headers.trend[lang]}</th>
                    <th className="px-6 py-4 uppercase text-right">{data.liveMarket.table.headers.action[lang]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredMarketRows.map((row) => (
                    <tr key={row.id} className="hover:bg-surface/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-variant/50 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">{row.icon}</span>
                          </div>
                          <span className="font-label-md text-on-surface text-[14px] font-bold">{row.name[lang]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-surface-variant/40 rounded-md text-[11px] font-semibold text-on-surface-variant">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-body-md text-on-surface-variant text-[13px]">{row.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-label-md text-on-surface text-[14px] font-bold">{row.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 font-label-md text-[13px] font-bold ${row.trendUp ? 'text-primary' : 'text-error'}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {row.trendUp ? 'trending_up' : 'trending_down'}
                          </span>
                          <span>{row.trend}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="bg-[#012d1d] hover:bg-[#02402a] text-white px-4 py-2 rounded-lg font-label-md text-[12px] transition-colors opacity-90 group-hover:opacity-100 shadow-sm">
                          {data.liveMarket.table.contactButton[lang]}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredMarketRows.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant font-body-md">
                        {lang === "en" ? "No products match your search." : "ምንም የተገኘ ምርት የለም።"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Investment & Details Calculator Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-primary text-white">
              <h3 className="font-display-lg text-lg font-bold">
                {data.modal.header[lang]}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-white/80 hover:text-white flex items-center justify-center p-1 rounded-full hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex gap-4 items-start pb-4 border-b border-outline-variant/30">
                <img
                  className="w-24 h-24 rounded-xl object-cover"
                  src={selectedProject.img}
                  alt={selectedProject.title[lang]}
                />
                <div>
                  <h4 className="font-display-lg text-base text-primary font-bold">
                    {selectedProject.title[lang]}
                  </h4>
                  <p className="text-xs text-outline flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{selectedProject.region[lang]}</span>
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-bold uppercase">
                      {data.modal.labels.ndvi[lang]}: {selectedProject.ndvi}
                    </span>
                    <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] rounded font-bold uppercase">
                      {data.modal.labels.moisture[lang]}: {selectedProject.moisture}
                    </span>
                  </div>
                </div>
              </div>

              {!investSuccess ? (
                <form onSubmit={handleConfirmInvestment} className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-label-md text-xs text-on-surface-variant block">
                      {data.modal.labels.investmentAmount[lang]}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">$</span>
                      <input
                        type="number"
                        value={investAmt}
                        onChange={(e) => setInvestAmt(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary rounded-xl pl-8 pr-4 py-3 font-body-md text-sm outline-none text-on-surface"
                        min="10"
                        step="10"
                      />
                    </div>
                    <span className="text-[10px] text-outline block">
                      {data.modal.labels.investmentAmountNote[lang]}
                    </span>
                  </div>

                  {/* Calculator preview */}
                  <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 space-y-2.5 text-xs">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>{data.modal.labels.expectedReturn[lang]} ({selectedProject.roi.split(" ")[0]})</span>
                      <span className="font-semibold text-primary">
                        ${((Number(investAmt) || 0) * (parseFloat(selectedProject.roi) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>{data.modal.labels.fee[lang]}</span>
                      <span>${((Number(investAmt) || 0) * 0.012).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-on-surface font-bold border-t border-outline-variant/20 pt-2 text-sm">
                      <span>{data.modal.labels.totalPayout[lang]}</span>
                      <span className="text-secondary">
                        ${((Number(investAmt) || 0) * (1 + parseFloat(selectedProject.roi) / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="px-5 py-2.5 rounded-lg border border-outline-variant text-primary font-label-md text-xs hover:bg-surface transition-all"
                    >
                      {data.modal.buttons.cancel[lang]}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-md text-xs transition-all shadow-md"
                    >
                      {data.modal.buttons.confirm[lang]}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                  </div>
                  <h4 className="font-display-lg text-lg text-primary font-bold">{data.modal.success.title[lang]}</h4>
                  <p className="font-body-md text-on-surface-variant text-sm max-w-sm mx-auto">
                    {data.modal.success.message[lang]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
