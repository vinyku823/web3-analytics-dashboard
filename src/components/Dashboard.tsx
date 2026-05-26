import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { StatsCard } from './StatsCard';
import { AnalyticsChart } from './AnalyticsChart';
import { AIInsightPanel } from './AIInsightPanel';
import { useAccount, useBalance } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  Layers, 
  Users, 
  AlertCircle,
  Search,
  Zap,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Cpu,
  Hexagon,
  Copy,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Modular dashboards
import { WalletDashboard } from './WalletDashboard';
import { AlertsCenter } from './AlertsCenter';
import { NFTDashboard } from './NFTDashboard';
import { TokensDashboard } from './TokensDashboard';
import { EcosystemsDashboard } from './EcosystemsDashboard';
import { AIChatDashboard } from './AIChatDashboard';

// Mock datasets
import { ECOSYSTEMS, MOCK_LIVE_TX, LiveTx, Ecosystem } from '../data/mockData';

export function Dashboard() {
  const { isConnected, address } = useAccount();
  const { data: evmBalance } = useBalance({ address });
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChain, setSelectedChain] = useState<Ecosystem>(ECOSYSTEMS[0]);
  const [liveTxs, setLiveTxs] = useState<LiveTx[]>(MOCK_LIVE_TX);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Wallet simulated statuses
  const [phantomSeed, setPhantomSeed] = useState(false);
  const [petraSeed, setPetraSeed] = useState(false);
  const [suietSeed, setSuietSeed] = useState(false);

  // Time updater
  useEffect(() => {
    const updateTime = () => {
      const offset = new Date();
      setCurrentTime(offset.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live transaction feeder simulation
  useEffect(() => {
    const txTimer = setInterval(() => {
      const typeIndex = Math.floor(Math.random() * 4);
      const types: Array<'Transfer' | 'Swap' | 'Mint' | 'Stake'> = ['Transfer', 'Swap', 'Mint', 'Stake'];
      const chains = ['Ethereum', 'Solana', 'Sui', 'Polygon', 'Aptos', 'Cosmos'];
      const tokens = ['ETH', 'SOL', 'SUI', 'POL', 'APT', 'ATOM'];
      const gasRates = ['$14.20', '$0.0002', '$0.0014', '$0.12', '$0.004', '$0.02'];
      
      const randomChainIdx = Math.floor(Math.random() * chains.length);
      const randomType = types[typeIndex];
      const selectedToken = tokens[randomChainIdx];
      
      const newTx: LiveTx = {
        id: `tx-new-${Math.random()}`,
        hash: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4).toUpperCase()}`,
        chain: chains[randomChainIdx],
        from: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        to: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        value: `${(Math.random() * 110 + 2).toFixed(2)} ${selectedToken}`,
        token: selectedToken,
        type: randomType,
        gas: gasRates[randomChainIdx],
        timestamp: 'Just now',
        status: 'SUCCESS'
      };

      setLiveTxs((prev) => [newTx, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(txTimer);
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Holographic glowing lines background */}
        <div className="absolute inset-0 z-0 bg-transparent pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[110px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-cyan-400/80 rounded-full blur-[130px] opacity-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl z-10 p-12 glass rounded-[3rem] border-white/5 shadow-2xl relative"
        >
          {/* Cyber accents corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-500 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff2d55] rounded-br-xl" />

          <div className="mb-8 inline-flex items-center justify-center p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Cpu className="w-10 h-10 text-amber-400" />
          </div>
          
          <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase block mb-3">
            PREMIUM MULTI-CHAIN QUANT STATS
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
            SHELBY ANALYTICS
          </h1>
          <p className="text-sm md:text-base text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto font-sans">
            Benchmark multi-chain portfolios, audit digital asset flow, and synthesize real-time intelligence inside an elite quantitative terminal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
            <div className="scale-125 hover:scale-130 transition-transform">
              <ConnectKitButton />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-wrap justify-center gap-6 text-[10px] font-mono text-white/30 tracking-widest uppercase">
            <span>• Ethereum Core</span>
            <span>• Solana VM</span>
            <span>• Sui Object Ledgers</span>
            <span>• Aptos Move Engine</span>
            <span>• Cosmos Hub</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent relative overflow-x-hidden">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Container */}
      <main className="flex-1 lg:pl-80 p-6 lg:p-10 transition-all">
        {/* Holographic Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-white/[0.04] pb-6">
          <div>
            <span className="text-[9px] font-mono tracking-[0.25em] text-cyan-400 uppercase flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              CYBERNETIC RPC INGRESS GATEWAY
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <Hexagon className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
              {activeTab === 'home' ? 'GLOBAL OVERVIEW' : activeTab.toUpperCase()}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl font-mono text-[10px] text-zinc-400 hidden sm:block">
              {currentTime}
            </div>
            <ConnectKitButton />
          </div>
        </header>

        {/* Dynamic content rendering based on activeTab */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {activeTab === 'home' && (
              <>
                {/* 1. Statistics grids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatsCard 
                    title="Estimated Global TVL" 
                    value="$12.48B" 
                    trend="+12.4% vs index" 
                    icon={<TrendingUp className="w-5 h-5 text-indigo-400 text-glow-purple" />} 
                  />
                  <StatsCard 
                    title="Active Validator Ports" 
                    value="6 Active VM" 
                    trend="Solana Leader" 
                    icon={<Layers className="w-5 h-5 text-cyan-400 text-glow-cyan" />} 
                  />
                  <StatsCard 
                    title="Cyber Wallets Agg" 
                    value="4 Synced" 
                    trend="Ready" 
                    icon={<Wallet className="w-5 h-5 text-pink-400 text-glow-pink" />} 
                  />
                  <StatsCard 
                    title="Sub-consensus Speed" 
                    value="2.8k TPS" 
                    trend="Optimal load" 
                    icon={<Activity className="w-5 h-5 text-green-400" />} 
                  />
                </div>

                {/* 2. Interactive Real-Time Price Charts & Trend Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Dynamic Chart Container */}
                  <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-white/20 tracking-widest">
                      CHART_TELEMETRY_ARRAY
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Interactive Price Trends</h3>
                        <p className="text-white/40 text-xs mt-1">Select ecosystem nodes to trace specific historical slopes.</p>
                      </div>

                      {/* Ecosystem switch controls */}
                      <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 border border-white/[0.04] rounded-xl self-start sm:self-auto">
                        {ECOSYSTEMS.map((chain) => (
                          <button
                            key={chain.id}
                            onClick={() => setSelectedChain(chain)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all ${selectedChain.id === chain.id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-white/40 hover:text-white/80'}`}
                          >
                            {chain.symbol}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-[320px]">
                      <AnalyticsChart selectedChainId={selectedChain.id} />
                    </div>

                    {/* Integrated mini stats display */}
                    <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/[0.04] text-center font-mono text-xs">
                      <div>
                        <span className="text-white/30 text-[9px] uppercase">TVL Depth</span>
                        <p className="font-bold text-white mt-1">{selectedChain.metrics.tvl}</p>
                      </div>
                      <div>
                        <span className="text-white/30 text-[9px] uppercase">Peak Speed</span>
                        <p className="font-bold text-[#14f195] mt-1">{selectedChain.metrics.speedTps}</p>
                      </div>
                      <div>
                        <span className="text-white/30 text-[9px] uppercase">Index Gas</span>
                        <p className="font-bold text-purple-400 mt-1">{selectedChain.metrics.avgGas}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI insights summary panel */}
                  <div className="lg:col-span-1">
                    <AIInsightPanel />
                  </div>
                </div>

                {/* 3. Live Transaction Feed / Connected Wallets / Mini Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Live Transaction Feed Container */}
                  <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 border-cyan-500/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Flame className="w-5 h-5 text-[#ff2d55] animate-bounce" />
                          <h3 className="text-xl font-bold tracking-tight">Consolidated Live Ingress</h3>
                        </div>
                        <span className="px-3 py-1 font-mono text-[9px] border border-cyan-500/30 text-cyan-300 bg-cyan-950/20 rounded-md animate-pulse">
                          STREAM: SYNCING
                        </span>
                      </div>
                      <p className="text-xs text-white/50 mb-6 font-mono">
                        Consolidated multi-chain RPC feed captures and hashes events globally with gas estimates.
                      </p>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        <AnimatePresence initial={false}>
                          {liveTxs.map((tx) => {
                            // Badge configuration
                            const isTransfer = tx.type === 'Transfer';
                            const isSwap = tx.type === 'Swap';
                            const isStake = tx.type === 'Stake';
                            
                            return (
                              <motion.div 
                                key={tx.id}
                                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-[#a855f7]/30 transition-all cursor-pointer gap-4 group"
                              >
                                <div className="flex items-center gap-3.5">
                                  {/* Custom Action Tag */}
                                  <span className={`p-1.5 px-3 rounded-xl font-mono text-[9px] font-bold tracking-wider text-center w-20 shrink-0 ${isTransfer ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : isSwap ? 'bg-[#14f195]/10 text-[#14f195] border border-[#14f195]/20' : isStake ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20'}`}>
                                    {tx.type.toUpperCase()}
                                  </span>
                                  <div>
                                    <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{tx.value}</p>
                                    <span className="text-[10px] text-white/40 font-mono italic">Hash: {tx.hash} • {tx.chain}</span>
                                  </div>
                                </div>
                                <div className="text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 sm:gap-0 select-none">
                                  <p className="text-[10px] text-white/40 font-mono uppercase">Fee: <span className="text-white/60 font-medium">{tx.gas}</span></p>
                                  <span className="text-[8px] font-mono font-bold text-[#14f195] bg-[#14f195]/5 px-1.5 rounded uppercase mt-0.5 tracking-widest">{tx.timestamp}</span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Connected Wallets Panel widget on Home */}
                  <div className="lg:col-span-1 glass rounded-[2.5rem] p-8 border-indigo-500/10 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-400" /> Connected Ports
                      </h3>
                      <p className="text-xs text-white/40 font-mono uppercase mb-6 tracking-widest">Local terminal links</p>

                      <div className="space-y-3 font-mono">
                        {/* EVM */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-xs font-bold">WAGMI EVM</span>
                          </div>
                          <span className="text-[10px] text-white/50">{address ? `${address.slice(0, 5)}...${address.slice(-4)}` : 'Connected'}</span>
                        </div>

                        {/* Phantom Simulated */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#14f195]" />
                            <span className="text-xs font-bold">PHANTOM SOL</span>
                          </div>
                          <span className="text-[10px] text-[#14f195] uppercase font-bold tracking-wider">SECURE</span>
                        </div>

                        {/* Petra Simulated */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#ff2d55]" />
                            <span className="text-xs font-bold">PETRA APTOS</span>
                          </div>
                          <span className="text-[10px] text-[#ff2d55] uppercase font-bold tracking-wider">SECURE</span>
                        </div>

                        {/* Suiet Simulated */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                            <span className="text-xs font-bold">SUIET SUI</span>
                          </div>
                          <span className="text-[10px] text-[#38bdf8] uppercase font-bold tracking-wider">SECURE</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('wallet')}
                      className="w-full py-3.5 mt-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs font-bold tracking-wider rounded-xl transition-all"
                    >
                      CONSOLIDATE WALLETS &gt;
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'wallet' && <WalletDashboard />}
            {activeTab === 'tokens' && <TokensDashboard />}
            {activeTab === 'nft' && <NFTDashboard />}
            {activeTab === 'ecosystems' && <EcosystemsDashboard />}
            {activeTab === 'community' && <AIChatDashboard />}
            {activeTab === 'ai' && <AIChatDashboard />}
            {activeTab === 'alerts' && <AlertsCenter />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
