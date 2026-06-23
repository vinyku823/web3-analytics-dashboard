import React from 'react';
import { Layers, Activity, Users, Zap, Wallet } from 'lucide-react';
import { ECOSYSTEMS } from '../data/mockData';

export const EcosystemsDashboard: React.FC = () => {
  return (
    <div id="ecosystems-dashboard" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2.5">
            <Layers size={18} className="text-teal-400" />
            Cross-chain Ecosystem Monitors
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">Real-time status of connected Move and EVM VMs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ECOSYSTEMS.map((eco) => (
          <div key={eco.id} id={`eco-card-${eco.id}`} className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden select-none hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{eco.icon}</span>
                <div>
                  <h3 className="text-sm font-black text-white uppercase">{eco.name}</h3>
                  <span className="text-[9px] font-mono text-teal-400 uppercase tracking-widest font-bold">ACTIVE RAILS</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                {eco.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-zinc-950/40 border border-white/[0.02] rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono block">TVL</span>
                <p className="text-base font-black text-white font-mono mt-1">{eco.tvl}</p>
              </div>
              <div className="bg-zinc-950/40 border border-white/[0.02] rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono block">24h Vol</span>
                <p className="text-base font-black text-white font-mono mt-1">{eco.volume24h}</p>
              </div>
              <div className="bg-zinc-950/40 border border-white/[0.02] rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono block">Avg Gas</span>
                <p className="text-base font-black text-teal-400 font-mono mt-1">{eco.avgGas}</p>
              </div>
              <div className="bg-zinc-950/40 border border-white/[0.02] rounded-xl p-3">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono block">Speed</span>
                <p className="text-base font-black text-zinc-300 font-mono mt-1">{eco.speed}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Activity size={12} className="text-zinc-600" />
                <span>24h Txns: <strong className="text-white">{eco.txns24h}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={12} className="text-zinc-600" />
                <span>Active Users: <strong className="text-white">{eco.activeUsers}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
