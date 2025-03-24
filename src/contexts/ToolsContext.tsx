import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockTools } from '@/data/airdrops';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Update Tool interface to match database schema
export interface Tool {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty?: string;
  url?: string;
  logoUrl?: string;
  isCompleted: boolean;
  isPinned: boolean;
  userId?: string;
  // Compatibility with UI components
  link?: string; // alias for url
  icon?: string; // alias for logoUrl
  comingSoon?: boolean;
}

interface ToolsContextType {
  tools: Tool[];
  addTool: (tool: Omit<Tool, 'id'>) => Promise<void>;
  updateTool: (id: string, tool: Partial<Tool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  togglePinTool: (id: string) => Promise<void>;
  toggleCompleteTool: (id: string) => Promise<void>;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: ReactNode }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTools();
    } else {
      // Use mock data when not authenticated
      setTools(mockTools.map(tool => ({
        ...tool,
        url: tool.link,
        logoUrl: tool.icon,
        isCompleted: false,
        isPinned: false,
        comingSoon: tool.comingSoon,
      })));
    }
  }, [isAuthenticated, user]);

  const fetchTools = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching tools:', error);
        return;
      }

      if (data) {
        // Map database fields to component fields
        const formattedTools = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          difficulty: item.difficulty,
          url: item.url,
          logoUrl: item.logo_url,
          isCompleted: item.is_completed,
          isPinned: item.is_pinned,
          // Add compatibility fields
          link: item.url,
          icon: item.logo_url,
          comingSoon: false,
        }));
        
        setTools(formattedTools);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const addTool = async (tool: Omit<Tool, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tools')
        .insert([
          {
            ...tool,
            user_id: user.id,
            is_completed: false,
            is_pinned: false,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding tool:', error);
        toast({
          title: "Error",
          description: "Failed to add tool",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const newTool = data[0];
        setTools(prevTools => [...prevTools, {
          id: newTool.id,
          name: newTool.name,
          description: newTool.description,
          category: newTool.category,
          difficulty: newTool.difficulty,
          url: newTool.url,
          logoUrl: newTool.logo_url,
          isCompleted: newTool.is_completed,
          isPinned: newTool.is_pinned,
          link: newTool.url,
          icon: newTool.logo_url,
          comingSoon: false,
        }]);
        toast({
          title: "Success",
          description: "Tool added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding tool:', error);
      toast({
        title: "Error",
        description: "Failed to add tool",
        variant: "destructive",
      });
    }
  };

  const updateTool = async (id: string, tool: Partial<Tool>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tools')
        .update(tool)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error updating tool:', error);
        toast({
          title: "Error",
          description: "Failed to update tool",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const updatedTool = data[0];
        setTools(prevTools =>
          prevTools.map(existingTool =>
            existingTool.id === id ? {
              id: updatedTool.id,
              name: updatedTool.name,
              description: updatedTool.description,
              category: updatedTool.category,
              difficulty: updatedTool.difficulty,
              url: updatedTool.url,
              logoUrl: updatedTool.logo_url,
              isCompleted: updatedTool.is_completed,
              isPinned: updatedTool.is_pinned,
              link: updatedTool.url,
              icon: updatedTool.logo_url,
              comingSoon: false,
            } : existingTool
          )
        );
        toast({
          title: "Success",
          description: "Tool updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating tool:', error);
      toast({
        title: "Error",
        description: "Failed to update tool",
        variant: "destructive",
      });
    }
  };

  const deleteTool = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting tool:', error);
        toast({
          title: "Error",
          description: "Failed to delete tool",
          variant: "destructive",
        });
        return;
      }

      setTools(prevTools => prevTools.filter(tool => tool.id !== id));
      toast({
        title: "Success",
        description: "Tool deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: "Error",
        description: "Failed to delete tool",
        variant: "destructive",
      });
    }
  };

  const togglePinTool = async (id: string) => {
    if (!user) return;

    try {
      const toolToUpdate = tools.find(tool => tool.id === id);
      if (!toolToUpdate) {
        console.error('Tool not found');
        return;
      }

      const newPinState = !toolToUpdate.isPinned;

      const { data, error } = await supabase
        .from('tools')
        .update({ is_pinned: newPinState })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error pinning tool:', error);
        toast({
          title: "Error",
          description: "Failed to pin tool",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const updatedTool = data[0];
        setTools(prevTools =>
          prevTools.map(existingTool =>
            existingTool.id === id ? {
              id: updatedTool.id,
              name: updatedTool.name,
              description: updatedTool.description,
              category: updatedTool.category,
              difficulty: updatedTool.difficulty,
              url: updatedTool.url,
              logoUrl: updatedTool.logo_url,
              isCompleted: updatedTool.is_completed,
              isPinned: updatedTool.is_pinned,
              link: updatedTool.url,
              icon: updatedTool.logo_url,
              comingSoon: false,
            } : existingTool
          )
        );
        toast({
          title: "Success",
          description: `Tool ${newPinState ? 'pinned' : 'unpinned'} successfully`,
        });
      }
    } catch (error) {
      console.error('Error pinning tool:', error);
      toast({
        title: "Error",
        description: "Failed to pin tool",
        variant: "destructive",
      });
    }
  };

  const toggleCompleteTool = async (id: string) => {
    if (!user) return;

    try {
      const toolToUpdate = tools.find(tool => tool.id === id);
      if (!toolToUpdate) {
        console.error('Tool not found');
        return;
      }

      const newCompleteState = !toolToUpdate.isCompleted;

      const { data, error } = await supabase
        .from('tools')
        .update({ is_completed: newCompleteState })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error completing tool:', error);
        toast({
          title: "Error",
          description: "Failed to complete tool",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const updatedTool = data[0];
        setTools(prevTools =>
          prevTools.map(existingTool =>
            existingTool.id === id ? {
              id: updatedTool.id,
              name: updatedTool.name,
              description: updatedTool.description,
              category: updatedTool.category,
              difficulty: updatedTool.difficulty,
              url: updatedTool.url,
              logoUrl: updatedTool.logo_url,
              isCompleted: updatedTool.is_completed,
              isPinned: updatedTool.is_pinned,
              link: updatedTool.url,
              icon: updatedTool.logo_url,
              comingSoon: false,
            } : existingTool
          )
        );
        toast({
          title: "Success",
          description: `Tool ${newCompleteState ? 'completed' : 'uncompleted'} successfully`,
        });
      }
    } catch (error) {
      console.error('Error completing tool:', error);
      toast({
        title: "Error",
        description: "Failed to complete tool",
        variant: "destructive",
      });
    }
  };

  // Context value
  const value = {
    tools,
    addTool,
    updateTool,
    deleteTool,
    togglePinTool,
    toggleCompleteTool,
  };

  return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
};
