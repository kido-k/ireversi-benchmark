
const pieces = [];
const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [[0, 1], [1, 0], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]];
const reversePieces = [];

let pos = {};
let user = {};

let returns = [];
let firsts = [];
let seconds = [];
let puts = [];

function initPieces() {
  pieces.length = 0;
  pieces[0] = { x: 0, y: 0, userId: 1, };
  delete pos, user;
  pos = { "0,0": 0 }, user = { 1: 1 };
}

function getPieces() {
  // returns:  1740
  // firsts:  21630
  // seconds: 98710
  // puts:   100000
  console.log("returns" + returns.length);
  console.log("firsts" + firsts.length);
  console.log("seconds" + seconds.length);
  console.log("puts" + puts.length);
  return pieces;
}



function judgePiece(x, y, userId) {

  const coordinate = "" + x + "," + y;
  if (pos[coordinate] !== undefined) {  //既に駒が置かれてないかチェック
    returns.push([x, y, userId]);
    return false;
  }


  if (haveOwnPiece(userId)) {      // １枚目か、２枚目以降かをチェック
    seconds.push([x, y, userId]);
    reversePieces.length = 0;

    for (let dir of dirAll) {
      makeReversePieces(x + dir[0], y + dir[1], userId, dir, reversePieces);
    }
    if (reversePieces.length > 0) {        // ひっくり返す駒があればuserIdを書き換える
      for (let idx of reversePieces) {
        user[pieces[idx].userId] -= 1;
        user[userId] += 1;
        pieces[idx].userId = userId;
      }
      return putOwnPiece(x, y, userId)
    }
  } else {
    firsts.push([x, y, userId]);
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
    return makeReversePieces(x + dir[0], y + dir[1], userId, dir, array);
  } else {
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
  puts.push([x, y, userId]);
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


// const pieces = [];
// const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
// const dirAll = [[0, 1], [1, 0], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]];

// let pos = {};
// let user = {};

// function initPieces() {
//   pieces.length = 0;
//   pieces[0] = { x: 0, y: 0, userId: 1, };
//   delete pos, user;
//   pos = { "0,0": 0 }, user = { 1: 1 };
// }

// function getPieces() {
//   return pieces;
// }

// function judgePiece(x, y, userId) {
//   const coordinate = "" + x + "," + y;
//   if (pos[coordinate] !== undefined) {  //既に駒が置かれてないかチェック
//     return false;
//   }

//   let doneReverse = false;

//   if (haveOwnPiece(userId)) {      // １枚目か、２枚目以降かをチェック
//     for (let dir of dirAll) {
//       const reversePieces = makeReversePieces(x + dir[0], y + dir[1], userId, dir, []);
//       if (reversePieces) {        // ひっくり返す駒があればuserIdを書き換える
//         doneReverse = true;
//         for (let idx of reversePieces) {
//           user[pieces[idx].userId] -= 1;
//           user[userId] += 1;
//           pieces[idx].userId = userId;
//         }
//       }
//     }
//     if (doneReverse) { return putOwnPiece(x, y, userId) };
//   } else {
//     for (let dir of dirXY) {  //四方のどこかに他者の駒があるかどうかをチェック
//       if (checkPosition(x + dir[0], y + dir[1]) !== undefined) {
//         return putOwnPiece(x, y, userId);
//       }
//     }
//   }
//   return false;
// }

// function haveOwnPiece(userId) {
//   if (user[userId] > 0) { return true }
//   else { return false }
// }

// function checkPosition(x, y) {
//   const coordinate = "" + x + "," + y;
//   if (pos[coordinate] !== undefined) {
//     return pos[coordinate];
//   }
//   return undefined;
// }

// function makeReversePieces(x, y, userId, dir, array) {
//   let idx = checkPosition(x, y);
//   if (idx === undefined) {
//     return undefined;
//   } else if (pieces[idx].userId !== userId) {
//     array.push(idx);
//     return makeReversePieces(x + dir[0], y + dir[1], userId, dir, array);
//   } else {
//     return array;
//   }
// }

// function putOwnPiece(x, y, userId) {
//   pieces.push({ x, y, userId });
//   pos["" + x + "," + y] = pieces.length - 1;
//   user[userId] = user[userId] !== undefined
//     ? user[userId] += 1 : user[userId] = 1;
//   return true;
// }

// module.exports = { initPieces, judgePiece, getPieces };
