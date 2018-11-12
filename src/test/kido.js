let pieces = [];
const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [...dirXY, [-1, -1], [-1, 1], [1, 1], [1, -1]];

const SIZE = 255 * 2;
const HOSEI = 255;

let reversePieces = [];

let pos = {},
  user = {};

function initPieces() {
  initUser();
  initPosition();
}

function initUser() {
  delete user;
  for (let i = 0; i <= 65535; i += 1) {
    user[i] = 0;
  }
  user[1] = 1;
}

function initPosition() {
  delete pos;
  pieces.length = 0;
  pieces = new Array(SIZE).fill(0);
  for (let i = 0; i <= SIZE; i += 1) {
    pieces[i] = new Array(SIZE).fill(0);
  }
  pieces[conv(0)][conv(0)] = 1;
}

const conv = n => {
  return n + HOSEI;
};

function getPieces() {
  const re_pieces = new Array();
  for (let i = 0; i <= SIZE; i += 1) {
    for (let j = 0; j <= SIZE; j += 1) {
      const userId = pieces[i][j];
      if (userId !== 0 && userId !== undefined) {
        let x = j - HOSEI,
          y = i - HOSEI;
        re_pieces.push({ x, y, userId });
      }
    }
  }
  return re_pieces;
}

function judgePiece(x, y, userId) {
  if (pieces[conv(y)][conv(x)] !== 0) {
    return false;
  }

  let doneReverse = false;

  if (user[userId] > 0) {
    // １枚目か、２枚目以降かをチェック
    for (const dir of dirAll) {
      reversePieces = new Array();
      if (makeReversePieces(x + dir[0], y + dir[1], userId, dir[0], dir[1])) {
        // ひっくり返す駒があればuserIdを書き換える
        doneReverse = true;
        for (const rp of reversePieces) {
          user[rp[2]] -= 1;
          user[userId] += 1;
          pieces[conv(rp[1])][conv(rp[0])] = userId;
        }
      }
    }
    if (doneReverse) {
      return putPiece(x, y, userId);
    }
  } else {
    for (const dir of dirXY) {
      //四方のどこかに他者の駒があるかどうかをチェック
      if (pieces[conv(y + dir[1])][conv(x + dir[0])] !== 0) {
        return putPiece(x, y, userId);
      }
    }
  }
  return false;
}

function putPiece(x, y, userId) {
  pieces[conv(y)][conv(x)] = userId;
  user[userId] += 1;
  return true;
}

function makeReversePieces(x, y, userId, dirx, diry) {
  const piece = pieces[conv(y)][conv(x)];
  if (piece === 0) {
    return false;
  } else if (piece !== userId) {
    reversePieces.push([x, y, piece]);
    return makeReversePieces(x + dirx, y + diry, userId, dirx, diry);
  } else {
    return true;
  }
}

module.exports = { initPieces, judgePiece, getPieces };
