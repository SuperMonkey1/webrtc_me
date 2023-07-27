const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log('User connected');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });
});

//server.listen(3000, '10.64.45.143', () => console.log('Server is running on port 3000'));
//server.listen(3000, () => console.log('Server is running on port 3000'));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));