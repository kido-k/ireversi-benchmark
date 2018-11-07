const fs = require('fs');
const chalk = require('chalk');
const defaultSrc = require('./test/default.js');

const { pieces, matchers } = JSON.parse(fs.readFileSync('./assets/given.json'));
let defaultTime;

{
  defaultSrc.initPieces();
  var results = [];
  var { judgePiece } = defaultSrc;
  var startTime = Date.now();

  for (var piece, i = 0, n = pieces.length; i < n; i += 1) {
    piece = pieces[i];
    results.push(judgePiece(
      piece.x,
      piece.y,
      piece.userId,
    ));
  }

  defaultTime = Date.now() - startTime;
  console.log(chalk`{yellow [default.js]} result: ${defaultTime}ms`);
}

const srcList = fs.readdirSync('./src/test').filter(n => !/^(default|template)\.js$/.test(n));
const count = 10;

for (let m = 0; m < srcList.length; m += 1) {
  var filename = srcList[m];
  var src = require(`./test/${filename}`);
  src.initPieces();
  var { judgePiece } = src;
  var elapsedList = [];

  for (var f = 0; f < count; f += 1) {
    src.initPieces();
    var results = [];
    var startTime = Date.now();

    for (var piece, i = 0, n = pieces.length; i < n; i += 1) {
      piece = pieces[i];
      results.push(judgePiece(
        piece.x,
        piece.y,
        piece.userId,
      ));
    }

    elapsedList.push(Date.now() - startTime);

    if (f === count - 1) {
      if (results.some((r, idx) => r !== pieces[idx].status)) {
        console.log(chalk.red(`[${filename}] failure: Return value of judgePiece method is invalid`));
      }

      const resPieces = src.getPieces();
      if (resPieces.length !== matchers.length) {
        console.log(chalk.red(`[${filename}] failure: The number of pieces does not match`));
      }

      if (resPieces.some(p => !matchers.find(m => m.x === p.x && m.y === p.y && m.userId === p.userId))) {
        console.log(chalk.red(`[${filename}] failure: The positions of the pieces do not match`));
      }
    }
  }

  var elapsed = elapsedList.reduce((sum, elapsed) => sum + elapsed) / count;
  var ratio = defaultTime / elapsed * 100 - 100;

  console.log(chalk`{yellow [${filename}]} elapsed: ${elapsedList}`);
  console.log(chalk`{yellow [${filename}]} result: ${elapsed}ms {${ratio > 0 ? 'green' : 'red'} ${ratio > 0 ? '+' : ''}${ratio}%}`);
}
