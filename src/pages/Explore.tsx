import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  website: string;
  twitter?: string;
  discord?: string;
  logo?: string;
  tags: string[];
  createdAt: string;
  status: "active" | "upcoming" | "new";
  chains: string[];
}

const defaultCategories = [
  { id: "defi", name: "DeFi", icon: <Coins className="h-4 w-4" /> },
  { id: "nft", name: "NFTs", icon: <Database className="h-4 w-4" /> },
  { id: "dao", name: "DAOs", icon: <Users className="h-4 w-4" /> },
  { id: "layer2", name: "Layer 2", icon: <Zap className="h-4 w-4" /> },
];

const placeholderLogos = [
  "/placeholder.svg",
  "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025",
  "https://cryptologos.cc/logos/solana-sol-logo.png?v=025",
  "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=025",
  "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=025",
];

const Explore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("defi");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("defi");
  const [formWebsite, setFormWebsite] = useState("");
  const [formTwitter, setFormTwitter] = useState("");
  const [formDiscord, setFormDiscord] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formChains, setFormChains] = useState("");
  const [formStatus, setFormStatus] = useState("active");

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("explore_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    localStorage.setItem("explore_projects", JSON.stringify(projects));
  }, [projects]);

  const getRandomLogo = () => {
    return placeholderLogos[Math.floor(Math.random() * placeholderLogos.length)];
  };

  const handleAddProject = () => {
    if (!formName || !formDescription || !formWebsite) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      name: formName,
      description: formDescription,
      category: formCategory,
      website: formWebsite,
      twitter: formTwitter || undefined,
      discord: formDiscord || undefined,
      logo: getRandomLogo(),
      tags: formTags.split(",").map(tag => tag.trim()).filter(tag => tag),
      chains: formChains.split(",").map(chain => chain.trim()).filter(chain => chain),
      createdAt: new Date().toISOString().split('T')[0],
      status: formStatus as "active" | "upcoming" | "new",
    };

    setProjects([...projects, newProject]);
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Project Added",
      description: "The crypto project has been added successfully",
    });
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
    
    toast({
      title: "Project Deleted",
      description: "The project has been removed",
    });
  };

  const handleClearAllProjects = () => {
    setProjects([]);
    setIsDeleteAllDialogOpen(false);
    
    toast({
      title: "All Projects Cleared",
      description: "All crypto projects have been removed",
    });
  };

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormCategory("defi");
    setFormWebsite("");
    setFormTwitter("");
    setFormDiscord("");
    setFormTags("");
    setFormChains("");
    setFormStatus("active");
  };

  // Filter projects by active category
  const filteredProjects = projects.filter(project => project.category === activeTab);

  const statusBadgeColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    upcoming: "bg-yellow-100 text-yellow-800",
    new: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
          <p className="text-muted-foreground mt-1">
            Discover and track the most promising crypto projects
          </p>
        </div>
        
        <div className="flex gap-2">
          {user?.isAdmin && (
            <Button variant="destructive" onClick={() => setIsDeleteAllDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
          
          {user?.isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Crypto Project</DialogTitle>
                  <DialogDescription>
                    Add a new project to the explore section
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Project Name*</label>
                    <Input
                      id="name"
                      placeholder="Enter project name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description*</label>
                    <Textarea
                      id="description"
                      placeholder="Enter project description"
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category*</label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {defaultCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium">Website URL*</label>
                    <Input
                      id="website"
                      placeholder="https://..."
                      value={formWebsite}
                      onChange={(e) => setFormWebsite(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="twitter" className="text-sm font-medium">Twitter (Optional)</label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/..."
                      value={formTwitter}
                      onChange={(e) => setFormTwitter(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="discord" className="text-sm font-medium">Discord (Optional)</label>
                    <Input
                      id="discord"
                      placeholder="https://discord.gg/..."
                      value={formDiscord}
                      onChange={(e) => setFormDiscord(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="tags" className="text-sm font-medium">Tags (Comma separated)</label>
                    <Input
                      id="tags"
                      placeholder="yield farming, dex, lending..."
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="chains" className="text-sm font-medium">Chains (Comma separated)</label>
                    <Input
                      id="chains"
                      placeholder="Ethereum, Solana, Arbitrum..."
                      value={formChains}
                      onChange={(e) => setFormChains(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="new">New</option>
                    </select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProject}>
                    Add Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="defi" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          {defaultCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center">
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {defaultCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            {filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40 p-6">
                  <p className="text-muted-foreground">No projects available in this category yet.</p>
                  {user?.isAdmin && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setFormCategory(category.id);
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add {category.name} Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <Card key={project.id} className="overflow-hidden flex flex-col h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {project.logo && (
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              <img 
                                src={project.logo} 
                                alt={`${project.name} logo`}
                                className="h-8 w-8 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {project.name}
                              <Badge 
                                variant="outline" 
                                className={statusBadgeColors[project.status]}
                              >
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {project.chains.length > 0 ? project.chains.join(", ") : "Multiple Chains"}
                            </CardDescription>
                          </div>
                        </div>
                        {user?.isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      <p className="text-sm line-clamp-3 mb-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col space-y-2 mt-auto pt-0">
                      <Button variant="outline" className="w-full" asChild>
                        <a 
                          href={project.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                      
                      <div className="flex w-full gap-2">
                        {project.twitter && (
                          <Button variant="ghost" size="sm" className="flex-1" asChild>
                            <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                              Twitter
                            </a>
                          </Button>
                        )}
                        
                        {project.discord && (
                          <Button variant="ghost" size="sm" className="flex-1" asChild>
                            <a href={project.discord} target="_blank" rel="noopener noreferrer">
                              Discord
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Delete All Confirmation Dialog */}
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Projects</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all crypto projects? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllProjects}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Explore;
