const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

require('dotenv').config();

module.exports = class WebSocketServer {
    constructor() {
        this.server = null;
        this.httpServer = null;
        this.io = null;
    }

    async start() {
        this.initServer();
        this.initMiddlewares();
        this.initRoutes();
        this.initWsHandlers();
        return this.startListening();
    }

    initServer() {
        this.server = express();
        this.httpServer = http.createServer(this.server);
        this.io = socketIo(this.httpServer)
    }

    initMiddlewares() {
        this.server.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
        this.server.use(bodyParser.json()); // to support JSON-encoded bodies
        this.server.use(express.static(path.join(__dirname, "views")));
    }

    initRoutes() {}

    initWsHandlers() {
        this.io.on('connection', (socket) => {
            console.log("connection received");
            socket.on("chat message", (data) => {
                this.io.emit("chat message", data);
            })
        })
    }

    startListening() {
        const PORT = 4040;

        return this.httpServer.listen(PORT, () => {
            console.log("Server listen on port", PORT);
        });
    }
}