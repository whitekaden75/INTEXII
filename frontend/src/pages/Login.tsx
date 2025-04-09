import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import AuthorizeView from "@/components/auth/AuthorizeView";
import { Cookie } from "lucide-react";
import CookieConsent from "@/components/auth/CookieConsent";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Clear any redirect flags when the login page mounts
  React.useEffect(() => {
    console.log("Login page mounted, clearing redirect flags");
    sessionStorage.removeItem("isAuthRedirecting");
  }, []);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/movies");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="container py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
      <CookieConsent />
    </Layout>
  );
};

export default Login;
