import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchMovieDetails, fetchTrailers } from "../api/tmdb";
import {
    FaStar,
    FaClock,
    FaCalendar,
    FaHeart,
    FaChevronLeft,
    FaPlay,
    FaPlus,
    FaCheck,
    FaTimes
} from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [videos, setVideos] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailers, setTrailers] = useState([]);
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const data = await fetchMovieDetails(id);
                if (data) {
                    setMovie(data);
                    const trailersData = await fetchTrailers(id);
                    setTrailers(trailersData);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
                console.error("Error fetching movie details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    useEffect(() => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setIsInWatchlist(watchlist.some(m => m.id === movie?.id));
    }, [movie]);

    const toggleWatchlist = () => {
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

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current) => setCurrentTrailerIndex(current),
        nextArrow: <div className="slick-arrow slick-next text-3xl text-yellow-400 hover:text-yellow-300">→</div>,
        prevArrow: <div className="slick-arrow slick-prev text-3xl text-yellow-400 hover:text-yellow-300">←</div>,
    };

    const handleBack = () => {
        const previousPage = localStorage.getItem('previousPage');
        if (previousPage) {
            localStorage.removeItem('previousPage');
            navigate(previousPage);
        } else {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#091540] to-[#1a1a2e] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#091540] to-[#1a1a2e] flex items-center justify-center">
                <div className="text-center bg-[#1a1a2e] p-8 rounded-lg shadow-xl">
                    <p className="text-red-400 text-xl mb-6">Une erreur s'est produite lors du chargement du film.</p>
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 mx-auto text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                        <FaChevronLeft className="w-5 h-5" />
                        <span>Retour</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#091540] to-[#1a1a2e] min-h-screen">
            {/* Backdrop Image Section */}
            <div className="relative h-[70vh]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#091540]/70 to-[#1a1a2e]"></div>
                <img
                    src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 -mt-96 relative z-10">
                <button
                    onClick={handleBack}
                    className="flex items-center text-[#ABD2FA] hover:text-white transition-colors mb-8 bg-[#1a1a2e]/50 px-4 py-2 rounded-full"
                >
                    <FaChevronLeft className="w-5 h-5 mr-2" />
                    <span>Retour</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Poster Section */}
                    <div className="lg:w-1/3">
                        <div className="relative group">
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                alt={movie.title}
                                className="rounded-xl shadow-2xl transform transition duration-300 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#ABD2FA] text-[#1B2CC1] px-6 py-3 rounded-full flex items-center gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                >
                                    <FaPlay className="w-4 h-4" />
                                    <span>Voir la bande-annonce</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:w-2/3">
                        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                            {movie.title}
                            <span className="text-[#ABD2FA] text-3xl ml-4">
                                ({new Date(movie.release_date).getFullYear()})
                            </span>
                        </h1>

                        {/* Rating and Actions */}
                        <div className="flex flex-wrap items-center gap-6 mb-8">
                            <div className="flex items-center bg-[#1a1a2e]/50 px-4 py-2 rounded-full">
                                <FaStar className="w-6 h-6 text-yellow-400 mr-2" />
                                <span className="text-2xl font-bold text-white">
                                    {movie.vote_average.toFixed(1)}
                                </span>
                            </div>

                            <button
                                onClick={toggleWatchlist}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full transition duration-300 ${isInWatchlist
                                    ? 'bg-[#ABD2FA] text-[#1B2CC1]'
                                    : 'bg-[#1a1a2e]/50 text-[#ABD2FA] hover:bg-[#ABD2FA] hover:text-[#1B2CC1]'
                                    }`}
                            >
                                {isInWatchlist ? <FaCheck className="w-5 h-5" /> : <FaPlus className="w-5 h-5" />}
                                <span>{isInWatchlist ? 'Dans ma liste' : 'Ajouter à ma liste'}</span>
                            </button>
                        </div>

                        {/* Movie Info */}
                        <div className="flex flex-wrap gap-4 text-white/70 mb-8">
                            <div className="flex items-center">
                                <FaCalendar className="w-4 h-4 mr-2" />
                                <span>{new Date(movie.release_date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center">
                                <FaClock className="w-4 h-4 mr-2" />
                                <span>{movie.runtime} minutes</span>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">Synopsis</h2>
                            <p className="text-white/80 leading-relaxed text-lg">{movie.overview}</p>
                        </div>

                        {/* Genres */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-white mb-3">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map(genre => (
                                    <span
                                        key={genre.id}
                                        className="bg-[#1a1a2e]/50 text-[#ABD2FA] px-4 py-1 rounded-full text-sm"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cast Section */}
                {movie.cast?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-semibold text-white mb-6">Distribution</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                            {movie.cast.slice(0, 6).map(actor => (
                                <div
                                    key={actor.id}
                                    className="bg-[#1a1a2e]/50 rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                                >
                                    <img
                                        src={
                                            actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                                                : 'https://via.placeholder.com/200x300?text=No+Image'
                                        }
                                        alt={actor.name}
                                        className="w-full aspect-[2/3] object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-white font-medium text-lg truncate">{actor.name}</h3>
                                        <p className="text-white/60 text-sm truncate">{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Director Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold text-white mb-6">Réalisateur</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                        <div className="bg-[#1a1a2e]/50 rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                            <img
                                src={
                                    movie.director_profile_path
                                        ? `https://image.tmdb.org/t/p/w200/${movie.director_profile_path}`
                                        : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
                                }
                                alt={movie.director}
                                className="w-full aspect-[2/3] object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-white font-medium text-lg truncate">{movie.director}</h3>
                                <p className="text-white/60 text-sm truncate">Réalisateur</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="w-11/12 max-w-5xl bg-[#1a1a2e] rounded-xl overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h3 className="text-2xl font-bold text-white">Bandes-annonces</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <FaTimes className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <Slider {...settings}>
                                {trailers.slice(0, 3).map((trailer) => (
                                    <div key={trailer.id} className="aspect-video">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                                            title={trailer.name}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="rounded-lg"
                                        ></iframe>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;