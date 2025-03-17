
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Search, 
  ExternalLink, 
  Star, 
  TrendingUp,
  Filter,
  ArrowUpDown,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Example project data
const cryptoProjects = [
  {
    id: "project-1",
    name: "Ethereum",
    description: "A decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference.",
    category: "Layer 1",
    website: "https://ethereum.org",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    rating: 4.9,
    trendingRank: 1,
  },
  {
    id: "project-2",
    name: "Solana",
    description: "A high-performance blockchain supporting builders around the world creating crypto apps that scale.",
    category: "Layer 1",
    website: "https://solana.com",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    rating: 4.7,
    trendingRank: 2,
  },
  {
    id: "project-3",
    name: "Polygon",
    description: "A protocol and a framework for building and connecting Ethereum-compatible blockchain networks.",
    category: "Layer 2",
    website: "https://polygon.technology",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    rating: 4.6,
    trendingRank: 3,
  },
  {
    id: "project-4",
    name: "Chainlink",
    description: "A decentralized oracle network that enables smart contracts to securely access off-chain data feeds.",
    category: "Oracle",
    website: "https://chain.link",
    logo: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    rating: 4.5,
    trendingRank: 4,
  },
];

const Explore = () => {
  const [projects, setProjects] = useState(cryptoProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"trending" | "rating">("trending");

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "trending") {
        return a.trendingRank - b.trendingRank;
      }
      return b.rating - a.rating;
    });

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Compass className="mr-3 h-8 w-8 text-primary" />
            Explore Crypto Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and learn about various crypto projects
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Category: {selectedCategory}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort by: {sortBy === "trending" ? "Trending" : "Rating"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("trending")}>
                Trending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("rating")}>
                Rating
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <motion.div key={project.id} variants={item}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        <img 
                          src={project.logo} 
                          alt={project.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://cryptologos.cc/logos/placeholder.png";
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <Badge>{project.category}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 font-medium">{project.rating}</span>
                      </div>
                      {sortBy === "trending" && (
                        <div className="flex items-center text-primary text-sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          #{project.trendingRank}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full"
                    onClick={() => window.open(project.website, '_blank')}
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Compass className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Explore;
