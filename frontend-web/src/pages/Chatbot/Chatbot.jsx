import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import chatbotData from "../../data/chatbotData.json";

export default function Chatbot({ lang, setActiveTab }) {
  const data = chatbotData;
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: data.initialMessage.text[lang],
      chips: data.initialMessage.chips.map(c => ({
        label: c.label[lang],
        query: c.query
      }))
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const agriculturalContext = {
        coffee: data.responses.coffee.text[lang],
        maize: data.responses.maize.text[lang],
        teff: data.responses.teff.text[lang],
        yield: data.responses.yield.text[lang],
        wheat: data.responses.wheat.text[lang],
        irrigation: data.responses.irrigation.text[lang],
        fertilizer: data.responses.fertilizer.text[lang],
        disease: data.responses.disease.text[lang],
        sorghum: data.responses.sorghum.text[lang],
        soil: data.responses.soil.text[lang],
        rotation: data.responses.rotation.text[lang],
        weather: data.responses.weather.text[lang]
      };

      const response = await axios.post("/api/ask", {
        question: textToSend,
        context: agriculturalContext,
        language: lang
      });
      let replyText = response.data?.answer || "";
      let detailedAction = null;

      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes("coffee") || lowerText.includes("rust") || lowerText.includes("ዝገት")) {
        detailedAction = {
          immediate: data.responses.coffee.action.immediate[lang],
          treatment: data.responses.coffee.action.treatment[lang],
          ancestral: data.responses.coffee.action.ancestral[lang]
        };
      } else if (lowerText.includes("wheat") || lowerText.includes("pest") || lowerText.includes("ስንዴ")) {
        detailedAction = {
          immediate: data.responses.wheat.action.immediate[lang],
          treatment: data.responses.wheat.action.treatment[lang],
          ancestral: data.responses.wheat.action.ancestral[lang]
        };
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: replyText || data.responses.default.text[lang],
          action: detailedAction
        }
      ]);
    } catch (error) {
      console.warn("Chatbot API error, using rich local responses:", error);
      let replyText = "";
      let detailedAction = null;

      const lowerText = textToSend.toLowerCase();

      if (lowerText.includes("coffee") || lowerText.includes("rust") || lowerText.includes("ዝገት")) {
        replyText = data.responses.coffee.text[lang];
        detailedAction = {
          immediate: data.responses.coffee.action.immediate[lang],
          treatment: data.responses.coffee.action.treatment[lang],
          ancestral: data.responses.coffee.action.ancestral[lang]
        };
      } else if (lowerText.includes("maize") || lowerText.includes("በቆሎ") || lowerText.includes("oromia")) {
        replyText = data.responses.maize.text[lang];
      } else if (lowerText.includes("teff") || lowerText.includes("ጤፍ") || lowerText.includes("ph")) {
        replyText = data.responses.teff.text[lang];
      } else if (lowerText.includes("yield") || lowerText.includes("prediction") || lowerText.includes("ምርት")) {
        replyText = data.responses.yield.text[lang];
      } else if (lowerText.includes("wheat") || lowerText.includes("pest") || lowerText.includes("ስንዴ")) {
        replyText = data.responses.wheat.text[lang];
        detailedAction = {
          immediate: data.responses.wheat.action.immediate[lang],
          treatment: data.responses.wheat.action.treatment[lang],
          ancestral: data.responses.wheat.action.ancestral[lang]
        };
      } else if (lowerText.includes("irrigation") || lowerText.includes("water") || lowerText.includes("ማስተካከል")) {
        replyText = data.responses.irrigation.text[lang];
      } else if (lowerText.includes("fertilizer") || lowerText.includes("npk") || lowerText.includes("ንብረት")) {
        replyText = data.responses.fertilizer.text[lang];
      } else if (lowerText.includes("disease") || lowerText.includes("prevention") || lowerText.includes("በሽታ")) {
        replyText = data.responses.disease.text[lang];
      } else if (lowerText.includes("sorghum") || lowerText.includes("ሹምብላ")) {
        replyText = data.responses.sorghum.text[lang];
      } else if (lowerText.includes("soil") || lowerText.includes("testing") || lowerText.includes("አፈር")) {
        replyText = data.responses.soil.text[lang];
      } else if (lowerText.includes("rotation") || lowerText.includes("crop") || lowerText.includes("ማሻሻል")) {
        replyText = data.responses.rotation.text[lang];
      } else if (lowerText.includes("weather") || lowerText.includes("climate") || lowerText.includes("አየር")) {
        replyText = data.responses.weather.text[lang];
      } else {
        replyText = data.responses.default.text[lang];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: replyText,
          action: detailedAction
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (query) => {
    handleSend(query);
  };

  const speakText = (text) => {
    if (!speechEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'am' ? 'am-ET' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'ai') {
      speakText(lastMessage.text);
    }
  }, [messages]);

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100">
      <div className="w-full max-w-[1600px] h-full mx-auto rounded-3xl shadow-2xl overflow-hidden relative bg-white/80 backdrop-blur-xl">
        <div className="flex flex-grow h-full w-full relative">
          {showSidebar && (
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
              onClick={() => setShowSidebar(false)}
            />
          )}

          <aside className={`absolute md:relative z-50 md:z-auto w-[85vw] sm:w-96 h-full bg-gradient-to-b from-emerald-900 to-teal-800 text-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}>
            <div className="px-6 pt-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-300 flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-2xl text-emerald-900">agriculture</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">AgriIntel</h1>
                  <span className="text-xs font-medium bg-emerald-400/20 px-2 py-0.5 rounded-full text-emerald-200">
                    Ethiopia
                  </span>
                </div>
              </div>
              <p className="text-sm text-emerald-200/70 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Yesterday • Awash Valley
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
              {data.sidebar.history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.title)}
                  className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/30 transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-emerald-300 text-sm mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-emerald-200/50 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                    {item.desc || `Oct ${12 - idx} • ${idx === 0 ? "Jimma Highlands" : idx === 1 ? "Arsi Zone" : "Sidama"}`}
                  </div>
                </button>
              ))}
            </div>

            <div
              onClick={() => setActiveTab("pricing")}
              className="mx-4 mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group border border-white/20"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">eco</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Upgrade to Pro</h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Unlock satellite imagery and real-time sensor integration.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-white text-emerald-700 px-4 py-2 rounded-xl shadow-md">
                  Get Started
                </span>
              </div>
            </div>
          </aside>

          <section className="flex-grow flex flex-col relative h-full overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
            <div className="absolute inset-0 z-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(16,185,129,0.1)_0%,_transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(20,184,166,0.1)_0%,_transparent_50%)]"></div>
            </div>

            <div className="relative z-10 px-6 py-4 md:px-8 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-emerald-100/50 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  className="md:hidden p-2 -ml-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition-all"
                  onClick={() => setShowSidebar(true)}
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-xl">psychology</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-base">AI Agronomist</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Online • Ethiopian agriculture expert
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className={`p-2.5 rounded-xl transition-all ${speechEnabled ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-emerald-100 text-emerald-600'}`}
                  title={speechEnabled ? "Disable speech" : "Enable speech"}
                >
                  <span className="material-symbols-outlined">{speechEnabled ? "volume_up" : "volume_off"}</span>
                </button>
                <button className="p-2.5 rounded-xl hover:bg-emerald-100 text-emerald-600 transition-all">
                  <span className="material-symbols-outlined">share</span>
                </button>
                <button className="p-2.5 rounded-xl hover:bg-emerald-100 text-emerald-600 transition-all">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 w-full max-w-[95%] sm:max-w-3xl animate-slideUp ${
                    msg.sender === "user" ? "self-end flex-row-reverse ml-auto" : "mr-auto"
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                        : "bg-white border-2 border-emerald-200 text-emerald-700"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {msg.sender === "user" ? "person" : "auto_awesome"}
                    </span>
                  </div>
                  <div
                    className={`p-4 rounded-3xl shadow-lg backdrop-blur-xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none"
                        : "bg-white border-2 border-emerald-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="text-base leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>

                    {msg.action && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                            <h4 className="font-bold text-emerald-700 text-xs mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">sanitizer</span>
                              {data.chatArea.actionLabels.immediate}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {msg.action.immediate}
                            </p>
                          </div>
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                            <h4 className="font-bold text-emerald-700 text-xs mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">science</span>
                              {data.chatArea.actionLabels.treatment}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {msg.action.treatment}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 rounded-r-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400">
                          <p className="text-sm italic text-amber-800">
                            "{msg.action.ancestral}"
                          </p>
                        </div>
                      </div>
                    )}

                    {msg.chips && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {msg.chips.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleChipClick(chip.query)}
                            className="px-4 py-2 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-lg transition-all active:scale-95"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3 max-w-lg mr-auto animate-fadeIn">
                  <div className="w-10 h-10 rounded-2xl bg-white border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg">
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                  </div>
                  <div className="px-5 py-3 rounded-3xl rounded-tl-none bg-white border-2 border-emerald-100 shadow-lg">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      <span className="ml-2">{data.chatArea.typing[lang]}</span>
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="relative z-10 p-5 bg-white/90 backdrop-blur-xl border-t border-emerald-100/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="max-w-4xl mx-auto flex items-end gap-3 bg-white rounded-3xl shadow-xl border-2 border-emerald-200 p-2 focus-within:ring-4 focus-within:ring-emerald-400/30 focus-within:border-emerald-400 transition-all"
              >
                <button
                  type="button"
                  className="p-3 text-gray-400 hover:text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">attach_file</span>
                </button>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about crop health, weather, or soil..."
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(inputValue);
                    }
                  }}
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-700 py-2 resize-none max-h-28 outline-none placeholder:text-gray-400 text-base"
                />
                <button
                  type="button"
                  className="hidden sm:flex p-3 text-gray-400 hover:text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">mic</span>
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-2">
                {data.chatArea.disclaimer}
              </p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16,185,129,0.7);
        }
      `}</style>
    </div>
  );
}