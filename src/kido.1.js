let pieces = [];
const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [...dirXY, [-1, -1], [-1, 1], [1, 1], [1, -1]];

const SIZE = 255 * 2;
const HOSEI = 255;

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
  delete pos;
  pieces.length = 0;
  pieces = new Array(SIZE).fill(0);
  for (let i = 0; i <= SIZE; i += 1) {
    pieces[i] = new Array(SIZE).fill(0);
  }
  pieces[HOSEI][HOSEI] = 1;
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
  // console.log(returns);
  const re_pieces = [];
  for(let i = 0; i <= SIZE; i += 1){
    for(let j = 0; j <= SIZE; j += 1){
      const userId = pieces[i][j];
      if(pieces[i][j] !==0 && pieces[i][j] !==undefined){
        let x = j -HOSEI;
        let y = i -HOSEI;
        const obj = {x,y,userId}
        re_pieces.push(obj);
      }
    }
  }
  return re_pieces;
}

function judgePiece(x, y, userId) {
  if (pieces[y + HOSEI][x + HOSEI] !== 0) {
    returns.push([x, y, userId]);
    return false;
  }

  let doneReverse = false;

  if (user[userId] > 0) {
    // １枚目か、２枚目以降かをチェック
    seconds.push([x, y, userId]);
    for (let dir of dirAll) {
      const reversePieces = makeReversePieces(
        y + dir[1], x + dir[0], userId, dir, []
      );
      if (reversePieces) {
        // ひっくり返す駒があればuserIdを書き換える
        doneReverse = true;
        for (let xy of reversePieces) {
          user[pieces[xy[1] + HOSEI][xy[0] + HOSEI]] -= 1;
          user[userId] += 1;
          pieces[xy[1] + HOSEI][xy[0] + HOSEI] = userId;
        }
      }
    }
    if (doneReverse) {
      puts.push([x, y, userId]);
      pieces[y + HOSEI][x + HOSEI] = userId;
      user[userId] += 1;
      return true;
    }
  } else {
    firsts.push([x, y, userId]);
    for (let dir of dirXY) {
      //四方のどこかに他者の駒があるかどうかをチェック
      if (pieces[y + dir[1] + HOSEI][x + dir[0] + HOSEI] !== 0) {
        puts.push([x, y, userId]);        
        pieces[y + HOSEI][x + HOSEI] = userId;
        user[userId] += 1;
        return true;
      }
    }
  }
  return false;
}

function makeReversePieces(y, x, userId, dir, array) {
  if (pieces[y + HOSEI][x + HOSEI] === 0) {
    return false;
  } else if (pieces[y + HOSEI][x + HOSEI] !== userId) {
    array.push([x, y]);
    return makeReversePieces(y + dir[1], x + dir[0], userId, dir, array);
  } else {
    return array;
  }
}

module.exports = { initPieces, judgePiece, getPieces };
