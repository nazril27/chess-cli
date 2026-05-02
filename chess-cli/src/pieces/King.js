// src/pieces/King.js
import Piece from './Piece.js';

export default class King extends Piece {
    constructor(color, symbol) {
        super(color, symbol);
    }

    isValidMove(fromRow, fromCol, toRow, toCol, boardGrid) {
        if (fromRow === toRow && fromCol === toCol) return false;

        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);

        // --- GERAKAN NORMAL RAJA (1 KOTAK) ---
        if (rowDiff <= 1 && colDiff <= 1) {
            const targetCell = boardGrid[toRow][toCol];
            return targetCell === '.' || targetCell.color !== this.color;
        }

        // --- GERAKAN ROKADE (2 KOTAK HORIZONTAL) ---
        // Syarat: Raja belum bergerak, gerak hanya di baris yang sama, dan geser 2 kolom
        if (!this.hasMoved && rowDiff === 0 && colDiff === 2) {
            
            // Rokade Pendek (Geser ke g1/g8)
            if (toCol === 6) {
                const rook = boardGrid[fromRow][7]; // Cek Benteng di pojok kanan
                if (rook !== '.' && rook.constructor.name === 'Rook' && !rook.hasMoved) {
                    // Pastikan jalur f1 dan g1 (atau f8 dan g8) kosong
                    if (boardGrid[fromRow][5] === '.' && boardGrid[fromRow][6] === '.') {
                        return true;
                    }
                }
            }
            
            // Rokade Panjang (Geser ke c1/c8)
            else if (toCol === 2) {
                const rook = boardGrid[fromRow][0]; // Cek Benteng di pojok kiri
                if (rook !== '.' && rook.constructor.name === 'Rook' && !rook.hasMoved) {
                    // Pastikan jalur b1, c1, d1 (atau b8, c8, d8) kosong
                    if (boardGrid[fromRow][1] === '.' && boardGrid[fromRow][2] === '.' && boardGrid[fromRow][3] === '.') {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}