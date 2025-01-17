const episodesStates = { all: [], searchTerm: "" }; // Initial state for episodes
let showStates = { all: [], searchTerm: "" }; // Initial state for shows
const dataCache = {}; // Cache for fetched data

// Fetch data with caching
async function fetchWithCache(url) {
  const messageAlarm = document.getElementById("alarm");
  messageAlarm.textContent = "Loading, please wait...";
  try {
    if (dataCache[url]) {
      messageAlarm.textContent = ""; // Clear message if data is cached
      return dataCache[url];
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const data = await response.json();
    dataCache[url] = data;
    messageAlarm.textContent = "";
    return data;
  } catch (error) {
    messageAlarm.style.color = "red";
    messageAlarm.textContent = `An error occurred: ${error.message}`;
    throw error;
  }
}

// Setup function
async function setup() {
  try {
    const shows = await fetchWithCache("https://api.tvmaze.com/shows");
    if (shows) {
      showStates.all = shows;
      render(showStates); // Initial render for shows
      selectShows(showStates.all); // Populate show dropdown
      createSearchTerm(episodesStates);
    }
  } catch (error) {
    console.error("Error fetching shows:", error);
  }
}

// Populate show dropdown
function selectShows(showList) {
  const selectList = document.getElementById("selectS");
  selectList.innerHTML = ""; // Clear existing options

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "allShows";
  defaultOption.textContent = "All Shows";
  selectList.append(defaultOption);

  showList.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  for (show of showList) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selectList.append(option);
  }
  selectList.addEventListener("change", async (event) => {
    const selectedId = event.target.value;

    if (selectedId === "allShows") {
      render(showStates);
      // episodeCounter(episodeList.length, episodeList.length);
    } else {
      try {
        const episodes = await fetchWithCache(
          `https://api.tvmaze.com/shows/${selectedId}/episodes`
        );
        if (episodes) {
          episodesStates.all = episodes;
          render(episodesStates); // Render episodes
          selectEpisodes(episodesStates.all); // Populate episode dropdown
        }
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    }
  });
}

// Populate episode dropdown
function selectEpisodes(episodeList) {
  const selectList = document.getElementById("selectE");
  selectList.innerHTML = ""; // Clear existing options

  const defaultOption = document.createElement("option");
  defaultOption.value = "allEpisodes";
  defaultOption.textContent = "All Episodes";
  selectList.append(defaultOption);

  for (episode of episodeList) {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")} - ${episode.name} `;
    selectList.append(option);
  }
  selectList.addEventListener("change", (event) => {
    const selectedId = event.target.value;

    if (selectedId === "allEpisodes") {
      render(episodesStates); // Render all episodes
    } else {
      const selectedEpisode = episodesStates.all.find(
        (episode) => episode.id == selectedId
      );
      render({ all: [selectedEpisode], searchTerm: "" }); // Render selected episode
    }
  });
}

// Render the page
function render(stateList) {
  //Filter based on the searchTerm (case-sensitive)
  const filteredElements = stateList.all.filter(
    (element) =>
      element.name.toLowerCase().includes(stateList.searchTerm.toLowerCase()) ||
      element.summary.toLowerCase().includes(stateList.searchTerm.toLowerCase())
  );
  console.log(filteredElements);
  makePageForShows(filteredElements)
 // makePageForEpisodes(filteredElements);
  episodeCounter(filteredElements.length, stateList.all.length);
}

// Update episode counter
function episodeCounter(filteredCount, totalCount) {
  const countElement = document.getElementById("episodeCount");
  countElement.textContent = `Displaying ${filteredCount}/${totalCount} episodes.`;
}

// Create search functionality
function createSearchTerm(stateList) {
  const searchBox = document.getElementById("search");
  searchBox.value = "";
  searchBox.addEventListener("input", (event) => {
    stateList.searchTerm = event.target.value.trim(); //Update the searchTerm in state
    render(stateList); //Re-render with the updated state
  });
}
// Create episode cards
function makePageForShows(showsList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; //clearing textContent

  const showsContainer = document.createElement("div");
  showsContainer.className = "episodes-container";

  for (const show of showsList) {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    showCard.innerHTML = `
    <div>
    <img src="${show.image.medium}" alt="${show.name}">
    </div>
    <div>
    <h2>${show.name}</h2>
    <p>Genres: ${show.genres}</p>
    <p>Status: ${show.status}</p>
    <p>Rating: ${show.rating.average}</p>
    <p>Runtime: ${show.runtime} minutes</p>
    <p>Summary: ${show.summary}</p>
    </div>
    `;
    // each episode can open in new window for more detail (from the source website)
    showCard.addEventListener("click", () => {
      window.open(show.url, "_blank");
    });
    // Append the episode card to the container
    showsContainer.append(showCard);
  }
  // Append the container card to the root
  rootElem.append(showsContainer);
}
// Create episode cards
function makePageForEpisodes(episodesList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; //clearing textContent

  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  for (const episode of episodesList) {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    episodeCard.innerHTML = `
    <h2>${episode.name} (S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")})</h2>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <p>${episode.summary}</p>
    `;
    // each episode can open in new window for more detail (from the source website)
    episodeCard.addEventListener("click", () => {
      window.open(episode.url, "_blank");
    });
    // Append the episode card to the container
    episodesContainer.append(episodeCard);
  }
  // Append the container card to the root
  rootElem.append(episodesContainer);
}

// Call the setup function when the page loads
window.onload = setup;
