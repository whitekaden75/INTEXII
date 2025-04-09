import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleLoginButton from "./GoogleLoginButton";
import { postData } from "../../apiService";  // Adjust path if needed


const LoginForm: React.FC = () => {

  console.log("[Component Render] LoginForm component is rendering.");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  console.log("[State Initialization] States initialized with default values.");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    console.log(`[Input Change] Input "${name}" changed. Type: ${type}, Value: ${type === "checkbox" ? checked : value}`);

    if (type === "checkbox") {
      setRememberMe(checked);
      console.log(`[State Update] rememberMe set to: ${checked}`);
    } else if (name === "email") {
      setEmail(value);
      console.log(`[State Update] email set to: ${value}`);
    } else if (name === "password") {
      setPassword(value);
      console.log(`[State Update] password updated.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
  
    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
  
    // Determine login URL based on rememberMe flag
    const loginEndpoint = rememberMe
      ? `/auth/login?useCookies=true`
      : `/auth/login?useSessionCookies=true`;
  
    try {
      setLoading(true);
  
      // Call the `postData` function from apiService.js
      const response = await postData(loginEndpoint, { email, password });
  
      if (response.status === 200) {
        // If status is 200, login is successful
        console.log("[Login Success] Login successful. Navigating to /movies...");
        navigate("/movies");
      } else {
        setError("Invalid login details.");
      }
    } catch (error: any) {
      setError(error.message || "Error logging in.");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Log In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="yourname@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-xs text-cineniche-purple hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="rememberme"
              name="rememberme"
              checked={rememberMe}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="rememberme">
              Remember password
            </label>
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            <span>Demo accounts:</span>
            <div className="flex justify-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail("test@test.com");
                  setPassword("Testing1234!");
                  console.log("[Demo Account] User demo account selected.");
                }}>
                User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail("admin@test.com");
                  setPassword("Testing1234!");
                  console.log("[Demo Account] Admin demo account selected.");
                }}>
                Admin
              </Button>
              <GoogleLoginButton />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            onClick={() => {
              navigate("/register");
              console.log("[Navigation] Navigating to /register.");
            }}
            className="text-cineniche-purple hover:underline cursor-pointer">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
