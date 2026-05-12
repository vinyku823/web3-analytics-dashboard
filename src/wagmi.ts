import { http, createConfig } from 'wagmi';
import { mainnet, polygon, base } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

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
    walletConnectProjectId: '00000000000000000000000000000000',

    // Required App Info
    appName: 'Web3 Analytics',

    // Optional App Info
    appDescription: 'AI-Powered Web3 Analytics',
  }),
);
