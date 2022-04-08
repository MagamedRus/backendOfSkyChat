import { WebSocketServer } from "ws";

class WebSocketController {
  constructor(server) {
    this.webSocketServer = new WebSocketServer({ server });
  }

  _dispatchEvent = (message, ws) => {
    const json = JSON.parse(message);
    switch (json.event) {
      case "chat-message":
        console.log(json);
        this.webSocketServer.clients.forEach((client) =>
          client.send(JSON.stringify(json))
        );
        break;
      default:
        ws.send(new Error("Wrong query").message);
    }
  };

  startWebSocketConnection = (server) => {
    this.webSocketServer.on("connection", (ws) => {
      ws.on("message", (m) => this._dispatchEvent(m, ws));
      ws.on("error", (e) => ws.send(e));
      // ws.send("Hi there, I am a WebSocket server");
    });
  };
}

export default WebSocketController;
