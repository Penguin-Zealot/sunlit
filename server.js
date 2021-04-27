//import express from "express";
//import * as http from "http";
//import next from "next";
//import * as socketio from "socket.io";
const express = require("express");
const http = require("http");
const next = require("next");
const socketio = require("socket.io");

const port = parseInt(process.env.PORT || "3000", 10);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = http.createServer(app);
  const io = new socketio.Server();
  io.attach(server);

  io.on("connection", (socket) => {
    console.log("connection");
    socket.emit("status", "Hello from Socket.io");

    // add socket events
    socket.on("toggle", (data) => {
      console.log(data);
      io.emit("message", `any message: ${data}`);
      socket.emit("message", `your message: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });

  /*
  io.on("connect", (socket) => {
    console.log("a user connected");
    socket.emit("status", "Hello from Socket.io");

    socket.on("toggle", (data) => {
      console.log(data);
      io.emit("toggle", data);
    });
  });
  */

  app.all("*", (req, res) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
