import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Settings } from "lucide-react";
import Layout from "@/components/layout/Layout";
import MovieListItem from "@/components/admin/MovieListItem";
import MovieForm from "@/components/admin/MovieForm";
import { useMovies, Movie } from "@/contexts/MovieContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  // const { isAuthenticated, isAdmin } = useAuth();
  const {
    movies,
    filteredMovies,
    filters,
    setFilters,
    addMovie,
    updateMovie,
    deleteMovie,
  } = useMovies();
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedMovies, setPaginatedMovies] = useState<Movie[]>([]);

  // Redirect if not authenticated or not admin
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   } else if (!isAdmin) {
  //     navigate("/movies");
  //   }
  // }, [isAuthenticated, isAdmin, navigate]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchQuery });
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFilters({ ...filters, searchQuery: value });
    setCurrentPage(1);
  };

  // Calculate pagination
  useEffect(() => {
    // Calculate total pages
    const total = Math.ceil(filteredMovies.length / itemsPerPage);
    setTotalPages(total);

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedMovies(filteredMovies.slice(startIndex, endIndex));
  }, [filteredMovies, currentPage, itemsPerPage]);

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle edit movie
  const handleEditMovie = (movie: Movie) => {
    setCurrentMovie(movie);
    setShowEditForm(true);
  };
  const [localMovies, setLocalMovies] = useState<Movie[]>([]);
  // Handle delete movie
  const handleMovieDeleted = (deletedId: string) => {
    setLocalMovies((prev) => prev.filter((m) => m.showId !== deletedId));
    window.location.reload();
  };

  // Handle add movie
  const handleAddMovie = (movieData: Omit<Movie, "id">) => {
    addMovie(movieData);
    setShowAddForm(false);
  };

  // Handle update movie
  const handleUpdateMovie = (movieData: Partial<Movie>) => {
    if (currentMovie) {
      updateMovie(currentMovie.showId, movieData);
      setShowEditForm(false);
      setCurrentMovie(null);
    }
  };

  // Generate pagination links
  const renderPaginationLinks = () => {
    const links = [];

    // Previous button
    links.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // First page
    if (currentPage > 2) {
      links.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if needed
    if (currentPage > 3) {
      links.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Pages around current
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      links.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page
    if (currentPage < totalPages - 1 && totalPages > 1) {
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    links.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return links;
  };

  // If not authenticated or not admin, don't render anything
  // if (!isAuthenticated || !isAdmin) {
  //   return null;
  // }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your movie catalog</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Movie
          </Button>
        </div>

        <Tabs defaultValue="movies" className="w-full">
          <TabsContent value="movies" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>

            {/* Movies List */}
            <div className="border rounded-lg">
              {paginatedMovies.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No movies found</p>
                </div>
              ) : (
                paginatedMovies.map((movie) => (
                  <MovieListItem
                    key={movie.showId}
                    movie={movie}
                    onEdit={() => handleEditMovie(movie)}
                    onMovieDeleted={handleMovieDeleted}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>{renderPaginationLinks()}</PaginationContent>
              </Pagination>
            )}

            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Showing {paginatedMovies.length} of {filteredMovies.length} movies
              {filteredMovies.length !== movies.length && (
                <span> (filtered from {movies.length} total)</span>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Movie Form Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new movie to the catalog
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4">
            <MovieForm
              onSubmit={handleAddMovie}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Movie Form Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>Update the movie details</DialogDescription>
          </DialogHeader>

          <div className="pt-4">
            {currentMovie && (
              <MovieForm
                movie={currentMovie}
                onSubmit={handleUpdateMovie}
                onCancel={() => setShowEditForm(false)}
                isEditing
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
