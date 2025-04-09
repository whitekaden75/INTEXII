import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import api from "@/api/api";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      console.log(`[Input Change] Checkbox "${name}" changed to: ${checked}`);
      setRememberme(checked);
    } else if (name === "email") {
      console.log(`[Input Change] Email input changed to: ${value}`);
      setEmail(value);
    } else if (name === "password") {
      console.log(`[Input Change] Password input changed.`);
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    console.log(`[Navigation] Navigating to the register page.`);
    navigate("/register");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      sessionStorage.removeItem("isAuthRedirecting");
      navigate("/movies");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "Error logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="yourname@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="rememberme"
              name="rememberme"
              type="checkbox"
              checked={rememberme}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="rememberme" className="text-sm font-medium">
              Remember password
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleRegisterClick}
          >
            Register
          </Button>

          <hr className="my-4" />

          <Button
            type="button"
            className="w-full bg-google text-white hover:bg-google-dark"
          >
            <i className="fa-brands fa-google mr-2"></i> Sign in with Google
          </Button>

          <Button
            type="button"
            className="w-full bg-facebook text-white hover:bg-facebook-dark"
          >
            <i className="fa-brands fa-facebook-f mr-2"></i> Sign in with
            Facebook
          </Button>
        </form>

        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
