import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { StatsCard } from './StatsCard';
import { Wallet, ArrowUpRight, ArrowDownLeft, Ghost } from 'lucide-react';
import { formatEther } from 'viem';

export function WalletDashboard() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Portfolio Value" 
          value={balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : "0.00 ETH"} 
          trend="Native Asset" 
          icon={<Wallet className="w-5 h-5 text-primary" />} 
        />
        <StatsCard 
          title="Total Transactions" 
          value="142" 
          trend="+12 this week" 
          icon={<ArrowUpRight className="w-5 h-5 text-green-400" />} 
        />
        <StatsCard 
          title="Active Protocols" 
          value="8" 
          trend="Uniswap, Aave..." 
          icon={<ArrowDownLeft className="w-5 h-5 text-blue-400" />} 
        />
      </div>

      <div className="glass rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                   {i % 2 === 0 ? <ArrowUpRight className="w-5 h-5 text-green-400" /> : <ArrowDownLeft className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{i % 2 === 0 ? 'Swap' : 'Receive'}</p>
                  <p className="text-xs text-white/40 font-mono">0x{address?.slice(2, 6)}...{address?.slice(-4)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{i % 2 === 0 ? '-' : '+'}{(Math.random() * 2).toFixed(3)} ETH</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
