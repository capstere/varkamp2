export const puzzles = [
  {
    type: 'canvas',
    prompt: 'Gåta 1: Håll fingret på rutorna för att avslöja ordet',
    hash: 'HASH_SNIGEL',      // SHA256("snigel")
    params:{width:300,height:300,grid:10,revealColor:'#FFDD00',text:'SNIGEL'}
  },
  {
    type: 'caesar',
    prompt: 'Gåta 2: Avkoda med Caesar-chiffer (skift +5)',
    hash: 'HASH_TVEKAMP',     // SHA256("tvekamp")
    params:{shift:5}
  },
  {
    type: 'audio-reverse',
    prompt: 'Gåta 3: Spela ljudet baklänges – vilket låt hör du?',
    hash: 'HASH_EDITPIR',     // SHA256("editpir")
    params:{src:'audio/p3-chorus-rev.mp3'}
  },
  {
    type: 'blend',
    prompt: 'Gåta 4: Växla blend-läge tills du ser hex-koden',
    hash: 'HASH_YXA',         // SHA256("yxa")
    params:{
      colors:['#FF0000','#00FF00','#0000FF','#FFFF00'],
      blendModes:['multiply','screen','difference','overlay'],
      text:'YXA', revealIndex:2
    }
  },
  {
    type: 'qr',
    prompt: 'Gåta 5: Lös labyrinten för att visa QR-koden, skanna och skriv in ordet',
    hash: 'HASH_KRAMP',       // SHA256("kramp")
    params:{mazeSize:15,cellSize:20,qrData:'kramp'}
  }
];
