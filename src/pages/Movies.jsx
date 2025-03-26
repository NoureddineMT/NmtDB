<div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold text-[#ABD2FA] mb-8">Films Populaires</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map(movie => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
                <article className="relative group">
                    <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h2 className="text-white font-semibold text-lg mb-2">{movie.title}</h2>
                            <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-[#e6b616]" />
                                <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        ))}
    </div>

    {loading && (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e6b616]"></div>
        </div>
    )}

    {error && (
        <div className="text-center py-8">
            <p className="text-red-500">Une erreur s'est produite lors du chargement des films.</p>
        </div>
    )}
</div> 