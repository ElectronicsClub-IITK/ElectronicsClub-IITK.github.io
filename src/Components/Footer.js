import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const bootSets = [
  [
    "initializing electronics core...",
    "loading circuit database...",
    "compiling project modules...",
    "optimizing signal flow...",
    "status: READY"
  ],
  [
    "booting EClub kernel...",
    "detecting hardware interfaces...",
    "mapping PCB layers...",
    "synchronizing nodes...",
    "status: ONLINE"
  ],
  [
    "starting innovation engine...",
    "loading FPGA logic...",
    "initializing sensors...",
    "calibrating systems...",
    "status: ACTIVE"
  ]
];

const systemBrain = {
  help: "Available commands: help, status, projects, stats, clear",
  status: "All systems operational ✔ Neural link stable",
  projects: "Fetching Electronics Club project database...",
  stats: "CPU: 34% | RAM: 61% | Nodes: 12 online | Signal: stable",
};

// media query helper — SSR-safe, returns false when matchMedia is unavailable
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Footer = () => {
  const footerRef = useRef(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const [visible, setVisible] = useState(false);

  const [bootIndex] = useState(() =>
    Math.floor(Math.random() * bootSets.length)
  );

  const lines = bootSets[bootIndex];

  const [output, setOutput] = useState([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [cmd, setCmd] = useState("");
  const [cmdOutput, setCmdOutput] = useState([]);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // auto scroll terminal — single unified effect using ref
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, cmdOutput]);

  // typing engine — gated by reduced-motion.
  // If the user prefers reduced motion, skip the char-by-char animation
  // and render the completed boot lines immediately (the CSS reduced-motion
  // block can't stop a JS timer, so we short-circuit it here).
  useEffect(() => {
    if (!visible) return;

    if (prefersReducedMotion()) {
      // show all boot lines at once, mark typing complete
      setOutput(lines.slice());
      setLineIndex(lines.length);
      setCharIndex(0);
      return;
    }

    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];

    const timer = setTimeout(() => {
      setOutput((prev) => {
        const copy = [...prev];
        if (!copy[lineIndex]) copy[lineIndex] = "";
        copy[lineIndex] += line[charIndex];
        return copy;
      });

      setCharIndex((prev) => {
        const next = prev + 1;
        if (next === line.length) {
          setLineIndex((l) => l + 1);
          return 0;
        }
        return next;
      });
    }, 28);

    return () => clearTimeout(timer);
  }, [visible, lineIndex, charIndex, lines]);

  // command engine
  const handleCommand = (e) => {
    if (e.key !== "Enter") return;

    const trimmed = cmd.trim();
    if (!trimmed) return;

    const input = trimmed.toLowerCase();

    // save to history and reset index
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // handle clear separately
    if (input === "clear") {
      setCmdOutput([]);
      setCmd("");
      return;
    }

    const response = systemBrain[input];

    if (response) {
      // store command echo and response as plain strings — JSX adds no extra ">"
      setCmdOutput((prev) => [...prev, `> ${trimmed}`, response]);
      setCmd("");
      return;
    }

    setCmdOutput((prev) => [...prev, `> ${trimmed}`, "AI processing request..."]);
    setCmd("");

    setTimeout(() => {
      setCmdOutput((prev) => [
        ...prev,
        `AI: command "${input}" not found. Try 'help'.`
      ]);
    }, 400);
  };

  // history navigation (↑ ↓)
  const handleKeyNav = (e) => {
    if (history.length === 0) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      // clamp to 0 so we never go below the oldest entry
      const idx = historyIndex < 0
        ? history.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setCmd(history[idx]);
    }

    if (e.key === "ArrowDown") {
      if (historyIndex < 0) return;

      if (historyIndex >= history.length - 1) {
        setHistoryIndex(-1);
        setCmd("");
        return;
      }

      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setCmd(history[idx]);
    }
  };

  // clicking anywhere in the terminal body focuses the command input
  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const socialLinks = [
    {
      icon: "fa-facebook-f",
      href: "https://www.facebook.com/electronicsclubiitk",
      label: "Facebook"
    },
    {
      icon: "fa-instagram",
      href: "https://www.instagram.com/electronicsclub.iitk/",
      label: "Instagram"
    },
    {
      icon: "fa-linkedin",
      href: "https://www.linkedin.com/company/electronics-club-iit-kanpur/",
      label: "LinkedIn"
    },
    {
      icon: "fa-github",
      href: "https://github.com/ElectronicsClub-IITK",
      label: "GitHub"
    },
  ];

  return (
    <footer ref={footerRef} className={`footer-cyber ${visible ? "show" : ""}`}>

      <div className="footer-grid-overlay" />
      <div className="neon-core" />

      {/* SOCIAL */}
      <div className="social-dock">
        {socialLinks.map(({ icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={`fa ${icon}`} aria-hidden="true" />
          </a>
        ))}
      </div>

      {/* TERMINAL + LINKS + CONTACT */}
      <section className="footer-main">

        <div className="footer-card terminal">

          <div className="terminal-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-title">eclub@iitk:~$</span>
          </div>

          <div
            className="terminal-body"
            ref={terminalRef}
            onClick={focusInput}
            role="log"
            aria-live="polite"
          >

            <div aria-hidden="true">
              {output.map((line, i) => (
                <p key={`boot-${i}`} className="glitch-text">&gt; {line}</p>
              ))}
            </div>

            {/* cmdOutput lines already carry their own ">" prefix for commands;
                response lines are plain text — render without adding another ">" */}
            {cmdOutput.map((line, i) => (
              <p key={`cmd-${i}`}>{line}</p>
            ))}

            <div className="input-line">
              <span>&gt;&nbsp;</span>
              <input
                ref={inputRef}
                value={cmd}
                aria-label="Terminal command input"
                onChange={(e) => setCmd(e.target.value)}
                onKeyDown={(e) => {
                  handleCommand(e);
                  handleKeyNav(e);
                }}
                placeholder="type 'help'"
                spellCheck={false}
                autoComplete="off"
              />
            </div>

          </div>
        </div>

        {/* LINKS */}
        <div className="footer-card">
          <h4>Explore</h4>
          <Link to="/Projects">Projects</Link>
          <Link to="/Database">Database</Link>
          <Link to="/Articles">Articles</Link>
          <Link to="/Team">Team</Link>
          <Link to="/Comp">Components</Link>
          <Link to="/Sandbox">Sandbox</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-card">
          <h4>Contact</h4>
          <a
            href="https://maps.google.com/?q=Hall+3+IIT+Kanpur"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hall 3, IIT Kanpur
          </a>
          <a href="mailto:eclub.iitk@gmail.com">eclub.iitk@gmail.com</a>
          <a
            href="https://www.instagram.com/electronicsclub.iitk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>

      </section>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Electronics Club, IIT Kanpur
      </div>

    </footer>
  );
};

export default Footer;
