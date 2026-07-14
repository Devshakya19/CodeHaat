require("dotenv").config();
const { WebSocketServer } = require("ws");
const Redis = require("ioredis");
const http = require("http");

const PORT = process.env.PORT || 4004;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      service: "codehaat-realtime",
      version: "0.1.0",
      connections: clients.size,
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Connect to Redis with error handling
const pub = new Redis(REDIS_URL, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

const sub = new Redis(REDIS_URL, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

pub.on("error", (err) => {
  console.error("Redis pub error:", err.message);
});

sub.on("error", (err) => {
  console.error("Redis sub error:", err.message);
});

pub.on("connect", () => {
  console.log("Redis pub connected");
});

sub.on("connect", () => {
  console.log("Redis sub connected");
});

// Create WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server });

// Store connected clients by user ID
const clients = new Map();

wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection");

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "auth") {
        // Store client by user ID
        clients.set(message.userId, ws);
        console.log(`User ${message.userId} connected`);
        ws.send(JSON.stringify({ type: "auth_success" }));
      }
    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    // Remove client from map
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
  });
});

// Subscribe to Redis channels
sub.subscribe("notifications", "order_updates", "repo_transfer", (err) => {
  if (err) {
    console.error("Failed to subscribe to Redis channels:", err.message);
  } else {
    console.log("Subscribed to Redis channels: notifications, order_updates, repo_transfer");
  }
});

sub.on("message", (channel, message) => {
  try {
    const data = JSON.parse(message);

    if (data.userId && clients.has(data.userId)) {
      const ws = clients.get(data.userId);
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: channel,
          data: data,
        }));
      }
    }
  } catch (err) {
    console.error("Error processing message:", err);
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Real-time service running on port ${PORT}`);
});
