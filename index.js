import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "https://mahesh4net.github.io", // Replace with your frontend URL
    methods: ["GET", "POST"], // Allowed HTTP methods
  })
);

const io = new Server(server, {
  cors: {
    origin: "https://mahesh4net.github.io", // Allow your GitHub Pages site to connect
    methods: ["GET", "POST"], // Allowed request methods
  },
});
let yourmark;
const users = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);

    const roomID = users[socket.id]; // Retrieve the room the user was part of
    if (roomID) {
      console.log(`Player disconnected from room ${roomID}`);
      socket.to(roomID).emit("opponentDisconnected", "Your opponent has disconnected.");

      // Clean up the stored user data
      delete users[socket.id];
    }
  });

  socket.on("joinRoom", (defaultRoomData) => {
    if (defaultRoomData) {
      // Leave all previously joined rooms (except the socket's own room)
      // Get all rooms the socket is in

      // Do not leave the default room for the socket itself
      if (defaultRoomData.firstTODisconnect) {
        socket.to(users[socket.id]).emit("opponentDisconnected", "Your opponent has disconnected.");
      }
      socket.leave(users[socket.id]);
      console.log(`User ${socket.id} left room ${users[socket.id]}`);

      // Update user room tracking
      users[socket.id] = defaultRoomData.roomId;

      // Join the new room
      socket.join(defaultRoomData.roomId);
      console.log(`User ${socket.id} joined room ${defaultRoomData.roomId}`);

      // Randomly assign the user's mark
      const yourmark = Math.random() < 0.5 ? "o" : "x";
      socket.emit("roomJoined", yourmark);
    }
  });

  socket.on("changeRoom", (roomdata) => {
    const { oldroom, newroom } = roomdata;
    console.log(newroom, "this is the room player want to join");
    // Leave old room
    socket.leave(oldroom);

    const clientsInRoom = io.sockets.adapter.rooms.get(newroom);
    const playerCount = clientsInRoom ? clientsInRoom.size : 0;
    console.log(clientsInRoom);

    if (playerCount === 0) {
      socket.emit("roomEmpty", "No players are online in this room.");
    } else if (playerCount >= 2) {
      socket.emit("roomFull", "This room is already full.");
    } else {
      // Join new room
      const yourmark = Math.random() < 0.5 ? "o" : "x";
      const opponentmark = yourmark === "o" ? "x" : "o";

      socket.join(newroom);
      users[socket.id] = newroom;
      socket.emit("newRoomJoined", { newroom, yourmark });
      socket.to(newroom).emit("joinRequest", opponentmark);
      console.log(`Player changed to room ${newroom}`);
    }
  });

  // MOVES AND GAME LOGIC

  socket.on("move", (move) => {
    console.log("user played: " + move);
  });

  socket.on("handleClick", (clickdata) => {
    socket.to(clickdata.joinedRoom).emit("serverHandleClick", clickdata.elementid);
  });

  socket.on("restart", (joinedRoom) => {
    socket.to(joinedRoom).emit("serverRestart");
  });

  socket.on("exit", (currentRoom) => {
    socket.to(currentRoom).emit("opponentExit");
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
