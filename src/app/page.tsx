"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Gamepad2,
  Mountain,
  Zap,
  Leaf,
  ShieldCheck,
  PlugZap,
  Car,
  Star,
  Check,
  Lock,
  Plus,
} from "lucide-react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:          "#000000",
  w100:        "rgba(255,255,255,1)",
  w80:         "rgba(255,255,255,0.80)",
  w72:         "rgba(255,255,255,0.72)",
  w55:         "rgba(255,255,255,0.55)",
  w42:         "rgba(255,255,255,0.42)",
  w38:         "rgba(255,255,255,0.38)",
  w18:         "rgba(255,255,255,0.18)",
  w12:         "rgba(255,255,255,0.12)",
  w08:         "rgba(255,255,255,0.08)",
  w06:         "rgba(255,255,255,0.06)",
  w04:         "rgba(255,255,255,0.04)",
  accent:      "#00E573",
  accentDim:   "rgba(0,229,115,0.12)",
  accentBorder:"rgba(0,229,115,0.25)",
  glass:       "rgba(255,255,255,0.07)",
  glassBorder: "rgba(255,255,255,0.12)",
};

const D: React.CSSProperties = {
  fontFamily: "var(--font-faktum), Faktum, sans-serif",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
};
const B: React.CSSProperties = {
  fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
};
const M: React.CSSProperties = {
  fontFamily: "var(--font-faktum), Faktum, sans-serif",
  fontWeight: 500,
  textTransform: "uppercase" as const,
  letterSpacing: "0.22em",
};

const spring = "cubic-bezier(0.16,1,0.3,1)";

// ─── useScrollReveal ──────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useScrollReveal(0.08);
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── useIsMobile ──────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const check = () => setMob(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  return mob;
}

// ─── useCountdown ─────────────────────────────────────────────────────────────
function useCountdown() {
  const [secs, setSecs] = useState(1 * 3600 + 38 * 60 + 51);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 3600), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: String(Math.floor(secs / 3600)).padStart(2, "0"),
    m: String(Math.floor((secs % 3600) / 60)).padStart(2, "0"),
    s: String(secs % 60).padStart(2, "0"),
  };
}

// ─── CountdownBar ─────────────────────────────────────────────────────────────
function CountdownBar() {
  const { h, m, s } = useCountdown();
  const isMobile = useIsMobile();

  const pill: React.CSSProperties = {
    position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
    zIndex: 100,
    background: C.glass, border: `1px solid ${C.glassBorder}`,
    borderRadius: 999,
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
  };

  const Timer = () => (
    <>
      {[h, m, s].map((val, i) => (
        <span key={i} style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ ...D, fontSize: isMobile ? 30 : 17, color: C.w100, lineHeight: 1, letterSpacing: "-0.01em" }}>{val}</span>
          <span style={{ ...M, fontSize: isMobile ? 10 : 7, color: C.w42, letterSpacing: "0.14em" }}>{["H","M","S"][i]}</span>
          {i < 2 && <span style={{ ...D, fontSize: isMobile ? 20 : 13, color: C.w18, margin: "0 3px" }}>:</span>}
        </span>
      ))}
    </>
  );

  if (isMobile) {
    return (
      <div style={{ ...pill, borderRadius: 10, padding: "8px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 250 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/koham-logo.webp" alt="KOHAM" style={{ height: 14, width: "auto", objectFit: "contain" }} />
          <div style={{ width: 1, height: 12, background: C.w12 }} />
          <span style={{ ...M, fontSize: 8, color: C.w55, letterSpacing: "0.16em" }}>LIMITED STOCK</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><Timer /></div>
      </div>
    );
  }

  return (
    <div style={{ ...pill, padding: "9px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/koham-logo.webp" alt="KOHAM" style={{ height: 18, width: "auto", objectFit: "contain" }} />
      <div style={{ width: 1, height: 14, background: C.w12 }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><Timer /></div>
      <div style={{ width: 1, height: 14, background: C.w12 }} />
      <span style={{ ...M, fontSize: 9, color: C.w72, whiteSpace: "nowrap" }}>LIMITED STOCK</span>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: 68,
      pointerEvents: "none",
    }} />
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HLS_SRC = "https://customer-siyy2ilzb5oakkgv.cloudflarestream.com/cc3c2afc95aef6545bacfa5f04f010ea/manifest/video.m3u8";
const VJS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/video.js/7.10.2/video.min.js";

function Hero() {
  const [vis, setVis] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  useEffect(() => { setVis(true); }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initVjs = (vjs: any) => {
      if (playerRef.current) return;
      playerRef.current = vjs("hero-video-bg", {
        autoplay: "muted",
        loop: true,
        controls: false,
        fill: true,
        fluid: false,
        aspectRatio: undefined,
        sources: [{ src: HLS_SRC, type: "application/x-mpegURL" }],
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).videojs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initVjs((window as any).videojs);
    } else if (!document.getElementById("vjs-script")) {
      const s = document.createElement("script");
      s.id = "vjs-script";
      s.src = VJS_SRC;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      s.onload = () => initVjs((window as any).videojs);
      document.head.appendChild(s);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const fu = (delay: number): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 900ms ${spring} ${delay}ms, transform 900ms ${spring} ${delay}ms`,
  });

  return (
    <section style={{ position: "relative", minHeight: 760, maxHeight: 760, overflow: "hidden", background: "#000" }}>
      {/* Video background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <video id="hero-video-bg" className="video-js vjs-hero" playsInline />
        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 20%, rgba(0,0,0,0.72) 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, #000, transparent)" }} />
      </div>

      {/* Content */}
      <div className="r-heropad" style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: 760, maxHeight: 760, padding: "100px 32px 72px", textAlign: "center",
      }}>
        <div style={{ ...fu(100), ...M, fontSize: 9, color: C.w55, marginBottom: 28 }}>
          PROFESSIONAL TECHNOLOGY · AVAILABLE IN THE USA
        </div>

        <h1 style={{
          ...fu(220), ...D,
          fontSize: "clamp(34px, 6vw, 52px)",
          lineHeight: 0.96, letterSpacing: "-0.03em",
          color: C.w100, margin: 0, maxWidth: 780,
        }}>
          THE ROBOT THAT <span style={{ color: C.w55 }}>DESTROYS</span> ANY OVERGROWTH
        </h1>

        <p style={{ ...fu(360), ...B, fontSize: 16, lineHeight: 1.65, color: C.w55, maxWidth: 480, margin: "24px auto 0" }}>
          Does in <strong style={{ color: C.w80 }}>1 hour</strong> what{" "}
          <strong style={{ color: C.w80 }}>10 workers</strong> would take
          all day. No physical effort. No risk. No gas.
        </p>

        <div style={{ ...fu(420), display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 40 }}>
          <div style={{ ...M, fontSize: 8, color: C.accent, letterSpacing: "0.2em", marginBottom: 4 }}>SPECIAL LAUNCH OFFER</div>
          <div style={{ ...B, fontSize: 11, color: C.w38, textDecoration: "line-through" }}>Was: $997.00</div>
          <div style={{ ...D, fontSize: 28, lineHeight: 1, letterSpacing: "-0.03em", color: C.w100, marginBottom: 8 }}>$297.00</div>
        </div>

        <div style={{ ...fu(460), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <a href="#offer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "15px 36px",
            background: C.accent, color: "#001A0A",
            borderRadius: 999,
            ...B, fontSize: 13, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em",
            textDecoration: "none",
            transition: `background 200ms`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00cc66"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
          >
            GET MINE NOW
          </a>
          <div style={{ ...B, fontSize: 12, color: C.w38, display: "flex", alignItems: "center", gap: 6 }}>
            <Lock size={12} color={C.w38} strokeWidth={1.5} />
            Free shipping · Secure payment
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ children, style, id }: { children: React.ReactNode; style?: React.CSSProperties; id?: string }) {
  return (
    <section id={id} className="r-section" style={{ padding: "100px 0", borderTop: `1px solid ${C.w06}`, ...style }}>
      <div className="r-inner" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div style={{ ...M, fontSize: 9, color: C.w42, marginBottom: 20 }}>{children}</div>;
}


// ─── CloudflareVideo ──────────────────────────────────────────────────────────
function CloudflareVideo({ id, src }: { id: string; src: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const init = (vjs: any) => {
      if (playerRef.current) return;
      playerRef.current = vjs(id, {
        autoplay: "muted", loop: true, controls: false,
        fill: true, fluid: false, aspectRatio: undefined,
        sources: [{ src, type: "application/x-mpegURL" }],
      });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).videojs) { init((window as any).videojs); }
    else if (!document.getElementById("vjs-script")) {
      const s = document.createElement("script");
      s.id = "vjs-script"; s.src = VJS_SRC;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      s.onload = () => init((window as any).videojs);
      document.head.appendChild(s);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = setInterval(() => { if ((window as any).videojs) { clearInterval(t); init((window as any).videojs); } }, 50);
      return () => clearInterval(t);
    }
    return () => { if (playerRef.current) { playerRef.current.dispose(); playerRef.current = null; } };
  }, [id, src]);
  return <video id={id} className="video-js vjs-card" playsInline />;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS_HLS = "https://customer-siyy2ilzb5oakkgv.cloudflarestream.com/6faf3bbc86d41f5d327ce6f05eb5c263/manifest/video.m3u8";

function Stats() {
  const isMobile = useIsMobile();
  const items = [
    { value: "10×", label: "Faster than manual labor" },
    { value: "0%",  label: "Physical effort required" },
    { value: "45°", label: "Maximum slope supported" },
    { value: "4h",  label: "Battery life per full charge" },
  ];
  return (
    <Section style={{ borderTop: "none" }}>
      {isMobile ? (
        /* ── Mobile: text → video → stats → button ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Eyebrow>THE SOLUTION</Eyebrow>
              <h2 style={{ ...D, fontSize: "clamp(30px,3vw,44px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: "0 0 16px" }}>
                MEET THE MOWER<br /><span style={{ color: C.w55 }}>THAT WORKS FOR YOU</span>
              </h2>
              <p style={{ ...B, fontSize: 14, color: C.w55, lineHeight: 1.75, margin: 0 }}>
                KOHAM is a remote-controlled robotic mower with long-range precision. You stay standing, safe, and in control — while it tears through the toughest overgrowth: slopes, flooded terrain, roadsides, orchards, and open land.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.glassBorder}`, aspectRatio: "3/4", background: "#080808" }}>
              <CloudflareVideo id="stats-video" src={STATS_HLS} />
              <div style={{ position: "absolute", bottom: 14, left: 14, padding: "5px 12px", background: "rgba(0,0,0,0.60)", backdropFilter: "blur(12px)", borderRadius: 999, border: `1px solid ${C.w08}`, ...M, fontSize: 8, color: C.w55 }}>KOHAM IN ACTION</div>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.w06, borderRadius: 16, overflow: "hidden" }}>
            {items.map((item, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ padding: "28px 16px", background: C.bg, textAlign: "center", height: "100%" }}>
                  <div style={{ ...D, fontSize: 36, lineHeight: 0.9, letterSpacing: "-0.04em", color: C.w100, marginBottom: 8 }}>{item.value}</div>
                  <div style={{ ...B, fontSize: 11, color: C.w42, lineHeight: 1.5 }}>{item.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a href="#offer" style={{
                display: "inline-flex", alignItems: "center",
                padding: "15px 36px",
                background: C.accent, color: "#001A0A",
                borderRadius: 999,
                ...B, fontSize: 13, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em",
                textDecoration: "none", transition: "background 200ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#00cc66"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
              >GET MINE NOW</a>
            </div>
          </Reveal>
        </div>
      ) : (
        /* ── Desktop: video left, text+stats right ── */
        <div style={{ display: "grid", gridTemplateColumns: "0.72fr 1fr", gap: 64, alignItems: "center" }}>
          <Reveal delay={120}>
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.glassBorder}`, aspectRatio: "3/4", background: "#080808" }}>
              <CloudflareVideo id="stats-video" src={STATS_HLS} />
              <div style={{ position: "absolute", bottom: 14, left: 14, padding: "5px 12px", background: "rgba(0,0,0,0.60)", backdropFilter: "blur(12px)", borderRadius: 999, border: `1px solid ${C.w08}`, ...M, fontSize: 8, color: C.w55 }}>KOHAM IN ACTION</div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <Eyebrow>THE SOLUTION</Eyebrow>
              <h2 style={{ ...D, fontSize: "clamp(30px,3vw,44px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: "0 0 16px" }}>
                MEET THE MOWER<br /><span style={{ color: C.w55 }}>THAT WORKS FOR YOU</span>
              </h2>
              <p style={{ ...B, fontSize: 14, color: C.w55, lineHeight: 1.75, margin: "0 0 32px" }}>
                KOHAM is a remote-controlled robotic mower with long-range precision. You stay standing, safe, and in control — while it tears through the toughest overgrowth: slopes, flooded terrain, roadsides, orchards, and open land.
              </p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.w06, borderRadius: 16, overflow: "hidden" }}>
              {items.map((item, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div style={{ padding: "32px 24px", background: C.bg, textAlign: "center", height: "100%" }}>
                    <div style={{ ...D, fontSize: 40, lineHeight: 0.9, letterSpacing: "-0.04em", color: C.w100, marginBottom: 10 }}>{item.value}</div>
                    <div style={{ ...B, fontSize: 12, color: C.w42, lineHeight: 1.5 }}>{item.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <div style={{ marginTop: 28 }}>
                <CtaBtn />
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { Icon: Gamepad2,    img: "/features/controle-remoto.webp",    imgPos: "center center", title: "Remote Control",                body: "Operate from up to 100 meters away with zero physical exposure. Full control, zero risk.",                                                              span: 1 },
    { Icon: Mountain,    img: "/features/todo-terreno.webp",       imgPos: "center center", title: "All Terrain",                   body: "Slopes up to 45°, rocks, roots, and flooded ground. Nothing stops the KOHAM.",                                                                    span: 1 },
    { Icon: Zap,         img: "/features/eletrico.webp",           imgPos: "center center", title: "100% Electric",                 body: "Silent motor, no gas, no fumes, no complex maintenance.",                                                                                         span: 1 },
    { Icon: Leaf,        img: "/features/laminas.webp",            imgPos: "center center", title: "Professional Blades",           body: "High-resistance stainless steel. Cuts dense brush, bamboo, elephant grass, and cane.",                                                             span: 2 },
    { Icon: PlugZap,     img: "/features/rotacao-360.webp",        imgPos: "center bottom", title: "360° Zero Blind Spot Rotation", body: "Pivots on its own axis. Reaches corners, edges, and obstacles any other mower would leave behind.",                                               span: 1 },
    { Icon: ShieldCheck, img: "/features/construcao-robusta.webp", imgPos: "center center", title: "Heavy-Duty Build",              body: "IP67 rated against dust and water. Carbon steel chassis with anti-corrosion coating.",                                                              span: 1 },
  ];
  return (
    <Section style={{ borderTop: "none", background: "#0d0d0d" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>TECHNOLOGY</Eyebrow>
          <h2 style={{ ...D, fontSize: "clamp(28px,3.5vw,52px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: 0 }}>
            TECHNOLOGY NO MANUAL <span style={{ color: C.w55 }}>MOWER CAN MATCH</span>
          </h2>
        </div>
      </Reveal>
      <div className="r-1col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {features.map(({ Icon, img, imgPos, title, body, span }, i) => (
          <Reveal key={i} delay={i * 55}>
            <div className="r-fullcol" style={{
              gridColumn: `span ${span}`,
              padding: "0",
              background: C.glass,
              border: `1px solid ${C.glassBorder}`,
              borderRadius: 16,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              transition: `background 250ms, border-color 250ms`,
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = C.w18; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.glass; e.currentTarget.style.borderColor = C.glassBorder; }}
            >
              {/* Image */}
              <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: "14px 14px 0 0", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={title}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: imgPos, display: "block", transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                />
              </div>
              {/* Content */}
              <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                <Icon size={20} color={C.w42} strokeWidth={1.5} style={{ marginBottom: 14 }} />
                <div style={{ ...D, fontSize: 15, letterSpacing: "-0.01em", color: C.w100, marginBottom: 8 }}>{title}</div>
                <div style={{ ...B, fontSize: 13, color: C.w55, lineHeight: 1.7 }}>{body}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Showcase ─────────────────────────────────────────────────────────────────
const HOW_HLS = "https://customer-siyy2ilzb5oakkgv.cloudflarestream.com/d8ae423885954643b30e6aad962ad21d/manifest/video.m3u8";

const CtaBtn = () => (
  <a href="#offer" style={{
    display: "inline-flex", alignItems: "center",
    padding: "14px 32px",
    background: C.accent, color: "#001A0A",
    borderRadius: 999,
    ...B, fontSize: 13, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em",
    textDecoration: "none", transition: "background 200ms",
  }}
    onMouseEnter={e => { e.currentTarget.style.background = "#00cc66"; }}
    onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
  >GET MINE NOW</a>
);

function Showcase() {
  const isMobile = useIsMobile();
  const bullets = [
    ["High-power motor",      "Cuts brush up to 6.5 ft tall"],
    ["100m remote range",     "Operate without exposing anyone to risk"],
    ["Reinforced chassis",    "Carbon steel with anti-corrosion protection"],
    ["Zero fuel",             "100% electric — minimal operating cost"],
  ];
  const ref = useScrollReveal(0.1);

  const VideoBlock = () => (
    <Reveal delay={120}>
      <div style={{
        aspectRatio: "3/4", borderRadius: 20,
        background: "#080808", border: `1px solid ${C.glassBorder}`,
        overflow: "hidden", position: "relative",
      }}>
        <CloudflareVideo id="showcase-video" src={HOW_HLS} />
        <div style={{
          position: "absolute", bottom: 16, left: 16,
          padding: "5px 14px",
          background: "rgba(0,0,0,0.60)", backdropFilter: "blur(12px)",
          borderRadius: 999, border: `1px solid ${C.w08}`,
          ...M, fontSize: 8, color: C.w55,
        }}>
          KOHAM IN ACTION
        </div>
      </div>
    </Reveal>
  );

  return (
    <Section>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div ref={ref} className="reveal">
            <Eyebrow>PERFORMANCE</Eyebrow>
            <h2 style={{ ...D, fontSize: "clamp(26px,3vw,44px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: "0 0 20px" }}>
              THE NUMBERS BEHIND<br />THE RAW POWER
            </h2>
            <p style={{ ...B, fontSize: 15, color: C.w55, lineHeight: 1.7, marginBottom: 28 }}>
              Built for terrain that no conventional machine can handle.
              Extreme slopes, dense vegetation, and rocks are not a problem.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {bullets.map(([t, s], i) => (
                <Reveal key={i} delay={i * 70}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      background: C.accentDim, border: `1px solid ${C.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <Check size={10} color={C.accent} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ ...B, fontSize: 14, fontWeight: 600, color: C.w80 }}>{t}</div>
                      <div style={{ ...B, fontSize: 13, color: C.w42, marginTop: 2 }}>{s}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <VideoBlock />
          <Reveal delay={80}>
            <CtaBtn />
          </Reveal>
        </div>
      ) : (
        <div className="r-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div ref={ref} className="reveal">
            <Eyebrow>PERFORMANCE</Eyebrow>
            <h2 style={{ ...D, fontSize: "clamp(26px,3vw,44px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: "0 0 20px" }}>
              THE NUMBERS BEHIND<br />THE RAW POWER
            </h2>
            <p style={{ ...B, fontSize: 15, color: C.w55, lineHeight: 1.7, marginBottom: 36 }}>
              Built for terrain that no conventional machine can handle.
              Extreme slopes, dense vegetation, and rocks are not a problem.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {bullets.map(([t, s], i) => (
                <Reveal key={i} delay={i * 70}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      background: C.accentDim, border: `1px solid ${C.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <Check size={10} color={C.accent} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ ...B, fontSize: 14, fontWeight: 600, color: C.w80 }}>{t}</div>
                      <div style={{ ...B, fontSize: 13, color: C.w42, marginTop: 2 }}>{s}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <div style={{ marginTop: 32 }}>
                <CtaBtn />
              </div>
            </Reveal>
          </div>
          <VideoBlock />
        </div>
      )}
    </Section>
  );
}

// ─── BusinessOpp ──────────────────────────────────────────────────────────────
function BusinessOpp() {
  const models = [
    {
      label: "Entry model",
      highlight: "$300/day",
      monthly: "≈ $6,000/mo",
      detail: "1 property per day · 20 working days",
      payback: "Break even in ~3 weeks",
    },
    {
      label: "Growth model",
      highlight: "$600/day",
      monthly: "≈ $12,000/mo",
      detail: "2 properties per day · Lean crew",
      payback: "Break even in ~2 weeks",
    },
    {
      label: "Recurring model",
      highlight: "$1,800/mo",
      monthly: "per fixed contract",
      detail: "Monthly service for HOAs or ranches",
      payback: "Guaranteed recurring income",
    },
  ];
  return (
    <Section>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Eyebrow>RETURN ON INVESTMENT</Eyebrow>
          <h2 style={{ ...D, fontSize: "clamp(28px,3.5vw,52px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: 0 }}>
            YOU DON&apos;T NEED LAND<br /><span style={{ color: C.w55 }}>TO MAKE MONEY WITH KOHAM</span>
          </h2>
        </div>
      </Reveal>
      <div className="r-1col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {models.map((m, i) => (
          <Reveal key={i} delay={i * 80}>
            <div style={{
              padding: "36px 28px",
              background: C.glass, border: `1px solid ${C.glassBorder}`,
              borderRadius: 16, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              transition: `background 250ms, border-color 250ms`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = C.w18; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.glass; e.currentTarget.style.borderColor = C.glassBorder; }}
            >
              <div style={{ ...M, fontSize: 9, color: C.w38, marginBottom: 16 }}>{m.label}</div>
              <div style={{ ...D, fontSize: 36, lineHeight: 0.9, letterSpacing: "-0.03em", color: C.accent, marginBottom: 4 }}>{m.highlight}</div>
              <div style={{ ...D, fontSize: 18, lineHeight: 1, letterSpacing: "-0.02em", color: C.w80, marginBottom: 20 }}>{m.monthly}</div>
              <div style={{ width: "100%", height: 1, background: C.w06, marginBottom: 20 }} />
              <div style={{ ...B, fontSize: 13, color: C.w55, lineHeight: 1.6, marginBottom: 12 }}>{m.detail}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Check size={12} color={C.accent} strokeWidth={2.5} />
                <span style={{ ...B, fontSize: 12, color: C.accent }}>{m.payback}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Price ────────────────────────────────────────────────────────────────────
function PriceSection() {
  const perks = [
    "Official invoice included with every order",
    "Dedicated English-language support team",
    "Multiple secure payment methods accepted",
    "Invoice and English-language support included",
  ];
  return (
    <Section id="offer">
      <div className="r-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <Reveal>
          <Eyebrow>LAUNCH OFFER</Eyebrow>
          <h2 style={{ ...D, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: "0 0 18px" }}>
            EVERYTHING YOU<br /><span style={{ color: C.w55 }}>NEED TODAY</span>
          </h2>
          <p style={{ ...B, fontSize: 15, color: C.w55, lineHeight: 1.65, margin: "0 0 36px" }}>
            Limited stock. When it&apos;s gone, the price goes back to $997.00.
            Save over $700 on the launch price.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {perks.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Check size={14} color={C.accent} strokeWidth={2.5} />
                  <span style={{ ...B, fontSize: 14, color: C.w72 }}>{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div style={{ position: "relative", paddingTop: 80 }}>
            {/* Kit image floating above card */}
            <div style={{
              position: "absolute", top: 0, left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              width: 300,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/koham-kit.webp"
                alt="KOHAM Kit"
                style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }}
              />
            </div>
          <div style={{
            padding: "230px 40px 40px",
            background: C.glass,
            border: `1px solid ${C.glassBorder}`,
            borderRadius: 24,
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
          }}>
            {/* Kit included */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...M, fontSize: 9, color: C.w38, marginBottom: 14 }}>WHAT&apos;S INCLUDED</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "KOHAM Robotic Mower",
                  "KOHAM Remote Control",
                  "Full user manual",
                  "Technical support",
                  "Free shipping",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={13} color={C.accent} strokeWidth={2.5} />
                    <span style={{ ...B, fontSize: 13, color: C.w72 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width: "100%", height: 1, background: C.w08, marginBottom: 24 }} />
            <div style={{ ...M, fontSize: 9, color: C.w42, marginBottom: 24 }}>LAUNCH PRICE</div>
            <div style={{ ...B, fontSize: 13, color: C.w38, textDecoration: "line-through", marginBottom: 4 }}>
              Was: $997.00
            </div>
            <div style={{ ...D, fontSize: 56, lineHeight: 0.9, letterSpacing: "-0.04em", color: C.w100, marginBottom: 8 }}>
              $297.00
            </div>
            <div style={{ marginBottom: 32 }} />
            <a href="#buy" id="comprar" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "16px 32px",
              background: C.accent, color: "#001A0A",
              borderRadius: 999,
              ...B, fontSize: 13, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em",
              textDecoration: "none",
              transition: `background 200ms`,
              marginBottom: 16,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#00cc66"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
            >
              GET MINE NOW
            </a>
            <div style={{ ...B, fontSize: 12, color: C.w38, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Lock size={12} color={C.w38} strokeWidth={1.5} />
              Free shipping · 100% secure payment
            </div>
          </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    {
      img: "/testimonials/dep1.webp",
      name: "Ryan Caldwell",
      role: "Homeowner · Columbus, OH",
      body: "I ran the KOHAM myself with zero training. Stood in my backyard, steered it with the remote through every corner — it kept cutting without jamming once. The grass was thick with roots and it just powered right through. Best Saturday morning I've had in years.",
    },
    {
      img: "/testimonials/dep2.webp",
      name: "Derek Hawthorne",
      role: "Property Owner · Indianapolis, IN",
      body: "Set the KOHAM on the front lawn and operated the remote from inside the gate. The range is insane — I controlled it the whole time without stepping out of the shade. It worked row by row while I just steered. My neighbor literally called me to ask what that thing was.",
    },
    {
      img: "/testimonials/dep3.webp",
      name: "Marcus Webb",
      role: "Lawn Service Pro · Nashville, TN",
      body: "I use the KOHAM for commercial lot cleanups. The remote lets me guide it from a safe distance every time. The cut is so clean and even I showed my client the grass right in my hand — he renewed the contract on the spot. Paid off my investment in under a month.",
    },
  ];
  return (
    <Section>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>CUSTOMERS</Eyebrow>
          <h2 style={{ ...D, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: 0 }}>
            ONCE YOU GO KOHAM<br /><span style={{ color: C.w55 }}>YOU NEVER GO BACK.</span>
          </h2>
        </div>
      </Reveal>
      <div className="r-1col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {reviews.map((r, i) => (
          <Reveal key={i} delay={i * 90}>
            <div style={{
              background: C.glass, border: `1px solid ${C.glassBorder}`,
              borderRadius: 16, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              transition: `background 250ms, border-color 250ms`,
              overflow: "hidden", display: "flex", flexDirection: "column",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = C.w18; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.glass; e.currentTarget.style.borderColor = C.glassBorder; }}
            >
              {/* Photo */}
              <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", flexShrink: 0, borderRadius: "14px 14px 0 0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.img}
                  alt={r.name}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                />
              </div>
              {/* Content */}
              <div style={{ padding: "24px 28px 28px" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[0,1,2,3,4].map(j => <Star key={j} size={12} color={C.accent} fill={C.accent} strokeWidth={0} />)}
                </div>
                <p style={{ ...B, fontSize: 13, color: C.w55, lineHeight: 1.75, margin: "0 0 20px", fontStyle: "italic" }}>
                  &ldquo;{r.body}&rdquo;
                </p>
                <div style={{ ...B, fontSize: 13, fontWeight: 600, color: C.w80 }}>{r.name}</div>
                <div style={{ ...M, fontSize: 9, color: C.w38, marginTop: 4 }}>{r.role}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "Who can operate the KOHAM?",          a: "Anyone. The remote control is intuitive — no technical training required. You'll be operating it confidently within minutes." },
    { q: "Does it work on slopes?",             a: "Yes. The KOHAM handles up to 45° inclines — hills, embankments, and rough terrain where tractors can't reach." },
    { q: "How long does the battery last?",     a: "Up to 4 hours of continuous operation. A full charge takes approximately 2 to 3 hours." },
    { q: "Does it require frequent maintenance?", a: "No. Without a combustion engine, there are no filters, spark plugs, or carburetors. Just sharpen the blades once a season." },
    { q: "Does it ship with documentation?",    a: "Yes. Every KOHAM ships with a full user manual, invoice, and complete documentation." },
    { q: "What is the delivery timeframe?",     a: "3 to 10 business days depending on your location. Shipping is always free — anywhere in the United States." },
  ];
  return (
    <Section>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Eyebrow>FREQUENTLY ASKED QUESTIONS</Eyebrow>
          <h2 style={{ ...D, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 0.97, letterSpacing: "-0.03em", color: C.w100, margin: 0 }}>
            STRAIGHT ANSWERS<br /><span style={{ color: C.w55 }}>FOR SERIOUS BUYERS</span>
          </h2>
        </div>
      </Reveal>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 1, background: C.w06, borderRadius: 20, overflow: "hidden", border: `1px solid ${C.w06}` }}>
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 40}>
            <div style={{ background: C.bg }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: "100%", padding: "22px 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <span style={{ ...B, fontSize: 15, fontWeight: 500, color: C.w80 }}>{item.q}</span>
                <Plus size={16} color={open === i ? C.accent : C.w38} strokeWidth={1.5}
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)", transition: `transform 300ms ${spring}, color 200ms`, flexShrink: 0 }}
                />
              </button>
              <div style={{
                display: "grid",
                gridTemplateRows: open === i ? "1fr" : "0fr",
                transition: `grid-template-rows 400ms ${spring}`,
              }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ padding: "4px 28px 24px", borderTop: `1px solid ${C.w06}`, ...B, fontSize: 14, color: C.w42, lineHeight: 1.7 }}>
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.w06}`, padding: "48px 32px 32px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="r-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40, marginBottom: 48 }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/koham-logo.webp" alt="KOHAM" style={{ height: 22, width: "auto", objectFit: "contain", marginBottom: 14 }} />
            <div style={{ ...B, fontSize: 13, color: C.w38, lineHeight: 1.65, maxWidth: 260 }}>
              Professional robotic mowing technology. Available across the United States.
            </div>
          </div>
          <div className="r-ftlinks" style={{ display: "flex", gap: 56 }}>
            {([["PRODUCT",["Specs","Manual","Warranty","Support"]], ["COMPANY",["About","Contact","Privacy","Terms"]]] as [string, string[]][]).map(([title, links]) => (
              <div key={title}>
                <div style={{ ...M, fontSize: 9, color: C.w38, marginBottom: 16 }}>{title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {links.map(l => (
                    <a key={l} href="#" style={{ ...B, fontSize: 13, color: C.w55, textDecoration: "none", transition: "color 200ms" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.w100)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.w55)}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="r-ftbot" style={{ borderTop: `1px solid ${C.w06}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ ...M, fontSize: 9, color: C.w38 }}>© 2025 KOHAM. ALL RIGHTS RESERVED.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, ...M, fontSize: 9, color: C.w38 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
            FREE SHIPPING ACROSS THE USA
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <CountdownBar />
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Showcase />
      <BusinessOpp />
      <PriceSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
