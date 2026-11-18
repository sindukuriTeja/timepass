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
- **🔐 Access Key Auth** — Sign up with username, gender & a secret access key. Login with just the key
- **🤝 Smart Matching** — Male sees female, female sees male, others see everyone
- **🎤 Voice to Text** — Web Speech API integration
- **🔔 Chat Requests** — Accept/Decline notifications
- **🗑️ Auto Deletion** — Chats deleted on exit, logout, or browser close
- **⏱️ Idle Timeout** — Auto-logout after 5 hours of inactivity
- **📱 Fully Responsive** — Works on mobile, tablet & desktop
- **🔒 Secure** — Access keys hashed with bcrypt, never stored in plain text

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Custom CSS with animations |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Security | bcryptjs |

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
│           ├── Signup.jsx
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
2. **Window 1:** Go to `/signup` → Create a user (e.g., "Alice", Female, key "alice123")
3. **Window 2:** Go to `/signup` → Create another user (e.g., "Bob", Male, key "bob456")
4. **Window 1:** Login with "alice123"
5. **Window 2:** Login with "bob456"
6. Both users will see each other in the Connect screen
7. Click **Chat** → Accept the request → Start chatting!

### User Flow

1. **Home Page** → Click "Chat" or "Start Chatting"
2. **Sign Up** (first time) → Username, Gender, Access Key
3. **Login** → Enter your access key
4. **"Privacy is Power" splash** appears for 5 seconds
5. **Dashboard** → Click "Connect" to see online users
6. **Send Chat Request** → Wait for acceptance
7. **Chat** → Message, use mic for voice, or Exit
8. **Exit** → All messages deleted for both users

---

## 🔐 Security Notes

- Access keys are **hashed with bcrypt** before storage
- Keys are **never logged or exposed**
- Duplicate keys are **rejected** at signup
- Chat data lives **only in memory** — nothing persists after logout/close
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

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Create new user |
| POST | `/api/login` | Login with access key |
| POST | `/api/change-key` | Change access key |
| POST | `/api/update-profile` | Update username/gender |
| GET | `/api/available-users/:keyHash` | Get online matching users |

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

## 📄 License

MIT — Made with 💕 for fun.

---

**© 2026 Timepass Pvt. Ltd. | From Random Hellos to Unexpected Hearts.**
