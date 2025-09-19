import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialAirdrops, mockAirdropRankings } from '@/data/airdrops';
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
  name?: string;
  position?: number;
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
  categories: string[];
  addAirdrop: (airdrop: Omit<Airdrop, 'id'>) => Promise<void>;
  updateAirdrop: (airdrop: Airdrop) => Promise<void>;
  deleteAirdrop: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
  togglePinned: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  clearAllAirdrops: () => Promise<void>;
  // Rankings functions
  addRanking: (ranking: Omit<AirdropRanking, 'id'>) => Promise<void>;
  updateRanking: (id: string, ranking: Partial<AirdropRanking>) => Promise<void>;
  deleteRanking: (id: string) => Promise<void>;
  clearPreAddedRankings: () => Promise<void>;
  // Events functions
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  timeLeft?: string;
  buttonText?: string;
  buttonAction?: string;
  link?: string;
  userId?: string;
}

const AirdropsContext = createContext<AirdropsContextType | undefined>(undefined);

export const AirdropsProvider = ({ children }: { children: ReactNode }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [rankings, setRankings] = useState<AirdropRanking[]>([]);
  const [categories, setCategories] = useState<string[]>(['Layer 2', 'Infrastructure', 'DeFi', 'Layer 1']);
  const [events, setEvents] = useState<Event[]>([]);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAirdrops();
      fetchRankings();
    } else {
      // Use mock data when not authenticated
      setAirdrops(initialAirdrops.map(airdrop => ({
        ...airdrop,
        url: airdrop.link,
        logoUrl: airdrop.logo,
        rewardPotential: airdrop.estimatedValue,
        isPinned: false,
        isCompleted: false
      })));
      
      setRankings(mockAirdropRankings);
      setEvents([]);
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

  const updateAirdrop = async (airdrop: Airdrop) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .update({
          name: airdrop.name,
          description: airdrop.description,
          category: airdrop.category,
          difficulty: airdrop.difficulty,
          reward_potential: airdrop.rewardPotential || airdrop.estimatedValue,
          time_required: airdrop.timeRequired,
          url: airdrop.url || airdrop.link,
          logo_url: airdrop.logoUrl || airdrop.logo,
        })
        .eq('id', airdrop.id);

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

  const togglePinned = async (id: string) => {
    if (!user) return;

    try {
      const airdrop = airdrops.find(a => a.id === id);
      if (!airdrop) return;
      
      const { error } = await supabase
        .from('airdrops')
        .update({ is_pinned: !airdrop.isPinned })
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

  const toggleCompleted = async (id: string) => {
    if (!user) return;

    try {
      const airdrop = airdrops.find(a => a.id === id);
      if (!airdrop) return;
      
      const { error } = await supabase
        .from('airdrops')
        .update({ is_completed: !airdrop.isCompleted })
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

  const addRanking = async (ranking: Omit<AirdropRanking, 'id'>) => {
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

  const updateRanking = async (id: string, ranking: Partial<AirdropRanking>) => {
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

  const deleteRanking = async (id: string) => {
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

  const addCategory = async (category: string) => {
    if (!user) return;
    if (categories.includes(category)) return;
    
    try {
      const { error } = await supabase
        .from('airdrop_categories')
        .insert([{ name: category, user_id: user.id }]);

      if (error) {
        console.error('Error adding category:', error);
        return;
      }

      setCategories([...categories, category]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const clearAllAirdrops = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing airdrops:', error);
        return;
      }

      setAirdrops([]);
    } catch (error) {
      console.error('Error clearing airdrops:', error);
    }
  };

  const clearPreAddedRankings = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrop_rankings')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing rankings:', error);
        return;
      }

      setRankings([]);
    } catch (error) {
      console.error('Error clearing rankings:', error);
    }
  };

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...event, user_id: user.id }])
        .select();

      if (error) {
        console.error('Error adding event:', error);
        return;
      }

      if (data && data.length > 0) {
        setEvents([...events, data[0] as Event]);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (id: string, event: Partial<Event>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error updating event:', error);
        return;
      }

      if (data && data.length > 0) {
        setEvents(events.map(e => e.id === id ? data[0] as Event : e));
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting event:', error);
        return;
      }

      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Context value
  const value = {
    airdrops,
    rankings,
    categories,
    events,
    addAirdrop,
    updateAirdrop,
    deleteAirdrop,
    toggleCompleted,
    togglePinned,
    addCategory,
    clearAllAirdrops,
    addRanking,
    updateRanking,
    deleteRanking,
    clearPreAddedRankings,
    addEvent,
    updateEvent,
    deleteEvent,
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
