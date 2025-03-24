
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Airdrop, AirdropRanking, initialAirdrops, initialRankings, airdropCategories } from "@/data/airdrops";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  status: "upcoming" | "live" | "coming_soon";
  timeLeft?: string;
  buttonText: string;
  buttonAction: string;
  link?: string;
}

interface AirdropsContextType {
  airdrops: Airdrop[];
  rankings: AirdropRanking[];
  categories: string[];
  events: Event[];
  completedAirdrops: Airdrop[];
  toggleCompleted: (id: string) => void;
  togglePinned: (id: string) => void;
  addAirdrop: (airdrop: Airdrop) => void;
  updateAirdrop: (airdrop: Airdrop) => void;
  deleteAirdrop: (id: string) => void;
  addRanking: (ranking: AirdropRanking) => void;
  updateRanking: (ranking: AirdropRanking) => void;
  deleteRanking: (id: string) => void;
  addCategory: (category: string) => void;
  clearAllAirdrops: () => void;
  clearPreAddedRankings: () => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  isLoading: boolean;
}

const AirdropsContext = createContext<AirdropsContextType | undefined>(undefined);

export const AirdropsProvider = ({ children }: { children: ReactNode }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [rankings, setRankings] = useState<AirdropRanking[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [completedAirdrops, setCompletedAirdrops] = useState<Airdrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Reset data when not authenticated
      setAirdrops([]);
      setRankings([]);
      setEvents([]);
      setCompletedAirdrops([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);
  
  // Initial categories setup
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCategories();
    } else {
      setCategories(airdropCategories);
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    setIsLoading(true);
    
    try {
      // Load airdrops
      const { data: airdropsData, error: airdropsError } = await supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (airdropsError) {
        console.error("Error loading airdrops:", airdropsError);
        toast({
          title: "Error",
          description: "Failed to load airdrops data",
          variant: "destructive",
        });
      } else {
        const formattedAirdrops = airdropsData.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          category: item.category,
          difficulty: item.difficulty || "Easy",
          rewardPotential: item.reward_potential || "Low",
          timeRequired: item.time_required || "1-2 hours",
          url: item.url || "",
          logoUrl: item.logo_url || "",
          isCompleted: item.is_completed,
          isPinned: item.is_pinned
        }));
        
        setAirdrops(formattedAirdrops);
        
        // Set completed airdrops
        setCompletedAirdrops(formattedAirdrops.filter(airdrop => airdrop.isCompleted));
      }
      
      // Load rankings
      const { data: rankingsData, error: rankingsError } = await supabase
        .from('airdrop_rankings')
        .select('*')
        .order('position', { ascending: true });
        
      if (rankingsError) {
        console.error("Error loading rankings:", rankingsError);
      } else {
        const formattedRankings = rankingsData.map(item => ({
          id: item.id,
          airdropId: item.airdrop_id || null,
          name: item.name,
          position: item.position,
          logoUrl: item.logo_url || "",
          category: item.category || ""
        }));
        
        setRankings(formattedRankings);
      }
      
      // Load events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (eventsError) {
        console.error("Error loading events:", eventsError);
      } else {
        const formattedEvents = eventsData.map(item => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || "",
          status: item.status as "upcoming" | "live" | "coming_soon",
          timeLeft: item.time_left,
          buttonText: item.button_text,
          buttonAction: item.button_action,
          link: item.link
        }));
        
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error in data loading:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('airdrop_categories')
        .select('name');
        
      if (error) {
        console.error("Error loading categories:", error);
        
        // If error, initialize with default categories
        if (!categories.includes("My Ethereum 2.0 Airdrop")) {
          const updatedCategories = [...airdropCategories, "My Ethereum 2.0 Airdrop"];
          setCategories(updatedCategories);
          
          // Save default categories to the database
          for (const category of updatedCategories) {
            await supabase.from('airdrop_categories').insert({
              user_id: user?.id,
              name: category
            });
          }
        }
      } else if (data && data.length > 0) {
        setCategories(data.map(item => item.name));
      } else {
        // No categories found, initialize with defaults
        const updatedCategories = [...airdropCategories];
        if (!updatedCategories.includes("My Ethereum 2.0 Airdrop")) {
          updatedCategories.push("My Ethereum 2.0 Airdrop");
        }
        setCategories(updatedCategories);
        
        // Save default categories to the database
        for (const category of updatedCategories) {
          await supabase.from('airdrop_categories').insert({
            user_id: user?.id,
            name: category
          });
        }
      }
    } catch (error) {
      console.error("Error in categories loading:", error);
    }
  };

  const toggleCompleted = async (id: string) => {
    try {
      const airdrop = airdrops.find(a => a.id === id);
      if (!airdrop) return;
      
      const newCompletedState = !airdrop.isCompleted;
      
      // Update in database
      const { error } = await supabase
        .from('airdrops')
        .update({ is_completed: newCompletedState })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating airdrop completion:", error);
        return;
      }
      
      // Update local state
      setAirdrops(airdrops.map(airdrop => 
        airdrop.id === id ? { ...airdrop, isCompleted: newCompletedState } : airdrop
      ));
      
      // Update completed airdrops list
      if (newCompletedState) {
        setCompletedAirdrops([...completedAirdrops, { ...airdrop, isCompleted: true }]);
      } else {
        setCompletedAirdrops(completedAirdrops.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error("Error in toggle completed:", error);
    }
  };

  const togglePinned = async (id: string) => {
    try {
      const airdrop = airdrops.find(a => a.id === id);
      if (!airdrop) return;
      
      const newPinnedState = !airdrop.isPinned;
      
      // Update in database
      const { error } = await supabase
        .from('airdrops')
        .update({ is_pinned: newPinnedState })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating airdrop pinned state:", error);
        return;
      }
      
      // Update local state
      setAirdrops(airdrops.map(airdrop => 
        airdrop.id === id ? { ...airdrop, isPinned: newPinnedState } : airdrop
      ));
      
      // Update in completed airdrops if present
      setCompletedAirdrops(completedAirdrops.map(airdrop => 
        airdrop.id === id ? { ...airdrop, isPinned: newPinnedState } : airdrop
      ));
    } catch (error) {
      console.error("Error in toggle pinned:", error);
    }
  };

  const addAirdrop = async (airdrop: Airdrop) => {
    try {
      if (!user) return;
      
      // Insert into database
      const { data, error } = await supabase
        .from('airdrops')
        .insert({
          user_id: user.id,
          name: airdrop.name,
          description: airdrop.description,
          category: airdrop.category,
          difficulty: airdrop.difficulty,
          reward_potential: airdrop.rewardPotential,
          time_required: airdrop.timeRequired,
          url: airdrop.url,
          logo_url: airdrop.logoUrl,
          is_completed: airdrop.isCompleted,
          is_pinned: airdrop.isPinned
        })
        .select();
        
      if (error) {
        console.error("Error adding airdrop:", error);
        toast({
          title: "Error",
          description: "Failed to add airdrop",
          variant: "destructive",
        });
        return;
      }
      
      if (data && data[0]) {
        // Add to local state with the new ID from the database
        const newAirdrop = {
          ...airdrop,
          id: data[0].id
        };
        
        setAirdrops([newAirdrop, ...airdrops]);
        
        // Add to completed airdrops if it's completed
        if (newAirdrop.isCompleted) {
          setCompletedAirdrops([...completedAirdrops, newAirdrop]);
        }
        
        toast({
          title: "Success",
          description: "Airdrop added successfully",
        });
      }
    } catch (error) {
      console.error("Error in add airdrop:", error);
    }
  };

  const updateAirdrop = async (updatedAirdrop: Airdrop) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('airdrops')
        .update({
          name: updatedAirdrop.name,
          description: updatedAirdrop.description,
          category: updatedAirdrop.category,
          difficulty: updatedAirdrop.difficulty,
          reward_potential: updatedAirdrop.rewardPotential,
          time_required: updatedAirdrop.timeRequired,
          url: updatedAirdrop.url,
          logo_url: updatedAirdrop.logoUrl,
          is_completed: updatedAirdrop.isCompleted,
          is_pinned: updatedAirdrop.isPinned
        })
        .eq('id', updatedAirdrop.id);
        
      if (error) {
        console.error("Error updating airdrop:", error);
        toast({
          title: "Error",
          description: "Failed to update airdrop",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setAirdrops(airdrops.map(airdrop => 
        airdrop.id === updatedAirdrop.id ? updatedAirdrop : airdrop
      ));
      
      // Update completed airdrops
      if (updatedAirdrop.isCompleted) {
        const exists = completedAirdrops.some(a => a.id === updatedAirdrop.id);
        if (exists) {
          setCompletedAirdrops(completedAirdrops.map(airdrop => 
            airdrop.id === updatedAirdrop.id ? updatedAirdrop : airdrop
          ));
        } else {
          setCompletedAirdrops([...completedAirdrops, updatedAirdrop]);
        }
      } else {
        setCompletedAirdrops(completedAirdrops.filter(airdrop => airdrop.id !== updatedAirdrop.id));
      }
      
      toast({
        title: "Success",
        description: "Airdrop updated successfully",
      });
    } catch (error) {
      console.error("Error in update airdrop:", error);
    }
  };

  const deleteAirdrop = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('airdrops')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting airdrop:", error);
        toast({
          title: "Error",
          description: "Failed to delete airdrop",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setAirdrops(airdrops.filter(airdrop => airdrop.id !== id));
      setCompletedAirdrops(completedAirdrops.filter(airdrop => airdrop.id !== id));
      
      // Remove any rankings associated with this airdrop
      await supabase
        .from('airdrop_rankings')
        .delete()
        .eq('airdrop_id', id);
        
      setRankings(rankings.filter(ranking => ranking.airdropId !== id));
      
      toast({
        title: "Success",
        description: "Airdrop deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete airdrop:", error);
    }
  };

  const addRanking = async (ranking: AirdropRanking) => {
    try {
      if (!user) return;
      
      // Insert into database
      const { data, error } = await supabase
        .from('airdrop_rankings')
        .insert({
          user_id: user.id,
          airdrop_id: ranking.airdropId,
          name: ranking.name,
          position: ranking.position,
          logo_url: ranking.logoUrl,
          category: ranking.category
        })
        .select();
        
      if (error) {
        console.error("Error adding ranking:", error);
        toast({
          title: "Error",
          description: "Failed to add ranking",
          variant: "destructive",
        });
        return;
      }
      
      if (data && data[0]) {
        // Add to local state with the new ID from the database
        const newRanking = {
          ...ranking,
          id: data[0].id
        };
        
        setRankings([...rankings, newRanking]);
        
        toast({
          title: "Success",
          description: "Ranking added successfully",
        });
      }
    } catch (error) {
      console.error("Error in add ranking:", error);
    }
  };

  const updateRanking = async (updatedRanking: AirdropRanking) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('airdrop_rankings')
        .update({
          airdrop_id: updatedRanking.airdropId,
          name: updatedRanking.name,
          position: updatedRanking.position,
          logo_url: updatedRanking.logoUrl,
          category: updatedRanking.category
        })
        .eq('id', updatedRanking.id);
        
      if (error) {
        console.error("Error updating ranking:", error);
        toast({
          title: "Error",
          description: "Failed to update ranking",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setRankings(rankings.map(ranking => 
        ranking.id === updatedRanking.id ? updatedRanking : ranking
      ));
      
      toast({
        title: "Success",
        description: "Ranking updated successfully",
      });
    } catch (error) {
      console.error("Error in update ranking:", error);
    }
  };

  const deleteRanking = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('airdrop_rankings')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting ranking:", error);
        toast({
          title: "Error",
          description: "Failed to delete ranking",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setRankings(rankings.filter(ranking => ranking.id !== id));
      
      toast({
        title: "Success",
        description: "Ranking deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete ranking:", error);
    }
  };

  const addCategory = async (category: string) => {
    try {
      if (!user) return;
      
      if (!categories.includes(category)) {
        // Insert into database
        const { error } = await supabase
          .from('airdrop_categories')
          .insert({
            user_id: user.id,
            name: category
          });
          
        if (error) {
          console.error("Error adding category:", error);
          return;
        }
        
        // Update local state
        setCategories([...categories, category]);
      }
    } catch (error) {
      console.error("Error in add category:", error);
    }
  };

  const clearAllAirdrops = async () => {
    try {
      if (!user) return;
      
      // Delete all airdrops from database for this user
      const { error } = await supabase
        .from('airdrops')
        .delete()
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error clearing airdrops:", error);
        toast({
          title: "Error",
          description: "Failed to clear airdrops",
          variant: "destructive",
        });
        return;
      }
      
      // Clear local state
      setAirdrops([]);
      setCompletedAirdrops([]);
      
      toast({
        title: "Success",
        description: "All airdrops cleared successfully",
      });
    } catch (error) {
      console.error("Error in clear all airdrops:", error);
    }
  };

  const clearPreAddedRankings = async () => {
    try {
      if (!user) return;
      
      // Delete all rankings from database for this user
      const { error } = await supabase
        .from('airdrop_rankings')
        .delete()
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error clearing rankings:", error);
        toast({
          title: "Error",
          description: "Failed to clear rankings",
          variant: "destructive",
        });
        return;
      }
      
      // Clear local state
      setRankings([]);
      
      toast({
        title: "Success",
        description: "All rankings cleared successfully",
      });
    } catch (error) {
      console.error("Error in clear rankings:", error);
    }
  };

  const addEvent = async (event: Event) => {
    try {
      if (!user) return;
      
      // Insert into database
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title: event.title,
          subtitle: event.subtitle,
          status: event.status,
          time_left: event.timeLeft,
          button_text: event.buttonText,
          button_action: event.buttonAction,
          link: event.link
        })
        .select();
        
      if (error) {
        console.error("Error adding event:", error);
        toast({
          title: "Error",
          description: "Failed to add event",
          variant: "destructive",
        });
        return;
      }
      
      if (data && data[0]) {
        // Add to local state with the new ID from the database
        const newEvent = {
          ...event,
          id: data[0].id
        };
        
        setEvents([...events, newEvent]);
        
        toast({
          title: "Success",
          description: "Event added successfully",
        });
      }
    } catch (error) {
      console.error("Error in add event:", error);
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('events')
        .update({
          title: updatedEvent.title,
          subtitle: updatedEvent.subtitle,
          status: updatedEvent.status,
          time_left: updatedEvent.timeLeft,
          button_text: updatedEvent.buttonText,
          button_action: updatedEvent.buttonAction,
          link: updatedEvent.link
        })
        .eq('id', updatedEvent.id);
        
      if (error) {
        console.error("Error updating event:", error);
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setEvents(events.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error("Error in update event:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setEvents(events.filter(event => event.id !== id));
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete event:", error);
    }
  };

  return (
    <AirdropsContext.Provider 
      value={{ 
        airdrops, 
        rankings,
        categories,
        events,
        completedAirdrops,
        toggleCompleted,
        togglePinned, 
        addAirdrop,
        updateAirdrop,
        deleteAirdrop,
        addRanking,
        updateRanking,
        deleteRanking,
        addCategory,
        clearAllAirdrops,
        clearPreAddedRankings,
        addEvent,
        updateEvent,
        deleteEvent,
        isLoading
      }}
    >
      {children}
    </AirdropsContext.Provider>
  );
};

export const useAirdrops = () => {
  const context = useContext(AirdropsContext);
  if (context === undefined) {
    throw new Error("useAirdrops must be used within an AirdropsProvider");
  }
  return context;
};
