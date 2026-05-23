
import React, { useState } from 'react';
import { Camera, Search, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Volume2, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Detection = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleScan = async () => {
    setScanning(true);
    setResult(null);
    
    // Simulate complex AI processing
    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/detect-disease');
        setResult(response.data);
        setScanning(false);
        speak(`Diagnosis complete. Result is ${response.data.status}. ${response.data.advice}`);
      } catch (error) {
        setScanning(false);
      }
    }, 2500);
  };

  return (
    <div className="space-y-12 animate-fade-in w-full">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} /> COMPUTER VISION ENGINE
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white">Precision <span className="text-blue-400">Diagnosis</span></h1>
        <p className="text-gray-400 max-w-xl mx-auto">Upload or capture crop images for instant AI-powered disease detection and treatment protocols.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Scanner Area */}
        <div className="space-y-6">
          <div className="relative group">
            <div className={`aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden bg-dark-card ${
              scanning ? 'border-blue-500/50 scale-[0.98]' : 'border-white/10 hover:border-blue-500/30'
            }`}>
              {scanning ? (
                <div className="relative flex flex-col items-center gap-6">
                  {/* Scanning Animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent animate-scan z-10" />
                  <RefreshCw size={64} className="text-blue-400 animate-spin" />
                  <p className="text-blue-400 font-black tracking-widest uppercase text-xs animate-pulse">Analyzing Neural Networks...</p>
                </div>
              ) : (
                <>
                  <div className="p-6 bg-blue-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={48} className="text-blue-400" />
                  </div>
                  <p className="text-white font-bold mb-2">Drop Field Image Here</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">or click to upload</p>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={handleScan}
            disabled={scanning}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
              scanning 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {scanning ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            {scanning ? 'Initializing Scan...' : 'Start Precision Scan'}
          </button>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {!result && !scanning && (
            <div className="card-premium h-[400px] flex flex-col items-center justify-center text-center opacity-50">
              <ShieldAlert size={48} className="text-gray-600 mb-4" />
              <h4 className="text-white font-bold">Waiting for Input</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest">No active diagnosis results</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              <div className={`card-premium border-l-4 ${
                result.status === 'Healthy' ? 'border-l-green-500' : 'border-l-red-500'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-3xl font-black text-white">{result.status}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Health Assessment</p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    result.status === 'Healthy' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {result.status === 'Healthy' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Detected Issue</p>
                    <p className="text-white font-bold">{result.disease}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">AI Confidence</p>
                      <span className="text-xs font-black text-blue-400">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${result.confidence * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium bg-gradient-to-br from-gray-800 to-gray-900 border-none shadow-blue-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Volume2 size={18} />
                  </div>
                  <h4 className="text-white font-bold">Treatment Protocol</h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{result.advice}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detection;
