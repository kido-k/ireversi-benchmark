const pieces = [];

const dirXY = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const dirAll = [
  ...dirXY,
  [-1, 1],
  [1, 1],
  [1, -1],
  [-1, -1],
];

const seeNext = (array, nextPieceX, nextPieceY) => {
  return array.find(p => p.x === nextPieceX && p.y === nextPieceY);
};

module.exports = {
  initPieces() {
    pieces.length = 0;
    pieces[0] = {
      x: 0,
      y: 0,
      userId: 1,
    };
  },
  judgePiece(x, y, userId) {
    // マスに他コマがあるかどうか
    if (pieces.find(p => p.x === x & p.y === y)) {
      return false;
    }

    let status = false;

    const flip = [];
    // 盤面に自コマがある場合
    if (pieces.find(p => p.userId === userId)) {
      for (let i = 0; i < dirAll.length; i += 1) {
        const rslt = []; // 通って来たコマを一時保存する。めくれる条件のときはflipに移す。
        const dirX = dirAll[i][0];
        const dirY = dirAll[i][1];
        const aroundX = x + dirX;
        const aroundY = y + dirY;

        let n = 1;
        let dirPiece = seeNext(pieces, aroundX, aroundY);

        if (dirPiece) {
          if (dirPiece.userId !== userId) {
            while (dirPiece) {
              if (dirPiece.userId !== userId) {
                rslt.push(dirPiece);
                n += 1;
                const nextPieceX = x + dirX * n;
                const nextPieceY = y + dirY * n;
                dirPiece = seeNext(pieces, nextPieceX, nextPieceY);
              } else if (dirPiece.userId === userId) {
                status = true;
                for (let j = 0; j < rslt.length; j += 1) {
                  if (rslt[j] !== undefined) {
                    rslt[j].userId = userId;
                    flip.push(rslt[j]);
                  }
                }
                break;
              }
            }
          }
        }
      }
    // 他コマばかりで自コマがない場合、
    } else {
      // 上下左右を検索
      for (let i = 0; i < dirXY.length; i += 1) {
        const dirX = dirXY[i][0];
        const dirY = dirXY[i][1];
        const aroundX = x + dirX;
        const aroundY = y + dirY;
        const dirPiece = pieces.find(p => p.x === aroundX && p.y === aroundY);
        if (dirPiece !== undefined) { // 上下左右いずれかのとなりに他コマがある場合
          status = true;
          break;
        }
      }
    }

    for (let i = 0; i < pieces.length; i += 1) {
      const p = pieces[i];
      for (let j = 0; j < flip.length; j += 1) {
        const f = flip[j];
        if (f.x === p.x && f.y === p.y) {
          p.userId = f.userId;
        }
      }
    }

    if (status) pieces.push({ x, y, userId });

    return status;
  },
  getPieces() {
    return pieces;
  },
};
