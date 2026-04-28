import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────── PALETTE ─────────── */
const G = "#C9A84C", G2 = "#EDD97A", G3 = "#F7EDD4";
const SIL = "#B8C4D8", SIL2 = "#DEE4F0";
const CREAM = "#FDF0D5", IVORY = "#FAF4E4";
const MAR = "#4A0E1A", DEEP = "#060310", DIM = "#0C071C";
const TEXT = "#F0E8D8", MUTED = "#8880A8";

const SHIMMER = {
  background: `linear-gradient(120deg,${SIL2} 0%,${G2} 22%,${G} 50%,${G2} 78%,${SIL2} 100%)`,
  backgroundSize: "220% auto",
  WebkitBackgroundClip: "text", backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: "sh 4.5s linear infinite",
};

/* ─────────── MANDALA SVG ─────────── */
function MandalaPath({ size = 300, c1 = G, c2 = SIL }) {
  const cx = size / 2, r = size / 2;
  const rings = [.94, .80, .66, .53, .41, .30, .19, .10];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {rings.map((f, i) => (
        <circle key={i} cx={cx} cy={cx} r={r * f} fill="none"
          stroke={i % 2 ? c2 : c1} strokeWidth={i === 0 ? 1.3 : .45}
          opacity={.6 - i * .05} />
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 15},${cx},${cx})`}>
          <path d={`M${cx},${cx} C${cx + r * .065},${cx - r * .18} ${cx + r * .075},${cx - r * .54} ${cx},${cx - r * .64} C${cx - r * .075},${cx - r * .54} ${cx - r * .065},${cx - r * .18} ${cx},${cx}`}
            fill={c1} opacity=".12" />
        </g>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 30},${cx},${cx})`}>
          <ellipse cx={cx} cy={cx - r * .36} rx={r * .055} ry={r * .125} fill={c2} opacity=".28" />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 45},${cx},${cx})`}>
          <ellipse cx={cx} cy={cx - r * .21} rx={r * .038} ry={r * .085} fill={c1} opacity=".56" />
        </g>
      ))}
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i * Math.PI * 2) / 36, rr = r * .89;
        return <circle key={i} cx={cx + rr * Math.sin(a)} cy={cx - rr * Math.cos(a)}
          r={i % 3 === 0 ? 2.2 : .9} fill={c1} opacity={i % 3 === 0 ? .62 : .21} />;
      })}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={cx} y1={cx}
          x2={cx + r * .85 * Math.sin(i * Math.PI / 4)}
          y2={cx - r * .85 * Math.cos(i * Math.PI / 4)}
          stroke={c2} strokeWidth=".4" opacity=".18" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 60},${cx},${cx})`}>
          <path d={`M${cx},${cx - r * .15} Q${cx + r * .065},${cx - r * .09} ${cx},${cx} Q${cx - r * .065},${cx - r * .09} ${cx},${cx - r * .15}`}
            fill={c1} opacity=".5" />
        </g>
      ))}
      <circle cx={cx} cy={cx} r={r * .05} fill={c1} opacity=".85" />
      <circle cx={cx} cy={cx} r={r * .023} fill="white" opacity=".9" />
    </svg>
  );
}

/* ─────────── DOOR PANEL ─────────── */
function Door({ side, isOpening }) {
  const isL = side === "left";
  return (
    <div style={{
      width: "50%", height: "100%", position: "relative",
      transformOrigin: isL ? "left center" : "right center",
      transform: isOpening ? `perspective(1100px) rotateY(${isL ? -84 : 84}deg)` : "none",
      transition: isOpening ? "transform 1.85s cubic-bezier(0.22,1,0.36,1)" : "none",
      background: isL ? "linear-gradient(to right,#160C30,#080316)" : "linear-gradient(to left,#160C30,#080316)",
      overflow: "hidden",
    }}>
      <svg width="100%" height="100%" viewBox="0 0 200 610" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}>
        <rect x="3" y="3" width="194" height="604" fill="none" stroke={G} strokeWidth="1.8" opacity=".72" />
        <rect x="8" y="8" width="184" height="594" fill="none" stroke={SIL} strokeWidth=".5" opacity=".26" />
        <rect x="14" y="14" width="172" height="582" fill="none" stroke={G} strokeWidth=".3" opacity=".14" />
        <path d="M16,295 Q16,22 100,22 Q184,22 184,295" fill="rgba(201,168,76,.02)" stroke={G} strokeWidth="1.4" opacity=".72" />
        <path d="M25,295 Q25,34 100,34 Q175,34 175,295" fill="none" stroke={SIL} strokeWidth=".5" opacity=".24" />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30},100,22)`}>
            <ellipse cx="100" cy="44" rx="4" ry="11" fill="none" stroke={G} strokeWidth=".7" opacity=".42" />
          </g>
        ))}
        <circle cx="100" cy="22" r="11" fill="none" stroke={G} strokeWidth="1.1" opacity=".55" />
        <circle cx="100" cy="22" r="5" fill={G} opacity=".35" />
        <circle cx="100" cy="22" r="2.2" fill={G2} opacity=".75" />
        {Array.from({ length: 18 }, (_, i) => {
          const t = i / 17, ang = Math.PI * t, rr = 80;
          const x = 100 - rr * Math.cos(Math.PI - ang), y = 295 - rr * Math.sin(ang) * (273 / 80);
          if (y < 24) return null;
          return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)}
            r={i % 4 === 0 ? 3.5 : 1.6} fill={G} opacity={i % 4 === 0 ? .72 : .38} />;
        })}
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 5 }, (_, col) => {
            const cx_ = 38 + col * 24, cy_ = 90 + row * 34;
            return (
              <g key={`${row}-${col}`}>
                <path d={`M${cx_},${cy_ - 12} L${cx_ + 12},${cy_} L${cx_},${cy_ + 12} L${cx_ - 12},${cy_} Z`}
                  fill="none" stroke={G} strokeWidth=".35" opacity=".20" />
                <circle cx={cx_} cy={cy_} r="1.2" fill={G} opacity=".22" />
              </g>
            );
          })
        )}
        {[[14, 14], [186, 14], [14, 596], [186, 596]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="8" fill={G} opacity=".48" />
            <circle cx={x} cy={y} r="13" fill="none" stroke={G} strokeWidth=".8" opacity=".32" />
            <circle cx={x} cy={y} r="19" fill="none" stroke={SIL} strokeWidth=".4" opacity=".18" />
            <circle cx={x} cy={y} r="3.5" fill={G2} opacity=".7" />
          </g>
        ))}
        <line x1="14" y1="297" x2="186" y2="297" stroke={G} strokeWidth=".7" opacity=".42" />
        <rect x="28" y="305" width="144" height="190" fill="none" stroke={G} strokeWidth="1" opacity=".44" rx="2" />
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 36},100,396)`}>
            <ellipse cx="100" cy="370" rx="9" ry="22" fill="none" stroke={G} strokeWidth=".7" opacity=".36" />
          </g>
        ))}
        <circle cx="100" cy="396" r="15" fill="none" stroke={G} strokeWidth="1.1" opacity=".5" />
        <circle cx="100" cy="396" r="7" fill="none" stroke={G} strokeWidth=".5" opacity=".35" />
        <circle cx="100" cy="396" r="4" fill={G} opacity=".3" />
        <rect x="28" y="508" width="144" height="82" fill="none" stroke={G} strokeWidth=".8" opacity=".34" />
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i} cx={55 + i * 22} cy="549" r="2.2" fill={G} opacity=".28" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <circle cx={isL ? 183 : 17} cy={96 + i * 42} r="2.2" fill={G} opacity=".28" />
            <circle cx={isL ? 183 : 17} cy={96 + i * 42} r="4.5" fill="none" stroke={G} strokeWidth=".45" opacity=".16" />
          </g>
        ))}
      </svg>
      <div style={{
        position: "absolute", top: "46%",
        [isL ? "right" : "left"]: "9px",
        transform: "translateY(-50%)",
        width: "16px", height: "16px", borderRadius: "50%",
        background: `radial-gradient(circle at 33% 28%,${G3},${G} 50%,#8B6914)`,
        boxShadow: "0 3px 9px rgba(0,0,0,.65)",
      }} />
    </div>
  );
}

/* ─────────── SPARKLES ─────────── */
function Sparkles({ sparks, show }) {
  if (!show) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 20 }}>
      {sparks.map(sp => (
        <div key={sp.id} style={{
          position: "absolute", top: "50%", left: "50%",
          width: `${sp.sz}px`, height: `${sp.sz}px`,
          borderRadius: sp.id % 3 === 0 ? "50%" : "2px",
          background: sp.col,
          "--tx": `${sp.x}px`, "--ty": `${sp.y}px`,
          animation: `so 1.1s ${sp.dl}s cubic-bezier(.22,1,.36,1) both`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

/* ─────────── GOLD DIVIDER ─────────── */
function Divider({ color = G, sym = "✦", mar = false }) {
  const lineStyle = mar
    ? { flex: 1, maxWidth: "100px", height: "1px" }
    : { flex: 1, maxWidth: "100px", height: "1px" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", margin: "20px 0" }}>
      <div style={{ ...lineStyle, background: `linear-gradient(90deg,transparent,${color})` }} />
      <span style={{ color, fontSize: ".62rem" }}>{sym}</span>
      <div style={{ ...lineStyle, background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}

/* ─────────── SCROLL REVEAL ─────────── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: .12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
      animate={vis ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .9, delay, ease: [.16, 1, .3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─────────── BORDER STRIP ─────────── */
function BorderStrip({ top = true }) {
  return (
    <div style={{
      position: "absolute", [top ? "top" : "bottom"]: 0, left: 0, right: 0, height: "5px",
      background: `repeating-linear-gradient(90deg,${G} 0,${G} 9px,transparent 9px,transparent 16px)`,
      opacity: .48,
    }} />
  );
}

/* ─────────── CORNER ORNAMENTS ─────────── */
function CornerOrnaments({ sz = 18, color = G, op = .62 }) {
  const positions = [
    { top: `-${sz * .45}px`, left: `-${sz * .45}px`, cx: 0, cy: 0 },
    { top: `-${sz * .45}px`, right: `-${sz * .45}px`, cx: sz, cy: 0 },
    { bottom: `-${sz * .45}px`, left: `-${sz * .45}px`, cx: 0, cy: sz },
    { bottom: `-${sz * .45}px`, right: `-${sz * .45}px`, cx: sz, cy: sz },
  ];
  return positions.map((pos, i) => (
    <div key={i} style={{ position: "absolute", zIndex: 2, ...pos }}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        <circle cx={pos.cx} cy={pos.cy} r={sz * .34} fill="none" stroke={color} strokeWidth="1" opacity={op} />
        <circle cx={pos.cx} cy={pos.cy} r={sz * .14} fill={color} opacity={op * .85} />
      </svg>
    </div>
  ));
}

/* ─────────── FILM STRIP ─────────── */
const FILM_FRAMES = [
  { y: "2001", l: "A Night of Stars", sym: "✦" },
  { y: "2008", l: "Growing Roots", sym: "❀" },
  { y: "2015", l: "Mahabalipuram", sym: "✾" },
  { y: "2018", l: "By the Shore", sym: "✿" },
  { y: "2022", l: "Rooftop Glow", sym: "❁" },
  { y: "2026", l: "Silver Jubilee", sym: "꽃" },
];
function FilmStrip() {
  const all = [...FILM_FRAMES, ...FILM_FRAMES];
  const Hole = () => (
    <div style={{ minWidth: 13, height: 9, borderRadius: 2, flexShrink: 0, background: "rgba(201,168,76,.14)", border: "1px solid rgba(201,168,76,.22)" }} />
  );
  const Rail = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 8px", height: 22, background: DIM, overflow: "hidden" }}>
      {Array.from({ length: 40 }, (_, i) => <Hole key={i} />)}
    </div>
  );
  return (
    <div style={{ position: "relative" }}>
      <Rail />
      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 18, width: "fit-content", animation: "film 38s linear infinite", padding: "26px 9px" }}>
          {all.map((fr, i) => (
            <div key={i} style={{
              minWidth: 185, height: 238, flexShrink: 0,
              background: "linear-gradient(135deg,rgba(20,16,56,.95),rgba(10,7,28,.98))",
              border: `1.5px solid rgba(201,168,76,.28)`, borderRadius: 3,
              boxShadow: "0 12px 36px rgba(0,0,0,.5)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 158, height: 168, borderRadius: 2,
                background: "linear-gradient(145deg,#1C1848,#231D52,#1A1640)",
                border: "1px solid rgba(201,168,76,.09)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ color: "rgba(201,168,76,.22)", fontSize: "2rem" }}>{fr.sym}</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".36rem", letterSpacing: ".28em", color: "rgba(184,196,216,.2)", textTransform: "uppercase", marginTop: 7 }}>Photo</div>
              </div>
              <div style={{ padding: "10px 8px 0", textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: ".88rem", color: TEXT, lineHeight: 1.2 }}>{fr.l}</div>
                <div style={{ fontSize: ".44rem", letterSpacing: ".3em", color: G, textTransform: "uppercase", marginTop: 3 }}>{fr.y}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Rail />
    </div>
  );
}

/* ─────────── COUNTDOWN BOX ─────────── */
function CdBox({ label, val }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Cinzel',serif", fontWeight: 600,
        fontSize: "clamp(1.8rem,6vw,2.8rem)", color: CREAM,
        background: "linear-gradient(135deg,rgba(20,16,56,.9),rgba(10,7,28,.95))",
        border: `1px solid rgba(201,168,76,.28)`, borderRadius: 8,
        padding: "14px 10px", minWidth: 68,
        boxShadow: "0 8px 24px rgba(0,0,0,.4),inset 0 1px 0 rgba(201,168,76,.16)",
      }}>{val}</div>
      <div style={{ fontSize: ".48rem", letterSpacing: ".3em", color: MUTED, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ─────────── LOADER ─────────── */
function Loader({ onDone }) {
  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: `radial-gradient(ellipse at 50% 40%,#1A1060 0%,${DEEP} 60%,#030110 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: .7 } }}
      onAnimationComplete={() => {}}
    >
      <motion.div
        style={{ animation: "spin 9s linear infinite", marginBottom: 22, opacity: .72 }}
        initial={{ opacity: 0, scale: .8 }}
        animate={{ opacity: .72, scale: 1 }}
        transition={{ duration: .8 }}
      >
        <MandalaPath size={110} c1={G} c2={SIL} />
      </motion.div>
      <motion.div
        style={{ fontFamily: "serif", fontSize: "clamp(1rem,3vw,1.3rem)", color: G, letterSpacing: ".08em", animation: "sLoad 2s ease-in-out infinite", textAlign: "center", marginBottom: 8 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}
      >ॐ श्री गणेशाय नम:</motion.div>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".44rem", letterSpacing: ".58em", color: "rgba(184,196,216,.36)", textTransform: "uppercase" }}>Loading your invitation…</div>
      <div style={{ width: 110, height: 1, background: "rgba(201,168,76,.14)", marginTop: 22, overflow: "hidden", borderRadius: 1, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", background: `linear-gradient(90deg,transparent,${G},transparent)`, animation: "shimL 1.4s linear infinite" }} />
      </div>
      {/* Auto-proceed after 2.8s */}
      <LoaderTimer onDone={onDone} />
    </motion.div>
  );
}
function LoaderTimer({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return null;
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState("loader"); // loader | gate | opening | open
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", attendance: "", guests: "1", blessing: "" });
  const [rsvpDone, setRsvpDone] = useState(false);
  const [sealAnim, setSealAnim] = useState(false);
  const [showSpark, setShowSpark] = useState(false);
  const [countdown, setCountdown] = useState({ d: "00", h: "00", m: "00", s: "00" });

  const scrollerRef = useRef(null);
  const tlSecRef = useRef(null);
  const tlTrackRef = useRef(null);
  const tlProgRef = useRef(null);
  const m1Ref = useRef(null);
  const m2Ref = useRef(null);
  const dragStart = useRef(0);
  const THRESHOLD = 92;

  /* ── Memo random data ── */
  const gateStars = useMemo(() => Array.from({ length: 65 }, (_, i) => ({
    id: i, sz: +(Math.random() * 1.6 + .4).toFixed(1),
    t: +(Math.random() * 100).toFixed(1), l: +(Math.random() * 100).toFixed(1),
    d: +(Math.random() * 3 + 2).toFixed(1), dl: +(Math.random() * 5).toFixed(1),
  })), []);
  const heroStars = useMemo(() => Array.from({ length: 55 }, (_, i) => ({
    id: i, sz: +(Math.random() * 1.5 + .5).toFixed(1),
    t: +(Math.random() * 100).toFixed(1), l: +(Math.random() * 100).toFixed(1),
    d: +(Math.random() * 4 + 2).toFixed(1), dl: +(Math.random() * 5).toFixed(1),
  })), []);
  const petals = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i, l: +(Math.random() * 94).toFixed(1),
    d: +(9 + Math.random() * 9).toFixed(1), dl: +(Math.random() * 15).toFixed(1),
    sz: +(0.6 + Math.random() * 0.65).toFixed(1),
    ch: ["✿", "❀", "✾", "❁", "꽃", "❋"][i % 6],
  })), []);
  const sparks = useMemo(() => Array.from({ length: 52 }, (_, i) => ({
    id: i, x: +(Math.random() * 290 - 145).toFixed(0), y: +(-(Math.random() * 195 + 30)).toFixed(0),
    sz: +(Math.random() * 9 + 3).toFixed(0),
    col: [G, G2, SIL, "#FFFFFF", "#F5C4B3"][Math.floor(Math.random() * 5)],
    dl: +(Math.random() * .55).toFixed(2),
  })), []);

  /* ── Countdown ── */
  useEffect(() => {
    const TARGET = new Date("2026-06-30T18:00:00");
    const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, "0");
    const tick = () => {
      const diff = TARGET - new Date();
      setCountdown({
        d: pad(diff / 86400000),
        h: pad((diff % 86400000) / 3600000),
        m: pad((diff % 3600000) / 60000),
        s: pad((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── GSAP Horizontal Scroll ── */
  useEffect(() => {
    if (phase !== "open") return;
    const scroller = scrollerRef.current;
    const sec = tlSecRef.current;
    const track = tlTrackRef.current;
    const prog = tlProgRef.current;
    if (!scroller || !sec || !track) return;

    const onScroll = () => {
      const rect = sec.getBoundingClientRect();
      const range = sec.offsetHeight - scroller.clientHeight;
      const p = Math.max(0, Math.min(1, -rect.top / range));
      const maxOff = Math.max(0, track.scrollWidth - scroller.clientWidth + 80);
      track.style.transform = `translateX(${-p * maxOff}px)`;
      if (prog) prog.style.width = `${p * 100}%`;
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [phase]);

  /* ── Mouse parallax ── */
  useEffect(() => {
    if (phase !== "open") return;
    const h = e => {
      const x = (e.clientX / window.innerWidth - .5) * 38;
      const y = (e.clientY / window.innerHeight - .5) * 38;
      if (m1Ref.current) m1Ref.current.style.transform = `translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
      if (m2Ref.current) m2Ref.current.style.transform = `translate(calc(-50% + ${-x * .55}px),calc(-50% + ${-y * .55}px))`;
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [phase]);

  /* ── Drag handlers ── */
  const onDragStart = useCallback(e => {
    if (phase !== "gate") return;
    setIsDragging(true);
    dragStart.current = e.touches ? e.touches[0].clientY : e.clientY;
  }, [phase]);

  const onDragMove = useCallback(e => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setDragY(Math.min(Math.max(0, y - dragStart.current), THRESHOLD + 30));
  }, [isDragging]);

  const onDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY >= THRESHOLD) {
      setPhase("opening");
      setTimeout(() => setPhase("open"), 2100);
    } else {
      setDragY(0);
    }
  }, [isDragging, dragY]);

  /* ── RSVP ── */
  const submitRsvp = useCallback(() => {
    if (!rsvp.name.trim() || !rsvp.attendance) {
      alert("Please fill in your name and attendance.");
      return;
    }
    setSealAnim(true);
    setShowSpark(true);
    setTimeout(() => {
      setSealAnim(false);
      setRsvpDone(true);
      setTimeout(() => setShowSpark(false), 2500);
    }, 660);
  }, [rsvp]);

  /* ── Journey data ── */
  const journey = [
    { year: "2001", label: "The Beginning", sub: "A lifetime woven from one perfect day" },
    { year: "2008", label: "Growing Roots", sub: "Every season bloomed with quiet purpose" },
    { year: "2015", label: "South India Tales", sub: "Temples, tides, and tandem laughter" },
    { year: "2026", label: "Silver Jubilee", sub: "Twenty-five years — all of it gold" },
  ];

  /* ── Event details ── */
  const events = [
    { ico: "◈", ey: "Date & Time", ttl: "30th June, 2026", sub: "Festivities begin at 6:00 PM · Dinner and celebrations through the evening" },
    { ico: "◉", ey: "Venue", ttl: "Jaipur, Rajasthan", sub: "The Pink City of India · Full venue details shared with confirmed guests" },
    { ico: "✦", ey: "Dress Code", ttl: "Silver & Gold Elegance", sub: "Sarees · Lehengas · Sherwanis · Or your finest festive attire — all welcome" },
    { ico: "♡", ey: "A Heartfelt Note", ttl: "Your Presence is Our Gift", sub: "Your love and blessings are the greatest gift as we mark this milestone" },
  ];

  /* ════════ RENDER ════════ */
  return (
    <div style={{ fontFamily: "'Raleway',sans-serif", background: DEEP, color: TEXT, height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* ── LOADER ── */}
      <AnimatePresence>
        {phase === "loader" && <Loader onDone={() => setPhase("gate")} />}
      </AnimatePresence>

      {/* ── PALACE GATE ── */}
      <AnimatePresence>
        {(phase === "gate" || phase === "opening") && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .5 } }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: `radial-gradient(ellipse at 50% 36%,#1C1268 0%,${DEEP} 50%,#030110 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
              userSelect: "none",
            }}
          >
            {/* Stars */}
            {gateStars.map(s => (
              <div key={s.id} style={{
                position: "absolute",
                width: `${s.sz}px`, height: `${s.sz}px`,
                background: "white", borderRadius: "50%",
                top: `${s.t}%`, left: `${s.l}%`,
                animation: `tw ${s.d}s ${s.dl}s ease-in-out infinite`,
              }} />
            ))}

            <div style={{ textAlign: "center", marginBottom: 18, position: "relative", zIndex: 2, fontFamily: "serif", fontSize: "clamp(.8rem,2.2vw,.96rem)", color: "rgba(201,168,76,.52)", letterSpacing: ".1em" }}>
              ॐ श्री गणेशाय नम:
            </div>
            <div style={{ textAlign: "center", marginBottom: 16, position: "relative", zIndex: 2, fontFamily: "'Cinzel',serif", fontSize: ".52rem", letterSpacing: ".58em", color: "rgba(201,168,76,.4)", textTransform: "uppercase" }}>
              A Royal Invitation · Silver Jubilee · 2026
            </div>

            {/* Gate frame */}
            <div style={{ width: "min(380px,90vw)", height: "min(530px,76vh)", position: "relative" }}>
              {/* Outer arch SVG */}
              <svg style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", width: "100%", height: "100%" }} viewBox="0 0 380 530" preserveAspectRatio="none">
                <path d="M0,278 Q0,0 190,0 Q380,0 380,278" fill="none" stroke={G} strokeWidth="2.8" opacity=".8" />
                <path d="M9,278 Q9,13 190,13 Q371,13 371,278" fill="none" stroke={SIL} strokeWidth=".8" opacity=".32" />
                <path d="M19,278 Q19,28 190,28 Q361,28 361,278" fill="none" stroke={G} strokeWidth=".35" opacity=".16" />
                {Array.from({ length: 20 }, (_, i) => {
                  const t = i / 19, ang = Math.PI * t, rr = 184;
                  const x = 190 - rr * Math.cos(Math.PI - ang), y = 278 - rr * Math.sin(ang) * (278 / 184);
                  if (y < 9) return null;
                  return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={i % 4 === 0 ? 4.5 : 2.2} fill={G} opacity={i % 4 === 0 ? .78 : .4} />;
                })}
                <polygon points="177,2 190,0 203,2 199,20 181,20" fill={G} opacity=".72" />
                <text x="190" y="15" textAnchor="middle" fontFamily="serif" fontSize="8.5" fill="#3A2800" opacity=".8">◆</text>
                <circle cx="190" cy="0" r="11" fill="none" stroke={G} strokeWidth="1.1" opacity=".55" />
                {Array.from({ length: 12 }, (_, i) => (
                  <g key={i} transform={`rotate(${i * 30},190,0)`}>
                    <ellipse cx="190" cy="22" rx="4.5" ry="12" fill="none" stroke={G} strokeWidth=".7" opacity=".34" />
                  </g>
                ))}
                <line x1="0" y1="278" x2="0" y2="530" stroke={G} strokeWidth="2.8" opacity=".65" />
                <line x1="380" y1="278" x2="380" y2="530" stroke={G} strokeWidth="2.8" opacity=".65" />
                <line x1="9" y1="278" x2="9" y2="520" stroke={SIL} strokeWidth=".8" opacity=".26" />
                <line x1="371" y1="278" x2="371" y2="520" stroke={SIL} strokeWidth=".8" opacity=".26" />
                <rect x="0" y="525" width="380" height="5" fill={G} opacity=".55" rx="1" />
              </svg>

              {/* Doors */}
              <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", zIndex: 2 }}>
                <Door side="left" isOpening={phase === "opening"} />
                <Door side="right" isOpening={phase === "opening"} />
                <div style={{ position: "absolute", top: 0, left: "50%", width: 2, height: "100%", transform: "translateX(-50%)", background: `linear-gradient(to bottom,rgba(201,168,76,.78),rgba(201,168,76,.18) 70%,transparent)`, zIndex: 5, pointerEvents: "none" }} />

                {/* DRAG LOCK */}
                {phase === "gate" && (
                  <div
                    onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
                    onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}
                    style={{
                      position: "absolute", top: "46%", left: "50%",
                      transform: `translate(-50%, calc(-50% + ${dragY}px))`,
                      zIndex: 10, cursor: isDragging ? "grabbing" : "grab",
                      touchAction: "none",
                      transition: isDragging ? "none" : "transform .44s cubic-bezier(.34,1.56,.64,1)",
                    }}
                  >
                    {!isDragging && <>
                      <div style={{ position: "absolute", inset: "-22px", borderRadius: "50%", border: "1px solid rgba(184,196,216,.5)", animation: "pr 2.5s ease-out infinite" }} />
                      <div style={{ position: "absolute", inset: "-11px", borderRadius: "50%", border: `1px solid rgba(201,168,76,.42)`, animation: "pr 2.5s ease-out 1.25s infinite" }} />
                    </>}
                    <div style={{
                      width: 74, height: 74, borderRadius: "50%",
                      background: `radial-gradient(circle at 33% 28%,${G3},${G} 42%,#8B6914 76%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 ${4 + dragY * .12}px ${24 + dragY * .45}px rgba(0,0,0,.65),0 0 ${36 + dragY * .32}px rgba(201,168,76,${.3 + dragY / 270})`,
                      border: "2.5px solid rgba(255,255,255,.2)",
                      animation: isDragging ? "none" : "gw 2.9s ease-in-out infinite",
                    }}>
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <rect x="5.5" y="14" width="19" height="12" rx="3" fill="#3A2800" opacity=".88" />
                        <path d="M9 14V10.5A6 6 0 0 1 21 10.5V14" fill="none" stroke="#3A2800" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="15" cy="19.5" r="2.5" fill="#9B7D1A" />
                        <line x1="15" y1="19.5" x2="15" y2="23" stroke="#9B7D1A" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    {dragY > 6 && (
                      <div style={{ position: "absolute", bottom: -34, left: "50%", transform: "translateX(-50%)", width: 58, height: 4, borderRadius: 2, background: "rgba(201,168,76,.12)" }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (dragY / THRESHOLD) * 100)}%`, background: `linear-gradient(90deg,${G},${G2})`, borderRadius: 2, boxShadow: `0 0 7px rgba(201,168,76,.6)`, transition: "width .06s linear" }} />
                      </div>
                    )}
                    {!isDragging && dragY < 6 && (
                      <div style={{ position: "absolute", top: "100%", left: "50%", marginTop: 26, whiteSpace: "nowrap", fontSize: ".47rem", letterSpacing: ".42em", color: "rgba(184,196,216,.44)", textTransform: "uppercase", animation: "flX 2.2s ease-in-out infinite", pointerEvents: "none" }}>↓ Slide to Open ↓</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 28, textAlign: "center", zIndex: 2, position: "relative" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(.9rem,3vw,1.12rem)", color: "rgba(240,232,216,.44)" }}>Mukesh &amp; Reena</div>
              <div style={{ fontSize: ".44rem", letterSpacing: ".55em", color: "rgba(201,168,76,.3)", textTransform: "uppercase", marginTop: 6 }}>Silver Jubilee · 2001 – 2026</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [.16, 1, .3, 1] }}
            style={{ height: "100vh" }}
          >
            {/* Petals */}
            {petals.map(p => (
              <div key={p.id} style={{ position: "fixed", left: `${p.l}%`, top: 0, zIndex: 1, pointerEvents: "none", fontSize: `${p.sz}rem`, opacity: 0, animation: `pf ${p.d}s ${p.dl}s linear infinite` }}>{p.ch}</div>
            ))}

            <div ref={scrollerRef} className="sj-scroll" style={{ height: "100%", overflowY: "auto", overflowX: "hidden", position: "relative" }}>

              {/* §1 HERO */}
              <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "80px 24px 64px", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 28% 72%,#1E1470 0%,${DEEP} 50%,#040214 100%)` }}>
                <div ref={m1Ref} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "ms 125s linear infinite", pointerEvents: "none", zIndex: 0, opacity: .075, willChange: "transform" }}>
                  <MandalaPath size={660} c1={G} c2={SIL} />
                </div>
                <div ref={m2Ref} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "mr 82s linear infinite", pointerEvents: "none", zIndex: 0, opacity: .044, willChange: "transform" }}>
                  <MandalaPath size={350} c1={SIL} c2={G} />
                </div>
                {heroStars.map(s => (
                  <div key={s.id} style={{ position: "absolute", width: `${s.sz}px`, height: `${s.sz}px`, background: "white", borderRadius: "50%", top: `${s.t}%`, left: `${s.l}%`, animation: `tw ${s.d}s ${s.dl}s ease-in-out infinite` }} />
                ))}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} style={{ fontFamily: "serif", fontSize: "clamp(1.1rem,3.5vw,1.5rem)", color: "rgba(201,168,76,.5)", letterSpacing: ".1em", marginBottom: 18 }}>ॐ</motion.div>
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .9 }} style={{ ...SHIMMER, fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "clamp(6rem,20vw,13rem)", lineHeight: 1, marginBottom: -8 }}>25</motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45 }} style={{ fontSize: ".54rem", letterSpacing: ".74em", color: SIL, textTransform: "uppercase", marginBottom: 26 }}>Years of Togetherness</motion.div>
                  <Divider />
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .9 }} style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(2.8rem,9.5vw,6rem)", color: CREAM, lineHeight: 1.05 }}>
                    Mukesh
                    <span style={{ display: "block", fontStyle: "italic", color: G, fontSize: "clamp(1.4rem,5vw,3rem)", letterSpacing: ".1em", margin: "5px 0" }}>&amp;</span>
                    Reena
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 28, padding: "8px 32px", border: "1px solid rgba(184,196,216,.34)", borderRadius: 40, fontSize: ".52rem", letterSpacing: ".5em", color: SIL, textTransform: "uppercase", background: "rgba(255,255,255,.024)", fontFamily: "'Cinzel',serif", animation: "gwS 3.5s ease-in-out infinite" }}>✦ Silver Jubilee · 2001 – 2026 ✦</motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }} style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: MUTED, fontSize: "1.08rem", marginTop: 18 }}>Join us as we celebrate twenty-five luminous years</motion.div>
                  <div style={{ marginTop: 62, color: "rgba(201,168,76,.36)", fontSize: ".49rem", letterSpacing: ".46em", textTransform: "uppercase", animation: "fl 2.5s ease-in-out infinite" }}>Scroll to Explore ↓</div>
                </div>
              </section>

              {/* §2 QUOTE */}
              <section style={{ padding: "clamp(64px,11vh,130px) clamp(22px,7vw,88px)", background: `linear-gradient(155deg,${IVORY} 0%,${CREAM} 55%,#F4E8C2 100%)`, position: "relative", overflow: "hidden" }}>
                <BorderStrip top={true} />
                <BorderStrip top={false} />
                {[{ top: "-48px", left: "-48px" }, { top: "-48px", right: "-48px" }, { bottom: "-48px", right: "-48px" }].map((pos, i) => (
                  <div key={i} style={{ position: "absolute", ...pos, opacity: .065, pointerEvents: "none" }}><MandalaPath size={210} c1={MAR} c2={G} /></div>
                ))}
                <Reveal>
                  <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: "4.5rem", color: "rgba(74,14,26,.08)", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1, marginBottom: -22 }}>"</div>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(1.2rem,4.5vw,1.8rem)", fontWeight: 300, color: MAR, lineHeight: 1.7 }}>
                      Twenty-five years of waking up and choosing each other — every single morning, without exception. That is not just a love story. That is a masterpiece.
                    </p>
                    <Divider color={MAR} sym="◆" />
                    <div style={{ fontSize: ".52rem", letterSpacing: ".44em", color: G, textTransform: "uppercase", fontFamily: "'Cinzel',serif" }}>✦ A Silver Thread Woven in Gold ✦</div>
                  </div>
                </Reveal>
              </section>

              {/* §3 FILM STRIP */}
              <section style={{ background: DIM, borderTop: "1px solid rgba(201,168,76,.1)", overflow: "hidden", paddingTop: 52 }}>
                <Reveal>
                  <div style={{ textAlign: "center", marginBottom: 36, padding: "0 24px" }}>
                    <div style={{ fontFamily: "serif", fontSize: ".88rem", color: "rgba(201,168,76,.38)", letterSpacing: ".1em", marginBottom: 6 }}>ॐ</div>
                    <div style={{ fontSize: ".5rem", letterSpacing: ".52em", color: G, textTransform: "uppercase", marginBottom: 10, fontFamily: "'Cinzel',serif" }}>Twenty-Five Years of Memories</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,5.5vw,2.9rem)", color: CREAM, fontWeight: 300 }}>A Life <em style={{ color: G }}>Beautiful</em></div>
                    <Divider />
                  </div>
                </Reveal>
                <FilmStrip />
                <div style={{ height: 52 }} />
              </section>

              {/* §4 COUNTDOWN */}
              <section style={{ padding: "clamp(52px,8vh,88px) clamp(20px,5vw,60px)", background: DEEP, textAlign: "center", borderTop: "1px solid rgba(201,168,76,.1)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: .04, pointerEvents: "none" }}>
                  <MandalaPath size={500} c1={G} c2={SIL} />
                </div>
                <Reveal>
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: ".5rem", letterSpacing: ".52em", color: G, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Cinzel',serif" }}>Counting Every Heartbeat</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.7rem,5vw,2.8rem)", color: CREAM, fontWeight: 300, marginBottom: 6 }}>Until We <em style={{ color: G }}>Celebrate</em></div>
                    <Divider />
                    <div style={{ display: "flex", gap: "clamp(12px,3vw,24px)", justifyContent: "center", flexWrap: "wrap" }}>
                      <CdBox label="Days" val={countdown.d} />
                      <CdBox label="Hours" val={countdown.h} />
                      <CdBox label="Minutes" val={countdown.m} />
                      <CdBox label="Seconds" val={countdown.s} />
                    </div>
                  </div>
                </Reveal>
              </section>

              {/* §5 JOURNEY HORIZONTAL */}
              <section ref={tlSecRef} style={{ height: "360vh", position: "relative", borderTop: "1px solid rgba(201,168,76,.08)" }}>
                <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", background: `linear-gradient(180deg,${DIM} 0%,${DEEP} 100%)` }}>
                  <div style={{ position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 3, whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: ".47rem", letterSpacing: ".56em", color: G, textTransform: "uppercase", marginBottom: 6, fontFamily: "'Cinzel',serif" }}>Our Journey Together</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.1rem,3vw,2rem)", color: CREAM, fontStyle: "italic" }}>The Story So Far</div>
                    <div style={{ width: 34, height: 1, background: G, margin: "10px auto 0", opacity: .55 }} />
                  </div>
                  <div ref={tlTrackRef} style={{ display: "flex", gap: 40, padding: "0 80px", willChange: "transform", alignItems: "center", transition: "transform .06s linear" }}>
                    {journey.map((jn, idx) => (
                      <div key={idx} style={{ minWidth: 265, position: "relative", marginTop: idx % 2 === 0 ? 0 : 44 }}>
                        <div style={{ padding: "16px 16px 0", background: "linear-gradient(135deg,rgba(26,21,62,.96),rgba(12,8,30,.98))", border: "1px solid rgba(201,168,76,.26)", borderRadius: 4, boxShadow: "0 28px 78px rgba(0,0,0,.55)", position: "relative" }}>
                          <CornerOrnaments sz={18} color={G} op={.62} />
                          <div style={{ width: 233, height: 188, background: "linear-gradient(145deg,#1C1848,#241E52,#1A1640)", borderRadius: 2, border: "1px solid rgba(201,168,76,.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ opacity: .1, position: "absolute" }}><MandalaPath size={134} c1={G} c2={SIL} /></div>
                            <div style={{ zIndex: 1, textAlign: "center" }}>
                              <div style={{ fontSize: "2rem", color: "rgba(201,168,76,.22)" }}>✦</div>
                              <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".36rem", letterSpacing: ".28em", color: "rgba(184,196,216,.2)", textTransform: "uppercase", marginTop: 6 }}>Photo</div>
                            </div>
                          </div>
                          <div style={{ padding: "14px 4px 18px", textAlign: "center" }}>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.1rem", color: CREAM }}>{jn.label}</div>
                            <div style={{ fontSize: ".47rem", letterSpacing: ".32em", color: G, textTransform: "uppercase", marginTop: 4 }}>{jn.year}</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", color: MUTED, fontSize: ".84rem", marginTop: 4, fontStyle: "italic" }}>{jn.sub}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ minWidth: 62 }} />
                  </div>
                  <div style={{ position: "absolute", bottom: 60, left: "10%", right: "10%", height: 2, background: "rgba(201,168,76,.1)", borderRadius: 1 }}>
                    <div ref={tlProgRef} style={{ height: "100%", width: "0%", background: `linear-gradient(90deg,${G},${G2})`, borderRadius: 1, boxShadow: `0 0 8px rgba(201,168,76,.5)` }} />
                  </div>
                  <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, color: "rgba(200,200,216,.24)", fontSize: ".46rem", letterSpacing: ".44em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    <div style={{ width: 36, height: 1, background: "currentColor" }} />Scroll to journey through time<div style={{ width: 36, height: 1, background: "currentColor" }} />
                  </div>
                </div>
              </section>

              {/* §6 EVENT DETAILS */}
              <section style={{ padding: "clamp(64px,10vh,120px) clamp(20px,5vw,72px)", background: `linear-gradient(180deg,${CREAM} 0%,${IVORY} 100%)`, position: "relative", overflow: "hidden" }}>
                <BorderStrip top={true} />
                <BorderStrip top={false} />
                {[{ top: "-52px", left: "-52px" }, { top: "-52px", right: "-52px" }].map((pos, i) => (
                  <div key={i} style={{ position: "absolute", ...pos, opacity: .065, pointerEvents: "none" }}><MandalaPath size={250} c1={MAR} c2={G} /></div>
                ))}
                <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
                  <Reveal>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".54rem", letterSpacing: ".6em", color: G, textTransform: "uppercase", marginBottom: 10 }}>✦ A Royal Decree ✦</div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.9rem,5.5vw,3.3rem)", fontWeight: 600, color: MAR }}>Celebration Details</div>
                    <Divider color={MAR} sym="◆" />
                  </Reveal>
                  <Reveal delay={.15}>
                    <div style={{ background: "linear-gradient(160deg,rgba(250,244,228,.98),rgba(253,240,213,1))", border: "1px solid rgba(74,14,26,.14)", borderRadius: 6, padding: "clamp(26px,5vw,54px)", position: "relative", boxShadow: "0 48px 120px rgba(74,14,26,.09),inset 0 1px 0 rgba(201,168,76,.24)", animation: "uf .95s .2s both" }}>
                      <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: CREAM, padding: "0 14px", color: G, fontSize: ".85rem", lineHeight: 1 }}>◆</div>
                      <div style={{ position: "absolute", inset: 12, border: "1px solid rgba(74,14,26,.07)", borderRadius: 4, pointerEvents: "none" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 28 }}>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(74,14,26,.22))" }} />
                        <span style={{ color: G, fontSize: ".56rem", letterSpacing: ".3em" }}>✦ ✦ ✦</span>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(74,14,26,.22),transparent)" }} />
                      </div>
                      {events.map((ev, i) => (
                        <div key={i} style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: i < events.length - 1 ? "1px solid rgba(74,14,26,.09)" : "none", textAlign: "left" }}>
                          <div style={{ minWidth: 46, height: 46, borderRadius: "50%", border: "1px solid rgba(74,14,26,.26)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: MAR, fontSize: "1.05rem", background: "rgba(74,14,26,.04)" }}>{ev.ico}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: ".47rem", letterSpacing: ".38em", color: G, textTransform: "uppercase", marginBottom: 4, fontFamily: "'Cinzel',serif" }}>{ev.ey}</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.28rem", color: MAR, marginBottom: 6, fontWeight: 600 }}>{ev.ttl}</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: "rgba(74,14,26,.56)", fontSize: ".94rem", lineHeight: 1.68 }}>{ev.sub}</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 28 }}>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(74,14,26,.22))" }} />
                        <span style={{ color: G, fontSize: ".56rem", letterSpacing: ".3em" }}>✦</span>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(74,14,26,.22),transparent)" }} />
                      </div>
                    </div>
                  </Reveal>
                </div>
              </section>

              {/* §7 RSVP */}
              <section style={{ padding: "clamp(56px,9vh,108px) clamp(20px,5vw,68px) 76px", background: `radial-gradient(ellipse at 50% 0%,rgba(201,168,76,.04) 0%,transparent 65%),${DEEP}`, position: "relative", overflow: "hidden" }}>
                {[{ top: "-42px", left: "-42px" }, { top: "-42px", right: "-42px" }, { bottom: "-42px", left: "-42px" }, { bottom: "-42px", right: "-42px" }].map((pos, i) => (
                  <div key={i} style={{ position: "absolute", ...pos, opacity: .054, pointerEvents: "none" }}><MandalaPath size={210} c1={G} c2={SIL} /></div>
                ))}
                <div style={{ maxWidth: 510, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
                  <Reveal>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: ".52rem", letterSpacing: ".6em", color: G, textTransform: "uppercase", marginBottom: 12 }}>Your Response is Requested</div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.8rem,5.5vw,3.2rem)", fontWeight: 600, color: CREAM }}>RSVP</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: MUTED, fontSize: "1rem", marginTop: 8, marginBottom: 32 }}>Kindly respond by 15th June 2026</div>
                  </Reveal>
                  <Reveal delay={.12}>
                    <div style={{ background: "linear-gradient(135deg,rgba(26,21,66,.93),rgba(14,10,44,.97))", border: "1px solid rgba(201,168,76,.26)", borderRadius: 6, padding: "36px 30px", position: "relative", boxShadow: "0 18px 60px rgba(0,0,0,.52),inset 0 1px 0 rgba(201,168,76,.18)" }}>
                      <CornerOrnaments sz={18} color={G} op={.58} />
                      {rsvpDone ? (
                        <div style={{ textAlign: "center", padding: "24px 0", position: "relative" }}>
                          <Sparkles sparks={sparks} show={showSpark} />
                          <motion.div initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} style={{ fontSize: "2.8rem", marginBottom: 16 }}>✨</motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", color: CREAM, marginBottom: 10 }}>Thank you, {rsvp.name.trim()}!</motion.div>
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: MUTED, fontSize: ".98rem" }}>Your response has been received.<br />We cannot wait to celebrate with you.</motion.div>
                          <Divider />
                          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: G, fontSize: ".94rem" }}>With all our love, Mukesh &amp; Reena</div>
                        </div>
                      ) : (
                        <div style={{ textAlign: "left" }}>
                          {[
                            { id: "rName", lbl: "Full Name", type: "text", ph: "Your full name", val: rsvp.name, onChange: e => setRsvp(r => ({ ...r, name: e.target.value })) },
                            { id: "rGuests", lbl: "Number of Guests", type: "number", ph: "Including yourself", val: rsvp.guests, onChange: e => setRsvp(r => ({ ...r, guests: e.target.value })), extra: { min: 1, max: 10 } },
                          ].map(f => (
                            <div key={f.id} style={{ marginBottom: 20 }}>
                              <label style={{ display: "block", fontSize: ".47rem", letterSpacing: ".36em", color: G, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Cinzel',serif" }}>{f.lbl}</label>
                              <input className="sj-input" type={f.type} placeholder={f.ph} value={f.val} onChange={f.onChange} {...(f.extra || {})} />
                            </div>
                          ))}
                          <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: ".47rem", letterSpacing: ".36em", color: G, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Cinzel',serif" }}>Will You Join Us?</label>
                            <select className="sj-input" value={rsvp.attendance} onChange={e => setRsvp(r => ({ ...r, attendance: e.target.value }))}>
                              <option value="">Please select…</option>
                              <option value="yes">With Bells On — I'll Be There!</option>
                              <option value="no">Celebrating from Afar</option>
                            </select>
                          </div>
                          <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", fontSize: ".47rem", letterSpacing: ".36em", color: G, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Cinzel',serif" }}>Leave a Blessing</label>
                            <textarea className="sj-input" rows={4} placeholder="Your warm wishes & blessings…" value={rsvp.blessing} onChange={e => setRsvp(r => ({ ...r, blessing: e.target.value }))} />
                          </div>
                          <div style={{ textAlign: "center", position: "relative" }}>
                            <Sparkles sparks={sparks} show={showSpark} />
                            <button onClick={submitRsvp} style={{
                              width: 94, height: 94, borderRadius: "50%",
                              background: `radial-gradient(circle at 35% 28%,${G3},${G} 40%,#8B6914 74%,#6A4E0E)`,
                              border: "3px solid rgba(255,255,255,.18)", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              margin: "0 auto", position: "relative",
                              boxShadow: `0 6px 28px rgba(0,0,0,.55),0 0 44px rgba(201,168,76,.28)`,
                              animation: sealAnim ? "sd .55s cubic-bezier(.36,.07,.19,.97)" : "gw 3.1s ease-in-out infinite",
                            }}>
                              <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
                                <circle cx="27" cy="27" r="23" stroke="#3A2800" strokeWidth="1" opacity=".56" />
                                <circle cx="27" cy="27" r="18" stroke="#3A2800" strokeWidth=".7" opacity=".36" />
                                {Array.from({ length: 8 }, (_, i) => (
                                  <line key={i} x1={27 + 18 * Math.sin(i * Math.PI / 4)} y1={27 - 18 * Math.cos(i * Math.PI / 4)} x2={27 + 23 * Math.sin(i * Math.PI / 4)} y2={27 - 23 * Math.cos(i * Math.PI / 4)} stroke="#3A2800" strokeWidth="1" opacity=".42" />
                                ))}
                                <text x="27" y="25" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="7.5" fill="#3A2800" opacity=".92" fontStyle="italic">M &amp; R</text>
                                <text x="27" y="33.5" textAnchor="middle" fontFamily="serif" fontSize="5.5" fill="#3A2800" opacity=".6">2001 – 2026</text>
                              </svg>
                            </button>
                            <div style={{ marginTop: 12, fontSize: ".44rem", letterSpacing: ".42em", color: "rgba(184,196,216,.36)", textTransform: "uppercase", fontFamily: "'Cinzel',serif" }}>Press the Seal to Confirm</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Reveal>
                </div>
              </section>

              {/* FOOTER */}
              <footer style={{ padding: "56px 24px 48px", textAlign: "center", background: `linear-gradient(0deg,#030110 0%,${DEEP} 100%)`, borderTop: "1px solid rgba(201,168,76,.1)", position: "relative" }}>
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: DEEP, padding: "0 18px", color: G, fontSize: ".68rem", lineHeight: 1 }}>◆</div>
                <div style={{ opacity: .07, display: "flex", justifyContent: "center", marginBottom: 30 }}><MandalaPath size={124} c1={G} c2={SIL} /></div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontWeight: 300, fontSize: "1.38rem", color: CREAM, marginBottom: 6 }}>With all our love,</div>
                <div style={{ ...SHIMMER, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(1.7rem,5.5vw,2.8rem)" }}>Mukesh &amp; Reena</div>
                <Divider />
                <div style={{ fontFamily: "serif", fontSize: "clamp(.85rem,2.5vw,.98rem)", color: "rgba(201,168,76,.42)", letterSpacing: ".1em", margin: "10px 0" }}>ॐ तत् सत् · सर्वे भवन्तु सुखिनः</div>
                <div style={{ fontSize: ".47rem", letterSpacing: ".52em", color: "rgba(184,196,216,.25)", textTransform: "uppercase", fontFamily: "'Cinzel',serif" }}>Silver Jubilee · 2001 – 2026 · Jaipur, Rajasthan</div>
              </footer>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
