//You can edit ALL of the code here
 function setup() {
   const allEpisodes = getOneEpisode();
  makePageForEpisodes(allEpisodes);
 }

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ``;

  const episodeCard = document.createElement("div");
  episodeCard.innerHTML =`
    <h2>${episodeList.name}</h2>
    <img src="${episodeList.image.medium}">
    <p>${episodeList.summary}</p>
  `
  rootElem.append(episodeCard);
 }

 window.onload = setup;

//  function makeFilmCard (parentElement, tagName, textContent ){
//   const element = document.createElement(tagName);
//   element.textContent = textContent;
//   parentElement.append(element);
//   return element;
// }
// const card = document.createElement("section")
// makeFilmCard(card, "h3", filmTest.title);
// makeFilmCard(card, "p", filmTest.director);
// makeFilmCard(card, "time", filmTest.times);
// makeFilmCard(card, "date", filmTest.certificate);
// document.body.append(card);
