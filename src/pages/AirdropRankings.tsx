
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Plus,
  Star,
  Trash2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AirdropRanking } from "@/data/airdrops";

const AirdropRankings = () => {
  const { airdrops, rankings, addRanking, updateRanking, deleteRanking } = useAirdrops();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRanking, setCurrentRanking] = useState<AirdropRanking | null>(null);
  const [formValues, setFormValues] = useState({
    airdropId: "",
    fundingRating: 3,
    popularityRating: 3,
    potentialValue: "",
    notes: "",
  });

  const isAdmin = user?.email === "malickirfan00@gmail.com" && user?.username === "UmarCryptospace";

  // Get rankings with airdrop details
  const rankingsWithDetails = rankings.map(ranking => {
    const airdrop = airdrops.find(a => a.id === ranking.airdropId);
    return {
      ...ranking,
      airdropName: airdrop?.name || "Unknown",
      airdropLogo: airdrop?.logo || "",
      airdropCategory: airdrop?.category || "Unknown",
    };
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
    });
    setIsDialogOpen(true);
  };

  // Handler for deleting a ranking
  const handleDeleteRanking = (id: string) => {
    deleteRanking(id);
    toast({
      title: "Ranking deleted",
      description: "The airdrop ranking has been removed",
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
      updateRanking({
        id: currentRanking.id,
        airdropId: formValues.airdropId,
        fundingRating: Number(formValues.fundingRating),
        popularityRating: Number(formValues.popularityRating),
        potentialValue: formValues.potentialValue,
        notes: formValues.notes,
      });
      toast({
        title: "Ranking updated",
        description: "The airdrop ranking has been updated successfully",
      });
    } else {
      // Add new ranking
      addRanking({
        id: `ranking-${Date.now()}`,
        airdropId: formValues.airdropId,
        fundingRating: Number(formValues.fundingRating),
        popularityRating: Number(formValues.popularityRating),
        potentialValue: formValues.potentialValue,
        notes: formValues.notes,
      });
      toast({
        title: "Ranking added",
        description: "New airdrop ranking has been added successfully",
      });
    }

    setIsDialogOpen(false);
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

        {isAdmin && (
          <Button onClick={handleAddRanking}>
            <Plus className="mr-2 h-4 w-4" />
            Add Ranking
          </Button>
        )}
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
                    <TableHead>Airdrop</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Funding</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>Potential Value</TableHead>
                    <TableHead className="hidden md:table-cell">Notes</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingsWithDetails.map((ranking) => (
                    <TableRow key={ranking.id}>
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
        <DialogContent className="sm:max-w-[525px]">
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
              <select
                id="airdrop"
                className="w-full p-2 rounded-md border border-input bg-background"
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
    </div>
  );
};

export default AirdropRankings;
