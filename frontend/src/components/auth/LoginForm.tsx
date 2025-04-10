import React, { useState, useEffect } from "react";
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
import { useCookieConsent } from "../../contexts/CookieContext";

const LoginForm: React.FC = () => {
  console.log("[Component Render] LoginForm component is rendering.");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { cookieConsent } = useCookieConsent();

  console.log("[State Initialization] States initialized: email={Email}, loading={Loading}, rememberMe={RememberMe}, error={Error}", 
    email, loading, rememberMe, error);
  console.log(`[Cookie Consent] Current consent status: ${cookieConsent}`);

  useEffect(() => {
    if (cookieConsent === 'denied' && rememberMe) {
      setRememberMe(false);
      console.log("[State Update] rememberMe forced to false due to cookie consent denial");
    }
  }, [cookieConsent, rememberMe]);

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
      console.log(`[State Update] password updated (hidden)`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[Form Submit] Login form submitted with email={Email}, rememberMe={RememberMe}", email, rememberMe);

    setError("");
    console.log("[State Update] Error state cleared");

    if (!email || !password) {
      console.log("[Validation Error] Missing email or password");
      setError("Please fill in all fields.");
      console.log("[State Update] Error set to: Please fill in all fields");
      return;
    }
    console.log("[Validation Success] Email and password provided");

    console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
    const loginUrl = rememberMe
      ? `${import.meta.env.VITE_API_BASE_URL}/auth/login?useCookies=true`
      : `${import.meta.env.VITE_API_BASE_URL}/auth/login?useSessionCookies=true`;
    console.log(`[Login Request] URL: ${loginUrl}`);

    try {
      setLoading(true);
      console.log("[State Update] Loading state set to true");

      const response = await fetch(loginUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(`[Login Response] HTTP status: ${response.status}, OK: ${response.ok}`);

      let data = null;
      const contentLength = response.headers.get("content-length");
      console.log(`[Login Response] Content-Length header: ${contentLength}`);
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
        console.log(`[Login Response] Parsed JSON data:`, data);
      } else {
        console.log("[Login Response] No JSON content to parse");
      }

      if (!response.ok) {
        console.error(`[Login Error] Response error: ${data?.message || "Invalid email or password"}`);
        throw new Error(data?.message || "Invalid email or password");
      }

      console.log("[Login Success] Login successful, navigating to /movies");
      navigate("/movies");
    } catch (error: any) {
      console.error("[Fetch Error] Login attempt failed:", error.message);
      setError(error.message || "Error logging in.");
      console.log("[State Update] Error set to:", error.message || "Error logging in");
    } finally {
      setLoading(false);
      console.log("[State Update] Loading state set to false");
    }
  };

  console.log("[Render] Rendering LoginForm with state: email={Email}, loading={Loading}, error={Error}", email, loading, error);
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

          {cookieConsent !== 'denied' && (
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="rememberme"
                name="rememberme"
                checked={rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="rememberme" className="ml-2 text-sm text-gray-700">
                Remember password
              </label>
            </div>
          )}

          {error && <div className="text-destructive text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>

        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            onClick={() => {
              navigate("/register");
              console.log("[Navigation] Navigating to /register");
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