const pieces = [];

module.exports = {
  initPieces() {
    pieces.length = 0;
    pieces[0] = {
      x: 0,
      y: 0,
      userId: 1,
    };
  },
  judgePiece(x, y, userId) {
    return true;
  },
  getPieces() {
    return pieces;
  },
};
