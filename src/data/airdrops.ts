export interface Airdrop {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
  logo: string;
  estimatedValue: string;
  tasks: string[];
  launchDate: string;
  isPinned: boolean;
  isCompleted: boolean;
  
  rewardPotential?: string;
  timeRequired?: string;
  url?: string;
  logoUrl?: string;
}

export interface AirdropRanking {
  id: string;
  airdropId: string;
  fundingRating: number;
  popularityRating: number;
  potentialValue: string;
  notes: string;
  
  name?: string;
  position?: number;
  logoUrl?: string;
  category?: string;
}

export interface Testnet {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
  logo: string;
  estimatedReward: string;
  tasks: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPinned: boolean;
  isCompleted: boolean;
  
  rewardPotential?: string;
  timeRequired?: string;
  url?: string;
  logoUrl?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  icon: string;
  isPinned: boolean;
  isCompleted: boolean;
  
  difficulty?: string;
  url?: string;
  logoUrl?: string;
}

export const initialAirdrops: Airdrop[] = [
  {
    id: "airdrop-1",
    name: "Arbitrum",
    description: "Layer 2 scaling solution for Ethereum",
    category: "Layer 2",
    link: "https://arbitrum.io",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    estimatedValue: "$500-1000",
    difficulty: "Medium",
    tasks: ["Bridge assets to Arbitrum", "Swap tokens on Arbitrum", "Provide liquidity"],
    launchDate: "2023-03-23",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://arbitrum.io",
    logoUrl: "https://cryptologos.cc/logos/arbitrum-arb-logo.png"
  },
  {
    id: "airdrop-2",
    name: "Optimism",
    description: "Layer 2 scaling solution for Ethereum",
    category: "Layer 2",
    link: "https://optimism.io",
    logo: "https://cryptologos.cc/logos/optimism-op-logo.png",
    estimatedValue: "$300-800",
    difficulty: "Easy",
    tasks: ["Bridge assets to Optimism", "Swap tokens on Optimism", "Use dApps on Optimism"],
    launchDate: "2022-05-31",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "Medium",
    timeRequired: "1-2 weeks",
    url: "https://optimism.io",
    logoUrl: "https://cryptologos.cc/logos/optimism-op-logo.png"
  },
  {
    id: "airdrop-3",
    name: "LayerZero",
    description: "Omnichain interoperability protocol",
    category: "Infrastructure",
    link: "https://layerzero.network",
    logo: "https://pbs.twimg.com/profile_images/1464243285037633536/SrqQ0wTP_400x400.jpg",
    estimatedValue: "$700-1500",
    difficulty: "Medium",
    tasks: ["Bridge across multiple chains", "Use Stargate Finance", "Provide liquidity"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://layerzero.network",
    logoUrl: "https://pbs.twimg.com/profile_images/1464243285037633536/SrqQ0wTP_400x400.jpg"
  },
  {
    id: "airdrop-4",
    name: "Celestia",
    description: "Modular blockchain network",
    category: "Infrastructure",
    link: "https://celestia.org",
    logo: "https://cryptologos.cc/logos/celestia-tia-logo.png",
    estimatedValue: "$400-900",
    difficulty: "Medium",
    tasks: ["Run a light node", "Participate in testnet", "Stake TIA tokens"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://celestia.org",
    logoUrl: "https://cryptologos.cc/logos/celestia-tia-logo.png"
  },
  {
    id: "airdrop-5",
    name: "ZkSync",
    description: "ZK Rollup scaling solution",
    category: "Layer 2",
    link: "https://zksync.io",
    logo: "https://zksync.io/logo.svg",
    estimatedValue: "$400-1000",
    difficulty: "Medium",
    tasks: ["Bridge to zkSync", "Swap tokens", "Mint NFT on zkSync"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://zksync.io",
    logoUrl: "https://zksync.io/logo.svg"
  },
  {
    id: "airdrop-6",
    name: "Starknet",
    description: "ZK Rollup scaling solution",
    category: "Layer 2",
    link: "https://starknet.io",
    logo: "https://cryptologos.cc/logos/starknet-strk-logo.png",
    estimatedValue: "$500-1200",
    difficulty: "Hard",
    tasks: ["Bridge to Starknet", "Use dApps on Starknet", "Provide liquidity"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://starknet.io",
    logoUrl: "https://cryptologos.cc/logos/starknet-strk-logo.png"
  },
  {
    id: "airdrop-7",
    name: "Linea",
    description: "Consensys ZK Rollup",
    category: "Layer 2",
    link: "https://linea.build",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-600",
    difficulty: "Easy",
    tasks: ["Bridge to Linea", "Swap tokens", "Interact with dApps"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://linea.build",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-8",
    name: "Base",
    description: "Coinbase Layer 2 solution",
    category: "Layer 2",
    link: "https://base.org",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$300-700",
    difficulty: "Easy",
    tasks: ["Bridge to Base", "Interact with dApps", "Provide liquidity"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://base.org",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-9",
    name: "Scroll",
    description: "Ethereum Layer 2 solution",
    category: "Layer 2",
    link: "https://scroll.io",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-600",
    difficulty: "Medium",
    tasks: ["Bridge to Scroll", "Interact with protocols", "Participate in testnet"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://scroll.io",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-10",
    name: "Taiko",
    description: "Based rollup with Ethereum equivalence",
    category: "Layer 2",
    link: "https://taiko.xyz",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-800",
    difficulty: "Medium",
    tasks: ["Run a node", "Participate in testnet", "Bridge assets"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://taiko.xyz",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-11",
    name: "dYdX V4",
    description: "Decentralized perpetual exchange",
    category: "DeFi",
    link: "https://dydx.exchange",
    logo: "https://cryptologos.cc/logos/dydx-dydx-logo.png",
    estimatedValue: "$400-900",
    difficulty: "Medium",
    tasks: ["Trade on dYdX", "Stake DYDX tokens", "Participate in governance"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://dydx.exchange",
    logoUrl: "https://cryptologos.cc/logos/dydx-dydx-logo.png"
  },
  {
    id: "airdrop-12",
    name: "Sui",
    description: "Layer 1 blockchain with high throughput",
    category: "Layer 1",
    link: "https://sui.io",
    logo: "https://cryptologos.cc/logos/sui-sui-logo.png",
    estimatedValue: "$300-700",
    difficulty: "Medium",
    tasks: ["Participate in testnet", "Use Sui dApps", "Stake SUI tokens"],
    launchDate: "2023-05-03",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://sui.io",
    logoUrl: "https://cryptologos.cc/logos/sui-sui-logo.png"
  },
  {
    id: "airdrop-13",
    name: "Aptos",
    description: "Layer 1 blockchain using Move language",
    category: "Layer 1",
    link: "https://aptoslabs.com",
    logo: "https://cryptologos.cc/logos/aptos-apt-logo.png",
    estimatedValue: "$200-600",
    difficulty: "Medium",
    tasks: ["Participate in testnet", "Use Aptos dApps", "Provide liquidity"],
    launchDate: "2022-10-17",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://aptoslabs.com",
    logoUrl: "https://cryptologos.cc/logos/aptos-apt-logo.png"
  },
  {
    id: "airdrop-14",
    name: "Eigenlayer",
    description: "Ethereum restaking protocol",
    category: "Infrastructure",
    link: "https://eigenlayer.xyz",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$500-1200",
    difficulty: "Medium",
    tasks: ["Stake ETH", "Restake through Eigenlayer", "Participate in AVSs"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://eigenlayer.xyz",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-15",
    name: "Gensyn",
    description: "Decentralized machine learning protocol",
    category: "Infrastructure",
    link: "https://gensyn.ai",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-500",
    difficulty: "Hard",
    tasks: ["Run a node", "Contribute compute resources", "Participate in testnet"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://gensyn.ai",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-16",
    name: "Aura Finance",
    description: "Balancer yield optimizer",
    category: "DeFi",
    link: "https://aura.finance",
    logo: "https://cryptologos.cc/logos/aura-finance-aura-logo.png",
    estimatedValue: "$100-400",
    difficulty: "Easy",
    tasks: ["Deposit in Aura pools", "Stake AURA tokens", "Participate in governance"],
    launchDate: "2022-06-23",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://aura.finance",
    logoUrl: "https://cryptologos.cc/logos/aura-finance-aura-logo.png"
  },
  {
    id: "airdrop-17",
    name: "Mantle",
    description: "Layer 2 scaling solution",
    category: "Layer 2",
    link: "https://mantle.xyz",
    logo: "https://cryptologos.cc/logos/mantle-mnt-logo.png",
    estimatedValue: "$300-800",
    difficulty: "Medium",
    tasks: ["Bridge to Mantle", "Interact with dApps", "Provide liquidity"],
    launchDate: "2023-07-14",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://mantle.xyz",
    logoUrl: "https://cryptologos.cc/logos/mantle-mnt-logo.png"
  },
  {
    id: "airdrop-18",
    name: "Blast",
    description: "Yield-generating L2 network",
    category: "Layer 2",
    link: "https://blast.io",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$400-900",
    difficulty: "Medium",
    tasks: ["Bridge to Blast", "Deposit ETH/stablecoins", "Refer friends"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://blast.io",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-19",
    name: "Mode Network",
    description: "Optimistic rollup with sequencer fees",
    category: "Layer 2",
    link: "https://mode.network",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-600",
    difficulty: "Medium",
    tasks: ["Bridge to Mode", "Interact with dApps", "Provide liquidity"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://mode.network",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-20",
    name: "Portal",
    description: "Cross-chain atomic swap protocol",
    category: "Infrastructure",
    link: "https://www.portaldefi.com",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-700",
    difficulty: "Medium",
    tasks: ["Perform atomic swaps", "Bridge assets", "Participate in testnet"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://www.portaldefi.com",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-21",
    name: "Manta Network",
    description: "Privacy-focused L1/L2 solution",
    category: "Infrastructure",
    link: "https://manta.network",
    logo: "https://cryptologos.cc/logos/manta-network-manta-logo.png",
    estimatedValue: "$200-600",
    difficulty: "Medium",
    tasks: ["Use private transactions", "Provide liquidity", "Participate in testnet"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://manta.network",
    logoUrl: "https://cryptologos.cc/logos/manta-network-manta-logo.png"
  },
  {
    id: "airdrop-22",
    name: "Fuel Network",
    description: "Optimistic rollup with parallel execution",
    category: "Layer 2",
    link: "https://fuel.network",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$300-700",
    difficulty: "Hard",
    tasks: ["Bridge to Fuel", "Interact with dApps", "Run a node"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://fuel.network",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-23",
    name: "Lido",
    description: "Liquid staking protocol",
    category: "DeFi",
    link: "https://lido.fi",
    logo: "https://cryptologos.cc/logos/lido-dao-ldo-logo.png",
    estimatedValue: "$100-500",
    difficulty: "Easy",
    tasks: ["Stake ETH", "Participate in governance", "Provide liquidity for stETH"],
    launchDate: "2020-12-18",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://lido.fi",
    logoUrl: "https://cryptologos.cc/logos/lido-dao-ldo-logo.png"
  },
  {
    id: "airdrop-24",
    name: "Pendle",
    description: "Yield trading protocol",
    category: "DeFi",
    link: "https://pendle.finance",
    logo: "https://cryptologos.cc/logos/pendle-pendle-logo.png",
    estimatedValue: "$100-400",
    difficulty: "Medium",
    tasks: ["Trade yield tokens", "Provide liquidity", "Stake PENDLE"],
    launchDate: "2021-06-20",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://pendle.finance",
    logoUrl: "https://cryptologos.cc/logos/pendle-pendle-logo.png"
  },
  {
    id: "airdrop-25",
    name: "Symbiosis",
    description: "Cross-chain liquidity protocol",
    category: "DeFi",
    link: "https://symbiosis.finance",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$100-400",
    difficulty: "Easy",
    tasks: ["Swap tokens cross-chain", "Bridge assets", "Provide liquidity"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://symbiosis.finance",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-26",
    name: "Renzo Protocol",
    description: "Liquid restaking protocol",
    category: "DeFi",
    link: "https://renzo.xyz",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-600",
    difficulty: "Medium",
    tasks: ["Stake ETH", "Restake through Renzo", "Provide liquidity"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://renzo.xyz",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-27",
    name: "Pyth Network",
    description: "Oracle solution for real-time data",
    category: "Infrastructure",
    link: "https://pyth.network",
    logo: "https://cryptologos.cc/logos/pyth-network-pyth-logo.png",
    estimatedValue: "$100-400",
    difficulty: "Medium",
    tasks: ["Use Pyth oracles", "Participate in governance", "Integrate Pyth data"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://pyth.network",
    logoUrl: "https://cryptologos.cc/logos/pyth-network-pyth-logo.png"
  },
  {
    id: "airdrop-28",
    name: "Connext",
    description: "Cross-chain liquidity and messaging",
    category: "Infrastructure",
    link: "https://connext.network",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$100-500",
    difficulty: "Medium",
    tasks: ["Bridge assets", "Use cross-chain messaging", "Provide liquidity"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://connext.network",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-29",
    name: "Eclipse",
    description: "Solana-based rollup platform",
    category: "Infrastructure",
    link: "https://eclipse.builders",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$200-600",
    difficulty: "Hard",
    tasks: ["Deploy contracts", "Participate in testnet", "Bridge assets"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://eclipse.builders",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  },
  {
    id: "airdrop-30",
    name: "Zeta Markets",
    description: "Decentralized derivatives exchange",
    category: "DeFi",
    link: "https://zeta.markets",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$100-400",
    difficulty: "Medium",
    tasks: ["Trade options/futures", "Provide liquidity", "Stake ZETA tokens"],
    launchDate: "TBD",
    isPinned: false,
    isCompleted: false,
    rewardPotential: "High",
    timeRequired: "1-2 weeks",
    url: "https://zeta.markets",
    logoUrl: "https://cryptologos.cc/logos/placeholder.png"
  }
];

export const initialRankings: AirdropRanking[] = [
  {
    id: "ranking-1",
    airdropId: "airdrop-1",
    fundingRating: 5,
    popularityRating: 5,
    potentialValue: "Very High",
    notes: "Major Layer 2 with significant backing and adoption",
    telegramLink: "https://t.me/arbitrum",
    rank: 1,
    isPinned: true
  },
  {
    id: "ranking-2",
    airdropId: "airdrop-2",
    fundingRating: 5,
    popularityRating: 4,
    potentialValue: "High",
    notes: "Established Layer 2 with Coinbase backing",
    telegramLink: "https://t.me/optimismFND",
    rank: 2
  },
  {
    id: "ranking-3",
    airdropId: "airdrop-3",
    fundingRating: 4,
    popularityRating: 4,
    potentialValue: "High",
    notes: "Innovative cross-chain protocol with good partnerships",
    telegramLink: "https://t.me/layerzerolabs",
    rank: 3
  }
];

export const airdropCategories = [
  "Layer 1",
  "Layer 2",
  "Gaming",
  "DeFi",
  "NFT",
  "DAO",
  "Wallet",
  "Infrastructure",
  "Exchange",
  "Social",
  "Layer 1 & Testnet Mainnet",
  "My Ethereum 2.0 Airdrop",
  "Web3"
];

export const toolCategories = [
  "DeFi Tools",
  "NFT Tools",
  "Analytics",
  "Wallets",
  "Security",
  "Development"
];

export const initialTools: Tool[] = [
  {
    id: "tool-1",
    name: "Gas Fee Calculator",
    description: "Calculate gas fees across different blockchain networks",
    category: "Gas Fee Calculator",
    link: "https://ethgasstation.info/",
    icon: "Calculator",
    comingSoon: false
  },
  {
    id: "tool-2",
    name: "Wallet Tracker",
    description: "Track your portfolio across multiple wallets",
    category: "Wallet Connect",
    link: "https://debank.com/",
    icon: "Wallet",
    comingSoon: false
  },
  {
    id: "tool-3",
    name: "Price Charts",
    description: "Real-time price charts for all major cryptocurrencies",
    category: "Crypto Wallet Extensions",
    link: "https://www.coingecko.com/",
    icon: "LineChart",
    comingSoon: false
  },
  {
    id: "tool-4",
    name: "Token Explorer",
    description: "Explore and analyze tokens across different blockchains",
    category: "Airdrop Claim Checker",
    link: "https://etherscan.io/",
    icon: "Coins",
    comingSoon: false
  },
  {
    id: "tool-5",
    name: "APY Calculator",
    description: "Calculate potential yields from staking and farming",
    category: "Gas Fee Calculator",
    link: "https://www.aprtoapy.com/",
    icon: "BarChart3",
    comingSoon: false
  },
  {
    id: "tool-6",
    name: "Swap Aggregator",
    description: "Find the best rates across decentralized exchanges",
    category: "Swaps & Bridges",
    link: "https://1inch.io/",
    icon: "ArrowLeftRight",
    comingSoon: false
  }
];

export const initialTestnets: Testnet[] = [
  {
    id: "testnet-1",
    name: "LayerZero",
    description: "Cross-chain communication protocol testnet",
    category: "Layer 1 & Testnet Mainnet",
    link: "https://layerzero.network",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedReward: "$500-1000",
    difficulty: "Medium",
    tasks: ["Bridge assets", "Complete challenges", "Provide liquidity"],
    startDate: "2023-01-15",
    endDate: "2023-06-30",
    isActive: true
  },
  {
    id: "testnet-2",
    name: "Arbitrum Nova",
    description: "Optimistic rollup testnet for gaming and social applications",
    category: "Layer 2",
    link: "https://nova.arbitrum.io",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    estimatedReward: "$200-500",
    difficulty: "Easy",
    tasks: ["Deploy contracts", "Test transactions", "Complete quests"],
    startDate: "2023-02-10",
    endDate: "2023-07-15",
    isActive: true
  },
  {
    id: "testnet-3",
    name: "Scroll",
    description: "ZK rollup solution for Ethereum",
    category: "Layer 2",
    link: "https://scroll.io",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedReward: "$300-800",
    difficulty: "Medium",
    tasks: ["Bridge ETH", "Deploy contracts", "Test transactions"],
    startDate: "2023-03-05",
    endDate: "2023-08-01",
    isActive: true
  },
  {
    id: "testnet-4",
    name: "zkSync Era",
    description: "Layer 2 scaling solution using ZK rollups",
    category: "Layer 2",
    link: "https://zksync.io",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedReward: "$400-900",
    difficulty: "Hard",
    tasks: ["Deploy dApps", "Test cross-chain messaging", "Provide feedback"],
    startDate: "2023-01-20",
    endDate: "2023-09-15",
    isActive: true
  },
  {
    id: "testnet-5",
    name: "Linea",
    description: "Consensys ZK rollup solution",
    category: "Layer 2",
    link: "https://linea.build",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedReward: "$200-600",
    difficulty: "Easy",
    tasks: ["Bridge ETH", "Swap tokens", "Deploy smart contracts"],
    startDate: "2023-04-12",
    endDate: "2023-10-30",
    isActive: true
  },
  {
    id: "testnet-6",
    name: "Celestia",
    description: "Modular blockchain network",
    category: "Layer 1 & Testnet Mainnet",
    link: "https://celestia.org",
    logo: "https://cryptologos.cc/logos/celestia-tia-logo.png",
    estimatedReward: "$300-700",
    difficulty: "Medium",
    tasks: ["Run a light node", "Validate transactions", "Participate in governance"],
    startDate: "2023-03-28",
    endDate: "2023-11-15",
    isActive: true
  },
  {
    id: "testnet-7",
    name: "Taiko",
    description: "Ethereum-equivalent ZK-rollup",
    category: "Layer 2",
    link: "https://taiko.xyz",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedReward: "$200-600",
    difficulty: "Medium",
    tasks: ["Bridge assets", "Deploy contracts", "Test dApps"],
    startDate: "2023-05-10",
    endDate: "2023-12-20",
    isActive: true
  }
];
