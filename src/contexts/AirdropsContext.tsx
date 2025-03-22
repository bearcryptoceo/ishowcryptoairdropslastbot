
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Airdrop, AirdropRanking, initialAirdrops, initialRankings, airdropCategories } from "@/data/airdrops";

interface AirdropsContextType {
  airdrops: Airdrop[];
  rankings: AirdropRanking[];
  categories: string[];
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
}

const AirdropsContext = createContext<AirdropsContextType | undefined>(undefined);

export const AirdropsProvider = ({ children }: { children: ReactNode }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [rankings, setRankings] = useState<AirdropRanking[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load airdrops from localStorage or use initial data
    const savedAirdrops = localStorage.getItem("airdrops");
    if (savedAirdrops) {
      setAirdrops(JSON.parse(savedAirdrops));
    } else {
      setAirdrops(initialAirdrops);
    }

    // Load rankings from localStorage or use initial data
    const savedRankings = localStorage.getItem("airdrop_rankings");
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings));
    } else {
      setRankings(initialRankings);
    }

    // Load categories from localStorage or use initial data
    const savedCategories = localStorage.getItem("airdrop_categories");
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      // Add "My Ethereum 2.0 Airdrop" if it doesn't exist
      if (!parsedCategories.includes("My Ethereum 2.0 Airdrop")) {
        parsedCategories.push("My Ethereum 2.0 Airdrop");
      }
      setCategories(parsedCategories);
    } else {
      // Add "My Ethereum 2.0 Airdrop" to initial categories
      const updatedCategories = [...airdropCategories];
      if (!updatedCategories.includes("My Ethereum 2.0 Airdrop")) {
        updatedCategories.push("My Ethereum 2.0 Airdrop");
      }
      setCategories(updatedCategories);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("airdrops", JSON.stringify(airdrops));
  }, [airdrops]);

  useEffect(() => {
    localStorage.setItem("airdrop_rankings", JSON.stringify(rankings));
  }, [rankings]);

  useEffect(() => {
    localStorage.setItem("airdrop_categories", JSON.stringify(categories));
  }, [categories]);

  const toggleCompleted = (id: string) => {
    setAirdrops(airdrops.map(airdrop => 
      airdrop.id === id ? { ...airdrop, isCompleted: !airdrop.isCompleted } : airdrop
    ));
  };

  const togglePinned = (id: string) => {
    setAirdrops(airdrops.map(airdrop => 
      airdrop.id === id ? { ...airdrop, isPinned: !airdrop.isPinned } : airdrop
    ));
  };

  const addAirdrop = (airdrop: Airdrop) => {
    setAirdrops([...airdrops, airdrop]);
  };

  const updateAirdrop = (updatedAirdrop: Airdrop) => {
    setAirdrops(airdrops.map(airdrop => 
      airdrop.id === updatedAirdrop.id ? updatedAirdrop : airdrop
    ));
  };

  const deleteAirdrop = (id: string) => {
    setAirdrops(airdrops.filter(airdrop => airdrop.id !== id));
    // Also delete any rankings associated with this airdrop
    setRankings(rankings.filter(ranking => ranking.airdropId !== id));
  };

  const addRanking = (ranking: AirdropRanking) => {
    setRankings([...rankings, ranking]);
  };

  const updateRanking = (updatedRanking: AirdropRanking) => {
    setRankings(rankings.map(ranking => 
      ranking.id === updatedRanking.id ? updatedRanking : ranking
    ));
  };

  const deleteRanking = (id: string) => {
    setRankings(rankings.filter(ranking => ranking.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Clear all airdrops (delete all pre-added airdrops)
  const clearAllAirdrops = () => {
    setAirdrops([]);
    localStorage.setItem("airdrops", JSON.stringify([]));
  };

  // Clear pre-added rankings
  const clearPreAddedRankings = () => {
    setRankings([]);
    localStorage.setItem("airdrop_rankings", JSON.stringify([]));
  };

  return (
    <AirdropsContext.Provider 
      value={{ 
        airdrops, 
        rankings,
        categories,
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
        clearPreAddedRankings
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
