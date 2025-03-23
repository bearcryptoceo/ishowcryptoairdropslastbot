
import { useState } from "react";
import { Airdrop } from "@/data/airdrops";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAirdrops } from "@/contexts/AirdropsContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Check, ExternalLink, MoreHorizontal, Pencil, Pin, PinOff, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AirdropItemProps {
  airdrop: Airdrop;
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800"
};

export function AirdropItem({ airdrop }: AirdropItemProps) {
  const { toggleCompleted, togglePinned, updateAirdrop, deleteAirdrop, categories } = useAirdrops();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedAirdrop, setEditedAirdrop] = useState<Airdrop>({ ...airdrop });

  const handleEditSave = () => {
    updateAirdrop(editedAirdrop);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Airdrop Updated",
      description: `${editedAirdrop.name} has been updated successfully.`
    });
  };

  const handleDeleteConfirm = () => {
    deleteAirdrop(airdrop.id);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Airdrop Deleted",
      description: `${airdrop.name} has been permanently removed.`
    });
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...editedAirdrop.tasks];
    updatedTasks[index] = value;
    setEditedAirdrop({ ...editedAirdrop, tasks: updatedTasks });
  };

  const addTask = () => {
    setEditedAirdrop({ 
      ...editedAirdrop, 
      tasks: [...editedAirdrop.tasks, "New task"] 
    });
  };

  const removeTask = (index: number) => {
    const updatedTasks = [...editedAirdrop.tasks];
    updatedTasks.splice(index, 1);
    setEditedAirdrop({ ...editedAirdrop, tasks: updatedTasks });
  };

  return (
    <>
      <Card className={`h-full ${airdrop.isPinned ? 'border-primary/50' : ''} ${airdrop.isCompleted ? 'bg-muted/30' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {airdrop.logo && (
                <div className="h-8 w-8 rounded-full overflow-hidden bg-background flex items-center justify-center">
                  <img 
                    src={airdrop.logo} 
                    alt={`${airdrop.name} logo`} 
                    className="h-6 w-6 object-contain" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{airdrop.name}</CardTitle>
                <CardDescription className="line-clamp-1">{airdrop.category}</CardDescription>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleCompleted(airdrop.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  {airdrop.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => togglePinned(airdrop.id)}>
                  {airdrop.isPinned ? (
                    <>
                      <PinOff className="mr-2 h-4 w-4" />
                      Unpin Airdrop
                    </>
                  ) : (
                    <>
                      <Pin className="mr-2 h-4 w-4" />
                      Pin Airdrop
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Airdrop
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-sm line-clamp-2 mb-3">{airdrop.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className={difficultyColors[airdrop.difficulty]}>
              {airdrop.difficulty}
            </Badge>
            <Badge variant="outline">
              Est. Value: {airdrop.estimatedValue}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {airdrop.launchDate === "TBD" ? "TBD" : "Launched"}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Required Tasks:</h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              {airdrop.tasks.slice(0, 3).map((task, index) => (
                <li key={index} className="line-clamp-1">{task}</li>
              ))}
              {airdrop.tasks.length > 3 && (
                <li className="text-muted-foreground">+{airdrop.tasks.length - 3} more tasks</li>
              )}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={airdrop.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
              Visit Project
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Airdrop</DialogTitle>
            <DialogDescription>
              Update the details for {airdrop.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={editedAirdrop.name} 
                onChange={(e) => setEditedAirdrop({...editedAirdrop, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={editedAirdrop.description}
                onChange={(e) => setEditedAirdrop({...editedAirdrop, description: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={editedAirdrop.category}
                onValueChange={(value) => setEditedAirdrop({...editedAirdrop, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link">Project Link</Label>
              <Input 
                id="link" 
                value={editedAirdrop.link}
                onChange={(e) => setEditedAirdrop({...editedAirdrop, link: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input 
                id="logo" 
                value={editedAirdrop.logo}
                onChange={(e) => setEditedAirdrop({...editedAirdrop, logo: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="estimatedValue">Estimated Value</Label>
              <Input 
                id="estimatedValue" 
                value={editedAirdrop.estimatedValue}
                onChange={(e) => setEditedAirdrop({...editedAirdrop, estimatedValue: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select 
                value={editedAirdrop.difficulty}
                onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setEditedAirdrop({...editedAirdrop, difficulty: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Tasks</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTask}>
                  Add Task
                </Button>
              </div>
              <div className="space-y-2">
                {editedAirdrop.tasks.map((task, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={task}
                      onChange={(e) => handleTaskChange(index, e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeTask(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Airdrop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {airdrop.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Airdrop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
