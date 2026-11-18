# 💕 Timepass

**From Random Hellos to Unexpected Hearts.**

A real-time chat platform where strangers connect and chat. Playful, romantic, and completely private — your chats vanish when you leave.

![Timepass](https://img.shields.io/badge/Timepass-💕-FF6B6B)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18-339933)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010133)

---

## ✨ Features

- **🎨 Romantic Design** — Blush pink, coral, rose red, soft purple & sunset gold with gradients throughout
- **💬 Real-time Chat** — Instant messaging with Socket.io
- **🚀 No Login Required** — Just pick a username and gender, then start chatting instantly
- **🤝 Smart Matching** — Male sees female, female sees male, others see everyone
- **🎤 Voice to Text** — Web Speech API integration
- **🔔 Chat Requests** — Accept/Decline notifications
- **🗑️ Auto Deletion** — Chats deleted on exit, logout, or browser close
- **⏱️ Idle Timeout** — Auto-logout after 5 hours of inactivity
- **📱 Fully Responsive** — Works on mobile, tablet & desktop

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Custom CSS with animations |
| Backend | Node.js + Express |
| Real-time | Socket.io |

---

## 📁 Project Structure

```
timepass/
├── server/
│   └── index.js              # Express + Socket.io backend
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── AuthContext.jsx
│       ├── components/
│       │   ├── ConnectCard.jsx
│       │   └── ProfileModal.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── ProfileSetup.jsx
│           ├── Dashboard.jsx
│           └── ChatPage.jsx
├── package.json
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### 1. Clone & Install

```bash
cd timepass

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 2. Add the Logo

Place your transparent PNG logo at:
```
client/public/logo.png
```

### 3. Run the App

**Development mode (both server & client):**
```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

**Run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client && npm run dev
```

### 4. Open in Browser

Navigate to **http://localhost:3000**

---

## 🎮 How to Use

### For Testing (Multiple Users)

1. Open **two browser windows** (or one regular + one incognito)
2. **Window 1:** Go to `/setup` → Pick username "Alice", Gender Female → Start Chatting
3. **Window 2:** Go to `/setup` → Pick username "Bob", Gender Male → Start Chatting
4. Both users will see each other in the Connect screen
5. Click **Chat** → Accept the request → Start chatting!

### User Flow

1. **Home Page** → Click "Chat" or "Start Chatting"
2. **Profile Setup** → Pick a username and gender (no login needed!)
3. **"Privacy is Power" splash** appears for 5 seconds
4. **Dashboard** → Click "Connect" to see online users
5. **Send Chat Request** → Wait for acceptance
6. **Chat** → Message, use mic for voice, or Exit
7. **Exit** → All messages deleted for both users

---

## 🔐 Privacy Notes

- No login, no email, no phone required — just a username and gender
- Chat data lives **only in memory** — nothing persists after exit/logout/close
- Chats are permanently deleted for both users when either clicks Exit
- Auto-logout after 5 hours of inactivity clears all chat data
- Input is validated on both client and server

---

## 🎨 Design Theme (Pink UI)

- **Colors:** Blush pink (#fff0f5), coral pink (#ff5c8a), soft pink (#ff8fb1), pale pink (#ffd1e0), sunset gold (#ffb347), deep plum (#7a1f4d)
- **Fonts:** Bagel Fat One (display/headings), Caveat (handwritten/taglines), Nunito (body)
- **Cards:** Tilted sticker-style steps, heart-shaped testimonials, glassmorphism auth cards
- **Buttons:** Glowing gradient, solid gradient with 3D shadow, outlined with hover wiggle
- **Animations:** Floating speech bubbles ("Hi!", "Hey stranger"), floating hearts, pulse glow, slide-up reveals
- **Logo:** Inline SVG heart-clock logo (no external image needed)
- **Dark mode:** Automatic via `prefers-color-scheme`

---

## 📡 Socket.io Events

All communication happens over Socket.io (no REST endpoints needed):

| Event | Direction | Description |
|-------|-----------|-------------|
| `set-profile` | Client → Server | Set username + gender |
| `send-chat-request` | Client → Server | Request to chat with a user |
| `accept-chat` | Client → Server | Accept a chat request |
| `decline-chat` | Client → Server | Decline a chat request |
| `send-message` | Client → Server | Send a chat message |
| `exit-chat` | Client → Server | End chat, delete messages |
| `user-list-update` | Server → Client | Online user list changed |
| `chat-request` | Server → Client | Someone wants to connect |
| `chat-started` | Server → Client | Chat accepted, session open |
| `chat-declined` | Server → Client | Chat request was declined |
| `new-message` | Server → Client | New message received |
| `chat-exited` | Server → Client | Chat ended by partner |

---

## 🛠️ Customization

### Change Colors
Edit CSS variables in `client/src/index.css`:
```css
:root {
  --blush: #FFE4E8;
  --coral: #FF6B6B;
  --rose: #E63946;
  --purple: #9B5DE5;
  --gold: #F4A261;
  /* ... */
}
```

### Change Idle Timeout
Edit `IDLE_TIMEOUT` in `Dashboard.jsx` and `ChatPage.jsx` (currently 5 hours).

### Change Port
Set `PORT` env var for server, edit `vite.config.js` for client port.

---

## 📦 Production Build

```bash
# Build client
cd client
npm run build
cd ..

# Start production server (serves client build)
PORT=8080 npm start
```

---

## 🐛 Troubleshooting

**"Cannot connect to server"** — Make sure the backend is running on port 5000.

**Voice input not working** — Use Chrome/Edge (best Web Speech API support).

**Users not seeing each other** — Both must be online simultaneously; check gender matching rules.

**CORS errors** — The server allows all origins by default. For production, restrict to your domain.

---

## 🚀 Deploy to Render

The project is already set up for Render deployment with `render.yaml` and `Procfile`.

### Option 1: Render Blueprint (Recommended — One Click)

1. Go to [https://render.com/blueprints](https://render.com/blueprints)
2. Click **"Deploy Full Stack"**
3. Connect your GitHub account and authorize Render
4. Select the `sindukuriTeja/timepass` repository
5. Click **"Deploy Blueprint"**
6. Render will automatically build and deploy both the backend and frontend as a single web service.

### Option 2: Manual Web Service Setup

1. Go to [https://render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect the `sindukuriTeja/timepass` repository
4. Configure:
   - **Name:** `timepass`
   - **Environment:** `Node`
   - **Build Command:** `npm ci && cd client && npm ci && npm run build && cd ..`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
6. Click **"Create Web Service"**

Render will build and deploy your app. The URL will be `https://timepass.onrender.com` (or similar).

### Notes

- The free tier spins down after 15 minutes of inactivity (first request may take ~30s to wake up).
- Chat data is stored in memory — it resets on every deploy/restart. For persistence, integrate a database (e.g., MongoDB Atlas).
- Socket.io works over WebSocket on Render; the client falls back to polling if needed.

---

## 📄 License

MIT — Made with 💕 for fun.

---

**© 2026 Timepass Pvt. Ltd. | From Random Hellos to Unexpected Hearts.**
