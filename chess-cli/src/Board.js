// src/Board.js
import chalk from 'chalk';
import Piece from './pieces/Piece.js';
import Pawn from './pieces/Pawn.js';
import Knight from './pieces/Knight.js';
import Rook from './pieces/Rook.js';
import Bishop from './pieces/Bishop.js';
import Queen from './pieces/Queen.js';
import King from './pieces/King.js';

export default class Board {
    constructor() {
        this.grid = [
            // Baris Hitam (Index 0)
            [new Rook('black', '♜'), new Knight('black', '♞'), new Bishop('black', '♝'), new Queen('black', '♛'), new King('black', '♚'), new Bishop('black', '♝'), new Knight('black', '♞'), new Rook('black', '♜')],
            // Baris Pion Hitam
            [new Pawn('black', '♟'), new Pawn('black', '♟'), new Pawn('black', '♟'), new Pawn('black', '♟'), new Pawn('black', '♟'), new Pawn('black', '♟'), new Pawn('black', '♟'), new Pawn('black', '♟')],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            // Baris Pion Putih
            [new Pawn('white', '♟'), new Pawn('white', '♟'), new Pawn('white', '♟'), new Pawn('white', '♟'), new Pawn('white', '♟'), new Pawn('white', '♟'), new Pawn('white', '♟'), new Pawn('white', '♟')],
            // Baris Putih (Index 7)
            [new Rook('white', '♜'), new Knight('white', '♞'), new Bishop('white', '♝'), new Queen('white', '♛'), new King('white', '♚'), new Bishop('white', '♝'), new Knight('white', '♞'), new Rook('white', '♜')]
        ];

    }

    render() {
        console.clear();
        console.log("\n    a b c d e f g h");
        console.log("   ------------------");

        for (let row = 0; row < 8; row++) {
            let rowStr = `${8 - row} | `;
            
            for (let col = 0; col < 8; col++) {
                const cell = this.grid[row][col];
        
                const isLightSquare = (row + col) % 2 === 0;
                
                // Menggunakan warna Hex agar lebih presisi. 
                // Kamu bisa ganti kode hex ini sesuai selera estetikamu.
                const applyBackground = isLightSquare 
                    ? chalk.bgHex('#a3a3a3') // Abu-abu terang
                    : chalk.bgHex('#404040'); // Abu-abu gelap
                
                if (cell !== '.') {
                    const symbol = cell.symbol;
                    const styledPiece = cell.color === 'white'
                        ? chalk.whiteBright(symbol)
                        : chalk.black(symbol);

                    rowStr += applyBackground(styledPiece + ' ');
                } else {
                    rowStr += applyBackground('  ');
                }
            }
            
            rowStr += ` | ${8 - row}`;
            console.log(rowStr);
        }

        console.log("   ------------------");
        console.log("    a b c d e f g h\n");
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.grid[fromRow][fromCol];

        // LOGIKA ROKADE: Jika yang bergerak Raja dan jaraknya 2 kotak
        if (piece.constructor.name === 'King' && Math.abs(fromCol - toCol) === 2) {
            // Rokade Pendek (Kingside) -> ke kolom 6 (g1/g8)
            if (toCol === 6) {
                const rook = this.grid[fromRow][7];
                this.grid[fromRow][5] = rook; // Pindahkan Benteng ke f1/f8
                this.grid[fromRow][7] = '.';
                rook.hasMoved = true;
            } 
            // Rokade Panjang (Queenside) -> ke kolom 2 (c1/c8)
            else if (toCol === 2) {
                const rook = this.grid[fromRow][0];
                this.grid[fromRow][3] = rook; // Pindahkan Benteng ke d1/d8
                this.grid[fromRow][0] = '.';
                rook.hasMoved = true;
            }
        }

        // Pindahkan bidak utama (Raja atau bidak lainnya)
        this.grid[toRow][toCol] = piece;
        this.grid[fromRow][fromCol] = '.';
        
        // Tandai bahwa bidak ini sudah pernah bergerak
        piece.hasMoved = true; 
    }

    findKingPosition(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.grid[row][col];

                if (piece !== '.' && piece.constructor.name === 'King' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    isCheck(color) {
        const kingPos = this.findKingPosition(color);
        if (!kingPos) return false;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.grid[row][col];

                if (piece !== '.' && piece.color !== color) {
                    if (piece.isValidMove(row, col, kingPos.row, kingPos.col, this.grid)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCheckMate(color) {
        if (!this.isCheck(color)) return false;

        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.grid[fromRow][fromCol];

                if (piece !== '.' && piece.color === color) {

                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {

                            if (piece.isValidMove(fromRow, fromCol, toRow, toCol, this.grid)) {

                                const targetBackup = this.grid[toRow][toCol];
                                this.grid[toRow][toCol] = piece;
                                this.grid[fromRow][fromCol] = '.';

                                const stillInCheck = this.isCheck(color);

                                this.grid[fromRow][fromCol] = piece;
                                this.grid[toRow][toCol] = targetBackup;

                                if (!stillInCheck) {
                                    return false;
                                }

                            }

                        }
                    }

                }
            }
        }
        return true;
    }
}