// shared.js
// Common constants and functions for MovieSearch application

const apiKey = '0efd8e709f432e48de4378000a436a47';
const baseImageUrl = 'https://image.tmdb.org/t/p/';

let watchlist = [];
let favorites = [];

function displayMessageBox(message) {
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        text-align: center;
        font-size: 1.2em;
        border: 2px solid var(--primary);
    `;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    setTimeout(() => messageBox.remove(), 3000);
}

function loadLists() {
    watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];
    favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
}

function saveWatchlist() {
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
}

function saveFavorites() {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
}

function isMovieInWatchlist(movieId) {
    return watchlist.some(m => m.id === movieId);
}

function isMovieInFavorites(movieId) {
    return favorites.some(m => m.id === movieId);
}

// Standardize movie object for consistent storage
function standardizeMovieObject(movie) {
    return {
        id: movie.id,
        title: movie.title || movie.name || 'Unknown Title',
        poster_path: movie.poster_path || null,
        release_date: movie.release_date || movie.first_air_date || 'N/A',
        vote_average: movie.vote_average || 0,
        overview: movie.overview || 'No overview available.',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
    };
}

function toggleWatchlist(movie) {
    const standardizedMovie = standardizeMovieObject(movie);
    const index = watchlist.findIndex(m => m.id === standardizedMovie.id);
    let isAdded = false;
    if (index > -1) {
        watchlist.splice(index, 1);
        displayMessageBox(`${standardizedMovie.title} removed from Watchlist.`);
    } else {
        watchlist.push(standardizedMovie);
        displayMessageBox(`${standardizedMovie.title} added to Watchlist.`);
        isAdded = true;
    }
    saveWatchlist();
    return isAdded;
}

function toggleFavorites(movie) {
    const standardizedMovie = standardizeMovieObject(movie);
    const index = favorites.findIndex(m => m.id === standardizedMovie.id);
    let isAdded = false;
    if (index > -1) {
        favorites.splice(index, 1);
        displayMessageBox(`${standardizedMovie.title} removed from Favorites.`);
    } else {
        favorites.push(standardizedMovie);
        displayMessageBox(`${standardizedMovie.title} added to Favorites.`);
        isAdded = true;
    }
    saveFavorites();
    return isAdded;
}

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.status_message || 'Unknown API error'}`);
                } catch (e) {
                    throw new Error(`HTTP error! status: ${response.status}, response: ${errorText.substring(0, 100)}...`);
                }
            }
            return response;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for ${url}:`, error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.error('This typically indicates a network issue (e.g., no internet connection, CORS policy, ad-blocker, or firewall preventing the request).');
            }
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw error;
            }
        }
    }
}