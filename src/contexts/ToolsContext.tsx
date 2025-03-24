
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Tool, initialTools, toolCategories } from "@/data/airdrops";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ToolsContextType {
  tools: Tool[];
  categories: string[];
  toggleCompleted: (id: string) => void;
  togglePinned: (id: string) => void;
  addTool: (tool: Tool) => void;
  updateTool: (tool: Tool) => void;
  deleteTool: (id: string) => void;
  addCategory: (category: string) => void;
  isLoading: boolean;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: ReactNode }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Reset data when not authenticated
      setTools([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);
  
  // Initial categories setup
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCategories();
    } else {
      setCategories(toolCategories);
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    setIsLoading(true);
    
    try {
      // Load tools
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error loading tools:", error);
        toast({
          title: "Error",
          description: "Failed to load tools data",
          variant: "destructive",
        });
      } else {
        const formattedTools = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          category: item.category,
          difficulty: item.difficulty || "Easy",
          url: item.url || "",
          logoUrl: item.logo_url || "",
          isCompleted: item.is_completed,
          isPinned: item.is_pinned
        }));
        
        setTools(formattedTools);
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
        .from('tool_categories')
        .select('name');
        
      if (error) {
        console.error("Error loading categories:", error);
        
        // If error, initialize with default categories
        setCategories(toolCategories);
        
        // Save default categories to the database
        for (const category of toolCategories) {
          await supabase.from('tool_categories').insert({
            user_id: user?.id,
            name: category
          });
        }
      } else if (data && data.length > 0) {
        setCategories(data.map(item => item.name));
      } else {
        // No categories found, initialize with defaults
        setCategories(toolCategories);
        
        // Save default categories to the database
        for (const category of toolCategories) {
          await supabase.from('tool_categories').insert({
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
      const tool = tools.find(t => t.id === id);
      if (!tool) return;
      
      const newCompletedState = !tool.isCompleted;
      
      // Update in database
      const { error } = await supabase
        .from('tools')
        .update({ is_completed: newCompletedState })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating tool completion:", error);
        return;
      }
      
      // Update local state
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, isCompleted: newCompletedState } : tool
      ));
    } catch (error) {
      console.error("Error in toggle completed:", error);
    }
  };

  const togglePinned = async (id: string) => {
    try {
      const tool = tools.find(t => t.id === id);
      if (!tool) return;
      
      const newPinnedState = !tool.isPinned;
      
      // Update in database
      const { error } = await supabase
        .from('tools')
        .update({ is_pinned: newPinnedState })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating tool pinned state:", error);
        return;
      }
      
      // Update local state
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, isPinned: newPinnedState } : tool
      ));
    } catch (error) {
      console.error("Error in toggle pinned:", error);
    }
  };

  const addTool = async (tool: Tool) => {
    try {
      if (!user) return;
      
      // Insert into database
      const { data, error } = await supabase
        .from('tools')
        .insert({
          user_id: user.id,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          difficulty: tool.difficulty,
          url: tool.url,
          logo_url: tool.logoUrl,
          is_completed: tool.isCompleted,
          is_pinned: tool.isPinned
        })
        .select();
        
      if (error) {
        console.error("Error adding tool:", error);
        toast({
          title: "Error",
          description: "Failed to add tool",
          variant: "destructive",
        });
        return;
      }
      
      if (data && data[0]) {
        // Add to local state with the new ID from the database
        const newTool = {
          ...tool,
          id: data[0].id
        };
        
        setTools([newTool, ...tools]);
        
        toast({
          title: "Success",
          description: "Tool added successfully",
        });
      }
    } catch (error) {
      console.error("Error in add tool:", error);
    }
  };

  const updateTool = async (updatedTool: Tool) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('tools')
        .update({
          name: updatedTool.name,
          description: updatedTool.description,
          category: updatedTool.category,
          difficulty: updatedTool.difficulty,
          url: updatedTool.url,
          logo_url: updatedTool.logoUrl,
          is_completed: updatedTool.isCompleted,
          is_pinned: updatedTool.isPinned
        })
        .eq('id', updatedTool.id);
        
      if (error) {
        console.error("Error updating tool:", error);
        toast({
          title: "Error",
          description: "Failed to update tool",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setTools(tools.map(tool => 
        tool.id === updatedTool.id ? updatedTool : tool
      ));
      
      toast({
        title: "Success",
        description: "Tool updated successfully",
      });
    } catch (error) {
      console.error("Error in update tool:", error);
    }
  };

  const deleteTool = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting tool:", error);
        toast({
          title: "Error",
          description: "Failed to delete tool",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setTools(tools.filter(tool => tool.id !== id));
      
      toast({
        title: "Success",
        description: "Tool deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete tool:", error);
    }
  };

  const addCategory = async (category: string) => {
    try {
      if (!user) return;
      
      if (!categories.includes(category)) {
        // Insert into database
        const { error } = await supabase
          .from('tool_categories')
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

  return (
    <ToolsContext.Provider 
      value={{ 
        tools, 
        categories,
        toggleCompleted, 
        togglePinned,
        addTool,
        updateTool,
        deleteTool,
        addCategory,
        isLoading
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
};
