
const pieces = [];
const n = [0, 1], e = [1, 0], s = [0, -1], w = [-1, 0], sw = [-1, -1], nw = [-1, 1], ne = [1, 1], se = [1, -1];

const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [[0, 1], [1, 0], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]];
const chkDirALL = {
  NE: [w, sw, s], E: [n, nw, w, sw, s], SE: [n, nw, w],
  N: [w, sw, s, se, e], C: [n, ne, e, se, s, sw, w, nw], S: [w, nw, n, ne, e],
  NW: [e, se, s], W: [n, ne, e, se, s], SW: [n, ne, e],
}

const chkDirXY = {
  NE: [w, s], E: [e, s, w], SE: [e, s],
  N: [n, w, s], C: [n, e, s, w], S: [n, e, s],
  NW: [n, w], W: [w, n, e], SW: [n, e],
}

let cnt = 0;

let pos = {}, user = {};

let bordEdge = { xmax: 0, xmin: 0, ymax: 0, ymin: 0 };

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
  const coordinate = makeCoordinate(x, y);

  if (pos[coordinate] !== undefined) {
    // invalidPieces.push([x, y, userId]);
    return false;
  }

  let doneReverse = false;

  // 盤面に自コマがある場合
  if (havePiece(userId)) {
    // secondPieces.push([x, y, userId]);
    const dir = setDirectionALL(x, y);
    if (dir === false) {
      return false;
    }

    for (let i = 0; i < dir.length; i += 1) {
      let n = 1;
      const passPosition = []; // 通って来たコマを一時保存する。めくれる条件のときはflipに移す。
      let nextCoordinate = makeCoordinate(x + dir[i][0], y + dir[i][1]);
      let idx = checkPosition(nextCoordinate);
      while (idx !== undefined) {
        if (pieces[idx].userId !== userId) {
          passPosition.push(idx);
          n = (n + 1) | 0;
          nextCoordinate = makeCoordinate(x + dir[i][0] * n, y + dir[i][1] * n);
          idx = checkPosition(nextCoordinate);
        } else {
          doneReverse = true;
          let p = 0;
          for (let j = 0; j < passPosition.length; j += 1) {
            p = passPosition[j];
            if (p !== undefined) {
              user[pieces[p].userId] -= 1;
              user[userId] += 1;
              pieces[p].userId = userId;
            }
          }
          break;
        }
      }
    }
    if (doneReverse) { return putOwnPiece(x, y, userId) };
  } else {
    const dir = setDirectionXY(x, y);
    if (dir === false) {
      return false
    };
    // firstPieces.push([x, y, userId]);
    for (let i = 0; i < dir.length; i += 1) {
      const nextCoordinate = makeCoordinate(x + dir[i][0], y + dir[i][1]);
      if (checkPosition(nextCoordinate) !== undefined) {
        return putOwnPiece(x, y, userId);
      }
    }
  }
  return false;
}

function setDirectionALL(x, y) {
  if (x > bordEdge.xmax + 1 || x < bordEdge.xmin - 1
    || y > bordEdge.ymax + 1 || y < bordEdge.ymin - 1) {
    return false;
  }
  if (x > bordEdge.xmax) {
    if (y > bordEdge.ymax) {
      return chkDirALL.NE;
    } else if (y < bordEdge.ymin) {
      return chkDirALL.SE;
    } else {
      return chkDirALL.E;
    }
  } else if (x < bordEdge.xmin) {
    if (y > bordEdge.ymax) {
      return chkDirALL.NW;
    } else if (y < bordEdge.ymin) {
      return chkDirALL.SW;
    } else {
      return chkDirALL.W;
    }
  } else {
    if (y > bordEdge.ymax) {
      return chkDirALL.N;
    } else if (y < bordEdge.ymin) {
      return chkDirALL.S;
    } else {
      return chkDirALL.C;
    }
  }
}

function setDirectionXY(x, y) {
  if (x > bordEdge.xmax + 1 || x < bordEdge.xmin - 1
    || y > bordEdge.ymax + 1 || y < bordEdge.ymin - 1) {
    return false;
  }
  if (x > bordEdge.xmax) {
    if (y > bordEdge.ymax) {
      return chkDirXY.NE;
    } else if (y < bordEdge.ymin) {
      return chkDirXY.SE;
    } else {
      return chkDirXY.E;
    }
  } else if (x < bordEdge.xmin) {
    if (y > bordEdge.ymax) {
      return chkDirXY.NW;
    } else if (y < bordEdge.ymin) {
      return chkDirXY.SW;
    } else {
      return chkDirXY.W;
    }
  } else {
    if (y > bordEdge.ymax) {
      return chkDirXY.N;
    } else if (y < bordEdge.ymin) {
      return chkDirXY.S;
    } else {
      return chkDirXY.C;
    }
  }
}

function updatebordEdge(x, y) {
  if (x > bordEdge.xmax) {
    bordEdge.xmax = x;
  } else if (x < bordEdge.xmin) {
    bordEdge.xmin = x;
  }
  if (y > bordEdge.ymax) {
    bordEdge.ymax = y;
  } else if (y < bordEdge.ymin) {
    bordEdge.ymin = y;
  }
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

function putOwnPiece(x, y, userId) {
  putPieces.push([x, y, userId]);
  pieces.push({ x, y, userId });
  user[userId] = (user[userId] !== undefined)
    ? user[userId] += 1 : user[userId] = 1;
  pos[makeCoordinate(x, y)] = pieces.length - 1;
  updatebordEdge(x, y);
  return true;
}

function havePiece(userId) {
  if (user[userId] === undefined) return false;
  if (user[userId] === 0) return false;
  return true;
}

module.exports = { initPieces, judgePiece, getPieces };
