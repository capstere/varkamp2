import { puzzles } from './puzzle-config.js';
import sha256 from 'js-sha256';

export function initApp() {
  //… setup startknapp, läs localStorage, startTimer, renderPuzzle(0) …
  document.getElementById('reset-btn').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
}

//… implement startTimer, updateTimer …

export function renderPuzzle(idx) {
  //… clear container, hide final …
  if (idx >= puzzles.length) {
    clearInterval(timerInterval);
    const finalHash = sha256(puzzles.map(p=>p.hash).join('')).slice(0,8);
    document.getElementById('final-answer').textContent = finalHash;
    document.getElementById('final').classList.remove('hidden');
    return;
  }
  const cfg = puzzles[idx];
  //… skapa wrapper, prompt, icon …
  const icon = document.createElement('img');
  icon.src = `assets/puzzle-${cfg.type}.png`;
  icon.className = 'puzzle-icon';
  wrapper.appendChild(icon);
  //… interaction, input, submit-button …
  submitBtn.addEventListener('click', () => {
    const answer = input.value.trim().toLowerCase();
    if (sha256(answer) === cfg.hash) {
      audioCorrect.play();
      wrapper.classList.add('fade-out');
      setTimeout(()=> renderPuzzle(idx+1),500);
    } else {
      audioWrong.play();
      wrapper.classList.add('shake');
      setTimeout(()=> wrapper.classList.remove('shake'),300);
    }
  });
  //… append section …
}
