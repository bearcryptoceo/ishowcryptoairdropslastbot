// Shared types for components to avoid conflicts between context and data types
export interface ComponentAirdrop {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty?: string;
  link?: string;
  logo?: string;
  estimatedValue?: string;
  tasks?: string[];
  launchDate?: string;
  isPinned: boolean;
  isCompleted: boolean;
  
  // Database fields
  url?: string;
  logoUrl?: string;
  rewardPotential?: string;
  timeRequired?: string;
  userId?: string;
}

export interface ComponentTool {
  id: string;
  name: string;
  description?: string;
  category: string;
  link?: string;
  icon?: string;
  isPinned: boolean;
  isCompleted: boolean;
  comingSoon?: boolean;
  
  // Database fields
  difficulty?: string;
  url?: string;
  logoUrl?: string;
  userId?: string;
}

export interface ComponentTestnet {
  id: string;
  name: string;
  description?: string;
  category: string;
  link?: string;
  logo?: string;
  estimatedReward?: string;
  difficulty?: string;
  tasks?: string[];
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  isPinned: boolean;
  isCompleted: boolean;
  userId?: string;
}

export interface ComponentAirdropRanking {
  id: string;
  name: string;
  position: number;
  category?: string;
  logoUrl?: string;
  airdropId?: string;
  userId?: string;
  
  // Legacy compatibility fields
  fundingRating?: number;
  popularityRating?: number;
  potentialValue?: string;
  notes?: string;
  rank?: number;
  isPinned?: boolean;
  telegramLink?: string;
}