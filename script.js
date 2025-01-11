//You can edit ALL of the code here
 function setup() {
   const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
 }


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ``;  //clearing textContent
  
  //Add container and class for styling
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container"; // 

  // for each episode make new card with <div>
  
   for(const episode of episodeList){
    const episodeCard = document.createElement("div"); 
    episodeCard.className = "episode-card"; // add class for card for styling
    
    //each card includes title, episodeCode, name, image and summary
    const episodeSeason = String(episode.season).padStart(2, "0");
    const episodeNumber= String(episode.number).padStart(2, "0");

    episodeCard.innerHTML =`
    <h2>${episode.name} (S${episodeSeason}E${episodeNumber})</h2>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <p>${episode.summary}</p>
    `;  
    // each episode can open in new window for more detail (from the source website)
    episodeCard.addEventListener("click", () => {
      window.open(episode.url, "_blank"); 
    });
  // Append the episode card to the container
  episodesContainer.append(episodeCard);
  };
  // Append the container card to the root
  rootElem.append(episodesContainer);
}

 window.onload = setup;
