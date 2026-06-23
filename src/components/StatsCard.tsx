import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  isPositive?: boolean;
  icon: LucideIcon;
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  title,
  value,
  subtitle,
  isPositive = true,
  icon: Icon,
  accentColor = '#2dd4bf',
}) => {
  return (
    <div
      id={`stats-card-${id}`}
      className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden select-none hover:shadow-2xl hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Background glow node */}
      <div
        className="absolute -right-3 -top-3 w-16 h-16 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: `${accentColor}10` }}
      />

      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest leading-none">
            {title}
          </span>
          <p className="text-2xl font-black text-white mt-2.5 font-mono tracking-tight leading-none">
            {value}
          </p>
        </div>
        <div
          className="p-2.5 rounded-xl border"
          style={{
            borderColor: `${accentColor}25`,
            color: accentColor,
            backgroundColor: `${accentColor}08`,
          }}
        >
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between">
        <span className="text-[10px] text-zinc-400 font-sans tracking-wide leading-none">{subtitle}</span>
        {isPositive !== undefined && (
          <span
            className={`text-[9px] font-mono leading-none font-black ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '▲ ASCENDING' : '▼ DEFICIT'}
          </span>
        )}
      </div>
    </div>
  );
};
