
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
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  validateTelegramJoin: (username: string) => Promise<boolean>;
  generateCaptcha: () => { num1: number, num2: number, operator: string, answer: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = "malickirfan00@gmail.com";
const ADMIN_USERNAME = "UmarCryptospace";

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

  const login = (userData: User) => {
    // Check if the user is admin
    const isAdmin = userData.email === ADMIN_EMAIL && userData.username === ADMIN_USERNAME;
    
    const userWithRoles = {
      ...userData,
      isAdmin
    };
    
    setUser(userWithRoles);
    setIsAuthenticated(true);
    localStorage.setItem("crypto_tracker_user", JSON.stringify(userWithRoles));
  };

  const register = (userData: User) => {
    // Check if another user with same email or username already exists
    const storedUsers = localStorage.getItem("crypto_tracker_users") || "[]";
    const users = JSON.parse(storedUsers);
    
    const emailExists = users.some((u: User) => u.email === userData.email);
    const usernameExists = users.some((u: User) => u.username === userData.username);
    
    if (emailExists || usernameExists) {
      throw new Error("Email or username already exists");
    }
    
    // Check if the user is admin
    const isAdmin = userData.email === ADMIN_EMAIL && userData.username === ADMIN_USERNAME;
    
    const userWithRoles = {
      ...userData,
      isAdmin
    };
    
    // Add user to users list
    users.push(userWithRoles);
    localStorage.setItem("crypto_tracker_users", JSON.stringify(users));
    
    // Log the user in
    setUser(userWithRoles);
    setIsAuthenticated(true);
    localStorage.setItem("crypto_tracker_user", JSON.stringify(userWithRoles));
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
