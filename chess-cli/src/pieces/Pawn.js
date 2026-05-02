// src/pieces/Pawn.js

import Piece from './Piece.js';

export default class Pawn extends Piece {
  constructor(color, symbol) {
    super(color, symbol);
  }

  isValidMove(fromRow, fromCol, toRow, toCol, boardGrid) {
    const direction = this.color === 'white' ? -1 : 1;
    const startRow = this.color === 'white' ? 6 : 1;

    if (fromCol === toCol && toRow === fromRow + direction) {
      return boardGrid[toRow][toCol] === '.';
    }

    if (fromCol === toCol && fromRow === startRow && toRow === fromRow + (direction * 2)) {
      const isDestinationEmpty = boardGrid[toRow][toCol] === '.';
      const isPathClear = boardGrid[fromRow + direction][fromCol] === '.';
      return isDestinationEmpty && isPathClear;
    }

    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      const targetCell = boardGrid[toRow][toCol];

      if (targetCell !== '.' && targetCell.color !== this.color) {
        return true;
      }
    }

    return false;
  }
}