import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTools } from "@/contexts/ToolsContext";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Pin, ExternalLink, Plus, Search, Filter, Check, Pencil, X, PinOff } from "lucide-react";
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
  Calculator, 
  Wallet, 
  LineChart, 
  Coins, 
  BarChart3, 
  ArrowLeftRight,
  LayoutGrid,
  Shield,
  Zap,
  Wrench,
  Landmark
} from "lucide-react";
import { Tool } from "@/data/airdrops";

// Map of icon names to components
const iconMap: Record<string, React.ElementType> = {
  Calculator,
  Wallet,
  LineChart,
  Coins,
  BarChart3,
  ArrowLeftRight,
  LayoutGrid,
  Shield,
  Zap,
  Wrench,
  Landmark
};

const Tools = () => {
  const { tools, categories, toggleCompleted, togglePinned, addTool, updateTool, deleteTool, addCategory } = useTools();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [newCategory, setNewCategory] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    category: "",
    link: "",
    icon: "Calculator",
    comingSoon: false,
    isPinned: false
  });

  // Filter tools based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || tool.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Sort tools with pinned ones first
  const sortedTools = [...filteredTools].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  // Handler for opening the add/edit dialog
  const handleOpenDialog = (tool?: Tool) => {
    if (tool) {
      setCurrentTool(tool);
      setFormValues({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        link: tool.link,
        icon: tool.icon,
        comingSoon: tool.comingSoon || false,
        isPinned: tool.isPinned || false
      });
    } else {
      setCurrentTool(null);
      setFormValues({
        name: "",
        description: "",
        category: "",
        link: "",
        icon: "Calculator",
        comingSoon: false,
        isPinned: false
      });
    }
    setIsDialogOpen(true);
  };

  // Handler for submitting the tool form
  const handleSubmitTool = () => {
    if (!formValues.name || !formValues.description || !formValues.category || !formValues.link) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    if (currentTool) {
      // Update existing tool
      updateTool({
        ...currentTool,
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        link: formValues.link,
        icon: formValues.icon,
        comingSoon: formValues.comingSoon,
        isPinned: formValues.isPinned
      });
      toast({
        title: "Tool Updated",
        description: `${formValues.name} has been updated successfully`
      });
    } else {
      // Add new tool
      addTool({
        id: `tool-${Date.now()}`,
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        link: formValues.link,
        icon: formValues.icon,
        comingSoon: formValues.comingSoon,
        isPinned: formValues.isPinned
      });
      toast({
        title: "Tool Added",
        description: `${formValues.name} has been added successfully`
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

  // Handler for deleting a tool
  const handleDeleteTool = (id: string) => {
    deleteTool(id);
    toast({
      title: "Tool Deleted",
      description: "The tool has been removed from your list"
    });
  };

  // Handler for toggling the pin status
  const handleTogglePin = (id: string) => {
    togglePinned(id);
    const tool = tools.find(t => t.id === id);
    toast({
      title: tool?.isPinned ? "Unpinned" : "Pinned",
      description: `${tool?.name} has been ${tool?.isPinned ? "unpinned" : "pinned"}`
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crypto Tools</h1>
          <p className="text-muted-foreground mt-1">
            Useful tools to enhance your crypto experience
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tool
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
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1">
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger className="w-full">
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
        </div>
      </div>
      
      {/* Tools Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {sortedTools.length > 0 ? (
          sortedTools.map((tool) => {
            const IconComponent = iconMap[tool.icon] || Calculator;
            
            return (
              <motion.div key={tool.id} variants={item}>
                <Card className={`h-full hover:shadow-md transition-shadow ${tool.isPinned ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {tool.name}
                            {tool.isPinned && (
                              <Pin className="h-3 w-3 text-primary" />
                            )}
                          </CardTitle>
                          {tool.comingSoon && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge>{tool.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleOpenDialog(tool)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleTogglePin(tool.id)}
                      >
                        {tool.isPinned ? (
                          <>
                            <PinOff className="h-4 w-4 mr-1" />
                            Unpin
                          </>
                        ) : (
                          <>
                            <Pin className="h-4 w-4 mr-1" />
                            Pin
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteTool(tool.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => window.open(tool.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-lg font-medium">No tools found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter, or add a new tool
            </p>
            <Button onClick={() => handleOpenDialog()} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Tool
            </Button>
          </div>
        )}
      </motion.div>
      
      {/* Add/Edit Tool Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentTool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
            <DialogDescription>
              {currentTool 
                ? "Update the details for this tool" 
                : "Add a new tool to your collection"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                placeholder="Tool name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formValues.description}
                onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                placeholder="Brief description"
              />
            </div>
            
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
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={formValues.link}
                onChange={(e) => setFormValues({...formValues, link: e.target.value})}
                placeholder="https://"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formValues.icon}
                onValueChange={(value) => setFormValues({...formValues, icon: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconMap).map((iconName) => {
                    const IconComponent = iconMap[iconName];
                    return (
                      <SelectItem key={iconName} value={iconName} className="flex items-center">
                        <div className="flex items-center">
                          <IconComponent className="h-4 w-4 mr-2" />
                          {iconName}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="comingSoon"
                checked={formValues.comingSoon}
                onChange={(e) => setFormValues({...formValues, comingSoon: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="comingSoon">Mark as Coming Soon</Label>
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
            <Button onClick={handleSubmitTool}>
              {currentTool ? "Save Changes" : "Add Tool"}
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
              Create a new category for organizing your tools
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
      
      {/* Note at the bottom */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>Have a suggestion for a tool? Let us know!</p>
        <p>We're constantly adding new tools to help with your crypto journey.</p>
      </div>
    </div>
  );
};

export default Tools;
