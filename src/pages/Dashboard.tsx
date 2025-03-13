
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate progress animation on load
    const timer = setTimeout(() => setProgress(72), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Airdrops",
      value: "32",
      description: "Across all categories",
      icon: Gift,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed Airdrops",
      value: "18",
      description: "56% completion rate",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Testnets",
      value: "7",
      description: "Currently participating",
      icon: Rocket,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Daily Tasks",
      value: "12",
      description: "3 completed today",
      icon: Calendar,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your crypto journey.</p>
        </div>
        <Button className="w-full md:w-auto">
          <Gift className="mr-2 h-4 w-4" />
          Discover New Airdrops
        </Button>
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
              <CardTitle>Achievement Progress</CardTitle>
              <CardDescription>Your journey in the crypto world</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level 3 - Crypto Hunter</span>
                  <span className="text-muted-foreground">72%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
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
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Consistent Tracker</p>
                      <p className="text-sm text-muted-foreground">Logged in for 30 consecutive days</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">18/30 days</span>
                </div>
              </div>
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
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Don't miss these opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                <div className="bg-secondary/30 p-4 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Arbitrum Airdrop Snapshot</p>
                      <p className="text-sm text-muted-foreground">Layer 1 & Testnet</p>
                    </div>
                    <div className="bg-primary/20 rounded-md px-2 py-1 text-xs text-primary-foreground font-medium">
                      2 days left
                    </div>
                  </div>
                  <Button variant="secondary" className="mt-1" size="sm">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-secondary/30 p-4 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">LayerZero Testnet Phase 2</p>
                      <p className="text-sm text-muted-foreground">Bridge Mining</p>
                    </div>
                    <div className="bg-green-500/20 rounded-md px-2 py-1 text-xs text-green-400 font-medium">
                      Now Live
                    </div>
                  </div>
                  <Button variant="secondary" className="mt-1" size="sm">
                    Join Testnet
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-secondary/30 p-4 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Weekly Video Summary</p>
                      <p className="text-sm text-muted-foreground">By UmarCryptospace</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-md px-2 py-1 text-xs text-blue-400 font-medium">
                      Coming soon
                    </div>
                  </div>
                  <Button variant="secondary" className="mt-1" size="sm">
                    Get Notified
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
