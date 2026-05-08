const emojiBg = document.getElementById("emojiBg");
const storyPage = document.getElementById("storyPage");
const avatarImg = document.getElementById("avatarImg");
const storyText = document.getElementById("storyText");
const cursor = document.getElementById("cursor");
const memoryImgWrap = document.getElementById("memoryImgWrap");
const memoryImg = document.getElementById("memoryImg");
const nextBtn = document.getElementById("nextBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const replayBtn = document.getElementById("replayBtn");
const loadingOverlay = document.getElementById("loadingOverlay");

let currentPage = -1;
let isTyping = false;
let typingToken = 0;

const emojis = ["❤️", "✨", "💕", "💌", "🌸", "🌺"];

const pages = [
  {
    text: "Hello Jana ❤️\n\nHere is Ahmed Tamer…\n\nor simply… your loly.",
    image: null,
  },
  {
    text: "baby Jana, my first love 💕",
    image: "1.jpg",
  },
  {
    text: "4aba7y, my endless love 💖",
    image: "2.jpg",
  },
  {
    text: "our first chat 💌",
    image: "3.jpg",
  },
  {
    text: "happy birthday ya jojy\n\nlove you so much 💕",
    image: "4.jpg",
  },
];

async function preloadAssets() {
  const assetPaths = [
    "avatar.png",
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
  ];

  return Promise.all(
    assetPaths.map(
      (path) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
          img.src = path;
        })
    )
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createFloatingEmojis() {
  for (let i = 0; i < 12; i++) {
    const emoji = document.createElement("div");
    emoji.className = "emoji-float";
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + "%";
    emoji.style.top = Math.random() * 100 + "%";
    emoji.style.animationDuration = 8 + Math.random() * 8 + "s";
    emoji.style.animationDelay = Math.random() * 2 + "s";
    emojiBg.appendChild(emoji);
  }
}

async function typeText(text, speed = 50) {
  typingToken += 1;
  const token = typingToken;
  isTyping = true;
  storyText.textContent = "";

  for (const char of text) {
    if (token !== typingToken) return;
    if (char === "\n") {
      storyText.textContent += "\n";
    } else {
      storyText.textContent += char;
    }
    await wait(speed + Math.random() * 20);
  }

  isTyping = false;
}

function showImage(imageSrc) {
  if (!imageSrc) {
    memoryImgWrap.style.display = "none";
    return;
  }
  memoryImgWrap.style.display = "block";
  memoryImg.src = imageSrc;
}

async function goToPage(index) {
  if (index < 0 || index >= pages.length) return;

  if (currentPage >= 0) {
    storyPage.classList.add("fade-out");
    await wait(300);
    storyPage.classList.remove("fade-out");
  }

  currentPage = index;
  const page = pages[index];

  nextBtn.classList.remove("visible");
  cursor.style.display = "inline";

  // Show avatar only on first page
  if (index === 0) {
    avatarImg.style.display = "block";
  } else {
    avatarImg.style.display = "none";
  }

  showImage(page.image);
  await typeText(page.text);

  cursor.style.display = "none";
  if (index < pages.length - 1) {
    nextBtn.textContent = "Next ✨";
  } else {
    nextBtn.textContent = "Replay 💕";
  }
  nextBtn.classList.add("visible");
}

nextBtn.addEventListener("click", async () => {
  if (isTyping) return;
  if (currentPage < pages.length - 1) {
    await goToPage(currentPage + 1);
  } else {
    await restartStory();
  }
});

async function restartStory() {
  currentPage = -1;
  await goToPage(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

replayBtn.addEventListener("click", restartStory);

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = "♫";
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
  }
});

window.addEventListener("load", async () => {
  createFloatingEmojis();
  bgMusic.volume = 0.4;

  // Hide loading overlay and show page immediately
  loadingOverlay.classList.add("hidden");

  // Show the first page without waiting
  await goToPage(0);

  // Preload assets in the background (non-blocking)
  preloadAssets();

  // Play music on first user interaction (required by browser policies)
  const playAudio = () => {
    bgMusic.play().catch(() => {
      console.log("Autoplay blocked by browser");
    });
    document.removeEventListener("click", playAudio);
    document.removeEventListener("tap", playAudio);
    document.removeEventListener("touchstart", playAudio);
  };

  document.addEventListener("click", playAudio);
  document.addEventListener("touchstart", playAudio);

  // Try playing after 2 seconds as fallback
  setTimeout(() => {
    bgMusic.play().catch(() => {});
  }, 2000);
});

