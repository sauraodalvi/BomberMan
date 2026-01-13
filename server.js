const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Game state
let players = {}; // socket.id -> { id: 'p1'|'p2', x, y, tileX, tileY }
let mapSeed = Math.floor(Math.random() * 100000);
let readyCount = 0;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Simple slot assignment
    const currentIds = Object.values(players).map(p => p.slot);
    let slot = null;
    if (!currentIds.includes('p1')) slot = 'p1';
    else if (!currentIds.includes('p2')) slot = 'p2';

    if (!slot) {
        socket.emit('server:full');
        socket.disconnect();
        return;
    }

    players[socket.id] = { slot, x: 0, y: 0 };

    // Send initial config
    socket.emit('game:init', { slot, mapSeed, players: Object.values(players) });

    // Notify others
    socket.broadcast.emit('player:join', { id: socket.id, slot });

    socket.on('player:move', (data) => {
        // broadcast movement to everyone else
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            socket.broadcast.emit('player:moved', { slot: players[socket.id].slot, ...data });
        }
    });

    socket.on('player:placeBomb', (data) => {
        // data = { tileX, tileY }
        const p = players[socket.id];
        if (p) {
            io.emit('game:placeBomb', { slot: p.slot, ...data });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const p = players[socket.id];
        if (p) {
            delete players[socket.id];
            io.emit('player:leave', { slot: p.slot });
        }
        // If empty, reset seed
        if (Object.keys(players).length === 0) {
            mapSeed = Math.floor(Math.random() * 100000);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
