import { useState } from "react";
import { motion } from "framer-motion";
import { Airdrop } from "@/data/airdrops";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAirdrops } from "@/contexts/AirdropsContext";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Edit, ExternalLink, MoreVertical, Plus, Trash2 } from "lucide-react";

interface AirdropItemProps {
  airdrop: Airdrop;
}

const AirdropItem = ({ airdrop }: AirdropItemProps) => {
  const { toggleCompleted, togglePinned, updateAirdrop, deleteAirdrop, categories } = useAirdrops();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: airdrop.name,
    description: airdrop.description,
    category: airdrop.category,
    link: airdrop.link,
    logo: airdrop.logo,
    estimatedValue: airdrop.estimatedValue,
    difficulty: airdrop.difficulty,
    tasks: [...airdrop.tasks],
    launchDate: airdrop.launchDate,
  });

  const handleEditSubmit = () => {
    const updatedAirdrop = {
      ...airdrop,
      name: formValues.name,
      description: formValues.description,
      category: formValues.category,
      link: formValues.link,
      logo: formValues.logo,
      estimatedValue: formValues.estimatedValue,
      difficulty: formValues.difficulty,
      tasks: formValues.tasks.filter(task => task.trim() !== ""),
      launchDate: formValues.launchDate,
    };

    updateAirdrop(updatedAirdrop);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Airdrop updated",
      description: `${formValues.name} has been updated successfully`,
    });
  };

  const handleDeleteConfirm = () => {
    deleteAirdrop(airdrop.id);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Airdrop deleted",
      description: `${airdrop.name} has been deleted successfully`,
    });
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

  return (
    <motion.div variants={item}>
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
            <div className="flex items-center gap-2">
              <Badge variant={airdrop.difficulty === "Easy" ? "outline" : airdrop.difficulty === "Medium" ? "secondary" : "destructive"}>
                {airdrop.difficulty}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button 
              variant={airdrop.isCompleted ? "outline" : "default"}
              className={`flex-1 ${airdrop.isCompleted ? 'border-green-500 text-green-500 hover:bg-green-50' : ''}`}
              onClick={() => toggleCompleted(airdrop.id)}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Airdrop</DialogTitle>
            <DialogDescription>
              Update the details for this airdrop
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Update Airdrop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Airdrop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this airdrop? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AirdropItem;
