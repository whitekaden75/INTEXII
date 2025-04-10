import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Search, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import { useMovies } from "@/contexts/MovieContext";
import { AuthorizedUser } from "../auth/AuthorizeView";
import AdminFeature from "../auth/AdminFeature";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const user = true;
  // const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { filters, setFilters } = useMovies(); // or from props/context

  const handleSearch = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };
  const handleSearchBarClose = () => {
    setFilters({ ...filters, searchQuery: "" });
  };

  const handleLogout = () => {
    // logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Film className="h-6 w-6 text-cineniche-blue" />
          <span>CineNiche</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Link
                to="/movies"
                className="text-sm font-medium hover:text-cineniche-blue transition-colors">
                Movies
              </Link>
              {/* {isAdmin && ( */}
              <Link
                to="/admin"
                className="text-sm font-medium hover:text-cineniche-blue transition-colors">
                Admin
              </Link>
              {/* )} */}
              <Link
                to="/privacy"
                className="text-sm font-medium hover:text-cineniche-blue transition-colors">
                Privacy
              </Link>
            </>
          )}
        </nav>

        {/* Search and Auth (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <SearchBar onSearch={handleSearch} onClose={handleSearchBarClose} />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=demo"
                      alt="user image"
                    />
                    <AvatarFallback>
                      <AuthorizedUser value="email" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <AuthorizedUser value="email" />
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-background border-b transition-transform duration-200 ease-in-out",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}>
        <div className="container py-4 space-y-4">
          <SearchBar onSearch={handleSearch} onClose={handleSearchBarClose} />

          <nav className="space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=demo"
                      alt="user image"
                    />
                    <AvatarFallback>
                      <AuthorizedUser value="email" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      <AuthorizedUser value="email" />
                    </p>
                  </div>
                </div>
                <Link
                  to="/movies"
                  className="block p-2 text-sm hover:bg-secondary rounded-md"
                  onClick={() => setIsMenuOpen(false)}>
                  Movies
                </Link>
                <AdminFeature>
                  <Link
                    to="/admin"
                    className="block p-2 text-sm hover:bg-secondary rounded-md"
                    onClick={() => setIsMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                </AdminFeature>
                <Link
                  to="/privacy"
                  className="block p-2 text-sm hover:bg-secondary rounded-md"
                  onClick={() => setIsMenuOpen(false)}>
                  Privacy Policy
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 text-sm hover:bg-secondary rounded-md"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}>
                  Log in
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/register");
                    setIsMenuOpen(false);
                  }}>
                  Sign up
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
