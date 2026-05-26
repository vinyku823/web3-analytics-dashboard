import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ChartDatapoint {
  name: string;
  ethPrice: number;
  ethVolume: number;
  ethUsers: number;
  arbPrice: number;
  arbVolume: number;
  arbUsers: number;
  basePrice: number;
  baseVolume: number;
  baseUsers: number;
  solPrice: number;
  solVolume: number;
  solUsers: number;
  suiPrice: number;
  suiVolume: number;
  suiUsers: number;
  polPrice: number;
  polVolume: number;
  polUsers: number;
  opPrice: number;
  opVolume: number;
  opUsers: number;
  aptPrice: number;
  aptVolume: number;
  aptUsers: number;
  atomPrice: number;
  atomVolume: number;
  atomUsers: number;
}

// Generate premium historical timeline dataset
const TIMELINE_DATA: ChartDatapoint[] = [
  { name: '00:00', ethPrice: 3340, ethVolume: 1200, ethUsers: 240, arbPrice: 1.10, arbVolume: 280, arbUsers: 390, basePrice: 3340, baseVolume: 410, baseUsers: 590, solPrice: 148, solVolume: 610, solUsers: 450, suiPrice: 1.52, suiVolume: 190, suiUsers: 95, polPrice: 0.74, polVolume: 90, polUsers: 54, opPrice: 2.30, opVolume: 120, opUsers: 190, aptPrice: 8.90, aptVolume: 62, aptUsers: 35, atomPrice: 8.42, atomVolume: 32, atomUsers: 14 },
  { name: '04:00', ethPrice: 3360, ethVolume: 1450, ethUsers: 290, arbPrice: 1.12, arbVolume: 310, arbUsers: 405, basePrice: 3360, baseVolume: 430, baseUsers: 610, solPrice: 151, solVolume: 740, solUsers: 510, suiPrice: 1.58, suiVolume: 220, suiUsers: 110, polPrice: 0.738, polVolume: 95, polUsers: 56, opPrice: 2.34, opVolume: 130, opUsers: 200, aptPrice: 9.10, aptVolume: 68, aptUsers: 42, atomPrice: 8.45, atomVolume: 35, atomUsers: 15 },
  { name: '08:00', ethPrice: 3340, ethVolume: 1100, ethUsers: 210, arbPrice: 1.11, arbVolume: 290, arbUsers: 380, basePrice: 3340, baseVolume: 390, baseUsers: 570, solPrice: 150, solVolume: 580, solUsers: 410, suiPrice: 1.62, suiVolume: 180, suiUsers: 85, polPrice: 0.732, polVolume: 85, polUsers: 48, opPrice: 2.31, opVolume: 115, opUsers: 180, aptPrice: 9.05, aptVolume: 59, aptUsers: 38, atomPrice: 8.39, atomVolume: 28, atomUsers: 12 },
  { name: '12:00', ethPrice: 3400, ethVolume: 1850, ethUsers: 350, arbPrice: 1.15, arbVolume: 340, arbUsers: 430, basePrice: 3400, baseVolume: 480, baseUsers: 680, solPrice: 156, solVolume: 910, solUsers: 720, suiPrice: 1.69, suiVolume: 340, suiUsers: 185, polPrice: 0.729, polVolume: 110, polUsers: 65, opPrice: 2.39, opVolume: 155, opUsers: 210, aptPrice: 9.25, aptVolume: 82, aptUsers: 48, atomPrice: 8.41, atomVolume: 42, atomUsers: 18 },
  { name: '16:00', ethPrice: 3390, ethVolume: 1600, ethUsers: 320, arbPrice: 1.14, arbVolume: 325, arbUsers: 415, basePrice: 3390, baseVolume: 460, baseUsers: 660, solPrice: 154, solVolume: 850, solUsers: 680, suiPrice: 1.74, suiVolume: 290, suiUsers: 150, polPrice: 0.735, polVolume: 105, polUsers: 60, opPrice: 2.37, opVolume: 145, opUsers: 195, aptPrice: 9.18, aptVolume: 74, aptUsers: 45, atomPrice: 8.37, atomVolume: 39, atomUsers: 16 },
  { name: '20:00', ethPrice: 3450, ethVolume: 2200, ethUsers: 420, arbPrice: 1.17, arbVolume: 360, arbUsers: 440, basePrice: 3450, baseVolume: 510, baseUsers: 720, solPrice: 159, solVolume: 1100, solUsers: 890, suiPrice: 1.81, suiVolume: 410, suiUsers: 220, polPrice: 0.728, polVolume: 125, polUsers: 72, opPrice: 2.42, opVolume: 165, opUsers: 225, aptPrice: 9.35, aptVolume: 95, aptUsers: 55, atomPrice: 8.32, atomVolume: 48, atomUsers: 19 },
  { name: '24:00', ethPrice: 3485, ethVolume: 2450, ethUsers: 450, arbPrice: 1.18, arbVolume: 380, arbUsers: 465, basePrice: 3485, baseVolume: 540, baseUsers: 740, solPrice: 162.45, solVolume: 1290, solUsers: 950, suiPrice: 1.86, suiVolume: 460, suiUsers: 250, polPrice: 0.725, polVolume: 130, polUsers: 75, opPrice: 2.45, opVolume: 175, opUsers: 240, aptPrice: 9.48, aptVolume: 99, aptUsers: 58, atomPrice: 8.35, atomVolume: 51, atomUsers: 21 },
];

interface AnalyticsChartProps {
  selectedChainId?: string; // Optional external filter
}

export function AnalyticsChart({ selectedChainId = 'ethereum' }: AnalyticsChartProps) {
  const [metric, setMetric] = useState<'price' | 'volume' | 'users'>('price');

  // Map chosen chain and metric to appropriate keys
  const getSelectedKey = (chainId: string, selectedMetric: typeof metric) => {
    const chainPrefixMap: Record<string, string> = {
      ethereum: 'eth',
      arbitrum: 'arb',
      base: 'base',
      solana: 'sol',
      sui: 'sui',
      polygon: 'pol',
      optimism: 'op',
      aptos: 'apt',
      cosmos: 'atom',
    };
    const prefix = chainPrefixMap[chainId] || 'eth';
    
    if (selectedMetric === 'price') return `${prefix}Price`;
    if (selectedMetric === 'volume') return `${prefix}Volume`;
    return `${prefix}Users`;
  };

  const getMetricColor = (chainId: string) => {
    const colorMap: Record<string, string> = {
      ethereum: '#6366f1', // Indigo
      arbitrum: '#3b82f6', // Electric Blue
      base: '#0052ff', // Royal Blue
      solana: '#14f195', // Emerald
      sui: '#38bdf8', // Sky
      polygon: '#a855f7', // Purple
      optimism: '#ff0420', // Red
      aptos: '#ff2d55', // Pink
      cosmos: '#ff79c6', // Pastel Pink
    };
    return colorMap[chainId] || '#6366f1';
  };

  const activeKey = getSelectedKey(selectedChainId, metric);
  const strokeColor = getMetricColor(selectedChainId);

  const formatTooltipValue = (value: number) => {
    if (metric === 'price') return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    if (metric === 'volume') return `$${value.toLocaleString()}M`;
    return `${value.toLocaleString()}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Chart controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 z-10">
        <div className="flex gap-1.5 p-1 bg-black/40 border border-white/[0.05] rounded-xl">
          <button 
            onClick={() => setMetric('price')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${metric === 'price' ? 'bg-[#8b5cf6]/20 text-indigo-300 border border-indigo-500/30' : 'text-white/40 hover:text-white/80'}`}
          >
            PRICE
          </button>
          <button 
            onClick={() => setMetric('volume')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${metric === 'volume' ? 'bg-[#8b5cf6]/20 text-indigo-300 border border-indigo-500/30' : 'text-white/40 hover:text-white/80'}`}
          >
            VOLUME
          </button>
          <button 
            onClick={() => setMetric('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all ${metric === 'users' ? 'bg-[#8b5cf6]/20 text-indigo-300 border border-indigo-500/30' : 'text-white/40 hover:text-white/80'}`}
          >
            TPS / USERS
          </button>
        </div>

        <div className="text-[10px] text-white/30 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: strokeColor }} />
          <span>CYBER_FEED: ACTIVE REAL-TIME STREAMING ({selectedChainId.toUpperCase()})</span>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.15)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
              className="font-mono"
            />
            <YAxis 
              stroke="rgba(255,255,255,0.15)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => {
                if (metric === 'price') {
                  return value >= 1000 ? `$${(value/1000).toFixed(1)}k` : `$${value}`;
                }
                if (metric === 'volume') return `$${value}M`;
                return value;
              }}
              className="font-mono"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0a0a14', 
                border: `1px solid ${strokeColor}40`,
                borderRadius: '16px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                boxShadow: `0 0 20px ${strokeColor}15`
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}
              itemStyle={{ color: '#ffffff' }}
              formatter={(value) => [formatTooltipValue(Number(value)), metric.toUpperCase()]}
            />
            <Area 
              type="monotone" 
              dataKey={activeKey} 
              stroke={strokeColor} 
              fillOpacity={1} 
              fill="url(#gradientActive)" 
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
