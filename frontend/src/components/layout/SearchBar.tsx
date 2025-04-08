import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input"; // adjust if using a custom Input

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-64">
      <Input
        type="search"
        placeholder="Search movies..."
        className="pl-8 pr-8"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hover:text-primary">
          ✕
        </button>
      )}
    </form>
  );
};

export default SearchBar;
