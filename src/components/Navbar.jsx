import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaHeart, FaHome, FaUser } from 'react-icons/fa';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="bg-[#091540] border-b border-[#3D518C] shadow-lg transition duration-300 w-full sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <FaHome className="w-8 h-8 text-[#ABD2FA]" />
                        <span className="text-2xl font-bold text-[#ABD2FA]">NmtDB</span>
                    </Link>

                    {/* Barra di ricerca desktop */}
                    <div className="hidden md:block flex-1 max-w-xl mx-4">
                        <form onSubmit={handleSearch} className="relative flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher des films..."
                                className="w-full bg-[#3D518C] text-[#ABD2FA] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7692FF]"
                            />
                            <button
                                type="submit"
                                className="ml-2 text-[#ABD2FA] hover:text-[#7692FF]"
                            >
                                <FaSearch className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-1 text-[#7692FF] hover:text-[#ABD2FA] transition-colors !bg-transparent !border-none !p-0 !font-normal !text-base !cursor-pointer !rounded-none"
                            >
                                <span>Catégories</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-[#091540] border border-[#3D518C] rounded-lg shadow-lg py-2">
                                    <Link
                                        to="/category/films-tendances?page=1"
                                        className="block px-4 py-2 text-[#7692FF] hover:bg-[#3D518C] hover:text-[#ABD2FA] transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Tendances
                                    </Link>
                                    <Link
                                        to="/category/films-les-mieux-notes?page=1"
                                        className="block px-4 py-2 text-[#7692FF] hover:bg-[#3D518C] hover:text-[#ABD2FA] transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Les mieux notés
                                    </Link>
                                    <Link
                                        to="/category/films-a-venir?page=1"
                                        className="block px-4 py-2 text-[#7692FF] hover:bg-[#3D518C] hover:text-[#ABD2FA] transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        À venir
                                    </Link>
                                    <Link
                                        to="/category/films-populaires?page=1"
                                        className="block px-4 py-2 text-[#7692FF] hover:bg-[#3D518C] hover:text-[#ABD2FA] transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Populaires
                                    </Link>
                                </div>
                            )}
                        </div>
                        <Link to="/watchlist" className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors">
                            Ma liste
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg bg-[#3D518C] text-[#ABD2FA] hover:bg-[#7692FF] transition-colors duration-300"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Menu mobile */}
                {isMenuOpen && (
                    <div className="md:hidden py-4">
                        {/* Barra di ricerca mobile */}
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher des films..."
                                    className="w-full bg-[#3D518C] text-[#ABD2FA] px-4 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-[#7692FF]"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#3D518C] text-[#ABD2FA] px-4 py-2 rounded-r hover:bg-[#7692FF] transition-colors"
                                >
                                    <FaSearch className="w-5 h-5" />
                                </button>
                            </div>
                        </form>

                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/category/films-tendances?page=1"
                                className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Tendances
                            </Link>
                            <Link
                                to="/category/films-les-mieux-notes?page=1"
                                className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Les mieux notés
                            </Link>
                            <Link
                                to="/category/films-a-venir?page=1"
                                className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                À venir
                            </Link>
                            <Link
                                to="/category/films-populaires?page=1"
                                className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Populaires
                            </Link>
                            <Link
                                to="/watchlist"
                                className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Ma liste
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;