import React, { useState } from 'react';
import { ECOSYSTEMS, generateHeatmapData, Ecosystem } from '../data/mockData';
import { 
  Network, 
  Layers, 
  Radio, 
  Compass, 
  Activity, 
  Clock, 
  Cpu, 
  CheckSquare, 
  RefreshCw,
  Zap,
  TrendingUp,
  Server
} from 'lucide-react';

export function EcosystemsDashboard() {
  const [activeChain, setActiveChain] = useState<Ecosystem>(ECOSYSTEMS[0]);
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: string; value: number } | null>(null);
  const [gasSimulated, setGasSimulated] = useState<string>('');
  const [testingChainId, setTestingChainId] = useState<string | null>(null);

  const heatmap = generateHeatmapData(activeChain.id);

  // Heatmap block color solver based on activity value & chain color
  const getCellColorStyle = (value: number, baseColor: string) => {
    // scale 0% opacity to 90% opacity based on block value (typically 10-100)
    const ratio = Math.min(1, Math.max(0.1, value / 100));
    
    // Convert hex color to rgba representation for opacity
    if (baseColor === '#14f195') return `rgba(20, 241, 149, ${ratio})`; // Solana
    if (baseColor === '#6366f1') return `rgba(99, 102, 241, ${ratio})`; // Ethereum
    if (baseColor === '#38bdf8') return `rgba(56, 189, 248, ${ratio})`; // Sui
    if (baseColor === '#a855f7') return `rgba(168, 85, 247, ${ratio})`; // Polygon
    if (baseColor === '#ff2d55') return `rgba(255, 45, 85, ${ratio})`; // Aptos
    return `rgba(255, 121, 198, ${ratio})`; // Cosmos ATOM
  };

  const handleRunLatencyTest = (colName: string) => {
    setTestingChainId(colName);
    setTimeout(() => {
      const ping = Math.floor(Math.random() * 80 + 12);
      setGasSimulated(`Pinging ${colName} distributed nodes ... Success! Latency: ${ping}ms | Gas price stable.`);
      setTestingChainId(null);
    }, 1000);
  };

  return (
    <div className="space-y-8 cyber-grid">
      {/* Overview Block */}
      <div className="relative group overflow-hidden rounded-[2rem] p-8 bg-gradient-to-br from-violet-950/20 via-slate-900/40 to-black border border-violet-500/10">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-violet-500/40 tracking-wider">
          ECOSYSTEM_HARMONIZER_v9.2
        </div>
        <div className="max-w-2xl">
          <span className="text-[10px] font-mono tracking-widest text-[#a855f7] uppercase flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-[#a855f7]" />
            Cross-Chain Global Ledger Indexes
          </span>
          <h2 className="text-3xl font-black mb-3">Blockchain Ecosystem Analytics</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Select an active blockchain ecosystem core below to benchmark cross-chain stats, trace specific hourly activity heatmaps and run live node pings.
          </p>
        </div>
      </div>

      {/* Primary Chains selector cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {ECOSYSTEMS.map((chain) => {
          const isActive = activeChain.id === chain.id;
          return (
            <button
              key={chain.id}
              onClick={() => {
                setActiveChain(chain);
                setGasSimulated('');
              }}
              className={`p-5 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden group ${isActive ? 'bg-[#0b0a14] border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.06)] scale-[1.03]' : 'bg-white/[0.02] border-white/5 opacity-75 hover:opacity-100 hover:bg-white/[0.04]'}`}
            >
              {/* Colored glow badge */}
              <div 
                className="absolute top-0 left-0 w-full h-1" 
                style={{ backgroundColor: chain.color }} 
              />
              <span className="text-[9px] text-white/30 font-mono block mb-1 uppercase tracking-wider">{chain.symbol} LAYER</span>
              <p className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{chain.name}</p>
              <p className="text-xs text-white/60 font-mono mt-2" style={{ color: isActive ? chain.color : 'rgba(255,255,255,0.4)' }}>
                {chain.price}
              </p>
              <p className={`text-[10px] font-mono mt-1 ${chain.change24h.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {chain.change24h.value}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* On-Chain Heatmap Panel */}
        <div className="lg:col-span-2 glass rounded-[2rem] p-8 border-white/[0.05] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" /> Hourly On-Chain Load Heatmap
                </h3>
                <p className="text-xs text-white/40 font-mono mt-1 uppercase tracking-wider">
                  Analyzing load indexing for {activeChain.name} • 7 Days x 24 Hours
                </p>
              </div>

              {/* Informative index indicators */}
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40">
                <span>IDLE</span>
                <div className="w-3 h-3 bg-white/5 rounded-sm" />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: activeChain.color, opacity: 0.3 }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: activeChain.color, opacity: 0.7 }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: activeChain.color }} />
                <span>BURNING LOAD</span>
              </div>
            </div>

            {/* Heatmap Grid Wrapper */}
            <div className="space-y-2">
              {heatmap.map((row) => (
                <div key={row.day} className="flex items-center gap-2">
                  {/* Day Indicator */}
                  <span className="w-8 text-[10px] font-mono font-bold text-white/40 uppercase text-right">{row.day}</span>
                  
                  {/* Hours Cells wrapper */}
                  <div className="flex-1 grid grid-cols-24 gap-1 sm:gap-1.5">
                    {row.hours.map((cell) => {
                      const isHovered = hoveredCell && hoveredCell.day === row.day && hoveredCell.hour === cell.hour;
                      return (
                        <div
                          key={cell.hour}
                          onMouseEnter={() => setHoveredCell({ day: row.day, hour: cell.hour, value: cell.value })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`aspect-square min-w-4 rounded-md transition-all cursor-pointer relative ${isHovered ? 'ring-2 ring-white scale-125 z-10' : ''}`}
                          style={{ backgroundColor: getCellColorStyle(cell.value, activeChain.color) }}
                        >
                          {/* Hover tooltip inline */}
                          {isHovered && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 rounded-xl bg-[#0e0c15] border border-white/20 text-[10px] font-mono text-white whitespace-nowrap shadow-2xl z-50">
                              <p className="font-bold text-cyan-400">{row.day} @ {cell.hour}</p>
                              <p className="text-white/70 mt-0.5">METRIC: {cell.value}M Tx / Hour</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Hour footer labels */}
            <div className="flex items-center gap-2 mt-4 ml-10 justify-between font-mono text-[8px] text-white/20">
              <span>00:00 KERNEL</span>
              <span>06:00 DAWN</span>
              <span>12:00 MIDDAY</span>
              <span>18:00 DUSK</span>
              <span>24:00 SOLSTICE</span>
            </div>
          </div>

          <p className="text-white/30 text-[10px] mt-6 font-mono leading-relaxed border-t border-white/[0.04] pt-4 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-white/30" /> Hover block cells to audit real-time hour delta load. Seed aggregates computed over past 30 days.
          </p>
        </div>

        {/* Ecosystem Specific Detailed Metrics */}
        <div className="space-y-6">
          <div className="glass rounded-[2rem] p-8 border-white/[0.05] relative overflow-hidden flex flex-col justify-between h-full">
            <div>
              <div className="absolute top-4 right-4 text-glow-cyan">
                {activeChain.symbol === 'ETH' ? '🌌' : activeChain.symbol === 'SOL' ? '🔱' : '⚡'}
              </div>
              
              <h3 className="text-lg font-bold mb-1">{activeChain.name} Profile</h3>
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-6" style={{ color: activeChain.color }}>
                {activeChain.symbol}_CORESYNC
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-white/40 uppercase">Total Value Locked</span>
                  <span className="font-bold text-white">{activeChain.metrics.tvl}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-white/40 uppercase">24h Vol Index</span>
                  <span className="font-bold text-white">{activeChain.metrics.volume24h}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-white/40 uppercase">Ecosystem Users</span>
                  <span className="font-bold text-white">{activeChain.metrics.activeUsers24h}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-white/40 uppercase">Real Gas Cost Price</span>
                  <span className="font-bold text-white" style={{ color: activeChain.color }}>{activeChain.metrics.avgGas}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-white/40 uppercase">Consensus Throughput</span>
                  <span className="font-bold text-[#14f195] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 animate-bounce text-[#14f195]" />
                    {activeChain.metrics.speedTps}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.04] space-y-4">
              <button
                onClick={() => handleRunLatencyTest(activeChain.name)}
                disabled={testingChainId !== null}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-white border border-white/10 font-bold font-mono text-[10px] tracking-wider rounded-xl transition-all"
              >
                {testingChainId === activeChain.name ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    PING_TELEMETRY_STREAMING...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4 text-white/50" />
                    RUN NODE PING LATENCY TEST
                  </>
                )}
              </button>

              {gasSimulated && (
                <div className="p-3 rounded-lg bg-black/60 border border-green-500/20 text-[10px] font-mono text-green-400 leading-relaxed text-center animate-pulse">
                  {gasSimulated}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
