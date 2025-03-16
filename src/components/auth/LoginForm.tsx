
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  
  const { login, generateCaptcha } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Generate captcha on component mount
    setCaptcha(generateCaptcha());
  }, [generateCaptcha]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    // Verify captcha
    if (parseInt(captchaAnswer) !== captcha.answer) {
      toast({
        title: "Error",
        description: "Incorrect captcha answer",
        variant: "destructive",
      });
      setCaptcha(generateCaptcha());
      setCaptchaAnswer("");
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real app, this would authenticate with a backend
      // For this demo, we'll simulate a login
      const isAdmin = email === "malickirfan00@gmail.com" && password === "Irfan@123#13";
      
      login({
        id: "user-1",
        email,
        username: isAdmin ? "UmarCryptospace" : email.split('@')[0],
        isVideoCreator: isAdmin,
      });
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to continue
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="captcha">
                Solve: {captcha.num1} {captcha.operator} {captcha.num2} = ?
              </Label>
              <Input
                id="captcha"
                placeholder="Enter answer"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </div>
        </form>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          Register
        </a>
      </p>
    </div>
  );
}
