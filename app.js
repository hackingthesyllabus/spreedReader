function tokenize(text) {
  return text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const textInput = document.getElementById("textInput");
const wpm = document.getElementById("wpm");
const wpmLabel = document.getElementById("wpmLabel");

const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const idxLabel = document.getElementById("idxLabel");
const totalLabel = document.getElementById("totalLabel");

const font = document.getElementById("font");
const size = document.getElementById("size");
const sizeLabel = document.getElementById("sizeLabel");
const textColor = document.getElementById("textColor");
const bgColor = document.getElementById("bgColor");
const align = document.getElementById("align");
const vertical = document.getElementById("vertical");

const stage = document.getElementById("readerStage");
const wordEl = document.getElementById("word");

let words = tokenize(textInput.value);
let idx = 0;
let timer = null;
let isPlaying = false;

function msPerWord() {
  const val = clamp(Number(wpm.value), 60, 2000);
  return Math.round(60000 / val);
}

function updateMeta() {
  totalLabel.textContent = String(words.length);
  idxLabel.textContent = words.length ? String(idx + 1) : "0";
}

function renderWord() {
  if (!words.length) {
    wordEl.textContent = "Paste some text to begin.";
  } else {
    wordEl.textContent = words[idx] || "";
  }
  updateMeta();
}

function stop() {
  isPlaying = false;
  if (timer) clearInterval(timer);
  timer = null;
}

function start() {
  if (!words.length) return;
  isPlaying = true;
  stop();
  isPlaying = true;
  timer = setInterval(() => {
    const last = Math.max(0, words.length - 1);
    if (idx >= last) {
      idx = last;
      renderWord();
      stop();
      return;
    }
    idx += 1;
    renderWord();
  }, msPerWord());
}

function setStageAlignment() {
  stage.style.justifyContent =
    align.value === "left" ? "flex-start" : align.value === "right" ? "flex-end" : "center";

  stage.style.alignItems =
    vertical.value === "top" ? "flex-start" : vertical.value === "bottom" ? "flex-end" : "center";

  wordEl.style.textAlign = align.value;
}

function applyStyles() {
  document.body.style.fontFamily = font.value;
  wordEl.style.fontFamily = font.value;
  wordEl.style.fontSize = `${size.value}px`;
  sizeLabel.textContent = String(size.value);

  document.body.style.background = bgColor.value;
  document.body.style.color = textColor.value;

  wordEl.style.color = textColor.value;
  setStageAlignment();
}

textInput.addEventListener("input", () => {
  words = tokenize(textInput.value);
  idx = 0;
  stop();
  renderWord();
});

wpm.addEventListener("input", () => {
  wpmLabel.textContent = String(wpm.value);
  if (isPlaying) {
    start();
  }
});

playBtn.addEventListener("click", () => start());
pauseBtn.addEventListener("click", () => stop());
resetBtn.addEventListener("click", () => {
  stop();
  idx = 0;
  renderWord();
});

prevBtn.addEventListener("click", () => {
  idx = clamp(idx - 1, 0, Math.max(0, words.length - 1));
  renderWord();
});

nextBtn.addEventListener("click", () => {
  idx = clamp(idx + 1, 0, Math.max(0, words.length - 1));
  renderWord();
});

[font, size, textColor, bgColor, align, vertical].forEach((el) => {
  el.addEventListener("input", applyStyles);
  el.addEventListener("change", applyStyles);
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (isPlaying) stop();
    else start();
  }
  if (e.code === "ArrowRight") {
    idx = clamp(idx + 1, 0, Math.max(0, words.length - 1));
    renderWord();
  }
  if (e.code === "ArrowLeft") {
    idx = clamp(idx - 1, 0, Math.max(0, words.length - 1));
    renderWord();
  }
  if (e.code === "Escape") stop();
});

wpmLabel.textContent = String(wpm.value);
renderWord();
applyStyles();
