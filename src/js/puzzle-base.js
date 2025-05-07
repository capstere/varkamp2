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

let introEl, startBtn, timerEl, containerEl, finalEl, finalAnswerEl, resetBtn, audioCorrect, audioWrong;

/**
 * Den här funktionen körs när DOM är redo.
 */
export function initApp() {
  // Hämta alla element
  introEl       = document.getElementById('intro');
  startBtn      = document.getElementById('start-btn');
  timerEl       = document.getElementById('timer');
  containerEl   = document.getElementById('puzzle-container');
  finalEl       = document.getElementById('final');
  finalAnswerEl = document.getElementById('final-answer');
  resetBtn      = document.getElementById('reset-btn');
  audioCorrect  = document.getElementById('audio-correct');
  audioWrong    = document.getElementById('audio-wrong');

  // Läs av eventuell sparad progress
  const saved      = localStorage.getItem('fk-current');
  const savedStart = localStorage.getItem('fk-start');
  if (saved !== null && savedStart) {
    current   = Number(saved);
    startTime = Number(savedStart);
    startTimer();
    introEl.classList.add('hidden');
    renderPuzzle(current);
  }

  // Startknapp
  startBtn.addEventListener('click', () => {
    introEl.classList.add('hidden');
    startTime = Date.now();
    localStorage.setItem('fk-start', startTime);
    startTimer();
    renderPuzzle(0);
  });

  // Reset-knapp
  resetBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
}

// Timerfunktioner
function startTimer() {
  updateTimer();
  timerInterval = setInterval(updateTimer, 500);
}
function updateTimer() {
  const diff = Date.now() - startTime;
  const mm   = String(Math.floor(diff / 60000)).padStart(2, '0');
  const ss   = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;
}

// Render-loop
function renderPuzzle(idx) {
  localStorage.setItem('fk-current', idx);
  containerEl.innerHTML = '';
  finalEl.classList.add('hidden');

  // Alla klara?
  if (idx >= puzzles.length) {
    clearInterval(timerInterval);
    const finalHash = sha256(puzzles.map(p => p.hash).join('')).slice(0, 8);
    finalAnswerEl.textContent = finalHash;
    finalEl.classList.remove('hidden');
    return;
  }

  const cfg     = puzzles[idx];
  const wrapper = document.createElement('section');
  wrapper.className = 'puzzle';

  // Ikon
  const icon = document.createElement('img');
  icon.src  = `assets/puzzle-${cfg.type}.png`;
  icon.alt  = cfg.type;
  icon.className = 'puzzle-icon';
  wrapper.appendChild(icon);

  // Prompt
  const promptEl = document.createElement('div');
  promptEl.className = 'prompt';
  promptEl.textContent = cfg.prompt;
  wrapper.appendChild(promptEl);

  // Interaktion
  const interaction = document.createElement('div');
  interaction.className = 'interaction';
  wrapper.appendChild(interaction);

  // Skapa rätt pussel‐modul
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

  // Om inget input returnerades, skapa textfält
  if (!inputField) {
    inputField = addTextInput(interaction);
    if (cfg.type === 'qr') inputField.disabled = true;
  }

  // Skicka-knapp
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Skicka';
  submitBtn.disabled = (cfg.type === 'qr');
  submitBtn.addEventListener('click', () => {
    const ans = (inputField.value || '').trim().toLowerCase();
    if (sha256(ans) === cfg.hash) {
      audioCorrect.play();
      wrapper.classList.add('fade-out');
      setTimeout(() => renderPuzzle(idx + 1), 500);
    } else {
      audioWrong.play();
      wrapper.classList.add('shake');
      setTimeout(() => wrapper.classList.remove('shake'), 300);
    }
  });
  wrapper.appendChild(submitBtn);

  containerEl.appendChild(wrapper);
}

// Hjälpfunktion för text‐input
function addTextInput(parent) {
  const inp = document.createElement('input');
  inp.type        = 'text';
  inp.placeholder = 'Ditt svar här';
  parent.appendChild(inp);
  return inp;
}
