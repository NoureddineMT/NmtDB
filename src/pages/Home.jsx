import { useState, useEffect } from "react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    fetchTrendingMovies,
    fetchTopRatedMovies,
    fetchUpcomingMovies,
    fetchPopularMovies,
} from "../api/tmdb";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const Section = ({ title, movies }) => {
    const categoryMap = {
        'Tendances': 'films-tendances',
        'Les mieux notés': 'films-les-mieux-notes',
        'À venir': 'films-a-venir',
        'Populaires': 'films-populaires'
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#ABD2FA]">{title}</h2>
                <Link
                    to={`/category/${categoryMap[title]}?page=1`}
                    className="text-sm sm:text-base text-[#7692FF] hover:text-[#ABD2FA] transition-colors duration-300"
                >
                    Voir tout
                </Link>
            </div>
            <div className="relative">
                <Slider {...settings}>
                    {movies.map((movie) => (
                        <div key={movie.id} className="px-1 sm:px-2">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

const Home = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [trending, topRated, upcoming, popular] = await Promise.all([
                    fetchTrendingMovies(),
                    fetchTopRatedMovies(),
                    fetchUpcomingMovies(),
                    fetchPopularMovies(),
                ]);

                setTrendingMovies(trending.results);
                setTopRatedMovies(topRated.results);
                setUpcomingMovies(upcoming.results);
                setPopularMovies(popular.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#091540] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#ABD2FA] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#091540] py-4 sm:py-8">
            {/* Hero Section */}
            <div className="relative h-[40vh] sm:h-[60vh] mb-8 sm:mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-[#091540] to-transparent z-10"></div>
                <img
                    src="https://image.tmdb.org/t/p/original/1E5baAaEse26fej7uHcjOgEE2t2.jpg"
                    alt="Movie Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center z-20">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl sm:text-5xl font-bold text-[#ABD2FA] mb-2 sm:mb-4">
                            Bienvenue sur NmtDB
                        </h1>
                        <p className="text-lg sm:text-xl text-[#7692FF] mb-4 sm:mb-8">
                            Des millions de films à découvrir. Explorez maintenant.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-2 sm:px-4">
                <Section title="Tendances" movies={trendingMovies} />
                <Section title="Les mieux notés" movies={topRatedMovies} />
                <Section title="À venir" movies={upcomingMovies} />
                <Section title="Populaires" movies={popularMovies} />
            </div>
        </div>
    );
};

export default Home;