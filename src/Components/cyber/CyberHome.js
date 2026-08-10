import React, {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Card } from "../Team";
import data from "../../database/data.json";
import CircuitBG from "./CircuitBG";
import Cursor, { Magnetic } from "./Cursor";
import ScrollHUD from "./ScrollHUD";
import BootSequence from "./BootSequence";
import "./CyberHome.css";

const Reactor = lazy(() => import("./Reactor"));

/* ------------------------------------------------------------------ */
/*  Small building blocks                                             */
/* ------------------------------------------------------------------ */

/* Character-by-character scramble reveal for the hero title */
function GlitchTitle({ text }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? text : text);
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}#01*+=_";
  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return undefined;
    }
    let frame = 0;
    const total = 46;
    const id = setInterval(() => {
      frame++;
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (frame > total * (i / text.length) + 8) return ch;
            return glyphs[Math.floor((frame * (i + 3)) % glyphs.length)];
          })
          .join("")
      );
      if (frame > total + 8) {
        setDisplay(text);
        clearInterval(id);
      }
    }, 45);
    return () => clearInterval(id);
  }, [text, reduce]);
  return (
    <h1 className="ch-title" data-text={text}>
      {display}
    </h1>
  );
}

/* Section heading with the reusable RGB-split glitch skin */
function GlitchH2({ text, plain, children }) {
  return (
    <h2 className="ch-h2 ch-glitch" data-text={plain || text}>
      {children || text}
    </h2>
  );
}

/* "drag / swipe" affordance for horizontally-scrollable card decks */
function DragCue() {
  return (
    <div className="ch-deck-cue" aria-hidden="true">
      <span className="ch-deck-cue-label">DRAG · SWIPE</span>
      <span className="ch-deck-arrows">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

/* Generic scroll reveal wrapper.
   `cut` upgrades it to a masked "slide-up". Static under reduced-motion. */
function Reveal({ children, delay = 0, y = 40, className = "", cut = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  if (cut) {
    return (
      <div ref={ref} className={`ch-cut ${className}`}>
        <motion.div
          initial={{ y: "115%" }}
          animate={inView ? { y: "0%" } : { y: "115%" }}
          transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const FINE_POINTER =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Card that tilts toward the cursor — inert on touch/coarse pointers */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  if (!FINE_POINTER) {
    return <div className={className}>{children}</div>;
  }
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({
      transform: `perspective(700px) rotateY(${px * 10}deg) rotateX(${
        -py * 10
      }deg) translateZ(6px)`,
      "--mx": `${(px + 0.5) * 100}%`,
      "--my": `${(py + 0.5) * 100}%`,
    });
  };
  const reset = () =>
    setStyle({ transform: "perspective(700px) rotateY(0) rotateX(0)" });
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
}

/* Full-viewport "chapter". With mandatory full-page snap each section is one
   screen, so the transition is a gentle dim + scale during the snap glide (no
   y-translate — that would fight the snap alignment). Static under reduced-motion. */
function ScrollSection({ children, className = "", id, stop = "always" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0.35, 1, 1, 0.35]);
  const scale = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0.975, 1, 1, 0.975]);
  if (reduce) {
    return (
      <section ref={ref} id={id} className={`ch-chapter ${className}`}>
        <div className="ch-chapter-inner">{children}</div>
      </section>
    );
  }
  return (
    <section
      ref={ref}
      id={id}
      className={`ch-chapter ${className}`}
      style={{ scrollSnapStop: stop }}
    >
      <motion.div className="ch-chapter-inner" style={{ opacity, scale }}>
        {children}
      </motion.div>
    </section>
  );
}

const pad = (n) => String(n).padStart(2, "0");

/* Live HUD corner readouts — isolated component so its per-second ticks
   re-render only these four labels, not the whole page. Pauses when hidden. */
function HeroHud({ reduce }) {
  const [uptime, setUptime] = useState(0);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setUptime((u) => u + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (reduce) return undefined;
    let raf;
    let last = performance.now();
    let frames = 0;
    let acc = 0;
    const loop = (now) => {
      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }
      frames++;
      acc += now - last;
      last = now;
      if (acc >= 500) {
        setFps(Math.min(120, Math.round((frames * 1000) / acc)));
        frames = 0;
        acc = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const upStr = `${pad(Math.floor(uptime / 60))}:${pad(uptime % 60)}`;
  return (
    <>
      <div className="ch-hud ch-hud-tl">SYS // ONLINE</div>
      <div className="ch-hud ch-hud-tr">IIT KANPUR · 26.5°N</div>
      <div className="ch-hud ch-hud-bl">UPTIME {upStr}</div>
      <div className="ch-hud ch-hud-br">{fps} FPS · NODES 12/12</div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const CAPABILITIES = [
  { code: "0x01", title: "Computer Vision", desc: "Teaching machines to see — object detection, tracking and real-time image processing on the edge." },
  { code: "0x02", title: "Signal Processing & ML", desc: "Turning raw signals and data into intelligence with DSP and machine learning." },
  { code: "0x03", title: "FPGA", desc: "Reconfigurable hardware and high-speed digital logic for serious parallel compute." },
  { code: "0x04", title: "Embedded & IoT", desc: "Microcontrollers, sensors and connected devices that bridge the physical and digital worlds." },
  { code: "0x05", title: "PCB", desc: "Designing, routing and fabricating custom circuit boards that actually ship." },
];

const DOMAINS = [
  { img: "project.jpg", title: "Projects", tag: "// SUMMER_BUILD", desc: "Every year the club runs projects during summer under the Science & Technology Council." },
  { img: "workshop.jpg", title: "Workshops", tag: "// HANDS_ON", desc: "Workshops across the year giving hands-on experience in a range of fields." },
  { img: "techkriti.jpg", title: "Techkriti", tag: "// TECH_FEST", desc: "The club powers the annual Technological & Entrepreneurial festival of IIT Kanpur." },
  { img: "takneek.jpg", title: "Takneek", tag: "// INTER_HALL", desc: "Every hall competes with one aim in mind — winning the coveted Takneek trophy." },
  { img: "wintercamp.png", title: "Winter Camp", tag: "// DEEP_DIVE", desc: "An immersive program blending hands-on workshops with lectures on electronics." },
  { img: "competitions/lam_onsite.jpeg", title: "Competitions", tag: "// GLOBAL", desc: "Won across International, National and Pan-IIT level competitions." },
];

const SECTIONS = [
  { id: "sec-hero", code: "00", label: "BOOT" },
  { id: "sec-recent", code: "01", label: "LIVE_FEED" },
  { id: "sec-domains", code: "02", label: "ACTIVITIES" },
  { id: "sec-cap", code: "03", label: "DOMAINS" },
  { id: "sec-team", code: "04", label: "HUMANS" },
  { id: "sec-about", code: "05", label: "WHO_WE_ARE" },
  { id: "sec-final", code: "06", label: "JOIN" },
];

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

const SHEET_ID = "1kjMgQEFPqU8fOqCGaBUk75AQ_4ZymVfo8AwQNh0KpO8";
const API_KEY = "AIzaSyB0KLQPuV6Ud6-d8e_dP-68ODNU_F2ULGA";
const RANGE = "Sheet1!A2:D";

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function CyberHome() {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [activities, setActivities] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [overclock, setOverclock] = useState(false);

  // first-load boot sequence (once per tab session)
  const [booted, setBooted] = useState(
    () =>
      typeof window === "undefined" ||
      sessionStorage.getItem("nb_booted") === "1"
  );

  // gate the heavy 3D reactor: only render frames while the hero is on-screen
  // AND the tab is visible (saves GPU/battery once you scroll past it)
  const [reactorActive, setReactorActive] = useState(true);

  // recent activities (Google Sheet) — guarded against set-after-unmount
  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`,
          { signal: ctrl.signal }
        );
        const d = await res.json();
        if (alive && d.values) {
          setActivities(
            d.values.map((r) => ({
              eventName: r[0],
              imageUrl: r[1],
              description: r[2],
              link: r[3],
            }))
          );
        }
      } catch (e) {
        /* silent — section simply stays empty */
      }
    })();
    return () => {
      alive = false;
      ctrl.abort();
    };
  }, []);

  // scope scroll-snap to the home route only (avoid leaking to other pages)
  useEffect(() => {
    document.documentElement.classList.add("home-snap");
    return () => document.documentElement.classList.remove("home-snap");
  }, []);

  // drive reactor on/off from hero visibility + tab visibility
  useEffect(() => {
    const hero = heroRef.current;
    let onScreen = true;
    const sync = () =>
      setReactorActive(onScreen && !document.hidden);
    const io =
      hero && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([e]) => {
              onScreen = e.isIntersecting;
              sync();
            },
            { threshold: 0.01 }
          )
        : null;
    if (io && hero) io.observe(hero);
    document.addEventListener("visibilitychange", sync);
    return () => {
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Konami → OVERCLOCK
  useEffect(() => {
    let idx = 0;
    let timer;
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = key === KONAMI[idx] ? idx + 1 : key === KONAMI[0] ? 1 : 0;
      if (idx === KONAMI.length) {
        idx = 0;
        setOverclock(true);
        document.documentElement.dataset.overclock = "on";
        clearTimeout(timer);
        timer = setTimeout(() => {
          setOverclock(false);
          delete document.documentElement.dataset.overclock;
        }, 5000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
      delete document.documentElement.dataset.overclock;
    };
  }, []);

  const finishBoot = () => {
    try {
      sessionStorage.setItem("nb_booted", "1");
    } catch (e) {
      /* ignore */
    }
    setBooted(true);
  };

  return (
    <>
      {!booted && <BootSequence onFinish={finishBoot} />}

      <div className="ch-root">
        <CircuitBG />
        <Cursor />
        <ScrollHUD sections={SECTIONS} />

        {overclock && (
          <div className="ch-overclock" aria-hidden="true">
            <span className="ch-overclock-toast">MODE // OVERCLOCK</span>
          </div>
        )}

        {/* ============================ HERO ============================ */}
        <section className="ch-hero" id="sec-hero" ref={heroRef}>
          <div className="ch-canvas" aria-hidden="true">
            {reduce ? (
              <div className="ch-canvas-fallback" />
            ) : (
              <Suspense fallback={<div className="ch-canvas-fallback" />}>
                <Reactor active={reactorActive} />
              </Suspense>
            )}
          </div>

          <div className="ch-grid-overlay" />
          <div className="ch-scanlines" />
          <div className="ch-vignette" />

          {/* live HUD corners (isolated so its ticks don't re-render the page) */}
          <HeroHud reduce={reduce} />

          <motion.div
            className="ch-hero-content"
            style={reduce ? undefined : { y: heroContentY, opacity: heroFade }}
          >
            <motion.p
              className="ch-eyebrow"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              &gt; INITIALIZING_ELECTRONICS_CLUB
            </motion.p>

            <GlitchTitle text="ELECTRONICS CLUB" />

            <motion.p
              className="ch-tagline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <span>INNOVATION</span>
              <span className="ch-dot">·</span>
              <span>IMAGINATION</span>
              <span className="ch-dot">·</span>
              <span>APPLICATION</span>
            </motion.p>

            <motion.div
              className="ch-cta-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.35 }}
            >
              <Magnetic>
                <Link to="/Projects" className="ch-btn ch-btn-primary">
                  <span>EXPLORE PROJECTS</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/Team" className="ch-btn ch-btn-ghost">
                  <span>MEET THE TEAM</span>
                </Link>
              </Magnetic>
            </motion.div>
          </motion.div>

          <motion.div
            className="ch-scroll-cue"
            style={reduce ? undefined : { opacity: heroFade }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <span>SCROLL</span>
            <div className="ch-scroll-track">
              <div className="ch-scroll-dot" />
            </div>
          </motion.div>

        </section>

        {/* ========================= RECENT ACTIVITIES ========================= */}
        {activities.length > 0 && (
          <ScrollSection className="ch-recent" id="sec-recent">
            <Reveal cut className="ch-section-head">
              <span className="ch-kicker">01_FEED · live feed</span>
              <GlitchH2 text="Recent Activities" />
            </Reveal>
            <div className="ch-deck">
              <div className="ch-hscroll ch-recent-scroll">
                {activities.map((a, i) => (
                  <TiltCard key={i} className="ch-recent-card">
                    <div className="ch-recent-media">
                      <img
                        className="ch-recent-img"
                        src={a.imageUrl}
                        alt={a.eventName || "Recent activity"}
                        loading="lazy"
                      />
                      <span className="ch-recent-scan" />
                      <span className="ch-corner ch-corner-tl" />
                    </div>
                    <div className="ch-recent-body">
                      <span className="ch-recent-tag">{'// EVENT_LOG'}</span>
                      <h3>{a.eventName}</h3>
                      <p>{a.description}</p>
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ch-recent-link"
                        >
                          VIEW MORE →
                        </a>
                      )}
                    </div>
                  </TiltCard>
                ))}
              </div>
              <DragCue />
            </div>
          </ScrollSection>
        )}

        {/* ========================= ACTIVITIES ========================= */}
        <ScrollSection className="ch-domains" id="sec-domains">
          <Reveal cut className="ch-section-head">
            <span className="ch-kicker">02_ACTIVITIES · what we do</span>
            <GlitchH2 text="Club Activities" />
          </Reveal>

          <div className="ch-deck">
            <div className="ch-hscroll ch-domain-scroll">
              {DOMAINS.map((d) => (
                <TiltCard key={d.title} className="ch-domain-card">
                  <div className="ch-domain-glow" />
                  <span className="ch-domain-sheen" />
                  <div
                    className="ch-domain-img"
                    style={{ backgroundImage: `url(/images/${d.img})` }}
                  />
                  <div className="ch-domain-body">
                    <span className="ch-domain-tag">{d.tag}</span>
                    <h3>{d.title}</h3>
                    <p>{d.desc}</p>
                  </div>
                  <span className="ch-corner ch-corner-tl" />
                  <span className="ch-corner ch-corner-br" />
                </TiltCard>
              ))}
            </div>
            <DragCue />
          </div>
        </ScrollSection>

        {/* ============================ DOMAINS ============================ */}
        <ScrollSection className="ch-cap" id="sec-cap">
          <Reveal cut className="ch-section-head">
            <span className="ch-kicker">03_DOMAINS · what we work on</span>
            <GlitchH2 text="Domains" />
          </Reveal>
          <div className="ch-deck">
            <div className="ch-hscroll ch-cap-scroll">
              {CAPABILITIES.map((c) => (
                <TiltCard key={c.code} className="ch-cap-card">
                  <span className="ch-corner ch-corner-tl" />
                  <span className="ch-corner ch-corner-br" />
                  <span className="ch-cap-code">{c.code}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <Link to="/Projects" className="ch-cap-link">
                    VIEW BUILDS →
                  </Link>
                </TiltCard>
              ))}
            </div>
            <DragCue />
          </div>
        </ScrollSection>

        {/* ============================ TEAM ============================ */}
        <ScrollSection className="ch-team" id="sec-team">
          <Reveal cut className="ch-section-head">
            <span className="ch-kicker">04_HUMANS · the people</span>
            <GlitchH2 text="Meet the Coordinators" />
          </Reveal>
          <Reveal delay={0.1}>
            <Card title="" items={data.coordi} />
          </Reveal>
          <Reveal className="ch-center" delay={0.15}>
            <Magnetic>
              <Link to="/Team" className="ch-btn ch-btn-primary">
                <span>KNOW OUR FULL TEAM</span>
              </Link>
            </Magnetic>
          </Reveal>
        </ScrollSection>

        {/* ============================ ABOUT ============================ */}
        <ScrollSection className="ch-about" id="sec-about">
          <Reveal cut className="ch-section-head">
            <span className="ch-kicker">05_WHO · who we are</span>
            <GlitchH2 plain="Turning ideas into reality">
              Turning <span className="ch-hl">ideas</span> into{" "}
              <span className="ch-hl">reality</span>
            </GlitchH2>
          </Reveal>

          <div className="ch-about-grid">
            <Reveal className="ch-about-panel" delay={0.05}>
              <p>
                Electronics Club, earlier started as a hobby group, has now
                expanded into a students' organisation with the objective of
                inculcating a spirit of developing innovative, cutting-edge
                technology solutions to real-life problems.
              </p>
              <p className="ch-lime">
                We provide a platform where any individual with an idea can
                approach the club freely to grasp the technical skills required
                to turn that idea into a reality.
              </p>

              {showMore && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  <h4 className="ch-sub">What We Provide</h4>
                  <p>
                    A place where students think outside the academic curriculum
                    and get practical experience by applying concepts from
                    theoretical courses — through lectures, workshops, projects
                    and competitions across analog and digital electronics.
                  </p>
                  <h4 className="ch-sub">About Our Projects</h4>
                  <p>
                    Our summer projects are a stepping stone for many freshers,
                    spanning embedded systems &amp; IoT, VLSI, signal processing,
                    ML and AI. We have taken up industrial projects from
                    organisations like DRDO, BARC, BARC INDIA and BETIC.
                  </p>
                  <Link to="/Projects" className="ch-btn ch-btn-primary ch-inline">
                    <span>LEARN MORE</span>
                  </Link>
                </motion.div>
              )}

              <button
                className="ch-readmore"
                onClick={() => setShowMore((v) => !v)}
              >
                {showMore ? "− READ LESS" : "+ READ MORE"}
              </button>
            </Reveal>

            <Reveal className="ch-about-side" delay={0.15}>
              <div className="ch-terminal">
                <div className="ch-term-bar">
                  <i /> <i /> <i /> <span>eclub@iitk: ~</span>
                </div>
                <pre>
{`$ ./club --status
> domains ......... [ 6 active ]
> mode ............ INNOVATE
> workshops ....... RUNNING
> projects ........ DEPLOYED
> mission ......... "build the future"

_ ready for input`}
                </pre>
              </div>
            </Reveal>
          </div>
        </ScrollSection>

        {/* ============================ FINAL CTA ============================ */}
        <ScrollSection className="ch-final" id="sec-final">
          <div className="ch-final-grid" />
          <Reveal>
            <h2 className="ch-final-title">
              <span className="ch-glitch" data-text="READY TO BUILD">
                READY TO BUILD
              </span>
              <span className="ch-glitch" data-text="THE FUTURE?">
                THE <span className="ch-hl">FUTURE?</span>
              </span>
            </h2>
            <p className="ch-final-sub">
              Bring an idea. Leave with the skills to build it.
            </p>
            <div className="ch-cta-row ch-center">
              <Magnetic>
                <Link to="/Comp" className="ch-btn ch-btn-primary">
                  <span>GET COMPONENTS</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/Sandbox" className="ch-btn ch-btn-ghost">
                  <span>OPEN SANDBOX</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/Challenge" className="ch-btn ch-btn-ghost">
                  <span>MONTHLY CHALLENGE</span>
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </ScrollSection>
      </div>
    </>
  );
}
