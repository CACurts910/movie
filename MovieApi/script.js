const API_KEY = '78176abf';

const searchForm = document.getElementById('searchForm');
const titleInput = document.getElementById('titleInput');
const genreInput = document.getElementById('genreInput');
const yearInput = document.getElementById('yearInput');
const results = document.getElementById('results');

async function fetchMovies(title, year) {
    let url = `https://www.omdbapi.com/?apikey=78176abf&type=movie&s=${encodeURIComponent(title)}`;
    if (year) url += `&y=${encodeURIComponent(year)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === "False") return [];
    return data.Search || [];
}

async function fetchMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=short`;
    const res = await fetch(url);
    return await res.json();
}

function filterMovies(movies, genre) {
    if (!genre) return movies;
    const lowerGenre = genre.toLowerCase();
    return movies.filter(movie =>
        movie.Genre && movie.Genre.toLowerCase().includes(lowerGenre)
    );
}

function renderMovies(movies) {
    results.innerHTML = '';
    if (movies.length === 0) {
        results.innerHTML = '<p>No movies found.</p>';
        return;
    }
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
      <img class="movie-poster" src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="Poster for ${movie.Title}">
      <div class="movie-title">${movie.Title}</div>
      <div class="movie-meta"><strong>Year:</strong> ${movie.Year}</div>
      <div class="movie-meta"><strong>Genre:</strong> ${movie.Genre || 'N/A'}</div>
      <div class="movie-meta"><strong>Director:</strong> ${movie.Director || 'N/A'}</div>
      <div class="movie-meta"><strong>Actors:</strong> ${movie.Actors || 'N/A'}</div>
      <div class="movie-plot">${movie.Plot || ''}</div>
      <div class="movie-meta"><strong>Ratings:</strong> ${movie.imdbRating || 'N/A'}</div>
    `;
        results.appendChild(card);
    });
}

searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    const genre = genreInput.value.trim();
    const year = yearInput.value.trim();
    if (!title) return;
    results.innerHTML = '<p>Loading...</p>';
    const found = await fetchMovies(title, year);

    const details = await Promise.all(found.slice(0, 9).map(m => fetchMovieDetails(m.imdbID)));
    const filtered = filterMovies(details, genre);
    renderMovies(filtered);
});