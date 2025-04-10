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
  const {
    adminMovies,
    adminPage,
    adminPageSize,
    setAdminPage,
    setAdminPageSize,
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

  // Local state for pagination
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedMovies, setPaginatedMovies] = useState<Movie[]>([]);

  // Handle search input changes
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

  // Calculate paginated movies whenever adminMovies, searchQuery, adminPage, or adminPageSize changes.
  useEffect(() => {
    // First, filter the movies based on the search query.
    const filteredMovies = adminMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total pages based on the filtered list.
    const total = Math.ceil(filteredMovies.length / adminPageSize);
    setTotalPages(total);

    // Calculate the start and end indexes for the current page
    const startIndex = (adminPage - 1) * adminPageSize;
    const endIndex = startIndex + adminPageSize;
    setPaginatedMovies(filteredMovies.slice(startIndex, endIndex));
  }, [adminMovies, searchQuery, adminPage, adminPageSize]);

  // Handle page change from the pagination component.
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

  // Handle delete movie
  const handleMovieDeleted = (deletedId: string) => {
    // Update local movies list if needed.
    // Alternatively, your context should update adminMovies upon deletion.
    // For simplicity, we'll reload the page.
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

  // Render pagination links
  const renderPaginationLinks = () => {
    const links = [];

    // Previous button
    links.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => adminPage > 1 && handlePageChange(adminPage - 1)}
          className={adminPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // If current page is beyond the first two pages, show first page link.
    if (adminPage > 2) {
      links.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis when current page is far from first page
    if (adminPage > 3) {
      links.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Render one page before, current, and one page after
    for (
      let i = Math.max(1, adminPage - 1);
      i <= Math.min(totalPages, adminPage + 1);
      i++
    ) {
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

    // Ellipsis when current page is far from last page
    if (adminPage < totalPages - 2) {
      links.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Render last page if necessary
    if (adminPage < totalPages - 1 && totalPages > 1) {
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
            adminPage < totalPages && handlePageChange(adminPage + 1)
          }
          className={
            adminPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return links;
  };

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
                >
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
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search movies"
                />
                <Button type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Movies List - Render the paginated movies */}
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
              Page {adminPage} of {totalPages}
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
