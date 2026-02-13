const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let chessBoard = [...Array(8)].map(e => Array(8).fill(null));

// Handle connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Send the current state of the chess board when a new client connects
    socket.emit('updateBoard', chessBoard);

    // Handle move made by a player
    socket.on('makeMove', (move) => {
        // Update the chessBoard based on the move
        // This is where you would handle game logic (validation, etc.)
        const { from, to } = move;
        const piece = chessBoard[from.row][from.col];
        chessBoard[from.row][from.col] = null;
        chessBoard[to.row][to.col] = piece;

        // Notify all clients of the board update
        io.emit('updateBoard', chessBoard);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
