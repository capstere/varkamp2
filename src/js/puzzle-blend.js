// ====== Blend-lager-pussel ======
export function buildBlendPuzzle(parent, { colors, blendModes, text, revealIndex }) {
  // Skapa container för lager
  const container = document.createElement('div');
  container.className = 'blend-container';
  parent.appendChild(container);

  // Lägg på färglager (olika divar)
  colors.forEach(() => {
    const layer = document.createElement('div');
    layer.className = 'blend-layer';
    container.appendChild(layer);
  });

  // Texten som ska avslöjas
  const txt = document.createElement('div');
  txt.className = 'blend-text';
  txt.textContent = text;
  container.appendChild(txt);

  // Knapp för att växla blend-läge
  const btn = document.createElement('button');
  btn.textContent = 'Växla blend-läge';
  parent.appendChild(btn);

  let idx = 0;
  btn.addEventListener('click', () => {
    idx = (idx + 1) % blendModes.length;
    container.querySelectorAll('.blend-layer').forEach((div, i) => {
      div.style.background = colors[i];
      div.style.mixBlendMode = blendModes[idx];
    });
    txt.style.opacity = idx === revealIndex ? '1' : '0';
  });

  // Låt base.js lägga till text-input
  return null;
}
