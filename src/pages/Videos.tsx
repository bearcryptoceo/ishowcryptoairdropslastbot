
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Play, Plus, Trash, Upload, Video, X } from "lucide-react";

interface VideoType {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  author: string;
  thumbnail: string;
  views: number;
}

// Placeholder thumbnails for automatic assignment
const placeholderThumbnails = [
  "/placeholder.svg",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
];

const Videos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  // Load videos from localStorage on component mount
  useEffect(() => {
    try {
      const savedVideos = localStorage.getItem("educational_videos");
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos));
      } else {
        // Initialize with empty array - no default videos
        setVideos([]);
        localStorage.setItem("educational_videos", JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading videos:", error);
      setVideos([]);
    }
  }, []);

  // Save videos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("educational_videos", JSON.stringify(videos));
  }, [videos]);
  
  const getRandomThumbnail = () => {
    const randomIndex = Math.floor(Math.random() * placeholderThumbnails.length);
    return placeholderThumbnails[randomIndex];
  };
  
  const handleAddVideo = () => {
    if (!videoTitle || !videoDescription || !videoLink) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the video details",
        variant: "destructive"
      });
      return;
    }
    
    const newVideo = {
      id: Date.now(),
      title: videoTitle,
      description: videoDescription,
      createdAt: new Date().toISOString().split('T')[0],
      author: user?.username || "Anonymous",
      thumbnail: getRandomThumbnail(), // Automatically assign a thumbnail
      views: 0
    };
    
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    localStorage.setItem("educational_videos", JSON.stringify(updatedVideos));
    
    toast({
      title: "Video Added",
      description: "Your video has been successfully added",
    });
    
    setIsDialogOpen(false);
    setVideoTitle("");
    setVideoDescription("");
    setVideoLink("");
  };

  const handleDeleteVideo = (id: number) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    setVideos(updatedVideos);
    localStorage.setItem("educational_videos", JSON.stringify(updatedVideos));
    
    toast({
      title: "Video Deleted",
      description: "The video has been permanently removed",
    });
  };

  const handleClearAllVideos = () => {
    setVideos([]);
    localStorage.setItem("educational_videos", JSON.stringify([]));
    setShowClearAllDialog(false);
    
    toast({
      title: "All Videos Removed",
      description: "All videos have been cleared from the platform",
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Educational Videos</h1>
          <p className="text-muted-foreground mt-1">
            Learn about airdrops, testnets, and crypto opportunities
          </p>
        </div>
        
        <div className="flex gap-2">
          {user?.isAdmin && (
            <Button variant="destructive" onClick={() => setShowClearAllDialog(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Clear All Videos
            </Button>
          )}
          
          {(user?.isVideoCreator || user?.isAdmin) && (
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
                    <div className="border-2 border-dashed rounded-lg p-4 bg-muted/20">
                      <p className="text-sm text-muted-foreground text-center mb-2">
                        Thumbnails are automatically generated for each video
                      </p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {placeholderThumbnails.slice(0, 3).map((thumb, idx) => (
                          <div key={idx} className="aspect-video bg-muted rounded overflow-hidden">
                            <img 
                              src={thumb} 
                              alt={`Example thumbnail ${idx+1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
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
      </div>
      
      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Videos</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all videos? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearAllDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllVideos}>
              Yes, Remove All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {videos.length === 0 && (
        <Alert>
          <AlertDescription>
            No videos available. {(user?.isVideoCreator || user?.isAdmin) ? "Click 'Add Video' to create a new one." : "Check back later for new content."}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Videos Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {videos.map((video) => (
          <motion.div key={video.id} variants={item}>
            <Card className="h-full overflow-hidden flex flex-col group">
              <div className="aspect-video relative bg-gradient-to-br from-primary/40 via-accent/20 to-secondary/30 flex items-center justify-center group overflow-hidden">
                {video.thumbnail ? (
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <Video className="h-12 w-12 text-white opacity-80" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Video className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                    {(user?.isAdmin || user?.isVideoCreator) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Upcoming Videos Section */}
      {videos.length > 0 && (
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
      )}
    </div>
  );
};

export default Videos;
