import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, 
  Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, Zap, Play, 
  Info, Cpu, Layers, Fingerprint, Award, Calendar, Database, Sparkles, TrendingUp,
  Plus
} from 'lucide-react';

interface TokenHolding {
  symbol: string;
  name: string;
  price: number;
  balance: number;
  decimals: number;
  coingeckoId: string;
}

interface ContractInteraction {
  contractName: string;
  contractAddress: string;
  protocolType: 'DeFi' | 'NFT Marketplace' | 'Liquid Staking' | 'Bridge' | 'GameFi';
  interactionCount: number;
  lastUsed: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface A2ZTx {
  id: string;
  hash: string;
  block: number;
  type: 'Receive' | 'Send' | 'Swap' | 'Contract Call' | 'Mint' | 'Stake';
  counterparty: string;
  value: string;
  tokenSymbol: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  gasUsed: string;
}

const PRESETS = {
  whale: {
    address: 'a2z1wha1e9999pxq77s8fmdk239vlcn8sjetq404',
    healthScore: 94,
    activityRank: 'Top 0.1% Sovereign',
    creationDate: 'May 12, 2024',
    totalGasSpent: '1,425 A2Z',
    riskLevel: 'LOW' as const,
    holdings: [
      { symbol: 'A2Z', name: 'A2Z Native Token', price: 3.48, balance: 145000, decimals: 18, coingeckoId: 'a2z' },
      { symbol: 'aUSD', name: 'A2Z Algorithmic Dollar', price: 1.00, balance: 250000, decimals: 6, coingeckoId: 'ausd' },
      { symbol: 'stA2Z', name: 'Staked A2Z LST', price: 3.65, balance: 80000, decimals: 18, coingeckoId: 'sta2z' },
      { symbol: 'SIGMA', name: 'Sigma Dex Liquidity Token', price: 12.42, balance: 12500, decimals: 18, coingeckoId: 'sigma' }
    ],
    txs: [
      { id: 'a1', hash: '0xa2z98df4...1d2e', block: 15420311, type: 'Swap' as const, counterparty: 'Sigma DEX Router v2', value: '50,000 aUSD → 14,367 A2Z', tokenSymbol: 'A2Z', timestamp: '2 mins ago', status: 'SUCCESS' as const, gasUsed: '1.42 A2Z' },
      { id: 'a2', hash: '0xa2z44ef1...8c7d', block: 15420124, type: 'Stake' as const, counterparty: 'Delta Liquid Staking Pool', value: '30,000 A2Z', tokenSymbol: 'A2Z', timestamp: '2 hours ago', status: 'SUCCESS' as const, gasUsed: '2.84 A2Z' },
      { id: 'a3', hash: '0xa2z00912...e93a', block: 15418901, type: 'Receive' as const, counterparty: 'Binance Hub Bridge 1', value: '150,000 aUSD', tokenSymbol: 'aUSD', timestamp: '1 day ago', status: 'SUCCESS' as const, gasUsed: '0.95 A2Z' },
      { id: 'a4', hash: '0xa2z77df9...234c', block: 15412499, type: 'Send' as const, counterparty: 'a2z1devxx...ff39', value: '1,200 A2Z', tokenSymbol: 'A2Z', timestamp: '3 days ago', status: 'SUCCESS' as const, gasUsed: '0.45 A2Z' }
    ],
    contracts: [
      { contractName: 'Sigma Pool Aggregator', contractAddress: 'a2z1sigmapoo199xx88ffaaqqwweerr', protocolType: 'DeFi' as const, interactionCount: 245, lastUsed: '2 mins ago', riskRating: 'LOW' as const },
      { contractName: 'Delta Oracle Feed Validator', contractAddress: 'a2z1de1taorac1efeed998877665544', protocolType: 'Liquid Staking' as const, interactionCount: 84, lastUsed: '2 hours ago', riskRating: 'LOW' as const }
    ]
  },
  developer: {
    address: 'a2z1dev7777pxcq44s8fmnk111vlcn2sjetq123',
    healthScore: 88,
    activityRank: 'Top 1.5% Deployer',
    creationDate: 'Jan 04, 2025',
    totalGasSpent: '4,840 A2Z',
    riskLevel: 'LOW' as const,
    holdings: [
      { symbol: 'A2Z', name: 'A2Z Native Token', price: 3.48, balance: 24500, decimals: 18, coingeckoId: 'a2z' },
      { symbol: 'aUSD', name: 'A2Z Algorithmic Dollar', price: 1.00, balance: 8400, decimals: 6, coingeckoId: 'ausd' },
      { symbol: 'A2ZNFT', name: 'A2Z Genesis Builder Badge', price: 180.00, balance: 3, decimals: 0, coingeckoId: 'a2znft' }
    ],
    txs: [
      { id: 'd1', hash: '0xa2z88de2...99ee', block: 15421045, type: 'Contract Call' as const, counterparty: 'A2Z Compiler Deployer Proxy', value: '0.00 A2Z (Init Contract)', tokenSymbol: 'A2Z', timestamp: '10 mins ago', status: 'SUCCESS' as const, gasUsed: '12.45 A2Z' },
      { id: 'd2', hash: '0xa2z55de5...bb88', block: 15415901, type: 'Mint' as const, counterparty: 'A2Z NFT Factory v1', value: '1 Genesis NFT Builder Badge', tokenSymbol: 'A2ZNFT', timestamp: '1 day ago', status: 'SUCCESS' as const, gasUsed: '4.20 A2Z' },
      { id: 'd3', hash: '0xa2z1199a...67cc', block: 15408994, type: 'Send' as const, counterparty: '0x9ffd...8a12 (Aptos Multi-Bridge)', value: '6,400 A2Z', tokenSymbol: 'A2Z', timestamp: '5 days ago', status: 'SUCCESS' as const, gasUsed: '0.85 A2Z' }
    ],
    contracts: [
      { contractName: 'A2Z Compiler Deployer Proxy', contractAddress: 'a2z1dep1oyerproxy998ddccbbaa', protocolType: 'DeFi' as const, interactionCount: 154, lastUsed: '10 mins ago', riskRating: 'LOW' as const },
      { contractName: 'A2Z NFT Factory v1', contractAddress: 'a2z1nftfactoryv1aaqqwweerr', protocolType: 'NFT Marketplace' as const, interactionCount: 12, lastUsed: '1 day ago', riskRating: 'LOW' as const }
    ]
  },
  arbitrage: {
    address: 'a2z1arb40477pxcq00s8fmnk88vlcn0sjetq71a',
    healthScore: 52,
    activityRank: 'Top 0.5% MEV Executor',
    creationDate: 'Mar 15, 2026',
    totalGasSpent: '84,120 A2Z',
    riskLevel: 'HIGH' as const,
    holdings: [
      { symbol: 'A2Z', name: 'A2Z Native Token', price: 3.48, balance: 1420, decimals: 18, coingeckoId: 'a2z' },
      { symbol: 'aUSD', name: 'A2Z Algorithmic Dollar', price: 1.00, balance: 124500, decimals: 6, coingeckoId: 'ausd' }
    ],
    txs: [
      { id: 'ar1', hash: '0xa2zfe9a0...33c9', block: 15421550, type: 'Swap' as const, counterparty: 'Sigma Flashloan Protocol', value: '450,000 USD Flashloan Call', tokenSymbol: 'aUSD', timestamp: 'Just now', status: 'SUCCESS' as const, gasUsed: '32.14 A2Z' },
      { id: 'ar2', hash: '0xa2z009fa...bc12', block: 15421545, type: 'Swap' as const, counterparty: 'Sigma DEX Router v2', value: '124,500 aUSD → 31,450 A2Z (Arbitrage Sweep)', tokenSymbol: 'A2Z', timestamp: '12s ago', status: 'SUCCESS' as const, gasUsed: '4.85 A2Z' },
      { id: 'ar3', hash: '0xa2zbbcc3...eed8', block: 15421100, type: 'Contract Call' as const, counterparty: 'Unknown Sandwich Master Contract', value: '0 A2Z (Mev Block Match)', tokenSymbol: 'A2Z', timestamp: '15 mins ago', status: 'FAILED' as const, gasUsed: '1.80 A2Z' }
    ],
    contracts: [
      { contractName: 'Sigma Flashloan Protocol', contractAddress: 'a2z1f1ash1oan99ss88ffaaqqwweerr', protocolType: 'DeFi' as const, interactionCount: 14800, lastUsed: 'Just now', riskRating: 'MEDIUM' as const },
      { contractName: 'Arbitrage Matcher Core v2', contractAddress: 'a2z1arbmatecherv2ffaaqqxxww', protocolType: 'DeFi' as const, interactionCount: 18240, lastUsed: '5s ago', riskRating: 'HIGH' as const }
    ]
  }
};

export const A2ZChainDashboard: React.FC = () => {
  const [addressInput, setAddressInput] = useState<string>(PRESETS.whale.address);
  const [activeAddress, setActiveAddress] = useState<string>(PRESETS.whale.address);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Tab panels state
  const [activeSubTab, setActiveSubTab] = useState<'holdings' | 'txs' | 'security' | 'simulator'>('holdings');

  // Interactive dynamic yield simulation form state
  const [simStakedAmount, setSimStakedAmount] = useState<string>('1200');
  const [simLockPeriod, setSimLockPeriod] = useState<number>(12); // months
  const [simApy, setSimApy] = useState<number>(8.5); // base compound APY
  const [simOutput, setSimOutput] = useState<{ compounded: number, rewards: number }>({ compounded: 0, rewards: 0 });

  // Custom loaded analysis states
  const [healthScore, setHealthScore] = useState<number>(PRESETS.whale.healthScore);
  const [activityRank, setActivityRank] = useState<string>(PRESETS.whale.activityRank);
  const [creationDate, setCreationDate] = useState<string>(PRESETS.whale.creationDate);
  const [totalGasSpent, setTotalGasSpent] = useState<string>(PRESETS.whale.totalGasSpent);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(PRESETS.whale.riskLevel);
  const [holdingsList, setHoldingsList] = useState<TokenHolding[]>(PRESETS.whale.holdings);
  const [txHistory, setTxHistory] = useState<A2ZTx[]>(PRESETS.whale.txs);
  const [contractMap, setContractMap] = useState<ContractInteraction[]>(PRESETS.whale.contracts);

  // Success alert triggers
  const [isAirdropClaiming, setIsAirdropClaiming] = useState<boolean>(false);
  const [airdropSuccess, setAirdropSuccess] = useState<boolean>(false);

  // Recalculate Yield compounding simulator on parameters change
  useEffect(() => {
    const amt = parseFloat(simStakedAmount);
    if (!isNaN(amt) && amt > 0) {
      const rate = simApy / 100;
      const termYears = simLockPeriod / 12;
      // Continuous compounding formula: A = P * e^(r*t) or simplified compound monthly: A = P * (1 + r/12)^(12*t)
      const compounded = amt * Math.pow(1 + (rate / 12), 12 * termYears);
      const rewards = compounded - amt;
      setSimOutput({
        compounded: parseFloat(compounded.toFixed(2)),
        rewards: parseFloat(rewards.toFixed(2))
      });
    } else {
      setSimOutput({ compounded: 0, rewards: 0 });
    }
  }, [simStakedAmount, simLockPeriod, simApy]);

  // Handle active preset load
  const loadPreset = (presetKey: keyof typeof PRESETS) => {
    setIsScanning(true);
    setErrorMsg(null);
    const data = PRESETS[presetKey];
    
    setTimeout(() => {
      setAddressInput(data.address);
      setActiveAddress(data.address);
      setHealthScore(data.healthScore);
      setActivityRank(data.activityRank);
      setCreationDate(data.creationDate);
      setTotalGasSpent(data.totalGasSpent);
      setRiskLevel(data.riskLevel);
      setHoldingsList(data.holdings);
      setTxHistory(data.txs);
      setContractMap(data.contracts);
      setIsScanning(false);
    }, 1000);
  };

  // Perform search / analysis diagnostic on address submission
  const handleScan = () => {
    setErrorMsg(null);
    
    // Simple validation of the format
    const cleaned = addressInput.trim().toLowerCase();
    if (!cleaned) {
      setErrorMsg('Please input an A2Z address');
      return;
    }

    if (cleaned.length < 24) {
      setErrorMsg('Invalid address format! Must be at least 24 characters');
      return;
    }

    setIsScanning(true);

    // Simulate cross-network block resolver tracing indexers
    setTimeout(() => {
      setActiveAddress(cleaned);
      
      // Match one of presets or generate randomized realistic profile
      const isWhaleMatch = cleaned.includes('whale') || cleaned.includes('wha1e');
      const isDevMatch = cleaned.includes('dev') || cleaned.includes('154');
      const isArbMatch = cleaned.includes('arb') || cleaned.includes('404');

      if (isWhaleMatch) {
        setHealthScore(PRESETS.whale.healthScore);
        setActivityRank(PRESETS.whale.activityRank);
        setCreationDate(PRESETS.whale.creationDate);
        setTotalGasSpent(PRESETS.whale.totalGasSpent);
        setRiskLevel(PRESETS.whale.riskLevel);
        setHoldingsList(PRESETS.whale.holdings);
        setTxHistory(PRESETS.whale.txs);
        setContractMap(PRESETS.whale.contracts);
      } else if (isDevMatch) {
        setHealthScore(PRESETS.developer.healthScore);
        setActivityRank(PRESETS.developer.activityRank);
        setCreationDate(PRESETS.developer.creationDate);
        setTotalGasSpent(PRESETS.developer.totalGasSpent);
        setRiskLevel(PRESETS.developer.riskLevel);
        setHoldingsList(PRESETS.developer.holdings);
        setTxHistory(PRESETS.developer.txs);
        setContractMap(PRESETS.developer.contracts);
      } else if (isArbMatch) {
        setHealthScore(PRESETS.arbitrage.healthScore);
        setActivityRank(PRESETS.arbitrage.activityRank);
        setCreationDate(PRESETS.arbitrage.creationDate);
        setTotalGasSpent(PRESETS.arbitrage.totalGasSpent);
        setRiskLevel(PRESETS.arbitrage.riskLevel);
        setHoldingsList(PRESETS.arbitrage.holdings);
        setTxHistory(PRESETS.arbitrage.txs);
        setContractMap(PRESETS.arbitrage.contracts);
      } else {
        // Generate high-fidelity randomized indexer data!
        const randSeed = cleaned.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const derivedHealth = Math.min(99, Math.max(34, (randSeed % 65) + 35));
        const derivedRisk = derivedHealth < 55 ? 'HIGH' : (derivedHealth < 75 ? 'MEDIUM' : 'LOW');
        const numContracts = (randSeed % 15) + 2;
        const gasBurned = `${(randSeed % 400) + 12} A2Z`;

        setHealthScore(derivedHealth);
        setActivityRank(`Top ${(5 + (randSeed % 20)).toFixed(1)}% Explorer`);
        setCreationDate(`Nov ${10 + (randSeed % 18)}, 2024`);
        setTotalGasSpent(gasBurned);
        setRiskLevel(derivedRisk);

        // Holdings
        setHoldingsList([
          { symbol: 'A2Z', name: 'A2Z Native Token', price: 3.48, balance: (randSeed % 450) + 45, decimals: 18, coingeckoId: 'a2z' },
          { symbol: 'aUSD', name: 'A2Z Algorithmic Dollar', price: 1.00, balance: (randSeed % 1200) + 20, decimals: 6, coingeckoId: 'ausd' }
        ]);

        // Transactions list
        setTxHistory([
          { id: `t-g1`, hash: `0xa2z${randSeed.toString(16)}...f88c`, block: 15420000 + (randSeed % 2000), type: 'Swap' as const, counterparty: 'Sigma DEX Router v2', value: '150 aUSD → 43 A2Z', tokenSymbol: 'A2Z', timestamp: '5 mins ago', status: 'SUCCESS' as const, gasUsed: '1.20 A2Z' },
          { id: `t-g2`, hash: `0xa2z77bc${(randSeed + 1).toString(16)}`, block: 15418000 + (randSeed % 1000), type: 'Receive' as const, counterparty: '0xabc...ef12', value: '250 aUSD', tokenSymbol: 'aUSD', timestamp: '2 hours ago', status: 'SUCCESS' as const, gasUsed: '0.90 A2Z' }
        ]);

        // Contracts
        setContractMap([
          { contractName: 'Sigma Pool Aggregator', contractAddress: 'a2z1sigmapoo199xx88ffaaqqwweerr', protocolType: 'DeFi' as const, interactionCount: numContracts, lastUsed: '5 mins ago', riskRating: 'LOW' as const }
        ]);
      }
      
      setIsScanning(false);
    }, 1200);
  };

  // Claim dynamic on-chain mock airdrop to test vault value incrementation!
  const claimMockAirdrop = () => {
    setIsAirdropClaiming(true);
    setAirdropSuccess(false);

    setTimeout(() => {
      setHoldingsList((prev) => {
        return prev.map((holding) => {
          if (holding.symbol === 'A2Z') {
            return { ...holding, balance: holding.balance + 100 };
          }
          if (holding.symbol === 'aUSD') {
            return { ...holding, balance: holding.balance + 250 };
          }
          return holding;
        });
      });

      // Add dynamic transactions on historical ledger
      const randomId = 'air-' + Date.now();
      const airdropTx: A2ZTx = {
        id: randomId,
        hash: '0xa2z_airdrop_distribution_hash',
        block: 15422000,
        type: 'Receive',
        counterparty: 'A2Z Gas Distribution Dao',
        value: '100 A2Z + 250 aUSD',
        tokenSymbol: 'A2Z',
        timestamp: 'Just now',
        status: 'SUCCESS',
        gasUsed: '0.00 A2Z (FEE FREE)'
      };

      setTxHistory((prev) => [airdropTx, ...prev]);

      setIsAirdropClaiming(false);
      setAirdropSuccess(true);
      
      // Clear alert after 5s
      setTimeout(() => setAirdropSuccess(false), 5000);
    }, 1000);
  };

  // Calculated Portfolio Value specifically for A2Z Chain
  const aggregateA2ZWorth = holdingsList.reduce((sum, hold) => sum + (hold.balance * hold.price), 0);

  return (
    <div id="a2z-chain-dashboard" className="space-y-6 select-none relative">
      {/* Dynamic ambient vector aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2.5">
            <Fingerprint className="text-teal-400 rotate-12" size={22} />
            A2Z Modular L0 Network Explorer
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">Comprehensive on-chain address profiles, ledger analytics, and compounding simulators</p>
        </div>

        {/* Preset Selector buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-zinc-500 block px-2">Preset Wallets:</span>
          <button
            id="preset-whale-btn"
            onClick={() => loadPreset('whale')}
            className={`px-3 py-1 text-[9px] font-mono font-black border uppercase rounded-lg transition-all ${
              activeAddress === PRESETS.whale.address
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/35'
                : 'bg-zinc-900 border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            🐳 Whale
          </button>
          <button
            id="preset-dev-btn"
            onClick={() => loadPreset('developer')}
            className={`px-3 py-1 text-[9px] font-mono font-black border uppercase rounded-lg transition-all ${
              activeAddress === PRESETS.developer.address
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                : 'bg-zinc-900 border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            🛠️ Dev
          </button>
          <button
            id="preset-arb-btn"
            onClick={() => loadPreset('arbitrage')}
            className={`px-3 py-1 text-[9px] font-mono font-black border uppercase rounded-lg transition-all ${
              activeAddress === PRESETS.arbitrage.address
                ? 'bg-red-500/10 text-red-400 border-red-500/35'
                : 'bg-zinc-900 border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            🤖 MEV Bot
          </button>
        </div>
      </div>

      {/* Address Search Board */}
      <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 shadow-2xl relative">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              id="a2z-address-resolver-input"
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Paste A2Z wallet address (e.g. a2z1whale999...) or raw hex..."
              className="w-full bg-zinc-950 border border-white/[0.06] rounded-xl pl-12 pr-4 py-3.5 text-xs text-white outline-none font-mono placeholder-zinc-600 focus:border-teal-500/30"
            />
          </div>
          <button
            id="a2z-scan-submit-btn"
            disabled={isScanning}
            onClick={handleScan}
            className={`w-full md:w-auto px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isScanning
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-teal-400 text-zinc-950 hover:bg-teal-300 font-bold hover:shadow-[0_0_15px_rgba(45,212,191,0.25)]'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw size={13} className="animate-spin text-zinc-500" />
                Scanning block ledger...
              </>
            ) : (
              <>
                <Zap size={13} />
                Resolve A2Z Address
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[10px] p-3 rounded-xl mt-3 flex items-center gap-2">
            <AlertTriangle size={13} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Network & Node Statistics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 bg-zinc-900/40 p-4 rounded-xl border border-white/[0.04] text-[10px] font-mono text-zinc-500 select-none">
        <div>
          <span>Target Mesh:</span>
          <p className="text-white font-bold mt-1">A2Z Modular L0</p>
        </div>
        <div>
          <span>Active Validators:</span>
          <p className="text-teal-400 font-bold mt-1">256 / 256 Nodes</p>
        </div>
        <div>
          <span>Network Latency:</span>
          <p className="text-zinc-300 font-bold mt-1">0.45s BlockTime</p>
        </div>
        <div>
          <span>Gas Burn Level:</span>
          <p className="text-amber-400 font-bold mt-1">0.0022 A2Z avg</p>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <span>Core Token price:</span>
          <p className="text-emerald-400 font-bold mt-1">$3.48 USD (+12.4%)</p>
        </div>
      </div>

      {/* Diagnostic Identity Cards (A to Z) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Wallet Worth Card */}
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-teal-500/5 rounded-full blur-xl" />
          <span className="text-[9px] text-zinc-500 font-mono block tracking-wider uppercase">Aggregate Assets Worth</span>
          <p className="text-xl font-black text-white font-mono mt-2.5">
            {aggregateA2ZWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center text-[9px] font-mono">
            <span className="text-zinc-400">Locked + Liquid Assets</span>
            <span className="text-emerald-400 font-bold">Trace verified</span>
          </div>
        </div>

        {/* Integrity/Score Card */}
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-full blur-xl" />
          <span className="text-[9px] text-zinc-500 font-mono block tracking-wider uppercase">Score Identity</span>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-xl font-black text-white font-mono">{healthScore}</p>
            <span className="text-[9px] font-mono text-zinc-400">/ 100 Points</span>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center text-[9px] font-mono">
            <span className="text-zinc-400">Audit Status</span>
            <span className={`font-black ${healthScore >= 75 ? 'text-emerald-400' : (healthScore >= 55 ? 'text-amber-400' : 'text-red-400')}`}>
              {healthScore >= 75 ? 'EXCELLENT' : (healthScore >= 55 ? 'MEDIUM RISK' : 'VULNERABLE')}
            </span>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 shadow-2xl relative overflow-hidden">
          <span className="text-[9px] text-zinc-500 font-mono block tracking-wider uppercase">Active Activity Rank</span>
          <p className="text-xl font-black text-white font-mono mt-2.5 truncate">
            {activityRank}
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center text-[9px] font-mono">
            <span className="text-zinc-400">Created:</span>
            <span className="text-zinc-300 font-bold">{creationDate}</span>
          </div>
        </div>

        {/* Gas Card */}
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 shadow-2xl relative overflow-hidden">
          <span className="text-[9px] text-zinc-500 font-mono block tracking-wider uppercase">Total Gas Burnt</span>
          <p className="text-xl font-black text-teal-400 font-mono mt-2.5">
            {totalGasSpent}
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center text-[9px] font-mono">
            <span className="text-zinc-400">Sanity index:</span>
            <span className={`font-bold ${riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
              {riskLevel === 'HIGH' ? '🤖 EXTREME BURNOUT' : '🌿 OPTIMIZED'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tab navigation panel */}
      <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-5 shadow-2xl">
        <div className="flex border-b border-white/[0.06] pb-3 mb-6 overflow-x-auto gap-2">
          {[
            { id: 'holdings', label: 'Token Vault', icon: Wallet },
            { id: 'txs', label: 'Ledger History', icon: Database },
            { id: 'security', label: 'Security & Protocols', icon: Award },
            { id: 'simulator', label: 'Compounding APY Planner', icon: TrendingUp }
          ].map((subTab) => {
            const Icon = subTab.icon;
            const isSelected = activeSubTab === subTab.id;
            return (
              <button
                key={subTab.id}
                id={`subtab-btn-${subTab.id}`}
                onClick={() => setActiveSubTab(subTab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-xl transition-all uppercase whitespace-nowrap shrink-0 ${
                  isSelected 
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/25 font-black' 
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                <Icon size={13} />
                {subTab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Subpanels */}
        <AnimatePresence mode="wait">
          {activeSubTab === 'holdings' && (
            <motion.div
              key="holdings-sub"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-teal-400" />
                    Asset Index Directory
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Physical liquid assets detected on the A2Z mesh node</p>
                </div>

                <div className="flex gap-2">
                  <button
                    id="airdrop-claim-btn"
                    disabled={isAirdropClaiming}
                    onClick={claimMockAirdrop}
                    className="px-4 py-2 border border-teal-500/20 bg-teal-500/5 text-teal-400 hover:bg-teal-500/10 active:scale-[0.98] font-mono font-bold text-[10px] uppercase rounded-xl transition-all flex items-center gap-1.5"
                  >
                    {isAirdropClaiming ? (
                      <>
                        <RefreshCw size={11} className="animate-spin text-teal-500" />
                        Injecting...
                      </>
                    ) : (
                      <>
                        <Plus size={11} />
                        Mock Airdrop (+100 A2Z)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {airdropSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] p-3.5 rounded-xl flex items-center gap-2 flex-row">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>On-chain simulation succeeded! 100 A2Z and 250 aUSD added to holdings directory instantly.</span>
                </div>
              )}

              <div className="space-y-3 font-mono">
                {holdingsList.map((token, idx) => (
                  <div
                    key={token.symbol}
                    id={`a2z-holding-${token.symbol}`}
                    className="bg-zinc-950/50 hover:bg-zinc-950 border border-white/[0.02] p-4 rounded-xl flex justify-between items-center transition-all duration-300 hover:border-white/[0.08]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 text-teal-300 font-black text-xs">
                        {token.symbol}
                      </div>
                      <div>
                        <span className="text-white text-xs font-bold font-sans">{token.name}</span>
                        <div className="text-[9px] text-zinc-500 mt-1 flex items-center gap-1.5 flex-row">
                          <span>Verified: a2z_token_ledger_v1</span>
                          <span className="text-zinc-700 font-light">|</span>
                          <span>Price: ${(token.price).toFixed(2)} USD</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-white">
                        {token.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: idx === 0 ? 2 : 4 })}
                      </p>
                      <span className="text-[10px] text-zinc-400 mt-0.5 block">
                        ≈ ${(token.balance * token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'txs' && (
            <motion.div
              key="txs-sub"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Database size={14} className="text-teal-400" />
                  Address Transaction Journal
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Chronologically serialized records of the ledger</p>
              </div>

              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-zinc-500 pb-3 h-10 select-none uppercase font-black">
                      <th className="font-bold py-1 px-3">Tx Hash</th>
                      <th className="font-bold py-1 px-3">Block</th>
                      <th className="font-bold py-1 px-3 text-center">Type</th>
                      <th className="font-bold py-1 px-3">Counterparty</th>
                      <th className="font-bold py-1 px-3 text-right">Value</th>
                      <th className="font-bold py-1 px-3 text-center">Gas Burnt</th>
                      <th className="font-bold py-1 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {txHistory.map((tx) => (
                      <tr 
                        key={tx.id} 
                        id={`a2z-tx-row-${tx.id}`} 
                        className="h-14 hover:bg-zinc-950/50 transition-all text-zinc-300"
                      >
                        <td className="py-2 px-3">
                          <span className="text-zinc-500 mr-1 select-none">🔗</span>
                          <strong className="text-white hover:text-teal-400 cursor-copy">{tx.hash}</strong>
                        </td>
                        <td className="py-2 px-3 text-zinc-400 font-bold">{tx.block.toLocaleString()}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg ${
                            tx.type === 'Receive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            tx.type === 'Send' ? 'bg-zinc-500/15 text-zinc-400 border border-white/[0.04]' :
                            tx.type === 'Swap' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                            tx.type === 'Stake' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-zinc-400 truncate max-w-[150px]">{tx.counterparty}</td>
                        <td className="py-2 px-3 text-right font-black text-white">{tx.value}</td>
                        <td className="py-2 px-3 text-center text-zinc-400 font-bold">{tx.gasUsed}</td>
                        <td className="py-2 px-3 text-zinc-500 font-bold">{tx.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeSubTab === 'security' && (
            <motion.div
              key="security-sub"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Risks & Vulnerabilities Analysis panel */}
              <div className="bg-zinc-950/40 border border-white/[0.04] p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                    <ShieldAlert size={14} className="text-teal-400" />
                    Security Blueprint Analysis (A to Z)
                  </h4>

                  <ul className="space-y-4 text-[11px] font-mono">
                    <li className="flex justify-between items-start">
                      <div>
                        <span className="text-zinc-400 block font-bold font-sans">Multi-signature status</span>
                        <p className="text-[10px] text-zinc-600 mt-1">Is the transaction authorization decoupled into secure nodes?</p>
                      </div>
                      <span className="text-emerald-400 font-black">SECURE (3-of-4 Signature)</span>
                    </li>

                    <li className="flex justify-between items-start">
                      <div>
                        <span className="text-zinc-400 block font-bold font-sans">Slippage Sandwich vulnerability risk</span>
                        <p className="text-[10px] text-zinc-600 mt-1">Vulnerability score toward transaction mempool profiling</p>
                      </div>
                      <span className={`font-black ${riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {riskLevel === 'HIGH' ? 'HIGH (Sandwiched)' : 'NEGLIGIBLE (<0.1%)'}
                      </span>
                    </li>

                    <li className="flex justify-between items-start">
                      <div>
                        <span className="text-zinc-400 block font-bold font-sans">Honeypot token engagement</span>
                        <p className="text-[10px] text-zinc-600 mt-1">Interactions with malicious non-transferrable smart contracts</p>
                      </div>
                      <span className="text-emerald-400 font-black">CLEAN (0 found)</span>
                    </li>

                    <li className="flex justify-between items-start">
                      <div>
                        <span className="text-zinc-400 block font-bold font-sans">Flashloan exposure score</span>
                        <p className="text-[10px] text-zinc-600 mt-1">Active leveraging triggers bound to delta pools</p>
                      </div>
                      <span className={`font-black ${riskLevel === 'HIGH' ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {riskLevel === 'HIGH' ? 'Leveraged ($1.4M Debt)' : 'Unleveraged'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-white/[0.03] text-[9px] font-mono text-zinc-600 flex justify-between">
                  <span>Last security trace:</span>
                  <span>1 min ago</span>
                </div>
              </div>

              {/* Protocol connection directory */}
              <div className="bg-zinc-950/40 border border-white/[0.04] p-5 rounded-2xl">
                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Layers size={14} className="text-teal-400" />
                  Protocol Connection Map
                </h4>

                <div className="space-y-3 font-mono">
                  {contractMap.map((contract) => (
                    <div
                      key={contract.contractAddress}
                      id={`a2z-contract-${contract.contractName}`}
                      className="bg-zinc-950/70 p-3.5 rounded-xl border border-white/[0.02]"
                    >
                      <div className="flex justify-between items-start mb-2.5">
                        <div>
                          <strong className="text-white text-xs">{contract.contractName}</strong>
                          <span className="text-[9px] text-zinc-500 block mt-0.5">{contract.contractAddress}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-zinc-900 border border-white/[0.04] text-[9px] font-bold rounded">
                          {contract.protocolType}
                        </span>
                      </div>

                      <div className="flex justify-between text-[10px] text-zinc-500">
                        <span>Total calls: <strong className="text-zinc-300">{contract.interactionCount}</strong></span>
                        <span>Risk rating: 
                          <strong className={`ml-1 ${contract.riskRating === 'HIGH' ? 'text-red-400' : (contract.riskRating === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400')}`}>
                            {contract.riskRating}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === 'simulator' && (
            <motion.div
              key="simulator-sub"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Simulator Input parameters */}
              <div className="md:col-span-1 bg-zinc-950/50 border border-white/[0.04] p-5 rounded-2xl flex flex-col gap-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-teal-400" />
                  APY Planner Controls
                </h4>

                {/* Staked capital input */}
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">Base Staked Capital (A2Z)</label>
                  <input
                    id="sim-amount-input"
                    type="number"
                    value={simStakedAmount}
                    onChange={(e) => setSimStakedAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs font-mono text-white outline-none focus:border-teal-500/35"
                    placeholder="1,200"
                  />
                </div>

                {/* Compound Period selector */}
                <div>
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">Terms (Lock-up Period)</label>
                  <div className="flex gap-2 bg-zinc-900 p-0.5 rounded-lg border border-white/[0.04]">
                    {[3, 6, 12, 24].map((m) => (
                      <button
                        key={m}
                        id={`term-btn-${m}`}
                        onClick={() => setSimLockPeriod(m)}
                        className={`flex-1 py-1.5 text-[9px] font-mono rounded-md transition-all ${
                          simLockPeriod === m
                            ? 'bg-teal-500/10 text-teal-400 font-bold border border-teal-500/15'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {m} Mos
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compounding APY multiplier slider */}
                <div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1.5">
                    <span>REWARDS RATE (APY)</span>
                    <strong className="text-teal-400">{simApy}%</strong>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="18"
                    step="0.5"
                    value={simApy}
                    onChange={(e) => setSimApy(parseFloat(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer h-1"
                  />
                </div>

                <div className="text-[9px] text-zinc-600 font-mono leading-relaxed bg-zinc-900/50 p-2.5 rounded-xl border border-white/[0.02]">
                  *Values computed dynamically via Delta liquid protocol indexes. Actual payouts may fluctuate based on validation load.
                </div>
              </div>

              {/* Dynamic Projection display */}
              <div className="md:col-span-2 bg-zinc-950/40 border border-white/[0.04] p-5 rounded-2xl flex flex-col justify-between select-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Yield Compounding Output</h4>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Projected payout breakdown representing {simLockPeriod} months maturity</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold uppercase">
                    Continuous Compound Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-zinc-950/60 p-4 border border-white/[0.02] rounded-xl">
                    <span className="text-[9px] text-zinc-500 font-mono tracking-wider block uppercase">Compounded Worth</span>
                    <p className="text-xl font-black text-white font-mono mt-1.5">{simOutput.compounded.toLocaleString()} A2Z</p>
                    <span className="text-[9px] text-zinc-500 font-mono mt-1 block">≈ ${(simOutput.compounded * 3.48).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
                  </div>

                  <div className="bg-zinc-950/60 p-4 border border-white/[0.02] rounded-xl">
                    <span className="text-[9px] text-zinc-500 font-mono tracking-wider block uppercase">Net Profit Earned</span>
                    <p className="text-xl font-black text-emerald-400 font-mono mt-1.5">+{simOutput.rewards.toLocaleString()} A2Z</p>
                    <span className="text-[9px] text-zinc-500 font-mono mt-1 block">≈ ${(simOutput.rewards * 3.48).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                {/* High fidelity timeline reward simulator drawing visual */}
                <div className="bg-zinc-950/60 p-4 border border-white/[0.02] rounded-xl font-mono text-[10px]">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block mb-2.5">Compound Milestone Trace Log</span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-500">
                      <span>Staking Capital Initializing</span>
                      <span>{parseFloat(simStakedAmount || '0').toLocaleString()} A2Z</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Maturity 50% Milestone</span>
                      <span>{(parseFloat(simStakedAmount || '0') + (simOutput.rewards / 2)).toFixed(2)} A2Z</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Final Maturity payout ({simLockPeriod} Mos)</span>
                      <span>{simOutput.compounded.toLocaleString()} A2Z</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default A2ZChainDashboard;
