const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { getIceServers } = require('./services/iceService');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve welcome page on root URL
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/welcome.html'));
});

// ICE servers endpoint
app.get('/iceservers', getIceServers);

io.on('connection', socket => {
  console.log('User connected');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('initiate_connection', (offer) => {
    socket.broadcast.emit('initiate_connection', offer);
  });

  socket.on('disconnect_me', (offer) => {
    socket.broadcast.emit('initiate_connection', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));