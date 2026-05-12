import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { StatsCard } from './StatsCard';
import { AnalyticsChart } from './AnalyticsChart';
import { AIInsightPanel } from './AIInsightPanel';
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  Layers, 
  Users, 
  AlertCircle,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { WalletDashboard } from './WalletDashboard';
import { AlertsCenter } from './AlertsCenter';

export function Dashboard() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState('home');

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <div className="mb-8 inline-flex items-center justify-center p-4 rounded-3xl bg-primary/10 border border-primary/20 neon-border">
            <Activity className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
            ChainPulse <span className="text-primary font-mono italic text-4xl md:text-6xl">AI</span>
          </h1>
          <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-xl mx-auto">
            The next generation of Web3 intelligence. Track on-chain activity, token trends, and AI-powered ecosystem growth in one premium portal.
          </p>
          <div className="flex justify-center scale-125">
            <ConnectKitButton />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:pl-72 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
            </h2>
            <p className="text-white/50 text-sm font-mono uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Feed • Block #{Math.floor(Date.now() / 12000).toString().slice(-6)}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search wallet, token, tx..."
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
              />
            </div>
            <ConnectKitButton />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {activeTab === 'home' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard 
                    title="Total Value Tracked" 
                    value="$12.48B" 
                    trend="+12.4%" 
                    icon={<TrendingUp className="w-5 h-5 text-green-400" />} 
                  />
                  <StatsCard 
                    title="Active Ecosystems" 
                    value="6 Major" 
                    trend="ETH Leader" 
                    icon={<Layers className="w-5 h-5 text-blue-400" />} 
                  />
                  <StatsCard 
                    title="Whale Activity (24h)" 
                    value="1,248 Lg Tx" 
                    trend="+5.2%" 
                    icon={<Users className="w-5 h-5 text-purple-400" />} 
                  />
                  <StatsCard 
                    title="Avg Gas Price" 
                    value="18 Gwei" 
                    trend="-2.1%" 
                    icon={<Activity className="w-5 h-5 text-orange-400" />} 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-bold">Ecosystem Growth</h3>
                        <p className="text-white/40 text-sm mt-1">Cross-chain TVL performance</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-lg bg-white/5 text-xs border border-white/10">30D</span>
                        <span className="px-3 py-1 rounded-lg bg-primary/20 text-xs border border-primary/30 text-primary">All Time</span>
                      </div>
                    </div>
                    <div className="h-[400px]">
                      <AnalyticsChart />
                    </div>
                  </div>
                  
                  <AIInsightPanel />
                </div>
              </>
            )}

            {activeTab === 'wallet' && <WalletDashboard />}
            {activeTab === 'alerts' && <AlertsCenter />}
            
            {activeTab !== 'home' && activeTab !== 'wallet' && activeTab !== 'alerts' && (

              <div className="glass rounded-3xl p-12 text-center">
                <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
                <p className="text-white/40">This module is being connected to the {activeTab} analytics stream.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
