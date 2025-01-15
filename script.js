//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  let searchTerm = ""; // Initial searchTerm state
  const states = { allEpisodes, searchTerm };
  render(states); //Initial render
  createSearchTerm(states); //Setup search functionality
}

function render(stateList) {
  //Filter episodes based on the searchTerm (case-insensitive)
  const filteredEpisode = stateList.allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(stateList.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(stateList.searchTerm.toLowerCase())
  );
  makePageForEpisodes(filteredEpisode);
  episodeCounter(filteredEpisode.length, stateList.allEpisodes.length);
  selectEpisodes(stateList.allEpisodes);
}


function selectEpisodes(episodeList) {
  const selectList = document.getElementById("select");
  for (episode of episodeList) {
    const optionList = document.createElement("option");
    optionList.value = episode.id;
    const episodeSeason = String(episode.season).padStart(2, "0");
    const episodeNumber = String(episode.number).padStart(2, "0");
    optionList.textContent = `S${episodeSeason}E${episodeNumber} - ${episode.name} `;
    selectList.append(optionList);
  }
  selectList.addEventListener("change", (event) => {
    const selectedId = event.target.value;
    if (selectedId === "allEpisodes") {
      makePageForEpisodes(episodeList);
      episodeCounter(episodeList.length, episodeList.length);
    } else {
      const selectEpisode = Array(
        episodeList.find((episode) => episode.id == selectedId)
      );
      makePageForEpisodes(selectEpisode);
      episodeCounter(1, episodeList.length);
    }
  });
}

function createSearchTerm(stateList) {
  const searchBox = document.getElementById("search");
  searchBox.addEventListener("input", (event) => {
    // Add an event listener to check user input
    stateList.searchTerm = event.target.value; //Update the searchTerm in state
    render(stateList); //Re-render with the updated state
  });
}

// Function to update how many episodes are displayed
function episodeCounter(filteredCount, totalCount) {     
  const countElement = document.getElementById("episodeCount");
  countElement.textContent = `Displaying ${filteredCount}/${totalCount} episodes.`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ``; //clearing textContent
  //Add container and class for styling
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container"; //

  // for each episode make new card with <div>

  for (const episode of episodeList) {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card"; // add class for card for styling
    //each card includes title, episodeCode, name, image and summary
    episodeCard.innerHTML = `
    <h2>${episode.name} (S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")})</h2>
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

window.onload = setup;
