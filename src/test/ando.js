const pieces = [];

const dirXY = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
const lenDirXY = dirXY.length;

const dirAll = [
  ...dirXY,
  [-1, 1],
  [1, 1],
  [1, -1],
  [-1, -1],
];
const lenDirAll = dirAll.length;

/* 座標からコマを探索 */
const searchPiece = (array, targetX, targetY) => {
  const lenArray = array.length;
  for (let i = 0; i < lenArray; i += 1) {
    if(array[i].x === targetX) {
      if(array[i].y === targetY) {
        // array[i].index = i;
        return array[i];
      }
    }
  }
};

let count = 0 // デバッグ用

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
    // デバッグ用
    count += 1;
    // console.log(`{ count: ${count}, x: ${x}, y: ${y}, userId: ${userId} }`);
    // console.time('1st');
    // デバッグ用

    /* 1. 置こうとしている場所に既にコマが存在するか */
    if(searchPiece(pieces, x, y)){
      // console.timeEnd('1st'); // デバッグ用
      return false;
    }
    // console.timeEnd('1st'); // デバッグ用

    /* 2. 自分のコマが存在するか（存在する場合は、置こうとしているコマの8方向上か） */
    let status = false;
    const myPieces = [];
    const lenPieces = pieces.length;
    const dirChecker = [0, 0, 0, 0, 0, 0, 0, 0];
    let dirCheckFlg = false;

    // console.time('2nd'); // デバッグ用
    for (let i = 0; i < lenPieces; i += 1) {
      const piece = pieces[i];
      if (piece.userId === userId) {
        myPieces.push(piece);
        if (piece.x === x) {
          if (piece.y > y) {
            // [0, 1]
            dirChecker[0] = 1;
            dirCheckFlg = true;
          } else {
            // [0, -1]
            dirChecker[2] = 1;
            dirCheckFlg = true;
          }
        } else if (piece.y === y) {
          if (piece.x > x) {
            // [1, 0]
            dirChecker[1] = 1;
            dirCheckFlg = true;
          } else {
            // [-1, 0]
            dirChecker[3] = 1;
            dirCheckFlg = true;
          }
        } else {
          const tan = (piece.y - y) / (piece.x - x);
          if (tan === 1) {
            if (piece.x > x) {
              // [1, 1]
              dirChecker[5] = 1;
              dirCheckFlg = true;
            } else {
              // [-1, -1]
              dirChecker[7] = 1;
              dirCheckFlg = true;
            }
          } else if (tan === -1) {
            if (piece.x > x) {
              // [1, -1]
              dirChecker[6] = 1;
              dirCheckFlg = true;
            } else {
              // [-1, 1]
              dirChecker[4] = 1;
              dirCheckFlg = true;
            }
          }
        }
      }
    }
    // console.timeEnd('2nd'); // デバッグ用

    // 隣接する枠に自コマ以外のコマが存在するか
    const adjacentChecker = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < lenDirAll; i += 1) {
      const dirX = dirAll[i][0];
      const dirY = dirAll[i][1];
      const aroundX = x + dirX;
      const aroundY = y + dirY;
      const dirPiece = searchPiece(pieces, aroundX, aroundY);
      if (dirPiece !== undefined && dirPiece.userId !== userId) {
        adjacentChecker[i] = 1
      }
    }

    /* 3. 置ける、めくれる判定および処理 */
    // 既に自コマが存在する場合
    if (myPieces.length > 0) {
      // 置こうとしているコマの8方向上に自コマがなかれば、めくれない
      if (!dirCheckFlg) return false;
      // console.time('3rd-1'); // デバッグ用
      for (let i = 0; i < lenDirAll; i += 1) {
        if (dirChecker[i] && adjacentChecker[i]) {
          const rslt = []; // めくる候補の格納
          const dirX = dirAll[i][0];
          const dirY = dirAll[i][1];
          const aroundX = x + dirX;
          const aroundY = y + dirY;
          
          let n = 1;
          
          let dirPiece = searchPiece(pieces, aroundX, aroundY);
        
          if (dirPiece) {
            if (dirPiece.userId !== userId) {
              // console.log(dirPiece);
              // console.time('3rd-1-1'); // デバッグ用
              while (dirPiece) {
                if (dirPiece.userId !== userId) {
                  rslt.push(dirPiece);
                  n += 1;
                  const nextPieceX = x + dirX * n;
                  const nextPieceY = y + dirY * n;
                  dirPiece = searchPiece(pieces, nextPieceX, nextPieceY);
                } else if (dirPiece.userId === userId) {
                  status = true;
                  // console.time('3rd-1-1-1'); // デバッグ用
                  const lenRslt = rslt.length
                  for (let j = 0; j < lenRslt; j += 1) {
                    rslt[j].userId = userId;
                  }
                  // console.time('3rd-1-1-1'); // デバッグ用
                  break;
                }
              }
              // console.timeEnd('3rd-1-1'); // デバッグ用
            }
          }
        }
      }
      if (status) {
        pieces.push({ x, y, userId });
        // console.timeEnd('3rd-1'); // デバッグ用
        return true;
      }

      // console.timeEnd('3rd-1'); // デバッグ用
      return false;

    // 自コマが存在しない場合
    } else {
      // console.time('3rd-2'); // デバッグ用
      // 上下左右の4方向上にコマがあれば置ける
      for (let i = 0; i < lenDirXY; i += 1) {
        if (adjacentChecker[i]) {
          pieces.push({ x, y, userId });
          // console.timeEnd('3rd-2'); // デバッグ用
          return true;
        }
      }
      // console.timeEnd('3rd-2'); // デバッグ用
      return false;
    }
  },
  getPieces() {
    return pieces;
  },
};
