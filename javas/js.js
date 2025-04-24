const pokemonName = document.querySelector('.pokemon__nome');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonSound = new Audio('img/select-sound-121244.mp3');
const muteBtn = document.getElementById('mute-button');

let isMuted = false;

const bgMusic = new Audio('img/KanokoTown.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.2;

let searchPokemon = 1;
buttonSound.load();

let musicStarted = false;

function tryPlayMusic() {
    if (!musicStarted) {
        bgMusic.play().catch(()=>{});
        musicStarted = true;
        window.removeEventListener('click', tryPlayMusic);
    }
}
window.addEventListener('click', tryPlayMusic);

function updateMuteIcon() {
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
}

const fetchPokemon = async (pokemon) => {
    const APIresponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIresponse.status == 200){
        const data = await APIresponse.json();
        return data;
    }
}

const randerPoekmon = async (pokemon) => {

    pokemonName.innerHTML = 'Loading... ';
    pokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);

    if (data){
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']
            ['animated']['front_default'];
        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found >:'
        pokemonNumber.innerHTML = '';
    }

}


    form.addEventListener('submit', () => {
    event.preventDefault();
    randerPoekmon(input.value.toLocaleLowerCase());
    });

    buttonPrev.addEventListener('click', () => {
        if (searchPokemon > 1) {
            buttonSound.currentTime = 0; // reinicia o áudio
            buttonSound.play();
            searchPokemon -= 1;
            randerPoekmon(searchPokemon);
        }
    });

    buttonNext.addEventListener('click', () => {
        buttonSound.currentTime = 0; // reinicia o áudio
        buttonSound.play();
        searchPokemon += 1;
        randerPoekmon(searchPokemon);
    });

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;        // inverte o estado
    bgMusic.muted = isMuted;   // aplica no áudio
    updateMuteIcon();          // troca o ícone
});

bgMusic.play().catch(()=>{});

randerPoekmon(searchPokemon);
