import axios from "axios";

const API_KEY = "120f0637ca79d38f18ad54d449e3e3de";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchTrendingMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return { results: [], total_pages: 1 };
    }
};

export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const creditsResponse = await axios.get(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);

        const director = creditsResponse.data.crew.find(member => member.job === 'Director');

        const cast = creditsResponse.data.cast.slice(0, 5).map(member => ({
            id: member.id,
            name: member.name,
            character: member.character,
            profile_path: member.profile_path,
        }));

        console.log('Movie Details:', response.data);
        console.log('Credits:', creditsResponse.data);

        return {
            ...response.data,
            director: director?.name,
            director_profile_path: director?.profile_path,
            cast
        };
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
};

export const fetchTopRatedMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top rated movies:", error);
        return { results: [], total_pages: 1 };
    }
};

export const fetchUpcomingMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        return { results: [], total_pages: 1 };
    }
};

export const fetchPopularMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return { results: [], total_pages: 1 };
    }
};

export const searchMovies = async (query, page = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR&page=${page}`
        );
        return response.data;
    } catch (error) {
        console.error("Error searching movies:", error);
        return { results: [], total_pages: 1 };
    }
};

export const fetchTrailers = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
        return response.data.results;
    } catch (error) {
        console.error("Error fetching trailers:", error);
        return [];
    }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&page=${page}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nel recupero dei film per genere:', error);
        throw error;
    }
};

export const getGenres = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`
        );
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Errore nel recupero dei generi:', error);
        throw error;
    }
};