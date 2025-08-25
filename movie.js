// movie.js - Página de detalhes do filme
// Gerencia exibição de detalhes, trailer, elenco, reviews e integração com a watchlist
// Chave da API TMDb (insira a sua para funcionamento completo)
const TMDB_API_KEY = 'SUA_TMDB_API_KEY';

// Extrai o ID do filme da URL
function getMovieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Busca detalhes do filme na TMDb
async function fetchMovieDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    return await res.json();
}

async function renderMovieDetails() {
    const id = getMovieIdFromUrl();
    if (!id) {
        document.getElementById('movie-details').innerHTML = '<h2>Filme não encontrado.</h2>';
        return;
    }
    const movie = await fetchMovieDetails(id);
    const letterboxdUrl = `https://letterboxd.com/search/${encodeURIComponent(movie.title)}`;
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const inWatchlist = watchlist.some(f => f.id === movie.id);
    document.getElementById('movie-details').innerHTML = `
        <div class="movie-card" style="max-width:400px;margin:auto;">
            <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w400' + movie.poster_path : 'https://via.placeholder.com/300x440?text=Filme'}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p><strong>Data de lançamento:</strong> ${movie.release_date}</p>
            <p><strong>Nota:</strong> ${movie.vote_average}</p>
            <p><strong>Sinopse:</strong> ${movie.overview}</p>
            <div id="trailer-container" style="margin:18px 0;"></div>
            <p><strong>Elenco:</strong> <span id="cast-list">Carregando...</span></p>
            <button id="watchlist-btn" style="margin:10px 0;padding:8px 16px;background:#ffcc00;color:#222;border:none;border-radius:4px;font-weight:bold;cursor:pointer;">
                ${inWatchlist ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
            </button>
            <p><a href="${letterboxdUrl}" target="_blank" rel="noopener" style="color:#ffcc00;font-weight:bold;">Ver no Letterboxd</a></p>
        </div>
        <section id="reviews-section" style="max-width:400px;margin:30px auto 0 auto;">
            <h3>Avaliações dos Usuários</h3>
            <form id="review-form" style="margin-bottom:15px;">
                <textarea id="review-text" rows="3" style="width:100%;" placeholder="Escreva sua avaliação..."></textarea>
                <br>
                <input id="review-user" type="text" style="width:60%;margin-top:5px;" placeholder="Seu nome (opcional)">
                <button type="submit" style="margin-top:8px;padding:6px 14px;background:#ffcc00;color:#222;border:none;border-radius:4px;font-weight:bold;cursor:pointer;">Enviar</button>
            </form>
            <div id="reviews-list"></div>
        </section>
    `;
    fetchMovieTrailer(movie.id);
// Buscar trailer do filme na TMDb e exibir
async function fetchMovieTrailer(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    const trailer = (data.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const container = document.getElementById('trailer-container');
    if (trailer) {
        container.innerHTML = `<iframe width="100%" height="220" src="https://www.youtube.com/embed/${trailer.key}" title="Trailer" frameborder="0" allowfullscreen></iframe>`;
    } else {
        container.innerHTML = '<p style="color:#aaa;">Trailer não disponível.</p>';
    }
}
    renderReviews(movie.id);
    document.getElementById('review-form').onsubmit = function(e) {
        e.preventDefault();
        const text = document.getElementById('review-text').value.trim();
        const user = document.getElementById('review-user').value.trim() || 'Anônimo';
        if (!text) return;
        const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
        if (!reviews[movie.id]) reviews[movie.id] = [];
        reviews[movie.id].push({ user, text, date: new Date().toLocaleDateString() });
        localStorage.setItem('reviews', JSON.stringify(reviews));
        document.getElementById('review-text').value = '';
        renderReviews(movie.id);
    };
function renderReviews(movieId) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
    const list = document.getElementById('reviews-list');
    if (!reviews[movieId] || reviews[movieId].length === 0) {
        list.innerHTML = '<p>Seja o primeiro a avaliar este filme!</p>';
        return;
    }
    list.innerHTML = reviews[movieId].map(r => `
        <div style="background:#222;padding:10px;border-radius:6px;margin-bottom:8px;">
            <strong>${r.user}</strong> <span style="color:#aaa;font-size:0.9em;">${r.date}</span>
            <p style="margin:6px 0 0 0;">${r.text}</p>
        </div>
    `).join('');
}
    document.getElementById('watchlist-btn').onclick = function() {
        let list = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (list.some(f => f.id === movie.id)) {
            list = list.filter(f => f.id !== movie.id);
            this.textContent = 'Adicionar à Minha Lista';
        } else {
            list.push({ id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date });
            this.textContent = 'Remover da Minha Lista';
        }
        localStorage.setItem('watchlist', JSON.stringify(list));
    };
    fetchMovieCast(id);
}

async function fetchMovieCast(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    const cast = data.cast.slice(0, 5).map(actor => actor.name).join(', ');
    document.getElementById('cast-list').textContent = cast || 'Não disponível';
}

window.onload = renderMovieDetails;
