
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthorizeView from "@/components/auth/AuthorizeView";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AuthorizeView>
          <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="text-center max-w-md">
              <h1 className="text-6xl font-bold text-cineniche-purple mb-6">404</h1>
              <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
    </AuthorizeView>

  );
};

export default NotFound;
