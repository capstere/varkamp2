// ====== Canvas-mosaik-pussel ======
export function buildCanvasPuzzle(parent, { width, height, grid, revealColor, text }) {
  // Skapa canvas
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  c.className = 'mosaic';
  parent.appendChild(c);

  const ctx = c.getContext('2d');
  // Rita texten i revealColor
  ctx.fillStyle = revealColor;
  ctx.font = `${height / 4}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  // Täck över med svart
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  const cellW = width / grid;
  const cellH = height / grid;
  // Avslöja genom touchmove
  c.addEventListener('touchmove', e => {
    e.preventDefault();
    Array.from(e.touches).forEach(t => {
      const r = c.getBoundingClientRect();
      const x = t.clientX - r.left;
      const y = t.clientY - r.top;
      ctx.clearRect(
        Math.floor(x / cellW) * cellW,
        Math.floor(y / cellH) * cellH,
        cellW,
        cellH
      );
    });
  });

  // Låt base.js lägga till text-input (returnerar ingenting)
  return null;
}
