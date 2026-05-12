import React, { useState } from 'react';
import { Bell, Zap, TrendingUp, AlertTriangle, Plus, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface UserAlert {
  id: string;
  token: string;
  price: string;
  chain: string;
  type: 'increase' | 'decrease';
  createdAt: number;
}

export function AlertsCenter() {
  const [activeAlerts, setActiveAlerts] = useState<UserAlert[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({
    token: '',
    price: '',
    chain: 'Ethereum',
    type: 'increase' as const
  });

  const staticAlerts = [
    { id: '1', type: 'price', title: 'SOL Breakout', desc: 'Solana crossed $150 with high volume.', time: '5m ago', icon: TrendingUp, color: 'text-green-400' },
    { id: '2', type: 'ai', title: 'Whale Alert', desc: 'Large ETH movement detected towards Aave.', time: '12m ago', icon: Zap, color: 'text-primary' },
    { id: '3', type: 'risk', title: 'Gas Spike', desc: 'Ethereum gas prices exceeded 50 gwei.', time: '45m ago', icon: AlertTriangle, color: 'text-orange-400' },
  ];

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.token || !newAlert.price) return;

    const alert: UserAlert = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAlert,
      createdAt: Date.now()
    };

    setActiveAlerts([alert, ...activeAlerts]);
    setShowCreate(false);
    setNewAlert({ token: '', price: '', chain: 'Ethereum', type: 'increase' });
  };

  const removeAlert = (id: string) => {
    setActiveAlerts(activeAlerts.filter(a => a.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass rounded-3xl p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <Bell className="w-6 h-6 text-white/60" />
            </div>
            <h3 className="text-xl font-bold">Live Activity</h3>
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Set Custom Alert
          </button>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {staticAlerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-white/5 ${alert.color}`}>
                  <alert.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold">{alert.title}</h4>
                    <span className="text-[10px] text-white/30 uppercase">{alert.time}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{alert.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-3xl p-8 border-primary/10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            My Watchlist Alerts
          </h3>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {activeAlerts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-white/20"
                >
                  <Bell className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs">No custom alerts set</p>
                </motion.div>
              ) : (
                activeAlerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold">{alert.token}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{alert.chain} • {alert.type === 'increase' ? '>' : '<'} ${alert.price}</p>
                    </div>
                    <button 
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 rounded-lg hover:bg-red-400/10 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass rounded-[2.5rem] p-10 border-primary/20 shadow-2xl"
            >
              <button 
                onClick={() => setShowCreate(false)}
                className="absolute top-8 right-8 p-2 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>

              <h3 className="text-2xl font-bold mb-2">Create Price Alert</h3>
              <p className="text-white/40 text-sm mb-8">Get notified instantly when your target is hit.</p>

              <form onSubmit={handleCreateAlert} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-1">Token Symbol</label>
                  <input 
                    type="text" 
                    placeholder="e.g. BTC, ETH, SOL"
                    required
                    value={newAlert.token}
                    onChange={(e) => setNewAlert({ ...newAlert, token: e.target.value.toUpperCase() })}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-1">Blockchain</label>
                    <div className="relative">
                      <select 
                        value={newAlert.chain}
                        onChange={(e) => setNewAlert({ ...newAlert, chain: e.target.value })}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 appearance-none"
                      >
                        {['Ethereum', 'Solana', 'Polygon', 'Base', 'Sui', 'Cosmos'].map(c => (
                          <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-1">Alert Type</label>
                    <div className="relative">
                      <select 
                        value={newAlert.type}
                        onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as any })}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 appearance-none"
                      >
                        <option value="increase" className="bg-[#1a1a1a]">Price Increase</option>
                        <option value="decrease" className="bg-[#1a1a1a]">Price Decrease</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-1">Target Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
                    <input 
                      type="number" 
                      step="any"
                      placeholder="0.00"
                      required
                      value={newAlert.price}
                      onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3 pl-8 pr-4 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(93,22,255,0.3)]"
                >
                  Create Alert
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

