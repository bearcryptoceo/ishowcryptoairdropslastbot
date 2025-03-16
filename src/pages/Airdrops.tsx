
import { useState } from "react";
import { motion } from "framer-motion";
import { useAirdrops } from "@/contexts/AirdropsContext";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, ExternalLink, Filter, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Airdrops = () => {
  const { airdrops, toggleCompleted } = useAirdrops();
  const { toast } = useToast();
  const { user } = useAuth();
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter airdrops based on search, category, and difficulty
  const filteredAirdrops = airdrops.filter((airdrop) => {
    const matchesSearch = airdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         airdrop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || airdrop.category === category;
    const matchesDifficulty = difficulty === "all" || airdrop.difficulty === difficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Extract unique categories for filter
  const categories = ["all", ...Array.from(new Set(airdrops.map(airdrop => airdrop.category)))];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  // Stats for the dashboard
  const completedCount = airdrops.filter(airdrop => airdrop.isCompleted).length;
  const progressPercentage = (completedCount / airdrops.length) * 100;

  // Handle toggling airdrop completion
  const handleToggleComplete = (id: string) => {
    toggleCompleted(id);
    const airdrop = airdrops.find(a => a.id === id);
    
    toast({
      title: airdrop?.isCompleted ? "Airdrop marked as incomplete" : "Airdrop marked as complete",
      description: `You've updated the status of ${airdrop?.name}`,
    });
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Airdrops Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Track and complete airdrops to maximize your rewards
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Airdrops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{airdrops.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{airdrops.length - completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Category: {category === "all" ? "All" : category}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((cat) => (
                <DropdownMenuItem 
                  key={cat} 
                  onClick={() => setCategory(cat)}
                  className="capitalize"
                >
                  {cat === "all" ? "All Categories" : cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Difficulty: {difficulty === "all" ? "All" : difficulty}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {difficulties.map((diff) => (
                <DropdownMenuItem key={diff} onClick={() => setDifficulty(diff)}>
                  {diff === "all" ? "All Difficulties" : diff}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative w-full sm:w-64 md:w-80">
          <input
            type="text"
            placeholder="Search airdrops..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Airdrops List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Airdrops</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AirdropsList 
            airdrops={filteredAirdrops} 
            handleToggleComplete={handleToggleComplete} 
          />
        </TabsContent>

        <TabsContent value="completed">
          <AirdropsList 
            airdrops={filteredAirdrops.filter(a => a.isCompleted)} 
            handleToggleComplete={handleToggleComplete} 
          />
        </TabsContent>

        <TabsContent value="pending">
          <AirdropsList 
            airdrops={filteredAirdrops.filter(a => !a.isCompleted)} 
            handleToggleComplete={handleToggleComplete} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

type AirdropsListProps = {
  airdrops: any[];
  handleToggleComplete: (id: string) => void;
};

const AirdropsList = ({ airdrops, handleToggleComplete }: AirdropsListProps) => {
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

  if (airdrops.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No airdrops found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {airdrops.map((airdrop) => (
        <motion.div key={airdrop.id} variants={item}>
          <Card className={`transition-all duration-300 overflow-hidden ${airdrop.isCompleted ? 'border-green-500 bg-green-50/10' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    <img 
                      src={airdrop.logo} 
                      alt={airdrop.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => (e.currentTarget.src = "https://cryptologos.cc/logos/placeholder.png")}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{airdrop.name}</CardTitle>
                    <CardDescription className="text-xs">{airdrop.category}</CardDescription>
                  </div>
                </div>
                <Badge variant={airdrop.difficulty === "Easy" ? "outline" : airdrop.difficulty === "Medium" ? "secondary" : "destructive"}>
                  {airdrop.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{airdrop.description}</p>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Est. Value:</div>
                <div className="text-primary font-semibold">{airdrop.estimatedValue}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Status:</div>
                <div className={`font-semibold ${airdrop.isCompleted ? 'text-green-500' : 'text-amber-500'}`}>
                  {airdrop.isCompleted ? 'Completed' : 'Pending'}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button 
                  variant={airdrop.isCompleted ? "outline" : "default"}
                  className={`flex-1 ${airdrop.isCompleted ? 'border-green-500 text-green-500 hover:bg-green-50' : ''}`}
                  onClick={() => handleToggleComplete(airdrop.id)}
                >
                  {airdrop.isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    'Mark as Complete'
                  )}
                </Button>
                
                <Button variant="outline" className="flex-1" onClick={() => window.open(airdrop.link, '_blank')}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Airdrops;
