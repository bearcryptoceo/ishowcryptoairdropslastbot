
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronRight, Gift, Play, Rocket, Wrench } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: Gift,
      title: "Track Airdrops",
      description: "Discover and track the latest airdrops across different categories and never miss an opportunity."
    },
    {
      icon: Rocket,
      title: "Join Testnets",
      description: "Participate in the newest testnets, track your progress, and maximize your potential rewards."
    },
    {
      icon: Wrench,
      title: "Access Crypto Tools",
      description: "Use our collection of crypto tools to enhance your airdrop and testnet participation."
    },
    {
      icon: Play,
      title: "Learn from Videos",
      description: "Watch educational videos about airdrops, testnets, and crypto opportunities."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 fixed top-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold">CryptoTrack</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#videos" className="text-muted-foreground hover:text-foreground transition-colors">Videos</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="hidden sm:flex"
            >
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-block px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20 mb-4">
              The ultimate crypto airdrop & testnet tracker
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Track, Participate, and <span className="text-primary">Maximize</span> Your Crypto Rewards
            </h1>
            <p className="text-xl text-muted-foreground md:w-4/5 mx-auto">
              One platform to discover, track, and manage crypto airdrops and testnets. Never miss an opportunity to earn rewards again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={() => navigate("/register")}>
                Start Tracking <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/videos")}>
                <Play className="mr-2 h-5 w-5 fill-current" /> Watch Videos
              </Button>
            </div>
            
            <div className="pt-6 flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center">
                <Check className="text-primary mr-2 h-4 w-4" /> Free invite code
              </div>
              <div className="flex items-center">
                <Check className="text-primary mr-2 h-4 w-4" /> 100+ airdrops
              </div>
              <div className="flex items-center">
                <Check className="text-primary mr-2 h-4 w-4" /> Active community
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Dashboard Preview */}
            <div className="w-full max-w-5xl mx-auto glass-card rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <div className="w-full h-[400px] bg-gradient-to-br from-primary/40 via-accent/20 to-secondary/30 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Intuitive Dashboard</h3>
                  <p className="text-muted-foreground">Preview image of dashboard will be here</p>
                  <Button onClick={() => navigate("/register")}>
                    Create Your Account
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-3xl opacity-40"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need For Crypto Success</h2>
            <p className="text-xl text-muted-foreground">
              Our platform provides all the tools and resources you need to maximize your earnings from airdrops and testnets.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card rounded-xl p-6 glass-card-hover"
                variants={fadeIn}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Videos Preview Section */}
      <section id="videos" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn From Crypto Experts</h2>
            <p className="text-xl text-muted-foreground">
              Watch our curated collection of videos to learn about the latest opportunities in the crypto space.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[1, 2, 3].map((_, index) => (
              <motion.div 
                key={index}
                className="glass-card rounded-xl overflow-hidden glass-card-hover"
                variants={fadeIn}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/40 via-accent/20 to-secondary/30 relative flex items-center justify-center">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">How to Join the Latest Testnet</h3>
                  <p className="text-sm text-muted-foreground">By UmarCryptospace</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Button onClick={() => navigate("/videos")}>
              View All Videos <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto glass-card rounded-xl p-8 md:p-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Crypto Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who are already tracking airdrops and participating in testnets.
            </p>
            <Button size="lg" onClick={() => navigate("/register")}>
              Create Your Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Use invite code: <span className="text-primary font-medium">ishowcryptoairdrops</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">CryptoTrack</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6 md:mb-0">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#videos" className="text-muted-foreground hover:text-foreground transition-colors">Videos</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            </div>
            
            <div>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="outline" onClick={() => navigate("/register")} className="ml-2">
                Register
              </Button>
            </div>
          </div>
          
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>© 2023 CryptoTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
