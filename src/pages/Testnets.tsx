
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, GraduationCap } from "lucide-react";

const Testnets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Placeholder testnet data
  const testnets = [
    {
      id: 1,
      name: "Ethereum Holesky",
      status: "Active",
      rewards: "Yes",
      difficulty: "Medium",
      description: "Public testnet for Ethereum, focused on staking and validator testing."
    },
    {
      id: 2,
      name: "Arbitrum Stylus",
      status: "Active",
      rewards: "Yes",
      difficulty: "Hard",
      description: "Testnet for Arbitrum's new Stylus VM, enabling Rust and C++ smart contracts."
    },
    {
      id: 3,
      name: "Polygon zkEVM",
      status: "Active",
      rewards: "Yes",
      difficulty: "Medium",
      description: "Testnet for Polygon's zero-knowledge Ethereum Virtual Machine."
    },
    {
      id: 4,
      name: "Sui Testnet",
      status: "Active",
      rewards: "Yes",
      difficulty: "Easy",
      description: "The official testnet for the Sui blockchain."
    },
    {
      id: 5,
      name: "Aptos Devnet",
      status: "Active",
      rewards: "Potential",
      difficulty: "Medium",
      description: "Developer network for Aptos blockchain."
    },
  ];
  
  // Filter testnets based on search query
  const filteredTestnets = testnets.filter(testnet => 
    testnet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testnet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Testnets</h1>
        <p className="text-muted-foreground mt-1">
          Discover and participate in the latest blockchain testnets
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search testnets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          Filters
        </Button>
      </div>
      
      {/* Coming Soon Banner */}
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="flex items-center gap-4 py-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">More Testnets Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              We're working on adding more testnet opportunities. Check back soon for updates!
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Testnets Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredTestnets.map((testnet) => (
          <motion.div key={testnet.id} variants={item}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{testnet.name}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    testnet.status === "Active" ? "bg-green-500/20 text-green-500" : 
                    testnet.status === "Upcoming" ? "bg-blue-500/20 text-blue-500" : 
                    "bg-gray-500/20 text-gray-500"
                  }`}>
                    {testnet.status}
                  </span>
                </div>
                <CardDescription>Difficulty: {testnet.difficulty} • Rewards: {testnet.rewards}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{testnet.description}</p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Button variant="outline" className="w-full">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testnets;
