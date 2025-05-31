import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Star,
  Calendar,
  Check,
  Edit2,
  Trash2,
} from "lucide-react";
import { movieService } from "../firebase.js";

// MovieCard Component
const MovieCard = ({ movie, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[2/3] bg-sage-100 relative overflow-hidden">
        <img
          src={
            movie.poster ||
            "https://via.placeholder.com/300x450/a7b5a0/ffffff?text=No+Image"
          }
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x450/a7b5a0/ffffff?text=No+Image";
          }}
        />
        {movie.watched && (
          <div className="absolute top-2 right-2 bg-forest-600 text-white p-1 rounded-full">
            <Check size={16} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{movie.year}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{movie.rating}/10</span>
          </div>
          {movie.watched_date && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{new Date(movie.watched_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(movie)}
            className="flex-1 bg-sage-500 hover:bg-sage-600 text-white px-3 py-1 rounded text-sm flex items-center justify-center space-x-1 transition-colors"
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(movie.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// MovieForm Component
const MovieForm = ({ movie, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    year: movie?.year || new Date().getFullYear(),
    rating: movie?.rating || 7,
    poster: movie?.poster || "",
    watched: movie?.watched || false,
    watched_date: movie?.watched_date || new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a movie title");
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {movie ? "Edit Movie" : "Add New Movie"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    handleChange("year", parseInt(e.target.value))
                  }
                  min="1900"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) =>
                    handleChange("rating", parseInt(e.target.value))
                  }
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poster URL
              </label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) => handleChange("poster", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="watched"
                checked={formData.watched}
                onChange={(e) => handleChange("watched", e.target.checked)}
                className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-gray-300 rounded"
              />
              <label
                htmlFor="watched"
                className="text-sm font-medium text-gray-700"
              >
                Already watched
              </label>
            </div>

            {formData.watched && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Watched Date
                </label>
                <input
                  type="date"
                  value={formData.watched_date}
                  onChange={(e) => handleChange("watched_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-forest-600 hover:bg-forest-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
              >
                {movie ? "Update" : "Add"} Movie
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load movies on component mount
  useEffect(() => {
    loadMovies();
  }, []);

  // Filter movies based on search term
  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [movies, searchTerm]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const moviesList = await movieService.getMovies();
      setMovies(moviesList);
    } catch (error) {
      console.error("Error loading movies:", error);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMovie = async (movieData) => {
    try {
      setError(null);
      if (editingMovie) {
        await movieService.updateMovie(editingMovie.id, movieData);
      } else {
        await movieService.addMovie(movieData);
      }
      await loadMovies();
      setShowForm(false);
      setEditingMovie(null);
    } catch (error) {
      console.error("Error saving movie:", error);
      setError("Failed to save movie. Please try again.");
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        setError(null);
        await movieService.deleteMovie(movieId);
        await loadMovies();
      } catch (error) {
        console.error("Error deleting movie:", error);
        setError("Failed to delete movie. Please try again.");
      }
    }
  };

  const watchedCount = movies.filter((m) => m.watched).length;
  const avgRating =
    movies.length > 0
      ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(
          1
        )
      : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-olive-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Movies</h1>
              <p className="text-sm text-gray-600 mt-1">
                {movies.length} movies • {watchedCount} watched • ⭐ {avgRating}{" "}
                avg rating
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-forest-600 hover:bg-forest-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add Movie</span>
            </button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Movies Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading movies...</div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm
                ? "No movies found matching your search."
                : "No movies in your collection yet."}
            </div>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Your First Movie
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onEdit={handleEditMovie}
                onDelete={handleDeleteMovie}
              />
            ))}
          </div>
        )}
      </main>

      {/* Movie Form Modal */}
      {showForm && (
        <MovieForm
          movie={editingMovie}
          onSave={handleSaveMovie}
          onCancel={() => {
            setShowForm(false);
            setEditingMovie(null);
          }}
        />
      )}

      <style jsx>{`
        .bg-forest-50 {
          background-color: #f0f4f0;
        }
        .bg-forest-100 {
          background-color: #d4e6d4;
        }
        .bg-forest-500 {
          background-color: #4a7c59;
        }
        .bg-forest-600 {
          background-color: #3d6b47;
        }
        .bg-forest-700 {
          background-color: #2f5235;
        }
        .hover\\:bg-forest-600:hover {
          background-color: #3d6b47;
        }
        .hover\\:bg-forest-700:hover {
          background-color: #2f5235;
        }
        .focus\\:ring-forest-500:focus {
          --tw-ring-color: #4a7c59;
        }
        .text-forest-600 {
          color: #3d6b47;
        }

        .bg-sage-50 {
          background-color: #f5f7f5;
        }
        .bg-sage-100 {
          background-color: #e8ece8;
        }
        .bg-sage-200 {
          background-color: #d1d9d1;
        }
        .bg-sage-500 {
          background-color: #7a8a7a;
        }
        .bg-sage-600 {
          background-color: #677267;
        }
        .hover\\:bg-sage-600:hover {
          background-color: #677267;
        }
        .border-sage-200 {
          border-color: #d1d9d1;
        }

        .bg-olive-50 {
          background-color: #f6f7f2;
        }
        .bg-olive-100 {
          background-color: #e9ede0;
        }
        .bg-olive-500 {
          background-color: #8b8c3a;
        }
      `}</style>
    </div>
  );
}
