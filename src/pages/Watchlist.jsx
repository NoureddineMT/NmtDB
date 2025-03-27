import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaTrash } from 'react-icons/fa';
import { TbMovie } from "react-icons/tb";

const getRatingColor = (rating) => {
    if (rating >= 6.8) return 'text-green-500';
    if (rating >= 5) return 'text-[#e6b616]';
    return 'text-red-500';
};

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setWatchlist(savedWatchlist);
    }, []);

    const removeFromWatchlist = (movieId) => {
        const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setWatchlist(updatedWatchlist);
    };

    if (watchlist.length === 0) {
        return (
            <div className="min-h-screen bg-[#091540] flex flex-col items-center justify-center px-4">
                <div className="bg-[#3D518C] p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold text-[#ABD2FA] mb-6">Ma Liste de Films</h1>
                    <p className="text-[#ABD2FA] text-xl mb-4">Votre liste est vide</p>
                    <p className="text-[#7692FF] text-sm mb-8">
                        Les films que vous ajoutez à votre liste sont sauvegardés localement dans votre navigateur et resteront disponibles même après la fermeture de la page.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 bg-[#e6b616] text-black px-6 py-3 rounded-lg hover:bg-[#d4a017] transition duration-300 transform hover:scale-105 font-semibold"
                    >
                        <span>Explorer les Films</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#091540] py-12 px-4">
            <div className="container mx-auto">
                <div className="bg-[#3D518C] p-8 rounded-2xl shadow-xl mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <TbMovie className="w-10 h-10 text-[#ABD2FA] leading-none" />
                        <h1 className="text-4xl font-bold text-[#ABD2FA] leading-none">Ma Liste de Films</h1>
                    </div>
                    <p className="text-[#ABD2FA] text-base max-w-2xl mx-auto">
                        Les films que vous ajoutez à votre liste sont sauvegardés localement dans votre navigateur et resteront disponibles même après la fermeture de la page.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {watchlist.map(movie => (
                        <div key={movie.id} className="group relative overflow-hidden rounded-lg bg-[#3D518C] transition-all duration-300 hover:scale-105">
                            <Link to={`/movie/${movie.id}`} state={{ from: '/watchlist' }}>
                                <div className="relative">
                                    <img
                                        src={
                                            movie.poster_path
                                                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                                : 'https://via.placeholder.com/500x750?text=No+Image'
                                        }
                                        alt={movie.title || 'Film'}
                                        className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#3D518C] via-[#3D518C]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWatchlist(movie.id);
                                        }}
                                        className="absolute top-2 right-2 z-20 p-2 rounded-full transition-colors duration-300"
                                        style={{ background: 'none', border: 'none', padding: '0.5rem' }}
                                        aria-label="Retirer de la liste"
                                    >
                                        <FaHeart className="w-5 h-5 text-pink-500 fill-current hover:text-pink-600 transition-colors duration-300" />
                                    </button>
                                </div>
                                <div className="absolute top-0 left-0 right-0 p-4 transform -translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                                    <div className="flex items-center space-x-1 mb-2">
                                        <FaStar className={`w-4 h-4 ${getRatingColor(movie.vote_average || 0)}`} />
                                        <span className={getRatingColor(movie.vote_average || 0)}>{(movie.vote_average || 0).toFixed(1)}</span>
                                    </div>
                                    <h3 className="text-[#7692FF] font-medium group-hover:text-[#ABD2FA] line-clamp-2 transition-colors duration-300">
                                        {movie.title || 'Titre inconnu'}
                                    </h3>
                                    {movie.release_date && (
                                        <p className="text-[#3D518C] text-sm mt-1">
                                            {new Date(movie.release_date).getFullYear()}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Watchlist; 