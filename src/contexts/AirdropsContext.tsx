import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Airdrop, AirdropRanking, initialAirdrops, initialRankings, airdropCategories } from "@/data/airdrops";

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
}

const AirdropsContext = createContext<AirdropsContextType | undefined>(undefined);

const initialEvents: Event[] = [
  {
    id: "event-1",
    title: "Arbitrum Airdrop Snapshot",
    subtitle: "Layer 1 & Testnet",
    status: "upcoming",
    timeLeft: "2 days left",
    buttonText: "View Details",
    buttonAction: "view_details",
    link: "https://arbitrum.io"
  },
  {
    id: "event-2",
    title: "LayerZero Testnet Phase 2",
    subtitle: "Bridge Mining",
    status: "live",
    buttonText: "Join Testnet",
    buttonAction: "join_testnet",
    link: "https://layerzero.network"
  },
  {
    id: "event-3",
    title: "Weekly Video Summary",
    subtitle: "By UmarCryptospace",
    status: "coming_soon",
    buttonText: "Get Notified",
    buttonAction: "get_notified"
  }
];

export const AirdropsProvider = ({ children }: { children: ReactNode }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [rankings, setRankings] = useState<AirdropRanking[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [completedAirdrops, setCompletedAirdrops] = useState<Airdrop[]>([]);

  useEffect(() => {
    const savedAirdrops = localStorage.getItem("airdrops");
    if (savedAirdrops) {
      setAirdrops(JSON.parse(savedAirdrops));
    } else {
      setAirdrops([]);
    }

    const savedRankings = localStorage.getItem("airdrop_rankings");
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings));
    } else {
      setRankings([]);
    }

    const savedCategories = localStorage.getItem("airdrop_categories");
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      if (!parsedCategories.includes("My Ethereum 2.0 Airdrop")) {
        parsedCategories.push("My Ethereum 2.0 Airdrop");
      }
      setCategories(parsedCategories);
    } else {
      const updatedCategories = [...airdropCategories];
      if (!updatedCategories.includes("My Ethereum 2.0 Airdrop")) {
        updatedCategories.push("My Ethereum 2.0 Airdrop");
      }
      setCategories(updatedCategories);
    }

    const savedEvents = localStorage.getItem("upcoming_events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(initialEvents);
    }

    const savedCompletedAirdrops = localStorage.getItem("completed_airdrops");
    if (savedCompletedAirdrops) {
      setCompletedAirdrops(JSON.parse(savedCompletedAirdrops));
    } else {
      setCompletedAirdrops([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("airdrops", JSON.stringify(airdrops));
  }, [airdrops]);

  useEffect(() => {
    localStorage.setItem("airdrop_rankings", JSON.stringify(rankings));
  }, [rankings]);

  useEffect(() => {
    localStorage.setItem("airdrop_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("upcoming_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("completed_airdrops", JSON.stringify(completedAirdrops));
  }, [completedAirdrops]);

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

  const clearAllAirdrops = () => {
    setAirdrops([]);
    localStorage.setItem("airdrops", JSON.stringify([]));
  };

  const clearPreAddedRankings = () => {
    setRankings([]);
    localStorage.setItem("airdrop_rankings", JSON.stringify([]));
  };

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
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
        deleteEvent
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
