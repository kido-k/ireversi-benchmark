const fs = require('fs');
const { initPieces, judgePiece, getPieces } = require('./test/default.js');
const pieces = [];

const size = 50; // 201
const count = 2000; // 10000
const users = 10; // 100

initPieces();
let trues = 0;
let falses = 0;

while (trues < count) {
  let piece = {
    x: Math.floor(Math.random() * size - size / 2),
    y: Math.floor(Math.random() * size - size / 2),
    userId: Math.floor(Math.random() * users) + 1,
    status: false,
  };

  let canPut = judgePiece(
    piece.x,
    piece.y,
    piece.userId,
  );

  if (canPut) {
    trues += 1;
    piece.status = true;
    pieces.push(piece);
    if (trues % 100 === 0) console.log(`${trues * 100 / count}%`);
  } else {
    falses += 1;
    if (falses % 2000 === 0) pieces.push(piece);
  }
}

const matchers = getPieces();
fs.writeFileSync('../assets/sample.json', JSON.stringify({ pieces, matchers }), 'utf8');
