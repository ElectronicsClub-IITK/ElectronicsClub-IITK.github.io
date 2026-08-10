import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/Projects", label: "Projects" },
  { to: "/Database", label: "Database" },
  { to: "/Articles", label: "Articles" },
  { to: "/Team", label: "Team" },
  { to: "/Comp", label: "Components" },
  { to: "/Sandbox", label: "Sandbox" },
  { to: "/Challenge", label: "Challenge" },
  { to: "/Leaderboard", label: "Leaderboard" },
  { to: "/Gallery", label: "Gallery" },
];

/* EClub mark — the dark-theme variant (lime E + white C) with a
   transparent background; /logo.png is the IITK seal, kept for other uses */
const LOGO = `${process.env.PUBLIC_URL || ""}/eclub.png`;

// first path segment of a route ("/Projects" -> "projects", "/" -> "")
const segOf = (path) => path.toLowerCase().split("/")[1] || "";

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const burgerRef = useRef(null);
  const firstOverlayLinkRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollYRef = useRef(0);

  // close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  // solidify the bar once the user scrolls off the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock page scroll while the fullscreen menu is open (position:fixed technique
  // so the scroll position is preserved and the body can't scroll behind it)
  useEffect(() => {
    const { body } = document;
    if (open) {
      scrollYRef.current = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "contain";
      return () => {
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.overflow = "";
        body.style.overscrollBehavior = "";
        window.scrollTo(0, scrollYRef.current);
      };
    }
    return undefined;
  }, [open]);

  // Escape-to-close for the overlay
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // focus trap: keep Tab / Shift+Tab cycling within the overlay's links so
  // focus can't slip into the visually-covered page behind it
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const focusables = overlay.querySelectorAll("a[href]");
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // move focus into the overlay on open, return it to the burger on close
  const prevOpen = useRef(open);
  useEffect(() => {
    if (open && !prevOpen.current) {
      firstOverlayLinkRef.current?.focus();
    } else if (!open && prevOpen.current) {
      burgerRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // '/' active only on exact root; everything else by first path segment
  const isActive = (to) => segOf(pathname) === segOf(to);

  return (
    <>
      <nav className={`nvx ${scrolled ? "nvx--scrolled" : ""} ${open ? "nvx--open" : ""}`}>
        <span className="nvx__scan" aria-hidden="true" />

        <Link
          to="/"
          className="nvx__brand"
          aria-label="Electronics Club — Home"
          tabIndex={open ? -1 : undefined}
        >
          <img src={LOGO} alt="" className="nvx__logo" width={38} height={38} />
          <span className="nvx__word">
            ELECTRONICS<b>CLUB</b>
          </span>
        </Link>

        <ul className="nvx__links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`nvx__link ${isActive(l.to) ? "is-active" : ""}`}
                aria-current={isActive(l.to) ? "page" : undefined}
                tabIndex={open ? -1 : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          ref={burgerRef}
          className={`nvx__burger ${open ? "is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nvx-overlay"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* fullscreen mobile menu */}
      <div
        id="nvx-overlay"
        ref={overlayRef}
        className={`nvx__overlay ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="nvx__overlay-grid" aria-hidden="true" />
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.to} style={{ transitionDelay: `${0.06 + i * 0.04}s` }}>
              <Link
                ref={i === 0 ? firstOverlayLinkRef : undefined}
                to={l.to}
                className={isActive(l.to) ? "is-active" : ""}
                aria-current={isActive(l.to) ? "page" : undefined}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
              >
                <em className="nvx__idx">{String(i + 1).padStart(2, "0")}</em>
                <span>{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="nvx__overlay-foot">EST · IIT KANPUR · INNOVATION IMAGINATION APPLICATION</p>
      </div>
    </>
  );
};

export default Navbar;
