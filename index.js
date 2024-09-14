const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let playerConnections = 0;

// Servindo os arquivos WebGL exportados pela Unity
//app.use(express.static('caminho/para/webgl/build'));

app.get("/",(req,res)=>{
    res.send("conectado");
})

io.on('connection', (socket) => {
  console.log('Novo jogador conectado: ', socket.id);
  playerConnections++;

  io.emit("UpdateListPlayer",playerConnections);
  
  socket.on('playerMove', (data) => {
    // Lógica para mover jogador e sincronizar com outros clientes
    io.emit('updatePosition', data);
  });
  
  socket.on('disconnect', () => {
    playerConnections--;
    io.emit("UpdateListPlayer",playerConnections);
    console.log('Jogador desconectado: ', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
