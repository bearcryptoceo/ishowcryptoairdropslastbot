
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-soft"></div>
          <div className="absolute inset-2 rounded-full bg-primary/30"></div>
          <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center text-6xl font-bold">
            4
          </div>
        </div>
        
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="pt-4">
          <Button onClick={() => navigate("/")} className="mr-4">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
