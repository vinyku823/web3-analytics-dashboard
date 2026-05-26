import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, RefreshCcw, ArrowRight } from 'lucide-react';
import { getAIInsight } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export function AIInsightPanel() {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    // Mock data for the prompt
    const contextData = {
      trendingTokens: ["ETH", "SOL", "BASE"],
      marketSentiment: "Mixed to Bullish",
      whaleActivity: "Increasing in L2s"
    };
    const res = await getAIInsight("Market Overview", contextData);
    setInsight(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <div className="glass rounded-3xl p-8 border-primary/20 neon-border flex flex-col h-full bg-primary/5">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/40">
            <Zap className="w-6 h-6 text-primary fill-primary/30" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Insights</h3>
            <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Proprietary Model v2.4</p>
          </div>
        </div>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-white/5 rounded-full animate-pulse" style={{ width: `${100 - i * 15}%` }} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-invert prose-xs max-w-none text-white/70 leading-relaxed text-sm space-y-4"
            >
               <ReactMarkdown>{insight}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <button className="w-full flex items-center justify-between group p-4 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all font-medium text-sm">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Ask Shelby AI
          </span>
          <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
