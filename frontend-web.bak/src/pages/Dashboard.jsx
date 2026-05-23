
import React, { useState, useEffect } from 'react';
import { Leaf, CloudRain, TrendingUp, Users, Bell, MapPin, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ t }) => {
  const [currentRegion, setCurrentRegion] = useState('Oromia');
  const [recommendations, setRecommendations] = useState([
    { id: 1, crop: 'Teff', confidence: '92%', reason: 'Ideal soil moisture in Oromia.' },
    { id: 2, crop: 'Maize', confidence: '85%', reason: 'Predicted rainfall patterns match.' }
  ]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [weather, setWeather] = useState({ temp: 24, condition: 'Loading...', risk: 'N/A' });
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState({ top_crops: [], nearby_alerts: [] });
  const [forecast, setForecast] = useState([]);

  const regions = ['Oromia', 'Amhara', 'Tigray', 'Southern', 'Afar', 'Sidama', 'Somali'];

  useEffect(() => {
    fetchMarketTrends();
    fetchWeather(currentRegion);
    fetchCommunityInsights(currentRegion);
    fetchPriceForecast();
  }, [currentRegion]);

  const fetchMarketTrends = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/market-trends');
      setMarketTrends(response.data);
    } catch (error) {
      console.error('Error fetching market trends:', error);
    }
  };

  const fetchWeather = async (region) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather?region=${region}`);
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const fetchCommunityInsights = async (region) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/community-insights?region=${region}`);
      setCommunity(response.data);
    } catch (error) {
      console.error('Error fetching community insights:', error);
    }
  };

  const fetchPriceForecast = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/price-forecast?crop=Teff');
      setForecast(response.data.forecast);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  const handleGetInsight = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/recommend', {
        region: currentRegion,
        soil_type: 'Black',
        land_size: 2.5,
        season: 'Summer'
      });
      
      const newRec = {
        id: Date.now(),
        crop: response.data.primary_crop,
        confidence: `${(response.data.confidence * 100).toFixed(0)}%`,
        reason: response.data.reasoning
      };
      
      setRecommendations([newRec, ...recommendations.slice(0, 1)]);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Elite Hero Section with AI-Generated Asset */}
      <section 
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 min-h-[450px] flex items-center shadow-2xl"
        style={{
          backgroundImage: 'url("/hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Professional Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent" />

        <div className="relative z-10 w-full px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-10 py-12">
          <div className="max-w-2xl text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary-light text-[10px] font-black uppercase tracking-[0.25em]">
              <Zap size={14} className="animate-pulse text-yellow-400" />
              Revolutionizing Agronomy
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter">
              More Confidence.<br />
              <span className="highlight">Better Decisions.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg font-medium leading-relaxed">
              AgriIntel empowers Ethiopian farmers with precision data to maximize yield and minimize environmental risk.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl w-full md:w-auto hover:bg-white/10 transition-all duration-500">
            <div className="flex items-center gap-3 text-slate-400 mb-6 text-[10px] font-black uppercase tracking-widest">
              <MapPin size={20} className="text-primary-light" />
              <span>Monitoring Node</span>
            </div>
            <select 
              value={currentRegion} 
              onChange={(e) => setCurrentRegion(e.target.value)}
              className="w-full md:w-64 bg-dark-bg/80 text-white font-black text-lg p-5 rounded-2xl border border-white/10 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer appearance-none shadow-inner"
            >
              {regions.map(r => <option key={r} value={r} className="text-gray-900 bg-white">{r}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Weather Card */}
        <div className="card-premium group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <CloudRain size={24} className="text-blue-400" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
              weather.risk.includes('Low') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {weather.risk} Risk
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white">{weather.temp}°C</h3>
            <p className="text-gray-400 font-medium">{weather.condition}</p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Local Outlook</p>
          </div>
        </div>

        {/* Market Intelligence Card */}
        <div className="card-premium group col-span-1 md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500/20 transition-colors">
              <TrendingUp size={24} className="text-yellow-400" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">AI Prediction</p>
              {forecast.length > 0 && (
                <p className="text-sm font-bold text-primary-light">Bullish Trend ↑</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {marketTrends.slice(0, 4).map((trend, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-3 flex justify-between items-center border border-white/5">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{trend.crop_name || trend.crop}</p>
                  <p className="text-sm font-bold text-white">{trend.price_per_quintal || trend.price} ETB</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trend.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {trend.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {trend.change_pct || trend.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Card */}
        <div className="card-premium group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
              <Users size={24} className="text-purple-400" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Regional Adoption</p>
              <p className="text-2xl font-black text-white">{community.adoption_rate || '+15%'}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {community.top_crops?.slice(0, 2).map((crop, i) => (
                <span key={i} className="text-[10px] font-bold px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Recommendation Section - SURGICAL SPACING */}
      <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-16 pt-12 border-t border-white/5 items-start">
        
        {/* Recommendation Panel */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-2.5 bg-gradient-to-b from-primary to-emerald-400 rounded-full" />
            <h2 className="text-4xl font-black text-white tracking-tighter">Expert AI Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {recommendations.map(rec => (
              <div key={rec.id} className="card-premium relative overflow-hidden group p-12">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8 pt-2">
                    <h4 className="text-3xl font-black text-white">{rec.crop}</h4>
                    <span className="text-[10px] font-black text-primary-light bg-primary/10 px-4 py-2 rounded-full border border-primary/20 uppercase tracking-widest shadow-inner">
                      {rec.confidence} Match
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">{rec.reason}</p>
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-light hover:text-white transition-all flex items-center gap-2 group/btn">
                    View Technical Details <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={handleGetInsight}
              disabled={loading}
              className="card-premium border-dashed border-primary/30 flex flex-col items-center justify-center gap-6 group hover:bg-primary/5 p-12"
            >
              <div className="p-6 bg-primary/10 rounded-full group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/5">
                <Zap size={40} className="text-primary-light" />
              </div>
              <div className="text-center">
                <p className="font-black text-white text-lg">{loading ? 'Synthesizing...' : 'Re-Analyze Field'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Refresh Local Data</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Alerts - Synchronized Alignment */}
        <div className="space-y-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-2.5 bg-gradient-to-b from-orange-500 to-amber-300 rounded-full" />
            <h2 className="text-3xl font-black text-white tracking-tighter">Field Alerts</h2>
          </div>
          
          <div className="space-y-6">
            {community.nearby_alerts?.map((alert, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border flex gap-5 transition-all hover:scale-[1.02] duration-300 ${
                alert.severity === 'High' ? 'bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/5' : 'bg-orange-500/5 border-orange-500/20 shadow-lg shadow-orange-500/5'
              }`}>
                <div className={`p-3 rounded-xl h-fit ${
                  alert.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  <Bell size={20} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                    alert.severity === 'High' ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    {alert.type} Alert
                  </p>
                  <p className="text-sm text-slate-200 font-bold leading-snug">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-premium bg-gradient-to-br from-slate-900 to-black border-none shadow-2xl p-8">
            <h4 className="text-white text-xl font-black mb-2">Expert Concierge</h4>
            <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">Instantly connect with a certified Helena representative for localized soil guidance.</p>
            <button className="btn-primary w-full shadow-emerald-500/20">
              Find Representative
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
