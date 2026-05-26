import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Layers, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Cpu, 
  CornerDownRight, 
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Link as LinkIcon,
  Activity,
  Database,
  Coins,
  Image as ImageIcon,
  Zap,
  Play,
  Globe,
  Shield,
  ArrowRight,
  AlertCircle,
  Check,
  ChevronRight
} from 'lucide-react';
import { 
  ECOSYSTEMS, 
  TRENDING_TOKENS, 
  NFT_COLLECTIONS, 
  MOCK_LIVE_TX, 
  LiveTx 
} from '../data/mockData';

interface CustomWalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  symbol: string;
  network: string;
  chainName: string;
  iconColor: string;
}

export function WalletDashboard() {
  const { isConnected: isRealEvmConnected, address: realEvmAddress } = useAccount();
  const { data: realEvmBalance } = useBalance({ address: realEvmAddress });

  // Custom states for manual/simulated ports
  const [evmManual, setEvmManual] = useState<CustomWalletState>({
    isConnected: false,
    address: '',
    balance: '0.00',
    symbol: 'ETH',
    network: 'Ethereum Mainnet',
    chainName: 'Ethereum',
    iconColor: 'text-[#6366f1]',
  });

  const [phantom, setPhantom] = useState<CustomWalletState>({
    isConnected: false,
    address: '',
    balance: '0.00',
    symbol: 'SOL',
    network: 'Solana Mainnet',
    chainName: 'Solana',
    iconColor: 'text-[#14f195]',
  });

  const [petra, setPetra] = useState<CustomWalletState>({
    isConnected: false,
    address: '',
    balance: '0.00',
    symbol: 'APT',
    network: 'Aptos Mainnet',
    chainName: 'Aptos',
    iconColor: 'text-[#ff2d55]',
  });

  const [suiet, setSuiet] = useState<CustomWalletState>({
    isConnected: false,
    address: '',
    balance: '0.00',
    symbol: 'SUI',
    network: 'Sui Mainnet',
    chainName: 'Sui',
    iconColor: 'text-[#38bdf8]',
  });

  const [keplr, setKeplr] = useState<CustomWalletState>({
    isConnected: false,
    address: '',
    balance: '0.00',
    symbol: 'ATOM',
    network: 'Cosmos Hub',
    chainName: 'Cosmos',
    iconColor: 'text-[#ff79c6]',
  });

  const [copiedTxt, setCopiedTxt] = useState<string | null>(null);
  const [simulatingTx, setSimulatingTx] = useState(false);
  const [simulatedTxLog, setSimulatedTxLog] = useState<string[]>([
    'KERNEL: Shelby Telemetry initialized and waiting for secure wallet streams.'
  ]);

  // Synchronize state with central session wallet (Rabby, Phantom, Sui, Petra, or Keplr)
  useEffect(() => {
    const savedWallet = localStorage.getItem('shelby_session_wallet');
    const savedAddress = localStorage.getItem('shelby_session_address');
    if (savedWallet && savedAddress) {
      if (savedWallet === 'rabby') {
        setEvmManual({
          isConnected: true,
          address: savedAddress,
          balance: '5.40',
          symbol: 'ETH',
          network: 'Ethereum Mainnet',
          chainName: 'Ethereum',
          iconColor: 'text-[#6366f1]',
        });
        setFocusedTelemetryChain('Ethereum');
      } else if (savedWallet === 'phantom') {
        setPhantom({
          isConnected: true,
          address: savedAddress,
          balance: '124.50',
          symbol: 'SOL',
          network: 'Solana Mainnet',
          chainName: 'Solana',
          iconColor: 'text-[#14f195]',
        });
        setFocusedTelemetryChain('Solana');
      } else if (savedWallet === 'sui') {
        setSuiet({
          isConnected: true,
          address: savedAddress,
          balance: '4650.00',
          symbol: 'SUI',
          network: 'Sui Mainnet',
          chainName: 'Sui',
          iconColor: 'text-[#38bdf8]',
        });
        setFocusedTelemetryChain('Sui');
      } else if (savedWallet === 'petra') {
        setPetra({
          isConnected: true,
          address: savedAddress,
          balance: '840.45',
          symbol: 'APT',
          network: 'Aptos Mainnet',
          chainName: 'Aptos',
          iconColor: 'text-[#ff2d55]',
        });
        setFocusedTelemetryChain('Aptos');
      } else if (savedWallet === 'keplr') {
        setKeplr({
          isConnected: true,
          address: savedAddress,
          balance: '560.00',
          symbol: 'ATOM',
          network: 'Cosmos Hub',
          chainName: 'Cosmos',
          iconColor: 'text-[#ff79c6]',
        });
        setFocusedTelemetryChain('Cosmos');
      }
    }
  }, []);

  // Telemetry focusing, default to Ethereum
  const [focusedTelemetryChain, setFocusedTelemetryChain] = useState<string>('Ethereum');

  // Connection modal states
  const [isConnModalOpen, setIsConnModalOpen] = useState(false);
  const [activeModalChain, setActiveModalChain] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'extension' | 'input' | 'burner'>('extension');
  const [customAddress, setCustomAddress] = useState('');
  const [customBalance, setCustomBalance] = useState('');
  const [extensionLoading, setExtensionLoading] = useState(false);

  // Contract execution playground states
  const [playableAction, setPlayableAction] = useState<string>('');
  const [actionAmount, setActionAmount] = useState<string>('1.0');
  const [customContractAddr, setCustomContractAddr] = useState<string>('');

  // Local state transactions pool to append simulated events
  const [txPool, setTxPool] = useState<LiveTx[]>(MOCK_LIVE_TX);

  // Helper to query aggregated state for any portfolio
  const getWalletState = (chainName: string): CustomWalletState => {
    if (chainName === 'Ethereum' || chainName === 'Polygon') {
      if (isRealEvmConnected && realEvmAddress) {
        return {
          isConnected: true,
          address: `${realEvmAddress.slice(0, 6)}...${realEvmAddress.slice(-4)}`,
          balance: realEvmBalance ? parseFloat(realEvmBalance.formatted).toFixed(4) : '0.00',
          symbol: realEvmBalance?.symbol || 'ETH',
          network: 'Ethereum Core',
          chainName: 'Ethereum',
          iconColor: 'text-[#6366f1]',
        };
      }
      return evmManual;
    }
    if (chainName === 'Solana') return phantom;
    if (chainName === 'Aptos') return petra;
    if (chainName === 'Sui') return suiet;
    if (chainName === 'Cosmos') return keplr;
    return { isConnected: false, address: '', balance: '0.00', symbol: '', network: '', chainName: '', iconColor: '' };
  };

  // Derive active lists
  const activeConnectedChains = ['Ethereum', 'Solana', 'Aptos', 'Sui', 'Cosmos'].filter(chain => {
    return getWalletState(chain).isConnected;
  });

  // Track focused telemetry chain context updates
  useEffect(() => {
    if (activeConnectedChains.length > 0 && !activeConnectedChains.includes(focusedTelemetryChain)) {
      setFocusedTelemetryChain(activeConnectedChains[0]);
    }
  }, [isRealEvmConnected, evmManual.isConnected, phantom.isConnected, petra.isConnected, suiet.isConnected, keplr.isConnected]);

  // Set default action based on focused telemetry chain
  useEffect(() => {
    if (focusedTelemetryChain === 'Ethereum') {
      setPlayableAction('Deposit to Lido Staking');
      setCustomContractAddr('0xae7ab96520de3a18e5e111b5eaab095312d7fe84');
    } else if (focusedTelemetryChain === 'Solana') {
      setPlayableAction('Delegate SOL to Jito');
      setCustomContractAddr('JitoSpandcoN7aYfqeTfL...mB3');
    } else if (focusedTelemetryChain === 'Aptos') {
      setPlayableAction('Lend APT on Aries Markets');
      setCustomContractAddr('0x33e8ca0...fa8a92');
    } else if (focusedTelemetryChain === 'Sui') {
      setPlayableAction('Stake in Cetus LP Pool');
      setCustomContractAddr('0xca7d66...fd2884a');
    } else if (focusedTelemetryChain === 'Cosmos') {
      setPlayableAction('Delegate to Cosmos Validator');
      setCustomContractAddr('cosmosvaloper1...s87ad');
    }
  }, [focusedTelemetryChain]);

  // Copy paste feedback helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxt(id);
    setTimeout(() => setCopiedTxt(null), 2000);
  };

  // Calculate USD values for each connected chain safely
  const evmFormatted = isRealEvmConnected && realEvmAddress 
    ? (realEvmBalance ? parseFloat(realEvmBalance.formatted) : 0) 
    : parseFloat(evmManual.balance);
  const evmValueUsd = evmFormatted * 3485.20;

  const solFormatted = parseFloat(phantom.balance);
  const solValueUsd = phantom.isConnected ? solFormatted * 162.45 : 0;

  const aptFormatted = parseFloat(petra.balance);
  const aptValueUsd = petra.isConnected ? aptFormatted * 9.48 : 0;

  const suiFormatted = parseFloat(suiet.balance);
  const suiValueUsd = suiet.isConnected ? suiFormatted * 1.86 : 0;

  const atomFormatted = parseFloat(keplr.balance);
  const atomValueUsd = keplr.isConnected ? atomFormatted * 8.35 : 0;

  const totalPortfolioValue = 12480.00 + evmValueUsd + solValueUsd + aptValueUsd + suiValueUsd + atomValueUsd;

  // Connection trigger handling
  const handleOpenConnect = (chainName: string) => {
    const isConn = getWalletState(chainName).isConnected;
    if (isConn) {
      // Clean disconnect
      setSimulatedTxLog(prev => [`PORT_DISCONNECT: De-authorized ledger feed for ${chainName} terminal core.`, ...prev].slice(0, 15));
      if (chainName === 'Ethereum') {
        setEvmManual(prev => ({ ...prev, isConnected: false, address: '', balance: '0.00' }));
      } else if (chainName === 'Solana') {
        setPhantom(prev => ({ ...prev, isConnected: false, address: '', balance: '0.00' }));
      } else if (chainName === 'Aptos') {
        setPetra(prev => ({ ...prev, isConnected: false, address: '', balance: '0.00' }));
      } else if (chainName === 'Sui') {
        setSuiet(prev => ({ ...prev, isConnected: false, address: '', balance: '0.00' }));
      } else if (chainName === 'Cosmos') {
        setKeplr(prev => ({ ...prev, isConnected: false, address: '', balance: '0.00' }));
      }
    } else {
      setActiveModalChain(chainName);
      setCustomAddress('');
      setModalTab('extension');
      if (chainName === 'Ethereum') setCustomBalance('5.40');
      else if (chainName === 'Solana') setCustomBalance('124.50');
      else if (chainName === 'Aptos') setCustomBalance('840.45');
      else if (chainName === 'Sui') setCustomBalance('4650.00');
      else if (chainName === 'Cosmos') setCustomBalance('560.00');
      setIsConnModalOpen(true);
    }
  };

  const handleFinalizeConnect = () => {
    if (!activeModalChain) return;

    let targetAddress = '';
    let targetBalance = customBalance || '0.00';

    if (modalTab === 'extension') {
      // Simulate real handshake addresses
      if (activeModalChain === 'Ethereum') targetAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      else if (activeModalChain === 'Solana') targetAddress = 'G8xfgXKe6A9mPqR7ZtYfKePw9mPrTfB7zVp2Lky';
      else if (activeModalChain === 'Aptos') targetAddress = '0x3fe71b9c8fd34bb2297df332f11a2f90267a9f1a2';
      else if (activeModalChain === 'Sui') targetAddress = '0xca7d66be8e08d2884aef567d26b42b38e0ee9ab43';
      else if (activeModalChain === 'Cosmos') targetAddress = 'cosmos1g2a09h7dfke8df7y27adfs9q8k2vls0as7ad';
    } else if (modalTab === 'burner') {
      // EPHEMERAL sandbox keypair
      const hexChars = '0123456789abcdef';
      targetBalance = activeModalChain === 'Sui' ? '100.00' : activeModalChain === 'Solana' ? '10.00' : '25.00';
      if (activeModalChain === 'Cosmos') {
        targetAddress = 'cosmos1' + Array.from({ length: 32 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
      } else if (activeModalChain === 'Solana') {
        targetAddress = '9x' + Array.from({ length: 35 }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('');
      } else {
        targetAddress = '0x' + Array.from({ length: 40 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
      }
    } else {
      // Custom manual inputs
      targetAddress = customAddress.trim();
      if (!targetAddress) {
        // Fallback placeholder to prevent error
        targetAddress = activeModalChain === 'Cosmos' ? 'cosmos1vlsfk...asd8' : '0xfa89...71fc';
      }
    }

    const payload: CustomWalletState = {
      isConnected: true,
      address: targetAddress,
      balance: parseFloat(targetBalance).toFixed(2),
      symbol: activeModalChain === 'Ethereum' ? 'ETH' : activeModalChain === 'Solana' ? 'SOL' : activeModalChain === 'Aptos' ? 'APT' : activeModalChain === 'Sui' ? 'SUI' : 'ATOM',
      network: activeModalChain === 'Cosmos' ? 'Cosmos Hub' : `${activeModalChain} Mainnet`,
      chainName: activeModalChain,
      iconColor: activeModalChain === 'Ethereum' ? 'text-[#6366f1]' : activeModalChain === 'Solana' ? 'text-[#14f195]' : activeModalChain === 'Aptos' ? 'text-[#ff2d55]' : activeModalChain === 'Sui' ? 'text-[#38bdf8]' : 'text-[#ff79c6]'
    };

    setSimulatedTxLog(prev => [
      `PORT_CONNECTED: ${activeModalChain.toUpperCase()} ledger channel synced. Address: ${targetAddress.slice(0, 10)}...${targetAddress.slice(-6)}`,
      ...prev
    ].slice(0, 15));

    if (activeModalChain === 'Ethereum') setEvmManual(payload);
    else if (activeModalChain === 'Solana') setPhantom(payload);
    else if (activeModalChain === 'Aptos') setPetra(payload);
    else if (activeModalChain === 'Sui') setSuiet(payload);
    else if (activeModalChain === 'Cosmos') setKeplr(payload);

    setIsConnModalOpen(false);
  };

  // Simulated extension count-down animation
  const initiateExtensionHandshake = () => {
    setExtensionLoading(true);
    setSimulatedTxLog(prev => [`PORT_HANDSHAKE: Launching browser extension polling loop for ${activeModalChain}...`, ...prev]);
    setTimeout(() => {
      setExtensionLoading(false);
      handleFinalizeConnect();
    }, 1200);
  };

  // Smart action generator inside telemetry playground
  const triggerSmartContractAction = () => {
    if (!actionAmount || isNaN(parseFloat(actionAmount))) return;
    
    setSimulatingTx(true);
    setSimulatedTxLog(prev => [
      `VM_TRANSMIT: Packaging binary payload for ${focusedTelemetryChain} validators...`,
      `INTEGRITY_SHIELD: Verified contract signature at storage: ${customContractAddr}`,
      ...prev
    ]);

    setTimeout(() => {
      const activeWallet = getWalletState(focusedTelemetryChain);
      const symbol = activeWallet.symbol;
      const decAmount = parseFloat(actionAmount);
      
      const randomId = Math.floor(Math.random() * 89999 + 10000);
      const randomHexChars = 'abcdef0123456789';
      const txHash = focusedTelemetryChain === 'Cosmos' 
        ? 'cosmoshash_' + Array.from({length: 24}, () => randomHexChars[Math.floor(Math.random()*16)]).join('')
        : '0x' + Array.from({length: 24}, () => randomHexChars[Math.floor(Math.random()*16)]).join('');
        
      const gasToken = focusedTelemetryChain === 'Ethereum' ? '0.0012 ETH' : focusedTelemetryChain === 'Solana' ? '0.00005 SOL' : focusedTelemetryChain === 'Aptos' ? '0.0015 APT' : focusedTelemetryChain === 'Sui' ? '0.002 SUI' : '0.005 ATOM';

      const simulatedRecord: LiveTx = {
        id: `tx-user-${Date.now()}`,
        hash: `${txHash.slice(0, 8)}...${txHash.slice(-4)}`,
        chain: focusedTelemetryChain,
        from: activeWallet.address ? (activeWallet.address.includes('...') ? activeWallet.address : `${activeWallet.address.slice(0,6)}...${activeWallet.address.slice(-4)}`) : '0x3f...92da',
        to: `${customContractAddr.slice(0, 6)}...${customContractAddr.slice(-4)}`,
        value: `${decAmount.toFixed(2)} ${symbol}`,
        token: symbol,
        type: (playableAction.includes('Stake') || playableAction.includes('Delegate')) ? 'Stake' : playableAction.includes('Live Sweep') ? 'Mint' : 'Swap',
        gas: gasToken,
        timestamp: 'Just now',
        status: 'SUCCESS'
      };

      // Append to local transaction stream
      setTxPool(prev => [simulatedRecord, ...prev]);

      // Deduct balance locally matching the active state
      const rawBalNum = parseFloat(activeWallet.balance);
      const feeDeduction = focusedTelemetryChain === 'Ethereum' ? 0.0012 : focusedTelemetryChain === 'Solana' ? 0.00005 : focusedTelemetryChain === 'Aptos' ? 0.0015 : focusedTelemetryChain === 'Sui' ? 0.0021 : 0.005;
      const finalBalResult = Math.max(0, rawBalNum - decAmount - feeDeduction).toFixed(2);

      if (focusedTelemetryChain === 'Ethereum') {
        setEvmManual(prev => ({ ...prev, balance: finalBalResult }));
      } else if (focusedTelemetryChain === 'Solana') {
        setPhantom(prev => ({ ...prev, balance: finalBalResult }));
      } else if (focusedTelemetryChain === 'Aptos') {
        setPetra(prev => ({ ...prev, balance: finalBalResult }));
      } else if (focusedTelemetryChain === 'Sui') {
        setSuiet(prev => ({ ...prev, balance: finalBalResult }));
      } else if (focusedTelemetryChain === 'Cosmos') {
        setKeplr(prev => ({ ...prev, balance: finalBalResult }));
      }

      setSimulatedTxLog(prev => [
        `TRANSACTION_CONFIRMED: Committed in ledger blocks safely. Tx Hash: ${txHash}`,
        `STATE_EMISSION: Event standard emitted - Contract completed successfully with gas fee deduction of ${gasToken}`,
        ...prev
      ].slice(0, 15));

      setSimulatingTx(false);
    }, 1200);
  };

  const currentFocusedEcosystem = ECOSYSTEMS.find(e => e.name.toLowerCase() === focusedTelemetryChain.toLowerCase()) || ECOSYSTEMS[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Portfolio Aggregates Header styled with solid background & gold neon lines */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-8 bg-zinc-950 border border-zinc-900 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        {/* Core highlight border lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 rounded-br-xl" />

        <div className="absolute top-3 right-5 font-mono text-[9px] text-amber-500/40 tracking-[0.2em] uppercase">
          [ Consolidated Shelby Intel Core ]
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              TOTAL DEPLOYED MULTICHAIN LIQUIDITY
            </span>
            <h3 className="text-4xl md:text-5xl font-black font-sans tracking-tight text-white">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-zinc-500 font-mono mt-1 leading-relaxed">
              Consolidating real EVM nodes + connected high-performance cyber terminal accounts.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="p-3.5 px-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${getWalletState('Ethereum').isConnected ? 'bg-[#6366f1] animate-pulse shadow-[0_0_8px_#6366f1]' : 'bg-red-500/30'}`} />
              <div>
                <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">EVM Stake</p>
                <p className="text-sm font-bold text-white">${evmValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="p-3.5 px-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${getWalletState('Solana').isConnected ? 'bg-[#14f195] animate-pulse shadow-[0_0_8px_#14f195]' : 'bg-red-500/30'}`} />
              <div>
                <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Solana</p>
                <p className="text-sm font-bold text-white">${solValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="p-3.5 px-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${getWalletState('Aptos').isConnected ? 'bg-[#ff2d55] animate-pulse shadow-[0_0_8px_#ff2d55]' : 'bg-red-500/30'}`} />
              <div>
                <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Aptos</p>
                <p className="text-sm font-bold text-white">${aptValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="p-3.5 px-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${getWalletState('Sui').isConnected ? 'bg-[#38bdf8] animate-pulse shadow-[0_0_8px_#38bdf8]' : 'bg-red-500/30'}`} />
              <div>
                <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Sui VM</p>
                <p className="text-sm font-bold text-white">${suiValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Connections */}
      <div>
        <div className="flex items-center justify-between mb-4.5">
          <h3 className="text-lg font-bold tracking-tight text-white border-l-2 border-amber-500 pl-3">
            SHELBY PORT CONNECTORS
          </h3>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:block">STATUS: SECURE MATRIX INTERFACE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* EVM (Wagmi Connect / Manual Connect) */}
          {(() => {
            const evmActive = getWalletState('Ethereum').isConnected;
            const evmState = getWalletState('Ethereum');
            return (
              <div className={`p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between border ${evmActive ? 'bg-[#6366f1]/5 border-[#6366f1]/35 shadow-[0_0_15px_rgba(99,102,241,0.06)]' : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'}`}>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${evmActive ? 'bg-green-400' : 'bg-zinc-600'}`} />
                  <span className="font-mono text-[7px] text-zinc-400 uppercase">{evmActive ? 'ACTIVE' : 'OFFLINE'}</span>
                </div>
                
                <div>
                  <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider mb-1">PORT 0 // EVM</p>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                    <Cpu className="w-3.5 h-3.5 text-[#6366f1]" /> RABBY WALLET / EVM
                  </h4>
                  
                  {evmActive ? (
                    <div className="space-y-2 mt-2">
                      <div className="p-2 py-1 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-300 font-bold">{evmState.address.slice(0, 6)}...{evmState.address.slice(-4)}</span>
                        <button onClick={() => copyToClipboard(realEvmAddress || evmManual.address, 'evm')} className="text-zinc-500 hover:text-white transition-colors">
                          {copiedTxt === 'evm' ? <span className="text-green-400 font-bold">✓</span> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider block">ACCOUNT STAKE</span>
                        <p className="text-sm font-black text-[#6366f1]">{evmState.balance} {evmState.symbol}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 leading-relaxed mb-1 pr-1 font-mono">Sync with rabby extension, custom account hex address or burner keys.</p>
                  )}
                </div>

                <button 
                  onClick={() => handleOpenConnect('Ethereum')}
                  className={`w-full py-2 mt-4 rounded-xl font-bold font-mono text-[9px] tracking-wider transition-all uppercase ${evmActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-indigo-300 border border-[#6366f1]/20'}`}
                >
                  {evmActive ? '[ DISCONNECT ]' : 'CONNECT EVM'}
                </button>
              </div>
            );
          })()}

          {/* Phantom (Solana) */}
          {(() => {
            const solActive = phantom.isConnected;
            return (
              <div className={`p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between border ${solActive ? 'bg-[#14f195]/5 border-[#14f195]/35 shadow-[0_0_15px_rgba(20,241,149,0.06)]' : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'}`}>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${solActive ? 'bg-green-400' : 'bg-zinc-600'}`} />
                  <span className="font-mono text-[7px] text-zinc-400 uppercase">{solActive ? 'ACTIVE' : 'OFFLINE'}</span>
                </div>

                <div>
                  <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider mb-1">PORT 1 // SVM</p>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#14f195] inline-block shadow-[0_0_6px_#14f195]" /> PHANTOM SOLANA
                  </h4>

                  {solActive ? (
                    <div className="space-y-2 mt-2">
                      <div className="p-2 py-1 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-300 font-bold">{phantom.address.slice(0, 6)}...{phantom.address.slice(-4)}</span>
                        <button onClick={() => copyToClipboard(phantom.address, 'phantom')} className="text-zinc-500 hover:text-white transition-colors">
                          {copiedTxt === 'phantom' ? <span className="text-green-400 font-bold">✓</span> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider block">ACCOUNT STAKE</span>
                        <p className="text-sm font-black text-[#14f195]">{phantom.balance} SOL</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 leading-relaxed mb-1 pr-1 font-mono">Links SVM wallets to sync floor positions, volume filters, transactions.</p>
                  )}
                </div>

                <button 
                  onClick={() => handleOpenConnect('Solana')}
                  className={`w-full py-2 mt-4 rounded-xl font-bold font-mono text-[9px] tracking-wider transition-all uppercase ${solActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-[#14f195]/10 hover:bg-[#14f195]/20 text-[#14f195] border border-[#14f195]/20'}`}
                >
                  {solActive ? '[ DISCONNECT ]' : 'CONNECT PHANTOM'}
                </button>
              </div>
            );
          })()}

          {/* Petra (Aptos) */}
          {(() => {
            const aptActive = petra.isConnected;
            return (
              <div className={`p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between border ${aptActive ? 'bg-[#ff2d55]/5 border-[#ff2d55]/35 shadow-[0_0_15px_rgba(255,45,85,0.06)]' : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'}`}>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${aptActive ? 'bg-green-400' : 'bg-zinc-600'}`} />
                  <span className="font-mono text-[7px] text-zinc-400 uppercase">{aptActive ? 'ACTIVE' : 'OFFLINE'}</span>
                </div>

                <div>
                  <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider mb-1">PORT 2 // APTOS</p>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#ff2d55] inline-block shadow-[0_0_6px_#ff2d55]" /> PETRA APTOS
                  </h4>

                  {aptActive ? (
                    <div className="space-y-2 mt-2">
                      <div className="p-2 py-1 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-300 font-bold">{petra.address.slice(0, 6)}...{petra.address.slice(-4)}</span>
                        <button onClick={() => copyToClipboard(petra.address, 'petra')} className="text-zinc-500 hover:text-white transition-colors">
                          {copiedTxt === 'petra' ? <span className="text-green-400 font-bold">✓</span> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider block">ACCOUNT STAKE</span>
                        <p className="text-sm font-black text-[#ff2d55]">{petra.balance} APT</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 leading-relaxed mb-1 pr-1 font-mono">Syncs Move-centric liquidity depth, on-chain coins and collections.</p>
                  )}
                </div>

                <button 
                  onClick={() => handleOpenConnect('Aptos')}
                  className={`w-full py-2 mt-4 rounded-xl font-bold font-mono text-[9px] tracking-wider transition-all uppercase ${aptActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-[#ff2d55]/10 hover:bg-[#ff2d55]/20 text-[#ff2d55] border border-[#ff2d55]/20'}`}
                >
                  {aptActive ? '[ DISCONNECT ]' : 'CONNECT PETRA'}
                </button>
              </div>
            );
          })()}

          {/* Suiet / Sui Wallet (Sui) */}
          {(() => {
            const suiActive = suiet.isConnected;
            return (
              <div className={`p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between border ${suiActive ? 'bg-[#38bdf8]/5 border-[#38bdf8]/35 shadow-[0_0_15px_rgba(56,189,248,0.06)]' : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'}`}>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${suiActive ? 'bg-green-400' : 'bg-zinc-600'}`} />
                  <span className="font-mono text-[7px] text-zinc-400 uppercase">{suiActive ? 'ACTIVE' : 'OFFLINE'}</span>
                </div>

                <div>
                  <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider mb-1">PORT 3 // SUI</p>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8] inline-block shadow-[0_0_6px_#38bdf8]" /> SUIET / SUI WALLET
                  </h4>

                  {suiActive ? (
                    <div className="space-y-2 mt-2">
                      <div className="p-2 py-1 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-300 font-bold">{suiet.address.slice(0, 6)}...{suiet.address.slice(-4)}</span>
                        <button onClick={() => copyToClipboard(suiet.address, 'suiet')} className="text-zinc-500 hover:text-white transition-colors">
                          {copiedTxt === 'suiet' ? <span className="text-green-400 font-bold">✓</span> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider block">ACCOUNT STAKE</span>
                        <p className="text-sm font-black text-[#38bdf8]">{suiet.balance} SUI</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 leading-relaxed mb-1 pr-1 font-mono">Links Object-centric state ledger, dynamic listings, active dexes.</p>
                  )}
                </div>

                <button 
                  onClick={() => handleOpenConnect('Sui')}
                  className={`w-full py-2 mt-4 rounded-xl font-bold font-mono text-[9px] tracking-wider transition-all uppercase ${suiActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/20'}`}
                >
                  {suiActive ? '[ DISCONNECT ]' : 'CONNECT SUI'}
                </button>
              </div>
            );
          })()}

          {/* Keplr (Cosmos Hub) */}
          {(() => {
            const atomActive = keplr.isConnected;
            return (
              <div className={`p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between border ${atomActive ? 'bg-[#ff79c6]/5 border-[#ff79c6]/35 shadow-[0_0_15px_rgba(255,121,198,0.06)]' : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'}`}>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${atomActive ? 'bg-green-400' : 'bg-zinc-600'}`} />
                  <span className="font-mono text-[7px] text-zinc-400 uppercase">{atomActive ? 'ACTIVE' : 'OFFLINE'}</span>
                </div>

                <div>
                  <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider mb-1">PORT 4 // COSMOS</p>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#ff79c6] inline-block shadow-[0_0_6px_#ff79c6]" /> KEPLR COSMOS
                  </h4>

                  {atomActive ? (
                    <div className="space-y-2 mt-2">
                      <div className="p-2 py-1 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-300 font-bold">{keplr.address.slice(0, 6)}...{keplr.address.slice(-4)}</span>
                        <button onClick={() => copyToClipboard(keplr.address, 'keplr')} className="text-zinc-500 hover:text-white transition-colors">
                          {copiedTxt === 'keplr' ? <span className="text-green-400 font-bold">✓</span> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[8px] font-mono uppercase tracking-wider block">ACCOUNT STAKE</span>
                        <p className="text-sm font-black text-[#ff79c6]">{keplr.balance} ATOM</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 leading-relaxed mb-1 pr-1 font-mono">Monitors IBC packets, validators consensus and native staker rewards.</p>
                  )}
                </div>

                <button 
                  onClick={() => handleOpenConnect('Cosmos')}
                  className={`w-full py-2 mt-4 rounded-xl font-bold font-mono text-[9px] tracking-wider transition-all uppercase ${atomActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-[#ff79c6]/10 hover:bg-[#ff79c6]/20 text-[#ff79c6] border border-[#ff79c6]/20'}`}
                >
                  {atomActive ? '[ DISCONNECT ]' : 'CONNECT COSMOS'}
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* CONNECTED CHAIN TELEMETRY CONTROL DECKS */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Decorative corner visualizers */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/20" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/20" />

        {activeConnectedChains.length === 0 ? (
          /* Locked / Offline Screen */
          <div className="py-16 text-center max-w-md mx-auto space-y-5">
            <div className="inline-flex items-center justify-center p-5 rounded-full bg-amber-500/5 text-amber-500 border border-amber-500/15 animate-pulse mb-2">
              <Shield className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Awaiting Handshake Protocols</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Shelby Analytics Hub requires at least one core portfolio port connections online. Press <span className="text-amber-400 font-mono">"CONNECT"</span> on any wallet connector card above to stream live telemetry logs.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => handleOpenConnect('Ethereum')}
                className="px-4 py-2 font-mono text-[10px] font-bold border border-indigo-500/30 text-indigo-300 bg-indigo-500/[0.04] hover:bg-indigo-500/[0.08] transition-all rounded-lg uppercase"
              >
                + Ethereum
              </button>
              <button 
                onClick={() => handleOpenConnect('Solana')}
                className="px-4 py-2 font-mono text-[10px] font-bold border border-emerald-500/30 text-emerald-300 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08] transition-all rounded-lg uppercase"
              >
                + Solana
              </button>
              <button 
                onClick={() => handleOpenConnect('Aptos')}
                className="px-4 py-2 font-mono text-[10px] font-bold border border-pink-500/30 text-pink-300 bg-pink-500/[0.04] hover:bg-pink-500/[0.08] transition-all rounded-lg uppercase"
              >
                + Aptos
              </button>
              <button 
                onClick={() => handleOpenConnect('Sui')}
                className="px-4 py-2 font-mono text-[10px] font-bold border border-sky-500/30 text-sky-300 bg-sky-500/[0.04] hover:bg-sky-500/[0.08] transition-all rounded-lg uppercase"
              >
                + Sui
              </button>
            </div>
          </div>
        ) : (
          /* Live Synced Dashboard */
          <div className="space-y-8">
            {/* Sync Header Bar with Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-amber-500 uppercase block mb-1">
                  [ ACTIVE CHAIN TELEMETRY CONTROL ]
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500 animate-pulse" />
                  Telemetry Hub
                </h3>
              </div>

              {/* Glowing Tabs list */}
              <div className="flex flex-wrap gap-2.5 p-1 bg-zinc-900/40 rounded-2xl border border-zinc-900 max-w-full overflow-x-auto">
                {activeConnectedChains.map(chainName => {
                  const state = getWalletState(chainName);
                  const isFocused = focusedTelemetryChain === chainName;
                  let neonTabColor = 'border-indigo-500 text-indigo-400 bg-indigo-500/5';
                  if (chainName === 'Solana') neonTabColor = 'border-[#14f195] text-[#14f195] bg-[#14f195]/5';
                  else if (chainName === 'Aptos') neonTabColor = 'border-[#ff2d55] text-[#ff2d55] bg-[#ff2d55]/5';
                  else if (chainName === 'Sui') neonTabColor = 'border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/5';
                  else if (chainName === 'Cosmos') neonTabColor = 'border-[#ff79c6] text-[#ff79c6] bg-[#ff79c6]/5';

                  return (
                    <button
                      key={chainName}
                      onClick={() => setFocusedTelemetryChain(chainName)}
                      className={`px-4.5 py-2.5 text-xs font-mono font-bold tracking-wider rounded-xl transition-all border flex items-center gap-2 uppercase ${isFocused ? `${neonTabColor} font-black shadow-[0_0_10px_rgba(245,158,11,0.05)]` : 'border-transparent text-zinc-500 hover:text-zinc-200'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-amber-400 animate-ping' : 'bg-green-400'}`} />
                      {chainName} Core
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Stats Bento Grids specific to active chain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Stat 1: Synced balance */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-900 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-zinc-700">
                  <Database className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Your Token Portfolio</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-black text-white">
                    {getWalletState(focusedTelemetryChain).balance}
                  </h4>
                  <span className="text-xs font-mono text-zinc-400">{getWalletState(focusedTelemetryChain).symbol}</span>
                </div>
                {/* Dynamically calculated USD value */}
                <p className="text-[10px] font-mono text-zinc-400 mt-1">
                  ~ ${(parseFloat(getWalletState(focusedTelemetryChain).balance.replace(/,/g, '')) * parseFloat(currentFocusedEcosystem.price.replace(/[^0-9.]/g, ''))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              </div>

              {/* Stat 2: TVL */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-900 relative overflow-hidden">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Total Value Locked</p>
                <div className="flex items-baseline gap-1.5 text-white">
                  <h4 className="text-2xl font-black">{currentFocusedEcosystem.metrics.tvl}</h4>
                  <span className="text-xs text-emerald-400 font-bold">{currentFocusedEcosystem.change24h.value}</span>
                </div>
                <div className="w-full bg-zinc-800/40 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-1000" 
                    style={{ width: focusedTelemetryChain === 'Ethereum' ? '85%' : focusedTelemetryChain === 'Solana' ? '65%' : focusedTelemetryChain === 'Sui' ? '45%' : focusedTelemetryChain === 'Aptos' ? '30%' : '35%' }}
                  />
                </div>
              </div>

              {/* Stat 3: TPS / Network speed */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-900 relative overflow-hidden">
                <div className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Live Speed Metrics</p>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-2xl font-black text-white">{currentFocusedEcosystem.metrics.speedTps}</h4>
                </div>
                <p className="text-[10px] font-mono text-emerald-400 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                  Active Consensus streams
                </p>
              </div>

              {/* Stat 4: Average Gas Tax */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-900 relative overflow-hidden">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Live Network Gas Fee</p>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-2xl font-black text-white">{currentFocusedEcosystem.metrics.avgGas}</h4>
                </div>
                <p className="text-[10px] font-mono text-zinc-400 mt-1">
                  Latency: ~{focusedTelemetryChain === 'Solana' ? '380ms' : focusedTelemetryChain === 'Sui' ? '420ms' : focusedTelemetryChain === 'Aptos' ? '500ms' : '1.8s'}
                </p>
              </div>
            </div>

            {/* Asset Allocation Matrix (Tokens & NFTs side by side) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Token Board */}
              <div className="p-5.5 rounded-2xl bg-zinc-900/20 border border-zinc-900">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Coins className="w-4.5 h-4.5 text-amber-500" />
                  Ecosystem Native Token Matrices
                </h4>
                <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
                  {TRENDING_TOKENS.filter(t => t.chain.toLowerCase() === focusedTelemetryChain.toLowerCase()).map((token) => (
                    <div key={token.id} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-900 flex items-center justify-between hover:bg-zinc-900 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-8.5 h-8.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono text-xs font-black text-amber-400">
                          {token.symbol[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">{token.name}</span>
                            <span className="text-[8px] font-mono font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase tracking-wider">{token.symbol}</span>
                          </div>
                          <span className="text-[9px] text-zinc-500 font-mono">Vol 24h: {token.volume24h}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-white block">{token.price}</span>
                        <div className={`flex items-center gap-1 justify-end text-[9px] font-sans font-bold ${token.change24h.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {token.change24h.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          <span>{token.change24h.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {TRENDING_TOKENS.filter(t => t.chain.toLowerCase() === focusedTelemetryChain.toLowerCase()).length === 0 && (
                    <div className="py-12 text-center text-zinc-500 font-mono text-xs uppercase">No additional custom tokens listed.</div>
                  )}
                </div>
              </div>

              {/* NFT sweep/collections board */}
              <div className="p-5.5 rounded-2xl bg-zinc-900/20 border border-zinc-900">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4.5 h-4.5 text-amber-500" />
                  Live NFT Collections Deck
                </h4>
                <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
                  {NFT_COLLECTIONS.filter(n => n.chain.toLowerCase() === focusedTelemetryChain.toLowerCase()).map((nft) => (
                    <div key={nft.id} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-900 flex items-center justify-between hover:bg-zinc-900 transition-all group">
                      <div className="flex items-center gap-3">
                        <img 
                          src={nft.image} 
                          alt={nft.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-white/5 bg-zinc-900" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors leading-none mb-1">{nft.name}</p>
                          <span className="text-[9px] text-zinc-500 font-mono mt-1 block">Active Listings: {nft.listings} // Rarity: {nft.rarityScore}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 font-mono block uppercase">FLOOR RATE</span>
                        <span className="font-mono text-xs font-black text-white">{nft.floorPrice}</span>
                        <span className="text-[9px] font-sans font-bold text-green-400 block">{nft.change24h}</span>
                      </div>
                    </div>
                  ))}
                  {NFT_COLLECTIONS.filter(n => n.chain.toLowerCase() === focusedTelemetryChain.toLowerCase()).length === 0 && (
                    <div className="py-12 text-center text-zinc-500 font-mono text-xs uppercase">No active collections found for this chain.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Smart Contract Execution Playpen (Dynamic Form & Simulator) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Form trigger panel */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      DeFi Sandbox Execution Form
                    </h4>
                    <span className="px-2.5 py-0.5 font-mono text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md tracking-widest uppercase">
                      DEVNET_SANDBOX
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mb-6 font-sans leading-relaxed">
                    Test atomic decentralized protocol calls. Triggering an instruction commits simulated on-chain logs, decreases native funds by target volume, and logs validation indices with hash callbacks.
                  </p>

                  <div className="space-y-4 mb-6">
                    {/* Action Select template */}
                    <div>
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Smart Action Protocol</label>
                      <select 
                        value={playableAction} 
                        onChange={(e) => {
                          setPlayableAction(e.target.value);
                          if (focusedTelemetryChain === 'Ethereum') {
                            setCustomContractAddr(e.target.value.includes('Lido') ? '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' : '0x7a250d5630b4cf539739df2c5dacb4c659f2488d');
                          } else if (focusedTelemetryChain === 'Solana') {
                            setCustomContractAddr(e.target.value.includes('Jito') ? 'JitoSpandcoN7aYfqeTfL...mB3' : 'JUP6LwpfS7...d6p3');
                          } else if (focusedTelemetryChain === 'Aptos') {
                            setCustomContractAddr(e.target.value.includes('Aries') ? '0x33e8ca0...fa8a92' : '0x1::coin::transfer_coins');
                          } else if (focusedTelemetryChain === 'Sui') {
                            setCustomContractAddr(e.target.value.includes('LP') ? '0xca7d66...fd2884a' : '0x2::token::transfer');
                          } else if (focusedTelemetryChain === 'Cosmos') {
                            setCustomContractAddr(e.target.value.includes('Osmo') ? 'ibc/27394E...D98FC' : 'cosmosvaloper1...s87ad');
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500/50 outline-none font-sans"
                      >
                        {focusedTelemetryChain === 'Ethereum' && (
                          <>
                            <option value="Deposit to Lido Staking">LIDO: Stake ETH for stETH (APR: 3.82%)</option>
                            <option value="Swap on Uniswap V3">UNISWAP: Swap ETH for USDC Router</option>
                          </>
                        )}
                        {focusedTelemetryChain === 'Solana' && (
                          <>
                            <option value="Delegate SOL to Jito">JITO: Liquid Stake SOL (APR: 8.24%)</option>
                            <option value="Aggregated swap on Jupiter">JUPITER: Swap SOL to JUP Router</option>
                          </>
                        )}
                        {focusedTelemetryChain === 'Aptos' && (
                          <>
                            <option value="Lend APT on Aries Markets">ARIES: Supply APT Liquidity (APR: 5.40%)</option>
                            <option value="Move Entry Transfer 0x1">MOVE HANDLER: Call 0x1::coin::transfer</option>
                          </>
                        )}
                        {focusedTelemetryChain === 'Sui' && (
                          <>
                            <option value="Stake in Cetus LP Pool">CETUS: Liquid Pool SUI-USDC (APR: 18.25%)</option>
                            <option value="Move Entry Mint 0x2">MOVE MINT: Create Sui Fren NFT Record</option>
                          </>
                        )}
                        {focusedTelemetryChain === 'Cosmos' && (
                          <>
                            <option value="Delegate to Cosmos Validator">KEPLR: Delegate ATOM to Cosmos Validator (APR: 14.50%)</option>
                            <option value="IBC Bridge to Osmosis">IBC PROTOCOL: Cosmos ATOM to Osmosis Transfer</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Amount input */}
                      <div className="sm:col-span-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Volume Amount</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={actionAmount} 
                            onChange={(e) => setActionAmount(e.target.value)}
                            placeholder="1.0"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500/50 outline-none font-mono"
                          />
                          <span className="absolute right-3 top-3 text-[10px] font-mono text-zinc-500 font-bold">
                            {getWalletState(focusedTelemetryChain).symbol}
                          </span>
                        </div>
                      </div>

                      {/* Contract parameter address */}
                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Destination Smart Hash</label>
                        <input 
                          type="text" 
                          value={customContractAddr} 
                          onChange={(e) => setCustomContractAddr(e.target.value)}
                          placeholder="Target Address Contract Index"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500/50 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={triggerSmartContractAction}
                  disabled={simulatingTx || parseFloat(getWalletState(focusedTelemetryChain).balance) < parseFloat(actionAmount || '0')}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-30 transition-all font-bold tracking-wider text-xs font-mono rounded-xl text-black relative uppercase py-3.5"
                >
                  {simulatingTx ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      BROADCASTING BINARY PAYLOAD...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-black" />
                      EXECUTE ON-CHAIN CONTRACT INSTRUCTION
                    </>
                  )}
                </button>
              </div>

              {/* Transaction Stream & Real-time Console Logs */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full bg-zinc-900/10 border border-zinc-900 rounded-2xl p-5.5 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Dynamic Sys Log & Live Nodes
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_#22c55e]" />
                  </div>
                  
                  <div className="space-y-2.5 font-mono text-[10px] leading-relaxed bg-black/60 p-4 rounded-xl border border-zinc-900 h-[170px] overflow-y-auto">
                    {simulatedTxLog.map((log, i) => (
                      <div key={i} className={`pb-1.5 border-b border-zinc-900/60 ${log.startsWith("TRANSACTION_CONFIRMED") ? 'text-green-400' : log.startsWith("PORT_CONNECTED") ? 'text-blue-400' : 'text-amber-500/80'}`}>
                        {`[${new Date().toLocaleTimeString()}] ${log}`}
                      </div>
                    ))}
                    <div className="text-zinc-600">STATE: Telemetry active. Awaiting wallet triggers...</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase block">LIVE TRANSACTION LEDGER (RECENT)</div>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {txPool.slice(0, 4).map((tx) => (
                      <div key={tx.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-900/80 flex items-center justify-between text-[11px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                          <span className="text-zinc-500">{tx.chain.slice(0, 3).toUpperCase()}:</span>
                          <span className="text-white font-bold">{tx.type}</span>
                          <span className="text-zinc-400">{tx.value}</span>
                        </div>
                        <span className="text-amber-400/90 text-[10px]">{tx.hash}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONNECT WALLET HANDSHAKE GATEWAY MODAL */}
      {isConnModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-8 rounded-[2.5rem] bg-zinc-950 border border-amber-500/35 shadow-2xl">
            {/* Corner highlights matches Shelby theme */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500 rounded-br-xl" />

            <h3 className="text-md sm:text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-amber-500 rounded-full inline-block animate-pulse" />
              SHELBY HANDSHAKE GATEWAY
            </h3>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Establish portal handshake to select database ingress
            </p>

            {/* Ingress Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-900 rounded-xl mb-6 border border-zinc-800">
              <button
                onClick={() => setModalTab('extension')}
                className={`py-2 text-[9px] font-mono font-bold tracking-wider rounded-lg transition-all ${modalTab === 'extension' ? 'bg-amber-500 text-black font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                EXTENSION
              </button>
              <button
                onClick={() => setModalTab('input')}
                className={`py-2 text-[9px] font-mono font-bold tracking-wider rounded-lg transition-all ${modalTab === 'input' ? 'bg-amber-500 text-black font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                MANUAL SYNC
              </button>
              <button
                onClick={() => setModalTab('burner')}
                className={`py-2 text-[9px] font-mono font-bold tracking-wider rounded-lg transition-all ${modalTab === 'burner' ? 'bg-amber-500 text-black font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                BURNER
              </button>
            </div>

            {/* Contents tabbed */}
            {modalTab === 'extension' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Synchronize instantly with your installed browser companion extension ({activeModalChain === 'Solana' ? 'Phantom' : activeModalChain === 'Aptos' ? 'Petra' : activeModalChain === 'Cosmos' ? 'Keplr' : 'Sui Wallet / Suiet'}) configured to the active core indices.
                </p>
                <button
                  onClick={initiateExtensionHandshake}
                  disabled={extensionLoading}
                  className="w-full py-3.5 bg-amber-500 hover:opacity-90 disabled:opacity-40 font-bold font-mono tracking-widest text-xs uppercase text-black rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {extensionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      POLLING EXTENSION NODE...
                    </>
                  ) : (
                    'INITIALIZE EXTENSION LINKAGE'
                  )}
                </button>
              </div>
            )}

            {modalTab === 'input' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Inject any public Web3 account keys directly. Establishes a read-only stream monitoring assets, floor logs, and validators.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Public Hex Address / Bech32</label>
                    <input
                      type="text"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder={activeModalChain === 'Cosmos' ? 'cosmos1g2a09h...s87ad' : activeModalChain === 'Solana' ? 'G8xfgXKe6A9mPqR7...8a8d' : '0x3fe71b9c8fd34bb2297df332...7a9f'}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 font-mono text-xs text-white placeholder-zinc-700 focus:border-amber-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Balance Allocation ({activeModalChain === 'Ethereum' ? 'ETH' : activeModalChain === 'Solana' ? 'SOL' : activeModalChain === 'Aptos' ? 'APT' : activeModalChain === 'Sui' ? 'SUI' : 'ATOM'})</label>
                    <input
                      type="text"
                      value={customBalance}
                      onChange={(e) => setCustomBalance(e.target.value)}
                      placeholder="120.00"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 font-mono text-xs text-white focus:border-amber-500/50 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleFinalizeConnect}
                  className="w-full py-3.5 bg-amber-500 hover:opacity-90 font-bold font-mono tracking-widest text-xs uppercase text-black rounded-lg transition-all"
                >
                  SECURE PORT INGRESS
                </button>
              </div>
            )}

            {modalTab === 'burner' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Generate a temporary read/write keypair inside the localized sandbox. Instantly allocated faucet assets for stress testing Move/Solidity contract calls.
                </p>
                <button
                  onClick={handleFinalizeConnect}
                  className="w-full py-3.5 bg-amber-500 hover:opacity-90 font-bold font-mono tracking-widest text-xs uppercase text-black rounded-lg transition-all"
                >
                  PROVISION EPHEMERAL sandbox NODE
                </button>
              </div>
            )}

            {/* Cancel Trigger */}
            <button
              onClick={() => setIsConnModalOpen(false)}
              className="w-full py-2.5 mt-4 text-[10px] font-mono tracking-widest text-zinc-500 hover:text-white uppercase transition-all rounded-lg"
            >
              [ ABORT PROTOCOL LINK ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
