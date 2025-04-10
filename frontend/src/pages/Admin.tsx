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

  const { adminMovies, adminPage, adminPageSize, adminTotalPages, setAdminPage, setAdminPageSize, filters, setFilters, addMovie, updateMovie, deleteMovie } = useMovies();

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

//
  //const [searchQuery, setSearchQuery] = useState('');
  
  
// newBranchKaden
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
    setAdminPage(1);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFilters({ ...filters, searchQuery: value });
    setAdminPage(1);
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
    setAdminPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setAdminPageSize(Number(value));
    setAdminPage(1); // Reset to first page when changing items per page
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
          onClick={() => adminPage > 1 && handlePageChange(adminPage - 1)}
          className={adminPage === 1 ? 'pointer-events-none opacity-50' : ''}

        />
      </PaginationItem>
    );

    // First page
    if (adminPage > 2) {
      links.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if needed
    if (adminPage > 3) {
      links.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Pages around current

    for (let i = Math.max(1, adminPage - 1); i <= Math.min(adminTotalPages, adminPage + 1); i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={adminPage === i}
            onClick={() => handlePageChange(i)}
          >

            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if needed
    if (adminPage < adminTotalPages - 2) {
      links.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page
    if (adminPage < adminTotalPages - 1 && adminTotalPages > 1) {
      links.push(
        <PaginationItem key={adminTotalPages}>
          <PaginationLink onClick={() => handlePageChange(adminTotalPages)}>
            {adminTotalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    links.push(
      <PaginationItem key="next">

        <PaginationNext 
          onClick={() => adminPage < adminTotalPages && handlePageChange(adminPage + 1)}
          className={adminPage === adminTotalPages ? 'pointer-events-none opacity-50' : ''}
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
                  value={String(adminPageSize)}
                  onValueChange={handleItemsPerPageChange}

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
              {adminMovies.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No movies found</p>
                </div>
              ) : (
                adminMovies.map((movie) => (
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
            {adminTotalPages > 1 && (
              <Pagination>
                <PaginationContent>{renderPaginationLinks()}</PaginationContent>
              </Pagination>
            )}

            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Page {adminPage} of {adminTotalPages}
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
