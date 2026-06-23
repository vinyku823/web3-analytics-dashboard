import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, ArrowDownUp, AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { Holdings, TokenPrices } from '../types';

interface InteractiveSwapperProps {
  holdings: Holdings;
  prices: TokenPrices;
  onSwapCompleted: (
    fromToken: keyof Holdings,
    toToken: keyof Holdings,
    fromAmount: number,
    toAmount: number
  ) => void;
}

export const InteractiveSwapper: React.FC<InteractiveSwapperProps> = ({
  holdings,
  prices,
  onSwapCompleted,
}) => {
  const [fromToken, setFromToken] = useState<keyof Holdings>('APT');
  const [toToken, setToToken] = useState<keyof Holdings>('USDC');
  const [fromAmount, setFromAmount] = useState<string>('10');
  const [toAmount, setToAmount] = useState<string>('0');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccess, setSwapSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recalculate exchange rate
  const rate = prices[fromToken] / prices[toToken];
  const exchangeRateText = `1 ${fromToken} ≈ ${rate.toFixed(4)} ${toToken}`;

  useEffect(() => {
    const numAmt = parseFloat(fromAmount);
    if (!isNaN(numAmt) && numAmt > 0) {
      const calculatedOutput = numAmt * rate;
      // Deduct minimal network/routing fees (0.1%)
      const netOutput = calculatedOutput * 0.999;
      setToAmount(netOutput.toFixed(4));
    } else {
      setToAmount('0');
    }
  }, [fromAmount, fromToken, toToken, rate]);

  const handleSwap = () => {
    setErrorMsg(null);
    setSwapSuccess(false);

    const val = parseFloat(fromAmount);
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Please input a valid quantity');
      return;
    }

    if (fromToken === toToken) {
      setErrorMsg('Cannot swap identical assets');
      return;
    }

    const maxHold = holdings[fromToken];
    if (val > maxHold) {
      setErrorMsg(`Insufficient balance! Your max limit is ${maxHold.toFixed(2)} ${fromToken}`);
      return;
    }

    setIsSwapping(true);

    // Simulate multi-chain router resolution tracing
    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      const outVal = parseFloat(toAmount);
      onSwapCompleted(fromToken, toToken, val, outVal);

      // Hide success notification after 5s
      setTimeout(() => setSwapSuccess(false), 5000);
    }, 1500);
  };

  const handleMax = () => {
    setFromAmount(holdings[fromToken].toString());
  };

  const handleInvert = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
  };

  return (
    <div id="interactive-swapper" className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-6 shadow-2xl relative overflow-hidden">
      {/* Absolute ambient lights */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Shelby Native DEX Router
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Instant Atomic Multichain Settlement</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Slippage tolerance options */}
          <div className="flex bg-zinc-950/80 p-0.5 rounded-lg border border-white/[0.04]">
            {[0.1, 0.5, 1.0].map((s) => (
              <button
                key={s}
                id={`slippage-btn-${s}`}
                onClick={() => setSlippage(s)}
                className={`px-2 py-1 text-[9px] font-mono rounded-md transition-all ${
                  slippage === s
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* From Input Wrapper */}
      <div className="bg-zinc-950/80 rounded-xl border border-white/[0.04] p-4 mb-2 relative">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-zinc-500 font-mono">FROM</span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Balance: <span className="text-zinc-300 font-black">{holdings[fromToken].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
          </span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <input
            id="swapper-from-input"
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="bg-transparent text-xl font-black text-white w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.00"
          />
          <div className="flex items-center gap-1.5">
            <button
              id="swapper-max-btn"
              onClick={handleMax}
              className="text-[9px] font-mono leading-none px-1.5 py-1 bg-zinc-900 border border-white/[0.08] rounded hover:border-teal-500/30 text-zinc-400 hover:text-teal-400 transition-all font-bold"
            >
              MAX
            </button>
            <select
              id="swapper-from-token-select"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value as keyof Holdings)}
              className="bg-zinc-900 text-xs font-black text-white rounded-lg border border-white/[0.08] px-2.5 py-1.5 outline-none cursor-pointer focus:border-teal-500/30"
            >
              {Object.keys(holdings).map((tok) => (
                <option key={tok} value={tok}>
                  {tok}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-[10px] text-zinc-600 font-mono mt-1">
          ≈ ${(parseFloat(fromAmount || '0') * prices[fromToken]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>
      </div>

      {/* Switch divider button */}
      <div className="flex justify-center -my-3.5 relative z-10">
        <button
          id="swapper-invert-btn"
          onClick={handleInvert}
          className="p-2 rounded-xl bg-zinc-900 border border-white/[0.08] hover:border-teal-400/30 transition-all text-zinc-400 hover:text-teal-400 hover:scale-105 active:scale-95 shadow-md shadow-black/80"
        >
          <ArrowDownUp size={13} />
        </button>
      </div>

      {/* To Input Wrapper */}
      <div className="bg-zinc-950/80 rounded-xl border border-white/[0.04] p-4 mt-2 mb-4 relative">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-zinc-500 font-mono">TO (ESTIMATED)</span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Balance: <span className="text-zinc-300 font-black">{holdings[toToken].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
          </span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="text-xl font-black text-zinc-300 w-full overflow-hidden truncate">
            {parseFloat(toAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </div>
          <select
            id="swapper-to-token-select"
            value={toToken}
            onChange={(e) => setToToken(e.target.value as keyof Holdings)}
            className="bg-zinc-900 text-xs font-black text-white rounded-lg border border-white/[0.08] px-2.5 py-1.5 outline-none cursor-pointer focus:border-teal-500/30"
          >
            {Object.keys(holdings).map((tok) => (
              <option key={tok} value={tok}>
                {tok}
              </option>
            ))}
          </select>
        </div>
        <div className="text-[10px] text-zinc-600 font-mono mt-1">
          ≈ ${(parseFloat(toAmount || '0') * prices[toToken]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>
      </div>

      {/* Live Routing Pathway Detail Panel */}
      <div className="bg-zinc-950/40 border border-white/[0.02] p-3 rounded-lg flex flex-col gap-1.5 text-[10px] font-mono text-zinc-500 mb-4">
        <div className="flex justify-between">
          <span>Best Route Found</span>
          <span className="text-teal-400 font-bold">Shelby Smart Router L2 → MPC VM</span>
        </div>
        <div className="flex justify-between">
          <span>Exchange Rate</span>
          <span className="text-zinc-300">{exchangeRateText}</span>
        </div>
        <div className="flex justify-between">
          <span>Fee Deductions (0.1%)</span>
          <span className="text-zinc-400">{(parseFloat(fromAmount || '0') * 0.001).toFixed(4)} {fromToken}</span>
        </div>
        <div className="flex justify-between">
          <span>Max Slippage Buffer</span>
          <span className="text-zinc-400">{slippage}%</span>
        </div>
      </div>

      {/* Error & Success States Panel */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-[10px] font-mono flex items-center gap-2 mb-4"
          >
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {swapSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-teal-500/10 border border-teal-500/20 text-teal-400 p-3 rounded-lg text-[10px] font-mono flex items-center gap-2 mb-4"
          >
            <CheckCircle2 size={14} className="shrink-0" />
            <span>Atomic Multi-chain Trade Settled Successfully! Your balance has updated.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swap Action Button */}
      <button
        id="swapper-submit-btn"
        onClick={handleSwap}
        disabled={isSwapping}
        className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider relative overflow-hidden transition-all duration-300 flex justify-center items-center gap-2 ${
          isSwapping
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-teal-400 text-zinc-950 font-black hover:bg-teal-300 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] active:scale-[0.99]'
        }`}
      >
        {isSwapping ? (
          <>
            <RefreshCw size={15} className="animate-spin text-zinc-500" />
            Resolving On-chain Cross Swap...
          </>
        ) : (
          <>
            <TrendingUp size={15} />
            Execute Swap Protocol
          </>
        )}
      </button>
    </div>
  );
};
