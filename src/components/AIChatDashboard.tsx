import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, Bot, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Holdings, TokenPrices } from '../types';

interface AIChatDashboardProps {
  holdings: Holdings;
  prices: TokenPrices;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const AIChatDashboard: React.FC<AIChatDashboardProps> = ({ holdings, prices }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Welcome, Operator. I am Shelby LLM v3, your unified Cross-chain intelligence engine. Direct me to analyze transaction trends, audit leverage positions, or optimize your Move/EVM gas routing pathways.",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Compute metrics dynamically for the LLM to reply intelligently
    const dynamicAptValue = holdings.APT * prices.APT;
    const dynamicSuiValue = holdings.SUI * prices.SUI;
    const dynamicEthValue = holdings.ETH * prices.ETH;
    const dynamicSolValue = holdings.SOL * prices.SOL;
    const dynamicUsdcValue = holdings.USDC * prices.USDC;
    const totalUSD = dynamicAptValue + dynamicSuiValue + dynamicEthValue + dynamicSolValue + dynamicUsdcValue;

    // Simulate AI thinking and replying with actual live numbers
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';

      const query = input.toLowerCase();
      if (query.includes('balance') || query.includes('portfolio') || query.includes('holding') || query.includes('worth')) {
        replyText = `Analyzing live multi-chain vault balances... 
Your Unified Network Worth is currently **$${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD**.

Breakdown utilizing real-time price triggers:
• **Aptos (APT)**: ${holdings.APT.toFixed(2)} units @ $${prices.APT.toFixed(2)} ($${dynamicAptValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)
• **Ethereum (ETH)**: ${holdings.ETH.toFixed(2)} units @ $${prices.ETH.toFixed(2)} ($${dynamicEthValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)
• **Sui Core (SUI)**: ${holdings.SUI.toFixed(2)} units @ $${prices.SUI.toFixed(2)} ($${dynamicSuiValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)
• **Solana VM (SOL)**: ${holdings.SOL.toFixed(2)} units @ $${prices.SOL.toFixed(2)} ($${dynamicSolValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)
• **Secure Stable (USDC)**: ${holdings.USDC.toFixed(2)} units @ $${prices.USDC.toFixed(2)} ($${dynamicUsdcValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)

You hold high density in Aptos/Move VM (worth $${dynamicAptValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD). Consider rotating a portion to USDC to minimize volatility risk.`;
      } else if (query.includes('gas') || query.includes('sui') || query.includes('aptos')) {
        replyText = `Cross-checking transaction trace statistics... 
• **Sui Core**: Currently experiencing low queuing trace lag (0.0018 SUI avg gas). Excellent venue for micro-swaps.
• **Aptos Mainnet**: Low-congestion active (0.0031 APT gas fee). 
• **Ethereum Mainnet**: Average priority fees hover around $${(prices.ETH * 0.0012).toFixed(2)} ($4.20 equivalent). We advise utilizing Arbitrum or Base routers for any transfers below $5,000 USD.`;
      } else if (query.includes('swap') || query.includes('trade') || query.includes('buy') || query.includes('sell')) {
        replyText = `You can execute instant atomic multichain swaps using my **Shelby DEX Router** in the Terminal Core panel! I dynamically index liquidity from PancakeSwap (Aptos), Raydium (Solana), Cetus (Sui), and Uniswap (Ethereum) to offer the optimal settlement price with minimum slippage.`;
      } else {
        replyText = `Trace complete. Regarding "${input}", I recommend tracking the ongoing Move VM volume inflows. Both SUI and APT have experienced substantial developer engagement spike in the past 24 hours. Your portfolio represents a highly integrated position here worth **$${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD** overall. How else can I secure your trades?`;
      }

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'agent',
        text: "Terminal log flushed. I am ready to process your next query.",
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div id="ai-chat-dashboard" className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-6 shadow-2xl flex flex-col h-[550px] relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/[0.06] pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
            <Sparkles size={15} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Shelby AI Auditor</h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Dual-Model Coprocessor Active</p>
          </div>
        </div>
        <button
          id="clear-chat-btn"
          onClick={handleClear}
          className="p-1 px-2 border border-white/[0.06] rounded-md text-[10px] text-zinc-500 hover:text-red-400 hover:border-red-500/20 font-mono transition-all flex items-center gap-1"
        >
          <Trash2 size={11} />
          FLUSH
        </button>
      </div>

      {/* Message Output */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-sans select-text">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isUser ? 'bg-zinc-800 text-zinc-400 border border-white/[0.04]' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
              }`}>
                {isUser ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={`rounded-xl p-3.5 text-xs selection:bg-teal-500/30 leading-relaxed ${
                isUser ? 'bg-zinc-800 border border-white/[0.04] text-white' : 'bg-zinc-950/40 border border-white/[0.02] text-zinc-300'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="text-[8px] font-mono text-zinc-600 mt-2 text-right">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Bot size={12} />
            </div>
            <div className="bg-zinc-950/40 border border-white/[0.02] rounded-xl p-3 px-4 text-xs text-zinc-500 font-mono flex items-center gap-1.5">
              <RefreshCw size={11} className="animate-spin text-teal-500" />
              Auditing ledgers...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input section */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] shrink-0 flex gap-2">
        <input
          id="chat-input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Shelby about portfolio balance or best Move gas..."
          className="flex-1 bg-zinc-950 border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white outline-none placeholder-zinc-600 focus:border-teal-500/30 font-sans"
        />
        <button
          id="chat-submit-btn"
          onClick={handleSend}
          className="p-3 bg-teal-400 hover:bg-teal-300 active:scale-95 text-zinc-950 rounded-xl font-bold transition-all shrink-0 flex items-center justify-center shadow-lg hover:shadow-teal-400/10"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
