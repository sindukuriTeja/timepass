const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// In-memory data stores
const users = new Map();      // keyHash -> { username, gender, socketId, online, keyHash }
const accessKeys = new Map(); // rawKey -> keyHash (for duplicate check)
const chats = new Map();      // "hash1:hash2" -> [messages]
const chatRequests = new Map(); // socketId -> { from, fromKeyHash }
const userSockets = new Map(); // socketId -> keyHash

async function hashKey(key) {
  return bcrypt.hash(key, 10);
}

async function compareKey(key, hash) {
  return bcrypt.compare(key, hash);
}

app.post('/api/signup', async (req, res) => {
  try {
    const { username, gender, accessKey } = req.body;
    if (!username || !gender || !accessKey) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (accessKey.length > 64) {
      return res.status(400).json({ error: 'Access key too long (max 64 chars)' });
    }
    if (accessKeys.has(accessKey)) {
      return res.status(409).json({ error: 'Access key already taken' });
    }
    const keyHash = await hashKey(accessKey);
    accessKeys.set(accessKey, keyHash);
    users.set(keyHash, { username, gender, socketId: null, online: false, keyHash });
    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { accessKey } = req.body;
    if (!accessKey) {
      return res.status(400).json({ error: 'Access key is required' });
    }
    const keyHash = accessKeys.get(accessKey);
    if (!keyHash) {
      return res.status(401).json({ error: 'Invalid access key' });
    }
    const user = users.get(keyHash);
    if (!user) {
      return res.status(401).json({ error: 'Invalid access key' });
    }
    res.json({ success: true, username: user.username, gender: user.gender, keyHash });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/change-key', async (req, res) => {
  try {
    const { oldKey, newKey, keyHash } = req.body;
    if (!oldKey || !newKey) {
      return res.status(400).json({ error: 'Both keys required' });
    }
    if (newKey.length > 64) {
      return res.status(400).json({ error: 'New key too long (max 64 chars)' });
    }
    if (accessKeys.has(newKey)) {
      return res.status(409).json({ error: 'New access key already taken' });
    }
    const valid = await compareKey(oldKey, keyHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid current key' });
    }
    const user = users.get(keyHash);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove old key mapping
    accessKeys.delete(oldKey);
    // Add new key
    const newHash = await hashKey(newKey);
    accessKeys.set(newKey, newHash);
    // Update user reference
    users.delete(keyHash);
    user.keyHash = newHash;
    users.set(newHash, user);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/update-profile', (req, res) => {
  try {
    const { keyHash, username, gender } = req.body;
    const user = users.get(keyHash);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (username) user.username = username;
    if (gender) user.gender = gender;
    res.json({ success: true, username: user.username, gender: user.gender });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/available-users/:keyHash', (req, res) => {
  try {
    const { keyHash } = req.params;
    const currentUser = users.get(keyHash);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const available = [];
    users.forEach((user, hash) => {
      if (hash === keyHash) return;
      if (!user.online) return;
      if (currentUser.gender === 'Others') {
        available.push({ username: user.username, gender: user.gender, keyHash: hash });
      } else if (user.gender !== currentUser.gender) {
        available.push({ username: user.username, gender: user.gender, keyHash: hash });
      }
    });
    res.json(available);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

io.on('connection', (socket) => {
  let currentKeyHash = null;

  socket.on('register', (keyHash) => {
    currentKeyHash = keyHash;
    userSockets.set(socket.id, keyHash);
    const user = users.get(keyHash);
    if (user) {
      user.socketId = socket.id;
      user.online = true;
      io.emit('user-list-update', getOnlineUsersList());
    }
  });

  socket.on('send-chat-request', (targetKeyHash) => {
    const sender = users.get(currentKeyHash);
    const receiver = users.get(targetKeyHash);
    if (sender && receiver && receiver.socketId) {
      chatRequests.set(receiver.socketId, { from: sender.username, fromKeyHash: currentKeyHash });
      io.to(receiver.socketId).emit('chat-request', { from: sender.username, fromKeyHash: currentKeyHash });
    }
  });

  socket.on('accept-chat', (fromKeyHash) => {
    const sender = users.get(fromKeyHash);
    const receiver = users.get(currentKeyHash);
    if (sender && receiver) {
      const chatId = getChatId(currentKeyHash, fromKeyHash);
      sender.chatId = chatId;
      receiver.chatId = chatId;
      sender.chatPartner = currentKeyHash;
      receiver.chatPartner = fromKeyHash;
      if (sender.socketId) io.to(sender.socketId).emit('chat-started', { partner: receiver.username, chatId });
      if (receiver.socketId) io.to(receiver.socketId).emit('chat-started', { partner: sender.username, chatId });
    }
  });

  socket.on('decline-chat', (fromKeyHash) => {
    const sender = users.get(fromKeyHash);
    if (sender && sender.socketId) {
      io.to(sender.socketId).emit('chat-declined');
    }
  });

  socket.on('send-message', (data) => {
    const { chatId, message, senderKeyHash } = data;
    const sender = users.get(senderKeyHash);
    const allUsers = Array.from(users.values());
    const partner = allUsers.find(u => u.chatId === chatId && u.keyHash !== senderKeyHash);
    if (sender && partner && partner.socketId) {
      const msg = {
        sender: sender.username,
        text: message,
        timestamp: Date.now()
      };
      if (!chats.has(chatId)) chats.set(chatId, []);
      chats.get(chatId).push(msg);
      io.to(partner.socketId).emit('new-message', msg);
      if (sender.socketId) io.to(sender.socketId).emit('new-message', msg);
    }
  });

  socket.on('exit-chat', () => {
    const user = users.get(currentKeyHash);
    if (user && user.chatId) {
      const allUsers = Array.from(users.values());
      const partner = allUsers.find(u => u.chatId === user.chatId && u.keyHash !== currentKeyHash);
      if (partner && partner.socketId) {
        io.to(partner.socketId).emit('chat-exited');
      }
      chats.delete(user.chatId);
      user.chatId = null;
      user.chatPartner = null;
      if (user.socketId) io.to(user.socketId).emit('chat-exited');
    }
  });

  socket.on('disconnect', () => {
    if (currentKeyHash) {
      const user = users.get(currentKeyHash);
      if (user) {
        user.online = false;
        user.socketId = null;
        if (user.chatId) {
          const allUsers = Array.from(users.values());
          const partner = allUsers.find(u => u.chatId === user.chatId && u.keyHash !== currentKeyHash);
          if (partner) {
            partner.chatId = null;
            partner.chatPartner = null;
          }
          chats.delete(user.chatId);
        }
      }
      userSockets.delete(socket.id);
      io.emit('user-list-update', getOnlineUsersList());
    }
  });
});

function getChatId(hash1, hash2) {
  return [hash1, hash2].sort().join(':');
}

function getOnlineUsersList() {
  const list = [];
  users.forEach((user) => {
    if (user.online) {
      list.push({ username: user.username, gender: user.gender });
    }
  });
  return list;
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Timepass server running on port ${PORT}`);
});
