import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, RefreshCw, Layers, ShieldAlert, CheckCircle2, 
  Wallet, DollarSign, ArrowUpRight, Zap, Play, Info, Cpu 
} from 'lucide-react';

import { Sidebar } from './Sidebar';
import { InteractiveSwapper } from './InteractiveSwapper';
import { EcosystemsDashboard } from './EcosystemsDashboard';
import { AIChatDashboard } from './AIChatDashboard';
import { ShelbyLogo } from './ShelbyLogo';
import { StatsCard } from './StatsCard';
import { AnalyticsChart } from './AnalyticsChart';
import { A2ZChainDashboard } from './A2ZChainDashboard';

// Shared datasets and typings
import { Holdings, TokenPrices, LiveTx } from '../types';
import { ECOSYSTEMS, MOCK_LIVE_TX, MOCK_ALERTS, MOCK_INSIGHTS } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedChain, setSelectedChain] = useState(ECOSYSTEMS[2]); // Default Aptos

  // Live holdings state
  const [holdings, setHoldings] = useState<Holdings>(() => {
    const saved = localStorage.getItem('shelby_holdings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      APT: 1248.75,
      SUI: 845.00,
      ETH: 3.85,
      SOL: 42.60,
      USDC: 3250.00
    };
  });

  // Real-time market oracle state feeding prices dynamically
  const [prices, setPrices] = useState<TokenPrices>({
    APT: 14.77,
    SUI: 1.86,
    ETH: 3485.20,
    SOL: 162.45,
    USDC: 1.00
  });
  const [pricesLoading, setPricesLoading] = useState<boolean>(true);
  const [lastFeedUpdateTime, setLastFeedUpdateTime] = useState<string>('');

  useEffect(() => {
    const fetchPrices = () => {
      fetch('https://api.coincap.io/v2/assets?ids=aptos,sui,ethereum,solana,usd-coin')
        .then((res) => res.json())
        .then((json) => {
          if (json && json.data && Array.isArray(json.data)) {
            const fetched: Partial<TokenPrices> = {};
            json.data.forEach((asset: any) => {
              if (asset.id === 'aptos') fetched.APT = parseFloat(asset.priceUsd);
              if (asset.id === 'sui') fetched.SUI = parseFloat(asset.priceUsd);
              if (asset.id === 'ethereum') fetched.ETH = parseFloat(asset.priceUsd);
              if (asset.id === 'solana') fetched.SOL = parseFloat(asset.priceUsd);
              if (asset.id === 'usd-coin') fetched.USDC = parseFloat(asset.priceUsd);
            });
            setPrices((prev) => ({ ...prev, ...fetched }));
            setLastFeedUpdateTime(new Date().toLocaleTimeString());
            setPricesLoading(false);
          }
        })
        .catch((err) => {
          console.warn('Network price fetch failed, using fallbacks:', err);
          setPricesLoading(false);
        });
    };

    fetchPrices();
    const timer = setInterval(fetchPrices, 10000); // 10s tick
    return () => clearInterval(timer);
  }, []);

  const [liveTxs, setLiveTxs] = useState<LiveTx[]>(MOCK_LIVE_TX);

  // Address simulation state
  const [activeAddress, setActiveAddress] = useState<string>('0x7f4a...6b91');

  const handleSwapCompleted = (
    fromTok: keyof Holdings,
    toTok: keyof Holdings,
    fromAmt: number,
    toAmt: number
  ) => {
    setHoldings((prev) => {
      const updated = {
        ...prev,
        [fromTok]: Math.max(0, prev[fromTok] - fromAmt),
        [toTok]: prev[toTok] + toAmt,
      };
      localStorage.setItem('shelby_holdings', JSON.stringify(updated));
      return updated;
    });

    // Trace transaction block onto historical logger
    const randomHash = '0x' + Array.from({ length: 24 }, () => 'abcdef0123456789'[Math.floor(Math.random() * 16)]).join('');
    const userTx: LiveTx = {
      id: `tx-${Date.now()}`,
      hash: `${randomHash.slice(0, 8)}...${randomHash.slice(-4)}`,
      chain: fromTok === 'SOL' ? 'Solana' : fromTok === 'SUI' ? 'Sui' : fromTok === 'APT' ? 'Aptos' : 'Ethereum',
      from: activeAddress,
      to: 'Shelby DEX Router',
      value: `${fromAmt.toFixed(2)} ${fromTok} → ${toAmt.toFixed(2)} ${toTok}`,
      token: toTok,
      type: 'Swap',
      gas: fromTok === 'ETH' ? '0.0012 ETH' : '0.003 APT',
      timestamp: 'Just now',
      status: 'SUCCESS',
    };

    setLiveTxs((prev) => [userTx, ...prev]);
  };

  // Portfolio aggregates
  const dynamicAptValue = holdings.APT * prices.APT;
  const dynamicSuiValue = holdings.SUI * prices.SUI;
  const dynamicEthValue = holdings.ETH * prices.ETH;
  const dynamicSolValue = holdings.SOL * prices.SOL;
  const dynamicUsdcValue = holdings.USDC * prices.USDC;
  const totalWorth = dynamicAptValue + dynamicSuiValue + dynamicEthValue + dynamicSolValue + dynamicUsdcValue;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 min-h-screen bg-zinc-950 font-sans text-white">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} selectedChain={selectedChain} />

      {/* Main Container */}
      <main className="flex-1 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-white/[0.04]">
          <div className="flex items-center gap-4">
            <ShelbyLogo />
            <div className="hidden sm:block h-6 w-[1px] bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                Real-time feeds active
                {lastFeedUpdateTime && (
                  <span className="text-teal-400">({lastFeedUpdateTime})</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Address Selector */}
            <div className="bg-zinc-950/80 px-4 py-2 rounded-xl border border-white/[0.06] font-mono text-xs flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-black">ADDR:</span>
              <span className="text-zinc-200">{activeAddress}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Display Panels */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="terminal-core"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Aggregate Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  id="aggregate-networth"
                  title="Unified Portfolio Value"
                  value={totalWorth.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                  subtitle="Synchronized aggregations from all VMs"
                  icon={DollarSign}
                  accentColor="#2dd4bf"
                />
                <StatsCard
                  id="active-address-deposits"
                  title="Total SUI + APT Assets"
                  value={`${(holdings.SUI + holdings.APT).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })} units`}
                  subtitle="Collaterals stacked on Move VMs"
                  icon={Layers}
                  accentColor="#38bdf8"
                />
                <StatsCard
                  id="gas-saved"
                  title="Gas Saved (Estimated)"
                  value="$4,120.00"
                  subtitle="Shelby routing saving compared to L1 EVM"
                  icon={Zap}
                  accentColor="#10b981"
                />
              </div>

              {/* Dynamic Ledger Holdings breakdown */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Holdings table list */}
                <div className="xl:col-span-2 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-6 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2">
                        <Wallet size={13} className="text-teal-400" />
                        Move & EVM Vault Assets
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Physical ledger balance indices</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* APT */}
                    <div id="holding-row-apt" className="bg-zinc-950/40 border border-white/[0.02] p-4 rounded-xl flex justify-between items-center transition-all hover:border-teal-500/10">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold text-[10px] font-mono shrink-0">APT</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">Aptos</p>
                          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">Aptos Mainnet</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white font-mono leading-none">
                          {holdings.APT.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {dynamicAptValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      </div>
                    </div>

                    {/* SUI */}
                    <div id="holding-row-sui" className="bg-zinc-950/40 border border-white/[0.02] p-4 rounded-xl flex justify-between items-center transition-all hover:border-teal-500/10">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px] font-mono shrink-0">SUI</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">Sui Core</p>
                          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">Sui Network</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white font-mono leading-none">
                          {holdings.SUI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {dynamicSuiValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      </div>
                    </div>

                    {/* ETH */}
                    <div id="holding-row-eth" className="bg-zinc-950/40 border border-white/[0.02] p-4 rounded-xl flex justify-between items-center transition-all hover:border-teal-500/10">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-[10px] font-mono shrink-0">ETH</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">Ethereum</p>
                          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">EVM Layer 1</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white font-mono leading-none">
                          {holdings.ETH.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </p>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {dynamicEthValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      </div>
                    </div>

                    {/* SOL */}
                    <div id="holding-row-sol" className="bg-zinc-950/40 border border-white/[0.02] p-4 rounded-xl flex justify-between items-center transition-all hover:border-teal-500/10">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] font-mono shrink-0">SOL</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">Solana</p>
                          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">SVM Core</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white font-mono leading-none">
                          {holdings.SOL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {dynamicSolValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      </div>
                    </div>

                    {/* USDC */}
                    <div id="holding-row-usdc" className="bg-zinc-950/40 border border-white/[0.02] p-4 rounded-xl flex justify-between items-center transition-all hover:border-teal-500/10">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold text-[10px] font-mono shrink-0">USDC</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">Stablecoin</p>
                          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">USD Circle Stable</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white font-mono leading-none">
                          {holdings.USDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {dynamicUsdcValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swapper column */}
                <InteractiveSwapper holdings={holdings} prices={prices} onSwapCompleted={handleSwapCompleted} />
              </div>

              {/* Analytics and secondary lists */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart timeline component */}
                <div className="lg:col-span-2">
                  <AnalyticsChart />
                </div>

                {/* Live ledger txs feed widget */}
                <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-6 shadow-2xl relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h3 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2">
                          <Cpu size={13} className="text-teal-400 animate-spin" />
                          On-chain Swap Tracker
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Live MPC trace updates</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                      {liveTxs.map((tx) => (
                        <div key={tx.id} id={`tx-trace-${tx.id}`} className="bg-zinc-950/40 border border-white/[0.02] p-3 rounded-xl flex justify-between items-center text-[11px] font-mono">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold text-[9px]">
                                {tx.chain}
                              </span>
                              <strong className="text-zinc-300 font-black">{tx.hash}</strong>
                            </div>
                            <span className="text-zinc-500 block text-[9px] mt-1 pr-1">{tx.value}</span>
                          </div>
                          <span className="text-teal-400 text-[9px] font-bold shrink-0">
                            {tx.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.04] flex justify-between text-[9px] font-mono text-zinc-600">
                    <span>Traced via RPC Nodes</span>
                    <span>Consensus: BFT</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'a2z' && (
            <motion.div
              key="a2z-explorer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <A2ZChainDashboard />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai-agent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AIChatDashboard holdings={holdings} prices={prices} />
            </motion.div>
          )}

          {activeTab === 'ecosystems' && (
            <motion.div
              key="ecosystem-monitors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <EcosystemsDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
export default Dashboard;
