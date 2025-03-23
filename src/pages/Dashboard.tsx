
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useAirdrops, Event } from "@/contexts/AirdropsContext";
import { useTestnets } from "@/contexts/TestnetsContext";
import { useTools } from "@/contexts/ToolsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  BarChart2,
  ChevronRight,
  Clock,
  Gift,
  Rocket,
  TrendingUp,
  CheckCircle,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Package,
  PackageCheck,
  BookText,
  FileText
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem, 
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Dashboard = () => {
  const { user } = useAuth();
  const { airdrops, events, addEvent, updateEvent, deleteEvent } = useAirdrops();
  const { testnets } = useTestnets();
  const { tools } = useTools();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  
  useEffect(() => {
    // Calculate actual progress based on completed airdrops, testnets, and tools
    const totalItems = airdrops.length + testnets.length + tools.length;
    const completedItems = 
      airdrops.filter(a => a.isCompleted).length + 
      testnets.filter(t => t.isCompleted).length + 
      tools.filter(t => t.isCompleted).length;
    
    const calculatedProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    setProgress(calculatedProgress);
  }, [airdrops, testnets, tools]);

  // Calculate today's completed items
  const getTodayCompletedCount = () => {
    const today = new Date().toISOString().split('T')[0];
    // For demonstration purposes, we'll just return a static number
    // In a real application, you would track completion timestamps
    return 3;
  };

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Airdrops",
      value: airdrops.length.toString(),
      description: `${airdrops.filter(a => a.isCompleted).length} completed`,
      icon: Gift,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Testnets",
      value: testnets.length.toString(),
      description: `${testnets.filter(t => t.isCompleted).length} completed`,
      icon: Rocket,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Tools Available",
      value: tools.length.toString(),
      description: `${tools.filter(t => t.isCompleted).length} completed`,
      icon: Package,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Daily Progress",
      value: getTodayCompletedCount().toString(),
      description: "Tasks completed today",
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  // Form for adding/editing events
  const form = useForm<Event>({
    defaultValues: {
      id: "",
      title: "",
      subtitle: "",
      status: "upcoming",
      timeLeft: "",
      buttonText: "View Details",
      buttonAction: "view_details"
    }
  });

  // Function to handle add/edit event
  const handleAddEditEvent = (data: Event) => {
    try {
      if (currentEvent) {
        // Update existing event
        updateEvent(data);
        toast({
          title: "Event Updated",
          description: "The event has been successfully updated.",
        });
      } else {
        // Add new event
        const newEvent = {
          ...data,
          id: `event-${Date.now()}`, // Generate unique ID
        };
        addEvent(newEvent);
        toast({
          title: "Event Added",
          description: "The new event has been successfully added.",
        });
      }
      setIsEventDialogOpen(false);
      form.reset();
      setCurrentEvent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the event.",
        variant: "destructive",
      });
    }
  };

  // Function to open edit dialog
  const openEditDialog = (event: Event) => {
    setCurrentEvent(event);
    form.reset(event);
    setIsEventDialogOpen(true);
  };

  // Function to handle delete event
  const handleDeleteEvent = (id: string) => {
    try {
      deleteEvent(id);
      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting the event.",
        variant: "destructive",
      });
    }
  };

  // Function to open add dialog
  const openAddDialog = () => {
    setCurrentEvent(null);
    form.reset({
      id: "",
      title: "",
      subtitle: "",
      status: "upcoming",
      timeLeft: "",
      buttonText: "View Details",
      buttonAction: "view_details"
    });
    setIsEventDialogOpen(true);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Calculate progress percentages
  const airdropProgress = airdrops.length > 0 ? 
    Math.round((airdrops.filter(a => a.isCompleted).length / airdrops.length) * 100) : 0;
  
  const testnetProgress = testnets.length > 0 ? 
    Math.round((testnets.filter(t => t.isCompleted).length / testnets.length) * 100) : 0;
  
  const toolsProgress = tools.length > 0 ? 
    Math.round((tools.filter(t => t.isCompleted).length / tools.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your crypto journey.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Gift className="mr-2 h-4 w-4" />
              Discover New Airdrops
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-xl font-bold">Coming Soon!</h2>
            <p className="mt-2">New airdrops will be available soon. Check back later!</p>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="glass-card glass-card-hover overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-7">
        <motion.div 
          variants={item}
          initial="hidden"
          animate="show"
          className="md:col-span-4"
        >
          <Card className="glass-card glass-card-hover h-full">
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Your journey across all platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Completion</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="progress">Progress Breakdown</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="progress" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-blue-500" /> Airdrops
                        </span>
                        <span className="text-muted-foreground">{airdropProgress}%</span>
                      </div>
                      <Progress value={airdropProgress} className="h-1.5 bg-blue-100" indicatorClassName="bg-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Rocket className="h-4 w-4 text-purple-500" /> Testnets
                        </span>
                        <span className="text-muted-foreground">{testnetProgress}%</span>
                      </div>
                      <Progress value={testnetProgress} className="h-1.5 bg-purple-100" indicatorClassName="bg-purple-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-amber-500" /> Tools
                        </span>
                        <span className="text-muted-foreground">{toolsProgress}%</span>
                      </div>
                      <Progress value={toolsProgress} className="h-1.5 bg-amber-100" indicatorClassName="bg-amber-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-500" /> Non-Fiction
                        </span>
                        <span className="text-muted-foreground">40%</span>
                      </div>
                      <Progress value={40} className="h-1.5 bg-green-100" indicatorClassName="bg-green-500" />
                    </div>
                  </div>
                  
                  <Card className="bg-secondary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Today's Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Airdrops Completed</span>
                          <span>2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Testnets Joined</span>
                          <span>1</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tools Explored</span>
                          <span>0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="achievements" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Airdrop Enthusiast</p>
                        <p className="text-sm text-muted-foreground">Completed 15+ airdrops</p>
                      </div>
                    </div>
                    <span className="text-green-500 text-sm font-medium">Unlocked</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-purple-500/10">
                        <Rocket className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">Testnet Pioneer</p>
                        <p className="text-sm text-muted-foreground">Participated in 5+ testnets</p>
                      </div>
                    </div>
                    <span className="text-green-500 text-sm font-medium">Unlocked</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-amber-500/10">
                        <Package className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Tools Explorer</p>
                        <p className="text-sm text-muted-foreground">Used 10+ crypto tools</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">5/10 tools</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-500/10">
                        <BookText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Knowledge Seeker</p>
                        <p className="text-sm text-muted-foreground">Read 20+ non-fiction pieces</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">8/20 read</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={item}
          initial="hidden"
          animate="show"
          className="md:col-span-3"
        >
          <Card className="glass-card glass-card-hover h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss these opportunities</CardDescription>
              </div>
              {user?.isAdmin && (
                <Button variant="outline" size="sm" onClick={openAddDialog} className="flex items-center">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-secondary/30 p-4 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.subtitle}</p>
                      </div>
                      {event.status === "upcoming" && event.timeLeft && (
                        <div className="bg-primary/20 rounded-md px-2 py-1 text-xs text-primary-foreground font-medium">
                          {event.timeLeft}
                        </div>
                      )}
                      {event.status === "live" && (
                        <div className="bg-green-500/20 rounded-md px-2 py-1 text-xs text-green-400 font-medium">
                          Now Live
                        </div>
                      )}
                      {event.status === "coming_soon" && (
                        <div className="bg-blue-500/20 rounded-md px-2 py-1 text-xs text-blue-400 font-medium">
                          Coming soon
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" className="mt-1" size="sm">
                            {event.buttonText}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <h2 className="text-xl font-bold">{event.title}</h2>
                          <p className="mt-2">Details about the {event.title} will be available soon.</p>
                        </DialogContent>
                      </Dialog>
                      
                      {user?.isAdmin && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialog for adding/editing events */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {currentEvent 
                ? "Update the details of this event" 
                : "Fill in the details to add a new upcoming event"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddEditEvent)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a short subtitle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="live">Live Now</SelectItem>
                        <SelectItem value="coming_soon">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("status") === "upcoming" && (
                <FormField
                  control={form.control}
                  name="timeLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Left</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 days left" {...field} />
                      </FormControl>
                      <FormDescription>
                        Only required for upcoming events
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., View Details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="buttonAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Action</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="view_details">View Details</SelectItem>
                        <SelectItem value="join_testnet">Join Testnet</SelectItem>
                        <SelectItem value="get_notified">Get Notified</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => {
                    setIsEventDialogOpen(false);
                    setCurrentEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {currentEvent ? "Update Event" : "Add Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
