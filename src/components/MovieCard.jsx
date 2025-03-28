import { useState, useEffect } from "react";
import { FaStar, FaRegHeart, FaHeart } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const navigate = useNavigate();

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
        const currentPath = window.location.pathname;
        localStorage.setItem('previousPage', currentPath);
        navigate(`/movie/${movie.id}`);
    };

    const getRatingColor = (rating) => {
        if (rating >= 6.8) return 'text-green-500';
        if (rating >= 5) return 'text-[#e6b616]';
        return 'text-red-500';
    };

    return (
        <div
            onClick={handleMovieClick}
            className="group relative overflow-hidden rounded-lg bg-[#3D518C] transition-all duration-300 hover:scale-105 w-full aspect-[2/3]"
        >
            <div className="relative w-full h-full">
                <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 transform translate-y-0 transition-transform duration-300 group-hover:translate-y-full">
                <div className="flex items-center space-x-1 mb-1 sm:mb-2">
                    <FaStar className={`w-3 h-3 sm:w-4 sm:h-4 ${getRatingColor(movie.vote_average)}`} />
                    <span className={`text-sm sm:text-base ${getRatingColor(movie.vote_average)}`}>{movie.vote_average.toFixed(1)}</span>
                </div>
                <h3 className="text-[#7692FF] font-medium group-hover:text-[#ABD2FA] line-clamp-2 transition-colors duration-300 text-sm sm:text-base">
                    {movie.title}
                </h3>
                <p className="text-[#ABD2FA] text-xs sm:text-sm mt-1">
                    {new Date(movie.release_date).getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default MovieCard; 