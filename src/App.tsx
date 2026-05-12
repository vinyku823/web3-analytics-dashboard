/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config } from './wagmi';
import { Dashboard } from './components/Dashboard';
import React, { Component, ReactNode } from 'react';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
           <Dashboard />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

