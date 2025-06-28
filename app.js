const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow, i) => {
  const itemNumber = movieLists[i].querySelectorAll("img").length;
  let clickCounter = 0;
  arrow.addEventListener("click", () => {
    const ratio = Math.floor(window.innerWidth / 270);
    clickCounter++;
    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      movieLists[i].style.transform = `translateX(${
        movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
      }px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });

  console.log(Math.floor(window.innerWidth / 270));
});

//TOGGLE

const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle"
);

document.addEventListener("DOMContentLoaded", () => {
  const ball = document.querySelector(".toggle-ball");
  const items = document.querySelectorAll(
    ".container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle"
  );

  if (ball) {
    ball.addEventListener("click", () => {
      items.forEach((item) => {
        item.classList.toggle("active");
      });
      ball.classList.toggle("active");
    });
  } else {
    console.warn("toggle-ball not found in the DOM");
  }
});
const genreMap = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
  western: 37
};


const TMDB_API_KEY = "f16605170d124a8c1aa61202533020fa";
const OMDB_API_KEY = "eef69c0a"; // Free from omdbapi.com

async function recommendMovie() {
  const input = document.getElementById("user-genre");
  const chat = document.getElementById("chat-messages");
  const genre = input.value.trim().toLowerCase();
  input.value = "";

  chat.innerHTML += `<p><strong>You:</strong> ${genre}</p>`;

  if (!genreMap[genre]) {
    chat.innerHTML += `<p><strong>Bot:</strong> I don't know that genre. Try action, comedy, sci-fi, etc.</p>`;
    return;
  }

  const genreId = genreMap[genre];
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const recommendedMovies = data.results
      .filter(movie => movie.vote_average >= 7)
      .slice(0, 5)
      .map(movie => ({
        title: movie.title,
        year: movie.release_date?.slice(0, 4),
        rating: movie.vote_average.toFixed(1),
        overview: movie.overview,
        poster: `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      }));

    if (recommendedMovies.length === 0) {
      chat.innerHTML += `<p><strong>Bot:</strong> Couldn't find any ${genre} movies with rating ≥ 7.</p>`;
    } else {
      chat.innerHTML += `<p><strong>Bot:</strong> Here are some great ${genre} movies (TMDB 7+):</p>`;
      recommendedMovies.forEach(m => {
        chat.innerHTML += `
          <div style="margin-bottom:10px;">
            <img src="${m.poster}" style="width:80px; border-radius:8px; vertical-align:middle; margin-right:10px;" />
            <b>${m.title}</b> (${m.year})<br/>
            ⭐ Rating: ${m.rating}<br/>
            🗒️ ${m.overview.slice(0, 120)}...
          </div>
        `;
      });
    }
  } catch (error) {
    console.error(error);
    chat.innerHTML += `<p><strong>Bot:</strong> Sorry, something went wrong. Please try again later.</p>`;
  }
}
// ✅ 4. Add "Enter" key support
document.getElementById("user-genre").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    recommendMovie();
  }
});