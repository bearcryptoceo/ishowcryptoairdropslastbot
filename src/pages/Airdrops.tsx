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
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  CheckCircle,
  ExternalLink,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Airdrop } from "@/data/airdrops";
import { AirdropItem } from "@/components/airdrops/AirdropItem";

const Airdrops = () => {
  const { airdrops, toggleCompleted, categories, addCategory, updateAirdrop, deleteAirdrop, addAirdrop, clearAllAirdrops } = useAirdrops();
  const { toast } = useToast();
  const { user } = useAuth();
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAirdrop, setCurrentAirdrop] = useState<Airdrop | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    category: "",
    link: "",
    logo: "",
    estimatedValue: "",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    tasks: [] as string[],
    launchDate: "",
  });

  const isAdmin = user?.isAdmin;

  const filteredAirdrops = airdrops.filter((airdrop) => {
    const matchesSearch = airdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         airdrop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || airdrop.category === category;
    const matchesDifficulty = difficulty === "all" || airdrop.difficulty === difficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const uniqueCategories = ["all", ...Array.from(new Set(airdrops.map(airdrop => airdrop.category)))];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  const completedCount = airdrops.filter(airdrop => airdrop.isCompleted).length;
  const progressPercentage = airdrops.length > 0 ? (completedCount / airdrops.length) * 100 : 0;
  
  const handleAddAirdrop = () => {
    setCurrentAirdrop(null);
    setFormValues({
      name: "",
      description: "",
      category: categories[0] || "",
      link: "",
      logo: "https://cryptologos.cc/logos/placeholder.png",
      estimatedValue: "$100-500",
      difficulty: "Easy",
      tasks: [""],
      launchDate: new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleSubmitAirdrop = () => {
    if (!formValues.name || !formValues.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (currentAirdrop) {
      updateAirdrop({
        ...currentAirdrop,
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        link: formValues.link,
        logo: formValues.logo,
        estimatedValue: formValues.estimatedValue,
        difficulty: formValues.difficulty,
        tasks: formValues.tasks.filter(task => task.trim() !== ""),
        launchDate: formValues.launchDate,
      });
      toast({
        title: "Airdrop updated",
        description: `${formValues.name} has been updated successfully`,
      });
    } else {
      addAirdrop({
        id: `airdrop-${Date.now()}`,
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        link: formValues.link,
        logo: formValues.logo,
        estimatedValue: formValues.estimatedValue,
        difficulty: formValues.difficulty,
        tasks: formValues.tasks.filter(task => task.trim() !== ""),
        launchDate: formValues.launchDate,
        isCompleted: false,
        isPinned: false,
      });
      toast({
        title: "Airdrop added",
        description: `${formValues.name} has been added successfully`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      toast({
        title: "Category added",
        description: `New category "${newCategory}" has been added`,
      });
      setNewCategory("");
      setShowCategoryDialog(false);
    }
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...formValues.tasks];
    updatedTasks[index] = value;
    setFormValues({ ...formValues, tasks: updatedTasks });
  };

  const addTaskInput = () => {
    setFormValues({ ...formValues, tasks: [...formValues.tasks, ""] });
  };

  const removeTaskInput = (index: number) => {
    const updatedTasks = formValues.tasks.filter((_, i) => i !== index);
    setFormValues({ ...formValues, tasks: updatedTasks });
  };

  const handleClearAllAirdrops = () => {
    if (confirm("Are you sure you want to delete all airdrops? This action cannot be undone.")) {
      clearAllAirdrops();
      toast({
        title: "All airdrops deleted",
        description: "All pre-added airdrops have been removed",
      });
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Airdrops Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track and complete airdrops to maximize your rewards
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAddAirdrop}>
            <Plus className="mr-2 h-4 w-4" />
            Add Airdrop
          </Button>
          <Button variant="outline" onClick={() => setShowCategoryDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
          {isAdmin && (
            <Button variant="destructive" onClick={handleClearAllAirdrops}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

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
              {uniqueCategories.map((cat) => (
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Airdrops</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="ethereum">My Ethereum 2.0 Airdrop</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AirdropsList 
            airdrops={filteredAirdrops} 
            container={container}
            item={item}
          />
        </TabsContent>

        <TabsContent value="completed">
          <AirdropsList 
            airdrops={filteredAirdrops.filter(a => a.isCompleted)} 
            container={container}
            item={item}
          />
        </TabsContent>

        <TabsContent value="pending">
          <AirdropsList 
            airdrops={filteredAirdrops.filter(a => !a.isCompleted)} 
            container={container}
            item={item}
          />
        </TabsContent>
        
        <TabsContent value="ethereum">
          <AirdropsList 
            airdrops={filteredAirdrops.filter(a => a.category === "My Ethereum 2.0 Airdrop")}
            container={container}
            item={item}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentAirdrop ? "Edit Airdrop" : "Add New Airdrop"}</DialogTitle>
            <DialogDescription>
              {currentAirdrop 
                ? "Update the details for this airdrop" 
                : "Fill in the details to add a new airdrop"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                placeholder="Airdrop name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formValues.description}
                onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                placeholder="Brief description of the airdrop"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={formValues.category}
                onChange={(e) => setFormValues({...formValues, category: e.target.value})}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value</Label>
                <Input
                  id="estimatedValue"
                  value={formValues.estimatedValue}
                  onChange={(e) => setFormValues({...formValues, estimatedValue: e.target.value})}
                  placeholder="$100-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={formValues.difficulty}
                  onChange={(e) => setFormValues({...formValues, difficulty: e.target.value as "Easy" | "Medium" | "Hard"})}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link">Website Link</Label>
              <Input
                id="link"
                type="url"
                value={formValues.link}
                onChange={(e) => setFormValues({...formValues, link: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formValues.logo}
                onChange={(e) => setFormValues({...formValues, logo: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="launchDate">Launch Date</Label>
              <Input
                id="launchDate"
                type="date"
                value={formValues.launchDate}
                onChange={(e) => setFormValues({...formValues, launchDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Tasks</Label>
                <Button type="button" size="sm" variant="outline" onClick={addTaskInput}>
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              
              {formValues.tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    onClick={() => removeTaskInput(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAirdrop}>
              {currentAirdrop ? "Update Airdrop" : "Add Airdrop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing airdrops
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type AirdropsListProps = {
  airdrops: Airdrop[];
  container: any;
  item: any;
};

const AirdropsList = ({ airdrops, container, item }: AirdropsListProps) => {
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
        <AirdropItem key={airdrop.id} airdrop={airdrop} />
      ))}
    </motion.div>
  );
};

export default Airdrops;
