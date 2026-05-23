
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, MoreHorizontal, MapPin } from 'lucide-react';
import axios from 'axios';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/farmers');
        setFarmers(response.data);
      } catch (error) {
        console.error('Error fetching farmers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 bg-dark-card p-8 rounded-3xl border border-white/5">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Farmer <span className="highlight">Registry</span></h1>
          <p className="text-gray-400">Management system for smallholders integrated into the AgriIntel network.</p>
        </div>
        <button className="btn-primary w-full md:w-auto">
          <Plus size={18} /> Register New Farmer
        </button>
      </section>

      <div className="card-premium overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, region or ID..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-white"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all">Filter</button>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all">Export CSV</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                <th className="pb-4 px-4 text-center w-16">ID</th>
                <th className="pb-4 px-4">Farmer Name</th>
                <th className="pb-4 px-4">Location</th>
                <th className="pb-4 px-4 text-center">Status</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-gray-500 animate-pulse font-bold">Synchronizing Registry...</td></tr>
              ) : farmers.map((f, i) => (
                <tr key={f.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-4 text-center text-gray-500 text-sm font-medium">#{f.id}</td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary-light font-bold text-xs uppercase">
                        { (f.full_name || f.name || "U").substring(0, 2) }
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{f.full_name || f.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Verified Farmer</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={14} className="text-primary-light" />
                      {f.region}
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                      (f.status || 'Active') === 'Active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {f.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Farmers;
