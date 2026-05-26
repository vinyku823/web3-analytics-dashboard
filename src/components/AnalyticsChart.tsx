import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, RefreshCw, Layers, ZoomIn, Eye, Activity } from 'lucide-react';

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AnalyticsChartProps {
  selectedChainId?: string;
}

export function AnalyticsChart({ selectedChainId = 'ethereum' }: AnalyticsChartProps) {
  const [timeframe, setTimeframe] = useState<'15M' | '1H' | '4H' | '1D'>('1H');
  const [chartMode, setChartMode] = useState<'candlestick' | 'mountain'>('candlestick');
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Price templates based on chains to keep simulation looking 100% real
  const chainPriceBaselines: Record<string, { base: number; spread: number; volumeBase: number; symbol: string }> = {
    ethereum: { base: 3485.20, spread: 45, volumeBase: 240, symbol: 'ETH' },
    arbitrum: { base: 1.18, spread: 0.04, volumeBase: 890, symbol: 'ARB' },
    base: { base: 3485.20, spread: 50, volumeBase: 350, symbol: 'BASE' },
    polygon: { base: 0.72, spread: 0.015, volumeBase: 710, symbol: 'POL' },
    optimism: { base: 2.45, spread: 0.08, volumeBase: 420, symbol: 'OP' },
    solana: { base: 162.45, spread: 6.5, volumeBase: 1200, symbol: 'SOL' },
    sui: { base: 1.86, spread: 0.06, volumeBase: 950, symbol: 'SUI' },
    aptos: { base: 9.48, spread: 0.25, volumeBase: 310, symbol: 'APT' },
    cosmos: { base: 8.35, spread: 0.18, volumeBase: 190, symbol: 'ATOM' },
  };

  const currentChainConfig = chainPriceBaselines[selectedChainId] || chainPriceBaselines.ethereum;

  // Generate historical candle series
  useEffect(() => {
    const config = currentChainConfig;
    const size = 26;
    const generated: Candle[] = [];
    let prevClose = config.base - (size * (config.spread * 0.15));

    for (let i = 0; i < size; i++) {
      const open = prevClose;
      const change = (Math.random() - 0.48) * config.spread;
      const close = open + change;
      const high = Math.max(open, close) + (Math.random() * (config.spread * 0.3));
      const low = Math.min(open, close) - (Math.random() * (config.spread * 0.3));
      const volume = config.volumeBase + Math.floor(Math.random() * config.volumeBase);

      // Label based on timeframe
      let timeStr = '';
      if (timeframe === '15M') {
        const mins = (i * 15) % 60;
        const hr = Math.floor((i * 15) / 60) % 24;
        timeStr = `${hr.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      } else if (timeframe === '1H') {
        timeStr = `${(i % 24).toString().padStart(2, '0')}:00`;
      } else if (timeframe === '4H') {
        timeStr = `${((i * 4) % 24).toString().padStart(2, '0')}:00`;
      } else {
        timeStr = `May ${15 + i % 12}`;
      }

      generated.push({ time: timeStr, open, high, low, close, volume });
      prevClose = close;
    }

    setCandles(generated);
    setHoveredCandle(null);
  }, [selectedChainId, timeframe]);

  // Real-time tick generator blinks prices and updates active candles
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev];
        const lastIndex = next.length - 1;
        const current = next[lastIndex];

        // Random subtle oscillation
        const wigglePrice = (Math.random() - 0.5) * (currentChainConfig.spread * 0.04);
        const newClose = parseFloat((current.close + wigglePrice).toFixed(4));
        const newHigh = parseFloat(Math.max(current.high, newClose).toFixed(4));
        const newLow = parseFloat(Math.min(current.low, newClose).toFixed(4));

        next[lastIndex] = {
          ...current,
          close: newClose,
          high: newHigh,
          low: newLow,
          volume: current.volume + Math.floor(Math.random() * 5)
        };

        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [selectedChainId, currentChainConfig]);

  // Handle mouse move inside svg for custom crosshair logic
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current || candles.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHoverPosition({ x, y });

    // Deduce which candle is hovered based on X position dividing width
    const svgWidth = rect.width;
    const candleWidth = svgWidth / candles.length;
    const hoverIndex = Math.floor(x / candleWidth);

    if (hoverIndex >= 0 && hoverIndex < candles.length) {
      setHoveredCandle(candles[hoverIndex]);
    } else {
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setHoveredCandle(null);
  };

  // Helper values for drawing SVG coordinates
  const highestPrice = Math.max(...candles.map((c) => c.high));
  const lowestPrice = Math.min(...candles.map((c) => c.low));
  const highestVolume = Math.max(...candles.map((c) => c.volume));
  const priceRange = highestPrice - lowestPrice || 1;

  // Convert price coordinate to Y coordinate pixels
  const getPriceY = (price: number, height: number) => {
    // Reserve 12% space at the top and bottom
    const pad = height * 0.12;
    const usableHeight = height - (pad * 2);
    return pad + usableHeight * (1 - (price - lowestPrice) / priceRange);
  };

  const displayCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);
  const changePercent = displayCandle 
    ? ((displayCandle.close - displayCandle.open) / displayCandle.open) * 100 
    : 0;
  const isBullish = displayCandle ? displayCandle.close >= displayCandle.open : true;

  return (
    <div className="w-full flex flex-col h-full select-none" ref={containerRef}>
      {/* HUD (Heads-Up Display) Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.04] pb-4 mb-5 gap-4">
        {/* Timeframes */}
        <div className="flex items-center gap-1.5 p-1 bg-[#090812] border border-white/5 rounded-xl">
          {(['15M', '1H', '4H', '1D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 font-mono text-[10px] font-black tracking-widest rounded-lg transition-all cursor-pointer ${timeframe === tf ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-400/25 shadow-[0_0_12px_rgba(34,211,238,0.1)]' : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'}`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* HUD values */}
        {displayCandle && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px]">
            <span className="text-[#a855f7] font-black uppercase text-[9px] tracking-wider tracking-[0.15em]">
              {hoveredCandle ? '// CURSOR' : '// LIVE FEED'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[9px]">O</span>
              <span className="text-zinc-200 font-extrabold">${displayCandle.open.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[9px]">H</span>
              <span className="text-emerald-400 font-extrabold">${displayCandle.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[9px]">L</span>
              <span className="text-rose-400 font-extrabold">${displayCandle.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[9px]">C</span>
              <span className={`font-black ${isBullish ? 'text-cyan-400' : 'text-pink-500'}`}>
                ${displayCandle.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 text-[9px]">VOL</span>
              <span className="text-zinc-300 font-extrabold">{displayCandle.volume.toLocaleString()}{currentChainConfig.symbol}</span>
            </div>
            <span className={`font-extrabold tracking-wide ${changePercent >= 0 ? 'text-cyan-400' : 'text-pink-500'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        )}

        {/* Display options */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-[#090812] border border-white/5 rounded-xl">
          <button
            onClick={() => setChartMode('candlestick')}
            className={`px-3 py-1 text-[9px] font-mono font-black tracking-widest rounded-lg transition-all cursor-pointer ${chartMode === 'candlestick' ? 'bg-[#ff2d55]/10 text-pink-400 border border-pink-500/20' : 'text-zinc-500 hover:text-zinc-100'}`}
          >
            CANDLES
          </button>
          <button
            onClick={() => setChartMode('mountain')}
            className={`px-3 py-1 text-[9px] font-mono font-black tracking-widest rounded-lg transition-all cursor-pointer ${chartMode === 'mountain' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-100'}`}
          >
            MOUNTAIN
          </button>
        </div>
      </div>

      {/* Main Graph SVG Stage */}
      <div className="flex-1 relative min-h-[280px]">
        {/* Background Grid Labels */}
        <div className="absolute top-0 bottom-0 right-0 w-16 p-2 border-l border-white/[0.03] flex flex-col justify-between font-mono text-[8px] text-zinc-550 pointer-events-none z-0">
          <span>${highestPrice.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
          <span>${(lowestPrice + priceRange * 0.75).toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
          <span>${(lowestPrice + priceRange * 0.5).toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
          <span>${(lowestPrice + priceRange * 0.25).toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
          <span>${lowestPrice.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
        </div>

        {candles.length > 0 && (
          <svg
            className="w-full h-full cursor-crosshair overflow-visible z-10 relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Real SVG rendering context */}
            <g>
              {/* Vertical grids / borders */}
              {candles.map((candle, idx) => {
                const candleWidth = 100 / candles.length;
                const pctX = (idx + 0.5) * candleWidth;
                return (
                  <line
                    key={`grid-${idx}`}
                    x1={`${pctX}%`}
                    y1="4%"
                    x2={`${pctX}%`}
                    y2="96%"
                    stroke="rgba(255,255,255,0.015)"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                );
              })}

              {/* Horizontal rule indicators */}
              {[0.25, 0.5, 0.75].map((level, idx) => (
                <line
                  key={`h-grid-${idx}`}
                  x1="0%"
                  y1={`${level * 100}%`}
                  x2="100%"
                  y2={`${level * 100}%`}
                  stroke="rgba(255,255,255,0.01)"
                  strokeWidth="1"
                />
              ))}

              {/* Volume Bars overlay along bottom */}
              {candles.map((candle, idx) => {
                const wPct = 85 / candles.length;
                const spacingPct = 100 / candles.length;
                const pctX = (idx * spacingPct) + ((spacingPct - wPct) / 2);
                const barHeight = (candle.volume / highestVolume) * 45; // max 45px tall
                const isGreen = candle.close >= candle.open;

                return (
                  <rect
                    key={`vol-${idx}`}
                    x={`${pctX}%`}
                    y={`${100 - barHeight - 4}%`} // offset by bottom boundary
                    width={`${wPct}%`}
                    height={`${barHeight}%`}
                    fill={isGreen ? 'rgba(34, 211, 238, 0.12)' : 'rgba(239, 68, 68, 0.12)'}
                    stroke={isGreen ? 'rgba(34, 211, 238, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Mountain Mode vs Candlestick Mode rendering paths */}
              {chartMode === 'mountain' ? (
                <>
                  {/* Glowing gradient mountain area fill */}
                  <path
                    d={`
                      M 0 300
                      ${candles.map((c, idx) => {
                        const pctX = (idx / (candles.length - 1)) * 100;
                        // Mock standard width scaling height
                        const y = getPriceY(c.close, 250);
                        return `L ${pctX}% ${y}`;
                      }).join(' ')}
                      L 100% 300 Z
                    `}
                    fill="url(#mountainGrad)"
                    stroke="none"
                  />
                  
                  {/* Core Mountain Path Line */}
                  <path
                    d={candles.map((c, idx) => {
                      const pctX = (idx / (candles.length - 1)) * 100;
                      const y = getPriceY(c.close, 250);
                      return `${idx === 0 ? 'M' : 'L'} ${pctX}% ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3.5"
                    className="drop-shadow-[0_0_12px_#8b5cf6]"
                  />

                  {/* Gradient declarations */}
                  <defs>
                    <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </>
              ) : (
                /* Candlestick Mode: Draw wicks & candle bodies */
                candles.map((candle, idx) => {
                  const spacingPct = 100 / candles.length;
                  const pctX = (idx + 0.5) * spacingPct;
                  
                  const yHigh = getPriceY(candle.high, 250);
                  const yLow = getPriceY(candle.low, 250);
                  const yOpen = getPriceY(candle.open, 250);
                  const yClose = getPriceY(candle.close, 250);
                  
                  const isUp = candle.close >= candle.open;
                  const bodyY = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1.5); // min 1.5px tall for flat candles
                  const wPct = 68 / candles.length; // candle width with gap padding
                  const bodyXPct = (idx * spacingPct) + ((spacingPct - wPct) / 2);

                  // Colors: Bullish = vibrant cyan shadow, Bearish = neon magenta shadow
                  const neonColor = isUp ? '#22d3ee' : '#ff5fc0';

                  return (
                    <g key={`candle-${idx}`} className="transition-all duration-300">
                      {/* Wick Line */}
                      <line
                        x1={`${pctX}%`}
                        y1={yHigh}
                        x2={`${pctX}%`}
                        y2={yLow}
                        stroke={neonColor}
                        strokeWidth="1.2"
                      />
                      
                      {/* Candle Body Rect */}
                      <rect
                        x={`${bodyXPct}%`}
                        y={bodyY}
                        width={`${wPct}%`}
                        height={bodyHeight}
                        fill={isUp ? 'rgba(34, 211, 238, 0.35)' : 'rgba(255, 95, 192, 0.35)'}
                        stroke={neonColor}
                        strokeWidth="1.5"
                        rx="1.5"
                        style={{
                          filter: `drop-shadow(0 0 4px ${neonColor}35)`
                        }}
                      />
                    </g>
                  );
                })
              )}

              {/* Hover Crosshair Overlay */}
              {hoverPosition && (
                <g>
                  {/* Vertical Hover Line */}
                  <line
                    x1={hoverPosition.x}
                    y1={0}
                    x2={hoverPosition.x}
                    y2="100%"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="pointer-events-none"
                  />
                  {/* Horizontal Hover Line */}
                  <line
                    x1={0}
                    y1={hoverPosition.y}
                    x2="100%"
                    y2={hoverPosition.y}
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="pointer-events-none"
                  />
                  {/* Hover Marker Dot */}
                  <circle
                    cx={hoverPosition.x}
                    cy={hoverPosition.y}
                    r="5"
                    fill="#ff2d55"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="animate-ping pointer-events-none"
                  />
                </g>
              )}
            </g>
          </svg>
        )}
      </div>

      {/* X Axis Time Labels */}
      <div className="flex justify-between px-2 pt-3 border-t border-white/[0.03] font-mono text-[8px] text-zinc-500 uppercase tracking-widest select-none bg-black/10 rounded-b-xl">
        <span>{candles[0]?.time}</span>
        <span>{candles[Math.floor(candles.length / 4)]?.time}</span>
        <span>{candles[Math.floor(candles.length / 2)]?.time}</span>
        <span>{candles[Math.floor(candles.length * 0.75)]?.time}</span>
        <span>{candles[candles.length - 1]?.time}</span>
      </div>
    </div>
  );
}
