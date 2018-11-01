
const pieces = [];
const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [[0, 1], [1, 0], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]];
let reversePieces = [];

let pos = {};
let user = {};

function initPieces() {
  pieces.length = 0;
  pieces[0] = { x: 0, y: 0, userId: 1, };
  delete pos, user;
  pos = { "0,0": 0 }, user = { 1: 1 };
}

function getPieces() {
  return pieces;
}

function judgePiece(x, y, userId) {
  const coordinate = "" + x + "," + y;
  if (pos[coordinate] !== undefined) {  //既に駒が置かれてないかチェック
    return false;
  }

  if (haveOwnPiece(userId)) {      // １枚目か、２枚目以降かをチェック
    reversePieces.length = 0;
    for (let dir of dirAll) {
      makeReversePieces(x + dir[0], y + dir[1], userId, dir, []);
    }
    if (reversePieces.length > 0) {        // ひっくり返す駒があればuserIdを書き換える
      for (let rev of reversePieces) {
        for (let idx of rev) {
          user[pieces[idx].userId] -= 1;
          user[userId] += 1;
          pieces[idx].userId = userId;
        }
      }
      return putOwnPiece(x, y, userId)
    }
  } else {
    for (let dir of dirXY) {  //四方のどこかに他者の駒があるかどうかをチェック
      if (checkPosition(x + dir[0], y + dir[1]) !== undefined) {
        return putOwnPiece(x, y, userId);
      }
    }
  }
  return false;
}

function makeReversePieces(x, y, userId, dir, array) {
  let idx = checkPosition(x, y);
  if (idx === undefined) {
    return;
  } else if (pieces[idx].userId !== userId) {
    array.push(idx);
    makeReversePieces(x + dir[0], y + dir[1], userId, dir, array);
  } else if (pieces[idx].userId === userId) {
    reversePieces.push(array);
    return;
  }
}

function checkPosition(x, y) {
  const coordinate = "" + x + "," + y;
  if (pos[coordinate] !== undefined) {
    return pos[coordinate];
  }
  return undefined;
}

function putOwnPiece(x, y, userId) {
  pieces.push({ x, y, userId });
  pos["" + x + "," + y] = pieces.length - 1;
  user[userId] = (user[userId] !== undefined)
    ? user[userId] += 1 : user[userId] = 1;
  return true;
}

function haveOwnPiece(userId) {
  if (user[userId] > 0) { return true }
  else { return false }
}

module.exports = { initPieces, judgePiece, getPieces };
