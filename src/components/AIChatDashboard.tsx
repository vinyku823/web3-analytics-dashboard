import React, { useState, useRef, useEffect } from 'react';
import { askChainChat } from '../services/geminiService';
import { 
  Zap, 
  Sparkles, 
  Compass, 
  CornerDownLeft, 
  Trash2, 
  User, 
  Flame, 
  RefreshCw,
  Clock,
  Skull
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export function AIChatDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "ACCESS_GRANTED: Welcome to the Shelby AI Intelligence Core. I am synced with real-time on-chain indexes across Ethereum, Solana, Sui, Polygon, Aptos, and Cosmos Hubs. Let me know what analytics you wish to synthesize today.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Map basic chat history representation for Gemini SDK
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const modelResponse = await askChainChat(text, history);

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'assistant',
        text: modelResponse || "SYSTEMERROR: Quantum connection timed out. Re-instantiating.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: 'err-' + Math.random(),
        sender: 'assistant',
        text: "ALERT: Connection failed. The high-altitude blockchain validators could not resolve the key parameters. Please check your global GEMINI_API_KEY settings in the visual control panel.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: 'init-refreshed',
        sender: 'assistant',
        text: "ORACLE_RESET: Cache flushed. State variable initialized. Standing by for query inputs.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const SUGGESTED_QUERIES = [
    "Draft Solana vs Sui scalability index",
    "Calculate Aptos NFT liquidity depth",
    "Synthesize Cosmos Hub growth prediction",
    "Draft Ethereum gas crisis protocol"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-210px)] cyber-grid">
      {/* Sidebar tips */}
      <div className="lg:col-span-1 glass rounded-3xl p-6 border-white/[0.05] flex flex-col justify-between h-full bg-[#0b0a14]/40">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-purple-400 fill-purple-400/20" />
            <h4 className="font-mono text-xs font-bold leading-none uppercase tracking-widest text-[#a855f7]">Quick Synths</h4>
          </div>
          
          <p className="text-xs text-white/50 mb-6 leading-relaxed">
            Click any core analytical pipeline blueprint to feed it directly to the Gemini Web3 Intelligence array.
          </p>

          <div className="space-y-2.5">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="w-full text-left p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-purple-500/10 hover:border-purple-500/30 text-xs text-white/70 hover:text-white transition-all font-mono"
              >
                &gt;&gt; {q}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 text-[10px] text-white/40 leading-relaxed font-mono">
          <div className="font-bold flex items-center gap-1.5 text-white/60 mb-1">
            <Clock className="w-3.5 h-3.5 text-glow-purple" /> ORACLE HEALTH INDEX
          </div>
          Nodes: ONLINE (12/12)
          Latency: 45ms (Optimal)
          Powered: Gemini 3 Flash OS
        </div>
      </div>

      {/* Main Chat Terminal */}
      <div className="lg:col-span-3 glass rounded-3xl border-white/[0.06] p-8 h-full flex flex-col justify-between overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 neon-glow-purple">
              <Sparkles className="w-5 h-5 text-[#a855f7]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Shelby Intelligence Core Terminal</h3>
              <p className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Node Agent Session ID: 0x8F9AAEC</p>
            </div>
          </div>

          <button 
            onClick={clearChatHistory}
            className="p-2 rounded-lg bg-white/[0.02] hover:bg-red-500/10 text-white/40 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all"
            title="Flush memory cache"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message timeline stream */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-6 scrollbar-hide">
          {messages.map((m) => {
            const isAss = m.sender === 'assistant';
            return (
              <div 
                key={m.id} 
                className={`flex gap-4 max-w-3xl ${isAss ? 'mr-12' : 'ml-12 flex-row-reverse text-right'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border uppercase font-mono text-[10px] font-bold ${isAss ? 'bg-purple-500/10 text-[#a855f7] border-[#a855f7]/30' : 'bg-cyan-500/10 text-cyan-400 border-cyan-400/30'}`}>
                  {isAss ? 'AI' : 'USR'}
                </div>
                
                {/* Content Box */}
                <div className={`p-4.5 rounded-2xl ${isAss ? 'bg-[#12101e]/80 border border-purple-500/10 text-left' : 'bg-cyan-950/20 border border-cyan-500/15 text-left ml-auto'}`}>
                  <div className="prose prose-invert prose-xs max-w-none text-xs text-white/85 leading-relaxed space-y-2">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                  <div className={`text-[8px] font-mono mt-2 uppercase tracking-wide ${isAss ? 'text-purple-400/40 text-left' : 'text-cyan-400/40 text-right'}`}>
                    Captured {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-4 max-w-xl mr-12 text-left items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-[#a855f7] border border-[#a855f7]/30 flex items-center justify-center font-mono text-[10px] font-bold">
                AI
              </div>
              <div className="p-4 p-y-3 rounded-2xl bg-[#12101e]/80 border border-purple-500/10 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-[10px] font-mono text-purple-400 tracking-wider">SYNTHESIZING_BLOCKCHAIN_VECTORS...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form Box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="relative"
        >
          <input
            type="text"
            required
            value={inputText}
            disabled={loading}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Synthesize new cross-chain telemetry query..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4.5 pl-5 pr-14 text-sm focus:outline-none focus:border-purple-500/40 focus:bg-[#12101e]/40 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-30 flex items-center justify-center"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
