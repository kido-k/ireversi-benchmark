const pieces = [];
const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [...dirXY, [-1, -1], [-1, 1], [1, 1], [1, -1]];

let pos = {},
  user = {};

let returns = [];
let firsts = [];
let seconds = [];
let puts = [];

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
  let coordinate = "";
  delete pos;
  pieces.length = 0;

  for (let x = -255; x <= 255; x += 1) {
    for (let y = -255; y <= 255; y += 1) {
      // pieces.push({ x, y, userId: 0 });
      coordinate = "" + x + "," + y;
      pos[coordinate] = 0;
      // cnt += 1;
    }
  }
  pos["0,0"] = 1;
}

function makeCoordinate(x, y) {
  return "" + x + "," + y;
}

function getPieces() {
  // returns:  1740
  // firsts:  21630
  // seconds: 98710
  // puts:   100000
  console.log("returns: " + returns.length);
  console.log("firsts: " + firsts.length);
  console.log("seconds: " + seconds.length);
  console.log("puts: " + puts.length);
  return pieces;
}

function judgePiece(x, y, userId) {
  if (pos[makeCoordinate(x, y)] !== 0) {
    //既に駒が置かれてないかチェック
    returns.push([x, y, userId]);
    return false;
  }

  let doneReverse = false;

  if (user[userId] > 0) {
    // １枚目か、２枚目以降かをチェック
    seconds.push([x, y, userId]);
    for (let dir of dirAll) {
      const reversePieces = makeReversePieces(
        x + dir[0],
        y + dir[1],
        userId,
        dir,
        []
      );
      if (reversePieces) {
        // ひっくり返す駒があればuserIdを書き換える
        doneReverse = true;
        for (let coordinate of reversePieces) {
          user[pos[coordinate]] -= 1;
          user[userId] += 1;
          pos[coordinate] = userId;
        }
      }
    }
    if (doneReverse) {
      puts.push([x, y, userId]);
      pos[makeCoordinate(x, y)] = userId;
      user[userId] += 1;
      return true;
    }
  } else {
    firsts.push([x, y, userId]);
    for (let dir of dirXY) {
      //四方のどこかに他者の駒があるかどうかをチェック
      let coordinate = makeCoordinate(x + dir[0], y + dir[1]);
      if (pos[coordinate] !== 0) {
        puts.push([x, y, userId]);
        pos[makeCoordinate(x, y)] = userId;
        user[userId] += 1;
        return true;
      }
    }
  }
  return false;
}

function makeReversePieces(x, y, userId, dir, array) {
  const coordinate = makeCoordinate(x, y);
  if (pos[coordinate] === 0) {
    return false;
  } else if (pos[coordinate] !== userId) {
    array.push(coordinate);
    return makeReversePieces(x + dir[0], y + dir[1], userId, dir, array);
  } else {
    // console.log("x: " + x + " y: " + y + " idx: " + idx)
    return array;
  }
}

module.exports = { initPieces, judgePiece, getPieces };
