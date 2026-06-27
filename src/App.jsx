import { useState, useEffect, useRef } from "react";
import f1 from "./assets/f1.jpg";
import f2 from "./assets/f2.jpg";
import f3 from "./assets/f3.jpg";
import f4 from "./assets/f4.jpg";
import f5 from "./assets/f5.jpg";
import m1 from "./assets/m1.jpg";
import m2 from "./assets/m2.jpg";
import m3 from "./assets/m3.jpg";

// ── Avatars using DiceBear API (realistic illustrated avatars) ──────────────
const AVATARS = {
  f1,
  f2,
  f3,
  f4,
  f5,
  m1,
  m2,
  m3,
};

const GF = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&display=swap";

// ── Color Tokens ──────────────────────────────────────────────────────────────
const C = {
  brand: "#14532d",
  brandMid: "#166534",
  brandLight: "#dcfce7",
  brandText: "#15803d",
  brandMuted: "#bbf7d0",
  gold: "#b45309",
  goldLight: "#fef3c7",
  surface: "#ffffff",
  bg: "#f8f7f4",
  bgWarm: "#faf9f6",
  border: "#e5e3de",
  borderMid: "#d4d2cc",
  text: "#1c1917",
  textMid: "#57534e",
  textMute: "#a8a29e",
  red: "#dc2626",
  redLight: "#fee2e2",
};

// ── Global styles injected once ───────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('${GF}');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: ${C.bg}; color: ${C.text}; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${C.borderMid}; border-radius: 4px; }
input, select, textarea, button { font-family: 'Inter', sans-serif; }
input:focus, select:focus, textarea:focus { outline: 2px solid ${C.brandMid}; outline-offset: 1px; }
.serif { font-family: 'DM Serif Display', serif; }
.hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
.hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
.hover-row:hover { background: ${C.bgWarm}; }
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
.pill-hover:hover { background: ${C.brandLight} !important; color: ${C.brandMid} !important; }

/* ── Responsive ── */
.mobile-menu-btn { display: none; }
.desktop-nav-links { display: flex; gap: 2px; }
.desktop-nav-right { display: flex; align-items: center; gap: 10px; }
.mobile-menu { display: none; }
.dashboard-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.hero-section { padding: 64px 48px; }
.hero-h1 { font-size: 50px; }
.hero-stats { display: flex; gap: 40px; margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.12); flex-wrap: wrap; }
.register-container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
.mobile-filter-bar { display: none; }
.mobile-filter-panel { display: none; }
.desktop-filter-sidebar { display: block; }

@media (max-width: 768px) {
  .mobile-menu-btn { display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; padding: 6px; font-size: 22px; color: ${C.textMid}; }
  .desktop-nav-links { display: none; }
  .desktop-nav-right { display: none; }
  .mobile-menu { display: flex; flex-direction: column; position: fixed; top: 60px; left: 0; right: 0; background: #fff; border-bottom: 1px solid ${C.border}; z-index: 199; box-shadow: 0 8px 24px rgba(0,0,0,0.08); padding: 8px 0 12px; }
  .mobile-menu button { display: block; text-align: left; padding: 12px 24px; border: none; background: none; font-size: 14px; color: ${C.text}; cursor: pointer; font-family: 'Inter', sans-serif; }
  .mobile-menu-hidden { display: none !important; }
  .mobile-filter-bar { display: flex !important; }
  .mobile-filter-panel { display: block !important; }
  .desktop-filter-sidebar { display: none !important; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .form-grid-2 { grid-template-columns: 1fr; }
  .detail-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-section { padding: 36px 20px; }
  .hero-h1 { font-size: 32px; }
  .hero-stats { gap: 20px; margin-top: 28px; padding-top: 20px; }
  .register-container { padding: 24px 16px; }
  .profile-detail-container { padding: 16px 12px; }
  .detail-hero-inner { flex-direction: column; gap: 16px; padding: 20px 16px 14px !important; }
  .detail-hero-avatar { align-self: center; }
  .profile-completion-banner { flex-direction: column; align-items: flex-start !important; gap: 8px; }
  .toast-bottom { bottom: 80px !important; right: 12px !important; }
  .browse-header { display: none !important;}
}
`;

function StyleInject() {
  useEffect(() => {
    const id = "nc-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

// ── Primitive UI Components ───────────────────────────────────────────────────

function Btn({ children, variant = "primary", size = "md", onClick, disabled, full, style = {} }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 500, transition: "all 0.15s", opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : undefined,
    whiteSpace: "nowrap",
  };
  const sizes = {
    xs: { padding: "4px 10px", fontSize: 11 },
    sm: { padding: "6px 14px", fontSize: 12 },
    md: { padding: "9px 20px", fontSize: 13 },
    lg: { padding: "12px 28px", fontSize: 15 },
  };
  const variants = {
    primary:  { background: C.brand, color: "#fff" },
    secondary:{ background: C.brandLight, color: C.brandMid, border: `1px solid ${C.brandMuted}` },
    outline:  { background: "transparent", color: C.text, border: `1px solid ${C.border}` },
    ghost:    { background: "transparent", color: C.textMid, border: "none" },
    danger:   { background: C.redLight, color: C.red, border: `1px solid #fca5a5` },
    gold:     { background: C.goldLight, color: C.gold, border: `1px solid #fde68a` },
    white:    { background: "#fff", color: C.brand, border: "none" },
    ghostWhite:{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(0.93)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ""; }}
    >
      {children}
    </button>
  );
}

function Badge({ children, color = "green" }) {
  const map = {
    green: { bg: C.brandLight, text: C.brandMid },
    gold:  { bg: C.goldLight, text: C.gold },
    gray:  { bg: "#f5f5f4", text: C.textMid },
    blue:  { bg: "#dbeafe", text: "#1d4ed8" },
    red:   { bg: C.redLight, text: C.red },
    purple:{ bg: "#ede9fe", text: "#7c3aed" },
  };
  const s = map[color] || map.gray;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: s.bg, color: s.text,
    }}>
      {children}
    </span>
  );
}

function Avatar({ src, name = "", size = 40, online }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {src
        ? <img src={src} alt={name} width={size} height={size}
            style={{ borderRadius: "50%", objectFit: "cover", background: C.brandLight, display: "block" }} />
        : <div style={{
            width: size, height: size, borderRadius: "50%",
            background: C.brandLight, color: C.brandMid,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.35, fontWeight: 600,
          }}>{initials}</div>
      }
      {online && (
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: size * 0.24, height: size * 0.24,
          borderRadius: "50%", background: "#22c55e",
          border: "2px solid #fff",
        }} />
      )}
    </div>
  );
}

function Card({ children, style = {}, onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={hover ? "hover-lift" : ""}
      style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 12, overflow: "hidden",
        cursor: onClick ? "pointer" : "default", ...style,
      }}
    >
      {children}
    </div>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, icon, hint, error }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMute, fontSize: 14 }}>{icon}</span>}
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{
            width: "100%", padding: icon ? "9px 12px 9px 32px" : "9px 12px",
            border: `1px solid ${error ? C.red : C.border}`, borderRadius: 8,
            fontSize: 13, background: "#fff", color: C.text,
            transition: "border-color 0.15s",
          }}
        />
      </div>
      {hint && !error && <span style={{ fontSize: 11, color: C.textMute }}>{hint}</span>}
      {error && <span style={{ fontSize: 11, color: C.red }}>{error}</span>}
    </div>
  );
}

function Select({ label, options, value, onChange, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{
          padding: "9px 12px", border: `1px solid ${C.border}`,
          borderRadius: 8, fontSize: 13, background: "#fff", color: C.text, ...style,
        }}>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      {label && <span style={{ fontSize: 11, color: C.textMute, whiteSpace: "nowrap" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function ProgressRing({ pct = 70, size = 44, stroke = 4 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.brandMid} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill={C.brandMid} fontSize={10} fontWeight={600} style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}>
        {pct}%
      </text>
    </svg>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="toast-bottom" style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: C.text, color: "#fff", padding: "12px 18px",
      borderRadius: 10, fontSize: 13, display: "flex", alignItems: "center",
      gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "fadeIn 0.3s ease",
    }}>
      <span style={{ color: "#86efac" }}>✓</span> {message}
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 14, width: "100%", maxWidth: 440,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "fadeIn 0.2s ease",
          maxHeight: "90vh", overflow: "auto",
        }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textMute, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PROFILES = [
  {
    id: 1, name: "Aisha Rahman", age: 26, city: "Hyderabad", country: "India",
    occupation: "Medical Doctor", employer: "Apollo Hospitals",
    education: "MBBS – Osmania University", sect: "Sunni", madhab: "Hanafi",
    height: "5'3\"", weight: "54 kg", marital: "Never married", children: "None",
    salah: "5× daily", quran: "Recites with tajweed", hijab: "Full hijab",
    wali: "Father (Dr. Khalid Rahman)", languages: ["Urdu", "English", "Arabic"],
    about: "Assalamu alaikum. I am a practising Muslimah from Hyderabad with a deep love for my deen. I work as a doctor at Apollo and volunteer at the local masjid on weekends. I come from a conservative family and my father is involved in this process. I value taqwa, kindness, and sincerity above all else. Looking for someone who is grounded in his faith and ready for a serious commitment. JazakAllah Khair.",
    partner: "Practising Muslim, 27–35, educated, family-oriented, preferably from South Asia or willing to settle in India.",
    tags: ["Verified", "Hijabi", "Doctor", "Hafiza"],
    avatar: AVATARS.f1, verified: true, online: true, premium: true,
    bgColor: "#f0fdf4", matchPct: 94, profileComplete: 96,
    interests: ["Quran recitation", "Volunteer work", "Medical research", "Cooking"],
    family: "Father is a doctor, mother is a homemaker. 2 younger siblings.",
    income: "₹18–22 LPA", lastActive: "Active now", views: 284, shortlists: 47,
  },
  {
    id: 2, name: "Fatima Al-Hassan", age: 23, city: "Riyadh", country: "Saudi Arabia",
    occupation: "Software Engineer", employer: "Aramco Digital",
    education: "B.Tech CS – KFUPM", sect: "Sunni", madhab: "Hanbali",
    height: "5'4\"", weight: "52 kg", marital: "Never married", children: "None",
    salah: "5× daily", quran: "Hafiza (completed at 17)", hijab: "Niqab",
    wali: "Brother (Eng. Hassan Al-Hassan)", languages: ["Arabic", "English"],
    about: "Alhamdulillah, I am a hafiza who loves technology and innovation. I balance my career with strong Islamic values. I'm looking for a God-fearing man who values education and will support my professional goals while building a strong Islamic household.",
    partner: "Engineer or professional, 25–32, Sunni, educated, willing to settle in Saudi Arabia or abroad.",
    tags: ["Hafiza", "Engineer", "Niqabi", "Premium"],
    avatar: AVATARS.f2, verified: true, online: false, premium: true,
    bgColor: "#eff6ff", matchPct: 87, profileComplete: 91,
    interests: ["Quran memorisation", "Coding", "Islamic lectures", "Reading"],
    family: "Father is a businessman, mother is a teacher. Only daughter, 3 brothers.",
    income: "SAR 180k/year", lastActive: "3 hours ago", views: 412, shortlists: 88,
  },
  {
    id: 3, name: "Mariam Siddiqui", age: 27, city: "London", country: "UK",
    occupation: "Barrister", employer: "Gray's Inn Chambers",
    education: "LLB – UCL, Bar Vocational Course", sect: "Sunni", madhab: "Hanafi",
    height: "5'5\"", weight: "58 kg", marital: "Never married", children: "None",
    salah: "5× daily", quran: "Reads regularly", hijab: "Hijab",
    wali: "Uncle (Prof. Tariq Siddiqui)", languages: ["English", "Urdu", "French"],
    about: "Born and raised in London in a Pakistani family. I have a demanding career but Islam comes first — I pray all five prayers and observe hijab. I'm looking for a practising Muslim man who is established in his career and ready to start a family. Family gatherings, travel, and Friday night biryani are non-negotiables.",
    partner: "Professional, 28–36, practising Muslim, based in UK or willing to relocate. Family-first mindset.",
    tags: ["Barrister", "Hijabi", "UK-based", "Verified"],
    avatar: AVATARS.f3, verified: true, online: true, premium: false,
    bgColor: "#faf5ff", matchPct: 82, profileComplete: 88,
    interests: ["Law & justice", "Travel", "Cooking Pakistani cuisine", "Book clubs"],
    family: "Father is a GP, mother is a primary school teacher. 1 older brother (married).",
    income: "£85k–100k/year", lastActive: "Active now", views: 193, shortlists: 31,
  },
  {
    id: 4, name: "Zainab Malik", age: 24, city: "Toronto", country: "Canada",
    occupation: "Nurse Practitioner", employer: "Sunnybrook Hospital",
    education: "BScN – University of Toronto", sect: "Shia", madhab: "Jafari",
    height: "5'2\"", weight: "50 kg", marital: "Never married", children: "None",
    salah: "5× daily", quran: "Reads with translation", hijab: "Hijab",
    wali: "Father (Mr. Imran Malik)", languages: ["English", "Urdu", "Farsi"],
    about: "Pakistani-Canadian, born in Toronto. I work as a nurse and care deeply about community service. My faith defines me — I am Shia but open to Sunni matches with mutual respect. I'm looking for a kind-hearted, hard-working man who wants to build something meaningful together in Canada.",
    partner: "Muslim, 26–33, based in Canada or US, open-minded, career-oriented, family values.",
    tags: ["Nurse", "Hijabi", "Shia", "Canada"],
    avatar: AVATARS.f4, verified: true, online: false, premium: false,
    bgColor: "#fff7ed", matchPct: 76, profileComplete: 82,
    interests: ["Healthcare volunteering", "Hiking", "Baking", "Islamic history"],
    family: "Father is an accountant, mother is a teacher. 2 sisters (one married).",
    income: "CAD 95k/year", lastActive: "Yesterday", views: 147, shortlists: 22,
  },
  {
    id: 5, name: "Sara Hussain", age: 28, city: "Lahore", country: "Pakistan",
    occupation: "Architect", employer: "Aga Khan Trust for Culture",
    education: "B.Arch – NCA Lahore", sect: "Sunni", madhab: "Hanafi",
    height: "5'6\"", weight: "60 kg", marital: "Never married", children: "None",
    salah: "5× daily", quran: "Tajweed certified", hijab: "Hijab",
    wali: "Father (Arch. Tariq Hussain)", languages: ["Urdu", "English", "Punjabi"],
    about: "I design spaces that uplift communities — from mosques to schools. My work and faith are intertwined. I'm looking for someone who appreciates culture, creativity, and has a strong spiritual foundation. Based in Lahore but open to relocation for the right match.",
    partner: "Educated professional, 28–36, practising Muslim, values creativity and family life.",
    tags: ["Architect", "Hijabi", "Creative", "Verified"],
    avatar: AVATARS.f5, verified: true, online: false, premium: true,
    bgColor: "#f0fdf4", matchPct: 79, profileComplete: 90,
    interests: ["Architecture", "Islamic art", "Hiking", "Photography"],
    family: "Father is an architect, mother is a professor. 1 older brother (married).",
    income: "PKR 350k/month", lastActive: "2 hours ago", views: 201, shortlists: 38,
  },
];

const MY_PROFILE = {
  name: "Ahmed Khan", age: 29, city: "Mumbai", country: "India",
  avatar: AVATARS.m1, occupation: "Software Engineer", company: "Infosys",
  sect: "Sunni", verified: true, premium: false,
  stats: { interests: 12, received: 8, shortlisted: 5, profileViews: 147 },
};

const MESSAGES_DATA = [
  {
    id: 1, contact: PROFILES[0],
    msgs: [
      { id: 1, from: "them", text: "Assalamu alaikum. My father has reviewed your profile and we would like to know more about your family background, inshAllah.", time: "10:14 AM", date: "Today" },
      { id: 2, from: "me", text: "Wa alaikum assalam. JazakAllah Khair for reaching out. I am happy to share. My father is a retired bank manager from Pune and my mother is a school teacher. I have one younger sister who is completing her studies.", time: "10:22 AM", date: "Today" },
      { id: 3, from: "them", text: "MashaAllah, that is wonderful. My father would like to speak with your wali directly. Is your father available for a call?", time: "10:35 AM", date: "Today" },
      { id: 4, from: "me", text: "Yes, absolutely. He is available on weekends after Asr prayer, typically between 4–6 PM IST. Please let me know a suitable time and I will arrange it inshAllah.", time: "10:41 AM", date: "Today" },
      { id: 5, from: "them", text: "JazakAllah Khair. This Sunday at 5 PM IST works well. We will send the contact details shortly. Please make dua that Allah blesses this process for both families. 🤲", time: "10:44 AM", date: "Today" },
    ],
    unread: 1,
  },
  {
    id: 2, contact: PROFILES[1],
    msgs: [
      { id: 1, from: "them", text: "Assalamu alaikum. My brother has reviewed your profile. We appreciate your educational background. Could you share more about your religious practice and daily routine?", time: "Yesterday 3:12 PM", date: "Yesterday" },
      { id: 2, from: "me", text: "Wa alaikum assalam. JazakAllah. I pray all 5 salah, attend Friday prayers at the local masjid and try to recite Quran daily after Fajr. I observe halal diet and avoid mixed social settings.", time: "Yesterday 4:05 PM", date: "Yesterday" },
    ],
    unread: 0,
  },
  {
    id: 3, contact: PROFILES[2],
    msgs: [
      { id: 1, from: "me", text: "Assalamu alaikum. I came across your profile and was very impressed. I would be honoured if your wali would consider my profile.", time: "Mon 9:30 AM", date: "Monday" },
      { id: 2, from: "them", text: "Wa alaikum assalam. Thank you for reaching out. I have shared your profile with my uncle. He will review and get back to you inshAllah. Please be patient.", time: "Mon 2:15 PM", date: "Monday" },
    ],
    unread: 0,
  },
];

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ page, onNav, notifCount = 3 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "browse", label: "Browse profiles" },
    { id: "messages", label: "Messages" },
    { id: "dashboard", label: "Dashboard" },
  ];
  const handleNav = (id) => { onNav(id); setMenuOpen(false); };
  return (
    <>
    <nav style={{
      background: "#fff", borderBottom: `1px solid ${C.border}`,
      padding: "0 16px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 60,
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          onClick={() => handleNav("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{
            width: 34, height: 34, background: `linear-gradient(135deg, ${C.brand}, #166534)`,
            borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 17, fontWeight: 700, flexShrink: 0,
          }}>N</div>
          <div>
            <div className="serif" style={{ fontSize: 16, color: C.text, lineHeight: 1 }}>NikahConnect</div>
            <div style={{ fontSize: 9, color: C.textMute, letterSpacing: "0.06em", textTransform: "uppercase" }}>Halal matrimonial</div>
          </div>
        </div>
        <div className="desktop-nav-links">
          {links.map(l => (
            <button key={l.id} onClick={() => handleNav(l.id)} style={{
              padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: page === l.id ? 600 : 400,
              color: page === l.id ? C.brand : C.textMid,
              background: page === l.id ? C.brandLight : "transparent",
              border: "none", cursor: "pointer",
            }}>
              {l.label}
              {l.id === "messages" && notifCount > 0 && (
                <span style={{ marginLeft: 5, background: C.red, color: "#fff", borderRadius: 20, padding: "1px 6px", fontSize: 10 }}>
                  {notifCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="desktop-nav-right">
        <button onClick={() => onNav("register")} style={{
          padding: "7px 16px", borderRadius: 8, background: C.brand, color: "#fff",
          border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
        }}>Create profile</button>
        <button onClick={() => onNav("dashboard")} style={{
          background: "none", border: "none", cursor: "pointer",
          position: "relative", padding: 6,
        }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <span style={{
            position: "absolute", top: 2, right: 2, width: 8, height: 8,
            background: C.red, borderRadius: "50%", border: "2px solid #fff",
          }} />
        </button>
        <div
          onClick={() => onNav("dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}
          onMouseEnter={e => e.currentTarget.style.background = C.bg}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Avatar src={MY_PROFILE.avatar} name={MY_PROFILE.name} size={32} online />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{MY_PROFILE.name}</div>
            <div style={{ fontSize: 10, color: C.textMute }}>View profile</div>
          </div>
        </div>
      </div>
      {/* Mobile right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => onNav("dashboard")} className="mobile-menu-btn" style={{ position: "relative" }}>
          🔔
          <span style={{ position: "absolute", top: 2, right: 2, width: 7, height: 7, background: C.red, borderRadius: "50%", border: "2px solid #fff" }} />
        </button>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
    {/* Mobile dropdown menu */}
    <div className={`mobile-menu${menuOpen ? "" : " mobile-menu-hidden"}`}>
      {links.map(l => (
        <button key={l.id} onClick={() => handleNav(l.id)} style={{
          fontWeight: page === l.id ? 600 : 400,
          color: page === l.id ? C.brand : C.text,
          background: page === l.id ? C.brandLight : "transparent",
        }}>
          {l.label}
          {l.id === "messages" && notifCount > 0 && (
            <span style={{ marginLeft: 6, background: C.red, color: "#fff", borderRadius: 20, padding: "1px 6px", fontSize: 10 }}>{notifCount}</span>
          )}
        </button>
      ))}
      <button onClick={() => handleNav("register")} style={{ color: C.brand, fontWeight: 600 }}>Create profile</button>
      <button onClick={() => { handleNav("dashboard"); }} style={{ color: C.textMid }}>
        <Avatar src={MY_PROFILE.avatar} name={MY_PROFILE.name} size={24} /> {MY_PROFILE.name} — Dashboard
      </button>
    </div>
    </>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────

function HomePage({ onNav, onViewProfile }) {
  const [toast, setToast] = useState(null);
  const recommended = PROFILES.slice(0, 4);

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="hero-section" style={{
        background: `linear-gradient(140deg, #052e16 0%, ${C.brand} 50%, #15803d 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 2l4.5 13.8H38l-11.5 8.4 4.4 13.8L20 29.6l-10.9 8.4 4.4-13.8L2 15.8h13.5z' fill='%23fff'/%3E%3C/svg%3E\")",
          backgroundSize: 40,
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
          <Badge color="gold">🕌 Trusted by 48,000+ Muslim families worldwide</Badge>
          <h1 className="serif hero-h1" style={{ color: "#fff", lineHeight: 1.15, margin: "20px 0 16px", fontWeight: 400 }}>
            Your halal path to<br /><em style={{ color: "#86efac" }}>a blessed nikah</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, maxWidth: 520, marginBottom: 32 }}>
            A private, verified space for practising Muslims to find a life partner — with family involvement, wali support, and complete halal compliance built in.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn variant="white" size="lg" onClick={() => onNav("browse")}>Browse profiles →</Btn>
            <Btn variant="ghostWhite" size="lg" onClick={() => onNav("register")}>Create your profile</Btn>
          </div>
          <div className="hero-stats">
            {[["48,200+", "Verified profiles"], ["12,400+", "Successful nikah"], ["60+", "Countries"], ["4.9★", "App rating"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile completion prompt */}
      <div className="profile-completion-banner" style={{ background: C.goldLight, borderBottom: `1px solid #fde68a`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontSize: 13, color: C.gold, fontWeight: 500 }}>Your profile is 65% complete — complete it to get 3× more matches</span>
        </div>
        <Btn variant="gold" size="sm" onClick={() => onNav("dashboard")}>Complete profile</Btn>
      </div>

      <div style={{ padding: "32px 16px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Today's matches */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Today's recommended matches</h2>
              <p style={{ fontSize: 13, color: C.textMute, marginTop: 3 }}>Based on your preferences and location</p>
            </div>
            <Btn variant="ghost" size="sm" onClick={() => onNav("browse")} style={{ color: C.brandText }}>See all profiles →</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {recommended.map(p => (
              <ProfileCardFull key={p.id} profile={p} onView={() => onViewProfile(p)} onToast={msg => setToast(msg)} />
            ))}
          </div>
        </div>

        {/* Trust features */}
        <div style={{ background: C.bg, borderRadius: 14, padding: "32px 28px", marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>Why families trust NikahConnect</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { icon: "🛡️", title: "100% manual verification", desc: "Every profile verified with government-issued ID before activation" },
              { icon: "🕌", title: "Wali portal", desc: "Dedicated section for family guardians to manage communications" },
              { icon: "👁️", title: "Photo privacy", desc: "Control who sees your photos — visible only after mutual interest" },
              { icon: "📿", title: "Scholar-reviewed", desc: "Platform guidelines reviewed by a panel of qualified Islamic scholars" },
              { icon: "🚫", title: "No mixed chat", desc: "Wali CC'd on all conversations — halal by design, not by request" },
              { icon: "🔐", title: "Data protection", desc: "End-to-end encryption on all messages, GDPR compliant" },
            ].map(f => (
              <div key={f.title} style={{ padding: "16px", background: "#fff", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: C.textMute, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success story */}
        <div style={{
          background: `linear-gradient(135deg, ${C.brand} 0%, #166534 100%)`,
          borderRadius: 14, padding: "32px 36px", display: "flex", gap: 32, alignItems: "center",
          flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <Badge color="green" style={{ marginBottom: 12 }}>✨ Success story of the month</Badge>
            <h3 className="serif" style={{ fontSize: 22, color: "#fff", lineHeight: 1.4, marginTop: 10, marginBottom: 12, fontWeight: 400 }}>
              "We found each other in 3 weeks.<br />Our nikah was 6 months later."
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              — Khadija & Omer, married February 2025. Both from Manchester, UK.
            </p>
          </div>
          <Btn variant="ghostWhite" size="md" onClick={() => onNav("register")}>Read their story →</Btn>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Profile Card (full) ───────────────────────────────────────────────────────

function ProfileCardFull({ profile: p, onView, onToast, compact = false }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Card hover style={{ display: "flex", flexDirection: "column" }}>
      {/* Photo area */}
      <div
        onClick={onView}
        style={{
          height: compact ? 140 : 180, background: p.bgColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", cursor: "pointer", flexShrink: 0,
        }}>
        <Avatar src={p.avatar} name={p.name} size={compact ? 80 : 100} />
        {/* Overlays */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {p.verified && <Badge color="green">✓ Verified</Badge>}
          {p.premium && <Badge color="gold">⭐ Premium</Badge>}
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <div style={{
            background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "3px 9px",
            fontSize: 12, fontWeight: 700, color: C.brandMid,
          }}>
            {p.matchPct}% match
          </div>
        </div>
        {p.online && (
          <div style={{ position: "absolute", bottom: 10, left: 10 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 10, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> Active now
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 10px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, cursor: "pointer" }} onClick={onView}>{p.name}</div>
            <div style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{p.age} yrs • {p.occupation}</div>
            <div style={{ fontSize: 12, color: C.textMute }}>📍 {p.city}, {p.country}</div>
          </div>
          <ProgressRing pct={p.matchPct} size={36} stroke={3} />
        </div>

        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
          <Badge color="gray">🕌 {p.sect}</Badge>
          <Badge color="gray">📚 {p.education.split("–")[0].trim()}</Badge>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, color: C.textMid, lineHeight: 1.6, flex: 1 }}>
          {p.about.slice(0, 100)}…
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <Btn variant="primary" size="sm" style={{ flex: 1 }} onClick={() => { setLiked(true); onToast && onToast(`Interest sent to ${p.name}`); }}>
            {liked ? "✓ Interest sent" : "Send interest"}
          </Btn>
          <button
            onClick={() => { setSaved(s => !s); onToast && onToast(saved ? "Removed from shortlist" : `${p.name} saved`); }}
            style={{
              padding: "6px 10px", borderRadius: 8, border: `1px solid ${saved ? C.brandMid : C.border}`,
              background: saved ? C.brandLight : "#fff", cursor: "pointer", fontSize: 14,
              color: saved ? C.brandMid : C.textMute,
            }}>
            {saved ? "🔖" : "🔖"}
          </button>
        </div>
      </div>
    </Card>
  );
}

// ── Browse Page ───────────────────────────────────────────────────────────────

function BrowsePage({ onViewProfile }) {
  const [filters, setFilters] = useState({ sect: "Any", country: "Any", ageMin: "18", ageMax: "40", education: "Any", marital: "Any" });
  const [sort, setSort] = useState("match");
  const [toast, setToast] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const f = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const activeFilterCount = [
    filters.sect !== "Any", filters.country !== "Any",
    filters.education !== "Any", filters.marital !== "Any",
    filters.ageMin !== "18" || filters.ageMax !== "40",
  ].filter(Boolean).length;

  const sorted = [...PROFILES].sort((a, b) =>
    sort === "match" ? b.matchPct - a.matchPct :
    sort === "age" ? a.age - b.age :
    sort === "active" ? (a.online ? -1 : 1) : 0
  );

  const FilterContent = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Filters</span>
        <button onClick={() => { setFilters({ sect: "Any", country: "Any", ageMin: "18", ageMax: "40", education: "Any", marital: "Any" }); }}
          style={{ fontSize: 12, color: C.brandText, background: "none", border: "none", cursor: "pointer" }}>
          Reset all
        </button>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.textMute, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Age range</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="number" value={filters.ageMin} onChange={e => f("ageMin", e.target.value)}
            style={{ width: "100%", padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13, background: "#fff", color: C.text }} />
          <span style={{ color: C.textMute, fontSize: 12 }}>to</span>
          <input type="number" value={filters.ageMax} onChange={e => f("ageMax", e.target.value)}
            style={{ width: "100%", padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13, background: "#fff", color: C.text }} />
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.textMute, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Sect</div>
        {["Any", "Sunni", "Shia"].map(s => (
          <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer" }}>
            <input type="radio" name="sect" value={s} checked={filters.sect === s} onChange={() => f("sect", s)} style={{ accentColor: C.brand }} />
            <span style={{ fontSize: 13, color: C.textMid }}>{s}</span>
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        <Select label="Country" options={["Any", "India", "Pakistan", "Saudi Arabia", "UK", "Canada", "UAE"]}
          value={filters.country} onChange={e => f("country", e.target.value)} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <Select label="Education" options={["Any", "Bachelor's", "Master's", "PhD", "Professional (MBBS/LLB/etc)"]}
          value={filters.education} onChange={e => f("education", e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <Select label="Marital status" options={["Any", "Never married", "Divorced", "Widowed"]}
          value={filters.marital} onChange={e => f("marital", e.target.value)} />
      </div>
      <Btn variant="primary" full onClick={() => setFiltersOpen(false)}>Apply filters</Btn>
      <div style={{ marginTop: 16, padding: "14px", background: C.brandLight, borderRadius: 10, border: `1px solid ${C.brandMuted}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.brandMid, marginBottom: 4 }}>🔔 Saved search</div>
        <div style={{ fontSize: 11, color: C.brandText }}>Get notified when new profiles matching your filters join</div>
        <Btn variant="secondary" size="xs" style={{ marginTop: 8 }}>Save this search</Btn>
      </div>
    </>
  );

  return (
    <div className="fade-in" style={{ minHeight: "calc(100vh - 60px)" }}>

      {/* ── Mobile filter bar ── */}
      <div style={{
        display: "none", padding: "10px 16px", background: "#fff",
        borderBottom: `1px solid ${C.border}`, alignItems: "center", gap: 8,
      }} className="mobile-filter-bar">
        <button onClick={() => setFiltersOpen(o => !o)} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 8, cursor: "pointer",
          border: `1.5px solid ${filtersOpen || activeFilterCount > 0 ? C.brand : C.border}`,
          background: filtersOpen ? C.brandLight : "#fff",
          color: filtersOpen || activeFilterCount > 0 ? C.brandMid : C.textMid,
          fontSize: 13, fontWeight: 500, fontFamily: "inherit",
        }}>
          ⚙️ Filters
          {activeFilterCount > 0 && (
            <span style={{ background: C.brand, color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
              {activeFilterCount}
            </span>
          )}
          <span style={{ fontSize: 10, marginLeft: 2 }}>{filtersOpen ? "▲" : "▼"}</span>
        </button>
        <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
          {[["match", "Best match"], ["age", "Age"], ["active", "Active"]].map(([v, l]) => (
            <button key={v} onClick={() => setSort(v)} style={{
              padding: "6px 12px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap",
              background: sort === v ? C.brand : "#fff",
              color: sort === v ? "#fff" : C.textMid,
              border: `1px solid ${sort === v ? C.brand : C.border}`,
              cursor: "pointer", fontFamily: "inherit",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ── Mobile collapsible filter panel ── */}
      {filtersOpen && (
        <div style={{
          background: "#fff", borderBottom: `1px solid ${C.border}`,
          padding: "16px", display: "none",
        }} className="mobile-filter-panel">
          <FilterContent />
        </div>
      )}

      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        {/* Desktop Sidebar */}
        <aside style={{
          width: 260, flexShrink: 0, background: "#fff",
          borderRight: `1px solid ${C.border}`, padding: "20px 16px",
          overflowY: "auto", position: "sticky", top: 60, height: "calc(100vh - 60px)",
        }} className="desktop-filter-sidebar">
          <FilterContent />
        </aside>

        {/* Results */}
        <main style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
        {/* Toolbar */}
        <div className="browse-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Browse profiles</span>
            <span style={{ marginLeft: 8, fontSize: 13, color: C.textMute }}>Showing {PROFILES.length} profiles</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: C.textMute }}>Sort by:</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[["match", "Best match"], ["age", "Age"], ["active", "Active"]].map(([v, l]) => (
                <button key={v} onClick={() => setSort(v)} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 12,
                  background: sort === v ? C.brand : "#fff",
                  color: sort === v ? "#fff" : C.textMid,
                  border: `1px solid ${sort === v ? C.brand : C.border}`,
                  cursor: "pointer",
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {sorted.map(p => (
            <ProfileCardFull key={p.id} profile={p} compact onView={() => onViewProfile(p)} onToast={msg => setToast(msg)} />
          ))}
        </div>
      </main>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Profile Detail ────────────────────────────────────────────────────────────

function ProfileDetailPage({ profile: p, onBack, onMessage }) {
  const [tab, setTab] = useState("about");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);

  const tabs = ["about", "religious", "career", "family", "partner seeks"];

  return (
    <div className="fade-in profile-detail-container" style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 13, color: C.textMid, background: "none", border: "none",
        cursor: "pointer", marginBottom: 20,
      }}>← Back to browse</button>

      {/* Hero card */}
      <Card style={{ marginBottom: 20 }}>
        <div className="detail-hero-inner" style={{ padding: "28px 28px 20px", display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div className="detail-hero-avatar" style={{ position: "relative" }}>
            <div style={{
              width: 120, height: 120, borderRadius: 16, background: p.bgColor,
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              <Avatar src={p.avatar} name={p.name} size={110} online={p.online} />
            </div>
            {p.premium && (
              <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)" }}>
                <Badge color="gold">⭐ Premium</Badge>
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text }}>{p.name}</h1>
                <p style={{ fontSize: 14, color: C.textMid, marginTop: 2 }}>
                  {p.age} years • {p.occupation} • 📍 {p.city}, {p.country}
                </p>
                <p style={{ fontSize: 12, color: p.online ? "#16a34a" : C.textMute, marginTop: 3 }}>
                  {p.online ? "🟢 Active now" : `⏰ Last active: ${p.lastActive}`}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.verified && <Badge color="green">✓ Identity verified</Badge>}
                <div style={{ background: C.brandLight, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: C.brandMid }}>
                  {p.matchPct}% match
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {p.tags.map(t => <Badge key={t} color="gray">{t}</Badge>)}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={() => { setLiked(true); setToast(`Interest sent to ${p.name}`); }}>
                {liked ? "✓ Interest sent" : "💚 Send interest"}
              </Btn>
              <Btn variant="secondary" onClick={onMessage}>✉ Message</Btn>
              <Btn variant="outline" onClick={() => { setSaved(s => !s); setToast(saved ? "Removed from shortlist" : "Saved to shortlist"); }}>
                {saved ? "🔖 Saved" : "🔖 Save profile"}
              </Btn>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="detail-stats-grid" style={{ borderTop: `1px solid ${C.border}` }}>
          {[["👁️", p.views, "Profile views"], ["💚", p.shortlists, "Shortlists"], ["🎓", p.education.split("–")[0].trim(), "Education"], ["🗣️", p.languages.join(", "), "Languages"]].map(([ic, v, l]) => (
            <div key={l} style={{ padding: "14px 16px", borderRight: `1px solid ${C.border}`, lastChild: "none" }}>
              <div style={{ fontSize: 11, color: C.textMute, marginBottom: 2 }}>{ic} {l}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 16, background: "#fff", borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "8px 4px", borderRadius: 8, border: "none",
            fontSize: 12, fontWeight: tab === t ? 600 : 400,
            background: tab === t ? C.brand : "transparent",
            color: tab === t ? "#fff" : C.textMid,
            cursor: "pointer", textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <Card style={{ padding: 24 }}>
        {tab === "about" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.text }}>About {p.name.split(" ")[0]}</h3>
            <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.85 }}>{p.about}</p>
            <Divider label="Interests & hobbies" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              {p.interests.map(i => (
                <span key={i} style={{ padding: "6px 14px", background: C.bg, borderRadius: 20, fontSize: 12, color: C.textMid, border: `1px solid ${C.border}` }}>
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}
        {tab === "religious" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Religious background</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px 24px" }}>
              {[
                ["Sect", p.sect], ["Madhab", p.madhab],
                ["Daily salah", p.salah], ["Quran", p.quran],
                ["Hijab / dress", p.hijab], ["Wali", p.wali],
              ].map(([l, v]) => (
                <div key={l} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: C.textMute, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "career" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Education & career</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px 24px" }}>
              {[
                ["Education", p.education], ["Occupation", p.occupation],
                ["Employer", p.employer], ["Annual income", p.income],
                ["Languages", p.languages.join(", ")], ["After marriage", "Open to discuss"],
              ].map(([l, v]) => (
                <div key={l} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: C.textMute, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "family" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Family background</h3>
            <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.8, marginBottom: 16 }}>{p.family}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px 24px" }}>
              {[
                ["Height", p.height], ["Weight", p.weight],
                ["Marital status", p.marital], ["Children", p.children],
                ["Country", p.country], ["Willing to relocate", "Yes — open to discussion"],
              ].map(([l, v]) => (
                <div key={l} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: C.textMute, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "partner seeks" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>What {p.name.split(" ")[0]} is looking for</h3>
            <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.85 }}>{p.partner}</p>
            <Divider label="Compatibility with your profile" />
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", background: C.brandLight, borderRadius: 10 }}>
              <ProgressRing pct={p.matchPct} size={56} stroke={5} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.brandMid }}>{p.matchPct}% compatibility</div>
                <div style={{ fontSize: 13, color: C.brandText, marginTop: 3 }}>Based on sect, age, location, and education preferences</div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Messages Page ─────────────────────────────────────────────────────────────

function MessagesPage() {
  const [activeConv, setActiveConv] = useState(null); // null = show list on mobile
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState(MESSAGES_DATA);
  const chatRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // On desktop default to first conv; on mobile start with list
  const conv = conversations[activeConv ?? 0];

  const sendMsg = () => {
    if (!input.trim() || activeConv === null) return;
    const newMsg = { id: Date.now(), from: "me", text: input.trim(), time: "Just now", date: "Today" };
    setConversations(prev => prev.map((c, i) => i === activeConv
      ? { ...c, msgs: [...c.msgs, newMsg], unread: 0 }
      : c
    ));
    setInput("");
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
  };

  const showList = isMobile && activeConv === null;
  const showChat = !isMobile || activeConv !== null;

  const ConvList = () => (
    <aside style={{
      width: isMobile ? "100%" : 300,
      borderRight: isMobile ? "none" : `1px solid ${C.border}`,
      background: "#fff", display: "flex", flexDirection: "column", flexShrink: 0,
      height: isMobile ? "calc(100vh - 60px)" : "100%",
    }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Messages</h2>
        <input placeholder="🔍 Search conversations…" style={{
          width: "100%", marginTop: 10, padding: "8px 12px",
          border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13,
          background: C.bg, color: C.text,
        }} />
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {conversations.map((c, i) => (
          <div
            key={c.id}
            onClick={() => setActiveConv(i)}
            className="hover-row"
            style={{
              padding: "14px 16px", display: "flex", gap: 12, alignItems: "center",
              cursor: "pointer",
              background: !isMobile && i === activeConv ? C.brandLight : "transparent",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <Avatar src={c.contact.avatar} name={c.contact.name} size={46} online={c.contact.online} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: c.unread ? 700 : 500, color: C.text }}>{c.contact.name}</span>
                <span style={{ fontSize: 11, color: C.textMute, flexShrink: 0, marginLeft: 6 }}>{c.msgs[c.msgs.length - 1].time}</span>
              </div>
              <div style={{ fontSize: 12, color: C.textMute, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.msgs[c.msgs.length - 1].text}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              {c.unread > 0 && (
                <div style={{ width: 20, height: 20, background: C.brand, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>
                  {c.unread}
                </div>
              )}
              {isMobile && <span style={{ color: C.textMute, fontSize: 14 }}>›</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 14px", background: C.goldLight, borderTop: `1px solid #fde68a` }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.gold, marginBottom: 3 }}>🕌 Wali notification</div>
        <div style={{ fontSize: 11, color: "#92400e" }}>All conversations are automatically shared with your registered wali (guardian).</div>
      </div>
    </aside>
  );

  const ChatArea = () => (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, minHeight: 0, height: isMobile ? "calc(100vh - 60px)" : "100%" }}>
      {/* Chat header */}
      <div style={{
        background: "#fff", borderBottom: `1px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        {isMobile && (
          <button onClick={() => setActiveConv(null)} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 20,
            color: C.textMid, padding: "0 4px", lineHeight: 1, flexShrink: 0,
          }}>←</button>
        )}
        <Avatar src={conv.contact.avatar} name={conv.contact.name} size={40} online={conv.contact.online} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{conv.contact.name}</div>
          <div style={{ fontSize: 12, color: conv.contact.online ? "#16a34a" : C.textMute }}>
            {conv.contact.online ? "🟢 Online now" : `Last active: ${conv.contact.lastActive}`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {!isMobile && <Btn variant="outline" size="sm">📋 View profile</Btn>}
          <Btn variant="danger" size="sm">🚩</Btn>
        </div>
      </div>

      {/* Messages scroll area */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ textAlign: "center", margin: "4px 0" }}>
          <span style={{ fontSize: 11, color: C.textMute, background: C.border, padding: "4px 14px", borderRadius: 20 }}>
            🕌 Conversations are moderated for halal compliance
          </span>
        </div>
        {conv.msgs.map((m, i) => {
          const isMe = m.from === "me";
          const showDate = i === 0 || conv.msgs[i - 1].date !== m.date;
          return (
            <div key={m.id}>
              {showDate && (
                <div style={{ textAlign: "center", margin: "8px 0" }}>
                  <span style={{ fontSize: 11, color: C.textMute, background: C.border, padding: "3px 12px", borderRadius: 20 }}>{m.date}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                {!isMe && <Avatar src={conv.contact.avatar} name={conv.contact.name} size={28} />}
                <div style={{ maxWidth: isMobile ? "80%" : "65%" }}>
                  <div style={{
                    padding: "11px 15px", borderRadius: 14,
                    borderBottomRightRadius: isMe ? 3 : 14,
                    borderBottomLeftRadius: isMe ? 14 : 3,
                    background: isMe ? C.brand : "#fff",
                    color: isMe ? "#fff" : C.text,
                    fontSize: 13, lineHeight: 1.65,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    border: isMe ? "none" : `1px solid ${C.border}`,
                  }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize: 10, color: C.textMute, marginTop: 4, textAlign: isMe ? "right" : "left" }}>{m.time}</div>
                </div>
                {isMe && <Avatar src={MY_PROFILE.avatar} name={MY_PROFILE.name} size={28} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div style={{
        padding: "10px 14px", background: "#fff",
        borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center", flexShrink: 0,
      }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMsg()}
          placeholder="Type a message…"
          style={{
            flex: 1, padding: "10px 16px", border: `1px solid ${C.border}`,
            borderRadius: 24, fontSize: 13, background: C.bg, color: C.text,
          }}
        />
        <button onClick={sendMsg} style={{
          width: 42, height: 42, borderRadius: "50%", background: C.brand,
          color: "#fff", border: "none", cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>➤</button>
      </div>
    </main>
  );

  return (
    <div className="fade-in" style={{ display: "flex", height: "calc(100vh - 60px)", overflow: "hidden" }}>
      {(!isMobile || showList) && <ConvList />}
      {(!isMobile || showChat) && <ChatArea />}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function DashboardPage({ onNav }) {
  const [toast, setToast] = useState(null);
  const notifications = [
    { id: 1, icon: "💚", text: "Aisha Rahman sent you an interest request", time: "2 min ago", read: false },
    { id: 2, icon: "👁️", text: "Fatima Al-Hassan viewed your profile", time: "1 hour ago", read: false },
    { id: 3, icon: "💬", text: "New message from Mariam Siddiqui", time: "3 hours ago", read: true },
    { id: 4, icon: "⭐", text: "Your profile was shortlisted by 3 new members", time: "Yesterday", read: true },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>My dashboard</h1>
          <p style={{ fontSize: 13, color: C.textMute, marginTop: 3 }}>Friday, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        <Btn variant="primary" onClick={() => onNav("browse")}>Browse new profiles →</Btn>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Profile views", value: MY_PROFILE.stats.profileViews, icon: "👁️", color: C.brandLight, textColor: C.brandMid },
          { label: "Interests sent", value: MY_PROFILE.stats.interests, icon: "💚", color: "#fee2e2", textColor: C.red },
          { label: "Interests received", value: MY_PROFILE.stats.received, icon: "🌟", color: C.goldLight, textColor: C.gold },
          { label: "Shortlisted", value: MY_PROFILE.stats.shortlisted, icon: "🔖", color: "#ede9fe", textColor: "#7c3aed" },
        ].map(s => (
          <div key={s.label} style={{ background: s.color, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.textColor }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.textMid, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div>
          {/* Profile completeness */}
          <Card style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Profile completeness</h3>
              <Badge color="gold">65% complete</Badge>
            </div>
            {[
              { label: "Basic info", done: true },
              { label: "Religious background", done: true },
              { label: "Education & career", done: true },
              { label: "Photos uploaded", done: false },
              { label: "Partner preferences", done: false },
              { label: "Wali details added", done: false },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: item.done ? C.brand : C.border,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: item.done ? "#fff" : C.textMute, flexShrink: 0,
                }}>{item.done ? "✓" : "○"}</div>
                <span style={{ fontSize: 13, color: item.done ? C.text : C.textMid }}>{item.label}</span>
                {!item.done && <Btn variant="ghost" size="xs" style={{ marginLeft: "auto", color: C.brandText }}>Add →</Btn>}
              </div>
            ))}
            <Btn variant="primary" full style={{ marginTop: 16 }}>Complete my profile</Btn>
          </Card>

          {/* Recent interests received */}
          <Card style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Interests received</h3>
            {PROFILES.slice(0, 3).map(p => (
              <div key={p.id} className="hover-row" style={{
                display: "flex", gap: 12, alignItems: "center",
                padding: "10px 8px", borderRadius: 8, cursor: "pointer",
              }}>
                <Avatar src={p.avatar} name={p.name} size={40} online={p.online} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: C.textMute }}>{p.age} • {p.occupation} • {p.city}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="primary" size="xs" onClick={() => setToast(`Interest accepted from ${p.name}`)}>Accept</Btn>
                  <Btn variant="outline" size="xs">Decline</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right: Notifications + Quick profile */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>My profile</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <Avatar src={MY_PROFILE.avatar} name={MY_PROFILE.name} size={52} online />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{MY_PROFILE.name}</div>
                <div style={{ fontSize: 12, color: C.textMute }}>{MY_PROFILE.age} yrs • {MY_PROFILE.occupation}</div>
                <div style={{ fontSize: 12, color: C.textMute }}>{MY_PROFILE.city}, {MY_PROFILE.country}</div>
              </div>
            </div>
            {MY_PROFILE.verified && <Badge color="green" style={{ marginBottom: 8 }}>✓ Identity verified</Badge>}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <ProgressRing pct={65} size={48} stroke={4} />
              <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>Profile 65% complete. Add photos to get more visibility.</div>
            </div>
            <Btn variant="outline" full style={{ marginTop: 14 }}>Edit profile</Btn>
          </Card>

          <Card style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Notifications</h3>
            {notifications.map(n => (
              <div key={n.id} style={{
                display: "flex", gap: 10, padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
                opacity: n.read ? 0.7 : 1,
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{n.text}</div>
                  <div style={{ fontSize: 10, color: C.textMute, marginTop: 2 }}>{n.time}</div>
                </div>
                {!n.read && <div style={{ width: 7, height: 7, background: C.brand, borderRadius: "50%", flexShrink: 0, marginTop: 4 }} />}
              </div>
            ))}
          </Card>

          {/* Upgrade banner */}
          <div style={{
            background: `linear-gradient(135deg, ${C.brand}, #166534)`,
            borderRadius: 12, padding: "18px 18px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>⭐ Upgrade to Premium</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 12 }}>
              See who shortlisted you, send unlimited interests, and appear at the top of search results.
            </div>
            <Btn variant="white" size="sm" full>View plans</Btn>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Register Page ─────────────────────────────────────────────────────────────

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [madhab, setMadhab] = useState("Hanafi");
  const [form, setForm] = useState({ email: "", password: "", name: "", gender: "Female", dob: "", country: "India", city: "", occupation: "", education: "Bachelor's", sect: "Sunni", salah: "5× daily", quran: "Reads regularly", hijab: "Hijab" });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const STEPS = ["Account", "Personal info", "Faith & practice", "Partner prefs", "Photos & review"];

  return (
    <div className="fade-in register-container">
      {/* Step indicator */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", position: "relative" }}>
          <div style={{ position: "absolute", top: 15, left: "10%", right: "10%", height: 2, background: C.border }} />
          {STEPS.map((s, i) => {
            const n = i + 1;
            return (
              <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", zIndex: 1,
                  background: n < step ? C.brand : n === step ? C.brand : "#fff",
                  border: `2px solid ${n <= step ? C.brand : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                  color: n <= step ? "#fff" : C.textMute,
                }}>
                  {n < step ? "✓" : n}
                </div>
                <div style={{ fontSize: 10, color: n === step ? C.brand : C.textMute, fontWeight: n === step ? 600 : 400, textAlign: "center" }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Card style={{ padding: 28 }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Create your account</h2>
              <p style={{ fontSize: 13, color: C.textMute, marginTop: 4 }}>Start your halal marriage journey</p>
            </div>
            <div className="form-grid-2">
              <div style={{ gridColumn: "1/-1" }}>
                <Select label="This profile is for" options={["Myself", "My daughter", "My son", "My sibling"]} value="Myself" onChange={() => {}} />
              </div>
              <Select label="Gender" options={["Female", "Male"]} value={form.gender} onChange={e => f("gender", e.target.value)} />
              <Input label="Full name" placeholder="Aisha Rahman" value={form.name} onChange={e => f("name", e.target.value)} />
              <div style={{ gridColumn: "1/-1" }}>
                <Input label="Email address" type="email" placeholder="you@email.com" value={form.email} onChange={e => f("email", e.target.value)} icon="✉" />
              </div>
              <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => f("password", e.target.value)} />
              <Input label="Mobile number" type="tel" placeholder="+91 98765 43210" hint="For account verification only" />
            </div>
            <div style={{ padding: "12px 14px", background: C.brandLight, borderRadius: 8, fontSize: 12, color: C.brandText, lineHeight: 1.6 }}>
              📿 By registering, you agree to our Terms of Service and confirm that all information provided is truthful and will be used solely for the purpose of finding a halal life partner.
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Personal information</h2>
              <p style={{ fontSize: 13, color: C.textMute, marginTop: 4 }}>Help potential matches and families learn about you</p>
            </div>
            <div className="form-grid-2">
              <Input label="Date of birth" type="date" />
              <Select label="Height" options={["4'10\"", "5'0\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'8\"", "5'10\"", "6'0\"", "6'2\""]} />
              <Select label="Marital status" options={["Never married", "Divorced", "Widowed"]} />
              <Select label="Mother tongue" options={["Urdu", "Arabic", "English", "Malay", "Bengali", "Turkish", "Punjabi", "Tamil"]} />
              <Select label="Country" options={["India", "Pakistan", "Saudi Arabia", "UK", "UAE", "USA", "Canada", "Malaysia"]} value={form.country} onChange={e => f("country", e.target.value)} />
              <Input label="City" placeholder="e.g. Hyderabad" value={form.city} onChange={e => f("city", e.target.value)} />
              <Select label="Education level" options={["High school", "Diploma", "Bachelor's", "Master's", "PhD", "MBBS / MD", "LLB / LLM", "CA / CFA"]} value={form.education} onChange={e => f("education", e.target.value)} />
              <Input label="Occupation" placeholder="e.g. Doctor, Engineer" value={form.occupation} onChange={e => f("occupation", e.target.value)} />
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid }}>About yourself</label>
                <textarea rows={4} placeholder="Write a sincere introduction about yourself, your values, and what you are looking for…"
                  style={{
                    width: "100%", marginTop: 5, padding: "10px 12px",
                    border: `1px solid ${C.border}`, borderRadius: 8,
                    fontSize: 13, background: "#fff", color: C.text, resize: "vertical",
                  }} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Faith & religious practice</h2>
              <p style={{ fontSize: 13, color: C.textMute, marginTop: 4 }}>The foundation of a blessed marriage begins here</p>
            </div>
            <div className="form-grid-2">
              <Select label="Sect" options={["Sunni", "Shia", "Prefer not to disclose"]} value={form.sect} onChange={e => f("sect", e.target.value)} />
              <Select label="Religiosity" options={["Very religious", "Practising", "Moderate", "Cultural Muslim"]} />
              <Select label="Daily salah" options={["5× daily", "Mostly 5×", "Regularly", "Occasionally"]} value={form.salah} onChange={e => f("salah", e.target.value)} />
              <Select label="Quran recitation" options={["Hafiz/Hafiza", "Recites with tajweed", "Reads regularly", "Basic recitation"]} value={form.quran} onChange={e => f("quran", e.target.value)} />
              <Select label="Hijab / dress code (sisters)" options={["Full hijab", "Hijab", "Niqab", "Modest dress (no hijab)"]} value={form.hijab} onChange={e => f("hijab", e.target.value)} />
              <Select label="Diet" options={["Halal only", "Vegetarian halal", "Strictly halal + Zabiha"]} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid, display: "block", marginBottom: 8 }}>Madhab (school of thought)</label>
              <div className="form-grid-2" style={{ gap: 8 }}>
                {["Hanafi", "Maliki", "Shafi'i", "Hanbali", "Jafari", "Not sure"].map(m => (
                  <div key={m} onClick={() => setMadhab(m)} style={{
                    padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                    border: `1.5px solid ${madhab === m ? C.brand : C.border}`,
                    background: madhab === m ? C.brandLight : "#fff",
                    color: madhab === m ? C.brandMid : C.textMid,
                    fontWeight: madhab === m ? 600 : 400, transition: "all 0.15s",
                  }}>{m}</div>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid, display: "block", marginBottom: 8 }}>Wali (guardian) details</label>
              <div className="form-grid-2">
                <Input placeholder="Wali's full name" hint="e.g. Father, Brother, Uncle" />
                <Input placeholder="Wali's contact number" type="tel" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Partner preferences</h2>
              <p style={{ fontSize: 13, color: C.textMute, marginTop: 4 }}>Tell us what you're looking for in a spouse</p>
            </div>
            <div className="form-grid-2">
              <Input label="Age from" type="number" placeholder="24" />
              <Input label="Age to" type="number" placeholder="35" />
              <Select label="Country preference" options={["Any country", "India", "Pakistan", "UK", "UAE", "Saudi Arabia", "USA", "Canada"]} />
              <Select label="Education preference" options={["Any", "Bachelor's or above", "Master's or above", "PhD only"]} />
              <Select label="Marital status" options={["Never married", "Divorced (open)", "Any"]} />
              <Select label="Sect preference" options={["Same sect only", "Sunni", "Any Muslim"]} />
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid, display: "block", marginBottom: 6 }}>Additional message to potential matches</label>
                <textarea rows={3} placeholder="Any specific qualities or circumstances you'd like potential matches to know…"
                  style={{
                    width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`,
                    borderRadius: 8, fontSize: 13, background: "#fff", color: C.text, resize: "vertical",
                  }} />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Add photos & review</h2>
              <p style={{ fontSize: 13, color: C.textMute, marginTop: 4 }}>Profiles with photos receive 8× more interest</p>
            </div>

            <div style={{
              border: `2px dashed ${C.border}`, borderRadius: 12, padding: "32px",
              textAlign: "center", background: C.bg, cursor: "pointer",
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Upload your profile photo</div>
              <div style={{ fontSize: 12, color: C.textMute, marginBottom: 14 }}>JPG or PNG, max 5MB. Islamic dress code required.</div>
              <Btn variant="outline">Choose photo</Btn>
            </div>

            <div style={{ padding: "14px", background: C.goldLight, borderRadius: 10, border: `1px solid #fde68a`, fontSize: 13, color: "#92400e", lineHeight: 1.7 }}>
              <strong>📋 Before we publish your profile:</strong><br />
              • Our team manually reviews every profile (usually within 24 hours)<br />
              • Immodest or inappropriate photos will be rejected<br />
              • You will receive an email confirmation once your profile is live
            </div>

            <div style={{ background: C.brandLight, borderRadius: 10, padding: "14px", border: `1px solid ${C.brandMuted}` }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.brandMid, marginBottom: 8 }}>✓ Profile summary</div>
              {Object.entries({ "Name": form.name || "Not provided", "Gender": form.gender, "Country": form.country, "Education": form.education, "Sect": form.sect, "Madhab": madhab }).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: `1px solid ${C.brandMuted}` }}>
                  <span style={{ color: C.textMid }}>{k}</span>
                  <span style={{ fontWeight: 500, color: C.text }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 10 }}>
          {step > 1
            ? <Btn variant="outline" onClick={() => setStep(s => s - 1)}>← Back</Btn>
            : <div />
          }
          {step < 5
            ? <Btn variant="primary" onClick={() => setStep(s => s + 1)}>Continue →</Btn>
            : <Btn variant="primary" onClick={() => alert("🎉 Profile submitted! JazakAllah Khair. Our team will review and publish it within 24 hours. You'll receive a confirmation email at the address provided.")}>
                Submit profile →
              </Btn>
          }
        </div>
      </Card>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const nav = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const viewProfile = (p) => {
    setSelectedProfile(p);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <StyleInject />
      <div style={{ minHeight: "100vh" }}>
        <Navbar page={page} onNav={nav} notifCount={2} />
        {page === "home"      && <HomePage onNav={nav} onViewProfile={viewProfile} />}
        {page === "browse"    && <BrowsePage onViewProfile={viewProfile} />}
        {page === "detail"    && <ProfileDetailPage profile={selectedProfile} onBack={() => nav("browse")} onMessage={() => nav("messages")} />}
        {page === "messages"  && <MessagesPage />}
        {page === "dashboard" && <DashboardPage onNav={nav} />}
        {page === "register"  && <RegisterPage />}
      </div>
    </>
  );
}
