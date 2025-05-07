// src/js/puzzle-base.js

import { puzzles } from './puzzle-config.js';
import sha256 from 'js-sha256';
import { buildCanvasPuzzle } from './puzzle-canvas.js';
import { decodeCaesarPuzzle } from './puzzle-caesar.js';
import { setupAudioReverse } from './puzzle-audio-reverse.js';
import { buildBlendPuzzle } from './puzzle-blend.js';
import { setupMazePuzzle } from './puzzle-qr.js';

let current = 0;
let startTime = null;
let timerInterval = null;

const introEl        = document.getElementById('intro');
const startBtn       = document.getElementById('start-btn');
const timerEl        = document.getElementById('timer');
const containerEl    = document.getElementById('puzzle-container');
const finalEl        = document.getElementById('final');
const finalAnswerEl  = document.getElementById('final-answer');
const resetBtn       = document.getElementById('reset-btn');
const audioCorrect   = document.getElementById('audio-correct');
const audioWrong     = document.getElementById('audio-wrong');

document.addEventListener('DOMContentLoaded', () => {
  // Läs av sparad progress
  const saved = localStorage.getItem('fk-current');
  const savedStart = localStorage.getItem('fk-start');
  if (saved !== null && savedStart) {
    current = Number(saved);
    startTime = Number(savedStart);
    startTimer();
    introEl.classList.add('hidden');
    renderPuzzle(current);
  }
});

// Startknapp
startBtn.addEventListener('click', () => {
  introEl.classList.add('hidden');
  startTime = Date.now();
  localStorage.setItem('fk-start', startTime);
  startTimer();
  renderPuzzle(0);
});

// Återställ-knapp (reset)
resetBtn.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

// Timer
function startTimer() {
  updateTimer();
  timerInterval = setInterval(updateTimer, 500);
}
function updateTimer() {
  const diff = Date.now() - startTime;
  const mm = String(Math.floor(diff / 60000)).padStart(2, '0');
  const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;
}

// Huvud-renderfunktion
function renderPuzzle(idx) {
  localStorage.setItem('fk-current', idx);
  containerEl.innerHTML = '';
  finalEl.classList.add('hidden');

  // Klara alla pussel?
  if (idx >= puzzles.length) {
    clearInterval(timerInterval);
    // Beräkna slutlösenordet
    const finalHash = sha256(
      puzzles.map(p => p.hash).join('')
    ).slice(0, 8);
    finalAnswerEl.textContent = finalHash;
    finalEl.classList.remove('hidden');
    return;
  }

  const cfg = puzzles[idx];
  const wrapper = document.createElement('section');
  wrapper.className = 'puzzle';

  // Lägg till ikon för gåtan
  const icon = document.createElement('img');
  icon.src = `assets/puzzle-${cfg.type}.png`;
  icon.alt = cfg.type;
  icon.className = 'puzzle-icon';
  wrapper.appendChild(icon);

  // Prompt-text
  const promptEl = document.createElement('div');
  promptEl.className = 'prompt';
  promptEl.textContent = cfg.prompt;
  wrapper.appendChild(promptEl);

  // Container för input / interaktion
  const interaction = document.createElement('div');
  interaction.className = 'interaction';
  wrapper.appendChild(interaction);

  // Submit-knapp
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Skicka';
  // För QR-pusslet är input disabled tills man löst labyrinten
  submitBtn.disabled = (cfg.type === 'qr');
  wrapper.appendChild(submitBtn);

  // Skapa rätt typ av interaktion och input
  let inputField;
  switch (cfg.type) {
    case 'caesar':
      inputField = decodeCaesarPuzzle(interaction, cfg.params);
      break;
    case 'canvas':
      inputField = buildCanvasPuzzle(interaction, cfg.params);
      break;
    case 'audio-reverse':
      inputField = setupAudioReverse(interaction, cfg.params);
      break;
    case 'blend':
      inputField = buildBlendPuzzle(interaction, cfg.params);
      break;
    case 'qr':
      inputField = setupMazePuzzle(interaction, cfg.params, submitBtn);
      break;
  }
  // Om modulen inte returnerar ett input-element, lägg till textfält
  if (!inputField) {
    inputField = addTextInput(interaction);
    if (cfg.type === 'qr') inputField.disabled = true;
  }

  // Klickhantering: jämför SHA256(answer) mot cfg.hash
  submitBtn.addEventListener('click', () => {
    const answer = (inputField.value || '').trim().toLowerCase();
    if (sha256(answer) === cfg.hash) {
      audioCorrect.play();
      wrapper.classList.add('fade-out');
      setTimeout(() => renderPuzzle(idx + 1), 500);
    } else {
      audioWrong.play();
      wrapper.classList.add('shake');
      setTimeout(() => wrapper.classList.remove('shake'), 300);
    }
  });

  containerEl.appendChild(wrapper);
}

// Hjälp: skapa ett text-input
function addTextInput(parent) {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'Ditt svar här';
  parent.appendChild(inp);
  return inp;
}
