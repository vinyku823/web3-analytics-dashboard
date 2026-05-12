import { http, createConfig } from 'wagmi';
import { mainnet, polygon, base } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

// Note: Wagmi doesn't natively support Solana/Sui in the same config perfectly 
// without multi-provider logic, but for the dashboard purpose, we'll focus 
// on EVM first and provide placeholders for other ecosystem analytics.

export const config = createConfig(
  getDefaultConfig({
    // Your dApp's chains
    chains: [mainnet, polygon, base],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [base.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: 'DEFAULT_PROJECT_ID',

    // Required App Info
    appName: 'ChainPulse AI',

    // Optional App Info
    appDescription: 'AI-Powered Web3 Analytics',
    appUrl: 'https://chainpulse.ai',
    appIcon: 'https://chainpulse.ai/logo.png',
  }),
);
