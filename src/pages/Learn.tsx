
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Clock, 
  ArrowRight,
  BookMarked,
  Tag,
  Video
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Learning resources data
const learningResources = [
  {
    id: "learn-1",
    title: "Introduction to Blockchain Technology",
    description: "Learn the fundamentals of blockchain technology, including how it works and why it matters.",
    category: "Blockchain",
    readTime: "10 mins",
    authorName: "Crypto Academy",
    date: "2023-09-15",
    imageUrl: "https://images.unsplash.com/photo-1639322537231-2f206e06af84?q=80&w=1000",
    link: "https://example.com/blockchain-intro",
    isBookmarked: false,
  },
  {
    id: "learn-2",
    title: "Understanding Crypto Wallets",
    description: "A comprehensive guide to different types of cryptocurrency wallets and how to keep your assets secure.",
    category: "Security",
    readTime: "15 mins",
    authorName: "Wallet Expert",
    date: "2023-10-05",
    imageUrl: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?q=80&w=1000",
    link: "https://example.com/crypto-wallets",
    isBookmarked: false,
  },
  {
    id: "learn-3",
    title: "DeFi Explained: Decentralized Finance",
    description: "Explore the world of DeFi and learn how it's changing traditional financial systems.",
    category: "DeFi",
    readTime: "20 mins",
    authorName: "DeFi Explorer",
    date: "2023-11-12",
    imageUrl: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=1000",
    link: "https://example.com/defi-explained",
    isBookmarked: true,
  },
  {
    id: "learn-4",
    title: "NFTs: The Complete Guide",
    description: "Everything you need to know about Non-Fungible Tokens and the digital art revolution.",
    category: "NFTs",
    readTime: "18 mins",
    authorName: "NFT Enthusiast",
    date: "2023-12-03",
    imageUrl: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=1000",
    link: "https://example.com/nft-guide",
    isBookmarked: false,
  },
  {
    id: "learn-5",
    title: "Layer 2 Solutions Explained",
    description: "Deep dive into Layer 2 scaling solutions and how they're addressing blockchain scalability issues.",
    category: "Scaling",
    readTime: "25 mins",
    authorName: "Crypto Researcher",
    date: "2024-01-20",
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1000",
    link: "https://example.com/layer2-solutions",
    isBookmarked: true,
  },
];

const Learn = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState(learningResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];

  // Toggle bookmark for a resource
  const toggleBookmark = (id: string) => {
    setResources(resources.map(resource => 
      resource.id === id 
        ? { ...resource, isBookmarked: !resource.isBookmarked } 
        : resource
    ));
    
    const resource = resources.find(r => r.id === id);
    toast({
      title: resource?.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `"${resource?.title}" has been ${resource?.isBookmarked ? "removed from" : "added to"} your bookmarks.`,
      duration: 3000,
    });
  };

  // Filter resources based on search and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
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
            <BookOpen className="mr-3 h-8 w-8 text-primary" />
            Learn Crypto
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover helpful resources to enhance your crypto knowledge
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Resources Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  toggleBookmark={toggleBookmark} 
                  variants={item}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="bookmarked">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredResources.filter(r => r.isBookmarked).length > 0 ? (
              filteredResources
                .filter(r => r.isBookmarked)
                .map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    toggleBookmark={toggleBookmark} 
                    variants={item}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookMarked className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No bookmarked resources</h3>
                <p className="text-muted-foreground">
                  Bookmark resources to save them for later
                </p>
              </div>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="articles">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Articles coming soon</h3>
            <p className="text-muted-foreground">
              We're working on adding more article content
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="text-center py-12">
            <Video className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Video tutorials coming soon</h3>
            <p className="text-muted-foreground">
              Check back later for video content
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Resource card component
const ResourceCard = ({ resource, toggleBookmark, variants }: any) => {
  return (
    <motion.div variants={variants}>
      <Card className="h-full overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={resource.imageUrl} 
            alt={resource.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000";
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => toggleBookmark(resource.id)}
          >
            {resource.isBookmarked ? (
              <BookMarked className="h-5 w-5 text-primary fill-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
          <Badge className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm">
            {resource.category}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl line-clamp-2">{resource.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {resource.readTime} read
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <CardDescription className="line-clamp-3">
            {resource.description}
          </CardDescription>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            By {resource.authorName}
          </div>
          <Button size="sm" onClick={() => window.open(resource.link, '_blank')}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Learn;
