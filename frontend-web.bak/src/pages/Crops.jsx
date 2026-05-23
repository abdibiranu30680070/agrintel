
import React, { useState, useEffect } from 'react';
import { Leaf, Info, Filter, ArrowUpRight, Search } from 'lucide-react';
import axios from 'axios';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crops-catalog');
        setCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <section className="bg-dark-card p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-500/20">
            Expert Knowledge Base
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Crop <span className="highlight">Catalog</span></h1>
          <p className="text-gray-400 max-w-xl">Comprehensive data on Ethiopian crop varieties, optimized for precision farming and high-yield results.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      </section>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search crop varieties..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-white"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all hover:bg-white/10">
            <Filter size={14} /> Filter Varieties
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="card-premium h-64 animate-pulse bg-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {crops.map((crop, index) => (
            <div key={index} className="card-premium group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                    <Leaf size={24} className="text-emerald-400" />
                  </div>
                  <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                    <Info size={18} />
                  </button>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-2xl font-black text-white mb-1 group-hover:text-primary-light transition-colors">{crop.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{crop.type}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-medium border-b border-white/5 pb-2">
                    <span className="text-gray-500">Ideal Soil</span>
                    <span className="text-gray-200">{crop.ideal_soil_type || crop.soil}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-b border-white/5 pb-2">
                    <span className="text-gray-500">Optimum Season</span>
                    <span className="text-gray-200">{crop.season || 'Summer'}</span>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                  Detailed Agronomy <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Crops;
