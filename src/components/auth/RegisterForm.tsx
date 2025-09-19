import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [telegramVerified, setTelegramVerified] = useState(false);
  const [showTelegramVerification, setShowTelegramVerification] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  const { register, validateTelegramJoin, generateCaptcha } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Generate captcha on component mount
    setCaptcha(generateCaptcha());
  }, [generateCaptcha]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    
    if (!email || !password || !username) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
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
      
      const { success, error } = await register(email, username, password);
      
      if (success) {
        toast({
          title: "Success", 
          description: "Registration successful! You can now log in.",
        });
        
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setUsername("");
        setCaptchaAnswer("");
        setCaptcha(generateCaptcha());
        setRegisterError(null);
      } else {
        const errorMessage = error || "Failed to create account. Please try again.";
        setRegisterError(errorMessage);
        
        // Generate a new captcha
        setCaptcha(generateCaptcha());
        setCaptchaAnswer("");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.message?.includes('fetch') || error?.message?.includes('network') 
        ? "Network connection error. Please check your internet connection and try again."
        : "Something went wrong during registration. Please try again.";
      setRegisterError(errorMessage);
      
      // Generate a new captcha
      setCaptcha(generateCaptcha());
      setCaptchaAnswer("");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTelegram = async () => {
    try {
      setIsLoading(true);
      const verified = await validateTelegramJoin(username);
      
      if (verified) {
        setTelegramVerified(true);
        setShowTelegramVerification(false);
        toast({
          title: "Success",
          description: "Telegram verification successful. Please complete your registration.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to verify Telegram join. Please make sure you've joined the channel.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showTelegramVerification) {
    return (
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Telegram Verification</h1>
          <p className="text-sm text-muted-foreground">
            Please join our Telegram channel to continue registration
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <a 
            href="https://t.me/+EAqX3emRuOAwNTY1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center justify-center gap-1"
          >
            Join our Telegram Channel <ExternalLink className="h-4 w-4" />
          </a>
          <Button onClick={verifyTelegram} disabled={isLoading}>
            {isLoading ? "Verifying..." : "I've Joined - Verify My Membership"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowTelegramVerification(false)}
          >
            Back to Registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleRegister}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                disabled={isLoading}
                required
              />
            </div>
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
                required
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
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>
      </div>
      {registerError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{registerError}</AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-muted-foreground text-center">
        By creating an account, you agree to our terms and conditions
      </p>
    </div>
  );
}