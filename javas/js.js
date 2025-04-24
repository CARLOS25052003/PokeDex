const pokemonName = document.querySelector('.pokemon__nome');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonSound = new Audio('img/select-sound-121244.mp3');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-button');
const volumeControl = document.querySelector('.volume-control');
const volumeIcon = muteBtn.querySelector('img');


// Background music
const bgMusic = new Audio('img/KanokoTown.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.2;
bgMusic.play().catch(() => {});

let searchPokemon = 1;
buttonSound.load();
let musicStarted = false;

// start bgMusic after first gesture
function tryPlayMusic() {
    if (!musicStarted) {
        bgMusic.play().catch(() => {});
        musicStarted = true;
        window.removeEventListener('click', tryPlayMusic);
    }
}
window.addEventListener('click', tryPlayMusic);

// volume slider only controls volume & mute state
volumeSlider.addEventListener('input', () => {
    const vol = parseFloat(volumeSlider.value);
    bgMusic.volume = vol;
    bgMusic.muted = vol === 0;
    volumeIcon.src = vol === 0 ? 'img/icons8-no-audio-52.png' : 'img/icons8-audio-50.png';
});

// Fetch and render
async function fetchPokemon(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return res.ok ? res.json() : null;
}
async function renderPokemon(id) {
    pokemonName.textContent = 'Loading...';
    pokemonNumber.textContent = '';
    const data = await fetchPokemon(id);
    if (data) {
        pokemonName.textContent = data.name;
        pokemonNumber.textContent = data.id;
        pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
        pokemonImage.style.display = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.textContent = 'Not found >:';
        pokemonNumber.textContent = '';
    }
}

// form and buttons
form.addEventListener('submit', e => { e.preventDefault(); renderPokemon(input.value.toLowerCase()); });
buttonPrev.addEventListener('click', () => { if (searchPokemon > 1) { buttonSound.play(); renderPokemon(--searchPokemon); } });
buttonNext.addEventListener('click', () => { buttonSound.play(); renderPokemon(++searchPokemon); });

// mute button only toggles slider visibility
muteBtn.addEventListener('click', e => {
    e.stopPropagation();              // prevent document click handler
    volumeControl.classList.toggle('visible');
});

// hide slider when clicking outside
document.addEventListener('click', e => {
    if (!volumeControl.contains(e.target)) {
        volumeControl.classList.remove('visible');
    }
});

// initial render
renderPokemon(searchPokemon);
