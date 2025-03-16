
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Tool, initialTools, toolCategories } from "@/data/airdrops";

interface ToolsContextType {
  tools: Tool[];
  categories: string[];
  toggleCompleted: (id: string) => void;
  togglePinned: (id: string) => void;
  addTool: (tool: Tool) => void;
  updateTool: (tool: Tool) => void;
  deleteTool: (id: string) => void;
  addCategory: (category: string) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: ReactNode }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load tools from localStorage or use initial data
    const savedTools = localStorage.getItem("tools");
    if (savedTools) {
      setTools(JSON.parse(savedTools));
    } else {
      setTools(initialTools);
    }

    // Load categories from localStorage or use initial data
    const savedCategories = localStorage.getItem("tool_categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(toolCategories);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (tools.length > 0) {
      localStorage.setItem("tools", JSON.stringify(tools));
    }
  }, [tools]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("tool_categories", JSON.stringify(categories));
    }
  }, [categories]);

  const toggleCompleted = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, isCompleted: !tool.isCompleted } : tool
    ));
  };

  const togglePinned = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, isPinned: !tool.isPinned } : tool
    ));
  };

  const addTool = (tool: Tool) => {
    setTools([...tools, tool]);
  };

  const updateTool = (updatedTool: Tool) => {
    setTools(tools.map(tool => 
      tool.id === updatedTool.id ? updatedTool : tool
    ));
  };

  const deleteTool = (id: string) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
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
        addCategory
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
