// src/js/puzzle-config.js

export const puzzles = [
  {
    type: 'canvas',
    prompt: 'Gåta 1: Håll fingret på rutorna för att avslöja ordet',
    // SHA256("snigel")
    hash: '4706e8aca8bb57be276da7a4c4d34a9c15867b298488af792fee5d5264ad28f7',
    params: {
      width: 300,
      height: 300,
      grid: 10,
      // Reveal-färg: gul som kontrast mot svart
      revealColor: '#FFDD00',
      text: 'SNIGEL'
    }
  },
  {
    type: 'caesar',
    prompt: 'Gåta 2: Avkoda med Caesar-chiffer (skift +5)',
    // SHA256("tvekamp")
    hash: '1a3a9fbeb34f98c262f397ee2b01d2f9cecea0c70aadc8a306ebcd5c752f6a3a',
    params: {
      shift: 5
    }
  },
  {
    type: 'audio-reverse',
    prompt: 'Gåta 3: Spela ljudet baklänges – vilket ord hör du?',
    // SHA256("editpir")
    hash: '1f623f06b3ffc37aea51af44133a27ce6f4a19a7da2e7ec4cf84e3ca87c65b68',
    params: {
      src: 'assets/p3-chorus-rev.mp3'
    }
  },
  {
    type: 'blend',
    prompt: 'Gåta 4: Tryck för att växla blend-läge tills du ser texten',
    // SHA256("yxa")
    hash: '696e1274f2d0c5e0eb220622d46d12cde26b1fa0d404d93701c24cb6aecfa70a',
    params: {
      colors: ['#FF0000','#00FF00','#0000FF','#FFFF00'],
      blendModes: ['multiply','screen','difference','overlay'],
      text: 'YXA',
      revealIndex: 2
    }
  },
  {
    type: 'qr',
    prompt: 'Gåta 5: Lös labyrinten för att visa QR-koden, skanna och skriv in ordet',
    // SHA256("kramp")
    hash: 'c0084beae8cd271ed8f36d61b7edbaf08762f17bcef69983168f646220523729',
    params: {
      mazeSize: 15,
      cellSize: 20,
      qrData: 'kramp'
    }
  }
];
