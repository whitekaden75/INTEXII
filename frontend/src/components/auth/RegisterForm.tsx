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

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // validate email and passwords
      if (!email || !password || !confirmPassword) {
          setError('Please fill in all fields.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError('Please enter a valid email address.');
      } else if (password !== confirmPassword) {
          setError('Passwords do not match.');
      } else {
          // clear error message
          setError('');
          // post data to the /register api
          fetch('https://intexii-team2-12-b9b2h9ead7cwd9ax.eastus-01.azurewebsites.net/auth/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              password: password,
          }),
          })
          //.then((response) => response.json())
          .then((data) => {
              // handle success or error from the server
              console.log(data);
              if (data.ok) setError('Successful registration. Please log in.');
              else setError('Error registering.');
          })
          .catch((error) => {
              // handle network error
              console.error(error);
              setError('Error registering.');
          });
      }
      };

  // fix the commit
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await register(email, password);
  //     navigate("/movies");
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setError(error.message);
  //     } else {
  //       setError("Failed to create account");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Join CineNiche to discover unique films
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Go to Login Page{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-cineniche-purple hover:underline cursor-pointer">
            Log in
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
