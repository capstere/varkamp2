// ====== Caesar-chiffer-pussel ======
export function decodeCaesarPuzzle(parent, { shift }) {
  // Enbart ett textfält – all avkodning gör deltagaren
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Ditt svar här';
  parent.appendChild(input);
  return input;
}
