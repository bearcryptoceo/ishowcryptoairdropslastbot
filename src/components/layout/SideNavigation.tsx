
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Gift,
  Rocket,
  Wrench,
  Play,
  Home,
  Plus,
  Users,
  BookOpen,
  TrendingUp,
  Compass,
  Book,
} from "lucide-react";

interface SideNavigationProps {
  onNavigate?: () => void;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export const SideNavigation = ({ onNavigate }: SideNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigate = (href: string) => {
    navigate(href);
    if (onNavigate) onNavigate();
  };
  
  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Airdrops",
      href: "/airdrops",
      icon: Gift,
    },
    {
      title: "Airdrops Ranking",
      href: "/airdrops-rankings",
      icon: TrendingUp,
    },
    {
      title: "Testnets",
      href: "/testnets",
      icon: Rocket,
    },
    {
      title: "Tools",
      href: "/tools",
      icon: Wrench,
    },
    {
      title: "Videos",
      href: "/videos",
      icon: Play,
    },
    {
      title: "Learn",
      href: "/learn",
      icon: BookOpen,
    },
    {
      title: "Explore",
      href: "/explore",
      icon: Compass,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">C</span>
          </div>
          <h1 className="text-xl font-bold">CryptoTrack</h1>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-base font-medium h-11",
              location.pathname === item.href
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleNavigate(item.href)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.title}
          </Button>
        ))}
      </div>
      
      <div className="p-4 mt-auto">
        <Button 
          className="w-full bg-primary h-11 font-medium" 
          onClick={() => handleNavigate("/profile")}
        >
          <Users className="mr-2 h-5 w-5" />
          Profile
        </Button>
      </div>
    </div>
  );
};
