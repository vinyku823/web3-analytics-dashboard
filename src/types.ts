export interface LiveTx {
  id: string;
  hash: string;
  chain: string;
  from: string;
  to: string;
  value: string;
  token: string;
  type: 'Swap' | 'Transfer' | 'Mint' | 'Stake' | 'Liquidity';
  gas: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Ecosystem {
  id: string;
  name: string;
  tvl: string;
  volume24h: string;
  avgGas: string;
  txns24h: string;
  activeUsers: string;
  status: 'ONLINE' | 'CONGESTED' | 'MAINTENANCE';
  speed: string;
  icon: string;
}

export interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  holders: string;
  chain: string;
}

export interface NFTCollection {
  id: string;
  name: string;
  floorPrice: string;
  volume24h: string;
  change24h: number;
  items: number;
  chain: string;
  image: string;
}

export interface Holdings {
  APT: number;
  SUI: number;
  ETH: number;
  SOL: number;
  USDC: number;
}

export interface TokenPrices {
  APT: number;
  SUI: number;
  ETH: number;
  SOL: number;
  USDC: number;
}
