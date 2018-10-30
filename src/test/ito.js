const pieceMap = new Map();
const dirXY = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirAll = [...dirXY, [-1, -1], [-1, 1], [1, 1], [1, -1]];

function initPieces() {
    pieceMap.clear();
    pieceMap.set('0,0', 1);
}

function getPieces() {
    const pieces = [...pieceMap];
    for (let i = 0; i < pieces.length; i += 1) {
        const coordinate = pieces[i][0].split(',');
        pieces[i] = {
            x: parseInt(coordinate[0]),
            y: parseInt(coordinate[1]),
            userId: pieces[i][1],
        };
    }
    return pieces;
}

function judgePiece(x, y, userId) {
    const coordinate = [x, y].join();
    let status = false;

    // 置きたい座標のマスにすでにコマが存在するか判定
    if (pieceMap.has(coordinate)) return false;

    // 盤面に自分と同じ ID のコマが存在するか判定
    if ([...pieceMap.values()].indexOf(userId) < 0) {
        // 存在しない場合 : 置きたいマスの上下左右にコマが存在するか判定
        status =
            dirXY.reduce((acc, cv) => {
                return pieceMap.has([x + cv[0], y + cv[1]].join()) ? (acc += 1) : acc;
            }, 0) > 0;

        if (status) pieceMap.set(coordinate, userId);
    } else {
        // 存在する場合 : 置きたいマスの周囲 8 方向に自分のコマにできるコマが存在するか判定
        const coordinates = dirAll.reduce(
            (acc, cv) => {
                acc = acc.concat(judgeDirection(x, y, userId, cv));
                return acc;
            },
            [[x, y]]
        );

        if (coordinates.length > 1) {
            for (let i = 0; i < coordinates.length; i += 1) {
                pieceMap.set([coordinates[i][0], coordinates[i][1]].join(), userId);
            }
            status = true;
        }
    }
    return status;
}

function judgeDirection(x, y, userId, nexts, results = []) {
    const nextCoordinate = [x + nexts[0], y + nexts[1]];
    const nextCoordinateUserId = pieceMap.get(nextCoordinate.join());
    if (nextCoordinateUserId === userId && results.length > 0) {
        return results;
    } else if (nextCoordinateUserId && nextCoordinateUserId !== userId) {
        results.push([...nextCoordinate]);
        return judgeDirection(...nextCoordinate, userId, nexts, results);
    } else {
        return [];
    }
}

module.exports = { initPieces, judgePiece, getPieces };