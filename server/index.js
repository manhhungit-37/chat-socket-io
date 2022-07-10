const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const { Server } = require('socket.io');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on("disconect", () => {
    console.log("User disconected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});