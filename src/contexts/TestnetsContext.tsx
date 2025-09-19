import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockTestnets } from '@/data/airdrops';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Update Testnet interface to match database schema
export interface Testnet {
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
  isCompleted: boolean;
  isPinned: boolean;
  userId?: string;
}

interface TestnetsContextType {
  testnets: Testnet[];
  categories: string[];
  addTestnet: (testnet: Omit<Testnet, 'id'>) => Promise<void>;
  updateTestnet: (testnet: Testnet) => Promise<void>;
  deleteTestnet: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
  togglePinned: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
}

const TestnetsContext = createContext<TestnetsContextType | undefined>(undefined);

export const TestnetsProvider = ({ children }: { children: ReactNode }) => {
  const [testnets, setTestnets] = useState<Testnet[]>([]);
  const [categories, setCategories] = useState<string[]>(['Layer 1', 'Layer 2', 'DeFi', 'Infrastructure']);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTestnets();
    } else {
      // Add default properties to mock data
      setTestnets(mockTestnets.map(testnet => ({
        ...testnet,
        isCompleted: false,
        isPinned: false
      })));
    }
  }, [isAuthenticated, user]);

  const fetchTestnets = async () => {
    if (!user) return;

    try {
      // We're storing testnets in the airdrops table, but with a specific category
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', 'testnet');

      if (error) {
        console.error('Error fetching testnets:', error);
        return;
      }

      if (data) {
        // Map database fields to component fields
        const formattedTestnets = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: 'testnet',
          link: item.url,
          logo: item.logo_url,
          estimatedReward: item.reward_potential,
          difficulty: item.difficulty,
          tasks: [],
          startDate: '',
          endDate: '',
          isActive: true,
          isCompleted: item.is_completed,
          isPinned: item.is_pinned
        }));
        
        setTestnets(formattedTestnets);
      }
    } catch (error) {
      console.error('Error fetching testnets:', error);
    }
  };

  const addTestnet = async (testnet: Omit<Testnet, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('airdrops')
        .insert([
          {
            ...testnet,
            user_id: user.id,
            category: 'testnet', // Ensure category is set to 'testnet'
            is_completed: false,
            is_pinned: false
          },
        ])
        .select();

      if (error) {
        console.error('Error adding testnet:', error);
        toast({
          title: "Error",
          description: "Failed to add testnet",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        // Map database fields to component fields
        const newTestnet = data[0];
        const formattedTestnet = {
          id: newTestnet.id,
          name: newTestnet.name,
          description: newTestnet.description,
          category: 'testnet',
          link: newTestnet.url,
          logo: newTestnet.logo_url,
          estimatedReward: newTestnet.reward_potential,
          difficulty: newTestnet.difficulty,
          tasks: [],
          startDate: '',
          endDate: '',
          isActive: true,
          isCompleted: newTestnet.is_completed,
          isPinned: newTestnet.is_pinned
        };
        setTestnets([...testnets, formattedTestnet]);
        toast({
          title: "Success",
          description: "Testnet added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding testnet:', error);
      toast({
        title: "Error",
        description: "Failed to add testnet",
        variant: "destructive",
      });
    }
  };

  const updateTestnet = async (testnet: Testnet) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('airdrops')
        .update({
          name: testnet.name,
          description: testnet.description,
          category: 'testnet',
          url: testnet.link,
          logo_url: testnet.logo,
          difficulty: testnet.difficulty,
          reward_potential: testnet.estimatedReward,
        })
        .eq('id', testnet.id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error updating testnet:', error);
        toast({
          title: "Error",
          description: "Failed to update testnet",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        // Map database fields to component fields
        const updatedTestnet = data[0];
        const formattedTestnet = {
          id: updatedTestnet.id,
          name: updatedTestnet.name,
          description: updatedTestnet.description,
          category: 'testnet',
          link: updatedTestnet.url,
          logo: updatedTestnet.logo_url,
          estimatedReward: updatedTestnet.reward_potential,
          difficulty: updatedTestnet.difficulty,
          tasks: [],
          startDate: '',
          endDate: '',
          isActive: true,
          isCompleted: updatedTestnet.is_completed,
          isPinned: updatedTestnet.is_pinned
        };
        setTestnets(
          testnets.map((t) => (t.id === testnet.id ? formattedTestnet : t))
        );
        toast({
          title: "Success",
          description: "Testnet updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating testnet:', error);
      toast({
        title: "Error",
        description: "Failed to update testnet",
        variant: "destructive",
      });
    }
  };

  const deleteTestnet = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('airdrops')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting testnet:', error);
        toast({
          title: "Error",
          description: "Failed to delete testnet",
          variant: "destructive",
        });
        return;
      }

      setTestnets(testnets.filter((testnet) => testnet.id !== id));
      toast({
        title: "Success",
        description: "Testnet deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting testnet:', error);
      toast({
        title: "Error",
        description: "Failed to delete testnet",
        variant: "destructive",
      });
    }
  };

  const togglePinned = async (id: string) => {
    if (!user) return;

    try {
      const testnetToUpdate = testnets.find((testnet) => testnet.id === id);
      if (!testnetToUpdate) {
        console.error('Testnet not found');
        return;
      }

      const newPinState = !testnetToUpdate.isPinned;

      const { data, error } = await supabase
        .from('airdrops')
        .update({ is_pinned: newPinState })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error toggling pin state:', error);
        toast({
          title: "Error",
          description: "Failed to toggle pin state",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        // Map database fields to component fields
        const updatedTestnet = data[0];
        const formattedTestnet = {
          id: updatedTestnet.id,
          name: updatedTestnet.name,
          description: updatedTestnet.description,
          category: 'testnet',
          link: updatedTestnet.url,
          logo: updatedTestnet.logo_url,
          estimatedReward: updatedTestnet.reward_potential,
          difficulty: updatedTestnet.difficulty,
          tasks: [],
          startDate: '',
          endDate: '',
          isActive: true,
          isCompleted: updatedTestnet.is_completed,
          isPinned: updatedTestnet.is_pinned
        };
        setTestnets(
          testnets.map((testnet) => (testnet.id === id ? formattedTestnet : testnet))
        );
        toast({
          title: "Success",
          description: "Testnet pin state toggled successfully",
        });
      }
    } catch (error) {
      console.error('Error toggling pin state:', error);
      toast({
        title: "Error",
        description: "Failed to toggle pin state",
        variant: "destructive",
      });
    }
  };

  const toggleCompleted = async (id: string) => {
    if (!user) return;

    try {
      const testnetToUpdate = testnets.find((testnet) => testnet.id === id);
      if (!testnetToUpdate) {
        console.error('Testnet not found');
        return;
      }

      const newCompleteState = !testnetToUpdate.isCompleted;

      const { data, error } = await supabase
        .from('airdrops')
        .update({ is_completed: newCompleteState })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error toggling complete state:', error);
        toast({
          title: "Error",
          description: "Failed to toggle complete state",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        // Map database fields to component fields
        const updatedTestnet = data[0];
        const formattedTestnet = {
          id: updatedTestnet.id,
          name: updatedTestnet.name,
          description: updatedTestnet.description,
          category: 'testnet',
          link: updatedTestnet.url,
          logo: updatedTestnet.logo_url,
          estimatedReward: updatedTestnet.reward_potential,
          difficulty: updatedTestnet.difficulty,
          tasks: [],
          startDate: '',
          endDate: '',
          isActive: true,
          isCompleted: updatedTestnet.is_completed,
          isPinned: updatedTestnet.is_pinned
        };
        setTestnets(
          testnets.map((testnet) => (testnet.id === id ? formattedTestnet : testnet))
        );
        toast({
          title: "Success",
          description: "Testnet complete state toggled successfully",
        });
      }
    } catch (error) {
      console.error('Error toggling complete state:', error);
      toast({
        title: "Error",
        description: "Failed to toggle complete state",
        variant: "destructive",
      });
    }
  };

  const addCategory = async (category: string) => {
    if (categories.includes(category)) return;
    setCategories([...categories, category]);
  };

  // Context value
  const value = {
    testnets,
    categories,
    addTestnet,
    updateTestnet,
    deleteTestnet,
    toggleCompleted,
    togglePinned,
    addCategory,
  };

  return <TestnetsContext.Provider value={value}>{children}</TestnetsContext.Provider>;
};

export const useTestnets = () => {
  const context = useContext(TestnetsContext);
  if (context === undefined) {
    throw new Error('useTestnets must be used within a TestnetsProvider');
  }
  return context;
};
