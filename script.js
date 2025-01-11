//You can edit ALL of the code here
 function setup() {
   const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
 }


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ``;  //clearing textContent
  
  // for each episode make new card with <div>
  
  //
   for(const episode of episodeList){
    const episodeCard = document.createElement("div"); 
    
    //each card includes title, episodeCode, name, image and summary
    const episodeSeason = String(episode.season).padStart(2, "0");
    const episodeNumber= String(episode.number).padStart(2, "0");

    episodeCard.innerHTML =`
    <h2>${episode.name} (S${episodeSeason}E${episodeNumber})</h2>
    <img src="${episode.image.medium}">
    <p>${episode.summary}</p>
    `;
  // Append the episode card to the rootElem
  rootElem.append(episodeCard);
  };
  
}

 window.onload = setup;
