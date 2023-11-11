const movie = document.querySelector(".movie");
const form = document.querySelector("form");
const search = document.querySelector(".search");
const moutnh = document.querySelector(".moutnh");
const relize_for_month = document.querySelector(".reliz");
const tops = document.querySelector(".top");
const waiting = document.querySelector(".waiting");
const block = document.querySelector(".block");

const API =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const SEARCH_API =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_KEY = "f8d154ca-b71c-4a96-b0dd-46e9d9f42f36";

function getParam(data) {
  if (data.films) {
    return data.films;
  } else if (data.items) {
    return data.items;
  } else {
    return data.releases;
  }
}
Local();

getMovie(API);
async function getMovie(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    movieList(getParam(data));
  } catch (error) {
    console.log(error);
  }
}
relize_for_month.addEventListener("click", () => {
  let newMoutn = new Date().toLocaleString("en-US", { month: "long" });
  getMovie(
    `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${new Date().getFullYear()}&month=${newMoutn}&page=1`
  );
});

waiting.addEventListener("click", () => {
  getMovie(
    `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${
      new Date().getFullYear() + 1
    }&month=JANUARY`
  );
});

block.addEventListener("click", () => {
  let data = JSON.parse(localStorage.getItem("films"));
  movieList(data);
});

moutnh.addEventListener("click", () => {
  let newMoutn = new Date().toLocaleString("en-US", { month: "long" });
  console.log(new Date().getFullYear());
  getMovie(
    `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${new Date().getFullYear()}&month=${newMoutn}`
  );
});

tops.addEventListener("click", () => {
  getMovie(API);
});

function movieList(data) {
  movie.innerHTML = "";
  data.forEach((elem) => {
    let card = document.createElement("div");
    let block = document.createElement("div");
    let block_left = document.createElement("div");
    let block_right = document.createElement("div");
    let image = document.createElement("img");
    let title = document.createElement("h1");
    let icon = document.createElement("img");
    let reiting = document.createElement("h3");
    let year = document.createElement("h4");
    let genre = document.createElement("h5");

    card.className = "movie__card";
    title.textContent = elem.nameRu;
    title.className = "title";
    image.src = elem.posterUrl;
    block.className = "movie__card-info";
    reiting.textContent = elem.rating;
    if (elem.rating) {
      reiting.className = "reiting";
    }
    block_right.className = "block_right";
    year.textContent = elem.year;
    year.className = "yers";
    genre.textContent = elem.genres[0].genre;

    icon.src = isFavorite(elem) ? "./img/heart_full.svg" : "./img/heart.svg";

    icon.addEventListener("click", () => {
      toggleFavorite(elem);
      icon.src = isFavorite(elem) ? "./img/heart_full.svg" : "./img/heart.svg";
    });

    card.appendChild(image);
    block_left.append(title, year, genre);
    block_right.append(icon, reiting);
    block.append(block_left, block_right);
    card.appendChild(block);
    movie.appendChild(card);
  });
}

function isFavorite(elem) {
  let data = JSON.parse(localStorage.getItem("films"));
  return data.findIndex((item) => item.filmId === elem.filmId) !== -1;
}

function toggleFavorite(elem) {
  let data = JSON.parse(localStorage.getItem("films"));
  const existingFilmIndex = data.findIndex(
    (item) => item.filmId === elem.filmId
  );

  if (existingFilmIndex !== -1) {
    data.splice(existingFilmIndex, 1);
  } else {
    data.push(elem);
  }

  localStorage.setItem("films", JSON.stringify(data));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (search.value) {
    let NEW_URL = `${SEARCH_API}${search.value}`;
    getMovie(NEW_URL);
  }
});

function Local(elem) {
  if (elem) {
    if (!localStorage.getItem("films")) {
      localStorage.setItem("films", JSON.stringify([]));
    }

    let data = JSON.parse(localStorage.getItem("films"));
    const existingFilmIndex = data.findIndex((item) => {
      if (item.filmId) {
        return item.filmId === elem.filmId;
      } else {
        return item.kinopoiskId === elem.kinopoiskId;
      }
    });

    if (existingFilmIndex !== -1) {
      data.splice(existingFilmIndex, 1);
    } else {
      data.push(elem);
    }

    localStorage.setItem("films", JSON.stringify(data));
  } else {
    if (!localStorage.getItem("films")) {
      localStorage.setItem("films", JSON.stringify([]));
    }
  }
}
