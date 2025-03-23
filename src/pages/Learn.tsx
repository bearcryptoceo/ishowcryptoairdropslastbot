
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, FileText, Plus, Rocket, Trash, Bookmark, PenSquare } from "lucide-react";

interface LearnResource {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
  link?: string;
}

const defaultCategories = [
  { id: "basics", name: "Blockchain Basics", icon: <BookOpen className="h-4 w-4" /> },
  { id: "defi", name: "DeFi", icon: <Rocket className="h-4 w-4" /> },
  { id: "guides", name: "Guides & Tutorials", icon: <FileText className="h-4 w-4" /> },
  { id: "investment", name: "Investment Strategies", icon: <Bookmark className="h-4 w-4" /> },
];

const placeholderImages = [
  "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1639322537174-8c5f156fd822?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
];

const Learn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basics");
  const [resources, setResources] = useState<LearnResource[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  
  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("basics");
  const [formLink, setFormLink] = useState("");

  // Load resources from localStorage
  useEffect(() => {
    const savedResources = localStorage.getItem("learn_resources");
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    }
  }, []);

  // Save resources to localStorage when they change
  useEffect(() => {
    localStorage.setItem("learn_resources", JSON.stringify(resources));
  }, [resources]);

  const getRandomImage = () => {
    return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
  };

  const handleAddResource = () => {
    if (!formTitle || !formDescription || !formContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newResource = {
      id: Date.now(),
      title: formTitle,
      description: formDescription,
      content: formContent,
      category: formCategory,
      author: user?.username || "Anonymous",
      createdAt: new Date().toISOString().split('T')[0],
      imageUrl: getRandomImage(),
      link: formLink || undefined
    };

    setResources([...resources, newResource]);
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Resource Added",
      description: "Your learning resource has been added successfully",
    });
  };

  const handleDeleteResource = (id: number) => {
    setResources(resources.filter(resource => resource.id !== id));
    
    toast({
      title: "Resource Deleted",
      description: "The learning resource has been removed",
    });
  };

  const handleClearAllResources = () => {
    setResources([]);
    setIsDeleteAllDialogOpen(false);
    
    toast({
      title: "All Resources Cleared",
      description: "All learning resources have been removed",
    });
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormContent("");
    setFormCategory("basics");
    setFormLink("");
  };

  // Filter resources by active category
  const filteredResources = resources.filter(resource => resource.category === activeTab);

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
          <p className="text-muted-foreground mt-1">
            Educational resources to help you master crypto and blockchain
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
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Learning Resource</DialogTitle>
                  <DialogDescription>
                    Create a new educational resource for the platform
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input
                      id="title"
                      placeholder="Enter title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Short Description</label>
                    <Textarea
                      id="description"
                      placeholder="Enter a brief description"
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">Main Content</label>
                    <Textarea
                      id="content"
                      placeholder="Enter the main content"
                      rows={6}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
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
                    <label htmlFor="link" className="text-sm font-medium">External Link (Optional)</label>
                    <Input
                      id="link"
                      placeholder="https://..."
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddResource}>
                    Add Resource
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="basics" value={activeTab} onValueChange={setActiveTab}>
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
            {filteredResources.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40 p-6">
                  <p className="text-muted-foreground">No resources available in this category yet.</p>
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
                      Add {category.name} Resource
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => (
                  <Card key={resource.id} className="overflow-hidden flex flex-col h-full">
                    <div className="aspect-video bg-muted overflow-hidden relative">
                      {resource.imageUrl && (
                        <img 
                          src={resource.imageUrl} 
                          alt={resource.title} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      {user?.isAdmin && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription className="flex justify-between items-center">
                        <span>By {resource.author}</span>
                        <span className="text-xs">{resource.createdAt}</span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm line-clamp-3">{resource.description}</p>
                    </CardContent>
                    
                    <CardFooter className="mt-auto">
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Read More
                      </Button>
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
            <DialogTitle>Clear All Resources</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all learning resources? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllResources}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Learn;
