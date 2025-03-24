
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Testnet, initialTestnets, airdropCategories } from "@/data/airdrops";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestnetsContextType {
  testnets: Testnet[];
  categories: string[];
  completedTestnets: Testnet[];
  toggleCompleted: (id: string) => void;
  togglePinned: (id: string) => void;
  addTestnet: (testnet: Testnet) => void;
  updateTestnet: (testnet: Testnet) => void;
  deleteTestnet: (id: string) => void;
  addCategory: (category: string) => void;
  clearAllTestnets: () => void;
  isLoading: boolean;
}

const TestnetsContext = createContext<TestnetsContextType | undefined>(undefined);

export const TestnetsProvider = ({ children }: { children: ReactNode }) => {
  const [testnets, setTestnets] = useState<Testnet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [completedTestnets, setCompletedTestnets] = useState<Testnet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Reset data when not authenticated
      setTestnets([]);
      setCompletedTestnets([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);
  
  // Initial categories setup
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCategories();
    } else {
      const defaultCategories = airdropCategories.filter(cat => 
        cat === "Layer 2" || cat === "Layer 1" || cat === "Layer 1 & Testnet Mainnet" || cat === "My Ethereum 2.0 Airdrop"
      );
      setCategories(defaultCategories);
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    setIsLoading(true);
    
    try {
      // We'll reuse the airdrops table for testnets, filtering by a specific category
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .in('category', ['Layer 2', 'Layer 1', 'Layer 1 & Testnet Mainnet', 'My Ethereum 2.0 Airdrop'])
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error loading testnets:", error);
        toast({
          title: "Error",
          description: "Failed to load testnets data",
          variant: "destructive",
        });
      } else if (data) {
        const formattedTestnets: Testnet[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          category: item.category,
          difficulty: (item.difficulty || "Easy") as "Easy" | "Medium" | "Hard",
          link: item.url || "",
          logo: item.logo_url || "",
          estimatedReward: item.reward_potential || "Low",
          tasks: [],
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isActive: true,
          isCompleted: item.is_completed || false,
          isPinned: item.is_pinned || false,
          
          // Database fields
          rewardPotential: item.reward_potential || "",
          timeRequired: item.time_required || "",
          url: item.url || "",
          logoUrl: item.logo_url || ""
        }));
        
        setTestnets(formattedTestnets);
        
        // Set completed testnets
        setCompletedTestnets(formattedTestnets.filter(testnet => testnet.isCompleted));
      }
    } catch (error) {
      console.error("Error in data loading:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCategories = async () => {
    try {
      // Reuse the existing airdrop categories focused on L1/L2
      const defaultCategories = airdropCategories.filter(cat => 
        cat === "Layer 2" || cat === "Layer 1" || cat === "Layer 1 & Testnet Mainnet" || cat === "My Ethereum 2.0 Airdrop"
      );
      
      setCategories(defaultCategories);
    } catch (error) {
      console.error("Error in categories loading:", error);
    }
  };

  const toggleCompleted = async (id: string) => {
    try {
      const testnet = testnets.find(t => t.id === id);
      if (!testnet) return;
      
      const newCompletedState = !testnet.isCompleted;
      
      // Update in database
      const { error } = await supabase
        .from('airdrops')  // Using the airdrops table
        .update({ is_completed: newCompletedState })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating testnet completion:", error);
        return;
      }
      
      // Update local state
      setTestnets(testnets.map(testnet => 
        testnet.id === id ? { ...testnet, isCompleted: newCompletedState } : testnet
      ));
      
      // Update completed testnets
      if (newCompletedState) {
        // Add to completed testnets
        setCompletedTestnets([...completedTestnets, {...testnet, isCompleted: true}]);
      } else {
        // Remove from completed testnets
        setCompletedTestnets(completedTestnets.filter(testnet => testnet.id !== id));
      }
    } catch (error) {
      console.error("Error in toggle completed:", error);
    }
  };

  const togglePinned = async (id: string) => {
    try {
      const testnet = testnets.find(t => t.id === id);
      if (!testnet) return;
      
      const newPinnedState = !testnet.isPinned;
      
      // Update in database
      const { error } = await supabase
        .from('airdrops')  // Using the airdrops table
        .update({ is_pinned: newPinnedState })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating testnet pinned state:", error);
        return;
      }
      
      // Update local state
      setTestnets(testnets.map(testnet => 
        testnet.id === id ? { ...testnet, isPinned: newPinnedState } : testnet
      ));

      // Also update in completed testnets
      setCompletedTestnets(completedTestnets.map(testnet => 
        testnet.id === id ? { ...testnet, isPinned: newPinnedState } : testnet
      ));
    } catch (error) {
      console.error("Error in toggle pinned:", error);
    }
  };

  const addTestnet = async (testnet: Testnet) => {
    try {
      if (!user) return;
      
      // Insert into database (using airdrops table)
      const { data, error } = await supabase
        .from('airdrops')
        .insert({
          user_id: user.id,
          name: testnet.name,
          description: testnet.description,
          category: testnet.category,
          difficulty: testnet.difficulty,
          reward_potential: testnet.rewardPotential || testnet.estimatedReward,
          time_required: testnet.timeRequired || "1-2 hours",
          url: testnet.url || testnet.link,
          logo_url: testnet.logoUrl || testnet.logo,
          is_completed: testnet.isCompleted,
          is_pinned: testnet.isPinned
        })
        .select();
        
      if (error) {
        console.error("Error adding testnet:", error);
        toast({
          title: "Error",
          description: "Failed to add testnet",
          variant: "destructive",
        });
        return;
      }
      
      if (data && data[0]) {
        // Add to local state with the new ID from the database
        const newTestnet: Testnet = {
          ...testnet,
          id: data[0].id,
          rewardPotential: data[0].reward_potential,
          timeRequired: data[0].time_required,
          url: data[0].url,
          logoUrl: data[0].logo_url
        };
        
        setTestnets([newTestnet, ...testnets]);
        
        // Add to completed testnets if it's completed
        if (newTestnet.isCompleted) {
          setCompletedTestnets([...completedTestnets, newTestnet]);
        }
        
        toast({
          title: "Success",
          description: "Testnet added successfully",
        });
      }
    } catch (error) {
      console.error("Error in add testnet:", error);
    }
  };

  const updateTestnet = async (updatedTestnet: Testnet) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('airdrops')  // Using the airdrops table
        .update({
          name: updatedTestnet.name,
          description: updatedTestnet.description,
          category: updatedTestnet.category,
          difficulty: updatedTestnet.difficulty,
          reward_potential: updatedTestnet.rewardPotential || updatedTestnet.estimatedReward,
          time_required: updatedTestnet.timeRequired || "1-2 hours",
          url: updatedTestnet.url || updatedTestnet.link,
          logo_url: updatedTestnet.logoUrl || updatedTestnet.logo,
          is_completed: updatedTestnet.isCompleted,
          is_pinned: updatedTestnet.isPinned
        })
        .eq('id', updatedTestnet.id);
        
      if (error) {
        console.error("Error updating testnet:", error);
        toast({
          title: "Error",
          description: "Failed to update testnet",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setTestnets(testnets.map(testnet => 
        testnet.id === updatedTestnet.id ? updatedTestnet : testnet
      ));

      // Also update in completed testnets if present
      if (updatedTestnet.isCompleted) {
        const existsInCompleted = completedTestnets.some(t => t.id === updatedTestnet.id);
        if (existsInCompleted) {
          setCompletedTestnets(completedTestnets.map(testnet => 
            testnet.id === updatedTestnet.id ? updatedTestnet : testnet
          ));
        } else {
          setCompletedTestnets([...completedTestnets, updatedTestnet]);
        }
      } else {
        setCompletedTestnets(completedTestnets.filter(testnet => testnet.id !== updatedTestnet.id));
      }
      
      toast({
        title: "Success",
        description: "Testnet updated successfully",
      });
    } catch (error) {
      console.error("Error in update testnet:", error);
    }
  };

  const deleteTestnet = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('airdrops')  // Using the airdrops table
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting testnet:", error);
        toast({
          title: "Error",
          description: "Failed to delete testnet",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setTestnets(testnets.filter(testnet => testnet.id !== id));
      setCompletedTestnets(completedTestnets.filter(testnet => testnet.id !== id));
      
      toast({
        title: "Success",
        description: "Testnet deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete testnet:", error);
    }
  };

  const addCategory = async (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const clearAllTestnets = async () => {
    try {
      if (!user) return;
      
      // Delete all testnets from database for this user (filtered by relevant categories)
      const { error } = await supabase
        .from('airdrops')  // Using the airdrops table
        .delete()
        .eq('user_id', user.id)
        .in('category', ['Layer 2', 'Layer 1', 'Layer 1 & Testnet Mainnet', 'My Ethereum 2.0 Airdrop']);
        
      if (error) {
        console.error("Error clearing testnets:", error);
        toast({
          title: "Error",
          description: "Failed to clear testnets",
          variant: "destructive",
        });
        return;
      }
      
      // Clear local state
      setTestnets([]);
      setCompletedTestnets([]);
      
      toast({
        title: "Success",
        description: "All testnets cleared successfully",
      });
    } catch (error) {
      console.error("Error in clear all testnets:", error);
    }
  };

  return (
    <TestnetsContext.Provider 
      value={{ 
        testnets, 
        categories,
        completedTestnets,
        toggleCompleted, 
        togglePinned,
        addTestnet,
        updateTestnet,
        deleteTestnet,
        addCategory,
        clearAllTestnets,
        isLoading
      }}
    >
      {children}
    </TestnetsContext.Provider>
  );
};

export const useTestnets = () => {
  const context = useContext(TestnetsContext);
  if (context === undefined) {
    throw new Error("useTestnets must be used within a TestnetsProvider");
  }
  return context;
};
