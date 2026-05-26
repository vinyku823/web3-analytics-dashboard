import React, { useState } from 'react';
import { TRENDING_TOKENS, TrendingToken } from '../data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Cpu, 
  Layers, 
  Plus, 
  Share2, 
  Sliders, 
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp as TrendIcon,
  Zap
} from 'lucide-react';

export function TokensDashboard() {
  const [tokens, setTokens] = useState<TrendingToken[]>(TRENDING_TOKENS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('All');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeToken, setStakeToken] = useState<string>('ETH');
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [stakeLogs, setStakeLogs] = useState<string[]>([]);
  const [isStaking, setIsStaking] = useState(false);

  // Filter tokens
  const filtered = tokens.filter(tok => {
    const matchesSearch = tok.name.toLowerCase().includes(searchTerm.toLowerCase()) || tok.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChain = selectedChain === 'All' || tok.chain === selectedChain;
    return matchesSearch && matchesChain;
  });

  // Render SVG Sparkline
  const renderSparkline = (data: number[], isPositive: boolean) => {
    if (data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const width = 120;
    const height = 40;
    
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height + 2; // Offset padded
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isPositive ? '#14f195' : '#ff2d55';
    const fillGradientId = `gradient-${Math.random().toString(36).substr(2, 5)}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Closed path for neon gradient fill */}
        <path
          d={`M 0,${height} L ${points} L ${width},${height} Z`}
          fill={`url(#${fillGradientId})`}
        />
        {/* Actual sparkline stroke */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_4px_rgba(20,241,149,0.3)]"
        />
      </svg>
    );
  };

  const executeStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    setIsStaking(true);
    setTimeout(() => {
      const randomValidator = ['Omega-1', 'CyberNode-9', 'Vertex-EVM', 'PhantomSync-4'][Math.floor(Math.random() * 4)];
      const txId = Math.random().toString(16).substr(2, 9).toUpperCase();
      
      setStakeLogs(prev => [
        `RESOLVED: Staked ${stakeAmount} ${stakeToken} with Validator '${randomValidator}'. APR estimate: 8.42%. Tx: 0x${txId}`,
        ...prev
      ].slice(0, 5));
      
      setIsStaking(false);
      setShowStakeModal(false);
      setStakeAmount('');
    }, 1500);
  };

  return (
    <div className="space-y-8 cyber-grid">
      {/* Overview stats & banner */}
      <div className="relative group overflow-hidden rounded-[2rem] p-8 bg-gradient-to-tr from-cyan-950/20 via-zinc-900/30 to-black border border-cyan-500/10">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-cyan-500/40 tracking-wider">
          MARKET_LIQUIDITY_INDEX_v0.4
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono tracking-widest text-[#14f195] uppercase flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#14f195] animate-pulse" />
              On-Chain Capital Aggregates
            </span>
            <h2 className="text-3xl font-black mb-3">Trending Asset Matrices</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Analyze on-chain valuation indices and real-time capital flow benchmarks. Liquid stake assets seamlessly to generate security yield.
            </p>
          </div>
          <button
            onClick={() => setShowStakeModal(true)}
            className="self-start md:self-auto py-3 px-6 bg-[#14f195]/10 hover:bg-[#14f195]/20 border border-[#14f195]/30 text-[#14f195] font-bold font-mono text-xs rounded-2xl tracking-wider transition-all shadow-[0_0_15px_rgba(20,241,149,0.08)]"
          >
            LIQUID STAKE ASSETS
          </button>
        </div>
      </div>

      {stakeLogs.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#14f195]/5 border border-[#14f195]/20 font-mono text-xs text-[#14f195] space-y-1">
          <div className="font-bold flex items-center gap-2 text-[10px] text-white/60 mb-1 uppercase tracking-widest">
            🛡️ Staking validator event log sync:
          </div>
          {stakeLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span>&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 border border-white/[0.05] rounded-xl self-start md:self-auto">
          {['All', 'Ethereum', 'Solana', 'Sui', 'Polygon', 'Aptos', 'Cosmos'].map((chainName) => (
            <button
              key={chainName}
              onClick={() => setSelectedChain(chainName)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${selectedChain === chainName ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/40 hover:text-white/80'}`}
            >
              {chainName.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/40 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono"
          />
        </div>
      </div>

      {/* Token Matrix Table */}
      <div className="glass rounded-[2rem] overflow-hidden border-white/[0.05]">
        <div className="p-6 pb-0 border-b border-white/[0.05] flex items-center justify-between">
          <h4 className="font-bold tracking-tight text-white/80">Real-Time Crypto Asset Indexes</h4>
          <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Index streams updated just now • Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 font-mono text-[9px] text-white/30 uppercase tracking-widest">
                <th className="p-6">Asset Token</th>
                <th className="p-6">Ecosystem</th>
                <th className="p-6">Active Price</th>
                <th className="p-6">24h Val delta</th>
                <th className="p-6">Aggregated volume</th>
                <th className="p-6">Market Cap index</th>
                <th className="p-6 text-center">Historical delta Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.map((tok) => {
                const isPos = tok.change24h.isPositive;
                return (
                  <tr key={tok.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-black font-mono text-xs group-hover:border-cyan-500/20 transition-all">
                          {tok.symbol}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-cyan-400 transition-all">{tok.name}</p>
                          <span className="text-[10px] text-white/30 font-mono tracking-wider">{tok.symbol}_TOKEN_METRIC</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 py-5 font-mono text-xs text-white/60">
                      {tok.chain}
                    </td>
                    <td className="p-6 py-5 font-mono text-sm font-semibold text-white/95">
                      {tok.price}
                    </td>
                    <td className="p-6 py-5">
                      <span className={`p-1.5 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 w-fit ${isPos ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                        {isPos ? '+' : ''}{tok.change24h.value}
                      </span>
                    </td>
                    <td className="p-6 py-5 font-mono text-xs text-white/50">
                      {tok.volume24h}
                    </td>
                    <td className="p-6 py-5 font-mono text-xs text-white/50">
                      {tok.marketCap}
                    </td>
                    <td className="p-6 py-5 flex justify-center">
                      <div className="py-1">
                        {renderSparkline(tok.sparkline, isPos)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div onClick={() => setShowStakeModal(false)} className="absolute inset-0 bg-black/8 w-full h-full backdrop-blur-md bg-opacity-70" />
          <div className="relative w-full max-w-md glass rounded-[2rem] p-8 border-cyan-500/30 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold font-mono text-cyan-400 tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
              LIQUID_STAKE_MODULE_INIT
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Deposit your assets into highly efficient validator pools across multiple chains. Capital is liquid-staked to guarantee high uptime indexing performance.
            </p>

            <form onSubmit={executeStake} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1.5">SELECT NETWORK TARGET</label>
                <select 
                  value={stakeToken}
                  onChange={(e) => setStakeToken(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500/40 text-xs font-mono"
                >
                  <option value="ETH" className="bg-[#12101e]">Ethereum Core (APR: 4.8%)</option>
                  <option value="SOL" className="bg-[#12101e]">Solana JupPool (APR: 7.2%)</option>
                  <option value="SUI" className="bg-[#12101e]">Sui Network (APR: 6.90%)</option>
                  <option value="APT" className="bg-[#12101e]">Aptos Network (APR: 5.45%)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1.5">CAPITAL QUANTITY TO STAKE</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="any"
                    placeholder="0.00"
                    required
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-cyan-500/40 text-xs font-mono text-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-white/40">{stakeToken}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs rounded-xl"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  disabled={isStaking}
                  className="flex-1 py-3 bg-[#14f195] hover:opacity-90 text-black font-semibold text-xs font-mono rounded-xl shadow-[0_0_15px_rgba(20,241,149,0.3)]"
                >
                  {isStaking ? 'RESOLVING_STAKE...' : 'CONFIRM STAKE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
