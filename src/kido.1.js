
const pieces = [];

const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [...dirXY, [-1, -1], [-1, 1], [1, 1], [1, -1]];

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

  if (pos[coordinate] !== undefined) {
    return false;
  }

  let doneReverse = false;
  // 盤面に自コマがある場合
  if (havePiece(userId)) {
    for (let dir of dirAll) {
      const passPosition = makeTurnPieces(x + dir[0], y + dir[1], userId, dir, []);
      if (passPosition.length > 0) {
        doneReverse = true;
        for (let val of passPosition) {
          user[pieces[val].userId] -= 1;
          user[userId] += 1;
          pieces[val].userId = userId;
        }
      }
    }
    if (doneReverse) { return putOwnPiece(x, y, userId) };
  } else {
    if (checkTateYoko(x, y)) {
      return putOwnPiece(x, y, userId);
    }
  }
  return false;
}

function makeTurnPieces(x, y, userId, dir, array) {
  let idx = checkPosition(x, y);
  if (idx === undefined) {
    return [];
  } else if (pieces[idx].userId !== userId) {
    array.push(idx);
    return makeTurnPieces(x + dir[0], y + dir[1], userId, dir, array);
  } else {
    return array;
  }
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
