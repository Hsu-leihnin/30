// Personalise the two tracks and letter in this file.
const songs = [
  { title: "Track 01 — Until I Found You", file: "assets/music/Until I Found You.mp3" },
  { title: "Track 02 — one more for you", file: "assets/music/30.mp3" }
];

const intro = document.getElementById("intro");
const openEnvelope = document.getElementById("openEnvelope");
const flowerTransition = document.getElementById("flowerTransition");
const mainPage = document.getElementById("mainPage");
const audioPlayer = document.getElementById("audioPlayer");
const playPause = document.getElementById("playPause");
const prevSong = document.getElementById("prevSong");
const nextSong = document.getElementById("nextSong");
const songTitle = document.getElementById("songTitle");
const songChoices = [...document.querySelectorAll(".song-choice")];
const cassetteScene = document.querySelector(".cassette-scene");
let currentSong = 0;
let isPlaying = false;
let isReady = false;

function launchOrchids() {
  const flowerFiles =[
    "assets/images/H.png", "assets/images/E.png", "assets/images/I.png", "assets/images/N.png",
    "assets/images/T.png","assets/images/H(2).png","assets/images/U.png",
    "assets/images/R.png", "assets/images/A.png"
  ];
  const cloud = flowerTransition.querySelector(".flower-cloud");
  cloud.innerHTML = "";
  for (let i = 0; i < 90; i++) {
    const flower = document.createElement("img");
    flower.className = "flying-orchid";
    flower.src = flowerFiles[Math.floor(Math.random() * flowerFiles.length)];
    flower.alt = "";
    flower.draggable = false;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.min(window.innerWidth, window.innerHeight) * (0.28 + Math.random() * 0.56);
    const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 180;
    const y = Math.sin(angle) * distance + (Math.random() - 0.5) * 130;
    flower.style.setProperty("--fly-x", `${x}px`);
    flower.style.setProperty("--fly-y", `${y}px`);
    flower.style.setProperty("--flower-scale", (0.45 + Math.random() * 1.25).toFixed(2));
    flower.style.setProperty("--flower-rotate", `${Math.round(Math.random() * 700 - 350)}deg`);
    flower.style.setProperty("--duration", `${(1.35 + Math.random() * 1.25).toFixed(2)}s`);
    flower.style.animationDelay = `${(Math.random() * 0.5).toFixed(2)}s`;
    cloud.appendChild(flower);
  }
}
function preloadFlowerImages() {
  const flowerFiles = [
    "assets/images/H.png",
    "assets/images/E.png",
    "assets/images/I.png",
    "assets/images/N.png",
    "assets/images/T.png",
    "assets/images/H(2).png",
    "assets/images/U.png",
    "assets/images/R.png",
    "assets/images/A.png"
  ];

  return Promise.all(
    flowerFiles.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;

      if (img.complete) resolve();
    }))
  );
}

async function initializeWebsite() {
  await preloadFlowerImages();
  isReady = true;

  const pageLoader = document.getElementById("pageLoader");

  if (pageLoader) {
    pageLoader.classList.add("hidden");
  }
}

openEnvelope.addEventListener("click", () => {
  if (!isReady||intro.classList.contains("opening")) return;
  intro.classList.add("opening");
  flowerTransition.classList.add("show");
  launchOrchids();

const flowerCloud = flowerTransition.querySelector(".flower-cloud");
const flowerImages = [...flowerCloud.querySelectorAll("img")];

Promise.all(
  flowerImages.map((img) => {
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  })
).then(() => {
  window.setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.transform = "scale(.96)";
  }, 450);

  window.setTimeout(() => {
    intro.style.display = "none";
    flowerTransition.classList.remove("show");
    mainPage.classList.remove("d-none");
    mainPage.classList.add("page-fade-in");
    window.scrollTo({ top: 0, behavior: "smooth" });

    window.setTimeout(() => {
      mainPage.classList.remove("page-fade-in");
    }, 1500);
  }, 4000);
});
});

function chooseSong(index, autoplay = false) {
  currentSong = (index + songs.length) % songs.length;
  const song = songs[currentSong];
  songTitle.textContent = song.title;
  songChoices.forEach((button, i) => button.classList.toggle("active", i === currentSong));
  // The audio files are user-provided; add song1.mp3 and song2.mp3 in assets/music.
  audioPlayer.src = song.file;
  audioPlayer.load();
  if (autoplay) {
    audioPlayer.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      alert("Please add your MP3 file to assets/music and check the filename in js/script.js.");
    });
  } else {
    setPlaying(false);
  }
}
function setPlaying(value) {
  isPlaying = value;
  playPause.textContent = isPlaying ? "Ⅱ" : "▶";
  playPause.setAttribute("aria-label", isPlaying ? "Pause song" : "Play song");
  cassetteScene.classList.toggle("is-playing", isPlaying);
}
playPause.addEventListener("click", () => {
  if (!audioPlayer.src || !audioPlayer.src.endsWith(songs[currentSong].file)) chooseSong(currentSong);
  if (isPlaying) {
    audioPlayer.pause();
    setPlaying(false);
  } else {
    audioPlayer.play().then(() => setPlaying(true)).catch(() => {
      alert("Add your MP3 files first: assets/music/song1.mp3 and assets/music/song2.aac.");
    });
  }
});
prevSong.addEventListener("click", () => chooseSong(currentSong - 1, true));
nextSong.addEventListener("click", () => chooseSong(currentSong + 1, true));
songChoices.forEach(button => button.addEventListener("click", () => chooseSong(Number(button.dataset.song), true)));
audioPlayer.addEventListener("ended", () => setPlaying(false));
audioPlayer.addEventListener("pause", () => { if (isPlaying) setPlaying(false); });
audioPlayer.addEventListener("play", () => setPlaying(true));

initializeWebsite();