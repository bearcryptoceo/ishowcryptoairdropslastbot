
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Play, Plus, Upload, Video, X } from "lucide-react";

const Videos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  
  // Mock video data
  const videos = [
    {
      id: 1,
      title: "How to Claim Airdrops: Complete Guide",
      description: "Learn the step-by-step process to claim airdrops safely and efficiently.",
      createdAt: "2023-04-15",
      author: "UmarCryptospace",
      thumbnail: "https://i.imgur.com/placeholder1.jpg",
      views: 1245
    },
    {
      id: 2,
      title: "Top 5 Upcoming Airdrops in June 2023",
      description: "Discover the most promising airdrops coming this month.",
      createdAt: "2023-06-01",
      author: "UmarCryptospace",
      thumbnail: "https://i.imgur.com/placeholder2.jpg",
      views: 978
    },
    {
      id: 3,
      title: "How to Participate in the Latest Layer2 Testnet",
      description: "A detailed tutorial on joining and maximizing rewards from the latest Layer2 testnet.",
      createdAt: "2023-05-22",
      author: "UmarCryptospace",
      thumbnail: "https://i.imgur.com/placeholder3.jpg",
      views: 654
    }
  ];
  
  const handleAddVideo = () => {
    if (!videoTitle || !videoDescription || !videoLink) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the video details",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Video Added",
      description: "Your video has been successfully added",
    });
    
    setIsDialogOpen(false);
    setVideoTitle("");
    setVideoDescription("");
    setVideoLink("");
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Educational Videos</h1>
          <p className="text-muted-foreground mt-1">
            Learn about airdrops, testnets, and crypto opportunities
          </p>
        </div>
        
        {user?.isVideoCreator && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Video</DialogTitle>
                <DialogDescription>
                  Add a new educational video to the platform
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Video Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter video title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter video description"
                    rows={3}
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="link" className="text-sm font-medium">
                    Video Link (YouTube, Vimeo, etc.)
                  </label>
                  <Input
                    id="link"
                    placeholder="https://..."
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Thumbnail
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop an image, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVideo}>
                  Add Video
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Videos Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {videos.map((video) => (
          <motion.div key={video.id} variants={item}>
            <Card className="h-full overflow-hidden flex flex-col">
              <div className="aspect-video relative bg-gradient-to-br from-primary/40 via-accent/20 to-secondary/30 flex items-center justify-center group">
                <Play className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="outline" className="text-white border-white">
                    Watch Now
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{video.author}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {video.createdAt}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <CardDescription className="line-clamp-2">
                  {video.description}
                </CardDescription>
              </CardContent>
              
              <CardFooter className="pt-0 mt-auto">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-muted-foreground">{video.views} views</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Video className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Upcoming Videos Section */}
      <div className="pt-8">
        <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
        <Card>
          <CardHeader>
            <CardTitle>How to Use ISHOW CRYPTO Airdrop Tracker</CardTitle>
            <CardDescription>A comprehensive guide to using the ISHOW CRYPTO Airdrop Tracker effectively.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This video will walk you through all the features of the ISHOW CRYPTO Airdrop Tracker, 
              including how to track airdrops, mark them as completed, view rankings, and more.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled>
              <Play className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Videos;
