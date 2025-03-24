
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  isVideoCreator: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  validateTelegramJoin: (username: string) => Promise<boolean>;
  generateCaptcha: () => { num1: number, num2: number, operator: string, answer: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = "malickirfan00@gmail.com";
const ADMIN_USERNAME = "UmarCryptospace";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session) {
          setIsAuthenticated(true);
          
          // Fetch user profile data
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              console.error("Error fetching profile:", error);
              return;
            }
            
            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                username: profile.username,
                isVideoCreator: profile.is_video_creator,
                isAdmin: profile.is_admin
              });
            }
          } catch (error) {
            console.error("Error in profile fetch:", error);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setIsAuthenticated(true);
        
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching profile on init:", error);
              return;
            }
            
            if (data) {
              setUser({
                id: data.id,
                email: data.email,
                username: data.username,
                isVideoCreator: data.is_video_creator,
                isAdmin: data.is_admin
              });
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Generate a simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operatorIndex = Math.floor(Math.random() * 3);
    const operator = operators[operatorIndex];

    let answer = 0;
    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
    }

    return { num1, num2, operator, answer };
  };

  // Validate if user has joined Telegram
  const validateTelegramJoin = async (username: string): Promise<boolean> => {
    // In a real app, this would call a backend API to verify
    // For now, we'll just simulate a successful validation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.trim().toLowerCase());
        
      if (checkError) {
        console.error("Error checking existing user:", checkError);
      }
      
      if (existingUsers && existingUsers.length > 0) {
        return { success: false, error: "Email already in use" };
      }
      
      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        return { success: false, error: error.message };
      }
      
      // Check if this is the admin user and update profile accordingly
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && 
          username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_video_creator: true,
            is_admin: true
          })
          .eq('id', data.user?.id);
          
        if (updateError) {
          console.error("Error updating admin privileges:", updateError);
        }
      }
      
      toast({
        title: "Success",
        description: "Your account has been created",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast({
        title: "Success",
        description: "You have been logged out",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        isAuthenticated,
        validateTelegramJoin,
        generateCaptcha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
