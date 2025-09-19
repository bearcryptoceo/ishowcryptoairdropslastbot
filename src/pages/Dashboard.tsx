import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Calendar, CircleCheck, Clock, ExternalLink, Info, Trophy, Plus, Edit, Trash } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAirdrops } from "@/contexts/AirdropsContext";
import { useTestnets } from "@/contexts/TestnetsContext";
import { useTools } from "@/contexts/ToolsContext";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/contexts/AirdropsContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { airdrops, events, addEvent, updateEvent, deleteEvent } = useAirdrops();
  const { testnets } = useTestnets();
  const { tools } = useTools();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventFormValues, setEventFormValues] = useState({
    title: "",
    subtitle: "",
    status: "upcoming" as "upcoming" | "live" | "coming_soon",
    timeLeft: "",
    buttonText: "",
    buttonAction: "",
    link: "" // New field for event link
  });
  
  // Calculate statistics
  const completedAirdrops = airdrops.filter(a => a.isCompleted).length;
  const totalAirdrops = airdrops.length;
  const airdropCompletionRate = totalAirdrops ? (completedAirdrops / totalAirdrops) * 100 : 0;
  
  const completedTestnets = testnets.filter(t => t.isCompleted).length;
  const totalTestnets = testnets.length;
  const testnetCompletionRate = totalTestnets ? (completedTestnets / totalTestnets) * 100 : 0;
  
  const completedTools = tools.filter(t => t.isCompleted).length;
  const totalTools = tools.length;
  const toolCompletionRate = totalTools ? (completedTools / totalTools) * 100 : 0;
  
  // Calculate today's completed items
  const today = new Date().toISOString().split('T')[0];
  const [todayStats, setTodayStats] = useState({
    airdrops: 0,
    testnets: 0,
    tools: 0,
    nonfiction: 0
  });

  // Calculate user level based on completed items
  const totalCompletedItems = completedAirdrops + completedTestnets + completedTools;
  const userLevel = Math.max(1, Math.floor(totalCompletedItems / 5) + 1); // Level up every 5 completions
  const nextLevelProgress = (totalCompletedItems % 5) / 5 * 100; // Progress to next level
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    // In a real application, we would track completion dates
    // For now, we'll simulate with random values
    setTodayStats({
      airdrops: Math.floor(Math.random() * 3),
      testnets: Math.floor(Math.random() * 2),
      tools: Math.floor(Math.random() * 2),
      nonfiction: Math.floor(Math.random() * 5)
    });
  }, []);

  // Total progress calculation
  const totalItems = totalAirdrops + totalTestnets + totalTools + 10; // 10 is placeholder for nonfiction items
  const completedItems = completedAirdrops + completedTestnets + completedTools + todayStats.nonfiction;
  const overallCompletionRate = totalItems ? (completedItems / totalItems) * 100 : 0;

  // Event management
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setEventFormValues({
      title: "",
      subtitle: "",
      status: "upcoming",
      timeLeft: "",
      buttonText: "View Details",
      buttonAction: "view_details",
      link: ""
    });
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setEventFormValues({
      title: event.title,
      subtitle: event.subtitle,
      status: event.status as "upcoming" | "live" | "coming_soon",
      timeLeft: event.timeLeft || "",
      buttonText: event.buttonText,
      buttonAction: event.buttonAction,
      link: event.link || ""
    });
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(id);
      toast({
        title: "Event deleted",
        description: "The event has been removed"
      });
    }
  };

  const handleSubmitEvent = () => {
    const { title, subtitle, status, timeLeft, buttonText, buttonAction, link } = eventFormValues;
    
    if (!title || !subtitle || !buttonText) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const eventData = {
      id: currentEvent ? currentEvent.id : `event-${Date.now()}`,
      title,
      subtitle,
      status,
      timeLeft: status === "upcoming" ? timeLeft : undefined,
      buttonText,
      buttonAction,
      link
    };
    
    if (currentEvent) {
      updateEvent(currentEvent.id, eventData);
      toast({
        title: "Event updated",
        description: "Event has been updated successfully"
      });
    } else {
      addEvent(eventData);
      toast({
        title: "Event added",
        description: "Event has been added successfully"
      });
    }
    
    setIsEventDialogOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.username}</h1>
          <p className="text-muted-foreground">
            Track your crypto opportunities and manage your airdrop journey.
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="progress">Your Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Level Card First */}
              <motion.div variants={itemVariants}>
                <Card className="border-primary/30 overflow-hidden">
                  <div className="h-1.5 bg-primary" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                      User Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-3xl font-bold">Level {userLevel}</div>
                      <Badge className="bg-primary">{totalCompletedItems} tasks</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress to Level {userLevel + 1}</span>
                        <span>{Math.round(nextLevelProgress)}%</span>
                      </div>
                      <Progress value={nextLevelProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Airdrops Card */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                      Airdrops
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{completedAirdrops} / {totalAirdrops}</div>
                    <p className="text-muted-foreground text-sm mt-1">Completed</p>
                    <Progress value={airdropCompletionRate} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Testnets Card */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                      Testnets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{completedTestnets} / {totalTestnets}</div>
                    <p className="text-muted-foreground text-sm mt-1">Participated</p>
                    <Progress value={testnetCompletionRate} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tools Card */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                      Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{completedTools} / {totalTools}</div>
                    <p className="text-muted-foreground text-sm mt-1">Utilized</p>
                    <Progress value={toolCompletionRate} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Today's Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Progress</CardTitle>
                <CardDescription>Your progress for {today}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Level {userLevel}</h3>
                      <p className="text-sm text-muted-foreground">{5 - (totalCompletedItems % 5)} more tasks to level up</p>
                    </div>
                  </div>
                  <Badge className="bg-primary">{totalCompletedItems} total completed</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Airdrops Completed Today</span>
                    <Badge>{todayStats.airdrops}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Testnets Participated Today</span>
                    <Badge>{todayStats.testnets}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tools Used Today</span>
                    <Badge>{todayStats.tools}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Non-Fiction Content Viewed</span>
                    <Badge>{todayStats.nonfiction}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm">{Math.round(overallCompletionRate)}%</span>
                  </div>
                  <Progress value={overallCompletionRate} className="h-2" />
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              {isAdmin && (
                <Button onClick={handleAddEvent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className={`h-2 ${
                    event.status === "upcoming" 
                      ? "bg-yellow-500" 
                      : event.status === "live" 
                        ? "bg-green-500" 
                        : "bg-blue-500"
                  }`}/>
                  <CardHeader className="relative">
                    {isAdmin && (
                      <div className="absolute right-4 top-4 flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      {event.status === "upcoming" && (
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {event.timeLeft}
                        </Badge>
                      )}
                      {event.status === "live" && (
                        <Badge variant="outline" className="bg-green-500 text-white">Now Live</Badge>
                      )}
                      {event.status === "coming_soon" && (
                        <Badge variant="outline">Coming soon</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (event.link) {
                          window.open(event.link, '_blank');
                        } else if (event.buttonAction === "view_details") {
                          // Handle view details action
                        } else if (event.buttonAction === "join_testnet") {
                          // Handle join testnet action
                        } else if (event.buttonAction === "get_notified") {
                          // Handle get notified action
                        }
                      }}
                    >
                      {event.buttonText}
                      {(event.buttonAction === "view_details" || event.link) && <ExternalLink className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your overall completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Airdrops Completed</span>
                    <Badge>{completedAirdrops} / {totalAirdrops}</Badge>
                  </div>
                  <Progress value={airdropCompletionRate} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Testnets Participated</span>
                    <Badge>{completedTestnets} / {totalTestnets}</Badge>
                  </div>
                  <Progress value={testnetCompletionRate} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Tools Utilized</span>
                    <Badge>{completedTools} / {totalTools}</Badge>
                  </div>
                  <Progress value={toolCompletionRate} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Completion Rate</span>
                    <span className="text-sm">{Math.round(overallCompletionRate)}%</span>
                  </div>
                  <Progress value={overallCompletionRate} className="h-2" />
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>View your earned achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-green-100 border-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                        First Airdrop
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">Completed your first airdrop</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-100 border-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-blue-500" />
                        Testnet Explorer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">Participated in 5 testnets</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-100 border-yellow-500">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart className="mr-2 h-5 w-5 text-yellow-500" />
                        Tool Master
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">Utilized 10 different tools</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {currentEvent ? "Update the details for this event" : "Enter the details for the new event"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={eventFormValues.title}
                onChange={(e) => setEventFormValues({...eventFormValues, title: e.target.value})}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={eventFormValues.subtitle}
                onChange={(e) => setEventFormValues({...eventFormValues, subtitle: e.target.value})}
                placeholder="Enter event subtitle"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={eventFormValues.status}
                onChange={(e) => setEventFormValues({
                  ...eventFormValues, 
                  status: e.target.value as "upcoming" | "live" | "coming_soon"
                })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
            
            {eventFormValues.status === "upcoming" && (
              <div className="space-y-2">
                <Label htmlFor="timeLeft">Time Left</Label>
                <Input
                  id="timeLeft"
                  value={eventFormValues.timeLeft}
                  onChange={(e) => setEventFormValues({...eventFormValues, timeLeft: e.target.value})}
                  placeholder="e.g. 2 days left"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={eventFormValues.buttonText}
                onChange={(e) => setEventFormValues({...eventFormValues, buttonText: e.target.value})}
                placeholder="e.g. View Details"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buttonAction">Button Action</Label>
              <select
                id="buttonAction"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={eventFormValues.buttonAction}
                onChange={(e) => setEventFormValues({...eventFormValues, buttonAction: e.target.value})}
              >
                <option value="view_details">View Details</option>
                <option value="join_testnet">Join Testnet</option>
                <option value="get_notified">Get Notified</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link">Event Link</Label>
              <Input
                id="link"
                type="url"
                value={eventFormValues.link}
                onChange={(e) => setEventFormValues({...eventFormValues, link: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEvent}>
              {currentEvent ? "Update Event" : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
