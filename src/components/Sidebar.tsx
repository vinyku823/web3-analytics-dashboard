import React from 'react';
import { Home, MessageSquare, Compass, Bell, Cpu, Layers } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedChain: { id: string; name: string };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedChain,
}) => {
  const links = [
    { id: 'home', label: 'Terminal Core', icon: Home, subtitle: 'Portfolio & DEX' },
    { id: 'a2z', label: 'A2Z Chain Link', icon: Cpu, subtitle: 'A-to-Z Address Explorer' },
    { id: 'ai', label: 'Shelby AI Agent', icon: MessageSquare, subtitle: 'Defi LLM Copilot' },
    { id: 'ecosystems', label: 'Ecosystem Rails', icon: Compass, subtitle: 'Gas & TVL Stats' },
  ];

  return (
    <aside id="terminal-sidebar" className="w-full lg:w-64 bg-zinc-950 border-r border-white/[0.06] p-6 shrink-0 flex flex-col justify-between h-auto lg:h-[calc(100vh-2rem)] select-none">
      <div className="flex flex-col gap-8">
        {/* Navigation block */}
        <div className="flex flex-col gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isSelected = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`sidebar-link-${link.id}`}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all border group text-left ${
                  isSelected
                    ? 'bg-zinc-900 border-white/[0.08] text-white shadow-lg'
                    : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all ${
                    isSelected ? 'bg-teal-500/10 text-teal-400' : 'bg-transparent text-zinc-600 group-hover:text-zinc-400'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-wide uppercase">{link.label}</span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-0.5">{link.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Network Status indicator widget */}
      <div className="bg-zinc-900/40 border border-white/[0.04] rounded-xl p-4 mt-6">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-400 tracking-wider font-mono uppercase">ONLINE RAILS</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
          <span>Active VM:</span>
          <span className="text-zinc-300 font-bold">{selectedChain.name}</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mt-1">
          <span>Trace Lag:</span>
          <span className="text-teal-400 font-bold">14ms</span>
        </div>
      </div>
    </aside>
  );
};
