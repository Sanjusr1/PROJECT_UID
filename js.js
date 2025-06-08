
function showSignup() {
    alert("✅ Signup successful! Welcome!");
    window.location.href = 'main.html';
  }
  
  function goBack() {
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("backBtn").style.display = "none";
  }
  
  async function fetchTrendingMovies() {
    const resultsDiv = document.getElementById("results");
    if (!resultsDiv) return; // Ensure we're on the correct page
    resultsDiv.innerHTML = `<p>🔥 Loading trending movies...</p>`;
  
    try {
      const url = 'https://imdb236.p.rapidapi.com/imdb/india/trending-telugu';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '83d8e0facbmsheb5d6764b885276p1c5a54jsnc3bb6fb339f4',
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };
  
      const res = await fetch(url, options);
      
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      console.log(data);
      
  
      if (data) {
        displayMovies(data);
      } else {
        resultsDiv.innerHTML = `<p>🙁 No trending movies found.</p>`;
      }
    } catch (error) {
      resultsDiv.innerHTML = `<p>⚠️ Failed to load trending movies. Please try again later.</p>`;
      console.error(error);
    }
  }
  
  async function searchMovie() {
    const query = document.getElementById("searchInput").value.trim();
    const resultsDiv = document.getElementById("results");
  
    if (!query) {
      resultsDiv.innerHTML = `<p>🔎 Please enter a movie name.</p>`;
      return;
    }
  
    resultsDiv.innerHTML = `<p>🔍 Searching for "${query}"...</p>`;
  
    try {
      const url = `https://imdb236.p.rapidapi.com/imdb/search?originalTitle=${encodeURIComponent(query)}&type=movie&rows=25&sortOrder=ASC&sortField=id`;
  
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '83d8e0facbmsheb5d6764b885276p1c5a54jsnc3bb6fb339f4',
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };
  
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
  
      displayMovies(data.results);
    } catch (error) {
      resultsDiv.innerHTML = `<p>⚠️ Search failed. Please try again later.</p>`;
      console.error(error);
    }
  }
  
  async function displayMovies(movies) {
    const resultsDiv = document.getElementById("results");
    if (!movies || movies.length === 0) {
      resultsDiv.innerHTML = `<p>🙁 No results found.</p>`;
      return;
    }
  
    resultsDiv.innerHTML = '';
  
    for (const movie of movies) {
      const poster = movie.primaryImage || 'https://via.placeholder.com/100x150?text=No+Image';
      const title = movie.primaryTitle || 'Unknown Title';
      const year = movie.startYear || 'N/A';
      const imdbRating = movie.averageRating || 'N/A';
      const imdbID = movie.id || '';
      const imdbLink = imdbID ? `https://www.imdb.com/title/${imdbID}/` : '#';
  
      const card = document.createElement('a');
      card.href = imdbLink;
      card.target = '_blank';
      card.className = 'movie-card';
      card.onclick = () => {
        document.getElementById("mainContainer").style.display = "none";
        document.getElementById("backBtn").style.display = "block";
      };
  
      card.innerHTML = `
        <img src="${poster}" alt="${title}" />
        <div class="movie-info">
          <h2>${title}</h2>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>IMDb:</strong> ${imdbRating}</p>
        </div>
      `;
  
      resultsDiv.appendChild(card);
    }
  }
  
  
  
  
  // Auto-load trending movies on main page
  if (window.location.pathname.includes('main.html')) {
    fetchTrendingMovies();
  }