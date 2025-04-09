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
    console.log("[Form Submit] Login form submitted.");

    setError(""); // Clear any previous errors
    console.log("[State Update] Error state cleared.");

    // Validate inputs
    if (!email || !password) {
      console.log("[Validation Error] Missing email or password.");
      setError("Please fill in all fields.");
      return;
    }
    console.log("[Validation Success] Email and password provided.");

    // Determine login URL based on rememberMe flag
    const loginUrl = rememberMe
      ? 'https://intex212-dddke6d2evghbydw.eastus-01.azurewebsites.net/login?useCookies=true'
      : 'https://intex212-dddke6d2evghbydw.eastus-01.azurewebsites.net/login?useSessionCookies=true';
    console.log(`[Login Request] URL: ${loginUrl}`);
    console.log(`[Login Request] Attempting login with email: ${email}`);

    try {
      setLoading(true);
      console.log("[State Update] Loading state set to true.");

      const response = await fetch(loginUrl, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent & received
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(`[Login Response] HTTP status: ${response.status}`);

      // Only parse JSON if there is content
      let data = null;
      const contentLength = response.headers.get("content-length");
      console.log(`[Login Response] Content-Length header: ${contentLength}`);
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
        console.log(`[Login Response] Parsed JSON data:`, data);
      } else {
        console.log("[Login Response] No JSON content to parse.");
      }

      if (!response.ok) {
        console.error(`[Login Error] Response error: ${data?.message || "Invalid email or password."}`);
        throw new Error(data?.message || "Invalid email or password.");
      }

      console.log("[Login Success] Login successful. Navigating to /movies...");
      navigate("/movies");
    } catch (error: any) {
      console.error("[Fetch Error] Login attempt failed:", error);
      setError(error.message || "Error logging in.");
      console.log("[State Update] Error state updated with error message.");
    } finally {
      setLoading(false);
      console.log("[State Update] Loading state set to false.");
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
