
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Wallet, LineChart, Coins, BarChart3, ArrowLeftRight } from "lucide-react";

const Tools = () => {
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
  
  const tools = [
    {
      id: 1,
      name: "Gas Fee Calculator",
      description: "Calculate gas fees across different blockchain networks",
      icon: Calculator,
      comingSoon: false
    },
    {
      id: 2,
      name: "Wallet Tracker",
      description: "Track your portfolio across multiple wallets",
      icon: Wallet,
      comingSoon: false
    },
    {
      id: 3,
      name: "Price Charts",
      description: "Real-time price charts for all major cryptocurrencies",
      icon: LineChart,
      comingSoon: false
    },
    {
      id: 4,
      name: "Token Explorer",
      description: "Explore and analyze tokens across different blockchains",
      icon: Coins,
      comingSoon: true
    },
    {
      id: 5,
      name: "APY Calculator",
      description: "Calculate potential yields from staking and farming",
      icon: BarChart3,
      comingSoon: true
    },
    {
      id: 6,
      name: "Swap Aggregator",
      description: "Find the best rates across decentralized exchanges",
      icon: ArrowLeftRight,
      comingSoon: true
    }
  ];

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crypto Tools</h1>
        <p className="text-muted-foreground mt-1">
          Useful tools to enhance your crypto experience
        </p>
      </div>
      
      {/* Tools Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={item}>
            <Card className={`h-full hover:shadow-md transition-shadow ${tool.comingSoon ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    {tool.comingSoon && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Note at the bottom */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>Have a suggestion for a tool? Let us know!</p>
        <p>We're constantly adding new tools to help with your crypto journey.</p>
      </div>
    </div>
  );
};

export default Tools;
