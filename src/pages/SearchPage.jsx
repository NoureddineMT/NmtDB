import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import { FaStar, FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setIsInWatchlist(watchlist.some(m => m.id === movie.id));
    }, [movie]);

    const toggleWatchlist = (e) => {
        e.stopPropagation();
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (isInWatchlist) {
            const newWatchlist = watchlist.filter(m => m.id !== movie.id);
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
        } else {
            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
        }
        setIsInWatchlist(!isInWatchlist);
    };

    const handleMovieClick = () => {
        const currentPath = window.location.pathname + window.location.search;
        localStorage.setItem('previousPage', currentPath);
        window.location.href = `/movie/${movie.id}`;
    };

    const getRatingColor = (rating) => {
        if (rating >= 6.8) return 'text-green-500';
        if (rating >= 5) return 'text-[#e6b616]';
        return 'text-red-500';
    };

    return (
        <div
            onClick={handleMovieClick}
            className="group relative overflow-hidden rounded-lg bg-[#3D518C] transition-all duration-300 hover:scale-105"
        >
            <div className="relative">
                <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D518C] via-[#3D518C]/50 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0"></div>
                <button
                    onClick={toggleWatchlist}
                    className="absolute top-2 right-2 z-20 p-2 rounded-full transition-colors duration-300"
                    style={{ background: 'none', border: 'none', padding: '0.5rem' }}
                >
                    {isInWatchlist ? (
                        <FaHeart className="w-5 h-5 text-pink-500 fill-current hover:text-pink-600 transition-colors duration-300" />
                    ) : (
                        <FaRegHeart className="w-5 h-5 text-[#ABD2FA] hover:text-pink-500 transition-colors duration-300" />
                    )}
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 transition-transform duration-300 group-hover:translate-y-full">
                <div className="flex items-center space-x-1 mb-2">
                    <FaStar className={`w-4 h-4 ${getRatingColor(movie.vote_average)}`} />
                    <span className={getRatingColor(movie.vote_average)}>{movie.vote_average.toFixed(1)}</span>
                </div>
                <h3 className="text-[#7692FF] font-medium group-hover:text-[#ABD2FA] line-clamp-2 transition-colors duration-300">
                    {movie.title}
                </h3>
                <p className="text-[#ABD2FA] text-sm mt-1">
                    {new Date(movie.release_date).getFullYear()}
                </p>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center space-x-1 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-sm rounded bg-[#3D518C] text-[#ABD2FA] hover:bg-[#7692FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
                &lt;
            </button>
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-2 py-1 text-sm rounded bg-[#3D518C] text-[#ABD2FA] hover:bg-[#7692FF] transition-colors duration-300"
                    >
                        1
                    </button>
                    {startPage > 2 && (
                        <span className="px-2 py-1 text-sm text-[#7692FF]">...</span>
                    )}
                </>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-2 py-1 text-sm rounded transition-colors duration-300 ${currentPage === page
                        ? 'bg-[#7692FF] text-[#091540]'
                        : 'bg-[#3D518C] text-[#ABD2FA] hover:bg-[#7692FF]'
                        }`}
                >
                    {page}
                </button>
            ))}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="px-2 py-1 text-sm text-[#7692FF]">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-2 py-1 text-sm rounded bg-[#3D518C] text-[#ABD2FA] hover:bg-[#7692FF] transition-colors duration-300"
                    >
                        {totalPages}
                    </button>
                </>
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm rounded bg-[#3D518C] text-[#ABD2FA] hover:bg-[#7692FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
                &gt;
            </button>
        </div>
    );
};

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const page = parseInt(searchParams.get("page")) || 1;
        setCurrentPage(page);
    }, [searchParams]);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!query.trim()) {
                setMovies([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await searchMovies(query, currentPage);
                if (data && data.results) {
                    setMovies(data.results);
                    setTotalPages(Math.min(data.total_pages, 500));
                } else {
                    setMovies([]);
                    setTotalPages(1);
                }
            } catch (err) {
                setError("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
                console.error("Erreur de recherche:", err);
                setMovies([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [query, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        navigate(`/search?q=${query}&page=${newPage}`, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#091540] py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#ABD2FA] mb-4">
                        Résultats de recherche pour "{query}"
                    </h1>
                    {error && (
                        <div className="text-red-500 text-center py-4">
                            Une erreur s'est produite lors de la recherche. Veuillez réessayer.
                        </div>
                    )}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-10 h-10 border-4 border-[#ABD2FA] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {!loading && !error && movies.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}

                {!loading && !error && movies.length === 0 && (
                    <div className="text-center py-12">
                        <FaSearch className="w-16 h-16 text-[#7692FF] mx-auto mb-4" />
                        <p className="text-[#ABD2FA] text-lg">
                            Aucun film trouvé pour "{query}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage; 