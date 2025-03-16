
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Airdrop, AirdropRanking, initialAirdrops, initialRankings } from "@/data/airdrops";

interface AirdropsContextType {
  airdrops: Airdrop[];
  rankings: AirdropRanking[];
  toggleCompleted: (id: string) => void;
  addRanking: (ranking: AirdropRanking) => void;
  updateRanking: (ranking: AirdropRanking) => void;
  deleteRanking: (id: string) => void;
}

const AirdropsContext = createContext<AirdropsContextType | undefined>(undefined);

export const AirdropsProvider = ({ children }: { children: ReactNode }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [rankings, setRankings] = useState<AirdropRanking[]>([]);

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
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (airdrops.length > 0) {
      localStorage.setItem("airdrops", JSON.stringify(airdrops));
    }
  }, [airdrops]);

  useEffect(() => {
    if (rankings.length > 0) {
      localStorage.setItem("airdrop_rankings", JSON.stringify(rankings));
    }
  }, [rankings]);

  const toggleCompleted = (id: string) => {
    setAirdrops(airdrops.map(airdrop => 
      airdrop.id === id ? { ...airdrop, isCompleted: !airdrop.isCompleted } : airdrop
    ));
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

  return (
    <AirdropsContext.Provider 
      value={{ 
        airdrops, 
        rankings,
        toggleCompleted, 
        addRanking,
        updateRanking,
        deleteRanking
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
