const fs = require('fs');
const chalk = require('chalk');

const { pieces, matchers } = JSON.parse(fs.readFileSync('./assets/given.json'));

const srcList = fs.readdirSync('./src/test').filter(n => !/^(default|template)\.js$/.test(n));

for (let m = 0; m < srcList.length; m += 1) {
  var filename = srcList[m];
  var src = require(`./test/${filename}`);
  var { judgePiece } = src;

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

  var elapsed = Date.now() - startTime;

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

  console.log(chalk`{yellow [${filename}]} elapsed: ${elapsed}ms`);
}
