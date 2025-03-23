
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Testnet, initialTestnets, airdropCategories } from "@/data/airdrops";

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
}

const TestnetsContext = createContext<TestnetsContextType | undefined>(undefined);

export const TestnetsProvider = ({ children }: { children: ReactNode }) => {
  const [testnets, setTestnets] = useState<Testnet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [completedTestnets, setCompletedTestnets] = useState<Testnet[]>([]);

  useEffect(() => {
    // Load testnets from localStorage or use initial data
    const savedTestnets = localStorage.getItem("testnets");
    if (savedTestnets) {
      setTestnets(JSON.parse(savedTestnets));
    } else {
      setTestnets(initialTestnets);
    }

    // Use the same categories as airdrops initially
    const savedCategories = localStorage.getItem("testnet_categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      const defaultCategories = airdropCategories.filter(cat => 
        cat === "Layer 2" || cat === "Layer 1" || cat === "Layer 1 & Testnet Mainnet" || cat === "My Ethereum 2.0 Airdrop"
      );
      setCategories(defaultCategories);
      localStorage.setItem("testnet_categories", JSON.stringify(defaultCategories));
    }

    // Load completed testnets
    const savedCompletedTestnets = localStorage.getItem("completed_testnets");
    if (savedCompletedTestnets) {
      setCompletedTestnets(JSON.parse(savedCompletedTestnets));
    } else {
      setCompletedTestnets([]);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (testnets.length > 0) {
      localStorage.setItem("testnets", JSON.stringify(testnets));
    }
  }, [testnets]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("testnet_categories", JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("completed_testnets", JSON.stringify(completedTestnets));
  }, [completedTestnets]);

  const toggleCompleted = (id: string) => {
    const testnetToToggle = testnets.find(testnet => testnet.id === id);
    
    if (testnetToToggle) {
      const isCurrentlyCompleted = testnetToToggle.isCompleted;
      
      // Update in main testnets array
      setTestnets(testnets.map(testnet => 
        testnet.id === id ? { ...testnet, isCompleted: !isCurrentlyCompleted } : testnet
      ));
      
      // Update completed testnets
      if (!isCurrentlyCompleted) {
        // Add to completed testnets
        setCompletedTestnets([...completedTestnets, {...testnetToToggle, isCompleted: true}]);
      } else {
        // Remove from completed testnets
        setCompletedTestnets(completedTestnets.filter(testnet => testnet.id !== id));
      }
    }
  };

  const togglePinned = (id: string) => {
    setTestnets(testnets.map(testnet => 
      testnet.id === id ? { ...testnet, isPinned: !testnet.isPinned } : testnet
    ));

    // Also update in completed testnets
    setCompletedTestnets(completedTestnets.map(testnet => 
      testnet.id === id ? { ...testnet, isPinned: !testnet.isPinned } : testnet
    ));
  };

  const addTestnet = (testnet: Testnet) => {
    setTestnets([...testnets, testnet]);
  };

  const updateTestnet = (updatedTestnet: Testnet) => {
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
    }
  };

  const deleteTestnet = (id: string) => {
    setTestnets(testnets.filter(testnet => testnet.id !== id));
    setCompletedTestnets(completedTestnets.filter(testnet => testnet.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const clearAllTestnets = () => {
    setTestnets([]);
    setCompletedTestnets([]);
    localStorage.setItem("testnets", JSON.stringify([]));
    localStorage.setItem("completed_testnets", JSON.stringify([]));
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
        clearAllTestnets
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
