const pokemonColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#ea7ce8",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// Add your code here
const pokemonContainer = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search");
const loader = document.querySelector(".loader");
const noResults = document.getElementById("no-results");

let allPokemons = [];

async function fetchPokemons() {
  try {
    loader.style.display = "flex";

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=25");

    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return await response.json();
      }),
    );

    allPokemons = pokemonDetails;

    displayPokemons(allPokemons);
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    pokemonContainer.textContent = "Unable to load Pokémon. Please try again.";
  } finally {
    loader.style.display = "none";
  }
}

function displayPokemons(pokemons) {
  pokemonContainer.innerHTML = "";
  noResults.textContent = "";

  if (pokemons.length === 0) {
    noResults.textContent = "No Pokémon matched your search.";
    return;
  }

  pokemons.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const name = document.createElement("h2");
    name.textContent = pokemon.name;

    const image = document.createElement("img");
    image.src = pokemon.sprites.other["official-artwork"].front_default;
    image.alt = pokemon.name;

    const typesContainer = document.createElement("div");
    typesContainer.classList.add("types");

    pokemon.types.forEach((typeInfo) => {
      const type = document.createElement("span");

      type.classList.add("type", typeInfo.type.name);
      type.textContent = typeInfo.type.name;
      type.style.backgroundColor = pokemonColors[typeInfo.type.name];

      typesContainer.appendChild(type);
    });

    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(typesContainer);

    pokemonContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase().trim();

  const filteredPokemons = allPokemons.filter((pokemon) => {
    return pokemon.name.includes(searchTerm);
  });

  displayPokemons(filteredPokemons);
});

fetchPokemons();
