const loading = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "9c9ee3903fmsh5c599785d0cbb13p198e78jsnb4d35587ec49";
  const apiHost = "free-to-play-games-database.p.rapidapi.com";
  const app = new GameApp(apiKey, apiHost);
});

class GameApp {
  constructor(apiKey, apiHost) {
    this.apiKey = apiKey;
    this.apiHost = apiHost;
    this.gameList = document.getElementById("game-list");
    this.gameDetails = document.getElementById("game-details");

    this.init();
  }
  init() {
    const firstCategory = this.getDefaultCategory();
    if (firstCategory) {
      loading.classList.remove("d-none");
      this.fetchGames(firstCategory).then(() => {
        loading.classList.add("d-none");
      });
    }
    this.setupNavLinks();
  }

  getDefaultCategory() {
    const navLinks = document.querySelectorAll(".nav-link");
    return navLinks.length > 0 ? navLinks[0].getAttribute("data-category") : null;
  }
 
  async fetchGames(category) {
    if (!category) return;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": this.apiHost,
      },
    };

    this.clearGameList();
    loading.classList.remove("d-none"); 
    const response = await fetch(
      `https://${this.apiHost}/api/games?category=${category}`,options);
 
    if (response.ok) {
      const games = await response.json();
      this.displayGames(games);
    }loading.classList.add("d-none"); 
  }

  clearGameList() {
    if (this.gameList) {
      this.gameList.innerHTML = "";
    }
  }
  displayGames(games) {
    if (this.gameList) {
      this.gameList.classList.remove("d-none");
    }
    if (this.gameDetails) {
      this.gameDetails.classList.add("d-none");
    }
    games.forEach((game) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card shadow-sm" data-id="${game.id}">
          <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}">
          <div class="card-body">
            <div class="header d-flex justify-content-between">
              <h5 class="card-title fs-6 text-white">${game.title}</h5>
              <button class="btn1 btn-primary btn-sm border-0 rounded-2 text-white">Free</button>
            </div>
            <p class="pt-1 card-text text-center text-muted">
              ${game.short_description.split(" ", 9).join(" ")}
            </p>
            <div class="card-footer d-flex justify-content-between">
              <span class="text-white border-3 rounded-3">${game.genre.split(" ", 1).join(" ")}</span>
              <span class="text-white border-3 rounded-3">${game.platform.split(" ", 2).join(" ")}</span>
            </div>
          </div>
        </div>
      `;
      card.addEventListener("click", () => {
        this.fetchGameDetails(game.id);
      });
      this.gameList.appendChild(card);
    });
  }

  async fetchGameDetails(id) {
    const url = `https://${this.apiHost}/api/game?id=${id}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": this.apiHost,
      },
    };

    loading.classList.remove("d-none");
    const response = await fetch(url, options);

    if (response.ok) {
      const game = await response.json();
      this.displayGameDetails(game);
    }
    loading.classList.add("d-none"); 
  }
  displayGameDetails(game) {
    if (this.gameList) {
      this.gameList.classList.add("d-none");
    }
    if (this.gameDetails) {
      this.gameDetails.classList.remove("d-none");
    }
    this.gameDetails.innerHTML = `
      <div class="row bg-dark left">
        <div class="col-md-4">  
          <h2 class="text-white py-3 ms-5">Details Game</h2>
          <img src="${game.thumbnail}" class="ms-5" alt="${game.title}">
        </div>
        <div class="col-md-8 right">
          <h4 class="text-white title"> Title: ${game.title}</h4>
          <ul class="list-unstyled">
            <li class="text-white">Category: <span class="bg-primary rounded-2">${game.genre}</span></li>
            <li class="text-white">Platform: <span class="bg-primary rounded-2">${game.platform}</span></li>
            <li class="text-white">Status: <span class="bg-primary rounded-2">Live</span></li>    
          </ul>
          <p class="text-white w-75">${game.description.split(" ", 180).join(" ")}</p>
          <button type="button" class="btn btn-outline-warning">Show Game</button>
          <div class="d-flex justify-content-end"> 
            <i class="fa-solid fa-xmark fs-2 fw-bold text-muted" id="back-btn"></i>
          </div>
        </div>
      </div>
    `;

    document.getElementById("back-btn").addEventListener("click", () => {
      this.gameDetails.classList.add("d-none");
      this.gameList.classList.remove("d-none");
    });
  }
  setupNavLinks() {
    const navLinks = document.querySelectorAll(".nav-link");
    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", (e) => {
        e.preventDefault();
        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[i].classList.add("active");
        const category = navLinks[i].getAttribute("data-category");
        loading.classList.remove("d-none");
        this.fetchGames(category).then(() => {
          loading.classList.add("d-none"); 
        });
      });
    }
  }
}
const navbar = document.getElementById("navbar-example");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("fixed-top");
  } else {
    navbar.classList.remove("fixed-top");
  }
});
