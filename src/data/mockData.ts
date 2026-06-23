import { Ecosystem, LiveTx, TrendingToken, NFTCollection } from '../types';

export const ECOSYSTEMS: Ecosystem[] = [
  {
    id: 'ethereum',
    name: 'Ethereum L1',
    tvl: '$48.5B',
    volume24h: '$1.85B',
    avgGas: '$4.20',
    txns24h: '1.24M',
    activeUsers: '345K',
    status: 'ONLINE',
    speed: '12 TPS',
    icon: '✨'
  },
  {
    id: 'solana',
    name: 'Solana Network',
    tvl: '$4.12B',
    volume24h: '$1.42B',
    avgGas: '$0.00025',
    txns24h: '38.4M',
    activeUsers: '1.12M',
    status: 'ONLINE',
    speed: '2,450 TPS',
    icon: '☀️'
  },
  {
    id: 'aptos',
    name: 'Aptos Mainnet',
    tvl: '$840M',
    volume24h: '$124M',
    avgGas: '$0.0031',
    txns24h: '2.84M',
    activeUsers: '185K',
    status: 'ONLINE',
    speed: '320 TPS',
    icon: '🌀'
  },
  {
    id: 'sui',
    name: 'Sui Network',
    tvl: '$920M',
    volume24h: '$165M',
    avgGas: '$0.0018',
    txns24h: '3.45M',
    activeUsers: '210K',
    status: 'ONLINE',
    speed: '410 TPS',
    icon: '💧'
  }
];

export const MOCK_LIVE_TX: LiveTx[] = [
  {
    id: 'tx-1',
    hash: '0xab24...1f4e',
    chain: 'Aptos',
    from: '0x7f4a...6b91',
    to: 'Aptos DEX Router',
    value: '450.00 APT → 77.50 SOL',
    token: 'SOL',
    type: 'Swap',
    gas: '0.004 APT',
    timestamp: 'Just now',
    status: 'SUCCESS'
  },
  {
    id: 'tx-2',
    hash: '0x94fd...bc8d',
    chain: 'Sui',
    from: '0x39fa...ed80',
    to: 'Sui Multi-router',
    value: '1,200 SUI → 2,120 USDC',
    token: 'USDC',
    type: 'Swap',
    gas: '0.0012 SUI',
    timestamp: '2m ago',
    status: 'SUCCESS'
  },
  {
    id: 'tx-3',
    hash: '0x43fb...aa2e',
    chain: 'Ethereum',
    from: '0xd8da...6045',
    to: 'Lidofinance',
    value: '2.50 ETH',
    token: 'ETH',
    type: 'Stake',
    gas: '0.012 ETH',
    timestamp: '5m ago',
    status: 'SUCCESS'
  },
  {
    id: 'tx-4',
    hash: '0xbc9d...f088',
    chain: 'Solana',
    from: '6xPs...9Zqw',
    to: 'Raydium Liquidity',
    value: '15.00 SOL → 2,420 USDC',
    token: 'USDC',
    type: 'Swap',
    gas: '0.00005 SOL',
    timestamp: '8m ago',
    status: 'SUCCESS'
  },
  {
    id: 'tx-5',
    hash: '0x12ed...19de',
    chain: 'Aptos',
    from: '0x992d...faed',
    to: 'Aries Markets',
    value: '800.00 USDC',
    token: 'USDC',
    type: 'Transfer',
    gas: '0.003 APT',
    timestamp: '15m ago',
    status: 'SUCCESS'
  }
];

export const TRENDING_TOKENS: TrendingToken[] = [
  {
    id: '1',
    symbol: 'APT',
    name: 'Aptos Native',
    price: 14.77,
    change24h: 8.42,
    volume24h: '$245.8M',
    holders: '241K',
    chain: 'Aptos'
  },
  {
    id: '2',
    symbol: 'SUI',
    name: 'Sui Native Token',
    price: 1.86,
    change24h: 12.15,
    volume24h: '$312.4M',
    holders: '315K',
    chain: 'Sui'
  },
  {
    id: '3',
    symbol: 'SOL',
    name: 'Solana VM Token',
    price: 162.45,
    change24h: -2.31,
    volume24h: '$2.85B',
    holders: '4.8M',
    chain: 'Solana'
  },
  {
    id: '4',
    symbol: 'JUP',
    name: 'Jupiter Aggregator',
    price: 1.12,
    change24h: 18.52,
    volume24h: '$184.2M',
    holders: '820K',
    chain: 'Solana'
  },
  {
    id: '5',
    symbol: 'PYTH',
    name: 'Pyth Oracle Network',
    price: 0.44,
    change24h: 4.12,
    volume24h: '$83.5M',
    holders: '112K',
    chain: 'Solana'
  }
];

export const NFT_COLLECTIONS: NFTCollection[] = [
  {
    id: '1',
    name: 'Mad Lads',
    floorPrice: '124 SOL',
    volume24h: '1,450 SOL',
    change24h: 4.25,
    items: 10000,
    chain: 'Solana',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: 'Aptos Monkeys',
    floorPrice: '28 APT',
    volume24h: '3,840 APT',
    change24h: -1.82,
    items: 7777,
    chain: 'Aptos',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    name: 'SuiFrens',
    floorPrice: '85 SUI',
    volume24h: '14,200 SUI',
    change24h: 15.42,
    items: 8888,
    chain: 'Sui',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '4',
    name: 'Tensorians',
    floorPrice: '18 SOL',
    volume24h: '850 SOL',
    change24h: -5.11,
    items: 10000,
    chain: 'Solana',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=200'
  }
];
export const MOCK_ALERTS = [
  { id: '1', title: 'High Price Impact on SUI Liquidity Pool', message: 'SUI pools experiencing 8.5% transient slippage due to high trade volumes.', severity: 'WARNING', time: '10m ago' },
  { id: '2', title: 'Solana Network Peak Congestion Cleared', message: 'Solana average transaction queuing latency returned to normal (1.8s).', severity: 'INFO', time: '25m ago' },
  { id: '3', title: 'Critical Bridge Liquidations Alert', message: 'Large liquidated positions registered on EVM collateral pools ($1.4M ETH).', severity: 'CRITICAL', time: '40m ago' }
];

export const MOCK_INSIGHTS = [
  { text: "Your Aptos allocation holds a 58.4% share, making you highly leveraged on MOVE VMs. Diversifying 15% towards USDC is recommended.", score: 92 },
  { text: "Arbitrum & SUI gas fees have fallen to an all-time low. Staking unallocated Sui Core here returns 6.22% APY instantly.", score: 87 },
  { text: "Ethereum validators report a 2.4% yield spike on Lido, while Solana's Jito staking returns are steady at 7.85% APY.", score: 79 }
];
