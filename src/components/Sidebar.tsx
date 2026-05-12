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
  Settings,
  LogOut,
  Hexagon
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const menuItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'wallet', label: 'Wallet Analytics', icon: Wallet },
    { id: 'tokens', label: 'Trending Tokens', icon: BarChart3 },
    { id: 'nft', label: 'NFT Trends', icon: Image },
    { id: 'ecosystems', label: 'Ecosystems', icon: Network },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'ai', label: 'AI Insights', icon: Zap },
    { id: 'alerts', label: 'Alert Center', icon: Bell },
  ];

  return (
    <aside className="w-72 glass border-r-0 fixed h-full hidden lg:flex flex-col z-50">
      <div className="p-8 pb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/40 neon-border">
            <Hexagon className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <span className="text-xl font-bold tracking-tighter">Web3 Analytics</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
              activeTab === item.id 
                ? "bg-primary/20 text-white border border-primary/30" 
                : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              activeTab === item.id ? "text-primary" : "text-white/30"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Network Status</span>
          </div>
          <p className="text-xs font-medium">Healthy / Syncing</p>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
