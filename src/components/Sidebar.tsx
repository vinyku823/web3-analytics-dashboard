import React from 'react';
import { 
  Home, 
  Wallet, 
  BarChart3, 
  Image, 
  Network, 
  MessageSquare, 
  Zap, 
  Bell, 
  LogOut,
  Hexagon,
  Cpu,
  Radio
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Overview Orbit', icon: Home, color: 'text-indigo-400 font-bold' },
    { id: 'wallet', label: 'Wallet Indexer', icon: Wallet, color: 'text-cyan-400 font-bold' },
    { id: 'tokens', label: 'Trending Matrices', icon: BarChart3, color: 'text-emerald-400 font-bold' },
    { id: 'nft', label: 'NFT Live Sweeper', icon: Image, color: 'text-pink-400 font-bold' },
    { id: 'ecosystems', label: 'Blockchain Cores', icon: Network, color: 'text-purple-400 font-bold' },
    { id: 'community', label: 'Gemini AI Chat', icon: MessageSquare, color: 'text-fuchsia-400 font-bold' },
    { id: 'alerts', label: 'Holographic Alerts', icon: Bell, color: 'text-yellow-400 font-bold' },
  ];

  return (
    <aside className="w-80 glass border-r border-white/[0.05] fixed h-full hidden lg:flex flex-col z-50 p-6">
      {/* Spinning branding loader */}
      <div className="p-4 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/30 neon-glow-purple">
            <Hexagon className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <span className="text-sm font-black tracking-[0.2em] bg-gradient-to-r from-amber-400 via-orange-300 to-white bg-clip-text text-transparent block">SHELBY</span>
            <span className="text-[8px] font-mono tracking-widest text-amber-500/50 uppercase block">ANALYTICS ENGINE</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation list */}
      <nav className="flex-1 space-y-2 px-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all duration-300 group relative font-mono text-xs text-left",
                isActive 
                  ? "bg-indigo-500/10 text-white border border-indigo-500/25 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                  : "text-white/45 hover:text-white hover:bg-white/[0.03] border border-transparent"
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-7 bg-indigo-400 rounded-full animate-pulse" />
              )}
              <item.icon className={cn(
                "w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-115",
                isActive ? "text-indigo-400" : "text-white/30"
              )} />
              <span className="font-bold tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer statistics module */}
      <div className="p-1 mt-auto">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.04] mb-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14f195] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14f195]" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-3.5 h-3.5 text-[#14f195]" />
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none">Global Oracle Links</span>
          </div>
          <p className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wider">ONLINE / SYNCED SECURE</p>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider text-white/40 hover:text-[#ff2d55] hover:bg-[#ff2d55]/5 border border-transparent transition-all duration-300">
          <LogOut className="w-4.5 h-4.5" />
          <span>TERMINATE_PORT</span>
        </button>
      </div>
    </aside>
  );
}
