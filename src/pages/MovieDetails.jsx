import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchMovieDetails, fetchTrailers } from "../api/tmdb";
import { Star, Clock, Calendar, Heart, ChevronLeft, ArrowLeft, Play, Plus, Check, X } from 'lucide-react';
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
        afterChange: (current) => {
            setCurrentTrailerIndex(current);
        },
        nextArrow: <div style={{ fontSize: '30px', color: '#e6b616' }}>→</div>,
        prevArrow: <div style={{ fontSize: '30px', color: '#e6b616' }}>←</div>,
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

    const handlePlayTrailer = () => {
        setShowTrailer(true);
        setIsLoadingTrailer(true);
        // Implement the logic to fetch and set the selected video
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#091540] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#ABD2FA] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-[#091540] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Une erreur s'est produite lors du chargement du film.</p>
                    <button
                        onClick={handleBack}
                        className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#091540] min-h-screen">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3D518C]"></div>
                <img
                    src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-[60vh] object-cover opacity-30"
                />
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <button
                    onClick={handleBack}
                    className="flex items-center text-[#7692FF] hover:text-[#ABD2FA] transition-colors mb-6"
                >
                    <ChevronLeft className="w-6 h-6 mr-2" />
                    Retour
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                            alt={movie.title}
                            className="rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="md:w-2/3">
                        <h1 className="text-4xl font-bold text-[#ABD2FA] mb-4">
                            {movie.title} <span className="text-[#7692FF]">({new Date(movie.release_date).getFullYear()})</span>
                        </h1>

                        <div className="flex items-center space-x-6 mb-6">
                            <div className="flex items-center text-[#ABD2FA]">
                                <Star className="w-6 h-6 mr-1" />
                                <span className="text-xl font-bold">{movie.vote_average.toFixed(1)}</span>
                            </div>
                            <button
                                onClick={toggleWatchlist}
                                className={`flex items-center space-x-2 px-4 py-2 rounded transition duration-300 transform hover:scale-105 ${isInWatchlist
                                    ? 'bg-[#e6b616] text-black'
                                    : 'bg-[#3D518C] text-[#ABD2FA] hover:bg-[#7692FF]'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                                <span>{isInWatchlist ? 'Retirer de ma liste' : 'Ajouter à ma liste'}</span>
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center space-x-2 bg-[#3D518C] text-[#ABD2FA] px-4 py-2 rounded hover:bg-[#7692FF] transition duration-300 transform hover:scale-105"
                            >
                                <span>Voir les bandes-annonces</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 text-[#3D518C] mb-6">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{movie.release_date}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{movie.runtime} min</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-[#ABD2FA] mb-2">Aperçu</h2>
                            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-[#ABD2FA] font-semibold mb-1">Genre</h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres?.map(genre => (
                                        <span key={genre.id} className="bg-[#3D518C] text-[#ABD2FA] px-3 py-1 rounded-full text-sm">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Langue</h3>
                                <p className="text-[#ABD2FA]">{movie.original_language?.toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-[#ABD2FA] mt-2">Distribution</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {movie.cast?.length > 0 ? (
                                    movie.cast.map(actor => (
                                        <article key={actor.id} className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-6 pb-6 pt-24 max-w-xs mx-auto mt-4 group">
                                            <img
                                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : '/path/to/default-image.jpg'}
                                                alt={actor.name}
                                                className="absolute inset-0 h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
                                            <h3 className="z-10 mt-3 text-2xl font-bold text-white">{actor.name}</h3>
                                            <div className="z-10 text-sm leading-6 text-gray-300">{actor.character}</div>
                                        </article>
                                    ))
                                ) : (
                                    <p className="text-[#ABD2FA]">N/A</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-[#ABD2FA] mb-2">Réalisateur</h2>
                            {movie.director ? (
                                <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-6 pb-6 pt-24 max-w-xs mt-4 group">
                                    <img
                                        src={movie.director_profile_path ? `https://image.tmdb.org/t/p/w200/${movie.director_profile_path}` : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'}
                                        alt={movie.director}
                                        className="absolute inset-0 h-40 w-full object-cover bg-[#3D518C] transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
                                    <h3 className="z-10 mt-3 text-2xl font-bold text-white">{movie.director}</h3>
                                    <div className="z-10 text-sm leading-6 text-gray-300">Réalisateur</div>
                                </article>
                            ) : (
                                <p className="text-[#ABD2FA]">N/A</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative bg-[#091540] border border-[#7692FF] m-4 p-6 w-3/5 min-w-[40%] max-w-[90%] rounded-lg shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between pb-4">
                            <h3 className="text-2xl font-bold text-[#ABD2FA]">Bandes-annonces</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-[#ABD2FA] hover:text-[#e6b616] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="relative border-t border-[#3D518C] py-4">
                            <Slider {...settings}>
                                {trailers.slice(0, 3).map((trailer, index) => (
                                    <div key={trailer.id} className="p-2">
                                        <iframe
                                            width="100%"
                                            height="315"
                                            src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                                            title={trailer.name}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
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