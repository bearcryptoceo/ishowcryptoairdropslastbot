import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockAirdrops, mockAirdropRankings } from '@/data/airdrops';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Update Airdrop interface to match database schema
export interface Airdrop {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty?: string;
  rewardPotential?: string;
  timeRequired?: string;
  url?: string;
  logoUrl?: string;
  isCompleted: boolean;
  isPinned: boolean;
  userId?: string;
  // Compatibility with UI components
  link?: string; // alias for url
  logo?: string; // alias for logoUrl
  estimatedValue?: string; // alias for rewardPotential
  tasks?: string[];
  launchDate?: string;
}

// Update AirdropRanking interface to match database schema
export interface AirdropRanking {
  id: string;
  name: string;
  position: number;
  category?: string;
  logoUrl?: string;
  airdropId?: string;
  userId?: string;
  // Compatibility with UI components
  fundingRating?: number;
  popularityRating?: number;
  potentialValue?: string;
  notes?: string;
  rank?: number; // alias for position
  isPinned?: boolean;
  telegramLink?: string;
}

interface AirdropsContextType {
  airdrops: Airdrop[];
  rankings: AirdropRanking[];
  addAirdrop: (airdrop: Omit<Airdrop, 'id'>) => Promise<void>;
  updateAirdrop: (id: string, airdrop: Partial<Airdrop>) => Promise<void>;
  deleteAirdrop: (id: string) => Promise<void>;
  togglePinAirdrop: (id: string) => Promise<void>;
  toggleCompleteAirdrop: (id: string) => Promise<void>;
  addAirdropRanking: (ranking: Omit<AirdropRanking, 'id'>) => Promise<void>;
  updateAirdropRanking: (id: string, ranking: Partial<AirdropRanking>) => Promise<void>;
  deleteAirdropRanking: (id: string) => Promise<void>;
  togglePinAirdropRanking: (id: string) => Promise<void>;
}

const AirdropsContext = createContext<AirdropsContextType | undefined>(undefined);

export const AirdropsProvider = ({ children }: { children: ReactNode }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [rankings, setRankings] = useState<AirdropRanking[]>([]);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAirdrops();
      fetchRankings();
    } else {
      // Use mock data when not authenticated
      setAirdrops(mockAirdrops.map(airdrop => ({
        ...airdrop,
        url: airdrop.link,
        logoUrl: airdrop.logo,
        rewardPotential: airdrop.estimatedValue,
        isPinned: false,
        isCompleted: false
      })));
      
      setRankings(mockAirdropRankings.map(ranking => ({
        ...ranking,
        position: ranking.rank || 0,
        isPinned: false
      })));
    }
  }, [isAuthenticated, user]);

  const fetchAirdrops = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching airdrops:', error);
        return;
      }

      if (data) {
        // Map database fields to component fields
        const formattedAirdrops = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          difficulty: item.difficulty,
          rewardPotential: item.reward_potential,
          timeRequired: item.time_required,
          url: item.url,
          logoUrl: item.logo_url,
          isCompleted: item.is_completed,
          isPinned: item.is_pinned,
          // Add compatibility fields
          link: item.url,
          logo: item.logo_url,
          estimatedValue: item.reward_potential,
          tasks: [],
          launchDate: ''
        }));
        
        setAirdrops(formattedAirdrops);
      }
    } catch (error) {
      console.error('Error fetching airdrops:', error);
    }
  };

  const fetchRankings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('airdrop_rankings')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching airdrop rankings:', error);
        return;
      }

      if (data) {
        // Map database fields to component fields
        const formattedRankings = data.map(item => ({
          id: item.id,
          name: item.name,
          position: item.position,
          category: item.category,
          logoUrl: item.logo_url,
          airdropId: item.airdrop_id,
          // Add compatibility fields
          rank: item.position,
          isPinned: false,
          fundingRating: 0,
          popularityRating: 0,
          potentialValue: '',
          notes: '',
          telegramLink: ''
        }));
        
        setRankings(formattedRankings);
      }
    } catch (error) {
      console.error('Error fetching airdrop rankings:', error);
    }
  };

  const addAirdrop = async (airdrop: Omit<Airdrop, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .insert({
          ...airdrop,
          user_id: user.id,
          reward_potential: airdrop.rewardPotential,
          time_required: airdrop.timeRequired,
          logo_url: airdrop.logoUrl,
          is_completed: false,
          is_pinned: false
        });

      if (error) {
        console.error('Error adding airdrop:', error);
        toast({
          title: "Error",
          description: "Failed to add airdrop",
          variant: "destructive",
        });
        return;
      }

      fetchAirdrops();
      toast({
        title: "Success",
        description: "Airdrop added successfully",
      });
    } catch (error) {
      console.error('Error adding airdrop:', error);
      toast({
        title: "Error",
        description: "Failed to add airdrop",
        variant: "destructive",
      });
    }
  };

  const updateAirdrop = async (id: string, airdrop: Partial<Airdrop>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .update({
          ...airdrop,
          reward_potential: airdrop.rewardPotential,
          time_required: airdrop.timeRequired,
          logo_url: airdrop.logoUrl,
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating airdrop:', error);
        toast({
          title: "Error",
          description: "Failed to update airdrop",
          variant: "destructive",
        });
        return;
      }

      fetchAirdrops();
      toast({
        title: "Success",
        description: "Airdrop updated successfully",
      });
    } catch (error) {
      console.error('Error updating airdrop:', error);
      toast({
        title: "Error",
        description: "Failed to update airdrop",
        variant: "destructive",
      });
    }
  };

  const deleteAirdrop = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting airdrop:', error);
        toast({
          title: "Error",
          description: "Failed to delete airdrop",
          variant: "destructive",
        });
        return;
      }

      fetchAirdrops();
      toast({
        title: "Success",
        description: "Airdrop deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting airdrop:', error);
      toast({
        title: "Error",
        description: "Failed to delete airdrop",
        variant: "destructive",
      });
    }
  };

  const togglePinAirdrop = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .update({ is_pinned: supabase.raw('NOT is_pinned') })
        .eq('id', id);

      if (error) {
        console.error('Error toggling pin airdrop:', error);
        toast({
          title: "Error",
          description: "Failed to toggle pin airdrop",
          variant: "destructive",
        });
        return;
      }

      fetchAirdrops();
    } catch (error) {
      console.error('Error toggling pin airdrop:', error);
      toast({
        title: "Error",
        description: "Failed to toggle pin airdrop",
        variant: "destructive",
      });
    }
  };

  const toggleCompleteAirdrop = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .update({ is_completed: supabase.raw('NOT is_completed') })
        .eq('id', id);

      if (error) {
        console.error('Error toggling complete airdrop:', error);
        toast({
          title: "Error",
          description: "Failed to toggle complete airdrop",
          variant: "destructive",
        });
        return;
      }

      fetchAirdrops();
    } catch (error) {
      console.error('Error toggling complete airdrop:', error);
      toast({
        title: "Error",
        description: "Failed to toggle complete airdrop",
        variant: "destructive",
      });
    }
  };

  const addAirdropRanking = async (ranking: Omit<AirdropRanking, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrop_rankings')
        .insert({
          ...ranking,
          user_id: user.id,
          logo_url: ranking.logoUrl,
          airdrop_id: ranking.airdropId,
        });

      if (error) {
        console.error('Error adding airdrop ranking:', error);
        toast({
          title: "Error",
          description: "Failed to add airdrop ranking",
          variant: "destructive",
        });
        return;
      }

      fetchRankings();
      toast({
        title: "Success",
        description: "Airdrop ranking added successfully",
      });
    } catch (error) {
      console.error('Error adding airdrop ranking:', error);
      toast({
        title: "Error",
        description: "Failed to add airdrop ranking",
        variant: "destructive",
      });
    }
  };

  const updateAirdropRanking = async (id: string, ranking: Partial<AirdropRanking>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrop_rankings')
        .update({
          ...ranking,
          logo_url: ranking.logoUrl,
          airdrop_id: ranking.airdropId,
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating airdrop ranking:', error);
        toast({
          title: "Error",
          description: "Failed to update airdrop ranking",
          variant: "destructive",
        });
        return;
      }

      fetchRankings();
      toast({
        title: "Success",
        description: "Airdrop ranking updated successfully",
      });
    } catch (error) {
      console.error('Error updating airdrop ranking:', error);
      toast({
        title: "Error",
        description: "Failed to update airdrop ranking",
        variant: "destructive",
      });
    }
  };

  const deleteAirdropRanking = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrop_rankings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting airdrop ranking:', error);
        toast({
          title: "Error",
          description: "Failed to delete airdrop ranking",
          variant: "destructive",
        });
        return;
      }

      fetchRankings();
      toast({
        title: "Success",
        description: "Airdrop ranking deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting airdrop ranking:', error);
      toast({
        title: "Error",
        description: "Failed to delete airdrop ranking",
        variant: "destructive",
      });
    }
  };

  const togglePinAirdropRanking = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrop_rankings')
        .update({ is_pinned: supabase.raw('NOT is_pinned') })
        .eq('id', id);

      if (error) {
        console.error('Error toggling pin airdrop ranking:', error);
        toast({
          title: "Error",
          description: "Failed to toggle pin airdrop ranking",
          variant: "destructive",
        });
        return;
      }

      fetchRankings();
    } catch (error) {
      console.error('Error toggling pin airdrop ranking:', error);
      toast({
        title: "Error",
        description: "Failed to toggle pin airdrop ranking",
        variant: "destructive",
      });
    }
  };

  // Context value
  const value = {
    airdrops,
    rankings,
    addAirdrop,
    updateAirdrop,
    deleteAirdrop,
    togglePinAirdrop,
    toggleCompleteAirdrop,
    addAirdropRanking,
    updateAirdropRanking,
    deleteAirdropRanking,
    togglePinAirdropRanking,
  };

  return <AirdropsContext.Provider value={value}>{children}</AirdropsContext.Provider>;
};

export const useAirdrops = () => {
  const context = useContext(AirdropsContext);
  if (context === undefined) {
    throw new Error('useAirdrops must be used within an AirdropsProvider');
  }
  return context;
};
