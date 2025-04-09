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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      console.log(`[Input Change] Checkbox "${name}" changed to: ${checked}`);
      setRememberMe(checked);
    } else if (name === 'email') {
      console.log(`[Input Change] Email input changed to: ${value}`);
      setEmail(value);
    } else if (name === 'password') {
      console.log(`[Input Change] Password input changed.`);
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`[Form Submit] Login form submitted.`);
    setError(''); // clear any previous errors

    // Validate inputs
    if (!email || !password) {
      console.log(`[Validation Error] Missing email or password.`);
      setError('Please fill in all fields.');
      return;
    }
    
    // Determine login URL based on rememberme flag
    const loginUrl = rememberMe
      ? 'https://intex212-dddke6d2evghbydw.eastus-01.azurewebsites.net/login?useCookies=true'
      : 'https://intex212-dddke6d2evghbydw.eastus-01.azurewebsites.net/login?useSessionCookies=true';
    console.log(`[Login Request] URL: ${loginUrl}`);
    console.log(`[Login Request] Attempting login with email: ${email}`);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include', // ensures cookies are sent & received
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log(`[Login Response] HTTP status: ${response.status}`);
      console.log(`[Login Response] Full response:`, response);

      // Only parse JSON if there is content
      let data = null;
      const contentLength = response.headers.get('content-length');
      console.log(`[Login Response] Content-Length header: ${contentLength}`);
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
        console.log(`[Login Response] Parsed JSON data:`, data);
      } else {
        console.log(`[Login Response] No JSON content to parse.`);
      }
      
      if (!response.ok) {
        console.error(`[Login Error] Response error: ${data?.message || 'Invalid email or password.'}`);
        throw new Error(data?.message || 'Invalid email or password.');
      }
      
      console.log(`[Login Success] Login successful. Navigating to /competition...`);
      navigate('/competition');
    } catch (error: any) {
      console.error(`[Fetch Error] Login attempt failed:`, error);
      setError(error.message || 'Error logging in.');
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     await login(email, password);
  //     navigate("/movies");
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setError(error.message);
  //     } else {
  //       setError("Failed to log in");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
                }}>
                User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail("admin@test.com");
                  setPassword("Testing1234!");
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
            onClick={() => navigate("/register")}
            className="text-cineniche-purple hover:underline cursor-pointer">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
