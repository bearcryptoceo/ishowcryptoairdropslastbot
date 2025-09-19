
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTestnets } from "@/contexts/TestnetsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Filter,
  Pin,
  PinOff,
  Plus,
  PlusCircle,
  Search,
  Trash2,
  Rocket,
  Calendar,
  BarChart
} from "lucide-react";
import { format } from "date-fns";
import { Testnet } from "@/contexts/TestnetsContext";

const Testnets = () => {
  const { testnets, categories, toggleCompleted, togglePinned, addTestnet, updateTestnet, deleteTestnet, addCategory } = useTestnets();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [currentTestnet, setCurrentTestnet] = useState<Testnet | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [newCategory, setNewCategory] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [formValues, setFormValues] = useState<Partial<Testnet>>({
    name: "",
    description: "",
    category: "",
    link: "",
    logo: "",
    estimatedReward: "",
    difficulty: "Medium",
    tasks: [],
    startDate: "",
    endDate: "",
    isActive: true,
    isPinned: false
  });

  // Filter testnets based on search, category, and difficulty
  const filteredTestnets = testnets.filter((testnet) => {
    const matchesSearch = testnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          testnet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || testnet.category === category;
    const matchesDifficulty = difficulty === "all" || testnet.difficulty === difficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort testnets with pinned ones first, then by active status
  const sortedTestnets = [...filteredTestnets].sort((a, b) => {
    // First sort by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by active status
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    
    return 0;
  });

  // Handler for opening the add/edit dialog
  const handleOpenDialog = (testnet?: Testnet) => {
    if (testnet) {
      setCurrentTestnet(testnet);
      setFormValues({
        name: testnet.name,
        description: testnet.description,
        category: testnet.category,
        link: testnet.link,
        logo: testnet.logo,
        estimatedReward: testnet.estimatedReward,
        difficulty: testnet.difficulty,
        tasks: [...testnet.tasks],
        startDate: testnet.startDate,
        endDate: testnet.endDate,
        isActive: testnet.isActive,
        isPinned: testnet.isPinned
      });
    } else {
      setCurrentTestnet(null);
      setFormValues({
        name: "",
        description: "",
        category: "",
        link: "",
        logo: "",
        estimatedReward: "",
        difficulty: "Medium",
        tasks: [],
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        isActive: true,
        isPinned: false
      });
    }
    setTaskInput("");
    setIsDialogOpen(true);
  };

  // Handler for adding a task to the form
  const handleAddTask = () => {
    if (taskInput.trim()) {
      setFormValues({
        ...formValues,
        tasks: [...(formValues.tasks || []), taskInput.trim()]
      });
      setTaskInput("");
    }
  };

  // Handler for removing a task from the form
  const handleRemoveTask = (index: number) => {
    const newTasks = [...(formValues.tasks || [])];
    newTasks.splice(index, 1);
    setFormValues({
      ...formValues,
      tasks: newTasks
    });
  };

  // Handler for submitting the testnet form
  const handleSubmitTestnet = () => {
    if (!formValues.name || !formValues.description || !formValues.category || !formValues.link) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    const testnetData: Testnet = {
      id: currentTestnet ? currentTestnet.id : `testnet-${Date.now()}`,
      name: formValues.name || "",
      description: formValues.description || "",
      category: formValues.category || "",
      link: formValues.link || "",
      logo: formValues.logo || "https://cryptologos.cc/logos/placeholder.png",
      estimatedReward: formValues.estimatedReward || "$0",
      difficulty: formValues.difficulty as "Easy" | "Medium" | "Hard" || "Medium",
      tasks: formValues.tasks || [],
      startDate: formValues.startDate || format(new Date(), "yyyy-MM-dd"),
      endDate: formValues.endDate || format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      isActive: formValues.isActive !== undefined ? formValues.isActive : true,
      isPinned: formValues.isPinned || false,
      isCompleted: currentTestnet ? currentTestnet.isCompleted : false
    };

    if (currentTestnet) {
      // Update existing testnet
      updateTestnet(testnetData);
      toast({
        title: "Testnet Updated",
        description: `${testnetData.name} has been updated successfully`
      });
    } else {
      // Add new testnet
      addTestnet(testnetData);
      toast({
        title: "Testnet Added",
        description: `${testnetData.name} has been added successfully`
      });
    }
    setIsDialogOpen(false);
  };

  // Handler for adding a new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    addCategory(newCategory.trim());
    toast({
      title: "Category Added",
      description: `${newCategory} has been added to categories`
    });
    setNewCategory("");
    setIsNewCategoryDialogOpen(false);
  };

  // Handler for toggling testnet completion
  const handleToggleCompleted = (id: string) => {
    toggleCompleted(id);
    const testnet = testnets.find(t => t.id === id);
    toast({
      title: testnet?.isCompleted ? "Marked as Incomplete" : "Marked as Completed",
      description: `${testnet?.name} has been ${testnet?.isCompleted ? "unmarked" : "marked"} as completed`
    });
  };

  // Handler for toggling the pin status
  const handleTogglePin = (id: string) => {
    togglePinned(id);
    const testnet = testnets.find(t => t.id === id);
    toast({
      title: testnet?.isPinned ? "Unpinned" : "Pinned",
      description: `${testnet?.name} has been ${testnet?.isPinned ? "unpinned" : "pinned"}`
    });
  };

  // Handler for deleting a testnet
  const handleDeleteTestnet = (id: string) => {
    deleteTestnet(id);
    toast({
      title: "Testnet Deleted",
      description: "The testnet has been removed from your list"
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

  // Stats
  const activeCount = testnets.filter(t => t.isActive).length;
  const completedCount = testnets.filter(t => t.isCompleted).length;
  const totalCount = testnets.length;

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testnets Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track and participate in blockchain testnets
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Testnet
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsNewCategoryDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Testnets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Testnets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
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
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search testnets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={difficulty}
            onValueChange={setDifficulty}
          >
            <SelectTrigger>
              <BarChart className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Testnets Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {sortedTestnets.length > 0 ? (
          sortedTestnets.map((testnet) => (
            <motion.div key={testnet.id} variants={item}>
              <Card className={`h-full hover:shadow-md transition-shadow ${
                testnet.isPinned ? 'border-primary' : 
                !testnet.isActive ? 'border-gray-500 opacity-70' : 
                testnet.isCompleted ? 'border-green-500' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        <img 
                          src={testnet.logo} 
                          alt={testnet.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.src = "https://cryptologos.cc/logos/placeholder.png")}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {testnet.name}
                          {testnet.isPinned && (
                            <Pin className="h-3 w-3 text-primary" />
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge 
                            variant={
                              testnet.difficulty === "Easy" ? "outline" : 
                              testnet.difficulty === "Medium" ? "secondary" : 
                              "destructive"
                            }
                          >
                            {testnet.difficulty}
                          </Badge>
                          <Badge 
                            variant={testnet.isActive ? "default" : "outline"}
                            className={testnet.isActive ? "bg-green-500" : ""}
                          >
                            {testnet.isActive ? "Active" : "Ended"}
                          </Badge>
                          {testnet.isCompleted && (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{testnet.description}</CardDescription>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex justify-between">
                      <span>Category:</span>
                      <span className="text-muted-foreground">{testnet.category}</span>
                    </div>
                    
                    <div className="text-sm font-medium flex justify-between">
                      <span>Est. Reward:</span>
                      <span className="text-primary font-semibold">{testnet.estimatedReward}</span>
                    </div>
                    
                    <div className="text-sm font-medium flex justify-between">
                      <span>Timeline:</span>
                      <span className="text-muted-foreground">
                        {new Date(testnet.startDate).toLocaleDateString()} - {" "}
                        {new Date(testnet.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Required Tasks:</div>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      {testnet.tasks.slice(0, 3).map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                      {testnet.tasks.length > 3 && (
                        <li className="text-muted-foreground">
                          +{testnet.tasks.length - 3} more tasks
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    variant={testnet.isCompleted ? "outline" : "default"}
                    className={testnet.isCompleted ? "border-green-500 text-green-500" : ""}
                    onClick={() => handleToggleCompleted(testnet.id)}
                  >
                    {testnet.isCompleted ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.open(testnet.link, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Site
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => handleTogglePin(testnet.id)}
                  >
                    {testnet.isPinned ? (
                      <>
                        <PinOff className="mr-2 h-4 w-4" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="mr-2 h-4 w-4" />
                        Pin
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={() => handleOpenDialog(testnet)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    className="col-span-2"
                    onClick={() => handleDeleteTestnet(testnet.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <Rocket className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No testnets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter, or add a new testnet
            </p>
            <Button onClick={() => handleOpenDialog()} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Testnet
            </Button>
          </div>
        )}
      </motion.div>
      
      {/* Add/Edit Testnet Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentTestnet ? "Edit Testnet" : "Add New Testnet"}</DialogTitle>
            <DialogDescription>
              {currentTestnet 
                ? "Update the details for this testnet" 
                : "Add a new testnet to track your participation"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Testnet Name</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                placeholder="e.g., Arbitrum Nova"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formValues.description}
                onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                placeholder="Brief description of the testnet"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formValues.category}
                  onValueChange={(value) => setFormValues({...formValues, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formValues.difficulty}
                  onValueChange={(value) => setFormValues({...formValues, difficulty: value as "Easy" | "Medium" | "Hard"})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link">Website Link</Label>
              <Input
                id="link"
                value={formValues.link}
                onChange={(e) => setFormValues({...formValues, link: e.target.value})}
                placeholder="https://"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formValues.logo}
                onChange={(e) => setFormValues({...formValues, logo: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="estimatedReward">Estimated Reward</Label>
              <Input
                id="estimatedReward"
                value={formValues.estimatedReward}
                onChange={(e) => setFormValues({...formValues, estimatedReward: e.target.value})}
                placeholder="e.g., $100-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formValues.startDate}
                  onChange={(e) => setFormValues({...formValues, startDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formValues.endDate}
                  onChange={(e) => setFormValues({...formValues, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Tasks</Label>
              <div className="flex gap-2">
                <Input
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Add a required task"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTask}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 space-y-2">
                {formValues.tasks && formValues.tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/30 p-2 rounded">
                    <span className="text-sm">{task}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveTask(index)}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formValues.isActive}
                onChange={(e) => setFormValues({...formValues, isActive: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="isActive">Testnet is Active</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={formValues.isPinned}
                onChange={(e) => setFormValues({...formValues, isPinned: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="isPinned">Pin to Top</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTestnet}>
              {currentTestnet ? "Save Changes" : "Add Testnet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add New Category Dialog */}
      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing your testnets
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newCategory">Category Name</Label>
            <Input
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)}>
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

export default Testnets;
