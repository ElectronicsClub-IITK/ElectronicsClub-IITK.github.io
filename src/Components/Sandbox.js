import React, { useMemo, useState } from "react";
import "./Sandbox.css";

/**
 * Club demos — swap `projectId` for Electronics Club–owned Wokwi projects anytime.
 * Use the full editor URL (not /embed) so students get parts, wiring, and code.
 */
const DEMOS = [
  {
    id: "blank",
    label: "Blank Arduino",
    blurb: "Empty Uno — build anything",
    src: "https://wokwi.com/projects/new",
  },
  {
    id: "esp32",
    label: "Blank ESP32",
    blurb: "Start from an ESP32 DevKit",
    src: "https://wokwi.com/arduino/new?template=esp32",
  },
  {
    id: "blink",
    label: "LED Blink",
    blurb: "Classic Arduino blink",
    src: "https://wokwi.com/projects/344891652101374548",
  },
  {
    id: "esp32-blink",
    label: "ESP32 Blink",
    blurb: "Onboard LED on ESP32",
    src: "https://wokwi.com/projects/385344634773441537",
  },
];

const IFRAME_ALLOW =
  "accelerometer; camera; clipboard-read; clipboard-write; encrypted-media; gyroscope; microphone; serial; usb; fullscreen";

const Sandbox = () => {
  const [activeId, setActiveId] = useState(DEMOS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const active = useMemo(
    () => DEMOS.find((d) => d.id === activeId) || DEMOS[0],
    [activeId]
  );

  return (
    <div className={`sbx ${sidebarOpen ? "" : "sbx--collapsed"}`}>
      <aside id="sbx-rail" className="sbx__rail" aria-label="Sandbox demos">
        <div className="sbx__rail-head">
          <p className="sbx__eyebrow">&gt; SANDBOX // WOKWI</p>
          <h1 className="sbx__title">Electronics Sandbox</h1>
          <p className="sbx__lede">
            Full Wokwi simulator in-page. Open a demo or start blank and wire
            whatever you want.
          </p>
        </div>

        <div className="sbx__actions">
          <button
            type="button"
            className="sbx__primary"
            onClick={() => setActiveId("blank")}
          >
            New blank project
          </button>
        </div>

        <p className="sbx__section-label">Demo projects</p>
        <ul className="sbx__demos">
          {DEMOS.map((demo) => (
            <li key={demo.id}>
              <button
                type="button"
                className={`sbx__demo ${activeId === demo.id ? "is-active" : ""}`}
                onClick={() => setActiveId(demo.id)}
                aria-pressed={activeId === demo.id}
              >
                <span className="sbx__demo-label">{demo.label}</span>
                <span className="sbx__demo-blurb">{demo.blurb}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="sbx__hint">
          Tip: sign in on Wokwi inside the panel to save your own work. Club
          demos are listed above.  </p>
      </aside>

      <div className="sbx__stage">
        <header className="sbx__bar">
          <button
            type="button"
            className="sbx__toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-expanded={sidebarOpen}
            aria-controls="sbx-rail"
          >
            {sidebarOpen ? "Hide demos" : "Show demos"}
          </button>
          <div className="sbx__status">
            <span className="sbx__dot" aria-hidden="true" />
            <span>{active.label}</span>
          </div>
          <a
            className="sbx__external"
            href={active.src}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in new tab
          </a>
        </header>

        <div className="sbx__frame-wrap">
          <iframe
            key={active.src}
            className="sbx__frame"
            title={`Wokwi — ${active.label}`}
            src={active.src}
            allow={IFRAME_ALLOW}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
