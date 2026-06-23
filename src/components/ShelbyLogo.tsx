import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const ShelbyLogo: React.FC = () => {
  return (
    <div id="shelby-logo" className="flex items-center gap-2 group cursor-pointer select-none">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(45,212,191,0.15)] group-hover:scale-105 transition-all duration-300">
        <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center font-bold text-white relative">
          <span className="text-sm tracking-tighter text-teal-400 group-hover:text-white transition-all font-black">S</span>
          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-teal-300 rounded-full animate-ping" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-white tracking-widest uppercase leading-none">SHELBY</span>
        <span className="text-[8px] font-mono text-zinc-500 tracking-wider uppercase leading-none mt-1">Cross-Chain Terminal</span>
      </div>
    </div>
  );
};
