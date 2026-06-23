import React, { useState } from 'react';
import { AreaChart, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const AnalyticsChart: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d'>('7d');

  const data7d = [
    { day: 'Mon', value: 24500 },
    { day: 'Tue', value: 25100 },
    { day: 'Wed', value: 24800 },
    { day: 'Thu', value: 26200 },
    { day: 'Fri', value: 25900 },
    { day: 'Sat', value: 26400 },
    { day: 'Sun', value: 26845 },
  ];

  const data30d = [
    { day: 'W1', value: 21800 },
    { day: 'W2', value: 23200 },
    { day: 'W3', value: 25400 },
    { day: 'W4', value: 26845 },
  ];

  const activeData = selectedRange === '7d' ? data7d : data30d;
  const maxVal = Math.max(...activeData.map(d => d.value));
  const minVal = Math.min(...activeData.map(d => d.value));
  const range = maxVal - minVal;

  return (
    <div id="analytics-chart" className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-6 shadow-2xl relative select-none">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2">
            <TrendingUp size={13} className="text-teal-400" />
            Portfolio Value Timeline
          </h3>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Aggregated wallet balance historical trace</p>
        </div>

        <div className="flex bg-zinc-950 p-1 rounded-lg border border-white/[0.04]">
          {(['7d', '30d'] as const).map((r) => (
            <button
              key={r}
              id={`range-tab-${r}`}
              onClick={() => setSelectedRange(r)}
              className={`px-3 py-1 text-[10px] font-mono rounded-md transition-all uppercase ${
                selectedRange === r
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas drawing values */}
      <div className="h-44 w-full relative flex items-end">
        <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={`M 0,150 
              ${activeData.map((d, index) => {
                const x = (index / (activeData.length - 1)) * 500;
                const y = 130 - ((d.value - minVal) / (range || 1)) * 100;
                return `L ${x},${y}`;
              }).join(' ')} 
              L 500,150 Z`}
            fill="url(#chartGradient)"
            className="transition-all duration-500"
          />

          {/* Line stroke */}
          <path
            d={activeData.map((d, index) => {
              const x = (index / (activeData.length - 1)) * 500;
              const y = 130 - ((d.value - minVal) / (range || 1)) * 100;
              return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Points indicator */}
          {activeData.map((d, index) => {
            const x = (index / (activeData.length - 1)) * 500;
            const y = 130 - ((d.value - minVal) / (range || 1)) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4.5"
                fill="#18181b"
                stroke="#2dd4bf"
                strokeWidth="2.5"
                className="hover:scale-125 transition-all duration-300 cursor-help"
              />
            );
          })}
        </svg>
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between mt-3 px-1">
        {activeData.map((d, i) => (
          <span key={i} className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
            {d.day}
          </span>
        ))}
      </div>

      <div className="mt-5 pt-3 border-t border-white/[0.04] flex justify-between items-center text-[10px] font-mono text-zinc-500">
        <span>Network Hash Interval: <strong>3.2s</strong></span>
        <span>Relative Return Trend: <strong className="text-emerald-400 font-bold">+8.44%</strong></span>
      </div>
    </div>
  );
};
