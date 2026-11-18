import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logo() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: '38px', height: '38px' }} aria-hidden="true">
      <path d="M24 43C8 31 4 22 4 15a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 7-4 16-20 28z" fill="#ff5c8a"/>
      <circle cx="24" cy="23" r="10" fill="#fff"/>
      <path d="M24 16v7l5 3" stroke="#c2185b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  );
}

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <Logo /> Timepass
      </div>
      <button className="btn" onClick={() => navigate('/login')}>
        💬 Chat
      </button>
    </nav>
  );
}

function Hero() {
  return (
    <div className="hero">
      <span className="fl" style={{ top: '12%', left: '8%' }}>Hi! 👋</span>
      <span className="fl" style={{ top: '22%', right: '10%', animationDelay: '1s' }}>Hey stranger</span>
      <span className="fl" style={{ bottom: '18%', left: '12%', animationDelay: '2s' }}>Crush alert 💘</span>
      <span className="fl" style={{ bottom: '12%', right: '8%', animationDelay: '0.5s' }}>Hello 😄</span>
      <span className="heart" style={{ top: '8%', left: '45%' }}>💗</span>
      <span className="heart" style={{ top: '60%', left: '4%', animationDelay: '1s' }}>💖</span>
      <span className="heart" style={{ top: '50%', right: '4%', animationDelay: '2s' }}>💕</span>
      <span className="heart" style={{ bottom: '6%', left: '48%', animationDelay: '3s' }}>💓</span>
      <div>
        <h1>From Random Hellos<br />to Unexpected Hearts.</h1>
        <p className="hand">Say hi to a stranger. Who knows what happens next?</p>
        <button className="btn glow" onClick={() => window.location.href = '/login'}>
          Start chatting 💌
        </button>
      </div>
    </div>
  );
}

function HowToUse() {
  const steps = [
    { icon: '📝', title: 'Sign up', desc: 'Pick a name and a secret access key.' },
    { icon: '🔑', title: 'Log in', desc: 'Use only your access key next time.' },
    { icon: '🔗', title: 'Connect', desc: 'Browse people online right now.' },
    { icon: '💬', title: 'Chat', desc: 'Type or talk with the mic.' },
    { icon: '👋', title: 'Exit', desc: 'Chat vanishes when you leave.' },
  ];
  return (
    <section className="section-wide">
      <h2 className="title">How to use Timepass</h2>
      <p className="sub hand">Five easy steps, zero awkward small talk</p>
      <div className="steps">
        {steps.map((s, i) => (
          <div key={i} className="step">
            <div className="e">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roadmap() {
  const milestones = [
    { icon: '🧍', title: 'Stranger', desc: 'You open the app, nobody knows you.' },
    { icon: '👋', title: 'Hello', desc: 'Tap Chat on someone interesting.' },
    { icon: '✅', title: 'Accept', desc: 'They say yes to your request.' },
    { icon: '💬', title: 'Chat', desc: 'Jokes, voice notes and silly stories.' },
    { icon: '✨', title: 'Spark', desc: "Suddenly you're smiling at your screen." },
    { icon: '💘', title: 'Unexpected heart', desc: "The best plot twist of your week." },
  ];
  return (
    <section className="section-wide" style={{ background: 'var(--p3)' }}>
      <h2 className="title">Strangers to unexpected hearts</h2>
      <p className="sub hand">Your journey, one checkpoint at a time</p>
      <div className="road">
        {milestones.map((m, i) => (
          <div key={i} className="ms">
            <div className="pin">{m.icon}</div>
            <div className="c">
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { stars: '⭐⭐⭐⭐⭐', text: '"Typed one hello and we talked till sunrise. Timepass is pure fun!"', avatar: '🧑', name: 'Aarav' },
    { stars: '⭐⭐⭐⭐⭐', text: '"No photos, no pressure. Just great conversation."', avatar: '👩', name: 'Meera' },
    { stars: '⭐⭐⭐⭐', text: '"The mic feature is so handy. I just talk and it types!"', avatar: '🧔', name: 'Kiran' },
  ];
  return (
    <section className="section-wide">
      <h2 className="title">Loved by our users</h2>
      <p className="sub hand">Real hellos, real smiles</p>
      <div className="fb">
        {items.map((t, i) => (
          <div key={i} className="q">
            <div className="stars">{t.stars}</div>
            <p>{t.text}</p>
            <div className="who">
              <span className="av">{t.avatar}</span>
              {t.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [sent, setSent] = React.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <section className="section-wide" style={{ background: 'var(--p3)' }}>
      <h2 className="title">Contact us</h2>
      <p className="sub hand">Questions? Compliments? Cat photos?</p>
      <form className="contact" onSubmit={handleSubmit}>
        <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <textarea rows="4" placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        <button className="btn" style={{ width: '100%', marginTop: '10px' }}>
          {sent ? 'Sent 💌' : 'Send message'}
        </button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <div className="company">
      <div className="logo" style={{ justifyContent: 'center', color: '#fff' }}>
        <Logo /> Timepass
      </div>
      <h3 style={{ marginTop: '14px' }}>Timepass Pvt. Ltd.</h3>
      <p>[Street address], [City], [State] – [PIN]<br />hello@timepass.app</p>
      <small>© 2026 Timepass. All rights reserved.</small>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <HowToUse />
      <Roadmap />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
