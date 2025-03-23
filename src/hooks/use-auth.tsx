
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  isVideoCreator: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  validateTelegramJoin: (username: string) => Promise<boolean>;
  generateCaptcha: () => { num1: number, num2: number, operator: string, answer: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = "malickirfan00@gmail.com";
const ADMIN_USERNAME = "UmarCryptospace";
const ADMIN_PASSWORD = "Irfan@123#13";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user exists in local storage on mount
    const storedUser = localStorage.getItem("crypto_tracker_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
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

  const login = (email: string, password: string): boolean => {
    try {
      // Get users from localStorage - make case insensitive for email
      const storedUsers = localStorage.getItem("crypto_tracker_users") || "[]";
      const users = JSON.parse(storedUsers);
      
      // Check if user exists with matching email and password - case insensitive for email
      const matchedUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!matchedUser) {
        // Special case for admin login
        if (
          email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && 
          password === ADMIN_PASSWORD
        ) {
          const adminUser = {
            id: "admin-1",
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            isVideoCreator: true,
            isAdmin: true
          };
          
          setUser(adminUser);
          setIsAuthenticated(true);
          localStorage.setItem("crypto_tracker_user", JSON.stringify(adminUser));
          return true;
        }
        return false;
      }
      
      // Create user with admin flag if applicable
      const userWithRoles = {
        ...matchedUser,
        isAdmin: matchedUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && 
                matchedUser.username.toLowerCase() === ADMIN_USERNAME.toLowerCase()
      };
      
      delete userWithRoles.password; // Don't store password in session
      
      setUser(userWithRoles);
      setIsAuthenticated(true);
      localStorage.setItem("crypto_tracker_user", JSON.stringify(userWithRoles));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = (email: string, username: string, password: string): boolean => {
    try {
      // Check if users exist in localStorage and use default empty array if not
      const storedUsers = localStorage.getItem("crypto_tracker_users") || "[]";
      const users = JSON.parse(storedUsers);
      
      // Check if another user with same email or username already exists (case insensitive)
      const emailExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      const usernameExists = users.some((u: any) => u.username.toLowerCase() === username.toLowerCase());
      
      if (emailExists || usernameExists) {
        return false;
      }
      
      // Check if the user is admin
      const isAdmin = 
        email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && 
        username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && 
        password === ADMIN_PASSWORD;
      
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        username,
        password, // Store password for login verification
        isVideoCreator: isAdmin,
        isAdmin
      };
      
      // Add user to users list
      users.push(newUser);
      localStorage.setItem("crypto_tracker_users", JSON.stringify(users));
      
      // Create session user without password
      const sessionUser = { ...newUser };
      delete sessionUser.password;
      
      // Log the user in
      setUser(sessionUser);
      setIsAuthenticated(true);
      localStorage.setItem("crypto_tracker_user", JSON.stringify(sessionUser));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("crypto_tracker_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
