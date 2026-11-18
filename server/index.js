const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Serve static files from client build in production
const CLIENT_BUILD_PATH = path.join(__dirname, '../client/dist');
const CLIENT_INDEX = path.join(CLIENT_BUILD_PATH, 'index.html');
const buildExists = process.env.NODE_ENV === 'production' && fs.existsSync(CLIENT_INDEX);

if (buildExists) {
  app.use(express.static(CLIENT_BUILD_PATH));
  app.get('*', (req, res) => {
    res.sendFile(CLIENT_INDEX);
  });
} else if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.status(503).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Timepass - Building...</title>
        <link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Caveat:wght@700&family=Nunito:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body{margin:0;min-height:100vh;display:grid;place-items:center;
            background:linear-gradient(160deg,#ff8fb1,#ff5c8a 55%,#c2185b);color:#fff;
            font-family:'Nunito',sans-serif;text-align:center;padding:20px}
          h1{font-family:'Bagel Fat One';font-size:clamp(32px,6vw,56px);
            text-shadow:0 4px 0 rgba(122,31,77,.35)}
          p{font-family:'Caveat';font-size:24px;opacity:.9;margin-top:12px}
          .spinner{width:44px;height:44px;border:4px solid rgba(255,255,255,.3);
            border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite;
            margin:24px auto 0}
          @keyframes spin{to{transform:rotate(360deg)}}
        </style>
      </head>
      <body>
        <div>
          <h1>Timepass</h1>
          <p>Building the frontend… please wait a moment, then refresh 💕</p>
          <div class="spinner"></div>
        </div>
      </body>
      </html>
    `);
  });
}

// In-memory data stores — users tracked by socketId only, no access keys
const users = new Map();      // socketId -> { username, gender, online, chatId, chatPartner }
const chats = new Map();      // "socketId1:socketId2" -> [messages]
const chatRequests = new Map(); // socketId -> { from, fromSocketId }

function setUser(socketId, data) {
  const existing = users.get(socketId) || { username: null, gender: null, online: false };
  users.set(socketId, { ...existing, ...data, online: true });
}

function getUser(socketId) {
  return users.get(socketId);
}

function getOnlineUsersList() {
  const list = [];
  users.forEach((user, socketId) => {
    if (user.online && user.username) {
      list.push({ username: user.username, gender: user.gender, socketId });
    }
  });
  return list;
}

function findSocketByUser(userObj) {
  for (const [sid, u] of users) {
    if (u === userObj) return sid;
  }
  return null;
}

function getChatId(id1, id2) {
  return [id1, id2].sort().join(':');
}

// Socket.io handling
io.on('connection', (socket) => {
  // Initialize user record
  setUser(socket.id, { username: null, gender: null });

  // Set profile (username + gender) — no access key needed
  socket.on('set-profile', (data) => {
    const { username, gender } = data;
    if (username && gender) {
      setUser(socket.id, { username, gender });
      io.emit('user-list-update', getOnlineUsersList());
    }
  });

  // Send chat request to another user
  socket.on('send-chat-request', (targetSocketId) => {
    const sender = users.get(socket.id);
    const receiver = users.get(targetSocketId);
    if (sender && receiver && receiver.online && receiver.username) {
      chatRequests.set(targetSocketId, { from: sender.username, fromSocketId: socket.id });
      io.to(targetSocketId).emit('chat-request', { from: sender.username, fromSocketId: socket.id });
    }
  });

  // Accept chat request
  socket.on('accept-chat', (fromSocketId) => {
    const sender = users.get(fromSocketId);
    const receiver = users.get(socket.id);
    if (sender && receiver) {
      const chatId = getChatId(socket.id, fromSocketId);
      sender.chatId = chatId;
      receiver.chatId = chatId;
      sender.chatPartner = socket.id;
      receiver.chatPartner = fromSocketId;
      io.to(fromSocketId).emit('chat-started', { partner: receiver.username, chatId });
      io.to(socket.id).emit('chat-started', { partner: sender.username, chatId });
    }
  });

  // Decline chat request
  socket.on('decline-chat', (fromSocketId) => {
    const sender = users.get(fromSocketId);
    if (sender && sender.online) {
      io.to(fromSocketId).emit('chat-declined');
    }
  });

  // Send message
  socket.on('send-message', (data) => {
    const { chatId, message } = data;
    const sender = users.get(socket.id);
    if (!sender || !sender.chatId) return;
    // Find partner in this chat
    const partnerSocketId = sender.chatPartner;
    const partner = users.get(partnerSocketId);
    if (partner && partner.online) {
      const msg = { sender: sender.username, text: message, timestamp: Date.now() };
      if (!chats.has(chatId)) chats.set(chatId, []);
      chats.get(chatId).push(msg);
      io.to(partnerSocketId).emit('new-message', msg);
      io.to(socket.id).emit('new-message', msg);
    }
  });

  // Exit chat — delete messages for both
  socket.on('exit-chat', () => {
    const user = users.get(socket.id);
    if (user && user.chatId) {
      const partnerSocketId = user.chatPartner;
      const partner = users.get(partnerSocketId);
      if (partner) {
        partner.chatId = null;
        partner.chatPartner = null;
        io.to(partnerSocketId).emit('chat-exited');
      }
      chats.delete(user.chatId);
      user.chatId = null;
      user.chatPartner = null;
      io.to(socket.id).emit('chat-exited');
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      if (user.chatId) {
        const partnerSocketId = user.chatPartner;
        const partner = users.get(partnerSocketId);
        if (partner) {
          partner.chatId = null;
          partner.chatPartner = null;
        }
        chats.delete(user.chatId);
      }
      user.online = false;
    }
    io.emit('user-list-update', getOnlineUsersList());
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Timepass server running on port ${PORT}`);
});
