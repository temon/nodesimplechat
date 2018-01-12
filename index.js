const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const appHttp = http.Server(app);
const io = socketIO(appHttp);

// routing
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let clients = [];

io.on('connection', (socket) => {
  console.log('a new client connected', socket.id);

  clients = [...clients, socket.id];
  io.emit('client-change', clients);

  socket.on('disconnect', () => {
    console.log('this client disconnected : ', socket.id);
    clients = clients.filter((client) => client !== socket.id);
    io.emit('client-change', clients);
  });

  socket.on('send-message', (data) => {
    const message = data.message;
    const to = data.to;
    console.log(message);
    if (to === "all") {
      io.emit('message-from-server', message);
    } else {
      io.to(to).emit('message-from-server', message);
    }
  });
});

appHttp.listen(3000, () => {
  console.log('server running');
});