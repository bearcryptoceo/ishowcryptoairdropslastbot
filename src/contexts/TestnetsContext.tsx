
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Testnet, initialTestnets, airdropCategories } from "@/data/airdrops";

interface TestnetsContextType {
  testnets: Testnet[];
  categories: string[];
  toggleCompleted: (id: string) => void;
  togglePinned: (id: string) => void;
  addTestnet: (testnet: Testnet) => void;
  updateTestnet: (testnet: Testnet) => void;
  deleteTestnet: (id: string) => void;
  addCategory: (category: string) => void;
}

const TestnetsContext = createContext<TestnetsContextType | undefined>(undefined);

export const TestnetsProvider = ({ children }: { children: ReactNode }) => {
  const [testnets, setTestnets] = useState<Testnet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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
      setCategories(airdropCategories.filter(cat => 
        cat === "Layer 2" || cat === "Layer 1" || cat === "Layer 1 & Testnet Mainnet"
      ));
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

  const toggleCompleted = (id: string) => {
    setTestnets(testnets.map(testnet => 
      testnet.id === id ? { ...testnet, isCompleted: !testnet.isCompleted } : testnet
    ));
  };

  const togglePinned = (id: string) => {
    setTestnets(testnets.map(testnet => 
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
  };

  const deleteTestnet = (id: string) => {
    setTestnets(testnets.filter(testnet => testnet.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  return (
    <TestnetsContext.Provider 
      value={{ 
        testnets, 
        categories,
        toggleCompleted, 
        togglePinned,
        addTestnet,
        updateTestnet,
        deleteTestnet,
        addCategory
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
