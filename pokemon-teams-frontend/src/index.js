const pokemonsContainer = document.querySelector('main');
const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const trainerCard =(trainerID, trainerName ) => {
  let newTrainerCard = document.createElement('div');
  newTrainerCard.classList.add('card');
  newTrainerCard.dataset.id = trainerID;
  newTrainerCard.innerHTML = `
    <p>${trainerName}</p>
      <button data-trainer-id="1">Add Pokemon</button>
      <ul class = 'pokemon-card'>
      </ul>
  `
  return newTrainerCard
}
const pokeCard = document.querySelector('pokemon-card')
const pokemonList = (name, species, id) => {
  return `<li>${name}(${species}) <button class="release" data-pokemon-id="${id}">Release</button></li>`

}

document.addEventListener('DOMContentLoaded', function(event) {
 
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(function(trainers) {
     for(let trainer in trainers) {
      let newTrainerCard = trainerCard(trainers[trainer].id, trainers[trainer].name);
      trainers[trainer].pokemons.forEach(function(pkmn) {
        // console.log(trainers[trainer], 'inside forEach pokemon')
        newTrainerCard.innerHTML += pokemonList(pkmn.nickname, pkmn.species, pkmn.id)
      })
     pokemonsContainer.append(newTrainerCard);
    }
  })
})



pokemonsContainer.addEventListener('click', function(e) {
  if (e.target.innerText === 'Add Pokemon') {
    const ulTag = e.target.parentElement;
    fetch(POKEMONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({pokemon: {trainer_id: e.target.parentElement.dataset.id}})
    })
    .then(res => res.json())
    .then(parsedRes => {
      if (!parsedRes.error){
        return ulTag.innerHTML += pokemonList(parsedRes.nickname, parsedRes.species)
      } else {
        alert(parsedRes.error)
      }
    })
  } else if (e.target.className == 'release') {
      fetch(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      e.target.parentElement.remove()
  }


})

