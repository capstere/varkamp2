// ====== Baklänges-ljud-pussel ======
export function setupAudioReverse(parent, { src }) {
  // Hämta och dekoda ljudfilen
  fetch(src)
    .then(r => r.arrayBuffer())
    .then(buf => {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      return ac.decodeAudioData(buf).then(decoded => {
        // Vänd varje kanal
        for (let i = 0; i < decoded.numberOfChannels; i++) {
          Array.prototype.reverse.call(decoded.getChannelData(i));
        }
        // Skapa replay-knapp
        const replayBtn = document.createElement('button');
        replayBtn.textContent = 'Spela igen';
        replayBtn.style.marginTop = '1rem';
        replayBtn.addEventListener('click', () => playReversed(ac, decoded));
        parent.appendChild(replayBtn);
        // Spela första gången
        playReversed(ac, decoded);
      });
    });
}

// Hjälpfunktion för att spela upp vänd buffert
function playReversed(ac, buffer) {
  const src = ac.createBufferSource();
  src.buffer = buffer;
  src.connect(ac.destination);
  src.start();
}
