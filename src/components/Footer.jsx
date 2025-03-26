import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#091540] border-t border-[#3D518C]">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-[#ABD2FA] mb-4">À propos</h3>
                        <p className="text-[#7692FF]">
                            Découvrez une vaste collection de films avec des informations détaillées, des bandes-annonces et plus encore.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#ABD2FA] mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link to="/watchlist" className="text-[#7692FF] hover:text-[#ABD2FA] transition-colors">
                                    Ma Liste
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#ABD2FA] mb-4">Contact</h3>
                        <p className="text-[#7692FF]">
                            Pour toute question ou suggestion, n'hésitez pas à <a href="https://portfolio-vercel-orcin.vercel.app/"> nous contacter.</a>
                        </p>
                    </div>
                </div>
                <div className="border-t border-[#3D518C] mt-8 pt-8 text-center">
                    <p className="text-[#7692FF]">
                        © NmtDB {new Date().getFullYear()} : Mon IMDb Clone. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 