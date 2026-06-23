import React, { useState, useEffect } from 'react';
import { 
  ArrowDown, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  CheckCircle, 
  Cpu, 
  TrendingUp, 
  AlertTriangle,
  CornerDownRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Price indexes relative to USD
const TOKEN_PRICES: Record<string, number> = {
  APT: 14.77,
  SUI: 1.86,
  ETH: 3485.20,
  SOL: 162.45,
  USDC: 1.00
};

interface Holdings {
  APT: number;
  SUI: number;
  ETH: number;
  SOL: number;
  USDC: number;
}

interface SwapperProps {
  holdings: Holdings;
  onSwapCompleted: (fromToken: keyof Holdings, toToken: keyof Holdings, fromAmount: number, toAmount: number) => void;
}

export function InteractiveSwapper({ holdings, onSwapCompleted }: SwapperProps) {
  const [fromToken, setFromToken] = useState<keyof Holdings>('SUI');
  const [toToken, setToToken] = useState<keyof Holdings>('USDC');
  const [fromAmount, setFromAmount] = useState<string>('50');
  const [slippage, setSlippage] = useState<number>(0.5); // percentage
  const [customSlippage, setCustomSlippage] = useState<string>('');
  const [gasPriority, setGasPriority] = useState<'eco' | 'standard' | 'fast' | 'instant'>('fast');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapLogs, setSwapLogs] = useState<string[]>([]);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [routingPool, setRoutingPool] = useState<string>('Shelby Direct Liquidity Path');
  const [showSlippagePanel, setShowSlippagePanel] = useState(false);

  // Synthesize audios for premium UI feedback using Native Web Audio API
  const playSynthBeep = (type: 'initiate' | 'success') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'initiate') {
        // Futuristic charge-up sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        // High-fidelity successful resolution chord
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6 arpeggio chord
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + (index * 0.08));
          gain.gain.setValueAtTime(0.0, ctx.currentTime + (index * 0.08));
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + (index * 0.08) + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (index * 0.08) + 0.4);
          osc.start(ctx.currentTime + (index * 0.08));
          osc.stop(ctx.currentTime + (index * 0.08) + 0.45);
        });
      }
    } catch (e) {
      console.warn("Web Audio Blocked by browser rules:", e);
    }
  };

  // Automatically update the routing pools based on token pairs
  useEffect(() => {
    const pairs = `${fromToken}-${toToken}`;
    if (fromToken === toToken) {
      setRoutingPool("Zero Action Routing");
    } else if (fromToken === 'SOL' || toToken === 'SOL') {
      setRoutingPool("Raydium AMM V4 Multi-Hop");
    } else if (fromToken === 'SUI' || toToken === 'SUI') {
      setRoutingPool("Cetus Ultra-Depth Stable Pool");
    } else if (fromToken === 'APT' || toToken === 'APT') {
      setRoutingPool("Pontem Liquidswap LP Layer");
    } else {
      setRoutingPool("Uniswap V3 High-Density Router");
    }
  }, [fromToken, toToken]);

  const handleMaxAmount = () => {
    setFromAmount(holdings[fromToken].toString());
  };

  // Derived target amounts and pricing impact calculations
  const sourcePrice = TOKEN_PRICES[fromToken] || 1;
  const targetPrice = TOKEN_PRICES[toToken] || 1;
  
  const fromNum = parseFloat(fromAmount) || 0;
  const estimateValueUsd = fromNum * sourcePrice;
  const rawOutput = (fromNum * sourcePrice) / targetPrice;
  
  // Real-world dynamic slippage and price impact simulation
  const computedPriceImpact = fromNum === 0 ? 0 : Math.min(8.5, (fromNum * sourcePrice) / 150000); // larger values degrade rates slightly
  const outputAmount = Math.max(0, rawOutput * (1 - computedPriceImpact / 100));

  // Gas prices based on selection
  const gasFees: Record<string, { fee: string; time: string; costUsd: number }> = {
    eco: { fee: '0.00015', time: '≈ 45 sec', costUsd: 0.15 },
    standard: { fee: '0.00045', time: '≈ 15 sec', costUsd: 0.45 },
    fast: { fee: '0.00095', time: '≈ 4 sec', costUsd: 0.95 },
    instant: { fee: '0.00220', time: '≈ < 1.2 sec', costUsd: 2.20 }
  };

  const activeGas = gasFees[gasPriority];

  const handleInitSwap = async () => {
    if (fromNum <= 0) return;
    if (fromNum > holdings[fromToken]) {
      alert(`INSUFFICIENT_FUNDS: Your connected wallet only holds ${holdings[fromToken]} ${fromToken}. Try a smaller amount.`);
      return;
    }
    if (fromToken === toToken) {
      alert(`MATCHING_ASSETS: Select two different assets to aggregate swap routing.`);
      return;
    }

    setIsSwapping(true);
    setSwapSuccess(false);
    playSynthBeep('initiate');

    const steps = [
      `AGGREGATOR: Resolving best multi-hop path on decentralized router... Found [${routingPool}]`,
      `INTEGRITY: Simulating gas boundaries and transaction limits (Limit: ${slippage}% slippage)...`,
      `VM_COMPILED: Packaging optimized binary state transition stream...`,
      `SENTINEL_NODE: Transmitting contract execution payload through Private RPC nodes...`,
      `LEDGER_EMISSION: Polling blocks for on-chain cryptographic settlement...`,
    ];

    setSwapLogs([`INDEXING: Initiated swapping matrix for ${fromNum} ${fromToken}...`]);

    for (let i = 0; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 550 + Math.random() * 350));
      setSwapLogs((prev) => [...prev, steps[i]]);
    }

    await new Promise((res) => setTimeout(res, 600));
    
    // Execute balance swap
    onSwapCompleted(fromToken, toToken, fromNum, outputAmount);
    setSwapSuccess(true);
    playSynthBeep('success');
    setSwapLogs((prev) => [
      ...prev,
      `SUCCESS: Vault atomic transition cleared! +${outputAmount.toFixed(4)} ${toToken} settled successfully.`
    ]);
    
    setTimeout(() => {
      setIsSwapping(false);
      setFromAmount('0');
    }, 1200);
  };

  const effectiveSlippage = customSlippage !== '' ? (parseFloat(customSlippage) || 0.5) : slippage;

  return (
    <div className="glass rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      {/* Visual cyber highlights */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff5fc0] rounded-tl-[2.5rem] opacity-30 pointer-events-none" />
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff5fc0] animate-pulse" />
            Shelby Real-time Swap Router v3
          </h3>
          <p className="text-zinc-400 text-xs mt-1">
            Seamlessly exchange any virtual assets on active ledger pools. Trades execute instantly and update your balances locally.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setShowSlippagePanel(!showSlippagePanel)}
            className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Configure Slippage & Routing"
          >
            <Sliders className="w-4 h-4 text-[#ff5fc0]" />
            SLIPPAGE: {effectiveSlippage}%
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSlippagePanel && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4.5 rounded-2xl bg-black/40 border border-white/5 mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Slippage Tolerance</span>
                <span className="text-[10px] font-mono text-zinc-500">Auto routing: Enabled</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0.1, 0.5, 1.0, 3.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setSlippage(val);
                      setCustomSlippage('');
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${effectiveSlippage === val ? 'bg-[#ff5fc0]/10 text-[#ff5fc0] border border-[#ff5fc0]/20' : 'bg-white/[0.01] border border-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    {val}%
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={customSlippage}
                    onChange={(e) => setCustomSlippage(e.target.value)}
                    placeholder="Custom"
                    className="w-full h-full bg-white/[0.01] border border-white/5 rounded-xl text-center text-xs font-mono text-white focus:outline-none focus:border-[#ff5fc0]/40"
                  />
                </div>
              </div>
              
              {effectiveSlippage > 2.0 && (
                <div className="text-[10px] text-amber-400 flex items-center gap-1.5 font-mono px-1">
                  <AlertTriangle className="w-4 h-4" /> HIGHSUPPAGE_ALERT: Slippage threshold exceeds 2%. Transaction may be front-run.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* SWAP FIELDS (9 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          
          {/* FROM CARD */}
          <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all space-y-3 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Pay Out</span>
              <span className="text-[10px] font-mono text-zinc-400">
                Wallet Balance: <span className="font-extrabold text-white">{holdings[fromToken].toFixed(2)}</span> {fromToken}
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <input 
                  type="number" 
                  step="any"
                  value={fromAmount}
                  disabled={isSwapping}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white focus:outline-none font-sans"
                />
                <span className="text-[10px] font-mono text-zinc-500 block mt-1">
                  Value ≈ ${estimateValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>

              {/* Selector */}
              <div className="flex flex-col items-end gap-1.5">
                <select
                  value={fromToken}
                  disabled={isSwapping}
                  onChange={(e) => {
                    const val = e.target.value as keyof Holdings;
                    setFromToken(val);
                  }}
                  className="bg-[#0b0914] text-xs font-black uppercase text-white font-mono rounded-xl p-2.5 border border-white/10 focus:outline-none focus:border-[#ff5fc0]/40 appearance-none cursor-pointer"
                >
                  {Object.keys(holdings).map((t) => (
                    <option key={t} value={t} className="bg-zinc-950">{t}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="text-[9px] font-mono bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white px-2 py-0.5 rounded-lg border border-white/5 uppercase"
                >
                  MAX_LP
                </button>
              </div>
            </div>
          </div>

          {/* FLIP BUTTON */}
          <div className="flex justify-center -my-3.5 relative z-10">
            <button
              type="button"
              onClick={() => {
                const temp = fromToken;
                setFromToken(toToken);
                setToToken(temp);
                setFromAmount('0');
              }}
              className="p-3.5 rounded-full bg-zinc-950 border border-white/10 hover:border-[#ff5fc0]/30 hover:bg-white/5 text-zinc-400 hover:text-[#ff5fc0] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

          {/* TO CARD */}
          <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all space-y-3 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Receive Ingress</span>
              <span className="text-[10px] font-mono text-zinc-400">
                Wallet Balance: <span className="font-extrabold text-white">{holdings[toToken].toFixed(2)}</span> {toToken}
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  readOnly 
                  value={fromNum === 0 ? '0.00' : outputAmount.toFixed(4)}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-black text-zinc-300 focus:outline-none font-sans"
                />
                <span className="text-[10px] font-mono text-zinc-500 block mt-1">
                  Fee Impact Slippage Simulated
                </span>
              </div>

              {/* Selector */}
              <div className="flex flex-col items-end gap-1.5">
                <select
                  value={toToken}
                  disabled={isSwapping}
                  onChange={(e) => {
                    const val = e.target.value as keyof Holdings;
                    setToToken(val);
                  }}
                  className="bg-[#0b0914] text-xs font-black uppercase text-white font-mono rounded-xl p-2.5 border border-white/10 focus:outline-none focus:border-[#ff5fc0]/40 appearance-none cursor-pointer"
                >
                  {Object.keys(holdings).map((t) => (
                    <option key={t} value={t} className="bg-zinc-950">{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* GAS SPEED MULTI-SELECTOR */}
          <div className="space-y-2">
            <label className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest px-1">Network Gas Priority Scheduler</label>
            <div className="grid grid-cols-4 gap-2">
              {(['eco', 'standard', 'fast', 'instant'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setGasPriority(lvl)}
                  disabled={isSwapping}
                  className={`p-3.5 rounded-2xl flex flex-col justify-between transition-all border text-left cursor-pointer ${gasPriority === lvl ? 'bg-[#ff5fc0]/5 border-[#ff5fc0]/30 shadow-[0_0_15px_rgba(255,95,192,0.06)]' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'}`}
                >
                  <span className={`text-[8.5px] font-mono uppercase font-black tracking-wider ${gasPriority === lvl ? 'text-[#ff5fc0]' : 'text-zinc-500'}`}>{lvl}</span>
                  <div className="mt-2 text-right">
                    <span className="text-sm font-black text-white font-mono leading-none">{gasFees[lvl].fee}</span>
                    <span className="text-[8.5px] font-mono text-zinc-550 block mt-0.5">{gasFees[lvl].time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SWAP EXECUTE ACTION */}
          <button
            type="button"
            onClick={handleInitSwap}
            disabled={isSwapping || fromNum <= 0}
            className="w-full py-4.5 bg-gradient-to-r from-[#ff5fc0] via-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-black font-mono text-xs tracking-widest uppercase rounded-2xl transition-all shadow-[0_0_25px_rgba(255,95,192,0.25)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none mt-4"
          >
            {isSwapping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                TRANSMITTING_SWAP_PAYLOAD...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                EXECUTE AGGREGATED Atomic SWAP
              </>
            )}
          </button>
        </div>

        {/* HOPS & TELEMETRY LIVE MONITORS (5 Cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#0b0a14]/60 rounded-3xl p-6 border border-white/5 space-y-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Cpu className="w-4 h-4 text-glow-cyan text-cyan-400" />
              <span className="text-[9.5px] font-mono text-zinc-300 font-extrabold uppercase tracking-wider">Dynamic Router Telemetry</span>
            </div>
            
            {/* Live routing map visualizer */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 relative overflow-hidden flex flex-col justify-center h-28">
              <div className="absolute inset-0 bg-[radial-gradient(#141122_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              <div className="flex items-center justify-between relative z-10 px-2">
                {/* Source Node */}
                <div className="text-center">
                  <div className="w-9 h-9 rounded-xl bg-[#ff5fc0]/10 border border-[#ff5fc0]/30 flex items-center justify-center text-white text-xs font-black font-mono shadow-[0_0_10px_rgba(255,95,192,0.2)]">
                    {fromToken}
                  </div>
                  <span className="text-[7.5px] font-mono text-zinc-500 block mt-1">SOURCE</span>
                </div>

                {/* Animated Bridge Route */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="h-0.5 w-[85%] bg-gradient-to-r from-[#ff5fc0] via-cyan-400 to-[#14f195] relative">
                    <span className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-white -translate-y-1/2 animate-ping" />
                    {/* Pulsing signal bullet */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-[pulse_1.5s_infinite] left-[45%]" />
                  </div>
                  <span className="text-[8px] font-mono text-cyan-400 tracking-wider uppercase mt-1.5 font-bold animate-pulse text-center">
                    {routingPool}
                  </span>
                </div>

                {/* Target Node */}
                <div className="text-center">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-white text-xs font-black font-mono shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    {toToken}
                  </div>
                  <span className="text-[7.5px] font-mono text-zinc-500 block mt-1">SETTLED</span>
                </div>
              </div>
            </div>

            {/* Price impact indicators */}
            <div className="mt-5 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.01] border-b border-white/[0.03]">
                <span className="text-zinc-500 uppercase text-[9px]">Calculated Rate</span>
                <span className="font-extrabold text-zinc-200">1 {fromToken} ≈ {(sourcePrice / targetPrice).toFixed(5)} {toToken}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.01] border-b border-white/[0.03]">
                <span className="text-zinc-500 uppercase text-[9px]">Aggregated Liquidity Path</span>
                <span className="font-extrabold text-zinc-200 text-glow-cyan text-right truncate pl-2 max-w-[150px]">{routingPool}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.01] border-b border-white/[0.03]">
                <span className="text-zinc-500 uppercase text-[9px]">Rate Price Impact</span>
                <span className={`font-extrabold text-zinc-200 ${computedPriceImpact > 1.0 ? 'text-amber-400' : 'text-emerald-400'}`}>{computedPriceImpact === 0 ? '0.00' : computedPriceImpact.toFixed(3)}%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.01]">
                <span className="text-zinc-500 uppercase text-[9px]">Frictionless Gas Deduction</span>
                <span className="font-extrabold text-zinc-200">{activeGas.fee} {fromToken} ({activeGas.time})</span>
              </div>
            </div>
          </div>

          {/* TELEMETRY CONSOLE STREAM OUTLET */}
          <div className="space-y-2 flex-1 flex flex-col justify-end">
            <span className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest px-1">Decentralized Execution Logs</span>
            <div className="p-4.5 rounded-2xl bg-black border border-white/5 h-[160px] overflow-y-auto font-mono text-[9px] text-[#ff5fc0]/90 space-y-1.5 scrollbar-hide flex flex-col-reverse justify-end select-none">
              <AnimatePresence initial={false}>
                {swapLogs.length === 0 ? (
                  <div className="text-zinc-650 italic text-center h-full flex flex-col justify-center">
                    <Info className="w-5 h-5 mx-auto mb-1 opacity-20" />
                    <p>Aggregator standing by. Awaiting balance input validation.</p>
                  </div>
                ) : (
                  [...swapLogs].reverse().map((log, idx) => {
                    const isSuccess = log.includes('SUCCESS') || log.includes('原子');
                    const isAlert = log.includes('INTEGRITY') || log.includes('SIMULATING');
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${isSuccess ? 'text-emerald-400 font-extrabold' : isAlert ? 'text-cyan-300 font-medium' : 'text-zinc-400'}`}
                      >
                        {log.startsWith('SUCCESS') || log.startsWith('AGGREGATOR') || log.startsWith('SENTINEL') || log.startsWith('LEDGER') || log.startsWith('INDEXING') ? '● ' : '  '} 
                        {log}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
