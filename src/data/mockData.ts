export interface Ecosystem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: { isPositive: boolean; value: string };
  metrics: {
    tvl: string;
    volume24h: string;
    activeUsers24h: string;
    avgGas: string;
    speedTps: string;
  };
  color: string;
  glowColor: string;
  gradient: string;
}

export interface NFTCollection {
  id: string;
  name: string;
  chain: string;
  floorPrice: string;
  volume24h: string;
  change24h: string;
  listings: number;
  image: string;
  rarityScore: string;
}

export interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  price: string;
  change24h: { isPositive: boolean; value: string };
  volume24h: string;
  marketCap: string;
  sparkline: number[];
}

export interface LiveTx {
  id: string;
  hash: string;
  chain: string;
  from: string;
  to: string;
  value: string;
  token: string;
  type: 'Transfer' | 'Swap' | 'Mint' | 'Stake';
  gas: string;
  timestamp: string;
  status: 'SUCCESS' | 'SYNCING';
}

export const ECOSYSTEMS: Ecosystem[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,485.20',
    change24h: { isPositive: true, value: '+3.85%' },
    metrics: {
      tvl: '$48.5B',
      volume24h: '$1.42B',
      activeUsers24h: '385K',
      avgGas: '18 Gwei',
      speedTps: '15 TPS',
    },
    color: '#6366f1', // Electric Indigo
    glowColor: 'rgba(99, 102, 241, 0.4)',
    gradient: 'from-indigo-500 to-indigo-800',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: '$162.45',
    change24h: { isPositive: true, value: '+7.12%' },
    metrics: {
      tvl: '$4.12B',
      volume24h: '$985M',
      activeUsers24h: '1.2M',
      avgGas: '0.00025 SOL',
      speedTps: '2,850 TPS',
    },
    color: '#14f195', // Acid Green/Cyan
    glowColor: 'rgba(20, 241, 149, 0.4)',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'sui',
    name: 'Sui',
    symbol: 'SUI',
    price: '$1.86',
    change24h: { isPositive: true, value: '+12.40%' },
    metrics: {
      tvl: '$982M',
      volume24h: '$285M',
      activeUsers24h: '290K',
      avgGas: '0.0015 SUI',
      speedTps: '1,240 TPS',
    },
    color: '#38bdf8', // Light blue/cyan neon
    glowColor: 'rgba(56, 189, 248, 0.4)',
    gradient: 'from-sky-400 to-blue-600',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'POL',
    price: '$0.72',
    change24h: { isPositive: false, value: '-1.25%' },
    metrics: {
      tvl: '$1.11B',
      volume24h: '$120M',
      activeUsers24h: '180K',
      avgGas: '45 Gwei',
      speedTps: '68 TPS',
    },
    color: '#a855f7', // Purple Neon
    glowColor: 'rgba(168, 85, 247, 0.4)',
    gradient: 'from-purple-500 to-violet-800',
  },
  {
    id: 'aptos',
    name: 'Aptos',
    symbol: 'APT',
    price: '$9.48',
    change24h: { isPositive: true, value: '+4.55%' },
    metrics: {
      tvl: '$412M',
      volume24h: '$98M',
      activeUsers24h: '115K',
      avgGas: '0.002 APT',
      speedTps: '380 TPS',
    },
    color: '#ff2d55', // Hot Magenta/Red
    glowColor: 'rgba(255, 45, 85, 0.4)',
    gradient: 'from-pink-500 to-rose-700',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    price: '$8.35',
    change24h: { isPositive: false, value: '-0.42%' },
    metrics: {
      tvl: '$642M',
      volume24h: '$42M',
      activeUsers24h: '45K',
      avgGas: '0.005 ATOM',
      speedTps: '45 TPS',
    },
    color: '#ff79c6', // Pink Pastel Neon
    glowColor: 'rgba(255, 121, 198, 0.4)',
    gradient: 'from-pink-400 to-purple-600',
  },
];

export const NFT_COLLECTIONS: NFTCollection[] = [
  {
    id: 'mad-lads',
    name: 'Mad Lads',
    chain: 'Solana',
    floorPrice: '84.5 SOL',
    volume24h: '32,180 SOL',
    change24h: '+14.5%',
    listings: 242,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
    rarityScore: '96.4',
  },
  {
    id: 'pudgy-penguins',
    name: 'Pudgy Penguins',
    chain: 'Ethereum',
    floorPrice: '12.8 ETH',
    volume24h: '425 ETH',
    change24h: '+4.20%',
    listings: 114,
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300',
    rarityScore: '92.1',
  },
  {
    id: 'fuddies',
    name: 'Fuddies',
    chain: 'Sui',
    floorPrice: '150 SUI',
    volume24h: '41,200 SUI',
    change24h: '+21.8%',
    listings: 410,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=300',
    rarityScore: '89.5',
  },
  {
    id: 'aptos-monkeys',
    name: 'Aptos Monkeys',
    chain: 'Aptos',
    floorPrice: '28.4 APT',
    volume24h: '12,400 APT',
    change24h: '-2.15%',
    listings: 185,
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=300',
    rarityScore: '87.2',
  },
  {
    id: 'bored-apes',
    name: 'Bored Ape Yacht Club',
    chain: 'Ethereum',
    floorPrice: '14.2 ETH',
    volume24h: '912 ETH',
    change24h: '-5.85%',
    listings: 341,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=300',
    rarityScore: '98.9',
  },
  {
    id: 'cosmos-spaceships',
    name: 'Cosmos Drifters',
    chain: 'Cosmos',
    floorPrice: '18.5 ATOM',
    volume24h: '2,900 ATOM',
    change24h: '+8.32%',
    listings: 73,
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=300',
    rarityScore: '85.4',
  },
];

export const TRENDING_TOKENS: TrendingToken[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    chain: 'Ethereum',
    price: '$3,485.20',
    change24h: { isPositive: true, value: '+3.85%' },
    volume24h: '$12.4B',
    marketCap: '$418.5B',
    sparkline: [3320, 3360, 3340, 3400, 3390, 3450, 3485],
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    chain: 'Solana',
    price: '$162.45',
    change24h: { isPositive: true, value: '+7.12%' },
    volume24h: '$4.8B',
    marketCap: '$74.1B',
    sparkline: [148, 151, 150, 156, 154, 159, 162.45],
  },
  {
    id: 'sui-token',
    name: 'Sui',
    symbol: 'SUI',
    chain: 'Sui',
    price: '$1.86',
    change24h: { isPositive: true, value: '+12.40%' },
    volume24h: '$985M',
    marketCap: '$4.8B',
    sparkline: [1.52, 1.58, 1.62, 1.69, 1.74, 1.81, 1.86],
  },
  {
    id: 'pol-token',
    name: 'Polygon Ecosystem Token',
    symbol: 'POL',
    chain: 'Polygon',
    price: '$0.725',
    change24h: { isPositive: false, value: '-1.25%' },
    volume24h: '$412M',
    marketCap: '$7.2B',
    sparkline: [0.74, 0.738, 0.732, 0.729, 0.735, 0.728, 0.725],
  },
  {
    id: 'apt-token',
    name: 'Aptos',
    symbol: 'APT',
    chain: 'Aptos',
    price: '$9.48',
    change24h: { isPositive: true, value: '+4.55%' },
    volume24h: '$312M',
    marketCap: '$4.4B',
    sparkline: [8.9, 9.1, 9.05, 9.25, 9.18, 9.35, 9.48],
  },
  {
    id: 'atom-token',
    name: 'Cosmos Hub',
    symbol: 'ATOM',
    chain: 'Cosmos',
    price: '$8.35',
    change24h: { isPositive: false, value: '-0.42%' },
    volume24h: '$185M',
    marketCap: '$3.2B',
    sparkline: [8.42, 8.45, 8.39, 8.41, 8.37, 8.32, 8.35],
  },
  {
    id: 'jup-token',
    name: 'Jupiter',
    symbol: 'JUP',
    chain: 'Solana',
    price: '$1.12',
    change24h: { isPositive: true, value: '+14.25%' },
    volume24h: '$520M',
    marketCap: '$1.5B',
    sparkline: [0.94, 0.98, 1.02, 1.01, 1.06, 1.09, 1.12],
  },
  {
    id: 'pyth-token',
    name: 'Pyth Network',
    symbol: 'PYTH',
    chain: 'Solana',
    price: '$0.465',
    change24h: { isPositive: true, value: '+5.80%' },
    volume24h: '$98M',
    marketCap: '$1.6B',
    sparkline: [0.43, 0.442, 0.438, 0.45, 0.448, 0.458, 0.465],
  },
];

export const MOCK_LIVE_TX: LiveTx[] = [
  {
    id: 'tx-1',
    hash: '0x7fd3...9b21',
    chain: 'Ethereum',
    from: '0x8f2d...fa41',
    to: '0x0d3e...ee99',
    value: '42.50 ETH',
    token: 'ETH',
    type: 'Transfer',
    gas: '$12.45',
    timestamp: 'Just now',
    status: 'SUCCESS',
  },
  {
    id: 'tx-2',
    hash: 'Hw2e...Zp9L',
    chain: 'Solana',
    from: 'G8xf...Kp22',
    to: 'A8dy...Qp88',
    value: '1,250.00 SOL',
    token: 'SOL',
    type: 'Swap',
    gas: '$0.0001',
    timestamp: 'Just now',
    status: 'SUCCESS',
  },
  {
    id: 'tx-3',
    hash: '0xsui2e...88ab',
    chain: 'Sui',
    from: '0xsuia...fb11',
    to: '0xsui8...33ee',
    value: '15,000 SUI',
    token: 'SUI',
    type: 'Stake',
    gas: '$0.0003',
    timestamp: '3s ago',
    status: 'SUCCESS',
  },
  {
    id: 'tx-4',
    hash: '0xapt99...11cf',
    chain: 'Aptos',
    from: '0xapta...2288',
    to: '0xapt8...ff99',
    value: '220.00 APT',
    token: 'APT',
    type: 'Mint',
    gas: '$0.0018',
    timestamp: '5s ago',
    status: 'SUCCESS',
  },
  {
    id: 'tx-5',
    hash: '0x32ab...df11',
    chain: 'Polygon',
    from: '0xc8fd...ab23',
    to: '0x1aa2...4490',
    value: '5,000.00 POL',
    token: 'POL',
    type: 'Swap',
    gas: '$0.024',
    timestamp: '12s ago',
    status: 'SUCCESS',
  },
  {
    id: 'tx-6',
    hash: 'cosmos1...bb42',
    chain: 'Cosmos',
    from: 'cosmos2...aa12',
    to: 'cosmos3...fc99',
    value: '850.00 ATOM',
    token: 'ATOM',
    type: 'Transfer',
    gas: '$0.015',
    timestamp: '25s ago',
    status: 'SUCCESS',
  },
];

// Generate an interactive 7x24 on-chain activity heatmap grid:
export const generateHeatmapData = (chainId: string) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
  // Seed-based variation using string length or index
  const seed = chainId.charCodeAt(0) + chainId.length;
  
  return days.map((day, dIdx) => {
    return {
      day,
      hours: hours.map((hour, hIdx) => {
        // Pseudo-random but consistent activity score 0-100
        const wave = Math.sin((hIdx / 24) * Math.PI * 2) * 20;
        const offset = ((dIdx * hIdx + seed) % 50);
        const rawValue = Math.max(10, Math.floor(40 + wave + offset));
        return {
          hour,
          value: rawValue,
        };
      }),
    };
  });
};
