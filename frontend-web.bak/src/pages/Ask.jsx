
import React, { useState } from 'react';
import { MessageSquare, Send, User, Bot, Volume2, VolumeX, Sparkles } from 'lucide-react';
import axios from 'axios';

const Ask = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Salam! I am your AgriIntel assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const suggestedQuestions = [
    "Rainfall for Teff?",
    "Best soil for Coffee?",
    "Current Teff prices?",
    "How to stop Wheat Rust?",
    "Crops for dry regions?"
  ];

  const handleSend = async (e, forcedInput = null) => {
    if (e) e.preventDefault();
    const query = forcedInput || input;
    if (!query.trim()) return;

    const userMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/api/ask', { question: query });
      const aiMessage = { role: 'ai', text: response.data.answer };
      setMessages(prev => [...prev, aiMessage]);
      speak(response.data.answer); 
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = { role: 'ai', text: 'I am sorry, I am having trouble connecting to my knowledge base.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in w-full">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-light text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} /> AI AGRI-EXPERT
        </div>
        <h1 className="text-4xl font-black text-white">Ask <span className="highlight">AgriIntel AI</span></h1>
        <p className="text-gray-400 max-w-xl mx-auto">Get expert agronomy advice instantly. Powered by localized Ethiopian datasets.</p>
      </section>

      <div className="bg-dark-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col min-h-[600px] max-h-[80vh]">
        {/* Chat Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-2xl shadow-lg shadow-primary/5">
              <MessageSquare size={24} className="text-primary-light" />
            </div>
            <div>
              <h3 className="font-black text-white text-xl">AI Agronomist</h3>
              <p className="text-[10px] text-primary-light uppercase tracking-widest font-black">Online & Ready</p>
            </div>
          </div>
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all duration-500 ${
              voiceEnabled ? 'border-primary/40 text-primary-light bg-primary/10 shadow-lg shadow-primary/5' : 'border-white/10 text-slate-500'
            }`}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>
        </div>

        {/* Messages area - Fixed Visibility */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-transparent to-black/40">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start animate-fade-in`}>
              <div className={`p-3 rounded-2xl shadow-xl ${
                msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-800 text-primary-light border border-white/10'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed font-medium shadow-2xl ${
                msg.role === 'user' ? 'bg-primary/90 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-5 items-center animate-pulse">
              <div className="p-3 rounded-2xl bg-slate-800"><Bot size={20} className="text-primary-light" /></div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div className="px-8 py-5 bg-black/40 border-t border-white/5 backdrop-blur-md">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-4">Recommended Topics</p>
          <div className="flex flex-wrap gap-3">
            {suggestedQuestions.map((q, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(null, q)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-400 hover:border-primary/50 hover:text-primary-light hover:bg-primary/5 transition-all duration-500"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-8 bg-white/[0.03] border-t border-white/5 flex gap-4 items-center">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Inquire about Teff prices, rainfall, or soil..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
            />
          </div>
          <button className="btn-primary h-[54px] px-10 rounded-2xl shadow-emerald-500/10" disabled={loading}>
            <Send size={20} />
            <span className="hidden sm:inline">Consult</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Ask;
