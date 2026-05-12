import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', eth: 4000, sol: 2400, base: 2400 },
  { name: 'Feb', eth: 3000, sol: 1398, base: 2210 },
  { name: 'Mar', eth: 2000, sol: 9800, base: 2290 },
  { name: 'Apr', eth: 2780, sol: 3908, base: 2000 },
  { name: 'May', eth: 1890, sol: 4800, base: 2181 },
  { name: 'Jun', eth: 2390, sol: 3800, base: 2500 },
  { name: 'Jul', eth: 3490, sol: 4300, base: 2100 },
];

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorSol" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14f195" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#14f195" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0052ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#0052ff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          dy={10}
        />
        <YAxis 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#fff' }}
        />
        <Area 
          type="monotone" 
          dataKey="eth" 
          stroke="#6366f1" 
          fillOpacity={1} 
          fill="url(#colorEth)" 
          strokeWidth={3}
        />
        <Area 
          type="monotone" 
          dataKey="sol" 
          stroke="#14f195" 
          fillOpacity={1} 
          fill="url(#colorSol)" 
          strokeWidth={3}
        />
        <Area 
          type="monotone" 
          dataKey="base" 
          stroke="#0052ff" 
          fillOpacity={1} 
          fill="url(#colorBase)" 
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
