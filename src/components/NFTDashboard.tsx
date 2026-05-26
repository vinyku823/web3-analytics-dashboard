import React, { useState } from 'react';
import { NFT_COLLECTIONS, NFTCollection } from '../data/mockData';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Flame, 
  Compass, 
  DollarSign, 
  Zap,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export function NFTDashboard() {
  const [collections, setCollections] = useState<NFTCollection[]>(NFT_COLLECTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState<string>('All');
  const [sweepLog, setSweepLog] = useState<string[]>([]);
  const [sweepingIndex, setSweepingIndex] = useState<string | null>(null);

  // Filter collections
  const filtered = collections.filter(col => {
    const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChain = selectedChain === 'All' || col.chain === selectedChain;
    return matchesSearch && matchesChain;
  });

  // Simulated sweep handle
  const handleSweepFloor = (colId: string, colName: string, floorPrice: string) => {
    setSweepingIndex(colId);
    setTimeout(() => {
      const itemsSwept = Math.floor(Math.random() * 4) + 2;
      const totalCostStr = (parseFloat(floorPrice) * itemsSwept).toFixed(1);
      const randomTx = Math.random().toString(36).substring(3, 11).toUpperCase();
      
      setSweepLog(prev => [
        `SWEEP_SUCCESS: [${colName}] swept ${itemsSwept} assets at floor. Total: ${totalCostStr} (${floorPrice} ea). Tx: 0x${randomTx}`,
        ...prev
      ].slice(0, 4));
      
      setSweepingIndex(null);
    }, 1200);
  };

  return (
    <div className="space-y-8 cyber-grid">
      {/* Top Banner and Stat overview */}
      <div className="relative group overflow-hidden rounded-[2rem] p-8 bg-gradient-to-tr from-pink-950/20 via-zinc-900/30 to-black border border-pink-500/10">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-pink-500/40 tracking-wider">
          HYPERION_NFT_INDEX_v1.0
        </div>
        
        <div className="max-w-2xl">
          <span className="text-[10px] font-mono tracking-widest text-[#ff2d55] uppercase flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-[#ff2d55] animate-bounce" />
            Live Burning Liquidity Floor Sweeper
          </span>
          <h2 className="text-3xl font-black mb-3">Multichain NFT Intelligence</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Scan and benchmark digital collectibles across heterogeneous networks. Calculate immediate asset parity, rarity scores, and initiate high-speed automated sweeps.
          </p>
        </div>
      </div>

      {/* Rarity & Sweep Log section if active */}
      {sweepLog.length > 0 && (
        <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 font-mono text-xs text-pink-400 space-y-1.5 animate-pulse-fast">
          <div className="font-bold flex items-center gap-2 mb-1 text-[11px] uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Sweep execution terminal reporting:
          </div>
          {sweepLog.map((log, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="text-white/30">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 border border-white/[0.05] rounded-xl self-start md:self-auto">
          {['All', 'Ethereum', 'Solana', 'Sui', 'Aptos', 'Cosmos'].map((chainName) => (
            <button
              key={chainName}
              onClick={() => setSelectedChain(chainName)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${selectedChain === chainName ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 shadow-[0_0_10px_rgba(255,45,85,0.15)]' : 'text-white/40 hover:text-white/80'}`}
            >
              {chainName.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search index..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-pink-500/40 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono"
          />
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isFloorUp = item.change24h.startsWith('+');
          const isSweeping = sweepingIndex === item.id;
          
          return (
            <div key={item.id} className="glass rounded-[2rem] overflow-hidden group hover:border-pink-500/30 transition-all duration-300 relative">
              {/* Image banner */}
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a15] to-transparent" />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg font-mono text-[9px] uppercase font-bold tracking-wider border border-white/[0.08]">
                  {item.chain}
                </span>
                <span className="absolute bottom-3 right-4 font-mono text-[9px] text-[#ff2d55]">
                  RARITY INDEX: {item.rarityScore}%
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-md font-bold text-white group-hover:text-pink-400 transition-colors">{item.name}</h4>
                    <p className="text-[10px] text-white/40 font-mono text-glow-pink">{item.listings} listings active</p>
                  </div>
                  <div className={`p-1.5 px-2.5 rounded-lg flex items-center gap-1 text-[10px] font-mono font-bold ${isFloorUp ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                    {isFloorUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{item.change24h}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.05] text-xs font-mono">
                  <div>
                    <p className="text-[9px] text-white/30 uppercase">Floor Price</p>
                    <p className="font-bold text-sm text-white/95 mt-0.5">{item.floorPrice}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase">24h Vol</p>
                    <p className="font-bold text-sm text-white/95 mt-0.5">{item.volume24h}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleSweepFloor(item.id, item.name, item.floorPrice)}
                  disabled={isSweeping}
                  className={`w-full py-3 rounded-xl font-bold font-mono text-xs transition-all relative overflow-hidden text-center flex items-center justify-center gap-2 ${isSweeping ? 'bg-pink-500/10 text-pink-300 pointer-events-none' : 'bg-white/[0.03] hover:bg-pink-500/20 hover:text-white hover:border-pink-500/40 text-glow-pink border border-white/[0.08]'}`}
                >
                  {isSweeping ? (
                    <>
                      <Compass className="w-4 h-4 animate-spin" />
                      SWEEPING...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-pink-400" />
                      AUTO-SWEEP FLOOR
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
