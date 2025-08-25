// Buscar gêneros disponíveis na TMDb
async function fetchGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    return data.genres || [];
}

function populateGenreOptions() {
    fetchGenres().then(genres => {
        const select = document.getElementById('filter-genre');
        genres.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.id;
            opt.textContent = g.name;
            select.appendChild(opt);
        });
    });
}

// Busca avançada de filmes na TMDb
async function searchMovies(filters) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&page=1&include_adult=false`;
    if (filters.name) url += `&query=${encodeURIComponent(filters.name)}`;
    if (filters.year) url += `&year=${filters.year}`;
    // Para gênero, é necessário usar discover
    if (filters.genre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&page=1&with_genres=${filters.genre}`;
        if (filters.year) url += `&year=${filters.year}`;
        if (filters.name) url += `&query=${encodeURIComponent(filters.name)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    let movies = data.results || [];
    // Filtro por ator/atriz e diretor/diretora
    if (filters.actor || filters.director) {
        movies = await Promise.all(movies.map(async m => {
            const creditsUrl = `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${TMDB_API_KEY}`;
            const creditsRes = await fetch(creditsUrl);
            const credits = await creditsRes.json();
            let match = true;
            if (filters.actor) {
                match = credits.cast.some(c => c.name.toLowerCase().includes(filters.actor.toLowerCase()));
            }
            if (filters.director) {
                match = match && credits.crew.some(c => c.job === 'Director' && c.name.toLowerCase().includes(filters.director.toLowerCase()));
            }
            return match ? m : null;
        }));
        movies = movies.filter(Boolean);
    }
    return movies;
}
function setupFilterForm() {
    const form = document.getElementById('filter-form');
    form.onsubmit = async function(e) {
        e.preventDefault();
        const filters = {
            name: document.getElementById('filter-name').value.trim(),
            year: document.getElementById('filter-year').value.trim(),
            genre: document.getElementById('filter-genre').value,
            actor: document.getElementById('filter-actor').value.trim(),
            director: document.getElementById('filter-director').value.trim()
        };
        const movies = await searchMovies(filters);
        renderMovies(movies, 'latest');
    };
}
// Integração com APIs de filmes
// Adicione suas API Keys abaixo
const TMDB_API_KEY = 'SUA_TMDB_API_KEY'; // https://www.themoviedb.org/settings/api
const OMDB_API_KEY = 'SUA_OMDB_API_KEY'; // http://www.omdbapi.com/apikey.aspx

// Buscar filmes populares do TMDb, com paginação
let tmdbPage = 1;
let tmdbLoading = false;
let tmdbHasMore = true;
async function fetchTMDbMovies(page = 1) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results.length === 0) tmdbHasMore = false;
    return data.results;
}

// Buscar filmes populares do OMDb (exemplo: busca por "batman")
async function fetchOMDbMovies() {
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=batman&type=movie`;
    const res = await fetch(url);
    const data = await res.json();
    return data.Search || [];
}

// Renderizar filmes na página
function renderMovies(movies, containerId, append = false) {
    const container = document.getElementById(containerId);
    if (!append) container.innerHTML = '';
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    movies.forEach(movie => {
        const inWatchlist = watchlist.some(f => f.id === (movie.id || movie.imdbID));
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : (movie.Poster || 'https://via.placeholder.com/150x220?text=Filme')}" alt="${movie.title || movie.Title}">
            <h3>${movie.title || movie.Title} ${inWatchlist ? '<span title="Na sua lista" style="font-size:1.2em;vertical-align:middle;">&#x23F0;</span>' : ''}</h3>
            <p>Data de lançamento: ${movie.release_date || movie.Year || 'N/A'}</p>
            <a href="movie.html?id=${movie.id || movie.imdbID}">Ver detalhes</a>
        `;
        container.appendChild(card);
    });
}

// Inicialização
async function loadInitialMovies() {
    tmdbPage = 1;
    tmdbHasMore = true;
    const tmdbMovies = await fetchTMDbMovies(tmdbPage);
    renderMovies(tmdbMovies, 'latest');
}

async function loadMoreMoviesOnScroll() {
    if (tmdbLoading || !tmdbHasMore) return;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        tmdbLoading = true;
        tmdbPage++;
        const moreMovies = await fetchTMDbMovies(tmdbPage);
        if (moreMovies.length > 0) {
            renderMovies(moreMovies, 'latest', true);
        } else {
            tmdbHasMore = false;
        }
        tmdbLoading = false;
    }
}

function renderWatchlist() {
    const watchlistSection = document.getElementById('watchlist');
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    let grid = watchlistSection.querySelector('.movies-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'movies-grid';
        watchlistSection.appendChild(grid);
    }
    grid.innerHTML = '';
    if (watchlist.length === 0) {
        grid.innerHTML = '<p>Sua lista está vazia.</p>';
        return;
    }
    watchlist.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'https://via.placeholder.com/150x220?text=Filme'}" alt="${movie.title}">
            <h3>${movie.title} <span title="Na sua lista" style="font-size:1.2em;vertical-align:middle;">&#x23F0;</span></h3>
            <p>Data de lançamento: ${movie.release_date || 'N/A'}</p>
            <a href="movie.html?id=${movie.id}">Ver detalhes</a>
        `;
        grid.appendChild(card);
    });
}

async function init() {
    await loadInitialMovies();
    renderWatchlist();
    populateGenreOptions();
    setupFilterForm();
    // OMDb
    try {
        const omdbMovies = await fetchOMDbMovies();
        let omdbSection = document.getElementById('omdb');
        if (!omdbSection) {
            omdbSection = document.createElement('section');
            omdbSection.id = 'omdb';
            omdbSection.innerHTML = '<h2>Filmes do IMDB/OMDb</h2><div class="movies-grid"></div>';
            document.querySelector('main').appendChild(omdbSection);
        }
        renderMovies(omdbMovies, omdbSection.querySelector('.movies-grid').id = 'omdb-grid');
    } catch (e) {
        console.error('Erro OMDb:', e);
    }
    window.addEventListener('scroll', loadMoreMoviesOnScroll);
}

window.onload = init;
