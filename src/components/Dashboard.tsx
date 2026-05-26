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
  Plus,
  Ghost,
  Droplet,
  Compass,
  ChevronRight,
  ChevronDown,
  X
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
import { ECOSYSTEMS, MOCK_LIVE_TX, LiveTx, Ecosystem, TRENDING_TOKENS, NFT_COLLECTIONS } from '../data/mockData';

// Custom high-fidelity MetaMask Fox SVG logo
const MetaMaskLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 14.5L25.5 12L22 4.5L16.5 10.5L17.5 15.5L30 14.5Z" fill="#E2761B"/>
    <path d="M2.00002 14.5L6.5 12L10 4.5L15.5 10.5L14.5 15.5L2.00002 14.5Z" fill="#E4761B"/>
    <path d="M25.5 12L28 20L21 21.5L20 16L22.5 14L25.5 12Z" fill="#D7C1B3"/>
    <path d="M6.5 12L4 20L11 21.5L12 16L9.5 14L6.5 12Z" fill="#D7C1B3"/>
    <path d="M21 21.5L23.5 27.5L17.5 28.5L16 23.5L21 21.5Z" fill="#E2761B"/>
    <path d="M11 21.5L8.50002 27.5L14.5 28.5L16 23.5L11 21.5Z" fill="#E2761B"/>
    <path d="M16 16.5L20 16L21 21.5L16 23.5L16 16.5Z" fill="#161616"/>
    <path d="M16 16.5L12 16L11 21.5L16 23.5L16 16.5Z" fill="#161616"/>
    <path d="M20 16L22.5 14L25.5 12L22 4.5L16.5 10.5L16 16.5L20 16Z" fill="#F6851B"/>
    <path d="M12 16L9.5 14L6.5 12L10 4.5L15.5 10.5L16 16.5L12 16Z" fill="#F6851B"/>
  </svg>
);

export function Dashboard() {
  const { isConnected: isRealEvmConnected, address: realEvmAddress } = useAccount();
  const { data: evmBalance } = useBalance({ address: realEvmAddress });

  // Custom session state supporting Rabby, Phantom, Sui, Petra, Keplr, and MetaMask
  const [sessionWallet, setSessionWallet] = useState<string | null>(() => {
    return localStorage.getItem('shelby_session_wallet') || 'metamask';
  });
  const [sessionAddress, setSessionAddress] = useState<string>(() => {
    return localStorage.getItem('shelby_session_address') || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  });
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);

  const isUserConnected = isRealEvmConnected || !!sessionWallet;
  const activeAddress = realEvmAddress || sessionAddress;
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChain, setSelectedChain] = useState<Ecosystem>(ECOSYSTEMS[0]);
  const [liveTxs, setLiveTxs] = useState<LiveTx[]>(MOCK_LIVE_TX);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Wallet simulated statuses
  const [phantomSeed, setPhantomSeed] = useState(false);
  const [petraSeed, setPetraSeed] = useState(false);
  const [suietSeed, setSuietSeed] = useState(false);

  // Synchronize dynamic stats based on connected wallet chain
  useEffect(() => {
    if (sessionWallet === 'metamask') {
      const ethEco = ECOSYSTEMS.find(e => e.id === 'ethereum');
      if (ethEco) setSelectedChain(ethEco);
    } else if (sessionWallet === 'rabby') {
      const ethEco = ECOSYSTEMS.find(e => e.id === 'ethereum');
      if (ethEco) setSelectedChain(ethEco);
    } else if (sessionWallet === 'phantom') {
      const solEco = ECOSYSTEMS.find(e => e.id === 'solana');
      if (solEco) setSelectedChain(solEco);
    } else if (sessionWallet === 'sui') {
      const suiEco = ECOSYSTEMS.find(e => e.id === 'sui');
      if (suiEco) setSelectedChain(suiEco);
    } else if (sessionWallet === 'petra') {
      const aptosEco = ECOSYSTEMS.find(e => e.id === 'aptos');
      if (aptosEco) setSelectedChain(aptosEco);
    } else if (sessionWallet === 'keplr') {
      const cosmosEco = ECOSYSTEMS.find(e => e.id === 'cosmos');
      if (cosmosEco) setSelectedChain(cosmosEco);
    }
  }, [sessionWallet]);

  // Connect helper for primary options (MetaMask, Rabby, Phantom, Sui, Petra, Keplr)
  const handleConnect = (walletType: 'metamask' | 'rabby' | 'phantom' | 'sui' | 'petra' | 'keplr') => {
    let mockAddr = '';
    if (walletType === 'metamask') {
      mockAddr = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    } else if (walletType === 'rabby') {
      mockAddr = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    } else if (walletType === 'phantom') {
      mockAddr = 'G8xfgXKe6A9mPqR7ZtYfKePw9mPrTfB7zVp2Lky';
    } else if (walletType === 'sui') {
      mockAddr = '0xca7d66be8e08d2884aef567d26b42b38e0ee9ab43';
    } else if (walletType === 'petra') {
      mockAddr = '0x3fe71b9c8fd34bb2297df332f11a2f90267a9f1a2';
    } else if (walletType === 'keplr') {
      mockAddr = 'cosmos1g2a09h7dfke8df7y27adfs9q8k2vls0as7ad';
    }

    setSessionWallet(walletType);
    setSessionAddress(mockAddr);
    localStorage.setItem('shelby_session_wallet', walletType);
    localStorage.setItem('shelby_session_address', mockAddr);
    setIsConnectModalOpen(false);
  };

  // Disconnect session
  const handleDisconnect = () => {
    setSessionWallet(null);
    setSessionAddress('');
    localStorage.removeItem('shelby_session_wallet');
    localStorage.removeItem('shelby_session_address');
  };

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

  if (!isUserConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-zinc-950">
        {/* Holographic glowing lines background */}
        <div className="absolute inset-0 z-0 bg-transparent pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[110px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-cyan-400/80 rounded-full blur-[130px] opacity-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl z-10 p-8 sm:p-12 glass rounded-[3rem] border-white/5 shadow-2xl relative"
        >
          {/* Cyber accents corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-500 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff2d55] rounded-br-xl" />

          <div className="mb-6 inline-flex items-center justify-center p-4.5 rounded-3xl bg-amber-500/10 border border-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Cpu className="w-9 h-9 text-amber-400" />
          </div>
          
          <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase block mb-3">
            PREMIUM MULTI-CHAIN QUANT STATS
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
            SHELBY ANALYTICS
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mb-8 leading-relaxed max-w-xl mx-auto font-sans">
            Benchmark multi-chain portfolios, audit digital asset flow, and synthesize real-time intelligence inside an elite quantitative terminal.
          </p>

          {/* Core Wallet Connection Launcher */}
          <div className="flex flex-col items-center justify-center gap-6 p-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsConnectModalOpen(true)}
              className="px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-100 font-extrabold rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[11px]"
            >
              <Wallet className="w-4.5 h-4.5 text-zinc-950" /> Connect Wallet
            </motion.button>
          </div>
          
          <div className="mt-6 pt-5 border-t border-white/[0.04] flex flex-wrap justify-center gap-6 text-[10px] font-mono text-white/35 tracking-widest uppercase">
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
          
          <div className="flex flex-col sm:items-end gap-3.5">
            {isUserConnected ? (
              <div className="flex flex-col items-stretch sm:items-end w-full sm:w-auto relative">
                {/* Connected Wallet Row */}
                <div className="flex items-center justify-between sm:justify-end gap-3.5">
                  <div className="p-2 bg-white/[0.02] border border-white/[0.05] rounded-xl font-mono text-[9px] text-zinc-550 hidden md:block">
                    {currentTime}
                  </div>
                  
                  <div className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl bg-[#090812]/90 border border-white/5 text-[10px] sm:text-xs font-mono font-black tracking-wider text-zinc-100 shadow-[0_0_20px_rgba(255,45,85,0.03)] backdrop-blur-md">
                    {sessionWallet === 'metamask' ? (
                      <MetaMaskLogo className="w-5 h-5 flex-shrink-0 animate-pulse" />
                    ) : (
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sessionWallet === 'petra' ? 'bg-[#ff2d55]' : 'bg-cyan-400'} animate-pulse shadow-[0_0_6px_currentColor]`} />
                    )}
                    <span className="uppercase text-white font-black">{sessionWallet || 'EVM'} Connected</span>
                    <span className="text-zinc-400 font-normal">({activeAddress.slice(0, 6)}...{activeAddress.slice(-4)})</span>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 rounded-2xl transition-all font-mono text-[9px] font-black tracking-widest cursor-pointer"
                    title="Disconnect Wallet"
                  >
                    DISCONNECT
                  </button>
                </div>

                {/* Chain Selector dropdown active under wallet */}
                <div className="mt-2.5 w-full sm:w-72 relative">
                  <button
                    onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
                    className="w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-[10px] font-mono font-black tracking-widest text-[#06b6d4] hover:text-cyan-300 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/35 hover:border-cyan-400 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md relative overflow-hidden group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                      EVM NET: <span className="text-white font-extrabold">{selectedChain.name}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] bg-cyan-500/10 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/20 font-bold uppercase">Active</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-350 ${isChainDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isChainDropdownOpen && (
                      <>
                        {/* Invisible backdrop clickout helper */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsChainDropdownOpen(false)} />
                        
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 left-0 mt-2 p-2 bg-[#080710]/95 border border-cyan-500/30 rounded-2xl z-50 shadow-[0_10px_40px_rgba(0,0,0,0.95)] backdrop-blur-xl max-h-60 overflow-y-auto font-mono text-[10px] space-y-1"
                        >
                          <div className="px-3 py-1 text-[8px] tracking-wider text-zinc-500 block uppercase font-bold border-b border-white/[0.04] mb-1">
                            Available EVM Networks
                          </div>
                          {ECOSYSTEMS.map((chain) => {
                            const isEvm = ['ethereum', 'arbitrum', 'base', 'polygon', 'optimism'].includes(chain.id);
                            return (
                              <button
                                key={chain.id}
                                onClick={() => {
                                  setSelectedChain(chain);
                                  setIsChainDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between text-zinc-300 hover:text-white cursor-pointer ${selectedChain.id === chain.id ? 'bg-[#3b82f6]/10 text-cyan-300 border border-[#3b82f6]/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]' : 'hover:bg-white/[0.04] border border-transparent'}`}
                              >
                                <span className="uppercase font-extrabold flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chain.color }} />
                                  {chain.name} <span className="text-zinc-500 text-[8px] font-normal">({chain.symbol})</span>
                                </span>
                                {isEvm ? (
                                  <span className="text-[7px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded font-black uppercase">EVM Link</span>
                                ) : (
                                  <span className="text-[7px] bg-zinc-500/10 text-zinc-400 border border-zinc-500/10 px-1 py-0.2 rounded uppercase">Non-EVM</span>
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <ConnectKitButton />
            )}
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
            {activeTab === 'home' && (() => {
              // Dynamic portfolio metadata based on selected network
              const chainStats: Record<string, { balance: string; pnl: string; isPositive: boolean; assets: number; gasSaved: string; accentColor: string; bgEffect: string }> = {
                ethereum: { balance: '$485,210.80', pnl: '+$32,140.50 (+7.11%)', isPositive: true, assets: 8, gasSaved: '$120.40', accentColor: '#6366f1', bgEffect: 'rgba(99, 102, 241, 0.08)' },
                arbitrum: { balance: '$254,180.40', pnl: '+$15,840.20 (+5.12%)', isPositive: true, assets: 5, gasSaved: '$1,420.00', accentColor: '#3b82f6', bgEffect: 'rgba(59, 130, 246, 0.08)' },
                base: { balance: '$318,450.00', pnl: '+$34,290.00 (+11.85%)', isPositive: true, assets: 12, gasSaved: '$1,980.50', accentColor: '#0052ff', bgEffect: 'rgba(0, 82, 255, 0.08)' },
                polygon: { balance: '$112,400.20', pnl: '-$1,410.50 (-1.25%)', isPositive: false, assets: 6, gasSaved: '$850.00', accentColor: '#a855f7', bgEffect: 'rgba(168, 85, 247, 0.08)' },
                optimism: { balance: '$190,500.00', pnl: '+$8,140.00 (+4.20%)', isPositive: true, assets: 4, gasSaved: '$1,120.00', accentColor: '#ff0420', bgEffect: 'rgba(255, 4, 32, 0.08)' },
                solana: { balance: '$182,300.00', pnl: '+$12,120.00 (+7.12%)', isPositive: true, assets: 14, gasSaved: '$4,120.00', accentColor: '#14f195', bgEffect: 'rgba(20, 241, 149, 0.08)' },
                sui: { balance: '$192,400.00', pnl: '+$21,240.00 (+12.40%)', isPositive: true, assets: 11, gasSaved: '$2,850.00', accentColor: '#38bdf8', bgEffect: 'rgba(56, 189, 248, 0.08)' },
                aptos: { balance: '$94,800.00', pnl: '+$4,120.00 (+4.55%)', isPositive: true, assets: 7, gasSaved: '$150.00', accentColor: '#ff2d55', bgEffect: 'rgba(255, 45, 85, 0.08)' },
                cosmos: { balance: '$83,500.00', pnl: '-$350.00 (-0.42%)', isPositive: false, assets: 5, gasSaved: '$210.00', accentColor: '#ff79c6', bgEffect: 'rgba(255, 121, 198, 0.08)' },
              };

              const activeStats = chainStats[selectedChain.id] || chainStats.ethereum;

              return (
                <div className="space-y-8">
                  {/* Glassmorphic Neon Hero: Large Portfolio Balance Card */}
                  <div className="relative overflow-hidden glass rounded-[2.5rem] border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {/* Glowing neon accent background */}
                    <div 
                      className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-45 transition-all duration-700"
                      style={{ backgroundColor: activeStats.accentColor }}
                    />
                    
                    {/* Visual corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-[2.5rem] opacity-40" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500 rounded-br-[2.5rem] opacity-40" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
                      {/* Left Block: Core Numbers */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono tracking-[0.3em] text-[#06b6d4] uppercase block">
                            CRITICAL ASSET TELEMETRY: {selectedChain.name.toUpperCase()} ENGINE
                          </span>
                          {sessionWallet === 'metamask' && (
                            <span className="flex items-center gap-1 text-[9px] bg-amber-500/10 text-amber-500 rounded px-2 py-0.5 border border-amber-500/20 font-mono font-black uppercase">
                              <MetaMaskLogo className="w-3.5 h-3.5" /> MetaMask Active
                            </span>
                          )}
                        </div>

                        <h3 className="text-zinc-400 text-xs sm:text-sm font-mono uppercase tracking-widest">
                          Unified Multi-Chain Net Worth
                        </h3>

                        <div className="flex flex-wrap items-baseline gap-4.5">
                          <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-sans drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {activeStats.balance}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-black tracking-wider ${activeStats.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(248,113,113,0.15)]'}`}>
                            {activeStats.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                            {activeStats.pnl}
                          </span>
                        </div>

                        <p className="text-zinc-400 text-xs max-w-xl">
                          Aggregated portfolio balance tracked in real-time. Neon visual components recalculate instantly on network switches using the EVM engine above.
                        </p>
                      </div>

                      {/* Right Block: Bento Quick Metrics */}
                      <div className="lg:col-span-1 p-6 rounded-3xl bg-black/45 border border-white/5 space-y-4 shadow-inner">
                        <span className="text-[9px] font-mono tracking-widest text-[#a855f7] block uppercase font-bold">
                          // QUICK METRIC CORES
                        </span>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Active Tokens</span>
                            <span className="text-lg font-black text-white tracking-tight">{activeStats.assets}</span>
                          </div>
                          
                          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9px] text-zinc-500 font-mono block uppercase">L2 Gas Saved</span>
                            <span className="text-lg font-black text-emerald-400 tracking-tight">{activeStats.gasSaved}</span>
                          </div>

                          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9px] text-zinc-500 font-mono block uppercase">RPC Latency</span>
                            <span className="text-lg font-black text-cyan-400 tracking-tight">14ms</span>
                          </div>
                          
                          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Index Health</span>
                            <span className="text-lg font-black text-[#14f195] tracking-tight uppercase">100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatsCard 
                      title={`${selectedChain.name} Price`} 
                      value={selectedChain.price} 
                      trend={`${selectedChain.change24h.value} Past 24h`} 
                      icon={<TrendingUp className="w-5 h-5 text-indigo-400 text-glow-purple" />} 
                    />
                    <StatsCard 
                      title={`${selectedChain.name} TVL Block`} 
                      value={selectedChain.metrics.tvl} 
                      trend="Dynamic Node Liquidity" 
                      icon={<Layers className="w-5 h-5 text-cyan-400 text-glow-cyan" />} 
                    />
                    <StatsCard 
                      title={`${selectedChain.name} Volume 24h`} 
                      value={selectedChain.metrics.volume24h} 
                      trend="Validated Ledger Ingress" 
                      icon={<Wallet className="w-5 h-5 text-pink-400 text-glow-pink" />} 
                    />
                    <StatsCard 
                      title={`${selectedChain.name} Index Speed`} 
                      value={selectedChain.metrics.speedTps} 
                      trend={`Fee Avg: ${selectedChain.metrics.avgGas}`} 
                      icon={<Activity className="w-5 h-5 text-[#14f195]" />} 
                    />
                  </div>

                  {/* Dynamic Centered Chart Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Price Chart */}
                    <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/5 tracking-widest hidden md:block">
                        SAAS_CHART_TELEMETRY_LINK
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                            Real-Time Pricing Matrix
                          </h3>
                          <p className="text-zinc-400 text-xs mt-1">
                            Interactive trend graphs for {selectedChain.name}. Neon accent: <span className="font-mono text-[10px]" style={{ color: activeStats.accentColor }}>{activeStats.accentColor}</span>.
                          </p>
                        </div>

                        {/* Fast selectors */}
                        <div className="flex flex-wrap gap-1 p-1 bg-black/45 border border-white/5 rounded-xl self-start sm:self-auto">
                          {ECOSYSTEMS.slice(0, 5).map((chain) => (
                            <button
                              key={chain.id}
                              onClick={() => setSelectedChain(chain)}
                              className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer ${selectedChain.id === chain.id ? 'bg-[#3b82f6]/20 text-cyan-300 border border-[#3b82f6]/30' : 'text-zinc-500 hover:text-white'}`}
                            >
                              {chain.symbol}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-[320px]">
                        <AnalyticsChart selectedChainId={selectedChain.id} />
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/5 text-center font-mono text-[10px] sm:text-xs">
                        <div>
                          <span className="text-zinc-500 text-[9px] uppercase">TVL Depth</span>
                          <p className="font-extrabold text-white mt-1">{selectedChain.metrics.tvl}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[9px] uppercase">Peak Speed</span>
                          <p className="font-extrabold text-[#14f195] mt-1">{selectedChain.metrics.speedTps}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[9px] uppercase">Avg Gas</span>
                          <p className="font-extrabold text-[#ff79c6] mt-1">{selectedChain.metrics.avgGas}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI insights summary panel */}
                    <div className="lg:col-span-1">
                      <AIInsightPanel />
                    </div>
                  </div>

                  {/* Bottom Layout: NFT Analytics, Trending Tokens, and Live Transactions */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Live Transaction Feed */}
                    <div className="xl:col-span-1 glass rounded-[2.5rem] p-7 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Flame className="w-5 h-5 text-[#ff0420] animate-bounce" />
                            Live Ingress Feed
                          </h3>
                          <span className="px-2.5 py-1 font-mono text-[8px] border border-red-500/30 text-red-400 bg-red-950/20 rounded-md uppercase tracking-wider animate-pulse">
                            Consolidated
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mb-4">
                          Global multi-chain RPC events recorded to our secure indexing gateway in real-time.
                        </p>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                          <AnimatePresence initial={false}>
                            {liveTxs.map((tx) => {
                              const isTransfer = tx.type === 'Transfer';
                              const isSwap = tx.type === 'Swap';
                              const isStake = tx.type === 'Stake';
                              
                              return (
                                <motion.div 
                                  key={tx.id}
                                  initial={{ opacity: 0, scale: 0.96 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.96 }}
                                  transition={{ duration: 0.2 }}
                                  className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all flex items-center justify-between gap-3 text-left group"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className={`px-2 py-1 rounded-lg font-mono text-[8px] font-black tracking-widest leading-none ${isTransfer ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : isSwap ? 'bg-emerald-500/10 text-[#14f195] border border-emerald-500/20' : isStake ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                                      {tx.type.slice(0, 4).toUpperCase()}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-[11px] font-black text-zinc-100 group-hover:text-cyan-400 transition-colors uppercase tracking-tight truncate">{tx.value}</p>
                                      <span className="text-[9px] text-zinc-550 font-mono block truncate">Hash: {tx.hash} on {tx.chain}</span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-[8px] font-mono text-zinc-500 block uppercase">Gas: {tx.gas}</span>
                                    <span className="text-[8px] font-mono text-[#14f195] uppercase font-black tracking-widest bg-[#14f195]/5 px-1 rounded block mt-0.5">{tx.timestamp}</span>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Trending Tokens Panel */}
                    <div className="xl:col-span-1 glass rounded-[2.5rem] p-7 border border-white/5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <TrendingUp className="w-4.5 h-4.5 text-[#3b82f6]" />
                          Trending Tokens
                        </h3>
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">
                          HOLOGRAPHIC
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-4">
                        Leading liquid utility tokens and governance cores sorted by real-time quantitative velocity.
                      </p>

                      <div className="space-y-3">
                        {TRENDING_TOKENS.slice(0, 5).map((token) => (
                          <div 
                            key={token.id}
                            className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#14f195]/20 rounded-2xl transition-all flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500/10 to-pink-500/10 border border-white/5 flex items-center justify-center font-mono text-xs font-black text-white">
                                {token.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <span className="text-[11px] font-black text-white block uppercase">{token.name}</span>
                                <span className="text-[9px] text-zinc-500 font-mono block uppercase">{token.symbol} • {token.chain}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] font-black text-zinc-100 block">{token.price}</span>
                              <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider block ${token.change24h.isPositive ? 'text-[#14f195]' : 'text-rose-400'}`}>
                                {token.change24h.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* NFT Analytics Section */}
                    <div className="xl:col-span-1 glass rounded-[2.5rem] p-7 border border-white/5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Layers className="w-4.5 h-4.5 text-[#a855f7]" />
                          NFT Floor Analytics
                        </h3>
                        <span className="text-[9px] font-mono text-pink-400 uppercase tracking-widest bg-pink-500/5 border border-pink-500/15 px-2 py-0.5 rounded">
                          HOT_SALES
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-4">
                        High-liquidity digital art vaults tracked globally. Floor data is aggregated across marketplaces.
                      </p>

                      <div className="space-y-3">
                        {NFT_COLLECTIONS.slice(0, 4).map((nft) => (
                          <div 
                            key={nft.id}
                            className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#a855f7]/20 rounded-2xl transition-all flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img 
                                src={nft.image} 
                                alt={nft.name} 
                                className="w-8 h-8 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform duration-350 shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <span className="text-[11px] font-black text-white block truncate uppercase">{nft.name}</span>
                                <span className="text-[9px] text-zinc-500 font-mono block truncate">{nft.chain} • Rarity {nft.rarityScore}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-black text-zinc-100 block">{nft.floorPrice}</span>
                              <span className="text-[8.5px] font-mono text-[#14f195] uppercase block">{nft.change24h}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

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

      {/* Custom Connect Wallet Modal Overlay */}
      <AnimatePresence>
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[2.5rem] p-6 sm:p-7.5 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden text-zinc-100"
            >
              {/* Corner Cyber accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500 rounded-tl-[2.5rem] pointer-events-none opacity-55" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500 rounded-tr-[2.5rem] pointer-events-none opacity-55" />

              {/* Close Button */}
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 border border-white/5 hover:border-white/15 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="mb-3 inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                  <Wallet className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Connect Gateway Node</h3>
                <p className="text-[11px] text-zinc-400 mt-1">Select an active cryptographically secure wallet core</p>
              </div>

              {/* List of 5 wallets */}
              <div className="space-y-3">
                {/* 1. Rabby Wallet */}
                <button
                  onClick={() => handleConnect('rabby')}
                  className="w-full p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-indigo-500/40 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/25 transition-all">
                      <Hexagon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Rabby Wallet</span>
                      <span className="text-[10px] text-zinc-500 block font-mono uppercase tracking-wider">EVM ENG • ETH, Base, Polygon</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-550 group-hover:translate-x-1 duration-300" />
                </button>

                {/* 2. Phantom Wallet */}
                <button
                  onClick={() => handleConnect('phantom')}
                  className="w-full p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-[#14f195]/40 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#14f195]/10 border border-[#14f195]/20 group-hover:bg-[#14f195]/25 transition-all">
                      <Ghost className="w-5 h-5 text-[#14f195]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Phantom Wallet</span>
                      <span className="text-[10px] text-zinc-500 block font-mono uppercase tracking-wider">Solana VM • SOL Core API</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:translate-x-1 duration-300" />
                </button>

                {/* 3. Sui Wallet */}
                <button
                  onClick={() => handleConnect('sui')}
                  className="w-full p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-[#38bdf8]/40 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 group-hover:bg-[#38bdf8]/25 transition-all">
                      <Droplet className="w-5 h-5 text-[#38bdf8]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Sui Wallet</span>
                      <span className="text-[10px] text-zinc-500 block font-mono uppercase tracking-wider">Sui Object Ledger Hub</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:translate-x-1 duration-300" />
                </button>

                {/* 4. Petra Wallet */}
                <button
                  onClick={() => handleConnect('petra')}
                  className="w-full p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-[#ff2d55]/40 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#ff2d55]/10 border border-[#ff2d55]/20 group-hover:bg-[#ff2d55]/25 transition-all">
                      <Zap className="w-5 h-5 text-[#ff2d55]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Petra Wallet</span>
                      <span className="text-[10px] text-zinc-500 block font-mono uppercase tracking-wider">Aptos Move Indexer</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:translate-x-1 duration-300" />
                </button>

                {/* 5. Keplr Wallet */}
                <button
                  onClick={() => handleConnect('keplr')}
                  className="w-full p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-[#ff79c6]/40 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#ff79c6]/10 border border-[#ff79c6]/20 group-hover:bg-[#ff79c6]/25 transition-all">
                      <Compass className="w-5 h-5 text-[#ff79c6]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Keplr Wallet</span>
                      <span className="text-[10px] text-zinc-500 block font-mono uppercase tracking-wider">Cosmos Tendermint Engine</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:translate-x-1 duration-300" />
                </button>
              </div>

              <div className="mt-5 text-center">
                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">
                  Shelby Secure Authentication Gateway
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
