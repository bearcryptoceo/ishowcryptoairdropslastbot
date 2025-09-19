
import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  ExternalLink,
  Link as LinkIcon,
  Pin,
  PinOff,
  Plus,
  Star,
  Trash2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AirdropRanking, Airdrop } from "@/contexts/AirdropsContext";

const AirdropRankings = () => {
  const { airdrops, rankings, addRanking, updateRanking, deleteRanking, addAirdrop, clearPreAddedRankings } = useAirdrops();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAirdropDialogOpen, setIsAirdropDialogOpen] = useState(false);
  const [currentRanking, setCurrentRanking] = useState<AirdropRanking | null>(null);
  const [formValues, setFormValues] = useState({
    airdropId: "",
    fundingRating: 3,
    popularityRating: 3,
    potentialValue: "",
    notes: "",
    telegramLink: "",
    rank: 0,
    isPinned: false,
  });
  const [airdropFormValues, setAirdropFormValues] = useState({
    name: "",
    description: "",
    category: "",
    link: "",
    logo: "https://cryptologos.cc/logos/placeholder.png",
    estimatedValue: "$100-500",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    tasks: [""] as string[],
    launchDate: new Date().toISOString().split('T')[0],
  });

  // Check if user is admin - updated to match the specification
  const isAdmin = user?.email === "malickirfan00@gmail.com" && user?.username === "UmarCryptospace";

  // Get rankings with airdrop details and sort by pinned and rank
  const rankingsWithDetails = rankings
    .map(ranking => {
      const airdrop = airdrops.find(a => a.id === ranking.airdropId);
      return {
        ...ranking,
        airdropName: airdrop?.name || "Unknown",
        airdropLogo: airdrop?.logo || "",
        airdropCategory: airdrop?.category || "Unknown",
        telegramLink: ranking.telegramLink || "",
        rank: ranking.rank || 0,
        isPinned: ranking.isPinned || false,
      };
    })
    .sort((a, b) => {
      // First sort by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by rank (lower number = higher rank)
      return (a.rank || 999) - (b.rank || 999);
    });

  // Handler for opening the edit dialog
  const handleEditRanking = (ranking: AirdropRanking) => {
    setCurrentRanking(ranking);
    setFormValues({
      airdropId: ranking.airdropId,
      fundingRating: ranking.fundingRating,
      popularityRating: ranking.popularityRating,
      potentialValue: ranking.potentialValue,
      notes: ranking.notes,
      telegramLink: ranking.telegramLink || "",
      rank: ranking.rank || 0,
      isPinned: ranking.isPinned || false,
    });
    setIsDialogOpen(true);
  };

  // Handler for opening the add dialog
  const handleAddRanking = () => {
    setCurrentRanking(null);
    setFormValues({
      airdropId: "",
      fundingRating: 3,
      popularityRating: 3,
      potentialValue: "",
      notes: "",
      telegramLink: "",
      rank: 0,
      isPinned: false,
    });
    setIsDialogOpen(true);
  };

  // Handler for opening create new airdrop dialog
  const handleCreateNewAirdrop = () => {
    setAirdropFormValues({
      name: "",
      description: "",
      category: "",
      link: "",
      logo: "https://cryptologos.cc/logos/placeholder.png",
      estimatedValue: "$100-500",
      difficulty: "Easy",
      tasks: [""],
      launchDate: new Date().toISOString().split('T')[0],
    });
    setIsAirdropDialogOpen(true);
  };

  // Handler for deleting a ranking
  const handleDeleteRanking = (id: string) => {
    deleteRanking(id);
    toast({
      title: "Ranking deleted",
      description: "The airdrop ranking has been removed",
    });
  };

  // Handler for toggling pinned status
  const handleTogglePin = (ranking: AirdropRanking) => {
    updateRanking(ranking.id, {
      ...ranking,
      isPinned: !ranking.isPinned
    });
    
    toast({
      title: ranking.isPinned ? "Unpinned" : "Pinned",
      description: `Airdrop has been ${ranking.isPinned ? "unpinned" : "pinned"} successfully`,
    });
  };

  // Handler for submitting the form
  const handleSubmit = () => {
    if (!formValues.airdropId) {
      toast({
        title: "Error",
        description: "Please select an airdrop",
        variant: "destructive",
      });
      return;
    }

    if (!formValues.potentialValue) {
      toast({
        title: "Error",
        description: "Please enter a potential value",
        variant: "destructive",
      });
      return;
    }

    if (currentRanking) {
      // Update existing ranking
      updateRanking(currentRanking.id, {
        airdropId: formValues.airdropId,
        fundingRating: Number(formValues.fundingRating),
        popularityRating: Number(formValues.popularityRating),
        potentialValue: formValues.potentialValue,
        notes: formValues.notes,
        telegramLink: formValues.telegramLink,
        rank: Number(formValues.rank),
        isPinned: formValues.isPinned,
      });
      toast({
        title: "Ranking updated",
        description: "The airdrop ranking has been updated successfully",
      });
    } else {
      // Add new ranking
      addRanking({
        airdropId: formValues.airdropId,
        fundingRating: Number(formValues.fundingRating),
        popularityRating: Number(formValues.popularityRating),
        potentialValue: formValues.potentialValue,
        notes: formValues.notes,
        telegramLink: formValues.telegramLink,
        rank: Number(formValues.rank),
        isPinned: formValues.isPinned,
      });
      toast({
        title: "Ranking added",
        description: "New airdrop ranking has been added successfully",
      });
    }

    setIsDialogOpen(false);
  };

  // Handle creating a new airdrop
  const handleCreateAirdrop = () => {
    if (!airdropFormValues.name || !airdropFormValues.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new airdrop
    const newAirdropId = `airdrop-${Date.now()}`;
    addAirdrop({
      name: airdropFormValues.name,
      description: airdropFormValues.description,
      category: airdropFormValues.category,
      link: airdropFormValues.link,
      logo: airdropFormValues.logo,
      estimatedValue: airdropFormValues.estimatedValue,
      difficulty: airdropFormValues.difficulty,
      tasks: airdropFormValues.tasks.filter(task => task.trim() !== ""),
      launchDate: airdropFormValues.launchDate,
      isCompleted: false,
      isPinned: false,
    });

    toast({
      title: "Airdrop created",
      description: `${airdropFormValues.name} has been created successfully`,
    });

    // Close the dialog and set the newly created airdrop in the ranking form
    setIsAirdropDialogOpen(false);
    setFormValues({
      ...formValues,
      airdropId: newAirdropId
    });
  };

  // Handler for clear all rankings (admin only)
  const handleClearAllRankings = () => {
    if (confirm("Are you sure you want to delete all rankings? This action cannot be undone.")) {
      clearPreAddedRankings();
      toast({
        title: "All rankings deleted",
        description: "All pre-added rankings have been removed",
      });
    }
  };

  // Handle task input change
  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...airdropFormValues.tasks];
    updatedTasks[index] = value;
    setAirdropFormValues({ ...airdropFormValues, tasks: updatedTasks });
  };

  // Add new task input
  const addTaskInput = () => {
    setAirdropFormValues({ ...airdropFormValues, tasks: [...airdropFormValues.tasks, ""] });
  };

  // Remove task input
  const removeTaskInput = (index: number) => {
    const updatedTasks = airdropFormValues.tasks.filter((_, i) => i !== index);
    setAirdropFormValues({ ...airdropFormValues, tasks: updatedTasks });
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

  // Render stars for ratings
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Get airdrops that don't have rankings yet
  const unrankedAirdrops = airdrops.filter(
    airdrop => !rankings.some(ranking => ranking.airdropId === airdrop.id)
  );

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Airdrop Rankings</h1>
          <p className="text-muted-foreground mt-1">
            View and compare rankings for potential airdrops
          </p>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button onClick={handleAddRanking}>
                <Plus className="mr-2 h-4 w-4" />
                Add Ranking
              </Button>
              <Button variant="destructive" onClick={handleClearAllRankings}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {!isAdmin && (
        <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <h3 className="font-medium text-yellow-700 dark:text-yellow-400">Admin Access Required</h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                Only administrators can add or edit airdrop rankings. You can view the rankings below.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Airdrop Rankings</CardTitle>
          <CardDescription>
            Airdrops ranked by funding, popularity, and potential value
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rankingsWithDetails.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Airdrop</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Funding</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>Potential Value</TableHead>
                    <TableHead className="hidden md:table-cell">Notes</TableHead>
                    <TableHead>Links</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingsWithDetails.map((ranking) => (
                    <TableRow key={ranking.id} className={ranking.isPinned ? "bg-primary/5" : ""}>
                      <TableCell>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePin(ranking)}
                            className="h-8 w-8"
                          >
                            {ranking.isPinned ? (
                              <PinOff className="h-4 w-4 text-primary" />
                            ) : (
                              <Pin className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {!isAdmin && ranking.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {ranking.rank ? `#${ranking.rank}` : "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                            <img 
                              src={ranking.airdropLogo} 
                              alt={ranking.airdropName} 
                              className="h-full w-full object-cover"
                              onError={(e) => (e.currentTarget.src = "https://cryptologos.cc/logos/placeholder.png")}
                            />
                          </div>
                          <span>{ranking.airdropName}</span>
                          {ranking.isPinned && (
                            <span className="px-1.5 py-0.5 rounded text-xs bg-primary/20 text-primary">
                              Featured
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{ranking.airdropCategory}</TableCell>
                      <TableCell>
                        <div className="flex">{renderStars(ranking.fundingRating)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex">{renderStars(ranking.popularityRating)}</div>
                      </TableCell>
                      <TableCell>
                        <span className={
                          ranking.potentialValue === "Very High" ? "text-green-600 font-semibold" :
                          ranking.potentialValue === "High" ? "text-green-500" :
                          ranking.potentialValue === "Medium" ? "text-yellow-500" :
                          "text-gray-500"
                        }>
                          {ranking.potentialValue}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {ranking.notes}
                      </TableCell>
                      <TableCell>
                        {ranking.telegramLink ? (
                          <a 
                            href={ranking.telegramLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Telegram
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">No link</span>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditRanking(ranking)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRanking(ranking.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No rankings available</h3>
              <p className="text-muted-foreground">
                {isAdmin 
                  ? "Start by adding rankings for airdrops" 
                  : "Rankings will be added by administrators soon"}
              </p>
              {isAdmin && (
                <Button className="mt-4" onClick={handleAddRanking}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Ranking
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Ranking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentRanking ? "Edit Ranking" : "Add New Ranking"}</DialogTitle>
            <DialogDescription>
              {currentRanking 
                ? "Update the ranking details for this airdrop" 
                : "Add a ranking for an airdrop"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="airdrop">Airdrop</Label>
              <div className="flex gap-2">
                <select
                  id="airdrop"
                  className="flex-1 p-2 rounded-md border border-input bg-background"
                  value={formValues.airdropId}
                  onChange={(e) => setFormValues({...formValues, airdropId: e.target.value})}
                  disabled={!!currentRanking}
                >
                  <option value="">Select an airdrop</option>
                  {currentRanking && (
                    <option value={currentRanking.airdropId}>
                      {airdrops.find(a => a.id === currentRanking.airdropId)?.name || "Unknown"}
                    </option>
                  )}
                  {!currentRanking && unrankedAirdrops.map((airdrop) => (
                    <option key={airdrop.id} value={airdrop.id}>
                      {airdrop.name}
                    </option>
                  ))}
                </select>
                <Button type="button" onClick={handleCreateNewAirdrop}>
                  <Plus className="h-4 w-4 mr-1" /> New
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rank">Ranking Position (0 = unranked)</Label>
              <Input
                id="rank"
                type="number"
                min="0"
                max="999"
                value={formValues.rank}
                onChange={(e) => setFormValues({...formValues, rank: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fundingRating">Funding Rating (1-5)</Label>
                <Input
                  id="fundingRating"
                  type="number"
                  min="1"
                  max="5"
                  value={formValues.fundingRating}
                  onChange={(e) => setFormValues({...formValues, fundingRating: parseInt(e.target.value)})}
                />
                <div className="flex mt-1">
                  {renderStars(formValues.fundingRating)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="popularityRating">Popularity Rating (1-5)</Label>
                <Input
                  id="popularityRating"
                  type="number"
                  min="1"
                  max="5"
                  value={formValues.popularityRating}
                  onChange={(e) => setFormValues({...formValues, popularityRating: parseInt(e.target.value)})}
                />
                <div className="flex mt-1">
                  {renderStars(formValues.popularityRating)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="potentialValue">Potential Value</Label>
              <select
                id="potentialValue"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={formValues.potentialValue}
                onChange={(e) => setFormValues({...formValues, potentialValue: e.target.value})}
              >
                <option value="">Select potential value</option>
                <option value="Very High">Very High</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegramLink">Telegram Link</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                  <LinkIcon className="h-4 w-4" />
                </span>
                <Input
                  id="telegramLink"
                  type="url"
                  placeholder="https://t.me/..."
                  value={formValues.telegramLink}
                  onChange={(e) => setFormValues({...formValues, telegramLink: e.target.value})}
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="isPinned" className="flex items-center gap-2">
                <input
                  id="isPinned"
                  type="checkbox"
                  checked={formValues.isPinned}
                  onChange={(e) => setFormValues({...formValues, isPinned: e.target.checked})}
                  className="form-checkbox h-4 w-4"
                />
                Pin to top of rankings
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="w-full p-2 rounded-md border border-input bg-background min-h-[80px]"
                value={formValues.notes}
                onChange={(e) => setFormValues({...formValues, notes: e.target.value})}
                placeholder="Add additional notes or comments about this ranking..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {currentRanking ? "Update Ranking" : "Add Ranking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Airdrop Dialog */}
      <Dialog open={isAirdropDialogOpen} onOpenChange={setIsAirdropDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Airdrop</DialogTitle>
            <DialogDescription>
              Add a new airdrop that will be available for ranking
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={airdropFormValues.name}
                onChange={(e) => setAirdropFormValues({...airdropFormValues, name: e.target.value})}
                placeholder="Airdrop name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={airdropFormValues.description}
                onChange={(e) => setAirdropFormValues({...airdropFormValues, description: e.target.value})}
                placeholder="Brief description of the airdrop"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={airdropFormValues.category}
                onChange={(e) => setAirdropFormValues({...airdropFormValues, category: e.target.value})}
                placeholder="Enter category"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value</Label>
                <Input
                  id="estimatedValue"
                  value={airdropFormValues.estimatedValue}
                  onChange={(e) => setAirdropFormValues({...airdropFormValues, estimatedValue: e.target.value})}
                  placeholder="$100-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={airdropFormValues.difficulty}
                  onChange={(e) => setAirdropFormValues({...airdropFormValues, difficulty: e.target.value as "Easy" | "Medium" | "Hard"})}
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
                value={airdropFormValues.link}
                onChange={(e) => setAirdropFormValues({...airdropFormValues, link: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={airdropFormValues.logo}
                onChange={(e) => setAirdropFormValues({...airdropFormValues, logo: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="launchDate">Launch Date</Label>
              <Input
                id="launchDate"
                type="date"
                value={airdropFormValues.launchDate}
                onChange={(e) => setAirdropFormValues({...airdropFormValues, launchDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Tasks</Label>
                <Button type="button" size="sm" variant="outline" onClick={addTaskInput}>
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              
              {airdropFormValues.tasks.map((task, index) => (
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
            <Button variant="outline" onClick={() => setIsAirdropDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAirdrop}>
              Create Airdrop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AirdropRankings;
