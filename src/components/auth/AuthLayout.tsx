
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col bg-gradient-to-br from-secondary via-background to-background p-12 justify-between"
      >
        <div>
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold">CryptoTrack</h1>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">Track Crypto Airdrops & Testnets</h2>
          <p className="text-muted-foreground text-lg max-w-md">
            The ultimate platform to discover, track, and manage crypto airdrops and testnets all in one place.
          </p>
          
          <div className="flex items-center gap-4 mt-8">
            <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Track Airdrops</h3>
              <p className="text-sm text-muted-foreground">Never miss an airdrop opportunity</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Join Testnets</h3>
              <p className="text-sm text-muted-foreground">Participate in the latest testnets</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Access Exclusive Tools</h3>
              <p className="text-sm text-muted-foreground">Use our crypto tools for maximum rewards</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-2"
        >
          <p className="text-muted-foreground text-sm">© 2023 CryptoTrack. All rights reserved.</p>
        </motion.div>
      </motion.div>
      
      <div className="flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md space-y-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
