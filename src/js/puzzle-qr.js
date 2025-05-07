// ====== QR-labyrint-pussel ======
import QRCode from 'qrcodejs';

export function setupMazePuzzle(parent, { mazeSize, cellSize, qrData }, submitBtn) {
  const canvas = document.createElement('canvas');
  canvas.className = 'maze';
  canvas.width = mazeSize * cellSize;
  canvas.height = mazeSize * cellSize;
  parent.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const maze = makeMaze(mazeSize);
  drawMaze(ctx, maze, cellSize);

  let solving = false;
  let cur = { x: 0, y: 0 };

  canvas.addEventListener('pointerdown', e => {
    const pos = getCell(e, canvas, cellSize);
    if (pos.x === 0 && pos.y === 0) solving = true;
  });

  canvas.addEventListener('pointermove', e => {
    if (!solving) return;
    const pos = getCell(e, canvas, cellSize);
    if (isNeighbor(cur, pos) && !wallBetween(cur, pos, maze)) {
      cur = pos;
      if (cur.x === mazeSize - 1 && cur.y === mazeSize - 1) {
        solving = false;
        revealQRCode(parent, qrData);
        submitBtn.disabled = false;
        parent.querySelector('input').disabled = false;
      }
    }
  });
}

// Generate a random maze via DFS
function makeMaze(n) {
  const maze = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ vis: false, walls: [true, true, true, true] }))
  );
  const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
  ];
  function carve(x, y) {
    maze[y][x].vis = true;
    shuffle(dirs);
    dirs.forEach(([dx, dy], i) => {
      const nx = x + dx,
        ny = y + dy;
      if (ny >= 0 && ny < n && nx >= 0 && nx < n && !maze[ny][nx].vis) {
        maze[y][x].walls[i] = false;
        maze[ny][nx].walls[(i + 2) % 4] = false;
        carve(nx, ny);
      }
    });
  }
  carve(0, 0);
  return maze;
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}
function drawMaze(ctx, maze, size) {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  maze.forEach((row, y) =>
    row.forEach((cell, x) => {
      const px = x * size,
        py = y * size;
      if (cell.walls[0]) {
        ctx.moveTo(px, py);
        ctx.lineTo(px + size, py);
      }
      if (cell.walls[1]) {
        ctx.moveTo(px + size, py);
        ctx.lineTo(px + size, py + size);
      }
      if (cell.walls[2]) {
        ctx.moveTo(px, py + size);
        ctx.lineTo(px + size, py + size);
      }
      if (cell.walls[3]) {
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + size);
      }
    })
  );
  ctx.stroke();
}
function getCell(e, c, size) {
  const r = c.getBoundingClientRect();
  return {
    x: Math.floor((e.clientX - r.left) / size),
    y: Math.floor((e.clientY - r.top) / size)
  };
}
function isNeighbor(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}
function wallBetween(a, b, maze) {
  const dx = b.x - a.x,
    dy = b.y - a.y;
  let idx = dx === 1 ? 1 : dx === -1 ? 3 : dy === 1 ? 2 : 0;
  return maze[a.y][a.x].walls[idx];
}
function revealQRCode(parent, text) {
  const div = document.createElement('div');
  div.id = 'qrcode';
  parent.appendChild(div);
  new QRCode(div, { text, width: 150, height: 150 });
}
