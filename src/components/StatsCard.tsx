import React from 'react';
import { cn } from '../lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, trend, icon }: StatsCardProps) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="glass rounded-3xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
          {icon}
        </div>
        <div className={cn(
          "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
          isPositive ? "text-green-400 border-green-400/20 bg-green-400/10" : "text-white/40 border-white/10 bg-white/5"
        )}>
          {trend}
        </div>
      </div>
      <h4 className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
