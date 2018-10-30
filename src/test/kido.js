
const pieces = [];

const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [...dirXY, [-1, -1], [-1, 1], [1, 1], [1, -1]];

let pos = {};
let user = {};

let cnt = 0;

const invalidPieces = [];
const firstPieces = [];
const secondPieces = [];
const putPieces = [];

function initPieces() {
  pieces.length = 0;
  pieces[0] = { x: 0, y: 0, userId: 1, };
  delete pos, user;
  pos = { "0,0": 0 }, user = { 1: 1 };
}

function getPieces() {
  // invalidPieces: 174
  // secondPieces: 9871
  // firstPieces: 2163
  // putPieces: 10000
  console.log("invalidPieces: " + invalidPieces.length);
  console.log("secondPieces: " + secondPieces.length);
  console.log("firstPieces: " + firstPieces.length);
  console.log("putPieces: " + putPieces.length);
  return pieces;
}

function judgePiece(x, y, userId) {
  // マスに他コマがあるかどうか
  const coordinate = "" + x + "," + y;

  if (pos[coordinate] !== undefined) {
    invalidPieces.push([x, y, userId]);
    return false;
  }

  let doneReverse = false;
  // 盤面に自コマがある場合
  if (havePiece(userId)) {
    secondPieces.push([x, y, userId]);
    for (let dir of dirAll) {
      let n = 1;
      const passPosition = [];
      let idx = checkPosition(x + dir[0], y + dir[1]) || 0;
      while (idx !== undefined) {
        if (pieces[idx].userId !== userId) {
          passPosition.push(idx);
          n = (n + 1) | 0;
          idx = checkPosition(x + dir[0] * n, y + dir[1] * n);
        } else {
          doneReverse = true;
          for (let val of passPosition) {
              user[pieces[val].userId] -= 1;
              user[userId] += 1;
              pieces[val].userId = userId;
          }
          break;
        }
      }
    }
    if (doneReverse) { return putOwnPiece(x, y, userId) };
  } else {
    firstPieces.push([x, y, userId]);
    if (checkTateYoko(x, y)) {
      return putOwnPiece(x, y, userId);
    }
  }
  return false;
}

function checkTateYoko(x, y) {
  if (checkPosition(x, y + 1) !== undefined) { return true; }
  else if (checkPosition(x + 1, y) !== undefined) { return true; }
  else if (checkPosition(x, y - 1) !== undefined) { return true; }
  else if (checkPosition(x - 1, y) !== undefined) { return true; }
  return false;
}

function checkPosition(x, y) {
  const coordinate = "" + x + "," + y;
  if (pos[coordinate] !== undefined) {
    return pos[coordinate];
  }
  return undefined;
}

function putOwnPiece(x, y, userId) {
  putPieces.push([x, y, userId]);
  pieces.push({ x, y, userId });
  user[userId] = (user[userId] !== undefined)
    ? user[userId] += 1 : user[userId] = 1;
  pos["" + x + "," + y] = pieces.length - 1;
  return true;
}

function havePiece(userId) {
  if (user[userId] === undefined) { return false }
  else {
    if (user[userId] === 0) { return false }
    else { return true };
  }
}

module.exports = { initPieces, judgePiece, getPieces };
