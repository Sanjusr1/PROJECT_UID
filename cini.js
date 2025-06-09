const API_KEY = '3b907cd0'; // Your OMDb API Key

// Triggered on button click
async function handleUserInput() {
  const movieName = document.getElementById("user-input").value.trim();
  const queryType = document.getElementById("query-type").value;
  const chatBox = document.getElementById("chat-box");

  if (!movieName) return;

  chatBox.innerHTML += `<div><b>You:</b> ${queryType.toUpperCase()} of ${movieName}</div>`;

  const movie = await searchAndFetchMovie(movieName);

  if (!movie || movie.Response === "False") {
    chatBox.innerHTML += `<div><b>Bot:</b> 😕 I couldn't find a movie matching "${movieName}". Try a more specific name.</div>`;
    return;
  }

  const response = generateNaturalResponse(movie, queryType);
  chatBox.innerHTML += `<div><b>Bot:</b> ${response}</div>`;

  document.getElementById("user-input").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Step 1: Search movie to get IMDb ID
async function searchAndFetchMovie(title) {
  const searchRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`);
  const searchData = await searchRes.json();

  if (!searchData.Search || searchData.Search.length === 0) return null;

  const bestMatch = searchData.Search[0];
  const detailsRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${bestMatch.imdbID}`);
  return await detailsRes.json();
}

// Step 2: Generate a natural-language reply
function generateNaturalResponse(movie, queryType) {
  switch (queryType) {
    case "rating":
      return `⭐ *${movie.Title}* has an IMDb rating of **${movie.imdbRating}/10**.`;
    case "cast":
      return `🎭 The main cast of *${movie.Title}* includes: ${movie.Actors}.`;
    case "age":
      return `🔞 *${movie.Title}* is rated **${movie.Rated}**.`;
    case "review":
      return `📝 Here's a short plot of *${movie.Title}*: "${movie.Plot}"`;
    default:
      return "❓ I'm not sure how to answer that.";
  }
}
