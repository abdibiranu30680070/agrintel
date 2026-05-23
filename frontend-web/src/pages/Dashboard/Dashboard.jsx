import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import dashboardData from "../../data/dashboardData.json";

export default function Dashboard({ lang }) {
  const data = dashboardData;
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: data.widgets.assistant.messages.initial[lang],
      action: true
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [weather, setWeather] = useState({
    temp: 22,
    condition: data.widgets.weather.condition[lang],
    humidity: 68,
    precipitationChance: "85%",
    feelsLike: 22,
    high: 27,
    low: 13,
    uvIndex: 11,
    hourlyForecast: [],
    yesterday: { high: 26, low: 14 }
  });
  const [selectedRegion, setSelectedRegion] = useState("Legahar");
  const [recommendation, setRecommendation] = useState({
    primaryCrop: "Teff",
    confidence: "89%",
    reasoning: lang === "en" ? "Based on Oromia regional data and volcanic/black soil analysis." : "በኦሮሚያ ክልላዊ መረጃ እና በጥቁር አፈር ትንተና ላይ በመመስረት።"
  });
  const [marketOverview, setMarketOverview] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("Teff");
  const [cropPrediction, setCropPrediction] = useState(null);
  const [loadingMarket, setLoadingMarket] = useState(false);

  const regionOptions = [
    "Addis Ababa",
    "Legahar",
    "Oromia",
    "Amhara",
    "Tigray",
    "SNNPR",
    "Afar",
    "Somali",
    "Benishangul-Gumuz",
    "Gambela",
    "Harari",
    "Dire Dawa",
    "Southern"
  ];

  const fetchLiveData = async (region) => {
    try {
      const weatherRes = await axios.get(`/api/weather?region=${encodeURIComponent(region)}`);
      if (weatherRes.data) {
        setWeather({
          temp: weatherRes.data.temp,
          condition: weatherRes.data.condition,
          humidity: weatherRes.data.humidity,
          precipitationChance: weatherRes.data.precipitationChance || "0%",
          feelsLike: weatherRes.data.feelsLike || weatherRes.data.temp,
          high: weatherRes.data.high || weatherRes.data.temp + 3,
          low: weatherRes.data.low || weatherRes.data.temp - 9,
          uvIndex: weatherRes.data.uvIndex || 8,
          hourlyForecast: weatherRes.data.hourlyForecast || [],
          yesterday: weatherRes.data.yesterday || { high: 26, low: 14 }
        });
      }
      const recRes = await axios.post("/api/recommend", {
        region,
        soil_type: "Black soil",
        land_size: 1.5,
        season: "Summer"
      });
      if (recRes.data && !recRes.data.error) {
        setRecommendation({
          primaryCrop: recRes.data.primary_crop,
          confidence: `${Math.round(recRes.data.confidence * 100)}%`,
          reasoning: recRes.data.reasoning
        });
        setSelectedCrop(recRes.data.primary_crop);
      }
    } catch (err) {
      console.warn("Failed to fetch data, using fallback", err);
    }
  };

  const fetchMarketData = async (region) => {
    setLoadingMarket(true);
    try {
      const overviewRes = await axios.get(`/api/market/overview?region=${encodeURIComponent(region)}`);
      if (overviewRes.data) {
        setMarketOverview(overviewRes.data);
      }
      if (selectedCrop) {
        const predictionRes = await axios.get(`/api/market/prediction/${encodeURIComponent(selectedCrop)}?region=${encodeURIComponent(region)}`);
        if (predictionRes.data) {
          setCropPrediction(predictionRes.data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch market data", err);
    } finally {
      setLoadingMarket(false);
    }
  };

  useEffect(() => {
    fetchLiveData(selectedRegion);
  }, [lang, selectedRegion]);

  useEffect(() => {
    fetchMarketData(selectedRegion);
  }, [selectedRegion, selectedCrop]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { sender: "user", text: userText }]);

    try {
      const response = await axios.post("/api/ask", { question: userText });
      if (response.data && response.data.answer) {
        setMessages(prev => [...prev, { sender: "ai", text: response.data.answer }]);
      } else {
        setMessages(prev => [...prev, { sender: "ai", text: "Error fetching answer." }]);
      }
    } catch (error) {
      console.error("Error in dashboard assistant:", error);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: lang === "en"
            ? "I'm having trouble connecting to the AI brain right now."
            : "በአሁኑ ጊዜ ከኤአይ አእምሮ ጋር ለመገናኘት እያልኩኝ ነው።"
        }
      ]);
    }
  };

  // Weather icon helper
  const getWeatherIcon = (condition) => {
    const c = (condition || "").toLowerCase();
    if (c.includes("cloud")) return "cloud";
    if (c.includes("rain")) return "rainy";
    if (c.includes("clear") || c.includes("fair") || c.includes("sunny")) return "wb_sunny";
    if (c.includes("night")) return "nights_stay";
    return "partly_cloudy_day";
  };

  const getHourlyIcon = (icon) => {
    if (icon === "cloudy") return "cloud";
    if (icon === "partly_sunny") return "partly_cloudy_day";
    return "wb_sunny";
  };

  // UV severity
  const getUvLabel = (uv) => {
    if (uv >= 11) return { text: "UV is extreme. Limit sun exposure if possible", color: "#dc2626" };
    if (uv >= 8) return { text: "UV is very high. Seek shade during midday", color: "#ea580c" };
    if (uv >= 6) return { text: "UV is high. Wear sunscreen", color: "#ca8a04" };
    return { text: "UV is moderate", color: "#16a34a" };
  };

  const uvInfo = getUvLabel(weather.uvIndex);

  return (
    <div className="relative w-full">
      <main className="page-container space-y-6 md:space-y-10">

        {/* Header section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/20 pb-4 md:pb-6">
          <div>
            <h1 className="font-display-lg text-3xl text-primary font-bold mb-1">
              {data.header.title[lang]}
            </h1>
            <p className="font-body-md text-on-surface-variant text-sm">
              {data.header.subtitle[lang]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-outline text-xs">{data.header.lastUpdated[lang]}</span>
            <button
              onClick={() => {
                fetchLiveData(selectedRegion);
              }}
              className="p-2.5 rounded-full bg-surface-container hover:bg-surface-variant transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-primary text-base">refresh</span>
            </button>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-gutter">

          {/* ===== WEATHER WIDGET (Screenshot Style) — Full 12 cols ===== */}
          <div className="weather-hero-card lg:col-span-12 sm:col-span-2 rounded-3xl overflow-hidden relative" style={{ minHeight: 520 }}>
            {/* Background gradient */}
            <div className="absolute inset-0 weather-gradient z-0" />

            {/* Top bar: location selector */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <select
                  id="regionSelect"
                  className="bg-transparent text-white font-bold text-lg border-none outline-none cursor-pointer appearance-none"
                  value={selectedRegion}
                  onChange={e => setSelectedRegion(e.target.value)}
                  style={{ WebkitAppearance: "none" }}
                >
                  {regionOptions.map(r => (
                    <option key={r} value={r} style={{ color: "#333" }}>{r}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-white/70 text-sm">expand_more</span>
              </div>
            </div>

            {/* Main temperature display */}
            <div className="relative z-10 px-6 pb-2">
              <div className="text-white" style={{ fontSize: "6rem", fontWeight: 200, lineHeight: 1 }}>
                {weather.temp}°
              </div>
              <div className="text-white text-2xl font-medium mt-1">{weather.condition}</div>
              <div className="text-white/80 text-sm mt-2">
                <span>↑ {weather.high}° / ↓ {weather.low}°</span>
              </div>
              <div className="text-white/70 text-sm">
                Feels like {weather.feelsLike}°
              </div>
              <p className="text-white/60 text-xs mt-3">
                {weather.condition === "Fair" || weather.condition === "Sunny"
                  ? `Partly cloudy. Highs ${weather.high - 1} to ${weather.high + 1}°C and lows ${weather.low - 1} to ${weather.low + 1}°C.`
                  : `${weather.condition}. Temperature around ${weather.temp}°C.`}
              </p>
            </div>

            {/* Hourly forecast strip */}
            {weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
              <div className="relative z-10 mx-4 mt-4 rounded-2xl px-4 py-4" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}>
                <div className="flex justify-between items-start">
                  {weather.hourlyForecast.map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 text-white text-xs">
                      <span className="text-white/70">{h.hour}</span>
                      <span className="material-symbols-outlined text-xl text-amber-200" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {getHourlyIcon(h.icon)}
                      </span>
                      <span className="font-bold text-sm">{h.temp}°</span>
                    </div>
                  ))}
                </div>
                {/* Temp curve line */}
                <div className="mt-2 mx-2 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, #fbbf24, #fbbf24 30%, #fbbf24 70%, #fbbf24)" }} />
                <div className="flex justify-between mt-2">
                  {weather.hourlyForecast.map((h, i) => (
                    <div key={i} className="flex flex-col items-center text-white/60 text-[10px]">
                      <span className="material-symbols-outlined text-xs">water_drop</span>
                      <span>{h.precChance}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UV + Protect Your Skin card */}
            <div className="relative z-10 mx-4 mt-3 rounded-2xl px-5 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}>
              <div>
                <div className="flex items-center gap-2 text-white text-xs mb-1">
                  <span className="material-symbols-outlined text-sm">wb_sunny</span>
                  <span className="font-semibold">Protect Your Skin</span>
                </div>
                <p className="text-white/70 text-xs max-w-[200px]">{uvInfo.text}</p>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-bold">{weather.uvIndex}</div>
                <div className="w-24 h-1.5 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.3)" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min(weather.uvIndex / 14 * 100, 100)}%`, background: "white" }} />
                </div>
              </div>
            </div>

            {/* Yesterday row */}
            <div className="relative z-10 mx-4 mt-3 mb-5 rounded-2xl px-5 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}>
              <span className="text-white font-medium text-sm">Yesterday</span>
              <span className="text-white text-sm">{weather.yesterday.high}° {weather.yesterday.low}°</span>
            </div>
          </div>

          {/* ===== Soil Health Widget (Span 4) ===== */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-label-md text-on-surface-variant text-xs">
                  {data.widgets.soilHealth.title[lang]}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="font-display-lg text-2xl text-primary font-bold">{data.widgets.soilHealth.status[lang]}</p>
                  <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    {data.widgets.soilHealth.badge[lang]}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary-fixed/50 rounded-xl text-primary">
                <span className="material-symbols-outlined text-3xl">compost</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20 shadow-sm">
                <p className="font-label-sm text-outline text-[11px] mb-1">{data.widgets.soilHealth.nitrogen.label}</p>
                <p className="font-label-md text-primary text-xs font-bold">{data.widgets.soilHealth.nitrogen.value}</p>
                <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2">
                  <div className="bg-secondary w-3/4 h-1.5 rounded-full"></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20 shadow-sm">
                <p className="font-label-sm text-outline text-[11px] mb-1">{data.widgets.soilHealth.ph.label}</p>
                <p className="font-label-md text-primary text-xs font-bold">{data.widgets.soilHealth.ph.value}</p>
                <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2">
                  <div className="bg-primary w-5/6 h-1.5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Crop Yield Prediction Widget (Span 4) ===== */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-transparent pointer-events-none" />
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                <h3 className="font-label-md text-on-surface-variant text-xs">
                  {lang === "en" ? `Est. Yield (${recommendation.primaryCrop})` : `${recommendation.primaryCrop} ምርት ትንበያ`}
                </h3>
                <p className="font-display-lg text-2xl text-primary font-bold mt-1">{recommendation.primaryCrop === "Teff" ? "2.4 Tons/Ha" : "3.1 Tons/Ha"}</p>
              </div>
              <div className="p-3 bg-tertiary-fixed/50 rounded-xl text-tertiary">
                <span className="material-symbols-outlined text-3xl">trending_up</span>
              </div>
            </div>
            <div className="relative z-10 space-y-3">
              <p className="font-body-md text-on-surface-variant text-xs leading-normal">
                {recommendation.reasoning}
              </p>
              <button
                onClick={() => alert(`Yield prediction model loaded with confidence: ${recommendation.confidence}`)}
                className="w-full border border-primary text-primary font-label-md text-xs py-2 rounded-lg hover:bg-primary-fixed/10 transition-colors"
              >
                {data.widgets.yieldPrediction.button[lang]} ({recommendation.confidence})
              </button>
            </div>
          </div>

          {/* ===== Quick Weather Summary Card (Span 4) ===== */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-label-md text-on-surface-variant text-xs">
                  {data.widgets.weather.title[lang]}
                </h3>
                <p className="font-display-lg text-2xl text-primary font-bold mt-1">
                  {weather.temp}°C — {weather.condition}
                </p>
              </div>
              <div className="p-3 bg-secondary-fixed/50 rounded-xl text-secondary">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {getWeatherIcon(weather.condition)}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 text-xs">
                <span className="font-body-md text-on-surface-variant">{data.widgets.weather.precipitationChanceLabel[lang]}</span>
                <span className="font-label-md text-primary font-semibold">{weather.precipitationChance}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 text-xs">
                <span className="font-body-md text-on-surface-variant">{data.widgets.weather.temperatureLabel[lang]}</span>
                <span className="font-label-md text-primary font-semibold">{weather.temp}°C</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-body-md text-on-surface-variant">{data.widgets.weather.humidityLabel[lang]}</span>
                <span className="font-label-md text-primary font-semibold">{weather.humidity}%</span>
              </div>
            </div>
          </div>

          {/* ===== AI Advice Assistant Section (Span 8) ===== */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-8 sm:col-span-2 flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/30 pb-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <h3 className="font-display-lg text-lg text-primary">{data.widgets.assistant.title}</h3>
                <p className="font-label-sm text-xs text-on-surface-variant">{data.widgets.assistant.subtitle[lang]}</p>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                    msg.sender === "user" ? "bg-surface-variant text-on-surface" : "bg-primary text-white"
                  }`}>
                    <span className="material-symbols-outlined text-base">
                      {msg.sender === "user" ? "person" : "smart_toy"}
                    </span>
                  </div>
                  <div className={`p-3.5 rounded-xl max-w-[85%] text-xs md:text-sm leading-relaxed border ${
                    msg.sender === "user"
                      ? "bg-primary text-white border-transparent rounded-tr-sm"
                      : "bg-surface-container-lowest border-outline-variant/30 text-on-surface rounded-tl-sm shadow-sm"
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.action && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => alert("Irrigation Scheduled successfully.")}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-md font-label-sm text-xs hover:bg-primary/20 transition-colors"
                        >
                          {data.widgets.assistant.buttons.schedule[lang]}
                        </button>
                        <button className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-md font-label-sm text-xs hover:bg-surface-variant transition-colors">
                          {data.widgets.assistant.buttons.dismiss[lang]}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-outline-variant/30 flex gap-2 relative">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow text-on-surface"
                placeholder={data.widgets.assistant.placeholder[lang]}
                type="text"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary-fixed/20 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </form>
          </div>

          {/* ===== Soil Moisture Chart (Span 4) ===== */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-label-md text-on-surface-variant text-xs font-semibold">
                  {data.widgets.chart.title[lang]}
                </h3>
                <button className="text-outline hover:text-primary">
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>
              </div>
              <p className="text-[11px] text-outline mb-2">
                {data.widgets.chart.subtitle[lang]}
              </p>
            </div>

            {/* Area chart */}
            <div className="flex-grow w-full h-48 bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-2 relative overflow-hidden flex flex-col justify-end">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#012d1d" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#012d1d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#717973" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#717973" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="#012d1d"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMoisture)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[10px] text-outline mt-3">
              <span>{data.widgets.chart.footer.health[lang]}</span>
              <span className="text-primary font-bold">{data.widgets.chart.footer.today[lang]}</span>
            </div>
          </div>

          {/* ===== Market Prediction Widget (Span 12) ===== */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-12 sm:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-label-md text-on-surface-variant text-xs font-semibold">
                  {lang === "en" ? "Market Price Predictions" : "የገበያ ዋጋ ትንበያዎች"}
                </h3>
                <p className="text-[11px] text-outline mt-1">
                  {lang === "en" ? "AI-powered price forecasts for Ethiopian crops" : "ለኢትዮጵያ ምርቶች በ AI የተሰየሙ ዋጋ ትንበያዎች"}
                </p>
              </div>
              <button
                onClick={() => fetchMarketData(selectedRegion)}
                className="p-2 rounded-full bg-surface-container hover:bg-surface-variant transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-primary text-base">refresh</span>
              </button>
            </div>

            {loadingMarket ? (
              <div className="flex items-center justify-center py-8">
                <span className="material-symbols-outlined text-primary text-3xl animate-spin">refresh</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketOverview.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedCrop === item.crop
                        ? "bg-primary/10 border-primary"
                        : "bg-surface-container-lowest border-outline-variant/20 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedCrop(item.crop)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">{item.icon}</span>
                        <span className="font-label-md text-sm font-semibold">{item.crop}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.signal === 'buy' ? 'bg-green-100 text-green-800' :
                        item.signal === 'sell' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.signal.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-outline">{lang === "en" ? "Current" : "የአሁኑ"}</span>
                        <span className="font-label-md text-sm font-bold">{item.currentPrice} {item.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-outline">{lang === "en" ? "7d Change" : "7ቀን ለውጥ"}</span>
                        <span className={`font-label-md text-xs font-bold ${item.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change7d}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Crop Detail */}
            {cropPrediction && (
              <div className="mt-6 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-display-lg text-lg font-bold text-primary">{cropPrediction.crop}</h4>
                    <p className="text-xs text-outline">{cropPrediction.category} • {cropPrediction.unit}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    cropPrediction.signal === 'buy' ? 'bg-green-100 text-green-800' :
                    cropPrediction.signal === 'sell' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cropPrediction.signal.toUpperCase()} ({Math.round(cropPrediction.signalConfidence * 100)}%)
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mb-4">{cropPrediction.signalReason}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] text-outline">{lang === "en" ? "30d Low" : "30ቀን ዝቅተኛ"}</p>
                    <p className="font-label-md text-sm font-bold">{cropPrediction.forecast.summary.min}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-outline">{lang === "en" ? "30d Avg" : "30ቀን አማካኝ"}</p>
                    <p className="font-label-md text-sm font-bold">{cropPrediction.forecast.summary.avg}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-outline">{lang === "en" ? "30d High" : "30ቀን ከፍተኛ"}</p>
                    <p className="font-label-md text-sm font-bold">{cropPrediction.forecast.summary.max}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
