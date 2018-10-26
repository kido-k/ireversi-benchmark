
const pieces = [];

const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [...dirXY, [-1, -1], [-1, 1], [1, 1], [1, -1]];

let pos = {};
let user = {};

let cnt = 0;

function initPieces() {
  pieces.length = 0;
  pieces[0] = { x: 0, y: 0, userId: 1, };
  delete pos, user;
  pos = { "0,0": 0 };
  user = { 1: 1 };
}

function getPieces() {
  return pieces;
}

function judgePiece(x, y, userId) {
  // マスに他コマがあるかどうか
  const coordinate = "" + x + "," + y;
  let status = false;

  if (pos[coordinate] !== undefined) {
    return false;
  }

  // 盤面に自コマがある場合
  if (user[userId] !== undefined && user[userId] !== 0) {
    for (let i = 0; i < dirAll.length; i += 1) {
      let n = 1;
      const passPosition = []; // 通って来たコマを一時保存する。めくれる条件のときはflipに移す。
      let nextCoordinate = makeCoordinate(x + dirAll[i][0], y + dirAll[i][1]);
      let idx = checkPosition(nextCoordinate);
      while (idx !== undefined) {
        if (pieces[idx].userId !== userId) {
          passPosition.push(idx);
          n = (n + 1) | 0;
          nextCoordinate = makeCoordinate(x + dirAll[i][0] * n, y + dirAll[i][1] * n);
          idx = checkPosition(nextCoordinate);
        } else {
          status = true;
          let j = 0, p = 0;
          while (j < passPosition.length) {
            p = passPosition[j];
            if (p !== undefined) {
              user[pieces[p].userId] -= 1;
              user[userId] += 1;
              pieces[p].userId = userId;
            }
            j = (j + 1) | 0;
          }
          break;
        }
      }
    }
  } else {
    let i = 0;
    while (i < dirXY.length) {
      const nextCoordinate = makeCoordinate(x + dirXY[i][0], y + dirXY[i][1]);
      if (checkPosition(nextCoordinate) !== undefined) {
        status = true;
        break;
      }
      i = (i + 1) | 0;
    }
  }

  if (status) {
    pieces.push({ x, y, userId });
    user[userId] = (user[userId] !== undefined)
      ? user[userId] += 1 : user[userId] = 1;
    pos[makeCoordinate(x, y)] = pieces.length - 1;
  }
  return status;
}

function checkPosition(coordinate) {
  if (pos[coordinate] !== undefined) {
    return pos[coordinate];
  }
  return undefined;
}

function makeCoordinate(x, y) {
  const arr = [x, y]
  return arr.join();
}

module.exports = { initPieces, judgePiece, getPieces };
